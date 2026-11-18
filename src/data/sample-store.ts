/**
 * In-memory SAMPLE data for the one feature that has no API yet: trip expenses.
 *
 * Trips, plans, diary entries and countries are real and live in `travel-store.ts` (loaded from the Node API).
 * Nothing here is saved; changes are lost when the app reloads. The shapes match the
 * database row types, so these screens can switch to the API later without layout changes.
 */
import { useSyncExternalStore } from 'react';

import type { Expense } from '@/types/models';

export type SampleState = {
  expenses: Expense[];
};

export type ExpenseInput = Pick<Expense, 'trip_id' | 'title' | 'amount' | 'category' | 'expense_date'>;

export const EXPENSE_CATEGORIES = ['food', 'transport', 'stay', 'activities', 'shopping', 'other'] as const;

const USER = 'sample-user';
let nextId = 1;
const id = (prefix: string) => `${prefix}-${nextId++}`;
const stamp = () => new Date().toISOString();

function seed(): SampleState {
  // Expenses belong to real trips, which only exist in the API,
  // so they start empty and only hold what you add during this session.
  return { expenses: [] };
}

let state = seed();
const listeners = new Set<() => void>();

function setState(update: (current: SampleState) => SampleState) {
  state = update(state);
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useSampleData(): SampleState {
  return useSyncExternalStore(subscribe, () => state, () => state);
}

export const sampleActions = {
  createExpense(input: ExpenseInput) {
    const now = stamp();
    setState((s) => ({ ...s, expenses: [{ ...input, id: id('exp'), user_id: USER, created_at: now, updated_at: now }, ...s.expenses] }));
  },
  deleteExpense(expenseId: string) {
    setState((s) => ({ ...s, expenses: s.expenses.filter((e) => e.id !== expenseId) }));
  },
};
