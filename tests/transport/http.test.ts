import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BizneoHRApi } from '../../src/api/index.js';

// Mock the MCP SDK to avoid real network calls
vi.mock('@modelcontextprotocol/sdk/server/streamableHttp.js', () => ({
  StreamableHTTPServerTransport: vi.fn().mockImplementation(() => ({
    sessionId: 'mock-session-id',
    onclose: undefined,
    handleRequest: vi.fn().mockResolvedValue(undefined),
  })),
}));

vi.mock('@modelcontextprotocol/sdk/server/express.js', () => ({
  createMcpExpressApp: vi.fn().mockReturnValue({
    use: vi.fn(),
    post: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
    listen: vi.fn().mockImplementation((_port: number, _host: string, cb: () => void) => {
      cb();
      return { close: vi.fn() };
    }),
  }),
}));

vi.mock('@modelcontextprotocol/sdk/types.js', () => ({
  isInitializeRequest: vi.fn().mockReturnValue(true),
}));

vi.mock('../../src/mcp/server.js', () => ({
  createMcpServer: vi.fn().mockReturnValue({
    connect: vi.fn().mockResolvedValue(undefined),
  }),
}));

function mockApi(): BizneoHRApi {
  return {
    users: { list: vi.fn() },
    absences: {},
    timeAttendance: {},
    organizations: {},
    expenses: {},
    roles: {},
    customFields: {},
    projects: {},
    goals: {},
    payrolls: {},
    learning: {},
    getRateLimiterStats: vi.fn(),
  } as unknown as BizneoHRApi;
}

describe('startHttpServer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts without throwing', async () => {
    const { startHttpServer } = await import('../../src/transport/http.js');
    const api = mockApi();

    await expect(startHttpServer(api, 3001, '127.0.0.1')).resolves.not.toThrow();
  });
});
