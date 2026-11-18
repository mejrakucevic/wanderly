import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import { AppState, Platform } from 'react-native';

import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { watchAuthSession, type AuthSessionState } from '@/lib/auth-session';

type AuthState = AuthSessionState & {
  isConfigured: boolean;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AuthSessionState>({ session: null, isLoading: isSupabaseConfigured, error: null });

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let mounted = true;
    let cleanup: (() => void) | undefined;

    function subscribe() {
      const client = getSupabase();
      const stopWatching = watchAuthSession(client.auth, setState);

      const syncRefresh = (state: string | null | undefined) => {
        if (state === 'active') client.auth.startAutoRefresh();
        else client.auth.stopAutoRefresh();
      };
      const appStateSubscription = Platform.OS !== 'web'
        ? AppState.addEventListener('change', syncRefresh)
        : undefined;
      cleanup = () => {
        stopWatching();
        appStateSubscription?.remove();
        if (Platform.OS !== 'web') client.auth.stopAutoRefresh();
      };
      if (Platform.OS !== 'web') syncRefresh(AppState.currentState);
    }

    // Initialize in a callback so configuration errors become recoverable UI state.
    void Promise.resolve().then(() => {
      if (mounted) subscribe();
    }).catch((cause: unknown) => {
      if (!mounted) return;
      setState({ session: null, isLoading: false, error: cause instanceof Error ? cause : new Error('Unable to restore your session.') });
    });

    return () => {
      mounted = false;
      cleanup?.();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, isConfigured: isSupabaseConfigured }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}
