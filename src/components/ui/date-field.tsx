import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AppIcon } from '@/components/ui/app-icon';
import { Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/hooks/use-theme';
import { formatDate, parseISODate, toISODate } from '@/utils/format';

export type DateFieldProps = {
  label: string;
  /** `YYYY-MM-DD`. */
  value: string;
  onChange: (value: string) => void;
  /** Earliest/latest selectable day, `YYYY-MM-DD`. */
  minimumDate?: string;
  maximumDate?: string;
  error?: string | null;
  hint?: string;
};

/**
 * A date input that opens the system calendar instead of asking the user to type.
 * iOS: an inline calendar opens under the field. Android: the system date dialog.
 */
export function DateField({ label, value, onChange, minimumDate, maximumDate, error, hint }: DateFieldProps) {
  const theme = useTheme();
  const scheme = useColorScheme();
  const [open, setOpen] = useState(false);
  const date = parseISODate(value) ?? new Date();
  const min = minimumDate ? parseISODate(minimumDate) ?? undefined : undefined;
  const max = maximumDate ? parseISODate(maximumDate) ?? undefined : undefined;

  function press() {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: date,
        mode: 'date',
        minimumDate: min,
        maximumDate: max,
        onValueChange: (_event, selected) => onChange(toISODate(selected)),
      });
    } else {
      setOpen((current) => !current);
    }
  }

  return (
    <View style={styles.field}>
      <ThemedText type="smallBold">{label}</ThemedText>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${formatDate(value, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`}
        accessibilityHint={error ?? 'Opens a calendar'}
        accessibilityState={{ expanded: open }}
        onPress={press}
        style={({ pressed }) => [styles.input, {
          backgroundColor: theme.background,
          borderColor: error ? theme.danger : open ? theme.primary : theme.border,
          opacity: pressed ? 0.7 : 1,
        }]}>
        <AppIcon name="calendar" color={theme.primary} size={18} />
        <ThemedText style={styles.value} numberOfLines={1}>
          {formatDate(value, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
        </ThemedText>
      </Pressable>
      {open && Platform.OS === 'ios' ? (
        <View style={[styles.calendar, { borderColor: theme.border, backgroundColor: theme.backgroundElement }]}>
          <DateTimePicker
            value={date}
            mode="date"
            display="inline"
            minimumDate={min}
            maximumDate={max}
            accentColor={theme.primary}
            themeVariant={scheme === 'dark' ? 'dark' : 'light'}
            onValueChange={(_event, selected) => {
              onChange(toISODate(selected));
              setOpen(false);
            }}
          />
        </View>
      ) : null}
      {error ? <ThemedText type="small" themeColor="danger">{error}</ThemedText>
        : hint ? <ThemedText type="small" themeColor="textSecondary">{hint}</ThemedText> : null}
    </View>
  );
}

export type TimeFieldProps = {
  label: string;
  /** `HH:MM`, or null when no time is set. */
  value: string | null;
  onChange: (value: string | null) => void;
  hint?: string;
};

const toTime = (date: Date) => `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
function fromTime(value: string | null) {
  const date = new Date();
  const [hours, minutes] = (value ?? '12:00').split(':').map(Number);
  date.setHours(hours || 0, minutes || 0, 0, 0);
  return date;
}

/** Optional time: "Add time" until set, then the time with a clear button. */
export function TimeField({ label, value, onChange, hint }: TimeFieldProps) {
  const theme = useTheme();
  const scheme = useColorScheme();
  const [open, setOpen] = useState(false);

  function press() {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({ value: fromTime(value), mode: 'time', is24Hour: true, onValueChange: (_event, selected) => onChange(toTime(selected)) });
    } else {
      if (!value) onChange('12:00');
      setOpen((current) => !current);
    }
  }

  return (
    <View style={styles.field}>
      <ThemedText type="smallBold">{label}</ThemedText>
      <View style={styles.timeRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={value ? `${label}: ${value}` : `Add ${label.toLowerCase()}`}
          accessibilityState={{ expanded: open }}
          onPress={press}
          style={({ pressed }) => [styles.input, styles.flexInput, {
            backgroundColor: theme.background,
            borderColor: open ? theme.primary : theme.border,
            opacity: pressed ? 0.7 : 1,
          }]}>
          <AppIcon name="clock" color={theme.primary} size={18} />
          <ThemedText style={styles.value} themeColor={value ? 'text' : 'textSecondary'}>{value ?? 'Add time (optional)'}</ThemedText>
        </Pressable>
        {value ? (
          <Pressable accessibilityRole="button" accessibilityLabel={`Remove ${label.toLowerCase()}`} hitSlop={8} onPress={() => { onChange(null); setOpen(false); }} style={styles.clear}>
            <AppIcon name="close" color={theme.textSecondary} size={18} />
          </Pressable>
        ) : null}
      </View>
      {open && value && Platform.OS === 'ios' ? (
        <View style={[styles.calendar, { borderColor: theme.border, backgroundColor: theme.backgroundElement }]}>
          <DateTimePicker
            value={fromTime(value)}
            mode="time"
            display="spinner"
            minuteInterval={5}
            themeVariant={scheme === 'dark' ? 'dark' : 'light'}
            onValueChange={(_event, selected) => onChange(toTime(selected))}
          />
        </View>
      ) : null}
      {hint ? <ThemedText type="small" themeColor="textSecondary">{hint}</ThemedText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: Spacing.two },
  input: { minHeight: 52, borderWidth: 1, borderRadius: Radius.small, paddingHorizontal: Spacing.three, flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  value: { flex: 1, fontSize: 16 },
  calendar: { borderWidth: 1, borderRadius: Radius.card, overflow: 'hidden', paddingHorizontal: Spacing.two },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  flexInput: { flex: 1 },
  clear: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});
