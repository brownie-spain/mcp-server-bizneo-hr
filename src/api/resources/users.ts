import { BizneoClient } from '../client.js';
import type {
  User,
  CreateUserPayload,
  UpdateUserPayload,
  ListUsersParams,
  UserDocument,
  PaginatedResponse,
  TerminateUserPayload,
  WorkContract,
  CreateWorkContractPayload,
  Salary,
  CreateSalaryPayload,
  Taxon,
} from '../types.js';

export class UsersResource {
  constructor(private readonly client: BizneoClient) {}

  list(params?: ListUsersParams): Promise<PaginatedResponse<User>> {
    return this.client.get<PaginatedResponse<User>>('/api/v1/users', params as Record<string, unknown>);
  }

  get(userId: number, folders?: boolean): Promise<{ data: User }> {
    return this.client.get<{ data: User }>(`/api/v1/users/${userId}`, folders ? { folders: true } : undefined);
  }

  create(payload: CreateUserPayload): Promise<{ data: User }> {
    return this.client.post<{ data: User }>('/api/v1/users', payload);
  }

  update(userId: number, payload: UpdateUserPayload): Promise<{ data: User }> {
    return this.client.put<{ data: User }>(`/api/v1/users/${userId}`, payload);
  }

  terminate(userId: number, payload: TerminateUserPayload): Promise<{ data: User }> {
    return this.client.post<{ data: User }>(`/api/v1/users/${userId}/terminate`, payload);
  }

  sendInvite(userId: number): Promise<void> {
    return this.client.post<void>(`/api/v1/users/${userId}/send-invite`);
  }

  deleteSessions(userIds: number[]): Promise<void> {
    return this.client.delete<void>(`/api/v1/users/sessions?user_ids=${userIds.join(',')}`);
  }

  // Documents
  listDocuments(userId: number, params?: { page_number?: number; page_size?: number }): Promise<PaginatedResponse<UserDocument>> {
    return this.client.get<PaginatedResponse<UserDocument>>(`/api/v1/users/${userId}/documents`, params as Record<string, unknown>);
  }

  deleteDocument(userId: number, documentId: number): Promise<void> {
    return this.client.delete<void>(`/api/v1/users/${userId}/documents/${documentId}`);
  }

  // Avatar
  deleteAvatar(userId: number): Promise<void> {
    return this.client.delete<void>(`/api/v1/users/${userId}/avatar`);
  }

  // Taxons (organization associations)
  listTaxons(userId: number): Promise<{ data: Taxon[] }> {
    return this.client.get<{ data: Taxon[] }>(`/api/v1/users/${userId}/taxons`);
  }

  addTaxon(userId: number, taxonId: number): Promise<{ data: Taxon }> {
    return this.client.post<{ data: Taxon }>(`/api/v1/users/${userId}/taxons`, { taxon_id: taxonId });
  }

  removeTaxon(userId: number, taxonId: number): Promise<void> {
    return this.client.delete<void>(`/api/v1/users/${userId}/taxons/${taxonId}`);
  }

  // Work Contracts
  listWorkContracts(userId: number): Promise<{ data: WorkContract[] }> {
    return this.client.get<{ data: WorkContract[] }>(`/api/v1/users/${userId}/work-contracts`);
  }

  createWorkContract(userId: number, payload: CreateWorkContractPayload): Promise<{ data: WorkContract }> {
    return this.client.post<{ data: WorkContract }>(`/api/v1/users/${userId}/work-contracts`, payload);
  }

  updateWorkContract(userId: number, contractId: number, payload: Partial<CreateWorkContractPayload>): Promise<{ data: WorkContract }> {
    return this.client.put<{ data: WorkContract }>(`/api/v1/users/${userId}/work-contracts/${contractId}`, payload);
  }

  deleteWorkContract(userId: number, contractId: number): Promise<void> {
    return this.client.delete<void>(`/api/v1/users/${userId}/work-contracts/${contractId}`);
  }

  // Salaries
  listSalaries(userId: number): Promise<{ data: Salary[] }> {
    return this.client.get<{ data: Salary[] }>(`/api/v1/users/${userId}/salaries`);
  }

  createSalary(userId: number, payload: CreateSalaryPayload): Promise<{ data: Salary }> {
    return this.client.post<{ data: Salary }>(`/api/v1/users/${userId}/salaries`, payload);
  }

  updateSalary(userId: number, salaryId: number, payload: Partial<CreateSalaryPayload>): Promise<{ data: Salary }> {
    return this.client.put<{ data: Salary }>(`/api/v1/users/${userId}/salaries/${salaryId}`, payload);
  }

  deleteSalary(userId: number, salaryId: number): Promise<void> {
    return this.client.delete<void>(`/api/v1/users/${userId}/salaries/${salaryId}`);
  }
}
