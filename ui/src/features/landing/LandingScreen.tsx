import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapSurface } from '@/components/MapSurface';
import { WebTopNav } from '@/components/WebTopNav';
import { useDiscoveryListings } from '@/data/listingsQueries';
import type { DiscoveryListing } from '@/data/listingTypes';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { useThemeColors } from '@/theme/useThemeColors';
import { radius, shadow, space, type as typeStyles } from '@/theme/tokens';

function FilterChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const c = useThemeColors();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, { backgroundColor: active ? c.surface_selected : c.surface_elevated, borderColor: active ? c.accent_primary : c.border_subtle }]}
      accessibilityRole="button"
    >
      <Text style={[styles.chipText, { color: active ? c.text_primary : c.text_secondary }]}>{label}</Text>
    </Pressable>
  );
}

function ListingCard({
  item,
  selected,
  onSelect,
  onOpen,
  desktopSplit,
}: {
  item: DiscoveryListing;
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
  desktopSplit: boolean;
}) {
  const c = useThemeColors();
  return (
    <View style={[styles.card, { backgroundColor: selected ? c.surface_selected : c.surface_elevated, borderColor: selected ? c.accent_primary : c.border_subtle }, shadow.card]}>
      <Pressable
        onPress={() => {
          if (desktopSplit) {
            if (selected) {
              onOpen();
            } else {
              onSelect();
            }
            return;
          }
          onOpen();
        }}
        style={styles.cardMainAction}
        accessibilityRole="button"
      >
        <View style={[styles.thumb, { backgroundColor: item.imageColor }]}>
          <View style={[styles.kindBadge, { backgroundColor: item.kind === 'job' ? 'rgba(109,156,255,0.22)' : 'rgba(255,94,168,0.22)' }]}>
            <Text style={[styles.kindBadgeText, { color: c.text_primary }]}>{item.kind === 'job' ? 'Job' : 'Pro'}</Text>
          </View>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.cardMetaRow}>
            <Text style={[styles.cardLocation, { color: c.text_secondary }]}>{item.locationLabel}</Text>
            <Text style={{ color: c.text_secondary, fontSize: 12 }}>{item.distanceKm.toFixed(1)} km</Text>
          </View>
          <Text style={[typeStyles.subtitle, { color: c.text_primary }]} numberOfLines={1}>{item.title}</Text>
          <Text style={{ color: c.text_secondary, fontSize: 13, lineHeight: 19 }} numberOfLines={2}>{item.subtitle}</Text>
          <View style={styles.cardFooter}>
            <Text style={{ color: c.text_secondary, fontSize: 13, fontWeight: '600' }}>★ {item.rating.toFixed(1)} ({item.reviewCount})</Text>
            <Text style={[typeStyles.price, { color: c.text_primary }]}>{item.rateLabel}</Text>
          </View>
          {desktopSplit && selected ? (
            <View style={[styles.viewButton, { backgroundColor: c.accent_primary }]}>
              <Text style={styles.viewButtonText}>Selected — tap to open</Text>
            </View>
          ) : null}
        </View>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="Save" onPress={() => {}} style={[styles.saveButton, { backgroundColor: c.surface_primary }]}>
        <Ionicons name="heart-outline" size={18} color={c.text_primary} />
      </Pressable>
    </View>
  );
}

