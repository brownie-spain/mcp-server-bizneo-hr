import { BizneoHRApi } from './api/index.js';
import { startStdioServer } from './mcp/server.js';

async function main(): Promise<void> {
  const api = new BizneoHRApi();
  await startStdioServer(api);
}

main().catch((error) => {
  process.stderr.write(`Fatal error: ${String(error)}\n`);
  process.exit(1);
});
