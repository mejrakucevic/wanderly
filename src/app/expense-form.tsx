import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ActionButton } from '@/components/ui/action-button';
import { ChipGroup } from '@/components/ui/chip';
import { DateField } from '@/components/ui/date-field';
import { FormSheet } from '@/components/ui/form-sheet';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { errorMessage, expenseActions, useTravelData } from '@/data/travel-store';
import { EXPENSE_CATEGORIES, type ExpenseCategory, type ExpenseInput } from '@/services/expenses';
import { parseISODate, todayISO } from '@/utils/format';
import { goBack } from '@/utils/navigation';

const CATEGORY_OPTIONS = EXPENSE_CATEGORIES.map((value) => ({ value, label: value[0].toUpperCase() + value.slice(1) }));

export default function ExpenseFormScreen() {
  const { id, tripId } = useLocalSearchParams<{ id?: string; tripId?: string }>();
  const { trips, expenses } = useTravelData();
  const existing = expenses.find((e) => e.id === id);
  const trip = trips.find((t) => t.id === (existing?.trip_id ?? tripId));
  const isEdit = Boolean(existing);

  const [title, setTitle] = useState(existing?.title ?? '');
  const [amount, setAmount] = useState(existing ? String(existing.amount) : '');
  const [category, setCategory] = useState<ExpenseCategory>(
    EXPENSE_CATEGORIES.find((c) => c === existing?.category) ?? 'food',
  );
  const [date, setDate] = useState(() => {
    if (existing) return existing.expense_date;
    const today = todayISO();
    if (!trip) return today;
    return today < trip.start_date ? trip.start_date : today > trip.end_date ? trip.end_date : today;
  });
  const [errors, setErrors] = useState<{ title?: string; amount?: string; date?: string }>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const backToTrip = () => goBack(trip ? { pathname: '/trip/[id]', params: { id: trip.id } } : '/trips');

  async function save() {
    if (!trip || saving) return;
    const value = Number(amount.replace(',', '.'));
    const next: typeof errors = {};
    if (!title.trim()) next.title = 'What was it for?';
    if (!amount.trim() || !Number.isFinite(value) || value <= 0) next.amount = 'Enter an amount above 0.';
    if (!parseISODate(date)) next.date = 'Choose a date.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const input: ExpenseInput = { title: title.trim(), amount: Math.round(value * 100) / 100, category, expense_date: date };
    setSaving(true);
    setSaveError(null);
    try {
      if (existing) await expenseActions.update(existing.id, input);
      else await expenseActions.create({ ...input, trip_id: trip.id });
      backToTrip();
    } catch (cause) {
      setSaveError(errorMessage(cause));
      setSaving(false);
    }
  }

  function confirmDelete() {
    if (!existing) return;
    Alert.alert('Delete this spending?', `“${existing.title}” will be removed.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          setSaving(true);
          try {
            await expenseActions.remove(existing.id);
            backToTrip();
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
      title={isEdit ? 'Edit spending' : 'Log spending'}
      saveLabel={isEdit ? 'Save' : 'Add'}
      onSave={save}
      saving={saving}
      error={trip ? saveError : 'This trip no longer exists.'}>
      {trip ? <ThemedText themeColor="textSecondary">For {trip.title}</ThemedText> : null}
      <TextField label={`Amount (${trip?.currency ?? 'EUR'})`} value={amount} onChangeText={setAmount} placeholder="0.00" keyboardType="decimal-pad" error={errors.amount} autoFocus={!isEdit} />
      <TextField label="Description" value={title} onChangeText={setTitle} placeholder="Dinner by the harbour" error={errors.title} maxLength={150} />
      <View style={{ gap: Spacing.two }}>
        <ThemedText type="smallBold">Category</ThemedText>
        <ChipGroup label="Category" options={CATEGORY_OPTIONS} value={category} onChange={setCategory} />
      </View>
      <DateField label="Date" value={date} onChange={setDate} error={errors.date} />
      {isEdit ? <ActionButton secondary label="Delete" onPress={confirmDelete} disabled={saving} /> : null}
    </FormSheet>
  );
}
