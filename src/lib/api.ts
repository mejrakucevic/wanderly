import { getSupabase } from '@/lib/supabase';

const baseUrl = process.env.EXPO_PUBLIC_API_URL?.trim().replace(/\/+$/, '');

export class ApiRequestError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

export async function apiRequest<T>(path: string, method = 'GET', body?: unknown): Promise<T> {
  if (!baseUrl) throw new Error('Add EXPO_PUBLIC_API_URL to .env.local and reload the app.');
  const { data, error } = await getSupabase().auth.getSession();
  if (error) throw error;
  if (!data.session) throw new ApiRequestError('Sign in to access your travel data.', 401);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${data.session.access_token}`,
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      signal: controller.signal,
    });
    if (response.status === 204) return undefined as T;
    const result = await response.json();
    if (!response.ok) {
      const message = typeof result?.error === 'string' ? result.error : 'The API request failed.';
      throw new ApiRequestError(message, response.status);
    }
    return result as T;
  } finally {
    clearTimeout(timeout);
  }
}
