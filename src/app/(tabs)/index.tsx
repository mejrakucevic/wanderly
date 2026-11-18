import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ContinentProgressCard } from '@/components/map/continent-progress-card';
import { PlacesMap } from '@/components/map/places-map';
import { ThemedText } from '@/components/themed-text';
import { TripCard } from '@/components/trips/trip-card';
import { AppIcon } from '@/components/ui/app-icon';
import { Card } from '@/components/ui/card';
import { IconButton } from '@/components/ui/icon-button';
import { Screen } from '@/components/ui/screen';
import { SectionHeader } from '@/components/ui/section-header';
import { CONTINENTS, continentOf } from '@/constants/continents';
import { countryFlag, countryName, countryPosition } from '@/constants/countries';
import { Radius, Spacing } from '@/constants/theme';
import { useTravelData } from '@/data/travel-store';
import { useCurrentCountry } from '@/hooks/use-current-country';
import { useTheme } from '@/hooks/use-theme';
import type { Location, UserCountry } from '@/types/models';
import { formatDate, tripPhase } from '@/utils/format';

type Filter = 'all' | 'visited' | 'wishlist';

export default function MapScreen() {
  const theme = useTheme();
  const { trips, countries } = useTravelData();
  // One pin per country on your lists, placed at its capital.
  const pins = countries.flatMap(countryPin);
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const places = pins.filter((l) => filter === 'all' || l.status === filter);
  const selected = places.find((l) => l.id === selectedId) ?? null;
  const visitedCodes = countries.filter((c) => c.status === 'visited').map((c) => c.country_code);
  const wishlistCount = countries.length - visitedCodes.length;
  const current = useCurrentCountry();
  const nextTrip = trips
    .filter((t) => tripPhase(t) !== 'past')
    .sort((a, b) => a.start_date.localeCompare(b.start_date))[0];

  return (
    <Screen eyebrow="Wanderly" title="Your world">
      {/* Map and your country progress in one panel, so everything fits without scrolling. */}
      <View style={[styles.panel, { borderColor: theme.border, backgroundColor: theme.backgroundElement }]}>
        <PlacesMap embedded height={280} places={places} selectedId={selectedId} onSelect={setSelectedId} showsUserLocation={current.hasPermission}>
          {/* The legend doubles as the filter: tap a status to show only those pins, tap again for all. */}
          <View style={[styles.legend, { backgroundColor: theme.backgroundElement }]}>
            <LegendFilter color={theme.primary} label={`Been there · ${visitedCodes.length}`} selected={filter === 'visited'}
              onPress={() => { setFilter(filter === 'visited' ? 'all' : 'visited'); setSelectedId(null); }} />
            <LegendFilter color={theme.pinWishlist} label={`Want to go · ${wishlistCount}`} selected={filter === 'wishlist'}
              onPress={() => { setFilter(filter === 'wishlist' ? 'all' : 'wishlist'); setSelectedId(null); }} />
          </View>
          {selected ? (
            <Card style={[styles.selected, { borderColor: theme.primary }]}>
              <PlaceRow place={selected} showNotes />
              <IconButton icon="close" label="Show all countries" size={36} onPress={() => setSelectedId(null)} />
            </Card>
          ) : null}
        </PlacesMap>
        <View style={styles.panelBody}>
          {visitedCodes.length > 0 ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`My countries: been to ${visitedCodes.length}, want to go to ${wishlistCount}`}
              accessibilityHint="Opens your list of countries"
              onPress={() => router.push('/countries')}
              style={({ pressed }) => pressed && { opacity: 0.7 }}>
              <ThemedText style={styles.flags} numberOfLines={1}>
                {visitedCodes.slice(0, 8).map(countryFlag).join(' ')}
                {visitedCodes.length > 8 ? <ThemedText type="small" themeColor="textSecondary"> +{visitedCodes.length - 8}</ThemedText> : null}
              </ThemedText>
            </Pressable>
          ) : null}
          <ContinentProgressCard
            compact
            visitedCodes={visitedCodes}
            current={current}
            action={<IconButton icon="add" label="Add a country" variant="primary" onPress={() => router.push('/country-picker')} />}
          />
        </View>
      </View>

      {nextTrip ? (
        <View style={styles.section}>
          <SectionHeader title={tripPhase(nextTrip) === 'ongoing' ? 'You’re travelling' : 'Next adventure'} />
          <TripCard trip={nextTrip} />
        </View>
      ) : null}

      <View style={styles.section}>
        <SectionHeader title="Your countries" detail="Tap a country to find it on the map." />
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
          {places.length === 0 ? <ThemedText themeColor="textSecondary">No countries here yet. Tap + to add one.</ThemedText> : null}
        </Card>
      </View>
    </Screen>
  );
}

/** Shows a saved country as a map pin, using the same shape as a saved place. */
function countryPin(country: UserCountry): Location[] {
  const position = countryPosition(country.country_code);
  if (!position) return [];
  const continent = continentOf(country.country_code);
  return [{
    id: country.id,
    user_id: country.user_id,
    name: `${countryFlag(country.country_code)} ${countryName(country.country_code)}`,
    city: null,
    country: continent ? CONTINENTS[continent].name : '',
    country_code: country.country_code,
    ...position,
    status: country.status,
    visited_at: country.visited_at,
    notes: null,
    created_at: country.created_at,
    updated_at: country.updated_at,
  }];
}

function LegendFilter({ color, label, selected, onPress }: { color: string; label: string; selected: boolean; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityHint={selected ? 'Shows all countries' : 'Shows only these countries on the map'}
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [styles.legendItem, selected && { backgroundColor: theme.accent }, pressed && { opacity: 0.7 }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <ThemedText type={selected ? 'smallBold' : 'small'} themeColor={selected ? 'text' : 'textSecondary'}>{label}</ThemedText>
    </Pressable>
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
  panel: { borderWidth: 1, borderRadius: Radius.card, overflow: 'hidden' },
  panelBody: { padding: Spacing.three, gap: Spacing.three },
  legend: { position: 'absolute', top: Spacing.two, left: Spacing.two, flexDirection: 'row', gap: Spacing.one, borderRadius: Radius.pill, padding: Spacing.half, boxShadow: '0 1px 4px rgba(45, 25, 61, 0.2)' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one + 2, borderRadius: Radius.pill, paddingHorizontal: Spacing.two, paddingVertical: Spacing.one, minHeight: 32 },
  dot: { width: 10, height: 10, borderRadius: Radius.pill },
  selected: { position: 'absolute', left: Spacing.three, right: Spacing.three, bottom: Spacing.three, flexDirection: 'row', alignItems: 'center', gap: Spacing.two, borderWidth: 2, paddingVertical: Spacing.one },
  section: { gap: Spacing.three },
  place: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.three, paddingVertical: Spacing.two, minHeight: 56 },
  placeIcon: { width: 36, height: 36, borderRadius: Radius.pill, alignItems: 'center', justifyContent: 'center' },
  placeName: { fontWeight: '700' },
  notes: { marginTop: Spacing.one },
  flex: { flex: 1 },
  flags: { fontSize: 22, lineHeight: 30 },
});
