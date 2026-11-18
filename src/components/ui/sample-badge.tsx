import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Marks screens that still show in-memory sample data instead of the user's real data. */
export function SampleBadge() {
  const theme = useTheme();
  return (
    <View style={[styles.badge, { backgroundColor: theme.accent }]}>
      <ThemedText type="small" themeColor="primary">Preview with sample data · changes aren’t saved</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: 'flex-start', borderRadius: Radius.pill, paddingHorizontal: Spacing.three, paddingVertical: Spacing.one },
});
