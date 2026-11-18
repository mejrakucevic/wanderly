import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ActionButton } from '@/components/ui/action-button';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Shows a spinner during the first load, or the error with a retry button. Renders nothing once data is ready. */
export function DataStatus({ isLoading, error, onRetry }: { isLoading: boolean; error: string | null; onRetry: () => void }) {
  const theme = useTheme();
  if (error) {
    return (
      <View accessibilityRole="alert" style={[styles.error, { backgroundColor: theme.backgroundElement, borderColor: theme.danger }]}>
        <ThemedText type="smallBold" themeColor="danger">Couldn’t load your data</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">{error}</ThemedText>
        <ActionButton secondary label="Try again" onPress={onRetry} />
      </View>
    );
  }
  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator accessibilityLabel="Loading" color={theme.primary} size="large" />
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  error: { borderWidth: 1, borderRadius: Radius.card, padding: Spacing.four, gap: Spacing.two },
  loading: { paddingVertical: Spacing.six, alignItems: 'center' },
});
