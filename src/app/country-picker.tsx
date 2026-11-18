import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { AppIcon } from '@/components/ui/app-icon';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { ALL_COUNTRIES, countryFlag, type CountryOption } from '@/constants/countries';
import { CONTINENTS } from '@/constants/continents';
import { Radius, Spacing } from '@/constants/theme';
import { countryActions, errorMessage, useTravelData } from '@/data/travel-store';
import { useTheme } from '@/hooks/use-theme';
import type { CountryStatus } from '@/services/countries';
import { goBack } from '@/utils/navigation';

/** Ignores case and accents, so "cote" finds "Côte d’Ivoire". */
const normalize = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

export default function CountryPickerScreen() {
  const theme = useTheme();
  const params = useLocalSearchParams<{ status?: string }>();
  const [status, setStatus] = useState<CountryStatus>(params.status === 'wishlist' ? 'wishlist' : 'visited');
  const { countries } = useTravelData();
  const [query, setQuery] = useState('');
  const [busyCode, setBusyCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const byCode = new Map(countries.map((c) => [c.country_code, c]));
  const search = normalize(query);
  const results = search
    ? ALL_COUNTRIES.filter((c) => normalize(c.name).includes(search) || c.code.toLowerCase() === search)
    : ALL_COUNTRIES;
  const addedCount = countries.filter((c) => c.status === status).length;

  /** Tap: add to this list, move here from the other list, or remove if already here. */
  async function toggle(option: CountryOption) {
    if (busyCode) return;
    const existing = byCode.get(option.code);
    setBusyCode(option.code);
    setError(null);
    try {
      if (existing?.status === status) await countryActions.remove(existing.id);
      else await countryActions.set(option.code, status);
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setBusyCode(null);
    }
  }

  return (
    <SafeAreaView edges={['top', 'bottom', 'left', 'right']} style={[styles.page, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <View style={styles.headerSide} />
        <ThemedText accessibilityRole="header" style={styles.title} numberOfLines={1}>
          Add countries
        </ThemedText>
        <Pressable accessibilityRole="button" onPress={() => goBack()} hitSlop={8} style={[styles.headerSide, styles.right]}>
          <ThemedText themeColor="primary" style={styles.done}>Done</ThemedText>
        </Pressable>
      </View>

      <View style={styles.top}>
        <SegmentedControl
          segments={[{ value: 'visited', label: 'Been there' }, { value: 'wishlist', label: 'Want to go' }]}
          value={status}
          onChange={setStatus}
        />
        <View style={[styles.search, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <AppIcon name="search" color={theme.textSecondary} size={18} />
          <TextInput
            accessibilityLabel="Search countries"
            placeholder="Search countries"
            placeholderTextColor={theme.textSecondary}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            returnKeyType="search"
            clearButtonMode="while-editing"
            style={[styles.searchInput, { color: theme.text }]}
          />
        </View>
        <ThemedText type="small" themeColor="textSecondary">
          {addedCount} selected · tap a country to add or remove it
        </ThemedText>
        {error ? <ThemedText accessibilityRole="alert" type="small" themeColor="danger">{error}</ThemedText> : null}
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.code}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.list}
        ListEmptyComponent={<ThemedText themeColor="textSecondary" style={styles.empty}>No country matches “{query.trim()}”.</ThemedText>}
        renderItem={({ item }) => {
          const existing = byCode.get(item.code);
          const selected = existing?.status === status;
          const inOtherList = existing && !selected;
          return (
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: selected, busy: busyCode === item.code }}
              accessibilityLabel={item.name}
              onPress={() => void toggle(item)}
              style={({ pressed }) => [styles.row, { borderBottomColor: theme.border }, pressed && { opacity: 0.7 }]}>
              <ThemedText style={styles.flag}>{countryFlag(item.code)}</ThemedText>
              <View style={styles.flex}>
                <ThemedText style={selected ? styles.bold : undefined}>{item.name}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {CONTINENTS[item.continent].name}
                  {inOtherList ? ` · in “${existing.status === 'visited' ? 'Been there' : 'Want to go'}”, tap to move` : ''}
                </ThemedText>
              </View>
              {busyCode === item.code
                ? <ActivityIndicator color={theme.primary} />
                : selected
                  ? <AppIcon name={status === 'visited' ? 'check' : 'heart'} color={status === 'visited' ? theme.primary : theme.pinWishlist} size={22} />
                  : <View style={[styles.circle, { borderColor: theme.border }]} />}
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.three, minHeight: 56, borderBottomWidth: StyleSheet.hairlineWidth },
  headerSide: { minWidth: 72, minHeight: 44, justifyContent: 'center' },
  right: { alignItems: 'flex-end' },
  title: { flex: 1, textAlign: 'center', fontWeight: '700' },
  done: { fontWeight: '700' },
  top: { padding: Spacing.four, paddingBottom: Spacing.two, gap: Spacing.two, width: '100%', maxWidth: 640, alignSelf: 'center' },
  search: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, borderWidth: 1, borderRadius: Radius.pill, paddingHorizontal: Spacing.three, minHeight: 48 },
  searchInput: { flex: 1, fontSize: 16, paddingVertical: Spacing.two },
  list: { paddingHorizontal: Spacing.four, paddingBottom: Spacing.five, width: '100%', maxWidth: 640, alignSelf: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, minHeight: 60, paddingVertical: Spacing.two, borderBottomWidth: StyleSheet.hairlineWidth },
  flag: { fontSize: 28, lineHeight: 36 },
  flex: { flex: 1 },
  bold: { fontWeight: '700' },
  circle: { width: 22, height: 22, borderRadius: Radius.pill, borderWidth: 2 },
  empty: { textAlign: 'center', paddingVertical: Spacing.five },
});
