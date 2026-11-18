import type { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = PropsWithChildren<{
  onPress?: () => void;
  /** Screen-reader summary for tappable cards. */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}>;

/** The standard Wanderly surface: rounded, bordered, and tappable when `onPress` is set. */
export function Card({ onPress, accessibilityLabel, style, children }: Props) {
  const theme = useTheme();
  const surface = [styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }, style];
  if (!onPress) return <View style={surface}>{children}</View>;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [surface, pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] }]}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: Radius.card, padding: Spacing.three, gap: Spacing.two, overflow: 'hidden' },
});
