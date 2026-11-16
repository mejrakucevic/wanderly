import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  secondary?: boolean;
};

export function ActionButton({ label, onPress, loading = false, disabled = false, secondary = false }: Props) {
  const theme = useTheme();
  const unavailable = loading || disabled;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: unavailable, busy: loading }}
      disabled={unavailable}
      onPress={onPress}
      style={({ pressed }) => [styles.button, {
        backgroundColor: secondary ? theme.backgroundElement : theme.primary,
        borderColor: secondary ? theme.border : theme.primary,
        opacity: unavailable ? 0.55 : pressed ? 0.8 : 1,
      }]}>
      {loading ? <ActivityIndicator color={secondary ? theme.primary : theme.onPrimary} /> : null}
      <ThemedText themeColor={secondary ? 'primary' : 'onPrimary'} style={styles.label}>{label}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 52, borderRadius: Radius.pill, borderWidth: 1, paddingHorizontal: Spacing.four, paddingVertical: Spacing.three, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.two },
  label: { fontWeight: '700', textAlign: 'center', flexShrink: 1 },
});
