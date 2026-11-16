import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ChipGroup } from '@/components/ui/chip';
import { FormSheet } from '@/components/ui/form-sheet';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { EXPENSE_CATEGORIES, sampleActions, useSampleData } from '@/data/sample-store';
import { parseISODate, todayISO } from '@/utils/format';

type Category = (typeof EXPENSE_CATEGORIES)[number];
const CATEGORY_OPTIONS = EXPENSE_CATEGORIES.map((value) => ({ value, label: value[0].toUpperCase() + value.slice(1) }));

export default function ExpenseFormScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const trip = useSampleData().trips.find((t) => t.id === tripId);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('food');
  const [date, setDate] = useState(() => {
    const today = todayISO();
    if (!trip) return today;
    return today < trip.start_date ? trip.start_date : today > trip.end_date ? trip.end_date : today;
  });
  const [errors, setErrors] = useState<{ title?: string; amount?: string; date?: string }>({});

  function save() {
    if (!trip) return;
    const value = Number(amount.replace(',', '.'));
    const next: typeof errors = {};
    if (!title.trim()) next.title = 'What was it for?';
    if (!amount.trim() || !Number.isFinite(value) || value <= 0) next.amount = 'Enter an amount above 0.';
    if (!parseISODate(date)) next.date = 'Use the format YYYY-MM-DD.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    sampleActions.createExpense({ trip_id: trip.id, title: title.trim(), amount: value, category, expense_date: date });
    router.back();
  }

  return (
    <FormSheet title="New expense" saveLabel="Add" onSave={save} error={trip ? null : 'This trip no longer exists.'}>
      {trip ? <ThemedText themeColor="textSecondary">For {trip.title}</ThemedText> : null}
      <TextField label={`Amount (${trip?.currency ?? 'EUR'})`} value={amount} onChangeText={setAmount} placeholder="0.00" keyboardType="decimal-pad" error={errors.amount} autoFocus />
      <TextField label="Description" value={title} onChangeText={setTitle} placeholder="Dinner by the harbour" error={errors.title} maxLength={150} />
      <View style={{ gap: Spacing.two }}>
        <ThemedText type="smallBold">Category</ThemedText>
        <ChipGroup label="Category" options={CATEGORY_OPTIONS} value={category} onChange={setCategory} />
      </View>
      <TextField label="Date" value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" keyboardType="numbers-and-punctuation" maxLength={10} error={errors.date} />
    </FormSheet>
  );
}
