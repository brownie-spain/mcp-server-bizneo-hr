import type { McpTool } from './types.js';

export const goalTools: McpTool[] = [
  {
    definition: {
      name: 'bizneo_list_goals',
      description: 'List goals',
      inputSchema: {
        type: 'object',
        properties: {
          page_number: { type: 'number' },
          page_size: { type: 'number' },
          user_id: { type: 'number', description: 'Filter by user ID' },
        },
      },
    },
    handler: async (args, api) => api.goals.list(args as Parameters<typeof api.goals.list>[0]),
  },
  {
    definition: {
      name: 'bizneo_create_goal',
      description: 'Create a new goal',
      inputSchema: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          user_id: { type: 'number' },
        },
        required: ['title'],
      },
    },
    handler: async (args, api) =>
      api.goals.create(args as Parameters<typeof api.goals.create>[0]),
  },
  {
    definition: {
      name: 'bizneo_update_goal_achievement',
      description: 'Update the achievement percentage of a goal',
      inputSchema: {
        type: 'object',
        properties: {
          goal_id: { type: 'number' },
          achievement: { type: 'number', description: 'Achievement percentage (0-100)' },
        },
        required: ['goal_id', 'achievement'],
      },
    },
    handler: async (args, api) =>
      api.goals.updateAchievement(args.goal_id as number, args.achievement as number),
  },
];
