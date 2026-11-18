import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ActionButton } from '@/components/ui/action-button';
import { AppIcon } from '@/components/ui/app-icon';
import { Card } from '@/components/ui/card';
import { DataStatus } from '@/components/ui/data-status';
import { EmptyState } from '@/components/ui/empty-state';
import { IconButton } from '@/components/ui/icon-button';
import { Screen } from '@/components/ui/screen';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { CONTINENTS, continentOf } from '@/constants/continents';
import { countryFlag, countryName } from '@/constants/countries';
import { Spacing } from '@/constants/theme';
import { countryActions, errorMessage, useTravelData } from '@/data/travel-store';
import { useTheme } from '@/hooks/use-theme';
import type { CountryStatus } from '@/services/countries';
import type { UserCountry } from '@/types/models';

export default function CountriesScreen() {
  const theme = useTheme();
  const params = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = useState<CountryStatus>(params.tab === 'wishlist' ? 'wishlist' : 'visited');
  const { countries, status, error, isLoading, reload } = useTravelData();

  const visited = countries.filter((c) => c.status === 'visited');
  const wishlist = countries.filter((c) => c.status === 'wishlist');
  const shown = (tab === 'visited' ? visited : wishlist)
    .slice()
    .sort((a, b) => countryName(a.country_code).localeCompare(countryName(b.country_code)));

  const openPicker = () => router.push({ pathname: '/country-picker', params: { status: tab } });

  function showOptions(country: UserCountry) {
    const name = countryName(country.country_code);
    const other: CountryStatus = country.status === 'visited' ? 'wishlist' : 'visited';
    const run = async (action: () => Promise<unknown>) => {
      try {
        await action();
      } catch (cause) {
        Alert.alert('Something went wrong', errorMessage(cause));
      }
    };
    Alert.alert(`${countryFlag(country.country_code)} ${name}`, undefined, [
      {
        text: other === 'visited' ? 'I’ve been here' : 'Move to “Want to go”',
        onPress: () => void run(() => countryActions.set(country.country_code, other)),
      },
      { text: 'Remove from my countries', style: 'destructive', onPress: () => void run(() => countryActions.remove(country.id)) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  return (
    <Screen
      showBack
      eyebrow="Your world"
      title="My countries"
      action={<IconButton icon="add" label="Add a country" variant="primary" onPress={openPicker} />}
      onRefresh={reload}
      refreshing={status === 'loading' && !isLoading}>
      <SegmentedControl
        segments={[
          { value: 'visited', label: `Been there · ${visited.length}` },
          { value: 'wishlist', label: `Want to go · ${wishlist.length}` },
        ]}
        value={tab}
        onChange={setTab}
      />
      <DataStatus isLoading={isLoading} error={error} onRetry={reload} />

      {shown.length > 0 ? (
        <Card>
          {shown.map((country, index) => {
            const continent = continentOf(country.country_code);
            return (
              <Pressable
                key={country.id}
                accessibilityRole="button"
                accessibilityLabel={countryName(country.country_code)}
                accessibilityHint="Opens options to move or remove this country"
                onPress={() => showOptions(country)}
                style={({ pressed }) => [
                  styles.row,
                  index > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.border },
                  pressed && { opacity: 0.7 },
                ]}>
                <ThemedText style={styles.flag}>{countryFlag(country.country_code)}</ThemedText>
                <View style={styles.flex}>
                  <ThemedText style={styles.name}>{countryName(country.country_code)}</ThemedText>
                  {continent ? <ThemedText type="small" themeColor="textSecondary">{CONTINENTS[continent].name}</ThemedText> : null}
                </View>
                <AppIcon name={country.status === 'visited' ? 'check' : 'heart'} color={country.status === 'visited' ? theme.primary : theme.pinWishlist} size={20} />
              </Pressable>
            );
          })}
        </Card>
      ) : !isLoading && !error ? (
        <>
          <EmptyState
            icon="globe"
            title={tab === 'visited' ? 'Where have you been?' : 'Where do you dream of going?'}
            description={tab === 'visited'
              ? 'Add the countries you’ve already visited and watch your map fill up.'
              : 'Build your travel wishlist, one country at a time.'}
          />
          <ActionButton label="Add a country" onPress={openPicker} />
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, paddingVertical: Spacing.two, minHeight: 56 },
  flag: { fontSize: 28, lineHeight: 36 },
  flex: { flex: 1 },
  name: { fontWeight: '700' },
});
