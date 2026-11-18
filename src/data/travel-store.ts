/**
 * The signed-in user's real trips, trip plans, expenses, diary entries and countries, loaded from the Node API.
 *
 * Screens read from one shared cache, so a trip created in the form appears in the list
 * and detail screens without reloading. Every change is sent to the API first; the cache
 * is only updated after the API confirms it.
 */
import { useEffect, useSyncExternalStore } from 'react';

import { useAuth } from '@/providers/auth-provider';
import * as activitiesApi from '@/services/activities';
import * as countriesApi from '@/services/countries';
import * as diaryApi from '@/services/diary';
import * as expensesApi from '@/services/expenses';
import * as tripsApi from '@/services/trips';
import type { DiaryEntry, Expense, Trip, TripActivity, UserCountry } from '@/types/models';

export type LoadStatus = 'idle' | 'loading' | 'ready' | 'error';

export type TravelState = {
  userId: string | null;
  status: LoadStatus;
  error: string | null;
  trips: Trip[];
  entries: DiaryEntry[];
  activities: TripActivity[];
  expenses: Expense[];
  countries: UserCountry[];
};

const EMPTY: TravelState = { userId: null, status: 'idle', error: null, trips: [], entries: [], activities: [], expenses: [], countries: [] };
const PAGE_SIZE = 100; // the API's maximum page size

let state = EMPTY;
let loadId = 0;
const listeners = new Set<() => void>();

function setState(update: (current: TravelState) => TravelState) {
  state = update(state);
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function errorMessage(cause: unknown) {
  if (cause instanceof Error && cause.name === 'AbortError') return 'The server took too long to answer. Check your connection and try again.';
  if (cause instanceof TypeError) return 'Can’t reach the Wanderly server. Is the backend running?';
  return cause instanceof Error ? cause.message : 'Something went wrong. Please try again.';
}

async function loadAll<T>(fetchPage: (limit: number, offset: number) => Promise<T[]>) {
  const all: T[] = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const page = await fetchPage(PAGE_SIZE, offset);
    all.push(...page);
    if (page.length < PAGE_SIZE) return all;
  }
}

/** Loads (or reloads) everything for the given user. */
export async function loadTravelData(userId: string) {
  const id = ++loadId;
  setState((s) => ({ ...(s.userId === userId ? s : EMPTY), userId, status: 'loading', error: null }));
  try {
    const [trips, entries, activities, expenses, countries] = await Promise.all([
      loadAll((limit, offset) => tripsApi.listTrips(limit, offset)),
      loadAll((limit, offset) => diaryApi.listDiaryEntries(undefined, limit, offset)),
      loadAll((limit, offset) => activitiesApi.listActivities(limit, offset)),
      loadAll((limit, offset) => expensesApi.listExpenses(limit, offset)),
      countriesApi.listCountries(),
    ]);
    if (id !== loadId) return; // a newer load (or sign-out) replaced this one
    setState((s) => ({ ...s, status: 'ready', trips, entries, activities, expenses, countries }));
  } catch (cause) {
    if (id !== loadId) return;
    setState((s) => ({ ...s, status: 'error', error: errorMessage(cause) }));
  }
}

/**
 * Returns the signed-in user's trips and entries and loads them on first use.
 * Switching accounts clears the previous user's data.
 */
export function useTravelData() {
  const userId = useAuth().session?.user.id ?? null;
  const data = useSyncExternalStore(subscribe, () => state, () => state);

  useEffect(() => {
    if (!userId) {
      if (state.userId !== null) { loadId++; setState(() => EMPTY); }
      return;
    }
    if (state.userId !== userId || state.status === 'idle') void loadTravelData(userId);
  }, [userId]);

  const current = data.userId === userId ? data : EMPTY;
  return {
    ...current,
    /** True until the first load finishes, so screens don't flash "not found". */
    isLoading: current.status === 'idle' || (current.status === 'loading' && current.trips.length === 0 && current.entries.length === 0 && current.countries.length === 0),
    reload: () => (userId ? loadTravelData(userId) : Promise.resolve()),
  };
}

