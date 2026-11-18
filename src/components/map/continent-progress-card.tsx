import { useState } from 'react';
import { ActivityIndicator, Linking, Platform, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AppIcon } from '@/components/ui/app-icon';
import { Card } from '@/components/ui/card';
import { ChipGroup } from '@/components/ui/chip';
import { ProgressBar } from '@/components/ui/progress-bar';
import { CONTINENT_IDS, continentOf, continentProgress, WORLD_COUNTRY_COUNT, type ContinentId } from '@/constants/continents';
import { Spacing } from '@/constants/theme';
import type { CurrentCountry } from '@/hooks/use-current-country';
import { useTheme } from '@/hooks/use-theme';

export function ContinentProgressCard({ visitedCodes, current }: { visitedCodes: string[]; current: CurrentCountry }) {
  const theme = useTheme();
  const [chosen, setChosen] = useState<ContinentId | null>(null);

  const progress = continentProgress(visitedCodes);
  const visitedTotal = CONTINENT_IDS.reduce((sum, id) => sum + progress[id].visited, 0);
  const worldPercent = Math.round((visitedTotal / WORLD_COUNTRY_COUNT) * 100);
  const here = continentOf(current.countryCode);
  // Default: the continent you're in → the one you've explored most → Europe.
  const mostExplored = [...CONTINENT_IDS].sort((a, b) => progress[b].visited - progress[a].visited)[0];
  const shown = progress[chosen ?? here ?? (progress[mostExplored].visited > 0 ? mostExplored : 'europe')];
  const isHere = shown.id === here;

  const heading = isHere && current.source === 'location' ? `You’re in ${shown.name}`
    : isHere && current.source === 'region' ? `Your region · ${shown.name}`
      : shown.name;

  const options = CONTINENT_IDS.map((id) => ({
    value: id,
    label: `${progress[id].name} ${progress[id].visited}/${progress[id].total}`,
  }));

  return (
    <Card style={styles.card}>
      <View style={styles.top}>
        <View style={styles.flex}>
          <View style={styles.heading}>
            {isHere ? <AppIcon name="pin" color={theme.primary} size={16} /> : null}
            <ThemedText type="smallBold" themeColor="primary">{heading}</ThemedText>
          </View>
          <ThemedText style={styles.count} accessibilityLabel={`${shown.visited} of ${shown.total} countries in ${shown.name} explored`}>
            {shown.visited}<ThemedText style={styles.total} themeColor="textSecondary"> / {shown.total} countries</ThemedText>
          </ThemedText>
        </View>
        <ThemedText style={styles.percent} themeColor="primary">{shown.percent}%</ThemedText>
      </View>
      <ProgressBar value={shown.visited / shown.total} label={`${shown.percent} percent of ${shown.name} explored`} />
      <ThemedText type="small" themeColor="textSecondary">
        Around the world: {visitedTotal} / {WORLD_COUNTRY_COUNT} countries · {worldPercent}%
      </ThemedText>

      <ChipGroup label="Choose a continent" options={options} value={shown.id} onChange={setChosen} />

      {Platform.OS !== 'web' ? <LocationStatus current={current} onUseLocation={() => { setChosen(null); void current.locate(); }} /> : null}
    </Card>
  );
}

function LocationStatus({ current, onUseLocation }: { current: CurrentCountry; onUseLocation: () => void }) {
  const theme = useTheme();
  if (current.isLocating) {
    return (
      <View style={styles.status}>
        <ActivityIndicator size="small" color={theme.primary} />
        <ThemedText type="small" themeColor="textSecondary">Finding where you are…</ThemedText>
      </View>
    );
  }
  if (current.source === 'location' && !current.error) {
    return current.countryName ? <ThemedText type="small" themeColor="textSecondary">Current location: {current.countryName}</ThemedText> : null;
  }
  if (!current.canAsk && !current.hasPermission) {
    return (
      <Pressable accessibilityRole="button" onPress={() => void Linking.openSettings()} style={styles.status}>
        <ThemedText type="small" themeColor="textSecondary">Location is off for Wanderly. </ThemedText>
        <ThemedText type="smallBold" themeColor="primary">Open Settings</ThemedText>
      </Pressable>
    );
  }
  return (
    <View style={styles.statusBlock}>
      {current.error ? <ThemedText type="small" themeColor="danger">{current.error}</ThemedText> : null}
      <Pressable accessibilityRole="button" onPress={onUseLocation} hitSlop={8} style={styles.status}>
        <AppIcon name="pin" color={theme.primary} size={16} />
        <ThemedText type="smallBold" themeColor="primary">{current.error ? 'Try again' : 'Use my location'}</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.three, padding: Spacing.four },
  top: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.three },
  flex: { flex: 1 },
  heading: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  count: { fontSize: 34, lineHeight: 42, fontWeight: '700' },
  total: { fontSize: 18, fontWeight: '600' },
  percent: { fontSize: 34, lineHeight: 42, fontWeight: '700' },
  status: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, minHeight: 32 },
  statusBlock: { gap: Spacing.one },
});
