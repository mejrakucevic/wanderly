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
  stay: { ios: 'bed.double', android: 'hotel', web: 'hotel' },
  transport: { ios: 'airplane', android: 'flight', web: 'flight' },
  activity: { ios: 'ticket', android: 'confirmation_number', web: 'confirmation_number' },
  food: { ios: 'fork.knife', android: 'restaurant', web: 'restaurant' },
  other: { ios: 'ellipsis.circle', android: 'more_horiz', web: 'more_horiz' },
  // Plan item icons (chosen per item in the plan form).
  hotel: { ios: 'building.2', android: 'hotel', web: 'hotel' },
  apartment: { ios: 'building', android: 'apartment', web: 'apartment' },
  hostel: { ios: 'bed.double', android: 'bed', web: 'bed' },
  lodge: { ios: 'house', android: 'cabin', web: 'cabin' },
  camping: { ios: 'tent', android: 'camping', web: 'camping' },
  plane: { ios: 'airplane', android: 'flight', web: 'flight' },
  train: { ios: 'tram', android: 'train', web: 'train' },
  bus: { ios: 'bus', android: 'directions_bus', web: 'directions_bus' },
  car: { ios: 'car', android: 'directions_car', web: 'directions_car' },
  ferry: { ios: 'ferry', android: 'directions_boat', web: 'directions_boat' },
  taxi: { ios: 'car.side', android: 'local_taxi', web: 'local_taxi' },
  museum: { ios: 'building.columns', android: 'museum', web: 'museum' },
  walk: { ios: 'figure.walk', android: 'directions_walk', web: 'directions_walk' },
  hike: { ios: 'figure.hiking', android: 'hiking', web: 'hiking' },
  movie: { ios: 'film', android: 'movie', web: 'movie' },
  show: { ios: 'theatermasks', android: 'theater_comedy', web: 'theater_comedy' },
  beach: { ios: 'beach.umbrella', android: 'beach_access', web: 'beach_access' },
  tour: { ios: 'signpost.right', android: 'tour', web: 'tour' },
  sport: { ios: 'sportscourt', android: 'sports_soccer', web: 'sports_soccer' },
  restaurant: { ios: 'fork.knife', android: 'restaurant', web: 'restaurant' },
  cafe: { ios: 'cup.and.saucer', android: 'local_cafe', web: 'local_cafe' },
  bar: { ios: 'wineglass', android: 'local_bar', web: 'local_bar' },
  'fast-food': { ios: 'takeoutbag.and.cup.and.straw', android: 'fastfood', web: 'fastfood' },
  documents: { ios: 'doc.text', android: 'description', web: 'description' },
  insurance: { ios: 'cross.case', android: 'health_and_safety', web: 'health_and_safety' },
  sim: { ios: 'simcard', android: 'sim_card', web: 'sim_card' },
  shopping: { ios: 'bag', android: 'shopping_bag', web: 'shopping_bag' },
} satisfies Record<string, ComponentProps<typeof SymbolView>['name']>;

export type AppIconName = keyof typeof icons;

export function AppIcon({ name, color, size = 24 }: {
  name: AppIconName;
  color: ComponentProps<typeof SymbolView>['tintColor'];
  size?: number;
}) {
  return <SymbolView name={icons[name]} tintColor={color} size={size} />;
}
