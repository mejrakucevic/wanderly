import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { TripCard } from '@/components/trips/trip-card';
import { AppIcon } from '@/components/ui/app-icon';
import { DataStatus } from '@/components/ui/data-status';
import { EmptyState } from '@/components/ui/empty-state';
import { IconButton } from '@/components/ui/icon-button';
import { Screen } from '@/components/ui/screen';
import { Radius, Spacing } from '@/constants/theme';
import { useTravelData } from '@/data/travel-store';
import { useTheme } from '@/hooks/use-theme';
import { formatDate } from '@/utils/format';

export default function EntryDetailScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { entries, trips, isLoading, error, reload } = useTravelData();
  const entry = entries.find((e) => e.id === id);
  const trip = trips.find((t) => t.id === entry?.trip_id);

  if (!entry && (isLoading || error)) {
    return (
      <Screen showBack title="Diary entry">
        <DataStatus isLoading={isLoading} error={error} onRetry={reload} />
      </Screen>
    );
  }
  if (!entry) {
    return (
      <Screen showBack title="Entry not found">
        <EmptyState icon="diary" title="This entry isn’t here anymore" description="It may have been deleted." />
      </Screen>
    );
  }

  return (
    <Screen
      showBack
      eyebrow={formatDate(entry.entry_date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
      title={entry.title}
      action={<IconButton icon="edit" label="Edit entry" onPress={() => router.push({ pathname: '/entry-form', params: { id: entry.id } })} />}>
      <View style={[styles.photo, { backgroundColor: theme.accent }]}>
        <AppIcon name="photo" color={theme.primary} size={32} />
        <ThemedText type="small" themeColor="textSecondary">Photos will appear here</ThemedText>
      </View>
      {entry.content
        ? <ThemedText selectable style={styles.body}>{entry.content}</ThemedText>
        : <ThemedText themeColor="textSecondary">No story written yet. Tap edit to add one.</ThemedText>}
      {trip ? (
        <View style={styles.trip}>
          <ThemedText type="smallBold" themeColor="textSecondary">From the trip</ThemedText>
          <TripCard trip={trip} compact />
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  photo: { height: 180, borderRadius: Radius.card, alignItems: 'center', justifyContent: 'center', gap: Spacing.two },
  body: { fontSize: 17, lineHeight: 28 },
  trip: { gap: Spacing.two },
});
