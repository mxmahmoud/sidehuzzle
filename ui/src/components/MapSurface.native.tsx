import { Platform, StyleSheet, type ViewStyle } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, type Region } from 'react-native-maps';
import { useThemeColors } from '@/theme/useThemeColors';
import { radius } from '@/theme/tokens';
import type { DiscoveryListing } from '@/data/listingTypes';
import { buildListingPoints, DEFAULT_CENTER } from '@/data/listingCoordinates';
import { useDiscoveryStore } from '@/stores/discoveryStore';

const DEFAULT_REGION: Region = {
  latitude: DEFAULT_CENTER.latitude,
  longitude: DEFAULT_CENTER.longitude,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

type Props = {
  style?: ViewStyle;
  listings: DiscoveryListing[];
  compact?: boolean;
};

export function MapSurface({ style, listings, compact }: Props) {
  const c = useThemeColors();
  const selectedListingId = useDiscoveryStore((s) => s.selectedListingId);
  const setSelectedListingId = useDiscoveryStore((s) => s.setSelectedListingId);
  const listingPoints = buildListingPoints(listings);

  return (
    <MapView
      provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
      style={[styles.map, compact && styles.compact, style]}
      initialRegion={DEFAULT_REGION}
      onPress={() => setSelectedListingId(null)}
    >
      {listingPoints.map(({ listing, point }) => {
        const selected = selectedListingId === listing.id;
        return (
          <Marker
            key={listing.id}
            coordinate={{ latitude: point.latitude, longitude: point.longitude }}
            pinColor={listing.kind === 'job' ? c.pin_job : c.pin_worker}
            onPress={() => setSelectedListingId(listing.id)}
            opacity={selected ? 1 : 0.85}
            title={listing.title}
            description={`${listing.rateLabel} · ★ ${listing.rating.toFixed(1)}`}
          />
        );
      })}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { width: '100%', minHeight: 220, borderRadius: radius.card, overflow: 'hidden' },
  compact: { minHeight: 160 },
});
