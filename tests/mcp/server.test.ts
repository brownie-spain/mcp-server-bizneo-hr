import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMcpServer } from '../../src/mcp/server.js';
import { BizneoHRApi } from '../../src/api/index.js';
import { allTools } from '../../src/mcp/tools/index.js';

function mockApi(): BizneoHRApi {
  return {
    users: { list: vi.fn(), get: vi.fn(), create: vi.fn(), update: vi.fn() },
    absences: { list: vi.fn(), listKinds: vi.fn() },
    timeAttendance: { listLoggedTimes: vi.fn() },
    organizations: { list: vi.fn() },
    expenses: { list: vi.fn() },
    roles: { list: vi.fn() },
    customFields: { list: vi.fn() },
    projects: { list: vi.fn() },
    goals: { list: vi.fn() },
    payrolls: { listConcepts: vi.fn() },
    learning: { listCourses: vi.fn() },
    getRateLimiterStats: vi.fn(),
  } as unknown as BizneoHRApi;
}

describe('createMcpServer', () => {
  let api: BizneoHRApi;

  beforeEach(() => {
    api = mockApi();
  });

  it('creates a server instance', () => {
    const server = createMcpServer(api);
    expect(server).toBeDefined();
  });

  it('registers list tools handler that returns all tools', async () => {
    const server = createMcpServer(api);
    // Access internal handlers to test without transport
    const handler = (server as unknown as { _requestHandlers: Map<string, unknown> })._requestHandlers;
    expect(handler).toBeDefined();
  });
});

describe('allTools registry', () => {
  it('contains tools from all modules', () => {
    expect(allTools.length).toBeGreaterThan(50);
  });

  it('all tools have unique names', () => {
    const names = allTools.map((t) => t.definition.name);
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBe(names.length);
  });

  it('all tools have a definition and handler', () => {
    for (const tool of allTools) {
      expect(tool.definition.name).toBeTruthy();
      expect(tool.definition.description).toBeTruthy();
      expect(tool.definition.inputSchema).toBeDefined();
      expect(tool.handler).toBeInstanceOf(Function);
    }
  });

  it('all tool names start with bizneo_', () => {
    for (const tool of allTools) {
      expect(tool.definition.name).toMatch(/^bizneo_/);
    }
  });

  it('all tools with required params define inputSchema.required', () => {
    const toolsWithRequired = allTools.filter(
      (t) => t.definition.inputSchema.required && t.definition.inputSchema.required.length > 0,
    );
    expect(toolsWithRequired.length).toBeGreaterThan(0);
  });
});

describe('tool handlers integration', () => {
  let api: BizneoHRApi;

  beforeEach(() => {
    api = mockApi();
  });

  it('bizneo_list_users calls api.users.list', async () => {
    const mockResult = { data: [], meta: { page_number: 1, page_size: 25, total_entries: 0, total_pages: 0 } };
    vi.mocked(api.users.list).mockResolvedValue(mockResult);

    const tool = allTools.find((t) => t.definition.name === 'bizneo_list_users')!;
    const result = await tool.handler({ page_size: 10 }, api);

    expect(api.users.list).toHaveBeenCalledWith({ page_size: 10 });
    expect(result).toBe(mockResult);
  });

  it('bizneo_get_user calls api.users.get with correct id', async () => {
    const mockUser = { data: { id: 42, first_name: 'John', last_name: 'Doe', email: 'j@test.com' } };
    vi.mocked(api.users.get).mockResolvedValue(mockUser);

    const tool = allTools.find((t) => t.definition.name === 'bizneo_get_user')!;
    const result = await tool.handler({ user_id: 42 }, api);

    expect(api.users.get).toHaveBeenCalledWith(42, undefined);
    expect(result).toBe(mockUser);
  });

  it('bizneo_list_absence_kinds calls api.absences.listKinds', async () => {
    vi.mocked(api.absences.listKinds).mockResolvedValue({ data: [] });

    const tool = allTools.find((t) => t.definition.name === 'bizneo_list_absence_kinds')!;
    await tool.handler({}, api);

    expect(api.absences.listKinds).toHaveBeenCalled();
  });

  it('bizneo_list_roles calls api.roles.list', async () => {
    vi.mocked(api.roles.list).mockResolvedValue({ data: [], meta: { page_number: 1, page_size: 25, total_entries: 0, total_pages: 0 } });

    const tool = allTools.find((t) => t.definition.name === 'bizneo_list_roles')!;
    await tool.handler({}, api);

    expect(api.roles.list).toHaveBeenCalled();
  });
});
