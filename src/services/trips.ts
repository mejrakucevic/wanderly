import { apiRequest } from '@/lib/api';
import type { Insert, Update, Trip } from '@/types/models';

export type CreateTrip = Pick<Insert<'trips'>, 'title' | 'destination' | 'start_date' | 'end_date' | 'description' | 'cover_image_path' | 'budget' | 'currency'>;
export type UpdateTrip = Pick<Update<'trips'>, keyof CreateTrip>;

export function listTrips(limit = 20, offset = 0) {
  return apiRequest<Trip[]>(`/api/trips?limit=${limit}&offset=${offset}`);
}
export function getTrip(id: string) {
  return apiRequest<Trip>(`/api/trips/${encodeURIComponent(id)}`);
}
export function createTrip(input: CreateTrip) {
  return apiRequest<Trip>('/api/trips', 'POST', input);
}
export function updateTrip(id: string, input: UpdateTrip) {
  return apiRequest<Trip>(`/api/trips/${encodeURIComponent(id)}`, 'PATCH', input);
}
export function deleteTrip(id: string) {
  return apiRequest<void>(`/api/trips/${encodeURIComponent(id)}`, 'DELETE');
}
