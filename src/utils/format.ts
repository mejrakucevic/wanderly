/** Date and money helpers. Dates are `YYYY-MM-DD` strings, matching the API and database. */

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function parseISODate(value: string): Date | null {
  if (!ISO_DATE.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  // Rejects impossible dates such as 2026-02-31, which Date would silently roll over.
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
}

export function toISODate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function addDays(iso: string, days: number): string {
  const date = parseISODate(iso) ?? new Date();
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

/** Whole days from `from` to `to` (positive when `to` is later). */
export function daysBetween(from: string, to: string): number {
  const a = parseISODate(from);
  const b = parseISODate(to);
  if (!a || !b) return 0;
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

export function formatDate(iso: string, options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }): string {
  const date = parseISODate(iso);
  return date ? date.toLocaleDateString(undefined, options) : iso;
}

export function formatDateRange(start: string, end: string): string {
  const a = parseISODate(start);
  const b = parseISODate(end);
  if (!a || !b) return `${start} – ${end}`;
  const sameYear = a.getFullYear() === b.getFullYear();
  const first = a.toLocaleDateString(undefined, sameYear ? { day: 'numeric', month: 'short' } : { day: 'numeric', month: 'short', year: 'numeric' });
  const last = b.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  return start === end ? last : `${first} – ${last}`;
}

export function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: amount % 1 === 0 ? 0 : 2 }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

export type TripPhase = 'upcoming' | 'ongoing' | 'past';

export function tripPhase(trip: { start_date: string; end_date: string }, today = todayISO()): TripPhase {
  if (trip.end_date < today) return 'past';
  if (trip.start_date > today) return 'upcoming';
  return 'ongoing';
}

/** Short status line for a trip, e.g. "In 12 days", "Day 3 of 7", "Ended 2 months ago". */
export function tripCountdown(trip: { start_date: string; end_date: string }, today = todayISO()): string {
  const phase = tripPhase(trip, today);
  if (phase === 'ongoing') {
    return `Day ${daysBetween(trip.start_date, today) + 1} of ${daysBetween(trip.start_date, trip.end_date) + 1}`;
  }
  if (phase === 'upcoming') {
    const days = daysBetween(today, trip.start_date);
    return days === 1 ? 'Tomorrow' : `In ${days} days`;
  }
  const days = daysBetween(trip.end_date, today);
  if (days < 31) return days === 1 ? 'Ended yesterday' : `Ended ${days} days ago`;
  const months = Math.round(days / 30);
  return months < 12 ? `Ended ${months} month${months === 1 ? '' : 's'} ago` : `Ended ${formatDate(trip.end_date, { month: 'long', year: 'numeric' })}`;
}
