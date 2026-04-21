import type { McpTool } from './types.js';

export const learningTools: McpTool[] = [
  {
    definition: {
      name: 'bizneo_list_courses',
      description: 'List training courses',
      inputSchema: {
        type: 'object',
        properties: {
          page_number: { type: 'number' },
          page_size: { type: 'number' },
        },
      },
    },
    handler: async (args, api) => api.learning.listCourses(args as { page_number?: number; page_size?: number }),
  },
  {
    definition: {
      name: 'bizneo_get_course',
      description: 'Get a specific course',
      inputSchema: {
        type: 'object',
        properties: {
          course_id: { type: 'number' },
        },
        required: ['course_id'],
      },
    },
    handler: async (args, api) => api.learning.getCourse(args.course_id as number),
  },
  {
    definition: {
      name: 'bizneo_create_course',
      description: 'Create a new training course',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          duration_hours: { type: 'number', description: 'Course duration in hours' },
        },
        required: ['name'],
      },
    },
    handler: async (args, api) =>
      api.learning.createCourse(args as { name: string; description?: string; duration_hours?: number }),
  },
  {
    definition: {
      name: 'bizneo_delete_course',
      description: 'Delete a training course',
      inputSchema: {
        type: 'object',
        properties: {
          course_id: { type: 'number' },
        },
        required: ['course_id'],
      },
    },
    handler: async (args, api) => api.learning.deleteCourse(args.course_id as number),
  },
  {
    definition: {
      name: 'bizneo_list_training_actions',
      description: 'List training actions (course sessions)',
      inputSchema: {
        type: 'object',
        properties: {
          page_number: { type: 'number' },
          page_size: { type: 'number' },
          course_id: { type: 'number', description: 'Filter by course ID' },
        },
      },
    },
    handler: async (args, api) => api.learning.listTrainingActions(args as Parameters<typeof api.learning.listTrainingActions>[0]),
  },
  {
    definition: {
      name: 'bizneo_create_training_action',
      description: 'Create a training action (session)',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          course_id: { type: 'number' },
          start_date: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
          end_date: { type: 'string', description: 'End date (YYYY-MM-DD)' },
        },
        required: ['name'],
      },
    },
    handler: async (args, api) =>
      api.learning.createTrainingAction(args as Parameters<typeof api.learning.createTrainingAction>[0]),
  },
  {
    definition: {
      name: 'bizneo_list_requisitions',
      description: 'List training requisitions',
      inputSchema: {
        type: 'object',
        properties: {
          page_number: { type: 'number' },
          page_size: { type: 'number' },
          user_id: { type: 'number' },
        },
      },
    },
    handler: async (args, api) => api.learning.listRequisitions(args as Parameters<typeof api.learning.listRequisitions>[0]),
  },
];
