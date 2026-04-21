import type { McpTool } from './types.js';

export const roleTools: McpTool[] = [
  {
    definition: {
      name: 'bizneo_list_roles',
      description: 'List available roles in Bizneo HR',
      inputSchema: {
        type: 'object',
        properties: {
          page_number: { type: 'number' },
          page_size: { type: 'number' },
        },
      },
    },
    handler: async (args, api) => api.roles.list(args as { page_number?: number; page_size?: number }),
  },
  {
    definition: {
      name: 'bizneo_add_user_to_role',
      description: 'Assign a user to a role',
      inputSchema: {
        type: 'object',
        properties: {
          role_id: { type: 'number' },
          user_id: { type: 'number' },
        },
        required: ['role_id', 'user_id'],
      },
    },
    handler: async (args, api) =>
      api.roles.addUser(args.role_id as number, args.user_id as number),
  },
  {
    definition: {
      name: 'bizneo_remove_user_from_role',
      description: 'Remove a user from a role',
      inputSchema: {
        type: 'object',
        properties: {
          role_id: { type: 'number' },
          user_id: { type: 'number' },
        },
        required: ['role_id', 'user_id'],
      },
    },
    handler: async (args, api) =>
      api.roles.removeUser(args.role_id as number, args.user_id as number),
  },
];
