import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/hooks/use-theme';

export default function RootLayout() {
  const isDark = useColorScheme() === 'dark';
  const colors = useTheme();
  const baseTheme = isDark ? DarkTheme : DefaultTheme;

  return (
    <ThemeProvider value={{ ...baseTheme, colors: {
      ...baseTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.backgroundElement,
      text: colors.text,
      border: colors.border,
    } }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ThemeProvider>
  );
}
