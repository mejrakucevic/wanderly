import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { EntryCard } from '@/components/diary/entry-card';
import { ThemedText } from '@/components/themed-text';
import { TripCover } from '@/components/trips/trip-cover';
import { ActionButton } from '@/components/ui/action-button';
import { AppIcon } from '@/components/ui/app-icon';
import { Card } from '@/components/ui/card';
import { DataStatus } from '@/components/ui/data-status';
import { EmptyState } from '@/components/ui/empty-state';
import { IconButton } from '@/components/ui/icon-button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { SampleBadge } from '@/components/ui/sample-badge';
import { Screen } from '@/components/ui/screen';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Spacing } from '@/constants/theme';
import { sampleActions, useSampleData } from '@/data/sample-store';
import { useTravelData } from '@/data/travel-store';
import { useTheme } from '@/hooks/use-theme';
import type { Expense, Trip, TripActivity } from '@/types/models';
import { daysBetween, formatDate, formatDateRange, formatMoney, tripCountdown } from '@/utils/format';

type Tab = 'plan' | 'expenses' | 'diary';
const TABS = [
  { value: 'plan', label: 'Plan' },
  { value: 'expenses', label: 'Expenses' },
  { value: 'diary', label: 'Diary' },
] as const;

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const sample = useSampleData();
  const travel = useTravelData();
  const [tab, setTab] = useState<Tab>('plan');
  const trip = travel.trips.find((t) => t.id === id);

  if (!trip && (travel.isLoading || travel.error)) {
    return (
      <Screen showBack title="Trip">
        <DataStatus isLoading={travel.isLoading} error={travel.error} onRetry={travel.reload} />
      </Screen>
    );
  }
  if (!trip) {
    return (
      <Screen showBack title="Trip not found">
        <EmptyState icon="trips" title="This trip isn’t here anymore" description="It may have been deleted." />
      </Screen>
    );
  }

  const expenses = sample.expenses.filter((e) => e.trip_id === trip.id);
  const spent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const days = daysBetween(trip.start_date, trip.end_date) + 1;

  return (
    <Screen
      showBack
      eyebrow={trip.destination}
      title={trip.title}
      action={<IconButton icon="edit" label="Edit trip" onPress={() => router.push({ pathname: '/trip-form', params: { id: trip.id } })} />}>
      <TripCover id={trip.id} destination={trip.destination} height={170} label={tripCountdown(trip)} />

      <View style={styles.facts}>
        <Fact icon="calendar" label={formatDateRange(trip.start_date, trip.end_date)} detail={`${days} day${days === 1 ? '' : 's'}`} />
        <Fact icon="wallet" label={formatMoney(trip.budget, trip.currency)} detail="Budget" />
      </View>
      {trip.description ? <ThemedText themeColor="textSecondary">{trip.description}</ThemedText> : null}

      <BudgetCard trip={trip} spent={spent} />

      <SegmentedControl segments={TABS} value={tab} onChange={setTab} />
      {tab === 'plan' ? <PlanTab activities={sample.activities.filter((a) => a.trip_id === trip.id)} trip={trip} /> : null}
      {tab === 'expenses' ? <ExpensesTab expenses={expenses} trip={trip} /> : null}
      {tab === 'diary' ? (
        <View style={styles.list}>
          <ActionButton label="Write a diary entry" onPress={() => router.push({ pathname: '/entry-form', params: { tripId: trip.id } })} />
          {travel.entries.filter((e) => e.trip_id === trip.id).sort((a, b) => b.entry_date.localeCompare(a.entry_date))
            .map((entry) => <EntryCard key={entry.id} entry={entry} />)}
        </View>
      ) : null}
    </Screen>
  );
}

function Fact({ icon, label, detail }: { icon: 'calendar' | 'wallet'; label: string; detail: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.fact, { backgroundColor: theme.accent }]}>
      <AppIcon name={icon} color={theme.primary} size={20} />
      <ThemedText type="smallBold">{label}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">{detail}</ThemedText>
    </View>
  );
}

function BudgetCard({ trip, spent }: { trip: Trip; spent: number }) {
  const ratio = trip.budget > 0 ? spent / trip.budget : 0;
  const remaining = trip.budget - spent;
  return (
    <Card>
      <View style={styles.between}>
        <ThemedText type="smallBold">Spent {formatMoney(spent, trip.currency)}</ThemedText>
        <ThemedText type="small" themeColor={remaining < 0 ? 'danger' : 'textSecondary'}>
          {remaining < 0 ? `${formatMoney(-remaining, trip.currency)} over budget` : `${formatMoney(remaining, trip.currency)} left`}
        </ThemedText>
      </View>
      <ProgressBar value={ratio} label={`${Math.round(ratio * 100)} percent of budget spent`} />
    </Card>
  );
}

