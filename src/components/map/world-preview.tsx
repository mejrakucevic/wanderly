import { Pressable, StyleSheet, View } from 'react-native';

import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Location } from '@/types/models';

/**
 * A lightweight stand-in for the interactive map: pins are placed on a flat
 * latitude/longitude grid. Used on web, where react-native-maps is not supported.
 */
export function WorldPreview({ places, selectedId, onSelect, embedded = false }: {
  places: Location[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  embedded?: boolean;
}) {
  const theme = useTheme();
  return (
    <View style={[styles.map, { backgroundColor: theme.accent, borderColor: theme.border }, embedded && styles.embedded]}>
      {[1, 2, 3].map((i) => <View key={`h${i}`} style={[styles.line, styles.horizontal, { top: `${i * 25}%`, backgroundColor: theme.border }]} />)}
      {[1, 2, 3, 4, 5].map((i) => <View key={`v${i}`} style={[styles.line, styles.vertical, { left: `${(i * 100) / 6}%`, backgroundColor: theme.border }]} />)}
      {places.map((place) => {
        const selected = place.id === selectedId;
        const visited = place.status === 'visited';
        const size = selected ? 22 : 14;
        return (
          <Pressable
            key={place.id}
            accessibilityRole="button"
            accessibilityLabel={`${place.name}, ${visited ? 'visited' : 'want to go'}`}
            accessibilityState={{ selected }}
            hitSlop={14}
            onPress={() => onSelect(place.id)}
            style={[styles.pin, {
              left: `${((place.longitude + 180) / 360) * 100}%`,
              top: `${((90 - place.latitude) / 180) * 100}%`,
              width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2,
              backgroundColor: visited ? theme.primary : theme.pinWishlist,
              borderColor: theme.backgroundElement,
              zIndex: selected ? 2 : 1,
            }]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  map: { width: '100%', aspectRatio: 1.6, borderRadius: Radius.card, borderWidth: 1, overflow: 'hidden' },
  embedded: { borderRadius: 0, borderWidth: 0, aspectRatio: 1.9 },
  line: { position: 'absolute', opacity: 0.8 },
  horizontal: { left: 0, right: 0, height: StyleSheet.hairlineWidth },
  vertical: { top: 0, bottom: 0, width: StyleSheet.hairlineWidth },
  pin: { position: 'absolute', borderRadius: Radius.pill, borderWidth: 3, boxShadow: '0 1px 4px rgba(45, 25, 61, 0.35)' },
});
