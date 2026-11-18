import { Pressable, StyleSheet } from 'react-native';

import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  icon: AppIconName;
  /** Read by screen readers; required because the button has no visible text. */
  label: string;
  onPress: () => void;
  variant?: 'plain' | 'primary' | 'danger';
  size?: number;
};

export function IconButton({ icon, label, onPress, variant = 'plain', size = 44 }: Props) {
  const theme = useTheme();
  const background = variant === 'primary' ? theme.primary : theme.backgroundElement;
  const tint = variant === 'primary' ? theme.onPrimary : variant === 'danger' ? theme.danger : theme.text;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      onPress={onPress}
      style={({ pressed }) => [styles.button, {
        width: size, height: size, backgroundColor: background,
        borderColor: variant === 'primary' ? theme.primary : theme.border,
        opacity: pressed ? 0.7 : 1,
      }]}>
      <AppIcon name={icon} color={tint} size={size * 0.45} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { borderRadius: Radius.pill, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
});
