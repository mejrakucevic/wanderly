/**
 * In-memory SAMPLE data for features that have no API yet: saved places (map),
 * expenses and itinerary activities.
 *
 * Trips and diary entries are real and live in `travel-store.ts` (loaded from the Node API).
 * Nothing here is saved; changes are lost when the app reloads. The shapes match the
 * database row types, so these screens can switch to the API later without layout changes.
 */
import { useSyncExternalStore } from 'react';

import type { Expense, Location, TripActivity } from '@/types/models';
import { addDays, todayISO } from '@/utils/format';

export type SampleState = {
  activities: TripActivity[];
  expenses: Expense[];
  locations: Location[];
};

export type ExpenseInput = Pick<Expense, 'trip_id' | 'title' | 'amount' | 'category' | 'expense_date'>;

export const EXPENSE_CATEGORIES = ['food', 'transport', 'stay', 'activities', 'shopping', 'other'] as const;

const USER = 'sample-user';
let nextId = 1;
const id = (prefix: string) => `${prefix}-${nextId++}`;
const stamp = () => new Date().toISOString();

function seed(): SampleState {
  const today = todayISO();
  const created = stamp();
  const base = { user_id: USER, created_at: created, updated_at: created };

  const place = (name: string, city: string | null, country: string, code: string, latitude: number, longitude: number, visitedDaysAgo: number | null, notes: string | null = null): Location => ({
    ...base, id: id('loc'), name, city, country, country_code: code, latitude, longitude,
    status: visitedDaysAgo === null ? 'wishlist' : 'visited',
    visited_at: visitedDaysAgo === null ? null : addDays(today, -visitedDaysAgo), notes,
  });

  const locations: Location[] = [
    place('Fushimi Inari Shrine', 'Kyoto', 'Japan', 'JP', 34.9671, 135.7727, 1, 'Go at sunrise to beat the crowds.'),
    place('Seljalandsfoss', null, 'Iceland', 'IS', 63.6156, -19.9886, 125),
    place('Baščaršija', 'Sarajevo', 'Bosnia and Herzegovina', 'BA', 43.8597, 18.4313, 259, 'Best ćevapi of my life.'),
    place('Belém Tower', 'Lisbon', 'Portugal', 'PT', 38.6916, -9.2160, null),
    place('Livraria Lello', 'Porto', 'Portugal', 'PT', 41.1469, -8.6148, null),
    place('Jardin Majorelle', 'Marrakech', 'Morocco', 'MA', 31.6417, -8.0033, null),
    place('Table Mountain', 'Cape Town', 'South Africa', 'ZA', -33.9628, 18.4098, null),
    place('Central Park', 'New York', 'United States', 'US', 40.7829, -73.9654, null),
    place('Caminito', 'Buenos Aires', 'Argentina', 'AR', -34.6393, -58.3631, null),
  ];

  // Activities and expenses belong to real trips, which only exist in the API,
  // so they start empty and only hold what you add during this session.
  return { activities: [], expenses: [], locations };
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
