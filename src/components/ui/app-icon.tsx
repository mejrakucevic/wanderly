import { SymbolView } from 'expo-symbols';
import type { ComponentProps } from 'react';

const icons = {
  map: { ios: 'map', android: 'map', web: 'map' },
  trips: { ios: 'suitcase.rolling', android: 'luggage', web: 'luggage' },
  diary: { ios: 'book.closed', android: 'menu_book', web: 'menu_book' },
  profile: { ios: 'person.crop.circle', android: 'account_circle', web: 'account_circle' },
  globe: { ios: 'globe.europe.africa', android: 'public', web: 'public' },
  add: { ios: 'plus', android: 'add', web: 'add' },
  back: { ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' },
  chevron: { ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' },
  close: { ios: 'xmark', android: 'close', web: 'close' },
  search: { ios: 'magnifyingglass', android: 'search', web: 'search' },
  calendar: { ios: 'calendar', android: 'calendar_today', web: 'calendar_today' },
  wallet: { ios: 'creditcard', android: 'account_balance_wallet', web: 'account_balance_wallet' },
  pin: { ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' },
  edit: { ios: 'pencil', android: 'edit', web: 'edit' },
  trash: { ios: 'trash', android: 'delete', web: 'delete' },
  photo: { ios: 'photo.on.rectangle', android: 'photo_library', web: 'photo_library' },
  clock: { ios: 'clock', android: 'schedule', web: 'schedule' },
  sparkles: { ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' },
  check: { ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' },
  heart: { ios: 'heart', android: 'favorite', web: 'favorite' },
} satisfies Record<string, ComponentProps<typeof SymbolView>['name']>;

export type AppIconName = keyof typeof icons;

export function AppIcon({ name, color, size = 24 }: {
  name: AppIconName;
  color: ComponentProps<typeof SymbolView>['tintColor'];
  size?: number;
}) {
  return <SymbolView name={icons[name]} tintColor={color} size={size} />;
}
