/**
 * In-memory SAMPLE data for designing and testing the UI flow.
 *
 * Nothing here is saved to Supabase or sent to the API. Changes are lost when the app reloads.
 * The shapes match the database row types, so screens can later switch to `@/services/*`
 * (the Node API) without changing their layout.
 */
import { useSyncExternalStore } from 'react';

import type { DiaryEntry, Expense, Location, Trip, TripActivity } from '@/types/models';
import { addDays, todayISO } from '@/utils/format';

export type SampleState = {
  trips: Trip[];
  activities: TripActivity[];
  expenses: Expense[];
  entries: DiaryEntry[];
  locations: Location[];
};

export type TripInput = Pick<Trip, 'title' | 'destination' | 'start_date' | 'end_date' | 'description' | 'budget' | 'currency'>;
export type ExpenseInput = Pick<Expense, 'trip_id' | 'title' | 'amount' | 'category' | 'expense_date'>;
export type EntryInput = Pick<DiaryEntry, 'trip_id' | 'title' | 'content' | 'entry_date'>;

export const EXPENSE_CATEGORIES = ['food', 'transport', 'stay', 'activities', 'shopping', 'other'] as const;

const USER = 'sample-user';
let nextId = 1;
const id = (prefix: string) => `${prefix}-${nextId++}`;
const stamp = () => new Date().toISOString();