export function LandingScreen() {
  const c = useThemeColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';

  const viewMode = useDiscoveryStore((s) => s.viewMode);
  const listingMode = useDiscoveryStore((s) => s.listingMode);
  const selectedListingId = useDiscoveryStore((s) => s.selectedListingId);
  const category = useDiscoveryStore((s) => s.category);
  const sortBy = useDiscoveryStore((s) => s.sortBy);
  const priceRange = useDiscoveryStore((s) => s.priceRange);
  const distance = useDiscoveryStore((s) => s.distance);
  const rating = useDiscoveryStore((s) => s.rating);
  const setViewMode = useDiscoveryStore((s) => s.setViewMode);
  const setListingMode = useDiscoveryStore((s) => s.setListingMode);
  const setSelectedListingId = useDiscoveryStore((s) => s.setSelectedListingId);

  const { data: listings = [], isLoading } = useDiscoveryListings(listingMode, { category, sortBy, priceRange, distance, rating });
  const showMap = viewMode !== 'list_only';

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

  const renderItem = useCallback(
    ({ item }: { item: DiscoveryListing }) => (
      <ListingCard
        item={item}
        selected={selectedListingId === item.id}
        onSelect={() => setSelectedListingId(item.id)}
        onOpen={() => openDetail(item)}
        desktopSplit={viewMode === 'split'}
      />
    ),
    [openDetail, selectedListingId, setSelectedListingId, viewMode]
  );

  const resultLabel = listingMode === 'worker' ? 'Trusted pros nearby' : listingMode === 'group' ? 'Mixed discovery' : 'Open jobs nearby';

  const listHeader = (
    <View style={styles.listHeader}>
      <Text style={[styles.listEyebrow, { color: c.accent_primary }]}>Discovery</Text>
      <Text style={[typeStyles.title, { color: c.text_primary }]}>{resultLabel}</Text>
      <Text style={{ color: c.text_secondary, fontSize: 14, lineHeight: 21 }}>{isLoading ? 'Loading...' : `${listings.length} results`}</Text>
    </View>
  );

  const searchOverlay = (
    <View style={styles.searchOverlayWrap}>
      <Pressable style={[styles.searchOverlay, { backgroundColor: c.surface_primary, borderColor: c.border_subtle }]} onPress={() => router.push('/search_screen')} accessibilityRole="button">
        <View style={[styles.searchIcon, { backgroundColor: c.surface_elevated }]}>
          <Ionicons name="search" size={18} color={c.text_secondary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: c.text_primary, fontSize: 15, fontWeight: '600' }}>Freelancers or jobs</Text>
          <Text style={{ color: c.text_secondary, fontSize: 12, marginTop: 2 }}>Where? Flexible dates</Text>
        </View>
        <View style={styles.searchActionGroup}>
          <Pressable onPress={() => router.push('/discovery_filter')} style={[styles.smallIconButton, { backgroundColor: c.surface_elevated }]} accessibilityRole="button">
            <Ionicons name="options-outline" size={18} color={c.text_primary} />
          </Pressable>
          {!isWeb && (
            <Pressable onPress={() => router.push('/options_menu')} style={[styles.smallIconButton, { backgroundColor: c.surface_elevated }]} accessibilityRole="button">
              <Ionicons name="menu" size={18} color={c.text_primary} />
            </Pressable>
          )}
        </View>
      </Pressable>
    </View>
  );

  const listContent = isLoading ? (
    <Text style={[typeStyles.body, { color: c.text_secondary, textAlign: 'center', padding: space.xl }]}>Loading...</Text>
  ) : (
    <FlashList
      data={listings}
      renderItem={renderItem}
      keyExtractor={(item: DiscoveryListing) => item.id}
      ItemSeparatorComponent={() => <View style={{ height: space.md }} />}
      contentContainerStyle={{ padding: space.md, paddingBottom: space.xl * 2 }}
      ListHeaderComponent={listHeader}
    />
  );

  return (
    <View style={[styles.root, { backgroundColor: c.surface_secondary }]}>
      {isWeb && <WebTopNav />}
      <View style={styles.heroWrap}>
        <View style={[styles.heroTop, { backgroundColor: c.surface_secondary }]}>
          <View style={[styles.heroCopy, { paddingTop: isWeb ? space.sm : insets.top + space.sm }]}>
            <Text style={[styles.eyebrow, { color: c.accent_primary }]}>Curated near you</Text>
            <Text style={[styles.heroTitle, { color: c.text_primary }]}>Find trusted work. Discover nearby pros.</Text>
            <Text style={{ color: c.text_secondary, fontSize: 14, lineHeight: 21 }}>A premium marketplace view with live map context and fast filter controls.</Text>
          </View>
          <View style={styles.filterStrip}>
            <FilterChip label="Map" active={viewMode === 'map_only'} onPress={() => setViewMode('map_only')} />
            <FilterChip label="Split" active={viewMode === 'split'} onPress={() => setViewMode('split')} />
            <FilterChip label="List" active={viewMode === 'list_only'} onPress={() => setViewMode('list_only')} />
            <View style={{ width: space.md }} />
            <FilterChip label="Workers" active={listingMode === 'worker'} onPress={() => setListingMode('worker')} />
            <FilterChip label="Jobs" active={listingMode === 'job'} onPress={() => setListingMode('job')} />
            <FilterChip label="All" active={listingMode === 'group'} onPress={() => setListingMode('group')} />
            <Pressable style={styles.inlineLink} onPress={() => router.push('/map_view')}>
              <Ionicons name="expand" size={16} color={c.accent_primary} />
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.splitContainer}>
        <View style={styles.mapRegionWrap}>
          {showMap ? (
            <View style={[styles.mapRegion, { shadowColor: '#000' }]}>
              <MapSurface listings={listings} compact={viewMode === 'split'} style={styles.mapFill} />
            </View>
          ) : (
            <View style={[styles.mapRegion, styles.mapHidden, { backgroundColor: c.surface_elevated, borderColor: c.border_subtle }]} />
          )}
        </View>

        {searchOverlay}

        {viewMode !== 'map_only' ? (
          <View style={[styles.listRegion, { backgroundColor: c.surface_primary, borderColor: c.border_subtle }]}>{listContent}</View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  heroWrap: { paddingHorizontal: space.md, paddingTop: space.sm },
  heroTop: { gap: space.md },
  heroCopy: { gap: space.xs, paddingHorizontal: space.sm },
  eyebrow: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  heroTitle: { fontSize: 28, lineHeight: 34, fontWeight: '800', letterSpacing: -0.8 },
  filterStrip: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, alignItems: 'center', paddingHorizontal: space.sm, paddingBottom: space.sm },
  searchOverlayWrap: { marginTop: -24, marginBottom: -14, zIndex: 10, paddingHorizontal: space.md },
  searchOverlay: { flexDirection: 'row', alignItems: 'center', gap: space.md, borderRadius: radius.sheet, borderWidth: 1, padding: space.md, ...shadow.soft },
  searchIcon: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  searchActionGroup: { flexDirection: 'row', gap: space.sm, alignItems: 'center' },
  smallIconButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  splitContainer: {
    flex: 1,
    paddingHorizontal: space.md,
    paddingBottom: space.md,
    gap: space.md,
    marginTop: space.xs,
  },
  mapRegionWrap: { overflow: 'visible' },
  mapRegion: {
    flex: 3,
    minHeight: 240,
    borderRadius: radius.sheet,
    overflow: 'hidden',
  },
  mapFill: {
    flex: 1,
    minHeight: 220,
  },
  listRegion: {
    flex: 7,
    borderRadius: radius.sheet,
    borderWidth: 1,
    overflow: 'hidden',
    marginTop: -10,
    paddingTop: 8,
  },
  mapHidden: {
    borderRadius: radius.card,
    borderWidth: 1,
  },
  listHeader: { gap: 6, paddingBottom: space.lg },
  listEyebrow: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  card: { padding: space.md, borderRadius: radius.card, borderWidth: 1, flexDirection: 'row', alignItems: 'flex-start', gap: space.sm },
  cardMainAction: { flex: 1, flexDirection: 'row', alignItems: 'stretch', gap: space.md },
  thumb: { width: 88, height: 104, borderRadius: radius.card, justifyContent: 'flex-start', padding: space.sm },
  kindBadge: { alignSelf: 'flex-start', borderRadius: radius.chip, paddingHorizontal: 10, paddingVertical: 5 },
  kindBadgeText: { fontSize: 11, fontWeight: '700' },
  cardBody: { flex: 1, gap: 6 },
  cardMetaRow: { flexDirection: 'row', justifyContent: 'space-between', gap: space.sm },
  cardLocation: { fontSize: 12, fontWeight: '600' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' },
  saveButton: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start' },
  viewButton: { marginTop: space.sm, alignSelf: 'flex-start', borderRadius: radius.chip, paddingHorizontal: space.md, paddingVertical: space.sm },
  viewButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
});
