import { BizneoClient } from '../client.js';
import type { Goal, CreateGoalPayload, PaginatedResponse } from '../types.js';

export class GoalsResource {
  constructor(private readonly client: BizneoClient) {}

  list(params?: { page_number?: number; page_size?: number; user_id?: number }): Promise<PaginatedResponse<Goal>> {
    return this.client.get<PaginatedResponse<Goal>>('/api/v1/goals', params as Record<string, unknown>);
  }

  create(payload: CreateGoalPayload): Promise<{ data: Goal }> {
    return this.client.post<{ data: Goal }>('/api/v1/goals', payload);
  }

  updateAchievement(goalId: number, achievement: number): Promise<{ data: Goal }> {
    return this.client.put<{ data: Goal }>(`/api/v1/goals/${goalId}/achievement`, { achievement });
  }
}
