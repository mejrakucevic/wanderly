import { useEffect, useEffectEvent, useRef, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { Radius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/hooks/use-theme';
import type { Location } from '@/types/models';

export type PlacesMapProps = {
  places: Location[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  height?: number;
  /** Shows the blue "you are here" dot. Only pass true once location permission is granted. */
  showsUserLocation?: boolean;
  /** Content drawn on top of the map (legend, selected-place card). */
  children?: ReactNode;
};

const EDGE_PADDING = { top: 60, right: 50, bottom: 60, left: 50 };

/** Interactive map (Apple Maps on iOS, Google Maps on Android) with a pin per saved place. */
export function PlacesMap({ places, selectedId, onSelect, height = 380, showsUserLocation = false, children }: PlacesMapProps) {
  const theme = useTheme();
  const scheme = useColorScheme();
  const map = useRef<MapView>(null);
  const isReady = useRef(false);

  function fitAll() {
    if (!isReady.current || places.length === 0) return;
    if (places.length === 1) {
      map.current?.animateToRegion({ latitude: places[0].latitude, longitude: places[0].longitude, latitudeDelta: 0.2, longitudeDelta: 0.2 });
      return;
    }
    map.current?.fitToCoordinates(places.map(({ latitude, longitude }) => ({ latitude, longitude })), { edgePadding: EDGE_PADDING, animated: true });
  }

  // Zoom to the selected pin, or show every pin when nothing is selected (e.g. after changing the filter).
  const moveCamera = useEffectEvent(() => {
    const selected = places.find((p) => p.id === selectedId);
    if (selected && isReady.current) {
      map.current?.animateToRegion({ latitude: selected.latitude, longitude: selected.longitude, latitudeDelta: 0.6, longitudeDelta: 0.6 }, 600);
    } else {
      fitAll();
    }
  });
  const placeKey = places.map((p) => p.id).join(',');
  useEffect(() => moveCamera(), [selectedId, placeKey]);

  return (
    <View style={[styles.frame, { height, borderColor: theme.border }]}>
      <MapView
        ref={map}
        style={StyleSheet.absoluteFill}
        initialRegion={{ latitude: 30, longitude: 10, latitudeDelta: 120, longitudeDelta: 120 }}
        userInterfaceStyle={scheme === 'dark' ? 'dark' : 'light'}
        showsPointsOfInterests={false}
        showsUserLocation={showsUserLocation}
        pitchEnabled={false}
        toolbarEnabled={false}
        onMapReady={() => { isReady.current = true; fitAll(); }}>
        {places.map((place) => (
          <Marker
            key={place.id}
            identifier={place.id}
            coordinate={{ latitude: place.latitude, longitude: place.longitude }}
            title={place.name}
            description={[place.city, place.country].filter(Boolean).join(', ')}
            pinColor={place.status === 'visited' ? theme.primary : theme.pinWishlist}
            onPress={() => onSelect(place.id)}
          />
        ))}
      </MapView>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { width: '100%', borderRadius: Radius.card, borderWidth: 1, overflow: 'hidden' },
});
