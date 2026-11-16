import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected, checked: selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.chip, {
        backgroundColor: selected ? theme.primary : theme.backgroundElement,
        borderColor: selected ? theme.primary : theme.border,
        opacity: pressed ? 0.8 : 1,
      }]}>
      <ThemedText type="smallBold" themeColor={selected ? 'onPrimary' : 'text'}>{label}</ThemedText>
    </Pressable>
  );
}

/** A horizontally scrolling single-choice row of chips. */
export function ChipGroup<T extends string>({ options, value, onChange, label }: {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      accessibilityRole="radiogroup"
      accessibilityLabel={label}
      contentContainerStyle={styles.row}
      style={styles.scroller}>
      {options.map((option) => (
        <Chip key={option.value} label={option.label} selected={option.value === value} onPress={() => onChange(option.value)} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chip: { minHeight: 40, paddingHorizontal: Spacing.three, borderRadius: Radius.pill, borderWidth: 1, justifyContent: 'center' },
  row: { gap: Spacing.two },
  scroller: { flexGrow: 0 },
});
