import { apiRequest } from '@/lib/api';
import type { Insert, Update, DiaryEntry } from '@/types/models';

export type CreateDiaryEntry = Pick<Insert<'diary_entries'>, 'title' | 'content' | 'entry_date' | 'trip_id' | 'location_id'>;
export type UpdateDiaryEntry = Pick<Update<'diary_entries'>, keyof CreateDiaryEntry>;

export function listDiaryEntries(tripId?: string, limit = 20, offset = 0) {
  const tripFilter = tripId ? `&trip_id=${encodeURIComponent(tripId)}` : '';
  return apiRequest<DiaryEntry[]>(`/api/diary-entries?limit=${limit}&offset=${offset}${tripFilter}`);
}
export function createDiaryEntry(input: CreateDiaryEntry) {
  return apiRequest<DiaryEntry>('/api/diary-entries', 'POST', input);
}
export function updateDiaryEntry(id: string, input: UpdateDiaryEntry) {
  return apiRequest<DiaryEntry>(`/api/diary-entries/${encodeURIComponent(id)}`, 'PATCH', input);
}
export function deleteDiaryEntry(id: string) {
  return apiRequest<void>(`/api/diary-entries/${encodeURIComponent(id)}`, 'DELETE');
}
