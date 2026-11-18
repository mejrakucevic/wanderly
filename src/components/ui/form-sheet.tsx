import { router } from 'expo-router';
import type { PropsWithChildren } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = PropsWithChildren<{
  title: string;
  saveLabel?: string;
  onSave: () => void;
  error?: string | null;
  /** Disables Save and shows a spinner while the request is running. */
  saving?: boolean;
}>;

/** Layout for modal forms: Cancel · Title · Save header, keyboard-aware scrolling body. */
export function FormSheet({ title, saveLabel = 'Save', onSave, error, saving = false, children }: Props) {
  const theme = useTheme();
  return (
    <SafeAreaView edges={['top', 'bottom', 'left', 'right']} style={[styles.page, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Pressable accessibilityRole="button" onPress={() => router.back()} hitSlop={8} style={styles.headerButton}>
          <ThemedText themeColor="textSecondary">Cancel</ThemedText>
        </Pressable>
        <ThemedText accessibilityRole="header" style={styles.title} numberOfLines={1}>{title}</ThemedText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={saveLabel}
          accessibilityState={{ disabled: saving, busy: saving }}
          disabled={saving}
          onPress={onSave}
          hitSlop={8}
          style={[styles.headerButton, styles.right]}>
          {saving
            ? <ActivityIndicator color={theme.primary} />
            : <ThemedText themeColor="primary" style={styles.save}>{saveLabel}</ThemedText>}
        </Pressable>
      </View>
      <KeyboardAvoidingView style={styles.page} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive">
          {error ? <ThemedText accessibilityRole="alert" accessibilityLiveRegion="polite" themeColor="danger">{error}</ThemedText> : null}
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.three, minHeight: 56, borderBottomWidth: StyleSheet.hairlineWidth },
  headerButton: { minWidth: 72, minHeight: 44, justifyContent: 'center' },
  right: { alignItems: 'flex-end' },
  title: { flex: 1, textAlign: 'center', fontWeight: '700' },
  save: { fontWeight: '700' },
  body: { padding: Spacing.four, gap: Spacing.four, width: '100%', maxWidth: 640, alignSelf: 'center' },
});
