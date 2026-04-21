import { BizneoClient } from '../client.js';
import type { Role, PaginatedResponse } from '../types.js';

export class RolesResource {
  constructor(private readonly client: BizneoClient) {}

  list(params?: { page_number?: number; page_size?: number }): Promise<PaginatedResponse<Role>> {
    return this.client.get<PaginatedResponse<Role>>('/api/v1/roles', params as Record<string, unknown>);
  }

  addUser(roleId: number, userId: number): Promise<void> {
    return this.client.post<void>(`/api/v1/roles/${roleId}/users`, { user_id: userId });
  }

  removeUser(roleId: number, userId: number): Promise<void> {
    return this.client.delete<void>(`/api/v1/roles/${roleId}/users/${userId}`);
  }

  addTaxon(roleId: number, taxonId: number): Promise<void> {
    return this.client.post<void>(`/api/v1/roles/${roleId}/taxons`, { taxon_id: taxonId });
  }

  removeTaxon(roleId: number, taxonId: number): Promise<void> {
    return this.client.delete<void>(`/api/v1/roles/${roleId}/taxons/${taxonId}`);
  }
}
