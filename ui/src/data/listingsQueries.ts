import { useQuery } from '@tanstack/react-query';
import { taskSchema } from '@/data/contract';
import { apiGet } from '@/data/api';
import { DEFAULT_CENTER } from '@/data/listingCoordinates';
import { taskToListing } from '@/data/listingPresentation';
import type { ListingMode } from '@/stores/discoveryStore';
import type { DiscoveryListing } from '@/data/listingTypes';

export type DiscoveryFilters = {
  category?: string;
  sortBy?: string;
  priceRange?: [number, number];
  distance?: string;
  rating?: string;
  query?: string;
};

function distanceToRadius(distance?: string): number {
  if (distance === '1 km') return 1;
  if (distance === '5 km') return 5;
  if (distance === '25 km') return 25;
  if (distance === '50 km') return 50;
  return 10;
}

function sortToApi(sortBy?: string): string {
  if (sortBy === 'Price: low to high') return 'price';
  if (sortBy === 'Price: high to low') return 'price_desc';
  if (sortBy === 'Rating') return 'ratings';
  return 'distance';
}

export function useDiscoveryListings(listingMode: ListingMode, filters: DiscoveryFilters = {}) {
  return useQuery({
    queryKey: ['discovery', 'listings', listingMode, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        latitude: String(DEFAULT_CENTER.latitude),
        longitude: String(DEFAULT_CENTER.longitude),
        radius_km: String(distanceToRadius(filters.distance)),
        limit: '48',
        offset: '0',
        order: 'distance_km',
        sort_by: sortToApi(filters.sortBy),
      });

      if (filters.query?.trim()) params.set('search', filters.query.trim());
      if (filters.category && filters.category !== 'All') params.append('category', filters.category);
      if (filters.priceRange) {
        params.set('min_price', String(filters.priceRange[0]));
        params.set('max_price', String(filters.priceRange[1]));
      }
      if (listingMode === 'worker') params.append('task_type', 'tasker');
      if (listingMode === 'job') params.append('task_type', 'task');

      const items = taskSchema.array().parse(await apiGet(`/tasks/search?${params.toString()}`));
      const minRating = filters.rating === '3+' ? 3 : filters.rating === '4+' ? 4 : filters.rating === '4.5+' ? 4.5 : 0;

      return items
        .map((item, index): DiscoveryListing => taskToListing(item, index))
        .filter((item) => item.rating >= minRating);
    },
    staleTime: 30_000,
  });
}
