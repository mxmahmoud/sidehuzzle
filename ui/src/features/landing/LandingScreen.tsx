import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassCard } from '@/components/GlassCard';
import { MapSurface } from '@/components/MapSurface';
import { WebTopNav } from '@/components/WebTopNav';
import { useDiscoveryListings } from '@/data/listingsQueries';
import type { DiscoveryListing } from '@/data/listingTypes';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { useThemeColors, useIsDark } from '@/theme/useThemeColors';
import { radius, space, type as typeStyles } from '@/theme/tokens';

// ─── Background gradient styles (injected as global web style) ───────────────
const BG_GRADIENT_DARK = `radial-gradient(ellipse at 20% 0%, rgba(40,30,10,0.95) 0%, rgba(9,11,17,0.0) 60%), radial-gradient(ellipse at 80% 100%, rgba(16,24,48,0.90) 0%, rgba(9,11,17,0.0) 55%), linear-gradient(160deg, #090B11 0%, #0D111C 40%, #0A0C10 100%)`;
const BG_GRADIENT_LIGHT = `radial-gradient(ellipse at 20% 0%, rgba(200,210,255,0.60) 0%, rgba(238,240,245,0.0) 60%), radial-gradient(ellipse at 80% 100%, rgba(180,200,255,0.40) 0%, rgba(238,240,245,0.0) 55%), linear-gradient(160deg, #EEF0F5 0%, #F4F5FA 40%, #E8EAF2 100%)`;

// ─── FilterChip ───────────────────────────────────────────────────────────────
function FilterChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const c = useThemeColors();
  return (
    <GlassCard
      pressable
      onPress={onPress}
      selected={active}
      style={styles.chip}
    >
      <Text style={[styles.chipText, { color: active ? c.accent_primary : c.text_secondary }]}>{label}</Text>
    </GlassCard>
  );
}

