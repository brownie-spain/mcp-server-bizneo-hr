import { BizneoClient } from '../client.js';
import type { Project, CreateProjectPayload, PaginatedResponse } from '../types.js';

export class ProjectsResource {
  constructor(private readonly client: BizneoClient) {}

  list(params?: { page_number?: number; page_size?: number; active?: boolean }): Promise<PaginatedResponse<Project>> {
    return this.client.get<PaginatedResponse<Project>>('/api/v1/projects', params as Record<string, unknown>);
  }

  create(payload: CreateProjectPayload): Promise<{ data: Project }> {
    return this.client.post<{ data: Project }>('/api/v1/projects', payload);
  }

  update(projectId: number, payload: Partial<CreateProjectPayload>): Promise<{ data: Project }> {
    return this.client.patch<{ data: Project }>(`/api/v1/projects/${projectId}`, payload);
  }

  assignUser(projectId: number, userId: number): Promise<void> {
    return this.client.post<void>(`/api/v1/projects/${projectId}/assignments`, { user_id: userId });
  }

  unassignUser(projectId: number, userId: number): Promise<void> {
    return this.client.delete<void>(`/api/v1/projects/${projectId}/assignments/${userId}`);
  }
}
