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
│   ├── server.ts           # MCP server (stdio transport)
│   └── tools/              # Tool definitions + handlers per domain
└── index.ts
tests/                      # Vitest unit tests (52 tests)
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

## Use with Claude Desktop / Claude Code

Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "bizneo-hr": {
      "command": "node",
      "args": ["/path/to/mcp-server-bizneo-hr/dist/index.js"],
      "env": {
        "BIZNEO_API_TOKEN": "your_token_here"
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
