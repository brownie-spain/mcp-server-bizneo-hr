import { BizneoClient } from '../client.js';
import type { Organization, CreateOrganizationPayload, PaginatedResponse } from '../types.js';

export class OrganizationsResource {
  constructor(private readonly client: BizneoClient) {}

  list(params?: { page_number?: number; page_size?: number }): Promise<PaginatedResponse<Organization>> {
    return this.client.get<PaginatedResponse<Organization>>('/api/v1/organizations', params as Record<string, unknown>);
  }

  get(organizationId: number): Promise<{ data: Organization }> {
    return this.client.get<{ data: Organization }>(`/api/v1/organizations/${organizationId}`);
  }

  create(payload: CreateOrganizationPayload): Promise<{ data: Organization }> {
    return this.client.post<{ data: Organization }>('/api/v1/organizations', payload);
  }

  update(organizationId: number, payload: Partial<CreateOrganizationPayload>): Promise<{ data: Organization }> {
    return this.client.put<{ data: Organization }>(`/api/v1/organizations/${organizationId}`, payload);
  }

  delete(organizationId: number): Promise<void> {
    return this.client.delete<void>(`/api/v1/organizations/${organizationId}`);
  }

  listPositionDescriptions(organizationId: number): Promise<{ data: unknown[] }> {
    return this.client.get<{ data: unknown[] }>(`/api/v1/organizations/${organizationId}/position-descriptions`);
  }

  // Organization charts
  listCharts(): Promise<{ data: unknown[] }> {
    return this.client.get<{ data: unknown[] }>('/api/v1/organization-charts');
  }

  createChart(payload: Record<string, unknown>): Promise<{ data: unknown }> {
    return this.client.post<{ data: unknown }>('/api/v1/organization-charts', payload);
  }

  updateChart(chartId: number, payload: Record<string, unknown>): Promise<{ data: unknown }> {
    return this.client.put<{ data: unknown }>(`/api/v1/organization-charts/${chartId}`, payload);
  }
}
