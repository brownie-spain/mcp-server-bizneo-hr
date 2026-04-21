import { BizneoClient } from '../client.js';
import type {
  LoggedTime,
  CreateLoggedTimePayload,
  ListLoggedTimesParams,
  Schedule,
  Chronometer,
  PaginatedResponse,
} from '../types.js';

export class TimeAttendanceResource {
  constructor(private readonly client: BizneoClient) {}

  // Global logged times
  listLoggedTimes(params?: ListLoggedTimesParams): Promise<PaginatedResponse<LoggedTime>> {
    return this.client.get<PaginatedResponse<LoggedTime>>('/api/v1/logged-times', params as Record<string, unknown>);
  }

  listSchedules(params?: { page_number?: number; page_size?: number }): Promise<PaginatedResponse<Schedule>> {
    return this.client.get<PaginatedResponse<Schedule>>('/api/v1/schedules', params as Record<string, unknown>);
  }

  listTimeline(params?: { start_date?: string; end_date?: string; user_id?: number }): Promise<{ data: unknown[] }> {
    return this.client.get<{ data: unknown[] }>('/api/v1/timeline', params as Record<string, unknown>);
  }

  assignSchedule(userId: number, scheduleId: number, startDate: string): Promise<void> {
    return this.client.post<void>('/api/v1/schedules/assignments', {
      user_id: userId,
      schedule_id: scheduleId,
      start_date: startDate,
    });
  }

  // User-scoped logged times
  listUserLoggedTimes(
    userId: number,
    params?: { start_date?: string; end_date?: string; page_number?: number; page_size?: number },
  ): Promise<PaginatedResponse<LoggedTime>> {
    return this.client.get<PaginatedResponse<LoggedTime>>(
      `/api/v1/users/${userId}/logged-times`,
      params as Record<string, unknown>,
    );
  }

  createUserLoggedTime(userId: number, payload: CreateLoggedTimePayload): Promise<{ data: LoggedTime }> {
    return this.client.post<{ data: LoggedTime }>(`/api/v1/users/${userId}/logged-times`, payload);
  }

  deleteUserLoggedTime(userId: number, loggedTimeId: number): Promise<void> {
    return this.client.delete<void>(`/api/v1/users/${userId}/logged-times/${loggedTimeId}`);
  }

  // User schedules
  listUserSchedules(userId: number): Promise<{ data: Schedule[] }> {
    return this.client.get<{ data: Schedule[] }>(`/api/v1/users/${userId}/schedules`);
  }

  createUserOneTimeSchedule(
    userId: number,
    payload: { schedule_id: number; date: string },
  ): Promise<{ data: Schedule }> {
    return this.client.post<{ data: Schedule }>(`/api/v1/users/${userId}/schedules`, payload);
  }

  deleteUserOneTimeSchedule(userId: number, scheduleId: number): Promise<void> {
    return this.client.delete<void>(`/api/v1/users/${userId}/schedules/${scheduleId}`);
  }

  // User rests
  listUserRests(userId: number): Promise<{ data: unknown[] }> {
    return this.client.get<{ data: unknown[] }>(`/api/v1/users/${userId}/rests`);
  }

  // Compensation report
  getUserCompensationReport(
    userId: number,
    params?: { start_date?: string; end_date?: string },
  ): Promise<{ data: unknown }> {
    return this.client.get<{ data: unknown }>(
      `/api/v1/users/${userId}/compensation-report`,
      params as Record<string, unknown>,
    );
  }

  // User chronometers
  startUserChronometer(userId: number, payload?: Record<string, unknown>): Promise<{ data: Chronometer }> {
    return this.client.post<{ data: Chronometer }>(`/api/v1/users/${userId}/chronometers/start`, payload);
  }

  pauseUserChronometer(userId: number): Promise<{ data: Chronometer }> {
    return this.client.post<{ data: Chronometer }>(`/api/v1/users/${userId}/chronometers/pause`);
  }

  resumeUserChronometer(userId: number): Promise<{ data: Chronometer }> {
    return this.client.post<{ data: Chronometer }>(`/api/v1/users/${userId}/chronometers/resume`);
  }

  stopUserChronometer(userId: number): Promise<{ data: Chronometer }> {
    return this.client.post<{ data: Chronometer }>(`/api/v1/users/${userId}/chronometers/stop`);
  }

  cancelUserChronometer(userId: number): Promise<{ data: Chronometer }> {
    return this.client.post<{ data: Chronometer }>(`/api/v1/users/${userId}/chronometers/cancel`);
  }

  getUserChronometer(userId: number): Promise<{ data: Chronometer }> {
    return this.client.get<{ data: Chronometer }>(`/api/v1/users/${userId}/chronometers`);
  }

  // Bulk chronometers
  startChronometers(userIds: number[]): Promise<void> {
    return this.client.post<void>('/api/v1/chronometers/start', { user_ids: userIds });
  }

  pauseChronometers(userIds: number[]): Promise<void> {
    return this.client.post<void>('/api/v1/chronometers/pause', { user_ids: userIds });
  }

  resumeChronometers(userIds: number[]): Promise<void> {
    return this.client.post<void>('/api/v1/chronometers/resume', { user_ids: userIds });
  }

  stopChronometers(userIds: number[]): Promise<void> {
    return this.client.post<void>('/api/v1/chronometers/stop', { user_ids: userIds });
  }

  cancelChronometers(userIds: number[]): Promise<void> {
    return this.client.post<void>('/api/v1/chronometers/cancel', { user_ids: userIds });
  }

  // Overtimes
  listOvertimes(params?: { page_number?: number; page_size?: number; user_id?: number }): Promise<PaginatedResponse<unknown>> {
    return this.client.get<PaginatedResponse<unknown>>('/api/v1/overtimes', params as Record<string, unknown>);
  }

  // Time entries
  listTimeEntries(params?: { page_number?: number; page_size?: number; user_id?: number }): Promise<PaginatedResponse<unknown>> {
    return this.client.get<PaginatedResponse<unknown>>('/api/v1/time-entries', params as Record<string, unknown>);
  }
}
