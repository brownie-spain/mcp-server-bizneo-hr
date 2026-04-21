import { BizneoClient } from '../client.js';
import type {
  Expense,
  ExpenseKind,
  CreateExpensePayload,
  ListExpensesParams,
  PaginatedResponse,
} from '../types.js';

export class ExpensesResource {
  constructor(private readonly client: BizneoClient) {}

  list(params?: ListExpensesParams): Promise<PaginatedResponse<Expense>> {
    return this.client.get<PaginatedResponse<Expense>>('/api/v1/expenses', params as Record<string, unknown>);
  }

  get(expenseId: number): Promise<{ data: Expense }> {
    return this.client.get<{ data: Expense }>(`/api/v1/expenses/${expenseId}`);
  }

  create(payload: CreateExpensePayload): Promise<{ data: Expense }> {
    return this.client.post<{ data: Expense }>('/api/v1/expenses', payload);
  }

  update(expenseId: number, payload: Partial<CreateExpensePayload>): Promise<{ data: Expense }> {
    return this.client.put<{ data: Expense }>(`/api/v1/expenses/${expenseId}`, payload);
  }

  delete(expenseId: number): Promise<void> {
    return this.client.delete<void>(`/api/v1/expenses/${expenseId}`);
  }

  // Expense kinds
  listKinds(): Promise<{ data: ExpenseKind[] }> {
    return this.client.get<{ data: ExpenseKind[] }>('/api/v1/expense-kinds');
  }

  createKind(payload: { name: string; [key: string]: unknown }): Promise<{ data: ExpenseKind }> {
    return this.client.post<{ data: ExpenseKind }>('/api/v1/expense-kinds', payload);
  }

  updateKind(kindId: number, payload: { name?: string; [key: string]: unknown }): Promise<{ data: ExpenseKind }> {
    return this.client.put<{ data: ExpenseKind }>(`/api/v1/expense-kinds/${kindId}`, payload);
  }

  deleteKind(kindId: number): Promise<void> {
    return this.client.delete<void>(`/api/v1/expense-kinds/${kindId}`);
  }
}
