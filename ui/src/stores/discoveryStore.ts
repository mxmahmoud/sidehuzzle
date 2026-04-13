import { create } from 'zustand';

export type DiscoveryViewMode = 'map_only' | 'split' | 'list_only';
export type ListingMode = 'worker' | 'job' | 'group';

export type DiscoveryState = {
  viewMode: DiscoveryViewMode;
  listingMode: ListingMode;
  selectedListingId: string | null;
  category: string;
  sortBy: string;
  priceRange: [number, number];
  distance: string;
  rating: string;
  setViewMode: (m: DiscoveryViewMode) => void;
  setListingMode: (m: ListingMode) => void;
  setSelectedListingId: (id: string | null) => void;
  setCategory: (value: string) => void;
  setSortBy: (value: string) => void;
  setPriceRange: (value: [number, number]) => void;
  setDistance: (value: string) => void;
  setRating: (value: string) => void;
  resetFilters: () => void;
};

export const useDiscoveryStore = create<DiscoveryState>((set) => ({
  viewMode: 'split',
  listingMode: 'job',
  selectedListingId: null,
  category: 'All',
  sortBy: 'Relevance',
  priceRange: [0, 200],
  distance: '10 km',
  rating: 'Any',
  setViewMode: (viewMode) => set({ viewMode }),
  setListingMode: (listingMode) => set({ listingMode }),
  setSelectedListingId: (selectedListingId) => set({ selectedListingId }),
  setCategory: (category) => set({ category }),
  setSortBy: (sortBy) => set({ sortBy }),
  setPriceRange: (priceRange) => set({ priceRange }),
  setDistance: (distance) => set({ distance }),
  setRating: (rating) => set({ rating }),
  resetFilters: () =>
    set({
      category: 'All',
      sortBy: 'Relevance',
      priceRange: [0, 200],
      distance: '10 km',
      rating: 'Any',
    }),
}));
