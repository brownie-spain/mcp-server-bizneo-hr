import { userTools } from './users.js';
import { absenceTools } from './absences.js';
import { timeAttendanceTools } from './time-attendance.js';
import { organizationTools } from './organizations.js';
import { expenseTools } from './expenses.js';
import { roleTools } from './roles.js';
import { customFieldTools } from './custom-fields.js';
import { projectTools } from './projects.js';
import { goalTools } from './goals.js';
import { payrollTools } from './payrolls.js';
import { learningTools } from './learning.js';
import type { McpTool } from './types.js';

export const allTools: McpTool[] = [
  ...userTools,
  ...absenceTools,
  ...timeAttendanceTools,
  ...organizationTools,
  ...expenseTools,
  ...roleTools,
  ...customFieldTools,
  ...projectTools,
  ...goalTools,
  ...payrollTools,
  ...learningTools,
];

export const toolMap = new Map<string, McpTool>(
  allTools.map((tool) => [tool.definition.name, tool]),
);

export type { McpTool } from './types.js';
