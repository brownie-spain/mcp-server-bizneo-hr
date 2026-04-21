import type { McpTool } from './types.js';

export const absenceTools: McpTool[] = [
  {
    definition: {
      name: 'bizneo_list_absences',
      description: 'List absence requests with optional filters',
      inputSchema: {
        type: 'object',
        properties: {
          page_number: { type: 'number' },
          page_size: { type: 'number' },
          user_id: { type: 'number', description: 'Filter by user ID' },
          start_date: { type: 'string', description: 'Filter from date (YYYY-MM-DD)' },
          end_date: { type: 'string', description: 'Filter to date (YYYY-MM-DD)' },
          status: { type: 'string', description: 'Filter by status (pending, approved, rejected)' },
        },
      },
    },
    handler: async (args, api) => api.absences.list(args as Parameters<typeof api.absences.list>[0]),
  },
  {
    definition: {
      name: 'bizneo_list_absence_kinds',
      description: 'List all available absence types/kinds',
      inputSchema: { type: 'object', properties: {} },
    },
    handler: async (_args, api) => api.absences.listKinds(),
  },
  {
    definition: {
      name: 'bizneo_delete_absence',
      description: 'Delete an absence request',
      inputSchema: {
        type: 'object',
        properties: {
          absence_id: { type: 'number', description: 'Absence ID' },
        },
        required: ['absence_id'],
      },
    },
    handler: async (args, api) => api.absences.delete(args.absence_id as number),
  },
  {
    definition: {
      name: 'bizneo_list_work_calendars',
      description: 'List all work calendars',
      inputSchema: { type: 'object', properties: {} },
    },
    handler: async (_args, api) => api.absences.listWorkCalendars(),
  },
  {
    definition: {
      name: 'bizneo_list_agreements',
      description: 'List all labor agreements',
      inputSchema: { type: 'object', properties: {} },
    },
    handler: async (_args, api) => api.absences.listAgreements(),
  },
  {
    definition: {
      name: 'bizneo_assign_work_calendar',
      description: 'Assign a work calendar to a user',
      inputSchema: {
        type: 'object',
        properties: {
          user_id: { type: 'number' },
          work_calendar_id: { type: 'number' },
        },
        required: ['user_id', 'work_calendar_id'],
      },
    },
    handler: async (args, api) =>
      api.absences.assignWorkCalendar(args.user_id as number, args.work_calendar_id as number),
  },
  {
    definition: {
      name: 'bizneo_assign_agreement',
      description: 'Assign a labor agreement to a user',
      inputSchema: {
        type: 'object',
        properties: {
          user_id: { type: 'number' },
          agreement_id: { type: 'number' },
        },
        required: ['user_id', 'agreement_id'],
      },
    },
    handler: async (args, api) =>
      api.absences.assignAgreement(args.user_id as number, args.agreement_id as number),
  },
  {
    definition: {
      name: 'bizneo_create_user_absence',
      description: 'Create an absence request for a user',
      inputSchema: {
        type: 'object',
        properties: {
          user_id: { type: 'number' },
          kind_id: { type: 'number', description: 'Absence kind/type ID' },
          start_date: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
          end_date: { type: 'string', description: 'End date (YYYY-MM-DD)' },
          start_time: { type: 'string', description: 'Start time for partial day (HH:mm)' },
          end_time: { type: 'string', description: 'End time for partial day (HH:mm)' },
          comment: { type: 'string' },
        },
        required: ['user_id', 'kind_id', 'start_date', 'end_date'],
      },
    },
    handler: async (args, api) => {
      const { user_id, ...payload } = args;
      return api.absences.createUserAbsence(user_id as number, payload as Parameters<typeof api.absences.createUserAbsence>[1]);
    },
  },
  {
    definition: {
      name: 'bizneo_get_user_absence_summary',
      description: 'Get annual absence summary for a user',
      inputSchema: {
        type: 'object',
        properties: {
          user_id: { type: 'number' },
          year: { type: 'number', description: 'Year (default: current year)' },
        },
        required: ['user_id'],
      },
    },
    handler: async (args, api) =>
      api.absences.getUserAbsenceSummary(args.user_id as number, args.year as number | undefined),
  },
  {
    definition: {
      name: 'bizneo_list_user_absence_adjustments',
      description: 'List absence balance adjustments for a user',
      inputSchema: {
        type: 'object',
        properties: {
          user_id: { type: 'number' },
          page_number: { type: 'number' },
          page_size: { type: 'number' },
        },
        required: ['user_id'],
      },
    },
    handler: async (args, api) => {
      const { user_id, ...params } = args;
      return api.absences.listUserAbsenceAdjustments(user_id as number, params as { page_number?: number; page_size?: number });
    },
  },
  {
    definition: {
      name: 'bizneo_create_user_absence_adjustment',
      description: 'Create an absence balance adjustment for a user',
      inputSchema: {
        type: 'object',
        properties: {
          user_id: { type: 'number' },
          kind_id: { type: 'number', description: 'Absence kind ID' },
          days: { type: 'number', description: 'Number of days to adjust (can be negative)' },
          comment: { type: 'string' },
        },
        required: ['user_id', 'kind_id', 'days'],
      },
    },
    handler: async (args, api) => {
      const { user_id, ...payload } = args;
      return api.absences.createUserAbsenceAdjustment(user_id as number, payload as Parameters<typeof api.absences.createUserAbsenceAdjustment>[1]);
    },
  },
];
