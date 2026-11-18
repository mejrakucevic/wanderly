import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { coverFor } from '@/components/trips/trip-cover';
import { Card } from '@/components/ui/card';
import { Radius, Spacing } from '@/constants/theme';
import type { DiaryEntry } from '@/types/models';
import { parseISODate } from '@/utils/format';

export function EntryCard({ entry, tripTitle }: { entry: DiaryEntry; tripTitle?: string }) {
  const date = parseISODate(entry.entry_date);
  const cover = coverFor(entry.trip_id);
  return (
    <Card
      accessibilityLabel={`${entry.title}, ${date?.toLocaleDateString() ?? entry.entry_date}${tripTitle ? `, ${tripTitle}` : ''}`}
      onPress={() => router.push({ pathname: '/entry/[id]', params: { id: entry.id } })}
      style={styles.card}>
      <View style={[styles.date, { backgroundColor: cover.background }]}>
        <ThemedText style={[styles.day, { color: cover.text }]}>{date?.getDate() ?? '–'}</ThemedText>
        <ThemedText type="small" style={{ color: cover.text, textTransform: 'uppercase' }}>
          {date?.toLocaleDateString(undefined, { month: 'short' }) ?? ''}
        </ThemedText>
      </View>
      <View style={styles.text}>
        {tripTitle ? <ThemedText type="small" themeColor="primary" numberOfLines={1}>{tripTitle}</ThemedText> : null}
        <ThemedText style={styles.title} numberOfLines={1}>{entry.title}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>{entry.content}</ThemedText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  date: { width: 60, height: 68, borderRadius: Radius.small, alignItems: 'center', justifyContent: 'center' },
  day: { fontSize: 24, lineHeight: 28, fontWeight: '700' },
  text: { flex: 1, gap: Spacing.half },
  title: { fontWeight: '700' },
});
