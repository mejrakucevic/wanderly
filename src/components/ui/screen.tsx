import { router } from 'expo-router';
import type { PropsWithChildren, ReactNode } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconButton } from '@/components/ui/icon-button';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ScreenProps = PropsWithChildren<{
  title: string;
  eyebrow?: string;
  description?: string;
  /** Shows a back button (for pushed detail screens). */
  showBack?: boolean;
  /** Content on the right of the title row, e.g. an "add" button. */
  action?: ReactNode;
  /** Enables pull-to-refresh. */
  onRefresh?: () => void;
  refreshing?: boolean;
}>;

export function Screen({ eyebrow, title, description, showBack = false, action, onRefresh, refreshing = false, children }: ScreenProps) {
  const theme = useTheme();
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} colors={[theme.primary]} /> : undefined}>
        <View style={styles.content}>
          {showBack ? (
            <View style={styles.backRow}>
              <IconButton icon="back" label="Go back" onPress={() => router.back()} />
            </View>
          ) : null}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View style={styles.titleText}>
                {eyebrow ? <ThemedText type="smallBold" themeColor="primary" style={styles.eyebrow}>{eyebrow}</ThemedText> : null}
                <ThemedText type="title" accessibilityRole="header">{title}</ThemedText>
              </View>
              {action}
            </View>
            {description ? <ThemedText themeColor="textSecondary">{description}</ThemedText> : null}
          </View>
          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: Spacing.four, alignItems: 'center' },
  content: { width: '100%', maxWidth: MaxContentWidth, gap: Spacing.four, paddingBottom: Spacing.four },
  backRow: { flexDirection: 'row', marginBottom: -Spacing.two },
  header: { gap: Spacing.two, paddingTop: Spacing.three },
  titleRow: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.three },
  titleText: { flex: 1, gap: Spacing.one },
  eyebrow: { letterSpacing: 2, textTransform: 'uppercase' },
});
