import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Screen } from '@/components/ui/screen';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ActionButton } from '@/components/ui/action-button';
import { useTravelData } from '@/data/travel-store';
import { tripPhase } from '@/utils/format';
import { useAuth } from '@/providers/auth-provider';
import { signOut } from '@/services/auth';

export default function ProfileScreen() {
  const theme = useTheme();
  const { session } = useAuth();
  const { countries, trips, isLoading } = useTravelData();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignOut() {
    if (isSigningOut) return;
    setIsSigningOut(true);
    setError(null);
    try {
      await signOut();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to sign out. Please try again.');
    } finally {
      setIsSigningOut(false);
    }
  }
  return (
    <Screen eyebrow="Your travel story" title="Hello, explorer." description="See how far your curiosity takes you.">
      <View style={[styles.account, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
        <ThemedText type="smallBold" themeColor="primary">Your account</ThemedText>
        <ThemedText selectable>{session?.user.email}</ThemedText>
        {error ? <ThemedText accessibilityRole="alert" themeColor="danger">{error}</ThemedText> : null}
        <ActionButton secondary label={isSigningOut ? 'Signing out…' : 'Sign out'} loading={isSigningOut} onPress={() => void handleSignOut()} />
      </View>
      <View style={styles.stats}>
        {[
          { label: 'Countries visited', value: countries.filter((c) => c.status === 'visited').length },
          { label: 'Countries on my wishlist', value: countries.filter((c) => c.status === 'wishlist').length },
          { label: 'Trips completed', value: trips.filter((t) => tripPhase(t) === 'past').length },
        ].map(({ label, value }) => (
          <View key={label} style={[styles.stat, { backgroundColor: theme.accent }]}>
            <ThemedText style={styles.value} themeColor="primary">{isLoading ? '—' : value}</ThemedText>
            <ThemedText type="small" style={styles.label}>{label}</ThemedText>
          </View>
        ))}
      </View>
      <ActionButton secondary label="My countries" onPress={() => router.push('/countries')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  account: { borderWidth: 1, borderRadius: Radius.card, padding: Spacing.four, gap: Spacing.three },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.three },
  stat: { flex: 1, minWidth: 130, borderRadius: Radius.card, padding: Spacing.four, gap: Spacing.two },
  value: { fontSize: 32, lineHeight: 40, fontWeight: '700' },
  label: { flexShrink: 1 },
});
