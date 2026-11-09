import { Link, type Href } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function TabLink({ href, label }: { href: Href; label: string }) {
  const theme = useTheme();
  return (
    <Link href={href} asChild>
      <Pressable accessibilityRole="link" style={({ pressed }) => [styles.button, {
        backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1,
      }]}>
        <ThemedText themeColor="onPrimary" style={styles.label}>{label}</ThemedText>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 52, borderRadius: Radius.pill, paddingHorizontal: Spacing.four, paddingVertical: Spacing.three, alignItems: 'center', justifyContent: 'center' },
  label: { fontWeight: '700' },
});
