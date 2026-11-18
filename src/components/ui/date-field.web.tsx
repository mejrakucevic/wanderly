// The native date picker has no web version, so the browser's own date input is used instead.
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { DateFieldProps, TimeFieldProps } from '@/components/ui/date-field';
import { Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/hooks/use-theme';

export function DateField({ label, value, onChange, minimumDate, maximumDate, error, hint }: DateFieldProps) {
  const theme = useTheme();
  const scheme = useColorScheme();
  return (
    <View style={styles.field}>
      <ThemedText type="smallBold">{label}</ThemedText>
      <input
        type="date"
        aria-label={label}
        value={value}
        min={minimumDate}
        max={maximumDate}
        onChange={(event) => { if (event.target.value) onChange(event.target.value); }}
        style={{
          minHeight: 52,
          boxSizing: 'border-box',
          borderWidth: 1,
          borderStyle: 'solid',
          borderRadius: Radius.small,
          borderColor: error ? theme.danger : theme.border,
          paddingLeft: Spacing.three,
          paddingRight: Spacing.three,
          fontSize: 16,
          fontFamily: 'inherit',
          color: theme.text,
          backgroundColor: theme.background,
          colorScheme: scheme === 'dark' ? 'dark' : 'light',
        }}
      />
      {error ? <ThemedText type="small" themeColor="danger">{error}</ThemedText>
        : hint ? <ThemedText type="small" themeColor="textSecondary">{hint}</ThemedText> : null}
    </View>
  );
}

export function TimeField({ label, value, onChange, hint }: TimeFieldProps) {
  const theme = useTheme();
  const scheme = useColorScheme();
  return (
    <View style={styles.field}>
      <ThemedText type="smallBold">{label}</ThemedText>
      <input
        type="time"
        aria-label={label}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value || null)}
        style={{
          minHeight: 52, boxSizing: 'border-box', borderWidth: 1, borderStyle: 'solid', borderRadius: Radius.small,
          borderColor: theme.border, paddingLeft: Spacing.three, paddingRight: Spacing.three, fontSize: 16,
          fontFamily: 'inherit', color: theme.text, backgroundColor: theme.background, colorScheme: scheme === 'dark' ? 'dark' : 'light',
        }}
      />
      {hint ? <ThemedText type="small" themeColor="textSecondary">{hint}</ThemedText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: Spacing.two },
});
