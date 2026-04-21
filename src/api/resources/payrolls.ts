import { BizneoClient } from '../client.js';
import type {
  PayrollConcept,
  OneTimeEvent,
  PeriodicEvent,
  CreateOneTimeEventPayload,
  PaginatedResponse,
} from '../types.js';

export class PayrollsResource {
  constructor(private readonly client: BizneoClient) {}

  // Concepts
  listConcepts(params?: { page_number?: number; page_size?: number }): Promise<PaginatedResponse<PayrollConcept>> {
    return this.client.get<PaginatedResponse<PayrollConcept>>('/api/v1/concepts', params as Record<string, unknown>);
  }

  createConcept(payload: { name: string; code?: string; [key: string]: unknown }): Promise<{ data: PayrollConcept }> {
    return this.client.post<{ data: PayrollConcept }>('/api/v1/concepts', payload);
  }

  updateConcept(conceptId: number, payload: { name?: string; code?: string; [key: string]: unknown }): Promise<{ data: PayrollConcept }> {
    return this.client.put<{ data: PayrollConcept }>(`/api/v1/concepts/${conceptId}`, payload);
  }

  deleteConcept(conceptId: number): Promise<void> {
    return this.client.delete<void>(`/api/v1/concepts/${conceptId}`);
  }

  // One-time events
  listOneTimeEvents(params?: {
    page_number?: number;
    page_size?: number;
    user_id?: number;
    start_date?: string;
    end_date?: string;
  }): Promise<PaginatedResponse<OneTimeEvent>> {
    return this.client.get<PaginatedResponse<OneTimeEvent>>('/api/v1/one-time-events', params as Record<string, unknown>);
  }

  createOneTimeEvent(payload: CreateOneTimeEventPayload): Promise<{ data: OneTimeEvent }> {
    return this.client.post<{ data: OneTimeEvent }>('/api/v1/one-time-events', payload);
  }

  updateOneTimeEvent(eventId: number, payload: Partial<CreateOneTimeEventPayload>): Promise<{ data: OneTimeEvent }> {
    return this.client.put<{ data: OneTimeEvent }>(`/api/v1/one-time-events/${eventId}`, payload);
  }

  deleteOneTimeEvent(eventId: number): Promise<void> {
    return this.client.delete<void>(`/api/v1/one-time-events/${eventId}`);
  }

  // Periodic events
  listPeriodicEvents(params?: {
    page_number?: number;
    page_size?: number;
    user_id?: number;
  }): Promise<PaginatedResponse<PeriodicEvent>> {
    return this.client.get<PaginatedResponse<PeriodicEvent>>('/api/v1/periodic-events', params as Record<string, unknown>);
  }
}
