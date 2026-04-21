import type { McpTool } from './types.js';

export const expenseTools: McpTool[] = [
  {
    definition: {
      name: 'bizneo_list_expenses',
      description: 'List expense reports',
      inputSchema: {
        type: 'object',
        properties: {
          page_number: { type: 'number' },
          page_size: { type: 'number' },
          user_id: { type: 'number' },
          start_date: { type: 'string', description: 'Filter from date (YYYY-MM-DD)' },
          end_date: { type: 'string', description: 'Filter to date (YYYY-MM-DD)' },
          status: { type: 'string' },
        },
      },
    },
    handler: async (args, api) => api.expenses.list(args as Parameters<typeof api.expenses.list>[0]),
  },
  {
    definition: {
      name: 'bizneo_get_expense',
      description: 'Get a specific expense report',
      inputSchema: {
        type: 'object',
        properties: {
          expense_id: { type: 'number' },
        },
        required: ['expense_id'],
      },
    },
    handler: async (args, api) => api.expenses.get(args.expense_id as number),
  },
  {
    definition: {
      name: 'bizneo_create_expense',
      description: 'Create a new expense report',
      inputSchema: {
        type: 'object',
        properties: {
          kind_id: { type: 'number', description: 'Expense type ID' },
          amount: { type: 'number' },
          currency: { type: 'string', description: 'Currency code (e.g. EUR)' },
          date: { type: 'string', description: 'Expense date (YYYY-MM-DD)' },
          description: { type: 'string' },
        },
        required: ['kind_id', 'amount', 'date'],
      },
    },
    handler: async (args, api) =>
      api.expenses.create(args as Parameters<typeof api.expenses.create>[0]),
  },
  {
    definition: {
      name: 'bizneo_update_expense',
      description: 'Update an expense report',
      inputSchema: {
        type: 'object',
        properties: {
          expense_id: { type: 'number' },
          kind_id: { type: 'number' },
          amount: { type: 'number' },
          currency: { type: 'string' },
          date: { type: 'string', description: 'Expense date (YYYY-MM-DD)' },
          description: { type: 'string' },
        },
        required: ['expense_id'],
      },
    },
    handler: async (args, api) => {
      const { expense_id, ...payload } = args;
      return api.expenses.update(expense_id as number, payload as Parameters<typeof api.expenses.update>[1]);
    },
  },
  {
    definition: {
      name: 'bizneo_delete_expense',
      description: 'Delete an expense report',
      inputSchema: {
        type: 'object',
        properties: {
          expense_id: { type: 'number' },
        },
        required: ['expense_id'],
      },
    },
    handler: async (args, api) => api.expenses.delete(args.expense_id as number),
  },
  {
    definition: {
      name: 'bizneo_list_expense_kinds',
      description: 'List expense types/categories',
      inputSchema: { type: 'object', properties: {} },
    },
    handler: async (_args, api) => api.expenses.listKinds(),
  },
  {
    definition: {
      name: 'bizneo_create_expense_kind',
      description: 'Create a new expense type/category',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
        },
        required: ['name'],
      },
    },
    handler: async (args, api) => api.expenses.createKind(args as { name: string }),
  },
];
