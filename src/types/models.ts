import type { Database } from './database';

export type Row<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Insert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Update<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
export type Profile = Row<'profiles'>;
export type Trip = Row<'trips'>;
export type DiaryEntry = Row<'diary_entries'>;
export type Location = Row<'locations'>;
export type Expense = Row<'expenses'>;
export type TripActivity = Row<'trip_activities'>;
export type TripLocation = Row<'trip_locations'>;
export type DiaryPhoto = Row<'diary_photos'>;
export type UserCountry = Row<'user_countries'>;
