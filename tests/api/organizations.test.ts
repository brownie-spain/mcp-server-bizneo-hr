import { describe, it, expect, beforeEach, vi } from 'vitest';
import { OrganizationsResource } from '../../src/api/resources/organizations.js';
import type { BizneoClient } from '../../src/api/client.js';

function mockClient(): BizneoClient {
  return {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    getRateLimiterStats: vi.fn(),
  } as unknown as BizneoClient;
}

describe('OrganizationsResource', () => {
  let client: BizneoClient;
  let orgs: OrganizationsResource;

  beforeEach(() => {
    client = mockClient();
    orgs = new OrganizationsResource(client);
  });

  it('lists organizations', async () => {
    vi.mocked(client.get).mockResolvedValue({ data: [], meta: {} });

    await orgs.list({ page_size: 50 });

    expect(client.get).toHaveBeenCalledWith('/api/v1/organizations', { page_size: 50 });
  });

  it('gets an organization', async () => {
    vi.mocked(client.get).mockResolvedValue({ data: { id: 1, name: 'Engineering' } });

    const result = await orgs.get(1);

    expect(client.get).toHaveBeenCalledWith('/api/v1/organizations/1');
    expect(result.data).toBeDefined();
  });

  it('creates an organization', async () => {
    const payload = { name: 'Marketing', kind: 'department' };
    vi.mocked(client.post).mockResolvedValue({ data: { id: 2, ...payload } });

    await orgs.create(payload);

    expect(client.post).toHaveBeenCalledWith('/api/v1/organizations', payload);
  });

  it('updates an organization', async () => {
    vi.mocked(client.put).mockResolvedValue({ data: { id: 1, name: 'Engineering 2.0' } });

    await orgs.update(1, { name: 'Engineering 2.0' });

    expect(client.put).toHaveBeenCalledWith('/api/v1/organizations/1', { name: 'Engineering 2.0' });
  });

  it('deletes an organization', async () => {
    vi.mocked(client.delete).mockResolvedValue(undefined);

    await orgs.delete(1);

    expect(client.delete).toHaveBeenCalledWith('/api/v1/organizations/1');
  });
});
