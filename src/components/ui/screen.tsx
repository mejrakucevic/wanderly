import type { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ScreenProps = PropsWithChildren<{ eyebrow: string; title: string; description: string }>;

export function Screen({ eyebrow, title, description, children }: ScreenProps) {
  const theme = useTheme();
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.content}>
          <View style={styles.header}>
            <ThemedText type="smallBold" themeColor="primary" style={styles.eyebrow}>{eyebrow}</ThemedText>
            <ThemedText type="title" accessibilityRole="header">{title}</ThemedText>
            <ThemedText themeColor="textSecondary">{description}</ThemedText>
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
  header: { gap: Spacing.two, paddingTop: Spacing.three },
  eyebrow: { letterSpacing: 2, textTransform: 'uppercase' },
});
