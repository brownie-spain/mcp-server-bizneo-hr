import { BizneoClient } from '../client.js';
import type { CustomField } from '../types.js';

export class CustomFieldsResource {
  constructor(private readonly client: BizneoClient) {}

  list(params?: { entity?: string }): Promise<{ data: CustomField[] }> {
    return this.client.get<{ data: CustomField[] }>('/api/v1/custom-fields', params as Record<string, unknown>);
  }
}
