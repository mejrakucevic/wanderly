import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { EmptyState } from '@/components/ui/empty-state';
import { Screen } from '@/components/ui/screen';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function ProfileScreen() {
  const theme = useTheme();
  return (
    <Screen eyebrow="Your travel story" title="Hello, explorer." description="See how far your curiosity takes you.">
      <View style={styles.stats}>
        {['Countries visited', 'Trips completed'].map((label) => (
          <View key={label} style={[styles.stat, { backgroundColor: theme.accent }]}>
            <ThemedText style={styles.value} themeColor="primary">—</ThemedText>
            <ThemedText type="small" style={styles.label}>{label}</ThemedText>
          </View>
        ))}
      </View>
      <EmptyState icon="globe" title="A world of possibilities" description="Your visited countries and travel progress will appear here as your story grows." note="Travel statistics aren't connected yet." />
    </Screen>
  );
}

const styles = StyleSheet.create({
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.three },
  stat: { flex: 1, minWidth: 130, borderRadius: Radius.card, padding: Spacing.four, gap: Spacing.two },
  value: { fontSize: 32, lineHeight: 40, fontWeight: '700' },
  label: { flexShrink: 1 },
});
