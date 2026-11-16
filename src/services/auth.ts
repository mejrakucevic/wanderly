import { getSupabase } from '@/lib/supabase';

export async function signUp(email: string, password: string) {
  const { data, error } = await getSupabase().auth.signUp({ email: email.trim(), password });
  if (error) throw error;
  // With email confirmation enabled, data.session is null until confirmation.
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await getSupabase().auth.signInWithPassword({ email: email.trim(), password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await getSupabase().auth.signOut();
  if (error) throw error;
}
