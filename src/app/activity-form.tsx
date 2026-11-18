import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ActionButton } from '@/components/ui/action-button';
import { AppIcon } from '@/components/ui/app-icon';
import { ChipGroup } from '@/components/ui/chip';
import { DateField, TimeField } from '@/components/ui/date-field';
import { FormSheet } from '@/components/ui/form-sheet';
import { TextField } from '@/components/ui/text-field';
import { PLAN_CATEGORIES, planCategory } from '@/constants/plan';
import { Radius, Spacing } from '@/constants/theme';
import { activityActions, errorMessage, useTravelData } from '@/data/travel-store';
import { useTheme } from '@/hooks/use-theme';
import type { ActivityCategory, ActivityInput } from '@/services/activities';
import { addDays, todayISO } from '@/utils/format';
import { goBack } from '@/utils/navigation';

const CATEGORY_OPTIONS = PLAN_CATEGORIES.map((c) => ({ value: c.id, label: c.title }));

/** Picks a sensible first date: today if the trip is happening now, otherwise the trip's first day. */
function defaultDate(start: string, end: string) {
  const today = todayISO();
  return today >= start && today <= end ? today : start;
}

export default function ActivityFormScreen() {
  const theme = useTheme();
  const { id, tripId, category: initialCategory } = useLocalSearchParams<{ id?: string; tripId?: string; category?: string }>();
  const { trips, activities } = useTravelData();
  const existing = activities.find((a) => a.id === id);
  const trip = trips.find((t) => t.id === (existing?.trip_id ?? tripId));
  const isEdit = Boolean(existing);

  const [category, setCategory] = useState<ActivityCategory>(
    (existing?.category ?? PLAN_CATEGORIES.find((c) => c.id === initialCategory)?.id ?? 'activity') as ActivityCategory,
  );
  const [title, setTitle] = useState(existing?.title ?? '');
  const [date, setDate] = useState(existing?.activity_date ?? (trip ? defaultDate(trip.start_date, trip.end_date) : todayISO()));
  const [endDate, setEndDate] = useState<string>(
    existing?.end_date ?? (trip ? (addDays(date, 1) > trip.end_date ? trip.end_date : addDays(date, 1)) : addDays(date, 1)),
  );
  const [time, setTime] = useState<string | null>(existing?.start_time?.slice(0, 5) ?? null);
  const [cost, setCost] = useState(existing?.cost != null ? String(existing.cost) : '');
  const [notes, setNotes] = useState(existing?.description ?? '');
  const [icon, setIcon] = useState<string | null>(existing?.icon ?? null);
  const [errors, setErrors] = useState<{ title?: string; cost?: string }>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const kind = planCategory(category);
  const hasEndDate = Boolean(kind.endDateLabel);

  // Icons belong to a section, so switching section clears an icon that no longer fits.
  function changeCategory(next: ActivityCategory) {
    setCategory(next);
    if (!planCategory(next).icons.some((choice) => choice.id === icon)) setIcon(null);
  }

  function changeDate(next: string) {
    setDate(next);
    if (endDate < next) setEndDate(next);
  }

  async function save() {
    if (!trip || saving) return;
    const next: typeof errors = {};
    if (!title.trim()) next.title = 'Give it a name.';
    const amount = cost.trim() === '' ? null : Number(cost.replace(',', '.'));
    if (amount !== null && (!Number.isFinite(amount) || amount < 0)) next.cost = 'Enter a positive number, or leave it empty.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const input: ActivityInput = {
      category,
      title: title.trim(),
      activity_date: date,
      end_date: hasEndDate ? endDate : null,
      start_time: time,
      cost: amount,
      description: notes.trim() || null,
      icon,
    };
    setSaving(true);
    setSaveError(null);
    try {
      if (existing) await activityActions.update(existing.id, input);
      else await activityActions.create({ ...input, trip_id: trip.id });
      goBack(trip ? { pathname: '/trip/[id]', params: { id: trip.id } } : '/trips');
    } catch (cause) {
      setSaveError(errorMessage(cause));
      setSaving(false);
    }
  }

  function confirmDelete() {
    if (!existing) return;
    Alert.alert('Delete from plan?', `“${existing.title}” will be removed.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          setSaving(true);
          try {
            await activityActions.remove(existing.id);
            goBack(trip ? { pathname: '/trip/[id]', params: { id: trip.id } } : '/trips');
          } catch (cause) {
            setSaveError(errorMessage(cause));
            setSaving(false);
          }
        },
      },
    ]);
  }

  return (
    <FormSheet
      title={isEdit ? `Edit ${kind.noun}` : `Add ${kind.noun}`}
      saveLabel={isEdit ? 'Save' : 'Add'}
      onSave={save}
      saving={saving}
      error={trip ? saveError : 'This trip no longer exists.'}>
      {trip ? <ThemedText themeColor="textSecondary">For {trip.title}</ThemedText> : null}
      <View style={styles.group}>
        <ThemedText type="smallBold">Type</ThemedText>
        <ChipGroup label="Type" options={CATEGORY_OPTIONS} value={category} onChange={changeCategory} />
      </View>
      <View style={styles.group}>
        <ThemedText type="smallBold">Icon <ThemedText type="small" themeColor="textSecondary">· optional</ThemedText></ThemedText>
        <View style={styles.icons}>
          {kind.icons.map((choice) => {
            const selected = choice.id === icon;
            return (
              <Pressable
                key={choice.id}
                accessibilityRole="radio"
                accessibilityLabel={choice.label}
                accessibilityState={{ selected }}
                onPress={() => setIcon(selected ? null : choice.id)}
                style={({ pressed }) => [styles.iconChoice, pressed && { opacity: 0.7 }]}>
                <View style={[styles.iconCircle, {
                  backgroundColor: selected ? theme.primary : theme.accent,
                  borderColor: selected ? theme.primary : 'transparent',
                }]}>
                  <AppIcon name={choice.id} color={selected ? theme.onPrimary : theme.primary} size={22} />
                </View>
                <ThemedText type="small" themeColor={selected ? 'primary' : 'textSecondary'} numberOfLines={1}>{choice.label}</ThemedText>
              </Pressable>
            );
          })}
        </View>
      </View>
      <TextField label="Name" value={title} onChangeText={setTitle} placeholder={kind.titlePlaceholder} error={errors.title} maxLength={150} />
      <DateField
        label={kind.dateLabel}
        value={date}
        onChange={changeDate}
        minimumDate={trip?.start_date}
        maximumDate={trip?.end_date}
      />
      {hasEndDate ? (
        <DateField label={kind.endDateLabel ?? 'End date'} value={endDate} onChange={setEndDate} minimumDate={date} maximumDate={trip?.end_date} />
      ) : null}
      <TimeField label={kind.timeLabel} value={time} onChange={setTime} />
      <TextField
        label={`Price (${trip?.currency ?? 'EUR'})`}
        value={cost}
        onChangeText={setCost}
        placeholder="0.00"
        keyboardType="decimal-pad"
        error={errors.cost}
        hint="Optional · counts toward your trip budget"
      />
      <TextField label="Notes" value={notes} onChangeText={setNotes} placeholder="Booking number, address, what to bring…" multiline maxLength={10000} hint="Optional" />
      {isEdit ? <ActionButton secondary label="Delete from plan" onPress={confirmDelete} disabled={saving} /> : null}
    </FormSheet>
  );
}

const styles = StyleSheet.create({
  group: { gap: Spacing.two },
  icons: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.three },
  iconChoice: { width: 68, alignItems: 'center', gap: Spacing.one },
  iconCircle: { width: 52, height: 52, borderRadius: Radius.pill, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
});
