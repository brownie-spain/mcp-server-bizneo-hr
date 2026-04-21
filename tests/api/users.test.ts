import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UsersResource } from '../../src/api/resources/users.js';
import type { BizneoClient } from '../../src/api/client.js';

function mockClient(overrides: Partial<BizneoClient> = {}): BizneoClient {
  return {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    getRateLimiterStats: vi.fn(),
    ...overrides,
  } as unknown as BizneoClient;
}

describe('UsersResource', () => {
  let client: BizneoClient;
  let users: UsersResource;

  beforeEach(() => {
    client = mockClient();
    users = new UsersResource(client);
  });

  describe('list', () => {
    it('calls GET /api/v1/users with params', async () => {
      const response = { data: [], meta: { page_number: 1, page_size: 25, total_entries: 0, total_pages: 0 } };
      vi.mocked(client.get).mockResolvedValue(response);

      const result = await users.list({ page_number: 1, page_size: 10 });

      expect(client.get).toHaveBeenCalledWith('/api/v1/users', { page_number: 1, page_size: 10 });
      expect(result).toBe(response);
    });

    it('calls GET /api/v1/users without params', async () => {
      vi.mocked(client.get).mockResolvedValue({ data: [], meta: {} });

      await users.list();

      expect(client.get).toHaveBeenCalledWith('/api/v1/users', undefined);
    });
  });

  describe('get', () => {
    it('calls GET /api/v1/users/:id', async () => {
      const user = { data: { id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com' } };
      vi.mocked(client.get).mockResolvedValue(user);

      const result = await users.get(1);

      expect(client.get).toHaveBeenCalledWith('/api/v1/users/1', undefined);
      expect(result).toBe(user);
    });

    it('includes folders param when requested', async () => {
      vi.mocked(client.get).mockResolvedValue({ data: {} });

      await users.get(42, true);

      expect(client.get).toHaveBeenCalledWith('/api/v1/users/42', { folders: true });
    });
  });

  describe('create', () => {
    it('calls POST /api/v1/users with payload', async () => {
      const payload = { first_name: 'Jane', last_name: 'Doe', email: 'jane@example.com' };
      const response = { data: { id: 2, ...payload } };
      vi.mocked(client.post).mockResolvedValue(response);

      const result = await users.create(payload);

      expect(client.post).toHaveBeenCalledWith('/api/v1/users', payload);
      expect(result).toBe(response);
    });
  });

  describe('update', () => {
    it('calls PUT /api/v1/users/:id with payload', async () => {
      const payload = { job_title: 'Engineer' };
      vi.mocked(client.put).mockResolvedValue({ data: { id: 1, ...payload } });

      await users.update(1, payload);

      expect(client.put).toHaveBeenCalledWith('/api/v1/users/1', payload);
    });
  });

  describe('terminate', () => {
    it('calls POST /api/v1/users/:id/terminate', async () => {
      const payload = { termination_date: '2024-12-31', termination_type: 'voluntary' as const };
      vi.mocked(client.post).mockResolvedValue({ data: {} });

      await users.terminate(1, payload);

      expect(client.post).toHaveBeenCalledWith('/api/v1/users/1/terminate', payload);
    });
  });

  describe('sendInvite', () => {
    it('calls POST /api/v1/users/:id/send-invite', async () => {
      vi.mocked(client.post).mockResolvedValue(undefined);

      await users.sendInvite(5);

      expect(client.post).toHaveBeenCalledWith('/api/v1/users/5/send-invite');
    });
  });

  describe('documents', () => {
    it('lists documents for a user', async () => {
      vi.mocked(client.get).mockResolvedValue({ data: [], meta: {} });

      await users.listDocuments(1, { page_size: 10 });

      expect(client.get).toHaveBeenCalledWith('/api/v1/users/1/documents', { page_size: 10 });
    });

    it('deletes a document', async () => {
      vi.mocked(client.delete).mockResolvedValue(undefined);

      await users.deleteDocument(1, 99);

      expect(client.delete).toHaveBeenCalledWith('/api/v1/users/1/documents/99');
    });
  });

  describe('work contracts', () => {
    it('lists work contracts', async () => {
      vi.mocked(client.get).mockResolvedValue({ data: [] });

      await users.listWorkContracts(1);

      expect(client.get).toHaveBeenCalledWith('/api/v1/users/1/work-contracts');
    });

    it('creates a work contract', async () => {
      const payload = { start_date: '2024-01-01', contract_type: 'permanent' };
      vi.mocked(client.post).mockResolvedValue({ data: { id: 10, ...payload } });

      await users.createWorkContract(1, payload);

      expect(client.post).toHaveBeenCalledWith('/api/v1/users/1/work-contracts', payload);
    });
  });

  describe('salaries', () => {
    it('lists salaries', async () => {
      vi.mocked(client.get).mockResolvedValue({ data: [] });

      await users.listSalaries(1);

      expect(client.get).toHaveBeenCalledWith('/api/v1/users/1/salaries');
    });

    it('creates a salary', async () => {
      const payload = { amount: 50000, currency: 'EUR', start_date: '2024-01-01' };
      vi.mocked(client.post).mockResolvedValue({ data: { id: 20, ...payload } });

      await users.createSalary(1, payload);

      expect(client.post).toHaveBeenCalledWith('/api/v1/users/1/salaries', payload);
    });
  });
});
