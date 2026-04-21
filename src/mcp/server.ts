import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { BizneoHRApi, BizneoApiError } from '../api/index.js';
import { allTools, toolMap } from './tools/index.js';

export function createMcpServer(api: BizneoHRApi): Server {
  const server = new Server(
    {
      name: 'bizneo-hr',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: allTools.map((t) => t.definition),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args = {} } = request.params;

    const tool = toolMap.get(name);
    if (!tool) {
      throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }

    try {
      const result = await tool.handler(args as Record<string, unknown>, api);
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(result ?? { success: true }, null, 2),
          },
        ],
      };
    } catch (error) {
      if (error instanceof BizneoApiError) {
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(
                {
                  error: error.message,
                  status: error.status,
                  details: error.errors,
                },
                null,
                2,
              ),
            },
          ],
          isError: true,
        };
      }

      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: 'text' as const, text: `Unexpected error: ${message}` }],
        isError: true,
      };
    }
  });

  return server;
}

export async function startStdioServer(api: BizneoHRApi): Promise<void> {
  const server = createMcpServer(api);
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
