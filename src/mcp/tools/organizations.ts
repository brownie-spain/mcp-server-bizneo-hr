import type { McpTool } from './types.js';

export const organizationTools: McpTool[] = [
  {
    definition: {
      name: 'bizneo_list_organizations',
      description: 'List organizational units',
      inputSchema: {
        type: 'object',
        properties: {
          page_number: { type: 'number' },
          page_size: { type: 'number' },
        },
      },
    },
    handler: async (args, api) => api.organizations.list(args as { page_number?: number; page_size?: number }),
  },
  {
    definition: {
      name: 'bizneo_get_organization',
      description: 'Get a specific organizational unit',
      inputSchema: {
        type: 'object',
        properties: {
          organization_id: { type: 'number' },
        },
        required: ['organization_id'],
      },
    },
    handler: async (args, api) => api.organizations.get(args.organization_id as number),
  },
  {
    definition: {
      name: 'bizneo_create_organization',
      description: 'Create a new organizational unit',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          kind: { type: 'string', description: 'Organization type (department, team, etc.)' },
          parent_id: { type: 'number', description: 'Parent organization ID' },
        },
        required: ['name'],
      },
    },
    handler: async (args, api) =>
      api.organizations.create(args as Parameters<typeof api.organizations.create>[0]),
  },
  {
    definition: {
      name: 'bizneo_update_organization',
      description: 'Update an organizational unit',
      inputSchema: {
        type: 'object',
        properties: {
          organization_id: { type: 'number' },
          name: { type: 'string' },
          kind: { type: 'string' },
          parent_id: { type: 'number' },
        },
        required: ['organization_id'],
      },
    },
    handler: async (args, api) => {
      const { organization_id, ...payload } = args;
      return api.organizations.update(organization_id as number, payload);
    },
  },
  {
    definition: {
      name: 'bizneo_delete_organization',
      description: 'Delete an organizational unit',
      inputSchema: {
        type: 'object',
        properties: {
          organization_id: { type: 'number' },
        },
        required: ['organization_id'],
      },
    },
    handler: async (args, api) => api.organizations.delete(args.organization_id as number),
  },
  {
    definition: {
      name: 'bizneo_list_organization_position_descriptions',
      description: 'List position descriptions for an organization',
      inputSchema: {
        type: 'object',
        properties: {
          organization_id: { type: 'number' },
        },
        required: ['organization_id'],
      },
    },
    handler: async (args, api) =>
      api.organizations.listPositionDescriptions(args.organization_id as number),
  },
];
