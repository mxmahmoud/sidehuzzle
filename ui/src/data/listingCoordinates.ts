import type { DiscoveryListing } from '@/data/listingTypes';

export type MapPoint = {
  latitude: number;
  longitude: number;
};

export const DEFAULT_CENTER: MapPoint = {
  latitude: 48.2082,
  longitude: 16.3738,
};

export function listingCoordinate(index: number, total: number): MapPoint {
  const ring = Math.floor(index / 8);
  const angle = (index / Math.max(total, 1)) * Math.PI * 2;

  return {
    latitude: DEFAULT_CENTER.latitude + Math.sin(angle) * 0.02 * (ring + 1),
    longitude: DEFAULT_CENTER.longitude + Math.cos(angle) * 0.02 * (ring + 1),
  };
}

export function buildListingPoints(listings: DiscoveryListing[]) {
  return listings.map((listing, index) => ({
    listing,
    point:
      listing.latitude != null && listing.longitude != null
        ? { latitude: listing.latitude, longitude: listing.longitude }
        : listingCoordinate(index, listings.length),
  }));
}
