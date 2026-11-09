import { SymbolView } from 'expo-symbols';
import type { ComponentProps } from 'react';

const icons = {
  map: { ios: 'map', android: 'map', web: 'map' },
  trips: { ios: 'suitcase.rolling', android: 'luggage', web: 'luggage' },
  diary: { ios: 'book.closed', android: 'menu_book', web: 'menu_book' },
  profile: { ios: 'person.crop.circle', android: 'account_circle', web: 'account_circle' },
  globe: { ios: 'globe.europe.africa', android: 'public', web: 'public' },
} satisfies Record<string, ComponentProps<typeof SymbolView>['name']>;

export type AppIconName = keyof typeof icons;

export function AppIcon({ name, color, size = 24 }: {
  name: AppIconName;
  color: ComponentProps<typeof SymbolView>['tintColor'];
  size?: number;
}) {
  return <SymbolView name={icons[name]} tintColor={color} size={size} />;
}
