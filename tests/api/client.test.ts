import { describe, it, expect, beforeEach } from 'vitest';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { BizneoClient, BizneoApiError } from '../../src/api/client.js';

// Access the internal axios instance for mocking via the module
let mockAxios: MockAdapter;

describe('BizneoClient', () => {
  let client: BizneoClient;

  beforeEach(() => {
    client = new BizneoClient({
      apiToken: 'test-token',
      baseUrl: 'https://connect.bizneo.com/hcm',
      rateLimitRps: 100,
      rateLimitConcurrent: 10,
    });

    // Intercept at the axios level using a global adapter on the default instance
    mockAxios = new MockAdapter(axios);
  });

  it('should be instantiated with default options', () => {
    const c = new BizneoClient({ apiToken: 'tk', baseUrl: 'https://connect.bizneo.com/hcm' });
    expect(c).toBeInstanceOf(BizneoClient);
  });

  it('should expose rate limiter stats', () => {
    const stats = client.getRateLimiterStats();
    expect(stats).toBeDefined();
    expect(typeof stats.EXECUTING).toBe('number');
  });
});

describe('BizneoApiError', () => {
  it('should store status and errors', () => {
    const err = new BizneoApiError('Not found', 404, { name: ['is required'] });
    expect(err.status).toBe(404);
    expect(err.errors).toEqual({ name: ['is required'] });
    expect(err.message).toBe('Not found');
    expect(err.name).toBe('BizneoApiError');
  });
});