// ─── ListingCard ───────────────────────────────────────────────────────────────
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

  const handlePress = () => {
    if (desktopSplit) {
      if (selected) { onOpen(); } else { onSelect(); }
      return;
    }
    onOpen();
  };

  return (
    <GlassCard
      pressable
      onPress={handlePress}
      selected={selected}
      style={styles.card}
    >
      {/* Thumbnail */}
      <View style={[styles.thumb, { backgroundColor: item.imageColor + '33' }]}>
        <View style={[styles.kindBadge, { backgroundColor: item.kind === 'job' ? 'rgba(124,199,255,0.18)' : 'rgba(216,180,106,0.18)' }]}>
          <Text style={[styles.kindBadgeText, { color: item.kind === 'job' ? c.pin_job : c.pin_worker }]}>
            {item.kind === 'job' ? 'Job' : 'Pro'}
          </Text>
        </View>
      </View>

      {/* Body */}
      <View style={styles.cardBody}>
        <View style={styles.cardMetaRow}>
          <Text style={[styles.cardLocation, { color: c.text_secondary }]}>{item.locationLabel}</Text>
          <Text style={{ color: c.text_secondary, fontSize: 12 }}>{item.distanceKm.toFixed(1)} km</Text>
        </View>
        <Text style={[typeStyles.subtitle, { color: c.text_primary }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={{ color: c.text_secondary, fontSize: 13, lineHeight: 19 }} numberOfLines={2}>
          {item.subtitle}
        </Text>
        <View style={styles.cardFooter}>
          <Text style={{ color: c.text_secondary, fontSize: 13, fontWeight: '600' }}>
            ★ {item.rating.toFixed(1)} ({item.reviewCount})
          </Text>
          <Text style={[typeStyles.price, { color: c.text_primary }]}>{item.rateLabel}</Text>
        </View>
        {desktopSplit && selected ? (
          <View style={[styles.viewButton, { backgroundColor: c.accent_primary }]}>
            <Text style={styles.viewButtonText}>Selected — tap to open</Text>
          </View>
        ) : null}
      </View>

      {/* Save button */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Save"
        onPress={() => {}}
        style={[styles.saveButton]}
      >
        <Ionicons name="heart-outline" size={18} color={c.text_secondary} />
      </Pressable>
    </GlassCard>
  );
}

// ─── LoadingState ─────────────────────────────────────────────────────────────
function LoadingState() {
  const { SkeletonCard } = require('@/components/Skeleton');
  return (
    <View style={{ padding: space.md }}>
      {Array.from({ length: 5 }).map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <View key={i} style={{ marginBottom: space.md }}>
          <GlassCard style={[styles.card, { opacity: 0.6 }] as object as ViewStyle}>
            <View style={styles.cardMainAction}>
              <View style={[styles.thumb, { backgroundColor: 'rgba(255,255,255,0.08)' }]} />
              <View style={styles.cardBody}>
                <View style={{ height: 12, width: '40%', backgroundColor: 'rgba(255,255,255,0.10)', borderRadius: 6 }} />
                <View style={{ height: 16, width: '90%', backgroundColor: 'rgba(255,255,255,0.10)', borderRadius: 6, marginTop: 8 }} />
                <View style={{ height: 16, width: '75%', backgroundColor: 'rgba(255,255,255,0.10)', borderRadius: 6, marginTop: 4 }} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto' }}>
                  <View style={{ height: 12, width: '30%', backgroundColor: 'rgba(255,255,255,0.10)', borderRadius: 6 }} />
                  <View style={{ height: 14, width: '20%', backgroundColor: 'rgba(255,255,255,0.10)', borderRadius: 6 }} />
                </View>
              </View>
            </View>
          </GlassCard>
        </View>
      ))}
    </View>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────
function EmptyState({ kind }: { kind: string }) {
  const c = useThemeColors();
  return (
    <View style={styles.emptyState}>
      <Ionicons name="map-outline" size={56} color={c.border_strong} />
      <Text style={[typeStyles.subtitle, { color: c.text_primary, marginTop: space.md }]}>
        No {kind === 'worker' ? 'pros' : 'jobs'} found nearby
      </Text>
      <Text style={{ color: c.text_secondary, fontSize: 14, textAlign: 'center', lineHeight: 21, marginTop: space.xs }}>
        Try expanding your distance or adjusting your filters.
      </Text>
    </View>
  );
}

// ─── ErrorState ───────────────────────────────────────────────────────────────
function ErrorState({ onRetry }: { onRetry: () => void }) {
  const c = useThemeColors();
  return (
    <View style={styles.emptyState}>
      <Ionicons name="cloud-offline-outline" size={56} color={c.accent_warning} />
      <Text style={[typeStyles.subtitle, { color: c.text_primary, marginTop: space.md }]}>
        Couldn't load listings
      </Text>
      <Text style={{ color: c.text_secondary, fontSize: 14, textAlign: 'center', lineHeight: 21, marginTop: space.xs }}>
        Check your connection or try again.
      </Text>
      <GlassCard
        pressable
        onPress={onRetry}
        style={[styles.retryBtn, { borderColor: c.accent_primary }] as object as ViewStyle}
      >
        <Ionicons name="refresh" size={16} color={c.accent_primary} />
        <Text style={{ color: c.accent_primary, fontWeight: '700', fontSize: 14 }}>Retry</Text>
      </GlassCard>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export function LandingScreen() {
  const c = useThemeColors();
  const isDark = useIsDark();
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

  const { data: listings = [], isLoading, isError, refetch } = useDiscoveryListings(listingMode, {
    category, sortBy, priceRange, distance, rating,
  });

  const showMap = viewMode !== 'list_only';
  const splitMode = viewMode === 'split';

  const openDetail = useCallback(
    (item: DiscoveryListing) => {
      if (item.kind === 'job') {
        router.push({ pathname: '/job_description', params: { id: item.id } });
      } else {
        router.push({ pathname: '/worker_description', params: { id: item.id } });
      }
    },
    [router],
  );

  const renderItem = useCallback(
    ({ item }: { item: DiscoveryListing }) => (
      <ListingCard
        item={item}
        selected={selectedListingId === item.id}
        onSelect={() => setSelectedListingId(item.id)}
        onOpen={() => openDetail(item)}
        desktopSplit={splitMode}
      />
    ),
    [openDetail, selectedListingId, setSelectedListingId, splitMode],
  );

  const resultLabel =
    listingMode === 'worker' ? 'Trusted pros nearby'
    : listingMode === 'group' ? 'Mixed discovery'
    : 'Open jobs nearby';

  const listHeader = (
    <View style={styles.listHeader}>
      <Text style={[styles.listEyebrow, { color: c.accent_primary }]}>Discovery</Text>
      <Text style={[typeStyles.title, { color: c.text_primary }]}>{resultLabel}</Text>
      <Text style={{ color: c.text_secondary, fontSize: 14, lineHeight: 21 }}>
        {isLoading ? 'Loading…' : isError ? 'Error' : `${listings.length} results`}
      </Text>
    </View>
  );

  const listContent = isLoading ? (
    <LoadingState />
  ) : isError ? (
    <ErrorState onRetry={refetch} />
  ) : listings.length === 0 ? (
    <EmptyState kind={listingMode} />
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

  // ─── Search overlay ─────────────────────────────────────────────────────────
  const searchOverlay = (
    <GlassCard style={styles.searchOverlay}>
      <Pressable
        onPress={() => router.push('/search_screen')}
        style={styles.searchMainAction}
        accessibilityRole="button"
      >
        <View style={[styles.searchIcon, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }]}>
          <Ionicons name="search" size={18} color={c.text_secondary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: c.text_primary, fontSize: 15, fontWeight: '600' }}>Freelancers or jobs</Text>
          <Text style={{ color: c.text_secondary, fontSize: 12, marginTop: 2 }}>Where? Flexible dates</Text>
        </View>
      </Pressable>
      <View style={styles.searchActionGroup}>
        <GlassCard pressable onPress={() => router.push('/discovery_filter')} style={styles.smallIconButton}>
          <Ionicons name="options-outline" size={18} color={c.text_primary} />
        </GlassCard>
        {!isWeb && (
          <GlassCard pressable onPress={() => router.push('/options_menu')} style={styles.smallIconButton}>
            <Ionicons name="menu" size={18} color={c.text_primary} />
          </GlassCard>
        )}
      </View>
    </GlassCard>
  );

  // ─── Background gradient style (web only) ───────────────────────────────────
  const bgStyle = isWeb ? {
    style: {
      backgroundColor: isDark ? '#090B11' : '#EEF0F5',
      // @ts-ignore – CSS gradient string for web
      ...(isWeb ? { background: isDark ? BG_GRADIENT_DARK : BG_GRADIENT_LIGHT } : {}),
    }
  } : {};

  return (
    <View style={[styles.root, bgStyle.style as object]}>
      {isWeb && <WebTopNav />}

      {/* Hero */}
      <View style={[styles.heroWrap, { paddingTop: isWeb ? space.sm : insets.top + space.sm }]}>
        <GlassCard style={[styles.heroPanel, { paddingHorizontal: space.lg }] as object as ViewStyle}>
          <View style={styles.heroCopy}>
            <Text style={[styles.eyebrow, { color: c.accent_primary }]}>Curated near you</Text>
            <Text style={[styles.heroTitle, { color: c.text_primary }]}>
              Find trusted work.{'\n'}Discover nearby pros.
            </Text>
          </View>
          <View style={styles.filterStrip}>
            <FilterChip label="Map" active={viewMode === 'map_only'} onPress={() => setViewMode('map_only')} />
            <FilterChip label="Split" active={viewMode === 'split'} onPress={() => setViewMode('split')} />
            <FilterChip label="List" active={viewMode === 'list_only'} onPress={() => setViewMode('list_only')} />
            <View style={{ width: space.sm }} />
            <FilterChip label="Workers" active={listingMode === 'worker'} onPress={() => setListingMode('worker')} />
            <FilterChip label="Jobs" active={listingMode === 'job'} onPress={() => setListingMode('job')} />
            <FilterChip label="All" active={listingMode === 'group'} onPress={() => setListingMode('group')} />
            <Pressable style={styles.inlineLink} onPress={() => router.push('/map_view')}>
              <Ionicons name="expand" size={16} color={c.accent_primary} />
            </Pressable>
          </View>
        </GlassCard>
      </View>

      {/* Search overlay */}
      <View style={[styles.searchOverlayWrap, splitMode && styles.searchOverlaySplit]}>
        {searchOverlay}
      </View>

      {/* Split / Map / List area */}
      <View style={styles.splitContainer}>
        {splitMode ? (
          <View style={[styles.splitGrid, { gap: space.md }]}>
            {/* Map */}
            <GlassCard style={styles.mapRegion}>
              <MapSurface listings={listings} compact style={styles.mapFill} />
            </GlassCard>
            {/* List */}
            <GlassCard style={styles.listRegion}>
              {listContent}
            </GlassCard>
          </View>
        ) : showMap ? (
          <GlassCard style={styles.mapRegion}>
            <MapSurface listings={listings} style={styles.mapFill} />
          </GlassCard>
        ) : (
          <GlassCard style={styles.listRegion}>
            {listContent}
          </GlassCard>
        )}
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1 },

  // Hero
  heroWrap: { paddingHorizontal: space.md },
  heroPanel: { paddingVertical: space.lg, gap: space.lg },
  heroCopy: { gap: space.xs },
  eyebrow: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0 },
  heroTitle: { fontSize: 28, lineHeight: 34, fontWeight: '800', letterSpacing: 0 },

  // Filter strip
  filterStrip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
    alignItems: 'center',
  },

  // Chips
  chip: { borderRadius: radius.chip },
  chipText: { fontSize: 13, fontWeight: '600' },

  // Search overlay
  searchOverlayWrap: { marginTop: -24, marginBottom: -14, zIndex: 10, paddingHorizontal: space.md },
  searchOverlaySplit: { marginTop: 0, marginBottom: 0 },
  searchOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  searchMainAction: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: space.md },
  searchIcon: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  searchActionGroup: { flexDirection: 'row', gap: space.sm, alignItems: 'center' },
  smallIconButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },

  // Content container
  splitContainer: {
    flex: 1,
    paddingHorizontal: space.md,
    paddingBottom: space.md,
    gap: space.md,
    marginTop: space.xs,
  },
  splitGrid: { flex: 1, minHeight: 0 },
  mapRegion: { flex: 3, minHeight: 240, overflow: 'hidden' },
  mapFill: { flex: 1, minHeight: 220 },
  listRegion: { flex: 7, overflow: 'hidden' },

  // List header
  listHeader: { gap: 6, paddingBottom: space.lg },
  listEyebrow: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0 },

  // Cards
  card: { flexDirection: 'row', alignItems: 'flex-start', gap: space.sm },
  cardMainAction: { flex: 1, flexDirection: 'row', alignItems: 'stretch', gap: space.md },
  thumb: { width: 88, height: 104, borderRadius: radius.card - 4, justifyContent: 'flex-start', padding: space.sm },
  kindBadge: { alignSelf: 'flex-start', borderRadius: radius.chip, paddingHorizontal: 10, paddingVertical: 5 },
  kindBadgeText: { fontSize: 11, fontWeight: '700' },
  cardBody: { flex: 1, gap: 6 },
  cardMetaRow: { flexDirection: 'row', justifyContent: 'space-between', gap: space.sm },
  cardLocation: { fontSize: 12, fontWeight: '600' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' },
  saveButton: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start', marginLeft: space.xs },
  viewButton: { marginTop: space.sm, alignSelf: 'flex-start', borderRadius: radius.chip, paddingHorizontal: space.md, paddingVertical: space.sm },
  viewButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },

  // States
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: space.xl * 2 },
  retryBtn: { flexDirection: 'row', alignItems: 'center', gap: space.sm, marginTop: space.lg },
  inlineLink: { padding: space.xs },
});
