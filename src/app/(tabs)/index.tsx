import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ContinentProgressCard } from '@/components/map/continent-progress-card';
import { PlacesMap } from '@/components/map/places-map';
import { ThemedText } from '@/components/themed-text';
import { TripCard } from '@/components/trips/trip-card';
import { AppIcon } from '@/components/ui/app-icon';
import { Card } from '@/components/ui/card';
import { ChipGroup } from '@/components/ui/chip';
import { IconButton } from '@/components/ui/icon-button';
import { SampleBadge } from '@/components/ui/sample-badge';
import { Screen } from '@/components/ui/screen';
import { SectionHeader } from '@/components/ui/section-header';
import { countryFlag } from '@/constants/countries';
import { Radius, Spacing } from '@/constants/theme';
import { useSampleData } from '@/data/sample-store';
import { useTravelData } from '@/data/travel-store';
import { useCurrentCountry } from '@/hooks/use-current-country';
import { useTheme } from '@/hooks/use-theme';
import type { Location } from '@/types/models';
import { formatDate, tripPhase } from '@/utils/format';

type Filter = 'all' | 'visited' | 'wishlist';
const FILTERS = [
  { value: 'all', label: 'All places' },
  { value: 'visited', label: 'Been there' },
  { value: 'wishlist', label: 'Want to go' },
] as const;

export default function MapScreen() {
  const theme = useTheme();
  const { locations } = useSampleData();
  const { trips, countries } = useTravelData();
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const places = locations.filter((l) => filter === 'all' || l.status === filter);
  const selected = places.find((l) => l.id === selectedId) ?? null;
  const visited = locations.filter((l) => l.status === 'visited');
  const visitedCodes = countries.filter((c) => c.status === 'visited').map((c) => c.country_code);
  const wishlistCount = countries.length - visitedCodes.length;
  const current = useCurrentCountry();
  const nextTrip = trips
    .filter((t) => tripPhase(t) !== 'past')
    .sort((a, b) => a.start_date.localeCompare(b.start_date))[0];

  return (
    <Screen eyebrow="Wanderly" title="Your world">
      <SampleBadge />
      <ChipGroup label="Filter places" options={FILTERS} value={filter} onChange={(value) => { setFilter(value); setSelectedId(null); }} />

      <PlacesMap places={places} selectedId={selectedId} onSelect={setSelectedId} showsUserLocation={current.hasPermission}>
        <View pointerEvents="none" style={[styles.legend, { backgroundColor: theme.backgroundElement }]}>
          <LegendDot color={theme.primary} label={`Been there · ${visited.length}`} />
          <LegendDot color={theme.pinWishlist} label={`Want to go · ${locations.length - visited.length}`} />
        </View>
        {selected ? (
          <Card style={[styles.selected, { borderColor: theme.primary }]}>
            <PlaceRow place={selected} showNotes />
            <IconButton icon="close" label="Show all places" size={36} onPress={() => setSelectedId(null)} />
          </Card>
        ) : null}
      </PlacesMap>

      {/* Right under the map: your countries at a glance, and a + to add more. */}
      <View style={styles.countries}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`My countries: been to ${visitedCodes.length}, want to go to ${wishlistCount}`}
          accessibilityHint="Opens your list of countries"
          onPress={() => router.push('/countries')}
          style={({ pressed }) => [styles.countriesInfo, pressed && { opacity: 0.7 }]}>
          {visitedCodes.length > 0 ? (
            <ThemedText style={styles.flags} numberOfLines={1}>
              {visitedCodes.slice(0, 6).map(countryFlag).join(' ')}
              {visitedCodes.length > 6 ? <ThemedText type="small" themeColor="textSecondary"> +{visitedCodes.length - 6}</ThemedText> : null}
            </ThemedText>
          ) : null}
          <ThemedText type="small" themeColor="textSecondary">
            {countries.length === 0
              ? 'Add the countries you’ve visited or dream of'
              : `Been to ${visitedCodes.length} · Want to go to ${wishlistCount}`}
          </ThemedText>
        </Pressable>
        <IconButton icon="add" label="Add a country" variant="primary" onPress={() => router.push('/country-picker')} />
      </View>

      <ContinentProgressCard visitedCodes={visitedCodes} current={current} />

      {nextTrip ? (
        <View style={styles.section}>
          <SectionHeader title={tripPhase(nextTrip) === 'ongoing' ? 'You’re travelling' : 'Next adventure'} />
          <TripCard trip={nextTrip} />
        </View>
      ) : null}

      <View style={styles.section}>
        <SectionHeader title="Saved places" detail="Tap a place to find it on the map." />
        <Card>
          {places.map((place, index) => (
            <Pressable
              key={place.id}
              accessibilityRole="button"
              accessibilityState={{ selected: place.id === selectedId }}
              onPress={() => setSelectedId(place.id)}
              style={({ pressed }) => [index > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.border }, pressed && { opacity: 0.7 }]}>
              <PlaceRow place={place} />
            </Pressable>
          ))}
          {places.length === 0 ? <ThemedText themeColor="textSecondary">No places here yet.</ThemedText> : null}
        </Card>
        <ThemedText type="small" themeColor="textSecondary">Adding your own pins is coming soon.</ThemedText>
      </View>
    </Screen>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <ThemedText type="small" themeColor="textSecondary">{label}</ThemedText>
    </View>
  );
}

function PlaceRow({ place, showNotes = false }: { place: Location; showNotes?: boolean }) {
  const theme = useTheme();
  const isVisited = place.status === 'visited';
  const where = [place.city, place.country].filter(Boolean).join(', ');
  return (
    <View style={styles.place}>
      <View style={[styles.placeIcon, { backgroundColor: isVisited ? theme.primary : theme.pinWishlist }]}>
        <AppIcon name={isVisited ? 'check' : 'heart'} color="#FFFFFF" size={18} />
      </View>
      <View style={styles.flex}>
        <ThemedText style={styles.placeName}>{place.name}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {where}{isVisited && place.visited_at ? ` · ${formatDate(place.visited_at, { month: 'short', year: 'numeric' })}` : ''}
        </ThemedText>
        {showNotes && place.notes ? <ThemedText type="small" style={styles.notes}>{place.notes}</ThemedText> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  legend: { position: 'absolute', top: Spacing.three, left: Spacing.three, flexDirection: 'row', gap: Spacing.three, borderRadius: Radius.pill, paddingHorizontal: Spacing.three, paddingVertical: Spacing.one, boxShadow: '0 1px 4px rgba(45, 25, 61, 0.2)' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one + 2 },
  dot: { width: 10, height: 10, borderRadius: Radius.pill },
  selected: { position: 'absolute', left: Spacing.three, right: Spacing.three, bottom: Spacing.three, flexDirection: 'row', alignItems: 'center', gap: Spacing.two, borderWidth: 2, paddingVertical: Spacing.one },
  section: { gap: Spacing.three },
  place: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.three, paddingVertical: Spacing.two, minHeight: 56 },
  placeIcon: { width: 36, height: 36, borderRadius: Radius.pill, alignItems: 'center', justifyContent: 'center' },
  placeName: { fontWeight: '700' },
  notes: { marginTop: Spacing.one },
  flex: { flex: 1 },
  countries: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, marginTop: -Spacing.two },
  countriesInfo: { flex: 1, gap: Spacing.half, minHeight: 44, justifyContent: 'center' },
  flags: { fontSize: 22, lineHeight: 30 },
});
