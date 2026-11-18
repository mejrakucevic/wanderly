import { apiRequest } from '@/lib/api';
import type { UserCountry } from '@/types/models';

export type CountryStatus = 'visited' | 'wishlist';
export type CreateCountry = { country_code: string; status: CountryStatus; visited_at?: string | null };
export type UpdateCountry = { status?: CountryStatus; visited_at?: string | null };

export function listCountries() {
  return apiRequest<UserCountry[]>('/api/countries');
}
export function addCountry(input: CreateCountry) {
  return apiRequest<UserCountry>('/api/countries', 'POST', input);
}
export function updateCountry(id: string, input: UpdateCountry) {
  return apiRequest<UserCountry>(`/api/countries/${encodeURIComponent(id)}`, 'PATCH', input);
}
export function removeCountry(id: string) {
  return apiRequest<void>(`/api/countries/${encodeURIComponent(id)}`, 'DELETE');
}
