import { apiRequest } from '@/lib/api';
import type { TripActivity } from '@/types/models';

export type ActivityCategory = 'stay' | 'transport' | 'activity' | 'food' | 'other';
export type ActivityInput = {
  category: ActivityCategory;
  title: string;
  description?: string | null;
  activity_date: string;
  end_date?: string | null;
  /** `HH:MM` */
  start_time?: string | null;
  cost?: number | null;
  /** Optional icon id from `PLAN_CATEGORIES[].icons`; null shows the section icon. */
  icon?: string | null;
};
export type CreateActivity = ActivityInput & { trip_id: string };

export function listActivities(limit = 100, offset = 0) {
  return apiRequest<TripActivity[]>(`/api/activities?limit=${limit}&offset=${offset}`);
}
export function createActivity(input: CreateActivity) {
  return apiRequest<TripActivity>('/api/activities', 'POST', input);
}
export function updateActivity(id: string, input: Partial<ActivityInput>) {
  return apiRequest<TripActivity>(`/api/activities/${encodeURIComponent(id)}`, 'PATCH', input);
}
export function deleteActivity(id: string) {
  return apiRequest<void>(`/api/activities/${encodeURIComponent(id)}`, 'DELETE');
}
