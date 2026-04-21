import type { McpTool } from './types.js';

export const customFieldTools: McpTool[] = [
  {
    definition: {
      name: 'bizneo_list_custom_fields',
      description: 'List custom field definitions',
      inputSchema: {
        type: 'object',
        properties: {
          entity: { type: 'string', description: 'Filter by entity type (e.g. user)' },
        },
      },
    },
    handler: async (args, api) =>
      api.customFields.list(args as { entity?: string }),
  },
];
