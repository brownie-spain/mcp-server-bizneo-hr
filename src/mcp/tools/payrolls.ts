import type { McpTool } from './types.js';

export const payrollTools: McpTool[] = [
  {
    definition: {
      name: 'bizneo_list_payroll_concepts',
      description: 'List payroll concepts/items',
      inputSchema: {
        type: 'object',
        properties: {
          page_number: { type: 'number' },
          page_size: { type: 'number' },
        },
      },
    },
    handler: async (args, api) => api.payrolls.listConcepts(args as { page_number?: number; page_size?: number }),
  },
  {
    definition: {
      name: 'bizneo_create_payroll_concept',
      description: 'Create a new payroll concept',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          code: { type: 'string' },
        },
        required: ['name'],
      },
    },
    handler: async (args, api) =>
      api.payrolls.createConcept(args as { name: string; code?: string }),
  },
  {
    definition: {
      name: 'bizneo_delete_payroll_concept',
      description: 'Delete a payroll concept',
      inputSchema: {
        type: 'object',
        properties: {
          concept_id: { type: 'number' },
        },
        required: ['concept_id'],
      },
    },
    handler: async (args, api) => api.payrolls.deleteConcept(args.concept_id as number),
  },
  {
    definition: {
      name: 'bizneo_list_one_time_events',
      description: 'List one-time payroll events',
      inputSchema: {
        type: 'object',
        properties: {
          page_number: { type: 'number' },
          page_size: { type: 'number' },
          user_id: { type: 'number' },
          start_date: { type: 'string', description: 'Filter from date (YYYY-MM-DD)' },
          end_date: { type: 'string', description: 'Filter to date (YYYY-MM-DD)' },
        },
      },
    },
    handler: async (args, api) => api.payrolls.listOneTimeEvents(args as Parameters<typeof api.payrolls.listOneTimeEvents>[0]),
  },
  {
    definition: {
      name: 'bizneo_create_one_time_event',
      description: 'Create a one-time payroll event',
      inputSchema: {
        type: 'object',
        properties: {
          user_id: { type: 'number' },
          concept_id: { type: 'number' },
          amount: { type: 'number' },
          date: { type: 'string', description: 'Event date (YYYY-MM-DD)' },
        },
        required: ['user_id', 'concept_id', 'amount', 'date'],
      },
    },
    handler: async (args, api) =>
      api.payrolls.createOneTimeEvent(args as Parameters<typeof api.payrolls.createOneTimeEvent>[0]),
  },
  {
    definition: {
      name: 'bizneo_list_periodic_events',
      description: 'List periodic/recurring payroll events',
      inputSchema: {
        type: 'object',
        properties: {
          page_number: { type: 'number' },
          page_size: { type: 'number' },
          user_id: { type: 'number' },
        },
      },
    },
    handler: async (args, api) => api.payrolls.listPeriodicEvents(args as Parameters<typeof api.payrolls.listPeriodicEvents>[0]),
  },
];
