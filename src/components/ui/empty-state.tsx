import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function EmptyState({ icon, title, description, note }: {
  icon: AppIconName; title: string; description: string; note?: string;
}) {
  const theme = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      <View style={[styles.icon, { backgroundColor: theme.accent }]}>
        <AppIcon name={icon} color={theme.primary} size={36} />
      </View>
      <ThemedText accessibilityRole="header" style={styles.title}>{title}</ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.center}>{description}</ThemedText>
      {note ? <ThemedText type="small" themeColor="primary" style={styles.note}>{note}</ThemedText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: Radius.card, padding: Spacing.five, alignItems: 'center', gap: Spacing.three },
  icon: { width: 80, height: 80, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, lineHeight: 30, fontWeight: '700', textAlign: 'center' },
  center: { textAlign: 'center', maxWidth: 360 },
  note: { textAlign: 'center', marginTop: Spacing.two },
});
