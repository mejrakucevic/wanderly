import type { AppIconName } from '@/components/ui/app-icon';
import type { ActivityCategory } from '@/services/activities';

export type PlanCategory = {
  id: ActivityCategory;
  /** Section heading on the trip's Plan tab. */
  title: string;
  /** Singular, for buttons like "Add stay". */
  noun: string;
  icon: AppIconName;
  titlePlaceholder: string;
  /** Label for the first date (e.g. check-in) and, for stays, the end date. */
  dateLabel: string;
  endDateLabel?: string;
  timeLabel: string;
  /** Icons the user can pick for an item in this section. */
  icons: { id: AppIconName; label: string }[];
};

/** Plan sections, in the order they appear on the Plan tab. */
export const PLAN_CATEGORIES: PlanCategory[] = [
  { id: 'stay', title: 'Stays', noun: 'stay', icon: 'stay', titlePlaceholder: 'Hotel, apartment or hostel name', dateLabel: 'Check-in', endDateLabel: 'Check-out', timeLabel: 'Check-in time', icons: [
    { id: 'hotel', label: 'Hotel' }, { id: 'apartment', label: 'Apartment' }, { id: 'hostel', label: 'Hostel' },
    { id: 'lodge', label: 'Lodge' }, { id: 'camping', label: 'Camping' },
  ] },
  { id: 'transport', title: 'Transport', noun: 'transport', icon: 'transport', titlePlaceholder: 'Flight Sarajevo → Lisbon, FlixBus to Porto…', dateLabel: 'Departure', timeLabel: 'Departure time', icons: [
    { id: 'plane', label: 'Plane' }, { id: 'train', label: 'Train' }, { id: 'bus', label: 'Bus' },
    { id: 'car', label: 'Car' }, { id: 'ferry', label: 'Ferry' }, { id: 'taxi', label: 'Taxi' },
  ] },
  { id: 'activity', title: 'Activities', noun: 'activity', icon: 'activity', titlePlaceholder: 'Museum, tour, concert…', dateLabel: 'Date', timeLabel: 'Start time', icons: [
    { id: 'museum', label: 'Museum' }, { id: 'walk', label: 'Walk' }, { id: 'hike', label: 'Hike' }, { id: 'movie', label: 'Movie' },
    { id: 'show', label: 'Show' }, { id: 'beach', label: 'Beach' }, { id: 'tour', label: 'Tour' }, { id: 'sport', label: 'Sport' },
  ] },
  { id: 'food', title: 'Food & drinks', noun: 'restaurant', icon: 'food', titlePlaceholder: 'Restaurant or café', dateLabel: 'Date', timeLabel: 'Reservation time', icons: [
    { id: 'restaurant', label: 'Restaurant' }, { id: 'cafe', label: 'Café' }, { id: 'bar', label: 'Bar' }, { id: 'fast-food', label: 'Fast food' },
  ] },
  { id: 'other', title: 'Other', noun: 'item', icon: 'other', titlePlaceholder: 'Insurance, SIM card, visa…', dateLabel: 'Date', timeLabel: 'Time', icons: [
    { id: 'documents', label: 'Documents' }, { id: 'insurance', label: 'Insurance' }, { id: 'sim', label: 'SIM card' }, { id: 'shopping', label: 'Shopping' },
  ] },
];

export function planCategory(id: string): PlanCategory {
  return PLAN_CATEGORIES.find((c) => c.id === id) ?? PLAN_CATEGORIES[PLAN_CATEGORIES.length - 1];
}

/** The icon to show for a plan item: the one the user picked, or its section's default. */
export function planItemIcon(item: { category: string; icon?: string | null }): AppIconName {
  const category = planCategory(item.category);
  return category.icons.find((choice) => choice.id === item.icon)?.id ?? category.icon;
}
