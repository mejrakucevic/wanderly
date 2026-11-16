import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { TripCover } from '@/components/trips/trip-cover';
import { AppIcon } from '@/components/ui/app-icon';
import { Card } from '@/components/ui/card';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Trip } from '@/types/models';
import { formatDateRange, tripCountdown, tripPhase } from '@/utils/format';

export function TripCard({ trip, compact = false }: { trip: Trip; compact?: boolean }) {
  const theme = useTheme();
  const phase = tripPhase(trip);
  const countdown = tripCountdown(trip);
  const dates = formatDateRange(trip.start_date, trip.end_date);
  return (
    <Card
      accessibilityLabel={`${trip.title}, ${trip.destination}, ${dates}, ${countdown}`}
      onPress={() => router.push({ pathname: '/trip/[id]', params: { id: trip.id } })}
      style={compact ? styles.compact : undefined}>
      {compact ? null : <TripCover id={trip.id} destination={trip.destination} label={phase === 'ongoing' ? 'Happening now' : undefined} />}
      <View style={styles.row}>
        <View style={styles.text}>
          <ThemedText style={styles.title} numberOfLines={1}>{trip.title}</ThemedText>
          <View style={styles.meta}>
            <AppIcon name="calendar" color={theme.textSecondary} size={14} />
            <ThemedText type="small" themeColor="textSecondary">{dates}</ThemedText>
          </View>
        </View>
        <ThemedText type="smallBold" themeColor={phase === 'past' ? 'textSecondary' : 'primary'}>{countdown}</ThemedText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  compact: { paddingVertical: Spacing.three },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, paddingHorizontal: Spacing.one },
  text: { flex: 1, gap: Spacing.half },
  title: { fontSize: 18, lineHeight: 24, fontWeight: '700' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
});
