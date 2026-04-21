// ─── Pagination ────────────────────────────────────────────────────────────

export interface PaginationParams {
  page_number?: number;
  page_size?: number;
}

export interface PaginationMeta {
  page_number: number;
  page_size: number;
  total_entries: number;
  total_pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// ─── Users ─────────────────────────────────────────────────────────────────

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  external_id?: string;
  status?: string;
  hire_date?: string;
  termination_date?: string;
  job_title?: string;
  phone?: string;
  mobile?: string;
  birth_date?: string;
  gender?: string;
  nationality?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  avatar_url?: string;
  custom_fields?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface CreateUserPayload {
  first_name: string;
  last_name: string;
  email: string;
  external_id?: string;
  hire_date?: string;
  job_title?: string;
  phone?: string;
  mobile?: string;
  birth_date?: string;
  gender?: string;
  nationality?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  custom_fields?: Record<string, unknown>;
  [key: string]: unknown;
}

export type UpdateUserPayload = Partial<CreateUserPayload>;

export interface UserDocument {
  id: number;
  name: string;
  folder_id?: number;
  folder_name?: string;
  created_at?: string;
  [key: string]: unknown;
}

export interface ListUsersParams extends PaginationParams {
  external_id?: string;
  taxon_ids?: number[];
  status?: string;
  [key: string]: unknown;
}

export interface TerminateUserPayload {
  termination_date: string;
  termination_type?: 'voluntary' | 'involuntary';
  termination_reason_id?: number;
  [key: string]: unknown;
}

// ─── Taxons ────────────────────────────────────────────────────────────────

export interface Taxon {
  id: number;
  name: string;
  kind?: string;
  [key: string]: unknown;
}

// ─── Work Contracts ─────────────────────────────────────────────────────────

export interface WorkContract {
  id: number;
  user_id: number;
  start_date: string;
  end_date?: string;
  contract_type?: string;
  [key: string]: unknown;
}

export interface CreateWorkContractPayload {
  start_date: string;
  end_date?: string;
  contract_type?: string;
  [key: string]: unknown;
}

// ─── Salaries ──────────────────────────────────────────────────────────────

export interface Salary {
  id: number;
  user_id: number;
  amount: number;
  currency?: string;
  start_date: string;
  end_date?: string;
  [key: string]: unknown;
}

export interface CreateSalaryPayload {
  amount: number;
  currency?: string;
  start_date: string;
  end_date?: string;
  [key: string]: unknown;
}

// ─── Absences ──────────────────────────────────────────────────────────────

export interface Absence {
  id: number;
  user_id: number;
  kind_id: number;
  kind_name?: string;
  start_date: string;
  end_date: string;
  status?: string;
  [key: string]: unknown;
}

export interface AbsenceKind {
  id: number;
  name: string;
  color?: string;
  [key: string]: unknown;
}

export interface CreateAbsencePayload {
  kind_id: number;
  start_date: string;
  end_date: string;
  start_time?: string;
  end_time?: string;
  comment?: string;
  [key: string]: unknown;
}

export interface AbsenceSummary {
  kind_id: number;
  kind_name: string;
  total_days?: number;
  used_days?: number;
  remaining_days?: number;
  [key: string]: unknown;
}

export interface AbsenceAdjustment {
  id: number;
  user_id: number;
  kind_id: number;
  days: number;
  comment?: string;
  [key: string]: unknown;
}

export interface ListAbsencesParams extends PaginationParams {
  user_id?: number;
  start_date?: string;
  end_date?: string;
  status?: string;
  [key: string]: unknown;
}

export interface WorkCalendar {
  id: number;
  name: string;
  [key: string]: unknown;
}

export interface Agreement {
  id: number;
  name: string;
  [key: string]: unknown;
}

// ─── Time Attendance ───────────────────────────────────────────────────────

export interface LoggedTime {
  id: number;
  user_id: number;
  start_time: string;
  end_time?: string;
  duration?: number;
  project_id?: number;
  telework?: boolean;
  [key: string]: unknown;
}

export interface CreateLoggedTimePayload {
  start_time: string;
  end_time?: string;
  duration?: number;
  project_id?: number;
  telework?: boolean;
  comment?: string;
  [key: string]: unknown;
}

export interface ListLoggedTimesParams extends PaginationParams {
  start_date?: string;
  end_date?: string;
  user_id?: number;
  [key: string]: unknown;
}

export interface Schedule {
  id: number;
  name: string;
  [key: string]: unknown;
}

export interface Chronometer {
  id: number;
  user_id: number;
  status: 'running' | 'paused' | 'stopped';
  started_at?: string;
  [key: string]: unknown;
}

// ─── Organizations ─────────────────────────────────────────────────────────

export interface Organization {
  id: number;
  name: string;
  kind?: string;
  parent_id?: number;
  [key: string]: unknown;
}

export interface CreateOrganizationPayload {
  name: string;
  kind?: string;
  parent_id?: number;
  [key: string]: unknown;
}

// ─── Expenses ──────────────────────────────────────────────────────────────

export interface Expense {
  id: number;
  user_id: number;
  kind_id: number;
  amount: number;
  currency?: string;
  date: string;
  description?: string;
  status?: string;
  [key: string]: unknown;
}

export interface ExpenseKind {
  id: number;
  name: string;
  [key: string]: unknown;
}

export interface CreateExpensePayload {
  kind_id: number;
  amount: number;
  currency?: string;
  date: string;
  description?: string;
  [key: string]: unknown;
}

export interface ListExpensesParams extends PaginationParams {
  user_id?: number;
  start_date?: string;
  end_date?: string;
  status?: string;
  [key: string]: unknown;
}

// ─── Goals ─────────────────────────────────────────────────────────────────

export interface Goal {
  id: number;
  user_id?: number;
  title: string;
  description?: string;
  achievement?: number;
  [key: string]: unknown;
}

export interface CreateGoalPayload {
  title: string;
  description?: string;
  user_id?: number;
  [key: string]: unknown;
}

// ─── Projects ──────────────────────────────────────────────────────────────

export interface Project {
  id: number;
  name: string;
  code?: string;
  active?: boolean;
  [key: string]: unknown;
}

export interface CreateProjectPayload {
  name: string;
  code?: string;
  active?: boolean;
  [key: string]: unknown;
}

// ─── Roles ─────────────────────────────────────────────────────────────────

export interface Role {
  id: number;
  name: string;
  [key: string]: unknown;
}

// ─── Custom Fields ─────────────────────────────────────────────────────────

export interface CustomField {
  id: number;
  name: string;
  kind: string;
  options?: string[];
  [key: string]: unknown;
}

// ─── Payrolls ──────────────────────────────────────────────────────────────

export interface PayrollConcept {
  id: number;
  name: string;
  code?: string;
  [key: string]: unknown;
}

export interface OneTimeEvent {
  id: number;
  user_id: number;
  concept_id: number;
  amount: number;
  date: string;
  [key: string]: unknown;
}

export interface PeriodicEvent {
  id: number;
  user_id: number;
  concept_id: number;
  amount: number;
  [key: string]: unknown;
}

export interface CreateOneTimeEventPayload {
  user_id: number;
  concept_id: number;
  amount: number;
  date: string;
  [key: string]: unknown;
}

// ─── Learning ──────────────────────────────────────────────────────────────

export interface Course {
  id: number;
  name: string;
  description?: string;
  duration_hours?: number;
  [key: string]: unknown;
}

export interface TrainingAction {
  id: number;
  name: string;
  course_id?: number;
  start_date?: string;
  end_date?: string;
  [key: string]: unknown;
}

export interface Requisition {
  id: number;
  user_id: number;
  course_id?: number;
  status?: string;
  [key: string]: unknown;
}

// ─── API Error ─────────────────────────────────────────────────────────────

export interface BizneoApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}
