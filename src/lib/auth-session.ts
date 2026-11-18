import type { SupabaseClient, Session } from '@supabase/supabase-js';

import type { Database } from '@/types/database';

export type AuthSessionState = {
  session: Session | null;
  isLoading: boolean;
  error: Error | null;
};

type AuthClient = Pick<SupabaseClient<Database>['auth'], 'onAuthStateChange' | 'getSession'>;

// UI session state only; Supabase must enforce authorization through RLS.
export function watchAuthSession(auth: AuthClient, onChange: (state: AuthSessionState) => void) {
  let active = true;
  let receivedLiveEvent = false;
  const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
    // The explicit getSession read below supplies initial data AND restore errors.
    // INITIAL_SESSION has no error payload and must not mask those errors.
    if (!active || event === 'INITIAL_SESSION') return;
    receivedLiveEvent = true;
    onChange({ session, isLoading: false, error: null });
  });

  void auth.getSession().then(({ data, error }) => {
    if (!active || receivedLiveEvent) return;
    onChange({ session: error ? null : data.session, isLoading: false, error });
  }).catch((cause: unknown) => {
    if (!active || receivedLiveEvent) return;
    onChange({
      session: null,
      isLoading: false,
      error: cause instanceof Error ? cause : new Error('Unable to restore your session.'),
    });
  });

  return () => {
    active = false;
    subscription.unsubscribe();
  };
}
