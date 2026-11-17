import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/hooks/use-theme';
import { AuthProvider, useAuth } from '@/providers/auth-provider';

function RootNavigator() {
  const { session, isLoading } = useAuth();
  const theme = useTheme();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator accessibilityLabel="Restoring your session" color={theme.primary} size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={Boolean(session)}>
        <Stack.Screen name="(tabs)" />
        {/* Detail screens sit above the tabs so "back" always returns to where the user came from. */}
        <Stack.Screen name="trip/[id]" />
        <Stack.Screen name="entry/[id]" />
        <Stack.Screen name="countries" />
        {/* Create/edit forms open as modals (swipe down to dismiss on iOS). */}
        <Stack.Screen name="trip-form" options={{ presentation: 'modal' }} />
        <Stack.Screen name="entry-form" options={{ presentation: 'modal' }} />
        <Stack.Screen name="expense-form" options={{ presentation: 'modal' }} />
        <Stack.Screen name="country-picker" options={{ presentation: 'modal' }} />
      </Stack.Protected>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const isDark = useColorScheme() === 'dark';
  const colors = useTheme();
  const baseTheme = isDark ? DarkTheme : DefaultTheme;

  return (
    <AuthProvider>
      <ThemeProvider value={{ ...baseTheme, colors: {
        ...baseTheme.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.backgroundElement,
        text: colors.text,
        border: colors.border,
      } }}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <RootNavigator />
      </ThemeProvider>
    </AuthProvider>
  );
}
