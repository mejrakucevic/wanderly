import { StyleSheet, View } from 'react-native';

import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** `value` is a fraction; anything above 1 is drawn full and in the danger color. */
export function ProgressBar({ value, label }: { value: number; label: string }) {
  const theme = useTheme();
  const over = value > 1;
  const width = `${Math.round(Math.min(Math.max(value, 0), 1) * 100)}%` as const;
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(value * 100) }}
      style={[styles.track, { backgroundColor: theme.accent }]}>
      <View style={[styles.fill, { width, backgroundColor: over ? theme.danger : theme.primary }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 10, borderRadius: Radius.pill, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: Radius.pill },
});
