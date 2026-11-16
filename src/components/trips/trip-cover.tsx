import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AppIcon } from '@/components/ui/app-icon';
import { Radius, Spacing } from '@/constants/theme';

// Placeholder covers until photo uploads exist. Each trip keeps the same color.
const COVERS = [
  { background: '#7C3AED', shape: '#9B6BF2', text: '#FFFFFF' },
  { background: '#4C1D95', shape: '#6D3BBE', text: '#FFF7FF' },
  { background: '#C084FC', shape: '#D7B0FD', text: '#2D193D' },
  { background: '#F4C095', shape: '#F8D7B9', text: '#2D193D' },
  { background: '#8E4A7A', shape: '#A86595', text: '#FFFFFF' },
] as const;

export function coverFor(id: string) {
  let hash = 0;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return COVERS[hash % COVERS.length];
}

export function TripCover({ id, destination, height = 120, label }: { id: string; destination: string; height?: number; label?: string }) {
  const cover = coverFor(id);
  return (
    <View accessible={false} style={[styles.cover, { height, backgroundColor: cover.background }]}>
      <View style={[styles.circle, styles.big, { backgroundColor: cover.shape }]} />
      <View style={[styles.circle, styles.small, { backgroundColor: cover.shape }]} />
      <View style={styles.content}>
        <AppIcon name="pin" color={cover.text} size={18} />
        <ThemedText type="smallBold" style={{ color: cover.text, flexShrink: 1 }} numberOfLines={1}>{destination}</ThemedText>
      </View>
      {label ? (
        <View style={styles.label}>
          <ThemedText type="small" style={{ color: '#2D193D', fontWeight: '700' }}>{label}</ThemedText>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  cover: { borderRadius: Radius.small + 4, overflow: 'hidden', justifyContent: 'flex-end', padding: Spacing.three },
  circle: { position: 'absolute', borderRadius: Radius.pill, opacity: 0.6 },
  big: { width: 180, height: 180, right: -40, top: -70 },
  small: { width: 70, height: 70, right: 110, top: 30 },
  content: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  label: { position: 'absolute', top: Spacing.three, left: Spacing.three, backgroundColor: '#FFFBF5', borderRadius: Radius.pill, paddingHorizontal: Spacing.two + 2, paddingVertical: Spacing.half },
});
