import { apiRequest } from '@/lib/api';
import type { Profile, Update } from '@/types/models';

export type UpdateProfile = Pick<Update<'profiles'>, 'username' | 'full_name' | 'avatar_path' | 'bio'>;

export function getProfile() {
  return apiRequest<Profile | null>('/api/profile');
}
export function updateProfile(input: UpdateProfile) {
  return apiRequest<Profile>('/api/profile', 'PATCH', input);
}
