import { apiRequest } from '@/lib/api';
import type { Expense } from '@/types/models';

export const EXPENSE_CATEGORIES = ['food', 'transport', 'stay', 'activities', 'shopping', 'other'] as const;
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export type ExpenseInput = { title: string; amount: number; category: ExpenseCategory; expense_date: string };
export type CreateExpense = ExpenseInput & { trip_id: string };

export function listExpenses(limit = 100, offset = 0) {
  return apiRequest<Expense[]>(`/api/expenses?limit=${limit}&offset=${offset}`);
}
export function createExpense(input: CreateExpense) {
  return apiRequest<Expense>('/api/expenses', 'POST', input);
}
export function updateExpense(id: string, input: Partial<ExpenseInput>) {
  return apiRequest<Expense>(`/api/expenses/${encodeURIComponent(id)}`, 'PATCH', input);
}
export function deleteExpense(id: string) {
  return apiRequest<void>(`/api/expenses/${encodeURIComponent(id)}`, 'DELETE');
}
