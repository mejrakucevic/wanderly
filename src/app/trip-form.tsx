import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { ActionButton } from '@/components/ui/action-button';
import { DateField } from '@/components/ui/date-field';
import { FormSheet } from '@/components/ui/form-sheet';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { errorMessage, tripActions, useTravelData } from '@/data/travel-store';
import type { CreateTrip } from '@/services/trips';
import { addDays, daysBetween, parseISODate, todayISO } from '@/utils/format';
import { goBack } from '@/utils/navigation';

type Errors = Partial<Record<'title' | 'destination' | 'start_date' | 'end_date' | 'budget' | 'currency', string>>;

export default function TripFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const existing = useTravelData().trips.find((t) => t.id === id);
  const isEdit = Boolean(existing);

  const [title, setTitle] = useState(existing?.title ?? '');
  const [destination, setDestination] = useState(existing?.destination ?? '');
  const [startDate, setStartDate] = useState(existing?.start_date ?? addDays(todayISO(), 14));
  const [endDate, setEndDate] = useState(existing?.end_date ?? addDays(todayISO(), 21));
  const [budget, setBudget] = useState(existing ? String(existing.budget) : '');
  const [currency, setCurrency] = useState(existing?.currency ?? 'EUR');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Moving the start keeps the trip length, so the end never lands before the start.
  function changeStart(next: string) {
    const length = Math.max(0, daysBetween(startDate, endDate));
    setStartDate(next);
    if (endDate < next) setEndDate(addDays(next, length));
  }

  function validate(): CreateTrip | null {
    const next: Errors = {};
    if (!title.trim()) next.title = 'Give your trip a name.';
    else if (title.trim().length > 150) next.title = 'Keep the name under 150 characters.';
    if (!destination.trim()) next.destination = 'Where are you going?';
    else if (destination.trim().length > 200) next.destination = 'Keep the destination under 200 characters.';
    if (!parseISODate(startDate)) next.start_date = 'Choose a start date.';
    if (!parseISODate(endDate)) next.end_date = 'Choose an end date.';
    else if (!next.start_date && endDate < startDate) next.end_date = 'The trip can’t end before it starts.';
    const amount = budget.trim() === '' ? 0 : Number(budget.replace(',', '.'));
    if (!Number.isFinite(amount) || amount < 0) next.budget = 'Enter a positive number, or leave it empty.';
    if (!/^[A-Z]{3}$/.test(currency.trim().toUpperCase())) next.currency = 'Use a 3-letter code like EUR or USD.';
    setErrors(next);
    if (Object.keys(next).length > 0) return null;
    return {
      title: title.trim(), destination: destination.trim(), start_date: startDate, end_date: endDate,
      budget: amount, currency: currency.trim().toUpperCase(), description: description.trim() || null,
    };
  }

  async function save() {
    const input = validate();
    if (!input || saving) return;
    setSaving(true);
    setSaveError(null);
    try {
      if (existing) {
        await tripActions.update(existing.id, input);
        goBack({ pathname: '/trip/[id]', params: { id: existing.id } });
      } else {
        const trip = await tripActions.create(input);
        goBack('/trips');
        router.push({ pathname: '/trip/[id]', params: { id: trip.id } });
      }
    } catch (cause) {
      setSaveError(errorMessage(cause));
      setSaving(false);
    }
  }

  function confirmDelete() {
    if (!existing) return;
    Alert.alert('Delete this trip?', 'Its plan, expenses and diary entries will be deleted too. This can’t be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete trip', style: 'destructive', onPress: async () => {
          setSaving(true);
          try {
            await tripActions.remove(existing.id);
            router.dismissTo('/trips'); // the trip is gone, so return to the list
          } catch (cause) {
            setSaveError(errorMessage(cause));
            setSaving(false);
          }
        },
      },
    ]);
  }

  const hasErrors = Object.keys(errors).length > 0;
  const formError = saveError ?? (hasErrors ? 'Please fix the highlighted fields.' : null);

  return (
    <FormSheet title={isEdit ? 'Edit trip' : 'New trip'} saveLabel={isEdit ? 'Save' : 'Create'} onSave={save} saving={saving} error={formError}>
      <TextField label="Trip name" value={title} onChangeText={setTitle} placeholder="Summer in Croatia" error={errors.title} maxLength={150} autoFocus={!isEdit} />
      <TextField label="Destination" value={destination} onChangeText={setDestination} placeholder="City, region or country" error={errors.destination} maxLength={200} />
      <DateField label="Start date" value={startDate} onChange={changeStart} error={errors.start_date} />
      <DateField
        label="End date"
        value={endDate}
        onChange={setEndDate}
        minimumDate={startDate}
        error={errors.end_date}
        hint={`${daysBetween(startDate, endDate) + 1} days`}
      />
      <View style={styles.row}>
        <View style={styles.flex}>
          <TextField label="Budget" value={budget} onChangeText={setBudget} placeholder="0" error={errors.budget} keyboardType="decimal-pad" hint="Optional" />
        </View>
        <View style={styles.currency}>
          <TextField label="Currency" value={currency} onChangeText={setCurrency} placeholder="EUR" error={errors.currency} autoCapitalize="characters" maxLength={3} />
        </View>
      </View>
      <TextField label="Notes" value={description} onChangeText={setDescription} placeholder="What are you looking forward to?" multiline maxLength={10000} hint="Optional" />
      {isEdit ? <ActionButton secondary label="Delete trip" onPress={confirmDelete} disabled={saving} /> : null}
    </FormSheet>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing.three },
  flex: { flex: 1 },
  currency: { width: 110 },
});
