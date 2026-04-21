# mcp-server-bizneo-hr

MCP Server for the [Bizneo HR](https://connect.bizneo.com/hcm/v1/) API. Exposes **+60 tools** covering all major Bizneo HR modules so any MCP-compatible client (Claude Desktop, Claude Code, etc.) can interact with Bizneo HR directly.

## Architecture

```
src/
├── config/                 # Zod-validated env config
├── api/
│   ├── client.ts           # Axios client with API-key auth + Bottleneck rate limiting
│   ├── types.ts            # Shared TypeScript types
│   └── resources/          # One module per Bizneo API domain
│       ├── users.ts
│       ├── absences.ts
│       ├── time-attendance.ts
│       ├── organizations.ts
│       ├── expenses.ts
│       ├── roles.ts
│       ├── custom-fields.ts
│       ├── projects.ts
│       ├── goals.ts
│       ├── payrolls.ts
│       └── learning.ts
├── mcp/
│   ├── server.ts           # MCP server factory (shared by both transports)
│   └── tools/              # Tool definitions + handlers per domain
├── transport/
│   └── http.ts             # HTTP/Streamable transport (for remote agents & OpenAI)
└── index.ts                # Entry point: routes to stdio or http based on MCP_TRANSPORT
tests/                      # Vitest unit tests (53 tests)
docker/Dockerfile           # Multi-stage build
docker-compose.yml
```

## Available Tools

| Domain | Tools |
|--------|-------|
| **Users** | list, get, create, update, terminate, send-invite, documents, taxons, work-contracts, salaries |
| **Absences** | list, kinds, work-calendars, agreements, user absences, absence summary, adjustments |
| **Time Attendance** | logged-times, schedules, timeline, chronometers (user & bulk), overtime, compensation report |
| **Organizations** | CRUD + position descriptions + org charts |
| **Expenses** | CRUD + expense kinds CRUD |
| **Roles** | list, add/remove users |
| **Custom Fields** | list |
| **Projects** | list, create, update, assign/unassign users |
| **Goals** | list, create, update achievement |
| **Payrolls** | concepts CRUD, one-time events CRUD, periodic events |
| **Learning** | courses CRUD, training actions CRUD, requisitions |

## Setup

### 1. Environment variables

```bash
cp .env.example .env
# Edit .env with your Bizneo API token
```

Required variables:

| Variable | Description |
|----------|-------------|
| `BIZNEO_API_TOKEN` | Your Bizneo HR API token |
| `BIZNEO_API_BASE_URL` | API base URL (default: `https://connect.bizneo.com/hcm`) |
| `BIZNEO_RATE_LIMIT_RPS` | Max requests per second (default: `10`) |
| `BIZNEO_RATE_LIMIT_CONCURRENT` | Max concurrent requests (default: `5`) |
| `MCP_TRANSPORT` | `http` (default for Docker) or `stdio` (local clients) |
| `MCP_PORT` | HTTP listen port (default: `3000`) |
| `MCP_HOST` | HTTP bind host (default: `0.0.0.0`) |
| `MCP_CORS_ORIGINS` | Allowed CORS origins (default: `*`) |

### 2. Local development

```bash
npm install
npm run dev        # watch mode with tsx
npm run build      # compile TypeScript
npm start          # run compiled output
```

### 3. Testing

```bash
npm test                # run all tests
npm run test:coverage   # with coverage report
npm run test:watch      # watch mode
```

### 4. Docker

```bash
# Build and run
docker compose up --build

# Or build manually
docker build -f docker/Dockerfile -t mcp-bizneo-hr .
docker run --env-file .env mcp-bizneo-hr
```

## Use with OpenAI Agents (HTTP transport)

The server implements the **MCP Streamable HTTP transport** — the standard remote MCP protocol used by OpenAI's Responses API and Agents SDK.

### Deploy

```bash
# Start the HTTP server (default: http://0.0.0.0:3000/mcp)
MCP_TRANSPORT=http MCP_PORT=3000 BIZNEO_API_TOKEN=xxx node dist/index.js

# Or with Docker Compose
docker compose up --build
```

### Connect from OpenAI Responses API

```python
from openai import OpenAI

client = OpenAI()
response = client.responses.create(
    model="gpt-4o",
    tools=[{
        "type": "mcp",
        "server_label": "bizneo-hr",
        "server_url": "http://your-server:3000/mcp",
        # Add auth header if you front the server with an API gateway:
        # "headers": {"Authorization": "Bearer your-gateway-token"}
    }],
    input="List all active employees in the company",
)
```

### Connect from OpenAI Agents SDK (Python)

```python
from agents import Agent, Runner
from agents.mcp import MCPServerStreamableHttp

async with MCPServerStreamableHttp(
    name="bizneo-hr",
    params={"url": "http://your-server:3000/mcp"},
) as mcp_server:
    agent = Agent(
        name="HR Agent",
        instructions="You help with HR tasks using Bizneo HR.",
        mcp_servers=[mcp_server],
    )
    result = await Runner.run(agent, "Show me employees who joined this month")
```

### Health check endpoint

```bash
curl http://your-server:3000/health
# {"status":"ok","transport":"http","activeSessions":0,"uptime":42.1}
```

## Use with Claude Desktop / Claude Code (stdio transport)

Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "bizneo-hr": {
      "command": "node",
      "args": ["/path/to/mcp-server-bizneo-hr/dist/index.js"],
      "env": {
        "BIZNEO_API_TOKEN": "your_token_here",
        "MCP_TRANSPORT": "stdio"
      }
    }
  }
}
```

## Rate Limiting

The Bottleneck library enforces rate limits transparently:
- Requests are queued and released at the configured RPS (`BIZNEO_RATE_LIMIT_RPS`)
- Concurrent requests are capped by `BIZNEO_RATE_LIMIT_CONCURRENT`
- No manual retry logic needed — the limiter schedules automatically

## Error Handling

API errors from Bizneo are caught and returned as structured MCP error responses:

```json
{
  "error": "Validation failed",
  "status": 422,
  "details": { "email": ["is already taken"] }
}
```
