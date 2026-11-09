/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://unistyl.es/), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#2D193D',
    background: '#FFFBF5',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#EDE5FF',
    textSecondary: '#706479',
    primary: '#7C3AED',
    onPrimary: '#FFFFFF',
    border: '#E9E0EE',
    accent: '#F1E9FF',
  },
  dark: {
    text: '#FFF7FF',
    background: '#1D1326',
    backgroundElement: '#2B1D36',
    backgroundSelected: '#423055',
    textSecondary: '#C4B4D0',
    primary: '#C4A0FF',
    onPrimary: '#27113E',
    border: '#493552',
    accent: '#352146',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

export const Radius = { small: 12, card: 24, pill: 999 } as const;
