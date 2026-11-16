import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { EntryCard } from '@/components/diary/entry-card';
import { ActionButton } from '@/components/ui/action-button';
import { ChipGroup } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
import { IconButton } from '@/components/ui/icon-button';
import { SampleBadge } from '@/components/ui/sample-badge';
import { Screen } from '@/components/ui/screen';
import { SectionHeader } from '@/components/ui/section-header';
import { Spacing } from '@/constants/theme';
import { useSampleData } from '@/data/sample-store';
import { formatDate } from '@/utils/format';

export default function DiaryScreen() {
  const { entries, trips } = useSampleData();
  const [tripFilter, setTripFilter] = useState('all');

  const tripTitles = new Map(trips.map((t) => [t.id, t.title]));
  const filterOptions = [
    { value: 'all', label: 'All entries' },
    ...trips.filter((t) => entries.some((e) => e.trip_id === t.id)).map((t) => ({ value: t.id, label: t.title })),
  ];
  const visible = entries
    .filter((e) => tripFilter === 'all' || e.trip_id === tripFilter)
    .sort((a, b) => b.entry_date.localeCompare(a.entry_date));

  // Group by month, newest first: "November 2026" → entries
  const months = new Map<string, typeof visible>();
  visible.forEach((e) => {
    const key = formatDate(e.entry_date, { month: 'long', year: 'numeric' });
    months.set(key, [...(months.get(key) ?? []), e]);
  });

  const write = () => router.push('/entry-form');

  return (
    <Screen
      eyebrow="Travel diary"
      title="Memories"
      action={<IconButton icon="add" label="Write a new entry" variant="primary" onPress={write} />}>
      <SampleBadge />
      {entries.length > 0 ? <ChipGroup label="Filter by trip" options={filterOptions} value={tripFilter} onChange={setTripFilter} /> : null}

      {[...months].map(([month, items]) => (
        <View key={month} style={styles.section}>
          <SectionHeader title={month} />
          {items.map((entry) => <EntryCard key={entry.id} entry={entry} tripTitle={tripFilter === 'all' ? tripTitles.get(entry.trip_id) : undefined} />)}
        </View>
      ))}

      {visible.length === 0 ? (
        <>
          <EmptyState icon="diary" title="Your story starts here" description="Capture the moments, feelings and little details you never want to forget." />
          {trips.length > 0
            ? <ActionButton label="Write your first entry" onPress={write} />
            : <ActionButton label="Plan a trip first" onPress={() => router.push('/trip-form')} />}
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.three },
});
