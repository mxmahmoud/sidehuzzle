import './leaflet.web.css';

import L from 'leaflet';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from 'react-leaflet';
import { getMapConfig } from '@/config/map';
import { buildListingPoints, DEFAULT_CENTER } from '@/data/listingCoordinates';
import type { DiscoveryListing } from '@/data/listingTypes';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { useThemeColors } from '@/theme/useThemeColors';
import { useIsDark } from '@/theme/useThemeColors';
import { radius } from '@/theme/tokens';

type Props = {
  style?: ViewStyle;
  listings: DiscoveryListing[];
  compact?: boolean;
};

function createSvgIcon(kind: 'job' | 'worker', fillColor: string, selected: boolean) {
  const size = selected ? 36 : 28;
  const symbol = kind === 'job' ? 'M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z' : 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="${fillColor}" stroke="${selected ? '#FFF' : 'rgba(255,255,255,0.5)'}" stroke-width="${selected ? 2.5 : 1.5}"/><path d="${symbol}" fill="white" transform="scale(0.5) translate(12,12)"/></svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function SelectionSync({
  selectedListingId,
  listings,
}: {
  selectedListingId: string | null;
  listings: ReturnType<typeof buildListingPoints>;
}) {
  const map = useMap();

  useEffect(() => {
    if (!listings.length) return;
    const container = map.getContainer();
    if (!container?.isConnected || !container.clientWidth || !container.clientHeight) return;

    let cancelled = false;
    const raf = requestAnimationFrame(() => {
      if (cancelled) return;
      try {
        map.invalidateSize({ pan: false });
        if (selectedListingId) {
          const selected = listings.find(({ listing }) => listing.id === selectedListingId);
          if (selected) {
            map.setView([selected.point.latitude, selected.point.longitude], Math.max(map.getZoom(), 13), { animate: false });
            return;
          }
        }
        const bounds = L.latLngBounds(listings.map(({ point }) => [point.latitude, point.longitude] as [number, number]));
        map.fitBounds(bounds, { padding: [32, 32], maxZoom: 13, animate: false });
      } catch {
        // Leaflet may throw during rapid unmount
      }
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [listings, map, selectedListingId]);

  return null;
}

export function MapSurface({ style, listings, compact }: Props) {
  const c = useThemeColors();
  const isDark = useIsDark();
  const selectedListingId = useDiscoveryStore((s) => s.selectedListingId);
  const setSelectedListingId = useDiscoveryStore((s) => s.setSelectedListingId);
  const listingPoints = buildListingPoints(listings);
  const mapCfg = getMapConfig(isDark);

  return (
    <View
      testID="map-surface"
      style={[
        styles.frame,
        compact && styles.compact,
        style as object,
        { borderColor: c.glass_border, backgroundColor: 'transparent' },
      ]}
    >
      <MapContainer
        center={[DEFAULT_CENTER.latitude, DEFAULT_CENTER.longitude]}
        zoom={12}
        preferCanvas={false}
        scrollWheelZoom
        zoomControl={false}
        zoomAnimation={false}
        fadeAnimation={false}
        markerZoomAnimation={false}
        attributionControl={false}
        style={styles.map}
      >
        <TileLayer
          subdomains={mapCfg.tileSubdomains}
          url={mapCfg.tileUrlTemplate}
          maxZoom={mapCfg.maxZoom}
          crossOrigin="anonymous"
        />
        <SelectionSync selectedListingId={selectedListingId} listings={listingPoints} />
        {listingPoints.map(({ listing, point }) => {
          const selected = selectedListingId === listing.id;
          const icon = createSvgIcon(listing.kind, listing.kind === 'job' ? c.pin_job : c.pin_worker, selected);
          return (
            <Marker
              key={listing.id}
              position={[point.latitude, point.longitude]}
              icon={icon}
              eventHandlers={{
                click: () => setSelectedListingId(listing.id),
              }}
            >
              <Tooltip direction="top" offset={[0, -16]} opacity={0.95}>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13, lineHeight: 1.4, maxWidth: 200 }}>
                  <strong>{listing.title}</strong>
                  <br />
                  <span style={{ color: '#888' }}>{listing.rateLabel} · ★ {listing.rating.toFixed(1)}</span>
                </div>
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: '100%',
    minHeight: 220,
    borderRadius: radius.card,
    overflow: 'hidden',
    borderWidth: 0,
  },
  compact: { minHeight: 160 },
  map: { width: '100%', height: '100%', minHeight: 220 },
});
