import type { McpTool } from './types.js';

export const timeAttendanceTools: McpTool[] = [
  {
    definition: {
      name: 'bizneo_list_logged_times',
      description: 'List all logged time entries globally',
      inputSchema: {
        type: 'object',
        properties: {
          page_number: { type: 'number' },
          page_size: { type: 'number' },
          start_date: { type: 'string', description: 'Filter from date (YYYY-MM-DD)' },
          end_date: { type: 'string', description: 'Filter to date (YYYY-MM-DD)' },
          user_id: { type: 'number' },
        },
      },
    },
    handler: async (args, api) => api.timeAttendance.listLoggedTimes(args as Parameters<typeof api.timeAttendance.listLoggedTimes>[0]),
  },
  {
    definition: {
      name: 'bizneo_list_user_logged_times',
      description: 'List logged time entries for a specific user',
      inputSchema: {
        type: 'object',
        properties: {
          user_id: { type: 'number' },
          start_date: { type: 'string', description: 'Filter from date (YYYY-MM-DD)' },
          end_date: { type: 'string', description: 'Filter to date (YYYY-MM-DD)' },
          page_number: { type: 'number' },
          page_size: { type: 'number' },
        },
        required: ['user_id'],
      },
    },
    handler: async (args, api) => {
      const { user_id, ...params } = args;
      return api.timeAttendance.listUserLoggedTimes(user_id as number, params as Parameters<typeof api.timeAttendance.listUserLoggedTimes>[1]);
    },
  },
  {
    definition: {
      name: 'bizneo_create_user_logged_time',
      description: 'Register work hours for a user',
      inputSchema: {
        type: 'object',
        properties: {
          user_id: { type: 'number' },
          start_time: { type: 'string', description: 'Start datetime (ISO 8601)' },
          end_time: { type: 'string', description: 'End datetime (ISO 8601)' },
          project_id: { type: 'number' },
          telework: { type: 'boolean', description: 'Whether this is remote work' },
          comment: { type: 'string' },
        },
        required: ['user_id', 'start_time'],
      },
    },
    handler: async (args, api) => {
      const { user_id, ...payload } = args;
      return api.timeAttendance.createUserLoggedTime(user_id as number, payload as Parameters<typeof api.timeAttendance.createUserLoggedTime>[1]);
    },
  },
  {
    definition: {
      name: 'bizneo_delete_user_logged_time',
      description: 'Delete a logged time entry for a user',
      inputSchema: {
        type: 'object',
        properties: {
          user_id: { type: 'number' },
          logged_time_id: { type: 'number' },
        },
        required: ['user_id', 'logged_time_id'],
      },
    },
    handler: async (args, api) =>
      api.timeAttendance.deleteUserLoggedTime(args.user_id as number, args.logged_time_id as number),
  },
  {
    definition: {
      name: 'bizneo_list_schedules',
      description: 'List all available work schedules',
      inputSchema: {
        type: 'object',
        properties: {
          page_number: { type: 'number' },
          page_size: { type: 'number' },
        },
      },
    },
    handler: async (args, api) => api.timeAttendance.listSchedules(args as { page_number?: number; page_size?: number }),
  },
  {
    definition: {
      name: 'bizneo_list_user_schedules',
      description: 'List schedules assigned to a user',
      inputSchema: {
        type: 'object',
        properties: {
          user_id: { type: 'number' },
        },
        required: ['user_id'],
      },
    },
    handler: async (args, api) => api.timeAttendance.listUserSchedules(args.user_id as number),
  },
  {
    definition: {
      name: 'bizneo_assign_schedule',
      description: 'Assign a work schedule to a user',
      inputSchema: {
        type: 'object',
        properties: {
          user_id: { type: 'number' },
          schedule_id: { type: 'number' },
          start_date: { type: 'string', description: 'Effective start date (YYYY-MM-DD)' },
        },
        required: ['user_id', 'schedule_id', 'start_date'],
      },
    },
    handler: async (args, api) =>
      api.timeAttendance.assignSchedule(args.user_id as number, args.schedule_id as number, args.start_date as string),
  },
  {
    definition: {
      name: 'bizneo_list_timeline',
      description: 'List the timeline of time entries',
      inputSchema: {
        type: 'object',
        properties: {
          start_date: { type: 'string', description: 'Filter from date (YYYY-MM-DD)' },
          end_date: { type: 'string', description: 'Filter to date (YYYY-MM-DD)' },
          user_id: { type: 'number' },
        },
      },
    },
    handler: async (args, api) => api.timeAttendance.listTimeline(args as Parameters<typeof api.timeAttendance.listTimeline>[0]),
  },
  {
    definition: {
      name: 'bizneo_start_user_chronometer',
      description: 'Start the chronometer for a user',
      inputSchema: {
        type: 'object',
        properties: {
          user_id: { type: 'number' },
          project_id: { type: 'number' },
          telework: { type: 'boolean' },
        },
        required: ['user_id'],
      },
    },
    handler: async (args, api) => {
      const { user_id, ...payload } = args;
      return api.timeAttendance.startUserChronometer(user_id as number, payload);
    },
  },
  {
    definition: {
      name: 'bizneo_pause_user_chronometer',
      description: 'Pause the running chronometer for a user',
      inputSchema: {
        type: 'object',
        properties: {
          user_id: { type: 'number' },
        },
        required: ['user_id'],
      },
    },
    handler: async (args, api) => api.timeAttendance.pauseUserChronometer(args.user_id as number),
  },
  {
    definition: {
      name: 'bizneo_resume_user_chronometer',
      description: 'Resume a paused chronometer for a user',
      inputSchema: {
        type: 'object',
        properties: {
          user_id: { type: 'number' },
        },
        required: ['user_id'],
      },
    },
    handler: async (args, api) => api.timeAttendance.resumeUserChronometer(args.user_id as number),
  },
  {
    definition: {
      name: 'bizneo_stop_user_chronometer',
      description: 'Stop the chronometer for a user and register the time entry',
      inputSchema: {
        type: 'object',
        properties: {
          user_id: { type: 'number' },
        },
        required: ['user_id'],
      },
    },
    handler: async (args, api) => api.timeAttendance.stopUserChronometer(args.user_id as number),
  },
  {
    definition: {
      name: 'bizneo_get_user_compensation_report',
      description: 'Get compensation/overtime report for a user',
      inputSchema: {
        type: 'object',
        properties: {
          user_id: { type: 'number' },
          start_date: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
          end_date: { type: 'string', description: 'End date (YYYY-MM-DD)' },
        },
        required: ['user_id'],
      },
    },
    handler: async (args, api) => {
      const { user_id, ...params } = args;
      return api.timeAttendance.getUserCompensationReport(user_id as number, params as { start_date?: string; end_date?: string });
    },
  },
  {
    definition: {
      name: 'bizneo_list_overtimes',
      description: 'List overtime requests',
      inputSchema: {
        type: 'object',
        properties: {
          page_number: { type: 'number' },
          page_size: { type: 'number' },
          user_id: { type: 'number' },
        },
      },
    },
    handler: async (args, api) => api.timeAttendance.listOvertimes(args as Parameters<typeof api.timeAttendance.listOvertimes>[0]),
  },
];
