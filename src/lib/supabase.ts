import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

import type { Database } from '@/types/database';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim();
const publishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

export const isSupabaseConfigured = Boolean(url && publishableKey);

let client: SupabaseClient<Database> | undefined;

// Lazy initialization lets the starter screens render before a project is connected,
// and avoids creating a browser session during server rendering.
export function getSupabase() {
  if (!url || !publishableKey) {
    throw new Error('Add your Supabase URL and publishable key to .env.local, then restart Expo.');
  }

  client ??= createClient<Database>(url, publishableKey, {
    auth: {
      ...(Platform.OS !== 'web' ? { storage: AsyncStorage } : {}),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });

  return client;
}