export const tripActions = {
  async create(input: tripsApi.CreateTrip) {
    const trip = await tripsApi.createTrip(input);
    setState((s) => ({ ...s, trips: [trip, ...s.trips] }));
    return trip;
  },
  async update(id: string, input: tripsApi.UpdateTrip) {
    const trip = await tripsApi.updateTrip(id, input);
    setState((s) => ({ ...s, trips: s.trips.map((t) => (t.id === id ? trip : t)) }));
    return trip;
  },
  async remove(id: string) {
    await tripsApi.deleteTrip(id);
    // Entries, plan items and expenses need a trip, so a successful delete means the database removed them too.
    setState((s) => ({
      ...s,
      trips: s.trips.filter((t) => t.id !== id),
      entries: s.entries.filter((e) => e.trip_id !== id),
      activities: s.activities.filter((a) => a.trip_id !== id),
      expenses: s.expenses.filter((e) => e.trip_id !== id),
    }));
  },
};

export const entryActions = {
  async create(input: diaryApi.CreateDiaryEntry) {
    const entry = await diaryApi.createDiaryEntry(input);
    setState((s) => ({ ...s, entries: [entry, ...s.entries] }));
    return entry;
  },
  async update(id: string, input: diaryApi.UpdateDiaryEntry) {
    const entry = await diaryApi.updateDiaryEntry(id, input);
    setState((s) => ({ ...s, entries: s.entries.map((e) => (e.id === id ? entry : e)) }));
    return entry;
  },
  async remove(id: string) {
    await diaryApi.deleteDiaryEntry(id);
    setState((s) => ({ ...s, entries: s.entries.filter((e) => e.id !== id) }));
  },
};

export const countryActions = {
  /** Adds a country, or moves it to the other list if it's already there. */
  async set(countryCode: string, status: countriesApi.CountryStatus) {
    const existing = state.countries.find((c) => c.country_code === countryCode);
    if (existing?.status === status) return existing;
    const country = existing
      ? await countriesApi.updateCountry(existing.id, { status })
      : await countriesApi.addCountry({ country_code: countryCode, status });
    setState((s) => ({
      ...s,
      countries: existing ? s.countries.map((c) => (c.id === country.id ? country : c)) : [country, ...s.countries],
    }));
    return country;
  },
  async remove(id: string) {
    await countriesApi.removeCountry(id);
    setState((s) => ({ ...s, countries: s.countries.filter((c) => c.id !== id) }));
  },
};

export const activityActions = {
  async create(input: activitiesApi.CreateActivity) {
    const activity = await activitiesApi.createActivity(input);
    setState((s) => ({ ...s, activities: [...s.activities, activity] }));
    return activity;
  },
  async update(id: string, input: Partial<activitiesApi.ActivityInput>) {
    const activity = await activitiesApi.updateActivity(id, input);
    setState((s) => ({ ...s, activities: s.activities.map((a) => (a.id === id ? activity : a)) }));
    return activity;
  },
  async remove(id: string) {
    await activitiesApi.deleteActivity(id);
    setState((s) => ({ ...s, activities: s.activities.filter((a) => a.id !== id) }));
  },
};

export const expenseActions = {
  async create(input: expensesApi.CreateExpense) {
    const expense = await expensesApi.createExpense(input);
    setState((s) => ({ ...s, expenses: [expense, ...s.expenses] }));
    return expense;
  },
  async update(id: string, input: Partial<expensesApi.ExpenseInput>) {
    const expense = await expensesApi.updateExpense(id, input);
    setState((s) => ({ ...s, expenses: s.expenses.map((e) => (e.id === id ? expense : e)) }));
    return expense;
  },
  async remove(id: string) {
    await expensesApi.deleteExpense(id);
    setState((s) => ({ ...s, expenses: s.expenses.filter((e) => e.id !== id) }));
  },
};