function PlanTab({ trip, activities }: { trip: Trip; activities: TripActivity[] }) {
  const theme = useTheme();
  const byDay = new Map<string, TripActivity[]>();
  [...activities]
    .sort((a, b) => a.activity_date.localeCompare(b.activity_date) || a.sort_order - b.sort_order)
    .forEach((a) => byDay.set(a.activity_date, [...(byDay.get(a.activity_date) ?? []), a]));

  return (
    <View style={styles.list}>
      {[...byDay].map(([date, items]) => (
        <View key={date} style={styles.day}>
          <ThemedText type="smallBold" themeColor="primary">
            Day {daysBetween(trip.start_date, date) + 1} · {formatDate(date, { weekday: 'short', day: 'numeric', month: 'short' })}
          </ThemedText>
          <Card>
            {items.map((item, index) => (
              <View key={item.id} style={[styles.activity, index > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.border }]}>
                <ThemedText type="smallBold" themeColor="textSecondary" style={styles.time}>{item.start_time?.slice(0, 5) ?? '—'}</ThemedText>
                <View style={styles.flex}>
                  <ThemedText>{item.title}</ThemedText>
                  {item.description ? <ThemedText type="small" themeColor="textSecondary">{item.description}</ThemedText> : null}
                </View>
              </View>
            ))}
          </Card>
        </View>
      ))}
      {byDay.size === 0 ? <EmptyState icon="calendar" title="No plans yet" description="Your day-by-day itinerary will appear here." /> : null}
      <Card style={styles.soon}>
        <AppIcon name="sparkles" color={theme.primary} />
        <View style={styles.flex}>
          <ThemedText type="smallBold">Adding activities and AI itineraries</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">Coming in a later version.</ThemedText>
        </View>
      </Card>
    </View>
  );
}

function ExpensesTab({ trip, expenses }: { trip: Trip; expenses: Expense[] }) {
  const theme = useTheme();
  const totals = new Map<string, number>();
  expenses.forEach((e) => totals.set(e.category, (totals.get(e.category) ?? 0) + e.amount));
  const sorted = [...expenses].sort((a, b) => b.expense_date.localeCompare(a.expense_date));

  function confirmDelete(expense: Expense) {
    Alert.alert('Delete expense?', `“${expense.title}” will be removed.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => sampleActions.deleteExpense(expense.id) },
    ]);
  }

  return (
    <View style={styles.list}>
      <SampleBadge />
      <ActionButton label="Add an expense" onPress={() => router.push({ pathname: '/expense-form', params: { tripId: trip.id } })} />
      {totals.size > 0 ? (
        <View style={styles.categories}>
          {[...totals].sort((a, b) => b[1] - a[1]).map(([category, total]) => (
            <View key={category} style={[styles.category, { backgroundColor: theme.accent }]}>
              <ThemedText type="small" themeColor="textSecondary" style={styles.capitalize}>{category}</ThemedText>
              <ThemedText type="smallBold">{formatMoney(total, trip.currency)}</ThemedText>
            </View>
          ))}
        </View>
      ) : null}
      {sorted.length > 0 ? (
        <Card>
          {sorted.map((expense, index) => (
            <Pressable
              key={expense.id}
              accessibilityRole="button"
              accessibilityLabel={`${expense.title}, ${formatMoney(expense.amount, trip.currency)}`}
              accessibilityHint="Opens delete options"
              onPress={() => confirmDelete(expense)}
              style={[styles.expense, index > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.border }]}>
              <View style={styles.flex}>
                <ThemedText>{expense.title}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={styles.capitalize}>
                  {expense.category} · {formatDate(expense.expense_date, { day: 'numeric', month: 'short' })}
                </ThemedText>
              </View>
              <ThemedText type="smallBold">{formatMoney(expense.amount, trip.currency)}</ThemedText>
            </Pressable>
          ))}
        </Card>
      ) : (
        <EmptyState icon="wallet" title="No expenses yet" description="Log what you spend to keep an eye on your budget." />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  facts: { flexDirection: 'row', gap: Spacing.three },
  fact: { flex: 1, borderRadius: 20, padding: Spacing.three, gap: Spacing.one },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: Spacing.two, flexWrap: 'wrap' },
  list: { gap: Spacing.three },
  day: { gap: Spacing.two },
  activity: { flexDirection: 'row', gap: Spacing.three, paddingVertical: Spacing.two },
  time: { width: 48 },
  flex: { flex: 1 },
  soon: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, borderStyle: 'dashed' },
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  category: { borderRadius: 16, paddingHorizontal: Spacing.three, paddingVertical: Spacing.two, minWidth: 96 },
  capitalize: { textTransform: 'capitalize' },
  expense: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, paddingVertical: Spacing.two, minHeight: 52 },
});