function seed(): SampleState {
  const today = todayISO();
  const created = stamp();
  const base = { user_id: USER, created_at: created, updated_at: created };

  const trips: Trip[] = [
    { ...base, id: 'trip-kyoto', title: 'Kyoto in autumn', destination: 'Kyoto, Japan', start_date: addDays(today, -2), end_date: addDays(today, 5), description: 'Temples, maple leaves and as much matcha as possible.', cover_image_path: null, budget: 2400, currency: 'EUR' },
    { ...base, id: 'trip-lisbon', title: 'Lisbon & Porto', destination: 'Portugal', start_date: addDays(today, 18), end_date: addDays(today, 25), description: 'Tram 28, pastéis de nata and a train ride up the coast.', cover_image_path: null, budget: 1600, currency: 'EUR' },
    { ...base, id: 'trip-iceland', title: 'Iceland ring road', destination: 'Iceland', start_date: addDays(today, -130), end_date: addDays(today, -120), description: 'Ten days, one rental car, endless waterfalls.', cover_image_path: null, budget: 3200, currency: 'EUR' },
    { ...base, id: 'trip-sarajevo', title: 'Weekend in Sarajevo', destination: 'Sarajevo, Bosnia and Herzegovina', start_date: addDays(today, -260), end_date: addDays(today, -258), description: null, cover_image_path: null, budget: 300, currency: 'EUR' },
  ];

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

  const activity = (trip: Trip, day: number, title: string, start_time: string | null, description: string | null = null, sort_order = 0): TripActivity => ({
    ...base, id: id('act'), trip_id: trip.id, location_id: null, title, description,
    activity_date: addDays(trip.start_date, day), start_time, sort_order, ai_generated: false,
  });
  const [kyoto, lisbon, iceland, sarajevo] = trips;
  const activities: TripActivity[] = [
    activity(kyoto, 0, 'Check in at the ryokan', '15:00'),
    activity(kyoto, 0, 'Evening walk through Gion', '19:00', null, 1),
    activity(kyoto, 1, 'Fushimi Inari at sunrise', '06:00', 'Hike to the summit, then breakfast nearby.'),
    activity(kyoto, 1, 'Nishiki Market lunch', '12:30', null, 1),
    activity(kyoto, 3, 'Arashiyama bamboo grove', '08:00'),
    activity(kyoto, 4, 'Tea ceremony', '14:00', 'Booked: confirmation in email.'),
    activity(lisbon, 0, 'Arrive in Lisbon', '11:20'),
    activity(lisbon, 1, 'Tram 28 + Alfama', '10:00'),
    activity(lisbon, 4, 'Train to Porto', '09:00'),
  ];

  const expense = (trip: Trip, day: number, title: string, amount: number, category: string): Expense => ({
    ...base, id: id('exp'), trip_id: trip.id, title, amount, category, expense_date: addDays(trip.start_date, day),
  });
  const expenses: Expense[] = [
    expense(kyoto, 0, 'Ryokan (7 nights)', 980, 'stay'),
    expense(kyoto, 0, 'JR Pass', 210, 'transport'),
    expense(kyoto, 1, 'Nishiki Market', 34, 'food'),
    expense(kyoto, 1, 'Ceramics shop', 58, 'shopping'),
    expense(iceland, 0, 'Car rental', 890, 'transport'),
    expense(iceland, 0, 'Guesthouses', 1320, 'stay'),
    expense(iceland, 3, 'Glacier hike', 240, 'activities'),
    expense(iceland, 5, 'Groceries & fuel', 410, 'food'),
    expense(sarajevo, 0, 'Hotel', 140, 'stay'),
    expense(sarajevo, 1, 'Ćevapi & coffee', 22, 'food'),
  ];

  const entry = (trip: Trip, day: number, title: string, content: string): DiaryEntry => ({
    ...base, id: id('entry'), trip_id: trip.id, location_id: null, title, content, entry_date: addDays(trip.start_date, day),
  });
  const entries: DiaryEntry[] = [
    entry(kyoto, 1, 'A thousand orange gates', 'We started the climb in the dark and reached the top just as the sun came through the trees. My legs hurt, but every step was worth it.'),
    entry(kyoto, 0, 'First night in Gion', 'Lanterns, wooden houses and the quietest streets I have ever walked in a big city.'),
    entry(iceland, 2, 'Behind the waterfall', 'Soaked, freezing and completely happy. Seljalandsfoss from behind looks unreal.'),
    entry(iceland, 7, 'Northern lights, finally', 'Waited three nights. At 1 a.m. the sky turned green and nobody said a word.'),
    entry(sarajevo, 1, 'Coffee in the old town', 'Bosnian coffee, a lokum on the side, and the call to prayer echoing over Baščaršija.'),
  ];

  return { trips, activities, expenses, entries, locations };
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
  createTrip(input: TripInput): Trip {
    const now = stamp();
    const trip: Trip = { ...input, id: id('trip'), user_id: USER, cover_image_path: null, created_at: now, updated_at: now };
    setState((s) => ({ ...s, trips: [trip, ...s.trips] }));
    return trip;
  },
  updateTrip(tripId: string, input: TripInput) {
    setState((s) => ({ ...s, trips: s.trips.map((t) => (t.id === tripId ? { ...t, ...input, updated_at: stamp() } : t)) }));
  },
  /** Also removes the trip's plan, expenses and diary entries (hosted delete behavior is still unverified). */
  deleteTrip(tripId: string) {
    setState((s) => ({
      ...s,
      trips: s.trips.filter((t) => t.id !== tripId),
      activities: s.activities.filter((a) => a.trip_id !== tripId),
      expenses: s.expenses.filter((e) => e.trip_id !== tripId),
      entries: s.entries.filter((e) => e.trip_id !== tripId),
    }));
  },
  createExpense(input: ExpenseInput) {
    const now = stamp();
    setState((s) => ({ ...s, expenses: [{ ...input, id: id('exp'), user_id: USER, created_at: now, updated_at: now }, ...s.expenses] }));
  },
  deleteExpense(expenseId: string) {
    setState((s) => ({ ...s, expenses: s.expenses.filter((e) => e.id !== expenseId) }));
  },
  createEntry(input: EntryInput): DiaryEntry {
    const now = stamp();
    const entry: DiaryEntry = { ...input, id: id('entry'), user_id: USER, location_id: null, created_at: now, updated_at: now };
    setState((s) => ({ ...s, entries: [entry, ...s.entries] }));
    return entry;
  },
  updateEntry(entryId: string, input: EntryInput) {
    setState((s) => ({ ...s, entries: s.entries.map((e) => (e.id === entryId ? { ...e, ...input, updated_at: stamp() } : e)) }));
  },
  deleteEntry(entryId: string) {
    setState((s) => ({ ...s, entries: s.entries.filter((e) => e.id !== entryId) }));
  },
};
