import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ActionButton } from '@/components/ui/action-button';
import { AppIcon } from '@/components/ui/app-icon';
import { ChipGroup } from '@/components/ui/chip';
import { FormSheet } from '@/components/ui/form-sheet';
import { TextField } from '@/components/ui/text-field';
import { Radius, Spacing } from '@/constants/theme';
import { sampleActions, useSampleData } from '@/data/sample-store';
import { useTheme } from '@/hooks/use-theme';
import { parseISODate, todayISO } from '@/utils/format';

export default function EntryFormScreen() {
  const theme = useTheme();
  const { id, tripId } = useLocalSearchParams<{ id?: string; tripId?: string }>();
  const { trips, entries } = useSampleData();
  const existing = entries.find((e) => e.id === id);
  const isEdit = Boolean(existing);
  const tripOptions = [...trips].sort((a, b) => b.start_date.localeCompare(a.start_date)).map((t) => ({ value: t.id, label: t.title }));

  const [selectedTrip, setSelectedTrip] = useState(existing?.trip_id ?? tripId ?? tripOptions[0]?.value ?? '');
  const [title, setTitle] = useState(existing?.title ?? '');
  const [content, setContent] = useState(existing?.content ?? '');
  const [date, setDate] = useState(existing?.entry_date ?? todayISO());
  const [errors, setErrors] = useState<{ title?: string; date?: string; trip?: string }>({});

  function save() {
    const next: typeof errors = {};
    if (!trips.some((t) => t.id === selectedTrip)) next.trip = 'Choose the trip this memory belongs to.';
    if (!title.trim()) next.title = 'Give this entry a title.';
    if (!parseISODate(date)) next.date = 'Use the format YYYY-MM-DD.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    const input = { trip_id: selectedTrip, title: title.trim(), content: content.trim(), entry_date: date };
    if (existing) {
      sampleActions.updateEntry(existing.id, input);
      router.back();
    } else {
      const entry = sampleActions.createEntry(input);
      router.back();
      router.push({ pathname: '/entry/[id]', params: { id: entry.id } });
    }
  }

  function confirmDelete() {
    if (!existing) return;
    Alert.alert('Delete this entry?', 'This can’t be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { sampleActions.deleteEntry(existing.id); router.dismiss(2); } },
    ]);
  }

  return (
    <FormSheet title={isEdit ? 'Edit entry' : 'New entry'} onSave={save}>
      <View style={styles.group}>
        <ThemedText type="smallBold">Trip</ThemedText>
        {tripOptions.length > 0
          ? <ChipGroup label="Trip" options={tripOptions} value={selectedTrip} onChange={setSelectedTrip} />
          : <ThemedText themeColor="textSecondary">Create a trip first. Every diary entry belongs to a trip.</ThemedText>}
        {errors.trip ? <ThemedText type="small" themeColor="danger">{errors.trip}</ThemedText> : null}
      </View>
      <TextField label="Title" value={title} onChangeText={setTitle} placeholder="The best sunset so far" error={errors.title} maxLength={150} />
      <TextField label="Date" value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" keyboardType="numbers-and-punctuation" maxLength={10} error={errors.date} />
      <TextField label="Your story" value={content} onChangeText={setContent} placeholder="What happened today? What do you want to remember?" multiline maxLength={50000} />
      <View style={[styles.photos, { borderColor: theme.border }]}>
        <AppIcon name="photo" color={theme.textSecondary} size={28} />
        <ThemedText type="small" themeColor="textSecondary">Adding photos is coming soon.</ThemedText>
      </View>
      {isEdit ? <ActionButton secondary label="Delete entry" onPress={confirmDelete} /> : null}
    </FormSheet>
  );
}

const styles = StyleSheet.create({
  group: { gap: Spacing.two },
  photos: { borderWidth: 1, borderStyle: 'dashed', borderRadius: Radius.card, padding: Spacing.four, alignItems: 'center', gap: Spacing.two },
});
