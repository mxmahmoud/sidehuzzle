import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AmbientGlassBackground } from '@/components/AmbientGlassBackground';
import { GlassCard } from '@/components/GlassCard';
import { ListingCard } from '@/components/ListingCard';
import { MapSurface } from '@/components/MapSurface';
import { useDiscoveryListings } from '@/data/listingsQueries';
import type { DiscoveryListing } from '@/data/listingTypes';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { useThemeColors } from '@/theme/useThemeColors';
import { motion, radius, shadow, space, type as typeStyles } from '@/theme/tokens';

export function MapViewScreen() {
  const c = useThemeColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchActive, setSearchActive] = useState(false);
  const listingMode = useDiscoveryStore((s) => s.listingMode);
  const selectedListingId = useDiscoveryStore((s) => s.selectedListingId);
  const setSelectedListingId = useDiscoveryStore((s) => s.setSelectedListingId);
  const category = useDiscoveryStore((s) => s.category);
  const sortBy = useDiscoveryStore((s) => s.sortBy);
  const priceRange = useDiscoveryStore((s) => s.priceRange);
  const distance = useDiscoveryStore((s) => s.distance);
  const rating = useDiscoveryStore((s) => s.rating);
  const filters = useMemo(
    () => ({ category, sortBy, priceRange, distance, rating }),
    [category, distance, priceRange, rating, sortBy],
  );
  const { data: listings = [], isLoading, isError } = useDiscoveryListings(listingMode, filters);

  const openDetail = useCallback(
    (item: DiscoveryListing) => {
      router.push({
        pathname: item.kind === 'worker' ? '/worker_description' : '/job_description',
        params: { id: item.id },
      });
    },
    [router],
  );

  return (
    <View style={[styles.root, { backgroundColor: c.background_alt }]}>
      <Stack.Screen options={{ title: 'Map', headerShown: false }} />
      <AmbientGlassBackground />
      <MapSurface listings={listings} style={styles.map} />

      <View style={[styles.topChrome, { paddingTop: insets.top + space.sm }]}>
        <GlassCard variant="chrome" style={[styles.searchBar, Platform.OS === 'web' && searchActive ? styles.searchBarActive : undefined]}>
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Back"
            style={({ pressed }) => [styles.navButton, pressed ? styles.pressed : undefined]}
          >
            <Ionicons name="arrow-back" size={20} color={c.text_primary} />
          </Pressable>
          <Pressable
            onPress={() => router.push('/search_screen')}
            onHoverIn={() => setSearchActive(true)}
            onHoverOut={() => setSearchActive(false)}
            onFocus={() => setSearchActive(true)}
            onBlur={() => setSearchActive(false)}
            accessibilityRole="search"
            style={({ hovered, pressed }) => [
              styles.searchAction,
              Platform.OS === 'web' ? styles.searchActionMotion : undefined,
              hovered && Platform.OS === 'web' ? styles.searchActionHover : undefined,
              pressed ? styles.pressed : undefined,
              hovered && Platform.OS === 'web' ? ({ cursor: 'pointer' } as ViewStyle) : undefined,
            ]}
          >
            <Ionicons name="search" size={18} color={c.text_secondary} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.searchTitle, { color: c.text_primary }]}>Search the map</Text>
              <Text style={[typeStyles.caption, { color: c.text_secondary }]}>{filters.distance} radius</Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => router.push('/discovery_filter')}
            accessibilityRole="button"
            accessibilityLabel="Open filters"
            style={({ pressed }) => [styles.navButton, pressed ? styles.pressed : undefined]}
          >
            <Ionicons name="options-outline" size={20} color={c.text_primary} />
          </Pressable>
        </GlassCard>
      </View>

      <View style={[styles.sheet, { backgroundColor: c.glass_sheet, borderColor: c.glass_border, paddingBottom: insets.bottom + space.md }]}>
        <View style={styles.sheetHeader}>
          <View>
            <Text style={[typeStyles.subtitle, { color: c.text_primary }]}>Map results</Text>
            <Text style={[typeStyles.caption, { color: c.text_secondary }]}>
              {isLoading ? 'Loading' : isError ? 'Backend unavailable' : `${listings.length} places found`}
            </Text>
          </View>
          <Pressable
            onPress={() => router.push('/(tabs)/landing_page')}
            accessibilityRole="button"
            style={({ pressed }) => [styles.listButton, { borderColor: c.border_subtle, backgroundColor: c.surface_primary }, pressed ? styles.pressed : undefined]}
          >
            <Ionicons name="list-outline" size={17} color={c.text_primary} />
            <Text style={[styles.listButtonText, { color: c.text_primary }]}>List</Text>
          </Pressable>
        </View>

        <FlashList
          horizontal
          data={listings}
          renderItem={({ item }: { item: DiscoveryListing }) => (
            <View style={styles.carouselItem}>
              <ListingCard
                compact
                item={item}
                selected={selectedListingId === item.id}
                onPreview={() => setSelectedListingId(item.id)}
                onPress={() => openDetail(item)}
                onSave={() => {}}
              />
            </View>
          )}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={{ width: space.md }} />}
          contentContainerStyle={styles.carousel}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  map: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
  topChrome: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: space.md,
    zIndex: 3,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    padding: space.sm,
  },
  searchBarActive: {
    transform: [{ translateY: -3 }],
    // @ts-ignore web-only
    boxShadow: shadow.hover.boxShadow,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchAction: {
    flex: 1,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    borderRadius: radius.input,
  },
  searchActionMotion: {
    transitionDuration: `${motion.standardMs}ms`,
    transitionProperty: 'opacity, transform',
    transitionTimingFunction: motion.easeInOut,
  } as ViewStyle,
  searchActionHover: {
    transform: [{ scale: 1.006 }],
  },
  searchTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
  },
  sheet: {
    position: 'absolute',
    left: space.md,
    right: space.md,
    bottom: space.md,
    borderRadius: radius.sheet,
    borderWidth: 1,
    paddingTop: space.md,
    overflow: 'hidden',
    zIndex: 3,
    // @ts-ignore web-only glass
    WebkitBackdropFilter: 'blur(34px)',
    backdropFilter: 'blur(34px)',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
    paddingHorizontal: space.md,
    paddingBottom: space.md,
  },
  listButton: {
    minHeight: 44,
    borderRadius: radius.button,
    borderWidth: 1,
    paddingHorizontal: space.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  listButtonText: {
    fontSize: 13,
    fontWeight: '800',
  },
  carousel: {
    paddingHorizontal: space.md,
    paddingBottom: space.sm,
  },
  carouselItem: {
    width: 360,
    maxWidth: 360,
  },
  pressed: {
    opacity: 0.82,
  },
});
