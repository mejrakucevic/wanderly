import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

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
import { Screen } from '@/components/ui/screen';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { PLAN_CATEGORIES, planItemIcon, type PlanCategory } from '@/constants/plan';
import { Spacing } from '@/constants/theme';
import { useTravelData } from '@/data/travel-store';
import { useTheme } from '@/hooks/use-theme';
import type { Expense, Trip, TripActivity } from '@/types/models';
import { daysBetween, formatDate, formatDateRange, formatMoney, tripCountdown } from '@/utils/format';

type Tab = 'plan' | 'expenses' | 'diary';
const TABS = [
  { value: 'plan', label: 'Plan' },
  { value: 'expenses', label: 'Spent' },
  { value: 'diary', label: 'Diary' },
] as const;

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
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

  const expenses = travel.expenses.filter((e) => e.trip_id === trip.id);
  const spent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const activities = travel.activities.filter((a) => a.trip_id === trip.id);
  const planned = activities.reduce((sum, a) => sum + (a.cost ?? 0), 0);
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

      <BudgetCard trip={trip} planned={planned} spent={spent} />

      <SegmentedControl segments={TABS} value={tab} onChange={setTab} />
      {tab === 'plan' ? <PlanTab activities={activities} trip={trip} /> : null}
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

function BudgetCard({ trip, planned, spent }: { trip: Trip; planned: number; spent: number }) {
  const total = planned + spent;
  const ratio = trip.budget > 0 ? total / trip.budget : 0;
  const remaining = trip.budget - total;
  return (
    <Card>
      <View style={styles.between}>
        <ThemedText type="smallBold">
          Planned {formatMoney(planned, trip.currency)}{spent > 0 ? ` · Spent ${formatMoney(spent, trip.currency)}` : ''}
        </ThemedText>
        <ThemedText type="small" themeColor={remaining < 0 ? 'danger' : 'textSecondary'}>
          {remaining < 0 ? `${formatMoney(-remaining, trip.currency)} over budget` : `${formatMoney(remaining, trip.currency)} left`}
        </ThemedText>
      </View>
      <ProgressBar value={ratio} label={`${Math.round(ratio * 100)} percent of budget used`} />
    </Card>
  );
}

function PlanTab({ trip, activities }: { trip: Trip; activities: TripActivity[] }) {
  const theme = useTheme();
  const planned = activities.reduce((sum, a) => sum + (a.cost ?? 0), 0);
  const sorted = [...activities].sort((a, b) =>
    a.activity_date.localeCompare(b.activity_date) || (a.start_time ?? '').localeCompare(b.start_time ?? '') || a.sort_order - b.sort_order);

  return (
    <View style={styles.list}>
      {planned > 0 ? (
        <ThemedText type="small" themeColor="textSecondary">
          Planned total: <ThemedText type="smallBold">{formatMoney(planned, trip.currency)}</ThemedText>
        </ThemedText>
      ) : null}
      {PLAN_CATEGORIES.map((category) => (
        <PlanSection key={category.id} trip={trip} category={category} items={sorted.filter((a) => a.category === category.id)} />
      ))}
      <Card style={styles.soon}>
        <AppIcon name="sparkles" color={theme.primary} />
        <View style={styles.flex}>
          <ThemedText type="smallBold">AI travel assistant · coming soon</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Tell it your dates and budget, and it will suggest the cheapest stays and transport and fill in your plan.
          </ThemedText>
        </View>
      </Card>
    </View>
  );
}

/** "3 Jun → 6 Jun" for stays, "3 Jun · 14:30" when there's a time, otherwise "3 Jun". */
function itemWhen(item: TripActivity) {
  const day = (iso: string) => formatDate(iso, { day: 'numeric', month: 'short' });
  if (item.end_date && item.end_date !== item.activity_date) return `${day(item.activity_date)} → ${day(item.end_date)}`;
  return item.start_time ? `${day(item.activity_date)} · ${item.start_time.slice(0, 5)}` : day(item.activity_date);
}

