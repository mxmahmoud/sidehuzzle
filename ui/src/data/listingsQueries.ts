import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/data/api';
import type { ListingMode } from '@/stores/discoveryStore';
import type { DiscoveryListing } from '@/data/listingTypes';

export type DiscoveryFilters = {
  category: string;
  sortBy: string;
  priceRange: [number, number];
  distance: string;
  rating: string;
};

type TaskSearchItem = {
  id: number;
  name: string;
  short_description: string | null;
  description: string | null;
  price: number | null;
  price_type: string | null;
  task_type: string | null;
  recurring: boolean | null;
  professional: boolean | null;
  address_id: number | null;
  distance_km?: number;
};

function getKind(item: TaskSearchItem): DiscoveryListing['kind'] {
  return item.task_type === 'recurring' || item.professional || item.recurring ? 'worker' : 'job';
}

function toDiscoveryListing(item: TaskSearchItem, index: number): DiscoveryListing {
  const kind = getKind(item);
  const title = item.name;
  const subtitle = item.short_description ?? item.description?.slice(0, 120) ?? 'Available nearby';
  const locationLabel = item.address_id ? `Location ${item.address_id}` : 'Nearby';
  const rateLabel = item.price != null ? `$${item.price}${item.price_type === 'hourly' ? '/hr' : ''}` : 'Contact';
  return {
    id: String(item.id),
    kind,
    title,
    subtitle,
    locationLabel,
    rateLabel,
    rating: 4.4 + (index % 6) * 0.1,
    reviewCount: 12 + index * 2,
    distanceKm: item.distance_km ?? 0.8 + index * 0.2,
    imageColor: kind === 'job' ? '#C7D2FE' : '#FBCFE8',
  };
}

export function useDiscoveryListings(listingMode: ListingMode, filters: DiscoveryFilters) {
  return useQuery({
    queryKey: ['discovery', 'listings', listingMode, filters],
    queryFn: async () => {
      const items = await apiGet<TaskSearchItem[]>('/tasks/search?limit=24&offset=0&order=distance_km');
      const kindFilter = listingMode === 'group' ? null : listingMode === 'worker' ? 'worker' : 'job';
      const maxDistance = filters.distance === '1 km' ? 1 : filters.distance === '5 km' ? 5 : filters.distance === '10 km' ? 10 : filters.distance === '25 km' ? 25 : 50;
      const minRating = filters.rating === '3+' ? 3 : filters.rating === '4+' ? 4 : filters.rating === '4.5+' ? 4.5 : 0;
      const [minPrice, maxPrice] = filters.priceRange;

      return items
        .filter((item) => (kindFilter ? getKind(item) === kindFilter : true))
        .filter((item) => (item.distance_km == null ? true : item.distance_km <= maxDistance))
        .filter((item, index) => {
          const mapped = toDiscoveryListing(item, index);
          const withinPrice = item.price == null ? true : item.price >= minPrice && item.price <= maxPrice;
          const meetsRating = mapped.rating >= minRating;
          return withinPrice && meetsRating;
        })
        .map((item, index) => toDiscoveryListing(item, index));
    },
  });
}
