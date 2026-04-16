import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AmbientGlassBackground } from '@/components/AmbientGlassBackground';
import { ListingCard } from '@/components/ListingCard';
import { useDiscoveryListings } from '@/data/listingsQueries';
import type { DiscoveryListing } from '@/data/listingTypes';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { useThemeColors } from '@/theme/useThemeColors';
import { radius, space, type as typeStyles } from '@/theme/tokens';

export default function SearchResultsRoute() {
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
  const filters = useMemo(
    () => ({ category, sortBy, priceRange, distance, rating, query: q }),
    [category, distance, priceRange, q, rating, sortBy],
  );
  const { data: listings = [], isLoading } = useDiscoveryListings(listingMode, filters);

  const openDetail = useCallback(
    (item: DiscoveryListing) => {
      if (item.kind === 'job') {
        router.push({ pathname: '/job_description', params: { id: item.id } });
      } else {
        router.push({ pathname: '/worker_description', params: { id: item.id } });
      }
    },
    [router]
  );

  return (
    <View style={[styles.root, { backgroundColor: c.background_alt }]}>
      <AmbientGlassBackground />
      <Stack.Screen options={{ title: q ? `"${q}"` : 'Results', headerShown: true }} />
      {isLoading ? (
        <Text style={[typeStyles.body, { color: c.text_secondary, textAlign: 'center', padding: space.xl }]}>Searching...</Text>
      ) : (
        <FlashList
          style={styles.contentLayer}
          data={listings}
          keyExtractor={(item: DiscoveryListing) => item.id}
          contentContainerStyle={{
            width: '100%',
            maxWidth: 920,
            alignSelf: 'center',
            paddingHorizontal: space.md,
            paddingBottom: insets.bottom + space.xl,
          }}
          ItemSeparatorComponent={() => <View style={{ height: space.md }} />}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={[typeStyles.title, { color: c.text_primary }]}>
                {q ? `Results for "${q}"` : 'All results'}
              </Text>
              <Text style={[typeStyles.caption, { color: c.text_secondary }]}>{listings.length} found</Text>
            </View>
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
      <View style={[styles.footer, { backgroundColor: c.glass_sheet, borderTopColor: c.glass_border, paddingBottom: insets.bottom + space.md }]}>
        <Pressable onPress={() => router.push('/map_view')} style={[styles.mapFab, { backgroundColor: c.accent_primary }]} accessibilityRole="button">
          <Ionicons name="map" size={18} color="#FFF" />
          <Text style={styles.mapFabText}>View on map</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/discovery_filter')} style={[styles.filterFab, { borderColor: c.border_subtle, backgroundColor: c.surface_elevated }]} accessibilityRole="button">
          <Ionicons name="options-outline" size={18} color={c.text_primary} />
          <Text style={[styles.filterFabText, { color: c.text_primary }]}>Filters</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  contentLayer: { position: 'relative', zIndex: 1 },
  header: { gap: 4, paddingVertical: space.lg },
  card: { flexDirection: 'row', gap: space.md, padding: space.md, borderRadius: radius.card, borderWidth: 1 },
  thumb: { width: 72, height: 88, borderRadius: radius.card, justifyContent: 'flex-start', padding: space.xs },
  badge: { alignSelf: 'flex-start', borderRadius: radius.chip, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 10, fontWeight: '700' },
  cardBody: { flex: 1, gap: 4, justifyContent: 'center' },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' },
  rating: { fontSize: 13, fontWeight: '600' },
  footer: { flexDirection: 'row', gap: space.md, paddingHorizontal: space.lg, paddingTop: space.md, borderTopWidth: 1, justifyContent: 'center', position: 'relative', zIndex: 2 },
  mapFab: { flexDirection: 'row', alignItems: 'center', gap: space.sm, borderRadius: radius.chip, paddingHorizontal: space.lg, paddingVertical: space.md },
  mapFabText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  filterFab: { flexDirection: 'row', alignItems: 'center', gap: space.sm, borderRadius: radius.chip, paddingHorizontal: space.lg, paddingVertical: space.md, borderWidth: 1 },
  filterFabText: { fontSize: 14, fontWeight: '600' },
});
