import type { McpTool } from './types.js';

export const projectTools: McpTool[] = [
  {
    definition: {
      name: 'bizneo_list_projects',
      description: 'List projects',
      inputSchema: {
        type: 'object',
        properties: {
          page_number: { type: 'number' },
          page_size: { type: 'number' },
          active: { type: 'boolean', description: 'Filter by active status' },
        },
      },
    },
    handler: async (args, api) => api.projects.list(args as Parameters<typeof api.projects.list>[0]),
  },
  {
    definition: {
      name: 'bizneo_create_project',
      description: 'Create a new project',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          code: { type: 'string', description: 'Project code' },
          active: { type: 'boolean' },
        },
        required: ['name'],
      },
    },
    handler: async (args, api) =>
      api.projects.create(args as Parameters<typeof api.projects.create>[0]),
  },
  {
    definition: {
      name: 'bizneo_update_project',
      description: 'Update a project',
      inputSchema: {
        type: 'object',
        properties: {
          project_id: { type: 'number' },
          name: { type: 'string' },
          code: { type: 'string' },
          active: { type: 'boolean' },
        },
        required: ['project_id'],
      },
    },
    handler: async (args, api) => {
      const { project_id, ...payload } = args;
      return api.projects.update(project_id as number, payload as Parameters<typeof api.projects.update>[1]);
    },
  },
  {
    definition: {
      name: 'bizneo_assign_user_to_project',
      description: 'Assign a user to a project',
      inputSchema: {
        type: 'object',
        properties: {
          project_id: { type: 'number' },
          user_id: { type: 'number' },
        },
        required: ['project_id', 'user_id'],
      },
    },
    handler: async (args, api) =>
      api.projects.assignUser(args.project_id as number, args.user_id as number),
  },
  {
    definition: {
      name: 'bizneo_unassign_user_from_project',
      description: 'Remove a user from a project',
      inputSchema: {
        type: 'object',
        properties: {
          project_id: { type: 'number' },
          user_id: { type: 'number' },
        },
        required: ['project_id', 'user_id'],
      },
    },
    handler: async (args, api) =>
      api.projects.unassignUser(args.project_id as number, args.user_id as number),
  },
];
