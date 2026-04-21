import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import Bottleneck from 'bottleneck';
import { config } from '../config/index.js';

export class BizneoApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'BizneoApiError';
  }
}

export class RateLimitError extends Error {
  constructor() {
    super('Rate limit exceeded. Request was dropped by the limiter.');
    this.name = 'RateLimitError';
  }
}

export interface ClientOptions {
  apiToken?: string;
  baseUrl?: string;
  rateLimitRps?: number;
  rateLimitConcurrent?: number;
}

export class BizneoClient {
  private readonly http: AxiosInstance;
  private readonly limiter: Bottleneck;

  constructor(options: ClientOptions = {}) {
    const apiToken = options.apiToken ?? config.BIZNEO_API_TOKEN;
    const baseUrl = options.baseUrl ?? config.BIZNEO_API_BASE_URL;
    const rps = options.rateLimitRps ?? config.BIZNEO_RATE_LIMIT_RPS;
    const concurrent = options.rateLimitConcurrent ?? config.BIZNEO_RATE_LIMIT_CONCURRENT;

    this.http = axios.create({
      baseURL: `${baseUrl}/v1`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      params: {
        token: apiToken,
      },
    });

    this.limiter = new Bottleneck({
      reservoir: rps,
      reservoirRefreshAmount: rps,
      reservoirRefreshInterval: 1000,
      maxConcurrent: concurrent,
      minTime: Math.ceil(1000 / rps),
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.http.interceptors.response.use(
      (response) => response,
      (error) => {
        if (axios.isAxiosError(error) && error.response) {
          const { status, data } = error.response;
          const message =
            data?.message ??
            data?.error ??
            `Bizneo API error: ${status}`;
          const errors = data?.errors;
          throw new BizneoApiError(message, status, errors);
        }
        throw error;
      },
    );
  }

  async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    return this.schedule(() =>
      this.http.get<T>(path, { params }).then((r) => r.data),
    );
  }

  async post<T>(
    path: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.schedule(() =>
      this.http.post<T>(path, data, config).then((r) => r.data),
    );
  }

  async put<T>(path: string, data?: unknown): Promise<T> {
    return this.schedule(() =>
      this.http.put<T>(path, data).then((r) => r.data),
    );
  }

  async patch<T>(path: string, data?: unknown): Promise<T> {
    return this.schedule(() =>
      this.http.patch<T>(path, data).then((r) => r.data),
    );
  }

  async delete<T = void>(path: string): Promise<T> {
    return this.schedule(() =>
      this.http.delete<T>(path).then((r: AxiosResponse<T>) => r.data),
    );
  }

  private schedule<T>(fn: () => Promise<T>): Promise<T> {
    return this.limiter.schedule(fn);
  }

  getRateLimiterStats(): Bottleneck.Counts {
    return this.limiter.counts();
  }
}
