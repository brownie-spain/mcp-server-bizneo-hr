import { BizneoClient, type ClientOptions } from './client.js';
import { UsersResource } from './resources/users.js';
import { AbsencesResource } from './resources/absences.js';
import { TimeAttendanceResource } from './resources/time-attendance.js';
import { OrganizationsResource } from './resources/organizations.js';
import { ExpensesResource } from './resources/expenses.js';
import { RolesResource } from './resources/roles.js';
import { CustomFieldsResource } from './resources/custom-fields.js';
import { ProjectsResource } from './resources/projects.js';
import { GoalsResource } from './resources/goals.js';
import { PayrollsResource } from './resources/payrolls.js';
import { LearningResource } from './resources/learning.js';

export class BizneoHRApi {
  readonly users: UsersResource;
  readonly absences: AbsencesResource;
  readonly timeAttendance: TimeAttendanceResource;
  readonly organizations: OrganizationsResource;
  readonly expenses: ExpensesResource;
  readonly roles: RolesResource;
  readonly customFields: CustomFieldsResource;
  readonly projects: ProjectsResource;
  readonly goals: GoalsResource;
  readonly payrolls: PayrollsResource;
  readonly learning: LearningResource;

  private readonly client: BizneoClient;

  constructor(options?: ClientOptions) {
    this.client = new BizneoClient(options);
    this.users = new UsersResource(this.client);
    this.absences = new AbsencesResource(this.client);
    this.timeAttendance = new TimeAttendanceResource(this.client);
    this.organizations = new OrganizationsResource(this.client);
    this.expenses = new ExpensesResource(this.client);
    this.roles = new RolesResource(this.client);
    this.customFields = new CustomFieldsResource(this.client);
    this.projects = new ProjectsResource(this.client);
    this.goals = new GoalsResource(this.client);
    this.payrolls = new PayrollsResource(this.client);
    this.learning = new LearningResource(this.client);
  }

  getRateLimiterStats() {
    return this.client.getRateLimiterStats();
  }
}

export { BizneoClient, BizneoApiError, RateLimitError } from './client.js';
export * from './types.js';
