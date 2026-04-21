import type { McpTool } from './types.js';

export const userTools: McpTool[] = [
  {
    definition: {
      name: 'bizneo_list_users',
      description: 'List users from Bizneo HR with optional pagination and filters',
      inputSchema: {
        type: 'object',
        properties: {
          page_number: { type: 'number', description: 'Page number (default: 1)' },
          page_size: { type: 'number', description: 'Results per page (default: 25, max: 100)' },
          external_id: { type: 'string', description: 'Filter by external ID' },
          status: { type: 'string', description: 'Filter by status (active, inactive)' },
        },
      },
    },
    handler: async (args, api) => api.users.list(args as Parameters<typeof api.users.list>[0]),
  },
  {
    definition: {
      name: 'bizneo_get_user',
      description: 'Get a specific user by ID',
      inputSchema: {
        type: 'object',
        properties: {
          user_id: { type: 'number', description: 'User ID' },
          folders: { type: 'boolean', description: 'Include document folders' },
        },
        required: ['user_id'],
      },
    },
    handler: async (args, api) =>
      api.users.get(args.user_id as number, args.folders as boolean | undefined),
  },
  {
    definition: {
      name: 'bizneo_create_user',
      description: 'Create a new user in Bizneo HR',
      inputSchema: {
        type: 'object',
        properties: {
          first_name: { type: 'string', description: 'First name (required)' },
          last_name: { type: 'string', description: 'Last name (required)' },
          email: { type: 'string', description: 'Email address (required)' },
          hire_date: { type: 'string', description: 'Hire date (YYYY-MM-DD)' },
          job_title: { type: 'string', description: 'Job title' },
          external_id: { type: 'string', description: 'External ID for integrations' },
          phone: { type: 'string' },
          birth_date: { type: 'string', description: 'Birth date (YYYY-MM-DD)' },
          gender: { type: 'string' },
          nationality: { type: 'string' },
        },
        required: ['first_name', 'last_name', 'email'],
      },
    },
    handler: async (args, api) =>
      api.users.create(args as Parameters<typeof api.users.create>[0]),
  },
  {
    definition: {
      name: 'bizneo_update_user',
      description: 'Update an existing user',
      inputSchema: {
        type: 'object',
        properties: {
          user_id: { type: 'number', description: 'User ID' },
          first_name: { type: 'string' },
          last_name: { type: 'string' },
          email: { type: 'string' },
          hire_date: { type: 'string', description: 'Hire date (YYYY-MM-DD)' },
          job_title: { type: 'string' },
          phone: { type: 'string' },
          birth_date: { type: 'string', description: 'Birth date (YYYY-MM-DD)' },
        },
        required: ['user_id'],
      },
    },
    handler: async (args, api) => {
      const { user_id, ...payload } = args;
      return api.users.update(user_id as number, payload);
    },
  },
  {
    definition: {
      name: 'bizneo_terminate_user',
      description: 'Terminate a user employment',
      inputSchema: {
        type: 'object',
        properties: {
          user_id: { type: 'number', description: 'User ID' },
          termination_date: { type: 'string', description: 'Termination date (YYYY-MM-DD)' },
          termination_type: { type: 'string', enum: ['voluntary', 'involuntary'] },
          termination_reason_id: { type: 'number' },
        },
        required: ['user_id', 'termination_date'],
      },
    },
    handler: async (args, api) => {
      const { user_id, ...payload } = args;
      return api.users.terminate(user_id as number, payload as Parameters<typeof api.users.terminate>[1]);
    },
  },
  {
    definition: {
      name: 'bizneo_send_user_invite',
      description: 'Send an invitation to a user',
      inputSchema: {
        type: 'object',
        properties: {
          user_id: { type: 'number', description: 'User ID' },
        },
        required: ['user_id'],
      },
    },
    handler: async (args, api) => api.users.sendInvite(args.user_id as number),
  },
  {
    definition: {
      name: 'bizneo_list_user_documents',
      description: 'List documents for a user',
      inputSchema: {
        type: 'object',
        properties: {
          user_id: { type: 'number', description: 'User ID' },
          page_number: { type: 'number' },
          page_size: { type: 'number' },
        },
        required: ['user_id'],
      },
    },
    handler: async (args, api) => {
      const { user_id, ...params } = args;
      return api.users.listDocuments(user_id as number, params as { page_number?: number; page_size?: number });
    },
  },
  {
    definition: {
      name: 'bizneo_delete_user_document',
      description: 'Delete a document from a user',
      inputSchema: {
        type: 'object',
        properties: {
          user_id: { type: 'number', description: 'User ID' },
          document_id: { type: 'number', description: 'Document ID' },
        },
        required: ['user_id', 'document_id'],
      },
    },
    handler: async (args, api) =>
      api.users.deleteDocument(args.user_id as number, args.document_id as number),
  },
  {
    definition: {
      name: 'bizneo_list_user_taxons',
      description: 'List organizational units (taxons) for a user',
      inputSchema: {
        type: 'object',
        properties: {
          user_id: { type: 'number', description: 'User ID' },
        },
        required: ['user_id'],
      },
    },
    handler: async (args, api) => api.users.listTaxons(args.user_id as number),
  },
  {
    definition: {
      name: 'bizneo_add_user_taxon',
      description: 'Add a user to an organizational unit (taxon)',
      inputSchema: {
        type: 'object',
        properties: {
          user_id: { type: 'number' },
          taxon_id: { type: 'number' },
        },
        required: ['user_id', 'taxon_id'],
      },
    },
    handler: async (args, api) =>
      api.users.addTaxon(args.user_id as number, args.taxon_id as number),
  },
  {
    definition: {
      name: 'bizneo_remove_user_taxon',
      description: 'Remove a user from an organizational unit (taxon)',
      inputSchema: {
        type: 'object',
        properties: {
          user_id: { type: 'number' },
          taxon_id: { type: 'number' },
        },
        required: ['user_id', 'taxon_id'],
      },
    },
    handler: async (args, api) =>
      api.users.removeTaxon(args.user_id as number, args.taxon_id as number),
  },
  {
    definition: {
      name: 'bizneo_list_user_work_contracts',
      description: 'List work contracts for a user',
      inputSchema: {
        type: 'object',
        properties: {
          user_id: { type: 'number' },
        },
        required: ['user_id'],
      },
    },
    handler: async (args, api) => api.users.listWorkContracts(args.user_id as number),
  },
  {
    definition: {
      name: 'bizneo_create_user_work_contract',
      description: 'Create a work contract for a user',
      inputSchema: {
        type: 'object',
        properties: {
          user_id: { type: 'number' },
          start_date: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
          end_date: { type: 'string', description: 'End date (YYYY-MM-DD)' },
          contract_type: { type: 'string' },
        },
        required: ['user_id', 'start_date'],
      },
    },
    handler: async (args, api) => {
      const { user_id, ...payload } = args;
      return api.users.createWorkContract(user_id as number, payload as Parameters<typeof api.users.createWorkContract>[1]);
    },
  },
  {
    definition: {
      name: 'bizneo_list_user_salaries',
      description: 'List salaries for a user',
      inputSchema: {
        type: 'object',
        properties: {
          user_id: { type: 'number' },
        },
        required: ['user_id'],
      },
    },
    handler: async (args, api) => api.users.listSalaries(args.user_id as number),
  },
  {
    definition: {
      name: 'bizneo_create_user_salary',
      description: 'Create a salary record for a user',
      inputSchema: {
        type: 'object',
        properties: {
          user_id: { type: 'number' },
          amount: { type: 'number', description: 'Salary amount' },
          currency: { type: 'string', description: 'Currency code (e.g. EUR)' },
          start_date: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
          end_date: { type: 'string', description: 'End date (YYYY-MM-DD)' },
        },
        required: ['user_id', 'amount', 'start_date'],
      },
    },
    handler: async (args, api) => {
      const { user_id, ...payload } = args;
      return api.users.createSalary(user_id as number, payload as Parameters<typeof api.users.createSalary>[1]);
    },
  },
];
