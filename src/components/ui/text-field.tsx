import { useId } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = Omit<TextInputProps, 'style'> & {
  label: string;
  hint?: string;
  error?: string | null;
};

export function TextField({ label, hint, error, multiline, ...input }: Props) {
  const theme = useTheme();
  const labelId = useId();
  return (
    <View style={styles.field}>
      <ThemedText type="smallBold" nativeID={labelId}>{label}</ThemedText>
      <TextInput
        accessibilityLabel={label}
        accessibilityLabelledBy={labelId}
        accessibilityHint={error ?? hint}
        placeholderTextColor={theme.textSecondary}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        style={[styles.input, multiline && styles.multiline, {
          color: theme.text,
          backgroundColor: theme.background,
          borderColor: error ? theme.danger : theme.border,
        }]}
        {...input}
      />
      {error ? <ThemedText type="small" themeColor="danger">{error}</ThemedText>
        : hint ? <ThemedText type="small" themeColor="textSecondary">{hint}</ThemedText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: Spacing.two },
  input: { minHeight: 52, borderWidth: 1, borderRadius: Radius.small, paddingHorizontal: Spacing.three, paddingVertical: Spacing.three, fontSize: 16 },
  multiline: { minHeight: 160 },
});
