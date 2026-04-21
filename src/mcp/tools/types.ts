import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { BizneoHRApi } from '../../api/index.js';

export interface McpTool {
  definition: Tool;
  handler: (args: Record<string, unknown>, api: BizneoHRApi) => Promise<unknown>;
}