function PlanSection({ trip, category, items }: { trip: Trip; category: PlanCategory; items: TripActivity[] }) {
  const theme = useTheme();
  const total = items.reduce((sum, a) => sum + (a.cost ?? 0), 0);
  const add = () => router.push({ pathname: '/activity-form', params: { tripId: trip.id, category: category.id } });

  return (
    <View style={styles.day}>
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIcon, { backgroundColor: theme.accent }]}>
          <AppIcon name={category.icon} color={theme.primary} size={18} />
        </View>
        <View style={styles.flex}>
          <ThemedText accessibilityRole="header" style={styles.sectionTitle}>{category.title}</ThemedText>
          {total > 0 ? <ThemedText type="small" themeColor="textSecondary">{formatMoney(total, trip.currency)}</ThemedText> : null}
        </View>
        <IconButton icon="add" label={`Add ${category.noun}`} size={36} onPress={add} />
      </View>
      {items.length > 0 ? (
        <Card>
          {items.map((item, index) => (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityHint="Opens this item to edit or delete it"
              onPress={() => router.push({ pathname: '/activity-form', params: { id: item.id } })}
              style={({ pressed }) => [styles.activity, index > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.border }, pressed && { opacity: 0.7 }]}>
              <View style={[styles.itemIcon, { backgroundColor: theme.accent }]}>
                <AppIcon name={planItemIcon(item)} color={theme.primary} size={20} />
              </View>
              <View style={styles.flex}>
                <ThemedText>{item.title}</ThemedText>
                <ThemedText type="small" themeColor="primary">{itemWhen(item)}</ThemedText>
                {item.description ? <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>{item.description}</ThemedText> : null}
              </View>
              {item.cost != null ? <ThemedText type="smallBold">{formatMoney(item.cost, trip.currency)}</ThemedText> : null}
            </Pressable>
          ))}
        </Card>
      ) : (
        <Pressable accessibilityRole="button" onPress={add} style={[styles.emptySection, { borderColor: theme.border }]}>
          <ThemedText type="small" themeColor="textSecondary">No {category.title.toLowerCase()} yet · tap to add</ThemedText>
        </Pressable>
      )}
    </View>
  );
}

function ExpensesTab({ trip, expenses }: { trip: Trip; expenses: Expense[] }) {
  const theme = useTheme();
  const totals = new Map<string, number>();
  expenses.forEach((e) => totals.set(e.category, (totals.get(e.category) ?? 0) + e.amount));
  const sorted = [...expenses].sort((a, b) => b.expense_date.localeCompare(a.expense_date));

  return (
    <View style={styles.list}>
      <ThemedText type="small" themeColor="textSecondary">
        Log what you spend on the go: coffee, taxis, souvenirs. Prices in your plan already count as planned, so you don’t need to add them here.
      </ThemedText>
      <ActionButton label="Log spending" onPress={() => router.push({ pathname: '/expense-form', params: { tripId: trip.id } })} />
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
              accessibilityHint="Opens this spending to edit or delete it"
              onPress={() => router.push({ pathname: '/expense-form', params: { id: expense.id } })}
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
        <EmptyState icon="wallet" title="Nothing spent yet" description="Everything you log here is added to your planned costs, so you always see what’s left of your budget." />
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
  activity: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, paddingVertical: Spacing.two, minHeight: 52 },
  itemIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  sectionIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontSize: 18, lineHeight: 24, fontWeight: '700' },
  emptySection: { borderWidth: 1, borderStyle: 'dashed', borderRadius: 16, padding: Spacing.three, alignItems: 'center' },
  flex: { flex: 1 },
  soon: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, borderStyle: 'dashed' },
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  category: { borderRadius: 16, paddingHorizontal: Spacing.three, paddingVertical: Spacing.two, minWidth: 96 },
  capitalize: { textTransform: 'capitalize' },
  expense: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, paddingVertical: Spacing.two, minHeight: 52 },
});
