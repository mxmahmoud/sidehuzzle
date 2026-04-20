import { FlashList } from '@shopify/flash-list';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/side/Button';
import { ListingCard } from '@/components/side/ListingCard';
import { ScreenShell } from '@/components/side/ScreenShell';
import { StateView } from '@/components/side/StateView';
import { useDiscoveryListings } from '@/data/listingsQueries';
import type { DiscoveryListing } from '@/data/listingTypes';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { useThemeColors } from '@/theme/useThemeColors';
import { space, type as typeStyles } from '@/theme/tokens';

export function MarketplaceSearchResultsScreen() {
  const c = useThemeColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { q } = useLocalSearchParams<{ q?: string }>();
  const listingMode = useDiscoveryStore((s) => s.listingMode);
  const category = useDiscoveryStore((s) => s.category);
  const sortBy = useDiscoveryStore((s) => s.sortBy);
  const priceRange = useDiscoveryStore((s) => s.priceRange);
  const distance = useDiscoveryStore((s) => s.distance);
  const rating = useDiscoveryStore((s) => s.rating);
  const setSelectedListingId = useDiscoveryStore((s) => s.setSelectedListingId);
  const filters = useMemo(() => ({ category, sortBy, priceRange, distance, rating, query: q }), [category, distance, priceRange, q, rating, sortBy]);
  const { data: listings = [], isLoading, isError, refetch } = useDiscoveryListings(listingMode, filters);

  const openDetail = useCallback(
    (item: DiscoveryListing) => {
      router.push({ pathname: item.kind === 'worker' ? '/worker_description' : '/job_description', params: { id: item.id } });
    },
    [router],
  );

  return (
    <View className="flex-1" style={{ backgroundColor: c.background_alt }} testID="search-results">
      <Stack.Screen options={{ title: q ? `"${q}"` : 'Results', headerShown: true }} />
      <ScreenShell maxWidth="lg" padded={false} contentClassName="px-side-md pt-side-md" withBackground>
        {isLoading ? (
          <StateView icon="search-outline" title="Searching nearby" body="Checking jobs and service profiles against your filters." />
        ) : isError ? (
          <StateView icon="cloud-offline-outline" title="Search is unavailable" body="Check the backend connection and retry." actionLabel="Retry" tone="warning" onAction={() => void refetch()} />
        ) : (
          <FlashList
            data={listings}
            keyExtractor={(item: DiscoveryListing) => item.id}
            ItemSeparatorComponent={() => <View style={{ height: space.md }} />}
            contentContainerStyle={{ paddingBottom: space.xl * 4 }}
            maintainVisibleContentPosition={{ disabled: true }}
            ListHeaderComponent={
              <View className="gap-side-xs py-side-lg">
                <Text style={[typeStyles.title, { color: c.text_primary }]}>{q ? `Results for "${q}"` : 'All results'}</Text>
                <Text className="text-[13px] font-semibold leading-[18px]" style={{ color: c.text_secondary }}>
                  {listings.length} found
                </Text>
              </View>
            }
            ListEmptyComponent={
              <StateView icon="search-outline" title="No matching work yet" body="Try a different search or broaden your filters." actionLabel="Edit search" onAction={() => router.push('/search_screen')} />
            }
            renderItem={({ item }: { item: DiscoveryListing }) => (
              <ListingCard
                item={item}
                onPreview={() => setSelectedListingId(item.id)}
                onPress={() => openDetail(item)}
                onSave={() => {}}
              />
            )}
          />
        )}
      </ScreenShell>
      <View className="absolute bottom-0 left-0 right-0 z-[4] items-center px-side-md" style={{ paddingBottom: insets.bottom + 12 }} pointerEvents="box-none">
        <Button label="Map" icon="map-outline" variant="secondary" onPress={() => router.push('/map_view')} testID="search-results-map-button" />
      </View>
    </View>
  );
}
