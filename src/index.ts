import { BizneoHRApi } from './api/index.js';
import { config } from './config/index.js';
import { startStdioServer } from './mcp/server.js';
import { startHttpServer } from './transport/http.js';

async function main(): Promise<void> {
  const api = new BizneoHRApi();

  if (config.MCP_TRANSPORT === 'http') {
    await startHttpServer(api, config.MCP_PORT, config.MCP_HOST);
  } else {
    await startStdioServer(api);
  }
}

main().catch((error) => {
  process.stderr.write(`Fatal error: ${String(error)}\n`);
  process.exit(1);
});
