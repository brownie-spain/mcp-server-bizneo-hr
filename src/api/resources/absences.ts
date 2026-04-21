import { BizneoClient } from '../client.js';
import type {
  Absence,
  AbsenceKind,
  AbsenceSummary,
  AbsenceAdjustment,
  CreateAbsencePayload,
  ListAbsencesParams,
  WorkCalendar,
  Agreement,
  PaginatedResponse,
} from '../types.js';

export class AbsencesResource {
  constructor(private readonly client: BizneoClient) {}

  list(params?: ListAbsencesParams): Promise<PaginatedResponse<Absence>> {
    return this.client.get<PaginatedResponse<Absence>>('/api/v1/absences', params as Record<string, unknown>);
  }

  listKinds(): Promise<{ data: AbsenceKind[] }> {
    return this.client.get<{ data: AbsenceKind[] }>('/api/v1/absences/kinds');
  }

  delete(absenceId: number): Promise<void> {
    return this.client.delete<void>(`/api/v1/absences/${absenceId}`);
  }

  listWorkCalendars(): Promise<{ data: WorkCalendar[] }> {
    return this.client.get<{ data: WorkCalendar[] }>('/api/v1/absences/work-calendars');
  }

  listAgreements(): Promise<{ data: Agreement[] }> {
    return this.client.get<{ data: Agreement[] }>('/api/v1/absences/agreements');
  }

  assignWorkCalendar(userId: number, workCalendarId: number): Promise<void> {
    return this.client.post<void>('/api/v1/absences/work-calendar-assignments', {
      user_id: userId,
      work_calendar_id: workCalendarId,
    });
  }

  assignAgreement(userId: number, agreementId: number): Promise<void> {
    return this.client.post<void>('/api/v1/absences/agreement-assignments', {
      user_id: userId,
      agreement_id: agreementId,
    });
  }

  // User-scoped absence operations
  createUserAbsence(userId: number, payload: CreateAbsencePayload): Promise<{ data: Absence }> {
    return this.client.post<{ data: Absence }>(`/api/v1/users/${userId}/absences`, payload);
  }

  getUserAbsenceSummary(userId: number, year?: number): Promise<{ data: AbsenceSummary[] }> {
    return this.client.get<{ data: AbsenceSummary[] }>(
      `/api/v1/users/${userId}/absence-summary`,
      year ? { year } : undefined,
    );
  }

  listUserAbsenceAdjustments(
    userId: number,
    params?: { page_number?: number; page_size?: number },
  ): Promise<PaginatedResponse<AbsenceAdjustment>> {
    return this.client.get<PaginatedResponse<AbsenceAdjustment>>(
      `/api/v1/users/${userId}/absence-adjustments`,
      params as Record<string, unknown>,
    );
  }

  createUserAbsenceAdjustment(
    userId: number,
    payload: { kind_id: number; days: number; comment?: string },
  ): Promise<{ data: AbsenceAdjustment }> {
    return this.client.post<{ data: AbsenceAdjustment }>(
      `/api/v1/users/${userId}/absence-adjustments`,
      payload,
    );
  }

  updateUserAbsenceAdjustment(
    userId: number,
    adjustmentId: number,
    payload: { days?: number; comment?: string },
  ): Promise<{ data: AbsenceAdjustment }> {
    return this.client.put<{ data: AbsenceAdjustment }>(
      `/api/v1/users/${userId}/absence-adjustments/${adjustmentId}`,
      payload,
    );
  }

  deleteUserAbsenceAdjustment(userId: number, adjustmentId: number): Promise<void> {
    return this.client.delete<void>(`/api/v1/users/${userId}/absence-adjustments/${adjustmentId}`);
  }
}
