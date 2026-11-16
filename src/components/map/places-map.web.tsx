// react-native-maps has no web support, so the web build falls back to the flat preview.
import { View } from 'react-native';

import { WorldPreview } from '@/components/map/world-preview';
import type { PlacesMapProps } from '@/components/map/places-map';

export function PlacesMap({ places, selectedId, onSelect, children }: PlacesMapProps) {
  return (
    <View>
      <WorldPreview places={places} selectedId={selectedId} onSelect={onSelect} />
      {children}
    </View>
  );
}
