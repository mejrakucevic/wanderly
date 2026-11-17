import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { TripCard } from '@/components/trips/trip-card';
import { ActionButton } from '@/components/ui/action-button';
import { AppIcon } from '@/components/ui/app-icon';
import { ChipGroup } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
import { IconButton } from '@/components/ui/icon-button';
import { DataStatus } from '@/components/ui/data-status';
import { Screen } from '@/components/ui/screen';
import { SectionHeader } from '@/components/ui/section-header';
import { Radius, Spacing } from '@/constants/theme';
import { useTravelData } from '@/data/travel-store';
import { useTheme } from '@/hooks/use-theme';
import { tripPhase } from '@/utils/format';

type Filter = 'upcoming' | 'past' | 'all';
const FILTERS = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'past', label: 'Past' },
  { value: 'all', label: 'All trips' },
] as const;

export default function TripsScreen() {
  const theme = useTheme();
  const { trips, status, error, isLoading, reload } = useTravelData();
  const [filter, setFilter] = useState<Filter>('upcoming');
  const [query, setQuery] = useState('');

  const search = query.trim().toLowerCase();
  const matching = trips.filter((trip) => !search || `${trip.title} ${trip.destination}`.toLowerCase().includes(search));
  const ongoing = matching.filter((trip) => tripPhase(trip) === 'ongoing');
  const upcoming = matching.filter((trip) => tripPhase(trip) === 'upcoming').sort((a, b) => a.start_date.localeCompare(b.start_date));
  const past = matching.filter((trip) => tripPhase(trip) === 'past').sort((a, b) => b.start_date.localeCompare(a.start_date));
  const sections = [
    { key: 'ongoing', title: 'Happening now', trips: ongoing, show: filter !== 'past' },
    { key: 'upcoming', title: 'Coming up', trips: upcoming, show: filter !== 'past' },
    { key: 'past', title: 'Past adventures', trips: past, show: filter !== 'upcoming' },
  ].filter((section) => section.show && section.trips.length > 0);

  const newTrip = () => router.push('/trip-form');

  return (
    <Screen
      eyebrow="Your next chapter"
      title="My Trips"
      action={<IconButton icon="add" label="Plan a new trip" variant="primary" onPress={newTrip} />}
      onRefresh={reload}
      refreshing={status === 'loading' && !isLoading}>
      <DataStatus isLoading={isLoading} error={error} onRetry={reload} />
      <View style={[styles.search, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
        <AppIcon name="search" color={theme.textSecondary} size={18} />
        <TextInput
          accessibilityLabel="Search trips"
          placeholder="Search trips or destinations"
          placeholderTextColor={theme.textSecondary}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          clearButtonMode="while-editing"
          style={[styles.searchInput, { color: theme.text }]}
        />
      </View>
      <ChipGroup label="Filter trips" options={FILTERS} value={filter} onChange={setFilter} />

      {sections.map((section) => (
        <View key={section.key} style={styles.section}>
          <SectionHeader title={section.title} detail={`${section.trips.length} trip${section.trips.length === 1 ? '' : 's'}`} />
          {section.trips.map((trip) => <TripCard key={trip.id} trip={trip} compact={section.key === 'past'} />)}
        </View>
      ))}

      {sections.length === 0 && !isLoading && !error ? (
        search ? (
          <EmptyState icon="search" title="No trips found" description={`Nothing matches “${query.trim()}”. Try another name or destination.`} />
        ) : (
          <>
            <EmptyState
              icon="trips"
              title={filter === 'past' ? 'No past trips yet' : 'A new adventure starts here'}
              description="Keep your destinations, dates, budget and plans together, from the first idea to the journey home."
            />
            <ActionButton label="Plan a trip" onPress={newTrip} />
          </>
        )
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, borderWidth: 1, borderRadius: Radius.pill, paddingHorizontal: Spacing.three, minHeight: 48 },
  searchInput: { flex: 1, fontSize: 16, paddingVertical: Spacing.two },
  section: { gap: Spacing.three },
});
