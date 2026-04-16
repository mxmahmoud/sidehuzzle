import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AmbientGlassBackground } from '@/components/AmbientGlassBackground';
import { AnchoredGlassPanel } from '@/components/AnchoredGlassPanel';
import { DiscoveryModeControls } from '@/components/DiscoveryModeControls';
import { GlassButton } from '@/components/GlassButton';
import { GlassCard } from '@/components/GlassCard';
import { GlassInputFrame } from '@/components/GlassInputFrame';
import { ListingCard } from '@/components/ListingCard';
import { MapSurface } from '@/components/MapSurface';
import { useDiscoveryListings } from '@/data/listingsQueries';
import type { DiscoveryListing } from '@/data/listingTypes';
import { useDiscoveryStore, type DiscoveryViewMode } from '@/stores/discoveryStore';
import { useThemeColors } from '@/theme/useThemeColors';
import { motion, radius, shadow, space, type as typeStyles } from '@/theme/tokens';

function LoadingList() {
  const c = useThemeColors();
  return (
    <View style={styles.stateStack}>
      {Array.from({ length: 5 }).map((_, index) => (
        <GlassCard key={index} style={styles.skeletonCard}>
          <View style={[styles.skeletonImage, { backgroundColor: c.border_subtle }]} />
          <View style={styles.skeletonLines}>
            <View style={[styles.skeletonLine, { width: '44%', backgroundColor: c.border_subtle }]} />
            <View style={[styles.skeletonLine, { width: '88%', backgroundColor: c.border_subtle }]} />
            <View style={[styles.skeletonLine, { width: '64%', backgroundColor: c.border_subtle }]} />
          </View>
        </GlassCard>
      ))}
    </View>
  );
}

function EmptyOrErrorState({ error, onRetry }: { error?: boolean; onRetry: () => void }) {
  const c = useThemeColors();
  return (
    <View style={styles.centerState}>
      <Ionicons name={error ? 'cloud-offline-outline' : 'search-outline'} size={42} color={c.text_muted} />
      <Text style={[typeStyles.subtitle, { color: c.text_primary, textAlign: 'center' }]}>
        {error ? 'Could not load the market nearby' : 'No matching work nearby'}
      </Text>
      <Text style={[typeStyles.caption, { color: c.text_secondary, textAlign: 'center', maxWidth: 320 }]}>
        {error ? 'Check that FastAPI is running and reachable from this app.' : 'Try a broader radius or reset a few filters.'}
      </Text>
      <Pressable
        onPress={onRetry}
        accessibilityRole="button"
        style={({ pressed, hovered }) => [
          styles.retryButton,
          { backgroundColor: c.accent_primary },
          pressed ? styles.pressed : undefined,
          hovered && Platform.OS === 'web' ? ({ cursor: 'pointer' } as ViewStyle) : undefined,
        ]}
      >
        <Text style={styles.retryText}>{error ? 'Retry' : 'Adjust filters'}</Text>
      </Pressable>
    </View>
  );
}

const VIEW_OPTIONS: Array<{ value: DiscoveryViewMode; icon: keyof typeof Ionicons.glyphMap; label: string }> = [
  { value: 'list_only', icon: 'list-outline', label: 'List' },
  { value: 'map_only', icon: 'map-outline', label: 'Map' },
  { value: 'split', icon: 'albums-outline', label: 'Split' },
];

const SEARCH_TRENDING = ['Deep cleaning', 'IKEA assembly', 'Dog walking', 'Moving help', 'Garden work', 'Handyman', 'Painting', 'Plumbing'];
const SEARCH_RECENT = ['Cleaner near Vienna', 'Handyman in Neubau'];
const CATEGORIES = ['All', 'Cleaning', 'Assembly', 'Moving', 'Garden', 'Handyman', 'Pet care', 'Painting', 'Plumbing', 'Electrical'];
const SORT_OPTIONS = ['Relevance', 'Price: low to high', 'Price: high to low', 'Rating', 'Distance'];
const DISTANCES = ['1 km', '5 km', '10 km', '25 km', '50 km'];
const RATINGS = ['Any', '3+', '4+', '4.5+'];
const PRICE_PRESETS: Array<{ label: string; value: [number, number] }> = [
  { label: '€0 - €50', value: [0, 50] },
  { label: '€50 - €100', value: [50, 100] },
  { label: '€100+', value: [100, 200] },
];

function MapViewSwitcher({
  viewMode,
  onChange,
}: {
  viewMode: DiscoveryViewMode;
  onChange: (mode: DiscoveryViewMode) => void;
}) {
  const c = useThemeColors();

  return (
    <GlassCard variant="chrome" style={styles.viewSwitcher}>
      {VIEW_OPTIONS.map((option) => {
        const active = option.value === viewMode;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`Switch to ${option.label} view`}
            style={({ pressed, hovered }) => [
              styles.viewSwitchButton,
              active ? { backgroundColor: c.surface_selected } : undefined,
              pressed ? styles.pressed : undefined,
              hovered && Platform.OS === 'web' ? styles.viewSwitchHover : undefined,
              hovered && Platform.OS === 'web' ? ({ cursor: 'pointer' } as ViewStyle) : undefined,
            ]}
          >
            <Ionicons name={option.icon} size={17} color={active ? c.accent_primary : c.text_secondary} />
            {active ? <Text style={[styles.viewSwitchLabel, { color: c.text_primary }]}>{option.label}</Text> : null}
          </Pressable>
        );
      })}
    </GlassCard>
  );
}

export function DiscoveryScreen() {
  const c = useThemeColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 1024;
  const [savedIds, setSavedIds] = useState<Set<string>>(() => new Set());
  const [searchActive, setSearchActive] = useState(false);
  const [activePanel, setActivePanel] = useState<'search' | 'filter' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
  const setCategory = useDiscoveryStore((s) => s.setCategory);
  const setSortBy = useDiscoveryStore((s) => s.setSortBy);
  const setPriceRange = useDiscoveryStore((s) => s.setPriceRange);
  const setDistance = useDiscoveryStore((s) => s.setDistance);
  const setRating = useDiscoveryStore((s) => s.setRating);
  const resetFilters = useDiscoveryStore((s) => s.resetFilters);

  const filters = useMemo(
    () => ({ category, sortBy, priceRange, distance, rating }),
    [category, distance, priceRange, rating, sortBy],
  );

  const { data: listings = [], isLoading, isError, refetch } = useDiscoveryListings(listingMode, filters);

  const selectedListing = useMemo(
    () => listings.find((item) => item.id === selectedListingId) ?? null,
    [listings, selectedListingId],
  );

  const searchSuggestions = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();
    if (normalized.length > 1) {
      return SEARCH_TRENDING.filter((item) => item.toLowerCase().includes(normalized));
    }
    return SEARCH_TRENDING;
  }, [searchQuery]);

  const closePanel = useCallback(() => {
    setActivePanel(null);
  }, []);

  const submitSearch = useCallback(
    (value: string) => {
      const next = value.trim();
      if (!next) return;
      setActivePanel(null);
      router.push({ pathname: '/search_results', params: { q: next } });
    },
    [router],
  );

  const openDetail = useCallback(
    (item: DiscoveryListing) => {
      const pathname = item.kind === 'worker' ? '/worker_description' : '/job_description';
      router.push({ pathname, params: { id: item.id } });
    },
    [router],
  );

  const openSearch = useCallback(() => {
    if (isDesktop) {
      setActivePanel('search');
      return;
    }
    router.push('/search_screen');
  }, [isDesktop, router]);

  const openFilters = useCallback(() => {
    if (isDesktop) {
      setActivePanel((current) => (current === 'filter' ? null : 'filter'));
      return;
    }
    router.push('/discovery_filter');
  }, [isDesktop, router]);

  const handleListingModeChange = useCallback(
    (mode: Parameters<typeof setListingMode>[0]) => {
      setListingMode(mode);
      setSelectedListingId(null);
    },
    [setListingMode, setSelectedListingId],
  );

  const handleViewModeChange = useCallback(
    (mode: Parameters<typeof setViewMode>[0]) => {
      setViewMode(mode);
    },
    [setViewMode],
  );

  const handleCardPress = useCallback(
    (item: DiscoveryListing) => {
      if (!isDesktop || selectedListingId === item.id || viewMode === 'list_only') {
        openDetail(item);
        return;
      }
      setSelectedListingId(item.id);
    },
    [isDesktop, openDetail, selectedListingId, setSelectedListingId, viewMode],
  );

  const toggleSave = useCallback((item: DiscoveryListing) => {
    setSavedIds((current) => {
      const next = new Set(current);
      if (next.has(item.id)) next.delete(item.id);
      else next.add(item.id);
      return next;
    });
  }, []);

  const showMap = true;
  const showList = viewMode !== 'map_only';
  const topInset = Platform.OS === 'web' && isDesktop ? space.lg : insets.top + space.sm;
  const tabInset = Platform.OS === 'web' && isDesktop ? space.lg : insets.bottom + 86;
  const mapHeight =
    viewMode === 'list_only'
      ? Math.max(146, Math.min(190, Math.round(height * 0.19)))
      : Math.max(220, Math.min(360, Math.round(height * 0.36)));

  const heading =
    listingMode === 'worker' ? 'Pros near Vienna'
    : listingMode === 'job' ? 'Jobs near Vienna'
    : 'Jobs & pros near Vienna';

  const renderListing = useCallback(
    ({ item }: { item: DiscoveryListing }) => (
      <ListingCard
        item={item}
        selected={selectedListingId === item.id}
        onPreview={() => setSelectedListingId(item.id)}
        onPress={() => handleCardPress(item)}
        onSave={() => toggleSave(item)}
      />
    ),
    [handleCardPress, selectedListingId, setSelectedListingId, toggleSave],
  );

  const renderChipGroup = useCallback(
    (items: string[], value: string, onChange: (next: string) => void) => (
      <View style={styles.popoverChipRow}>
        {items.map((item) => (
          <GlassButton
            key={item}
            label={item}
            variant="chip"
            selected={value === item}
            onPress={() => onChange(item)}
          />
        ))}
      </View>
    ),
    [],
  );

  return (
    <View style={[styles.root, { backgroundColor: c.background_alt }]}>
      <AmbientGlassBackground />
      <View style={[styles.canvas, isDesktop && styles.canvasDesktop, { paddingTop: topInset, paddingBottom: tabInset }]}>
        {activePanel ? (
          <Pressable
            onPress={closePanel}
            accessibilityRole="button"
            accessibilityLabel="Close search or filter panel"
            style={styles.popoverScrim}
          />
        ) : null}

        {!isDesktop ? (
          <View style={styles.topBar}>
            <Text style={[styles.brand, { color: c.text_primary }]}>Sidehuzle</Text>
            <Pressable
              onPress={() => router.push('/options_menu')}
              accessibilityRole="button"
              accessibilityLabel="Open menu"
              style={({ pressed }) => [styles.menuButton, { borderColor: c.border_subtle, backgroundColor: c.surface_primary }, pressed ? styles.pressed : undefined]}
            >
              <Ionicons name="menu" size={22} color={c.text_primary} />
            </Pressable>
          </View>
        ) : null}
        {!isDesktop ? (
          <Text style={[styles.compactHeadline, { color: c.text_primary }]} numberOfLines={2}>
            {heading}
          </Text>
        ) : null}

        <View style={styles.searchStack}>
          <GlassCard
            variant="chrome"
            style={[
              styles.searchPanel,
              Platform.OS === 'web' && (searchActive || activePanel === 'search' || activePanel === 'filter') ? styles.searchPanelActive : undefined,
            ]}
          >
            <Pressable
              onPress={openSearch}
              onHoverIn={() => setSearchActive(true)}
              onHoverOut={() => setSearchActive(false)}
              onFocus={openSearch}
              accessibilityRole="search"
              accessibilityHint={isDesktop ? 'Opens search suggestions below this bar' : 'Opens the full search experience'}
              style={({ pressed, hovered }) => [
                styles.searchAction,
                Platform.OS === 'web' ? styles.searchActionMotion : undefined,
                hovered && Platform.OS === 'web' ? styles.searchActionHover : undefined,
                pressed ? styles.pressed : undefined,
                hovered && Platform.OS === 'web' ? ({ cursor: 'pointer' } as ViewStyle) : undefined,
              ]}
            >
              <View style={[styles.searchIcon, { backgroundColor: c.surface_selected }]}>
                <Ionicons name="search" size={18} color={c.accent_primary} />
              </View>
              <View style={styles.searchCopy}>
                <Text style={[styles.searchTitle, { color: c.text_primary }]} numberOfLines={1}>
                  Search tasks, skills, places
                </Text>
              </View>
            </Pressable>
            <GlassButton
              icon="options-outline"
              variant="icon"
              selected={activePanel === 'filter'}
              onPress={openFilters}
              accessibilityLabel={isDesktop ? 'Open filters below this bar' : 'Open filters'}
            />
          </GlassCard>

          <AnchoredGlassPanel open={activePanel === 'search'} onClose={closePanel} style={styles.searchPopover}>
            <View style={styles.popoverHeader}>
              <View>
                <Text style={[typeStyles.subtitle, { color: c.text_primary }]}>Search nearby</Text>
                <Text style={[typeStyles.caption, { color: c.text_secondary }]}>Pick a suggestion or type a service.</Text>
              </View>
              <GlassButton icon="close" variant="icon" onPress={closePanel} accessibilityLabel="Close search suggestions" />
            </View>
            <GlassInputFrame>
              <TextInput
                autoFocus={Platform.OS === 'web'}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={() => submitSearch(searchQuery)}
                returnKeyType="search"
                placeholder="Deep cleaning, moving, dog walking..."
                placeholderTextColor={c.text_secondary}
                style={[styles.popoverInput, { color: c.text_primary }]}
              />
            </GlassInputFrame>
            {searchQuery.length === 0 ? (
              <View style={styles.suggestionSection}>
                <Text style={[styles.popoverSectionTitle, { color: c.text_secondary }]}>Recent</Text>
                {SEARCH_RECENT.map((item) => (
                  <Pressable
                    key={item}
                    onPress={() => submitSearch(item)}
                    style={({ hovered, pressed }) => [
                      styles.suggestionRow,
                      { borderColor: c.glass_border },
                      hovered && Platform.OS === 'web' ? { backgroundColor: c.surface_overlay } : undefined,
                      pressed ? styles.pressed : undefined,
                      hovered && Platform.OS === 'web' ? ({ cursor: 'pointer' } as ViewStyle) : undefined,
                    ]}
                    accessibilityRole="button"
                  >
                    <Ionicons name="time-outline" size={16} color={c.text_secondary} />
                    <Text style={[styles.suggestionText, { color: c.text_primary }]}>{item}</Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
            <View style={styles.suggestionSection}>
              <Text style={[styles.popoverSectionTitle, { color: c.text_secondary }]}>
                {searchQuery.length > 1 ? 'Matches' : 'Trending'}
              </Text>
              {searchSuggestions.length > 0 ? (
                searchSuggestions.map((item) => (
                  <Pressable
                    key={item}
                    onPress={() => submitSearch(item)}
                    style={({ hovered, pressed }) => [
                      styles.suggestionRow,
                      { borderColor: c.glass_border },
                      hovered && Platform.OS === 'web' ? { backgroundColor: c.surface_overlay } : undefined,
                      pressed ? styles.pressed : undefined,
                      hovered && Platform.OS === 'web' ? ({ cursor: 'pointer' } as ViewStyle) : undefined,
                    ]}
                    accessibilityRole="button"
                  >
                    <Ionicons name="search-outline" size={16} color={c.accent_primary} />
                    <Text style={[styles.suggestionText, { color: c.text_primary }]}>{item}</Text>
                    <Ionicons name="arrow-forward" size={14} color={c.text_secondary} style={{ marginLeft: 'auto' }} />
                  </Pressable>
                ))
              ) : (
                <Text style={[typeStyles.caption, { color: c.text_secondary }]}>No suggestions yet.</Text>
              )}
            </View>
          </AnchoredGlassPanel>

          <AnchoredGlassPanel open={activePanel === 'filter'} onClose={closePanel} style={styles.filterPopover}>
            <View style={styles.popoverHeader}>
              <View>
                <Text style={[typeStyles.subtitle, { color: c.text_primary }]}>Filters</Text>
                <Text style={[typeStyles.caption, { color: c.text_secondary }]}>Tune the market without leaving discovery.</Text>
              </View>
              <GlassButton icon="close" variant="icon" onPress={closePanel} accessibilityLabel="Close filters" />
            </View>
            <View style={styles.filterGrid}>
              <View style={styles.filterSection}>
                <Text style={[styles.popoverSectionTitle, { color: c.text_secondary }]}>Category</Text>
                {renderChipGroup(CATEGORIES, category, setCategory)}
              </View>
              <View style={styles.filterSection}>
                <Text style={[styles.popoverSectionTitle, { color: c.text_secondary }]}>Sort by</Text>
                {renderChipGroup(SORT_OPTIONS, sortBy, setSortBy)}
              </View>
              <View style={styles.filterSection}>
                <Text style={[styles.popoverSectionTitle, { color: c.text_secondary }]}>Budget</Text>
                <View style={styles.popoverChipRow}>
                  {PRICE_PRESETS.map((preset) => (
                    <GlassButton
                      key={preset.label}
                      label={preset.label}
                      variant="chip"
                      selected={priceRange[0] === preset.value[0] && priceRange[1] === preset.value[1]}
                      onPress={() => setPriceRange(preset.value)}
                    />
                  ))}
                </View>
              </View>
              <View style={styles.filterSection}>
                <Text style={[styles.popoverSectionTitle, { color: c.text_secondary }]}>Distance</Text>
                {renderChipGroup(DISTANCES, distance, setDistance)}
              </View>
              <View style={styles.filterSection}>
                <Text style={[styles.popoverSectionTitle, { color: c.text_secondary }]}>Rating</Text>
                {renderChipGroup(RATINGS, rating, setRating)}
              </View>
            </View>
            <View style={styles.popoverFooter}>
              <GlassButton label="Reset" icon="refresh-outline" onPress={resetFilters} />
              <GlassButton label="Apply filters" icon="checkmark" variant="primary" onPress={closePanel} />
            </View>
          </AnchoredGlassPanel>
        </View>

        <DiscoveryModeControls
          listingMode={listingMode}
          onListingModeChange={handleListingModeChange}
        />

        {showMap ? (
          <View
            style={[
              styles.mapPanel,
              {
                height: viewMode === 'map_only' ? undefined : mapHeight,
                minHeight: viewMode === 'list_only' ? 146 : 220,
                flex: viewMode === 'map_only' ? 1 : undefined,
                borderColor: c.glass_border,
                borderTopColor: c.glass_border_top,
                backgroundColor: c.glass_surface,
              },
            ]}
          >
            <MapSurface listings={listings} compact={viewMode !== 'map_only'} style={styles.mapFill} />
            <View style={styles.mapOverlay}>
              <MapViewSwitcher viewMode={viewMode} onChange={handleViewModeChange} />
            </View>
            <Pressable
              onPress={() => router.push('/map_view')}
              accessibilityRole="button"
              accessibilityLabel="Open full map"
              style={({ pressed, hovered }) => [
                styles.mapExpand,
                { backgroundColor: c.surface_overlay, borderColor: c.glass_border },
                Platform.OS === 'web' ? styles.controlMotion : undefined,
                hovered && Platform.OS === 'web' ? styles.controlHover : undefined,
                pressed ? styles.pressed : undefined,
                hovered && Platform.OS === 'web' ? ({ cursor: 'pointer' } as ViewStyle) : undefined,
              ]}
            >
              <Ionicons name="expand-outline" size={18} color={c.text_primary} />
            </Pressable>
          </View>
        ) : null}

        {showList ? (
          <View style={[styles.sheet, { backgroundColor: c.glass_sheet, borderColor: c.glass_border, borderTopColor: c.glass_border_top }]}>
            <View style={styles.sheetHandleWrap}>
              <View style={[styles.sheetHandle, { backgroundColor: c.border_strong }]} />
            </View>
            <View style={styles.listHeader}>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={[typeStyles.subtitle, { color: c.text_primary }]}>{heading}</Text>
                <Text style={[typeStyles.caption, { color: c.text_secondary }]}>
                  {isLoading ? 'Finding matches' : isError ? 'Backend unavailable' : `${listings.length} matches · ${filters.sortBy}`}
                </Text>
              </View>
              {selectedListing ? (
                <Pressable
                  onPress={() => openDetail(selectedListing)}
                  accessibilityRole="button"
                  style={({ pressed }) => [styles.openSelected, { backgroundColor: c.accent_primary }, pressed ? styles.pressed : undefined]}
                >
                  <Text style={styles.openSelectedText}>Open</Text>
                </Pressable>
              ) : null}
            </View>

            {isLoading ? (
              <LoadingList />
            ) : isError ? (
              <EmptyOrErrorState error onRetry={refetch} />
            ) : listings.length === 0 ? (
              <EmptyOrErrorState onRetry={() => router.push('/discovery_filter')} />
            ) : (
              <FlashList
                data={listings}
                renderItem={renderListing}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => <View style={{ height: space.md }} />}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                extraData={`${selectedListingId}-${savedIds.size}`}
              />
            )}
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  canvas: {
    flex: 1,
    paddingHorizontal: space.md,
    gap: space.sm,
    position: 'relative',
    zIndex: 1,
  },
  canvasDesktop: {
    width: '100%',
    maxWidth: 1180,
    alignSelf: 'center',
    paddingHorizontal: space.xl,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
  },
  brand: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '900',
  },
  compactHeadline: {
    fontSize: 24,
    lineHeight: 29,
    fontWeight: '800',
  },
  popoverScrim: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: radius.button,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        transitionDuration: `${motion.fastMs}ms`,
        transitionProperty: 'opacity, transform, background-color, border-color',
        transitionTimingFunction: motion.easeOut,
      } as ViewStyle,
      default: {},
    }),
  },
  searchPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    padding: 4,
  },
  searchStack: {
    position: 'relative',
    zIndex: 40,
  },
  searchPanelActive: {
    transform: [{ translateY: -3 }],
    // @ts-ignore web-only
    boxShadow: shadow.hover.boxShadow,
  },
  searchAction: {
    flex: 1,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    borderRadius: radius.input,
    paddingHorizontal: space.xs,
  },
  searchActionMotion: {
    transitionDuration: `${motion.standardMs}ms`,
    transitionProperty: 'background-color, opacity, transform',
    transitionTimingFunction: motion.easeInOut,
  } as ViewStyle,
  searchActionHover: {
    transform: [{ scale: 1.006 }],
  },
  searchIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchCopy: {
    flex: 1,
    minWidth: 0,
  },
  searchTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: radius.button,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        transitionDuration: `${motion.fastMs}ms`,
        transitionProperty: 'opacity, transform, background-color, border-color',
        transitionTimingFunction: motion.easeOut,
      } as ViewStyle,
      default: {},
    }),
  },
  searchPopover: {
    gap: space.md,
  },
  filterPopover: {
    gap: space.md,
    maxHeight: 560,
  },
  popoverHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: space.md,
  },
  popoverInput: {
    minHeight: 48,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    fontSize: 16,
    lineHeight: 22,
  },
  suggestionSection: {
    gap: space.sm,
  },
  popoverSectionTitle: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0,
  },
  suggestionRow: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: radius.button,
    paddingHorizontal: space.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    ...Platform.select({
      web: {
        transitionDuration: `${motion.fastMs}ms`,
        transitionProperty: 'background-color, opacity, transform',
        transitionTimingFunction: motion.easeOut,
      } as ViewStyle,
      default: {},
    }),
  },
  suggestionText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  filterGrid: {
    gap: space.md,
  },
  filterSection: {
    gap: space.sm,
  },
  popoverChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
  },
  popoverFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: space.sm,
    paddingTop: space.sm,
  },
  mapPanel: {
    overflow: 'hidden',
    borderRadius: radius.sheet,
    borderWidth: 1,
    position: 'relative',
  },
  mapFill: {
    flex: 1,
    minHeight: 220,
  },
  mapOverlay: {
    position: 'absolute',
    bottom: space.sm,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'box-none',
  },
  viewSwitcher: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    padding: 3,
  },
  viewSwitchButton: {
    minWidth: 36,
    minHeight: 32,
    borderRadius: radius.button,
    paddingHorizontal: space.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    ...Platform.select({
      web: {
        transitionDuration: `${motion.fastMs}ms`,
        transitionProperty: 'background-color, opacity, transform',
        transitionTimingFunction: motion.easeOut,
      } as ViewStyle,
      default: {},
    }),
  },
  viewSwitchHover: {
    transform: [{ translateY: -1 }],
  },
  viewSwitchLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
  },
  mapExpand: {
    position: 'absolute',
    top: space.sm,
    right: space.sm,
    width: 38,
    height: 38,
    borderRadius: radius.button,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlMotion: {
    transitionDuration: `${motion.fastMs}ms`,
    transitionProperty: 'opacity, transform, background-color, border-color',
    transitionTimingFunction: motion.easeOut,
  } as ViewStyle,
  controlHover: {
    transform: [{ translateY: -1 }],
  },
  sheet: {
    flex: 1,
    minHeight: 280,
    borderWidth: 1,
    borderRadius: radius.sheet,
    overflow: 'hidden',
    paddingTop: space.sm,
    // @ts-ignore web-only glass
    WebkitBackdropFilter: 'blur(34px)',
    backdropFilter: 'blur(34px)',
  },
  sheetHandleWrap: {
    alignItems: 'center',
    paddingBottom: space.xs,
  },
  sheetHandle: {
    width: 52,
    height: 4,
    borderRadius: 999,
    opacity: 0.55,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: space.md,
    paddingBottom: space.md,
  },
  openSelected: {
    minHeight: 44,
    borderRadius: radius.button,
    paddingHorizontal: space.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  openSelectedText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  listContent: {
    paddingHorizontal: space.md,
    paddingBottom: space.xl,
  },
  stateStack: {
    paddingHorizontal: space.md,
    gap: space.md,
  },
  skeletonCard: {
    flexDirection: 'row',
    gap: space.md,
    minHeight: 128,
  },
  skeletonImage: {
    width: 112,
    borderRadius: radius.card,
  },
  skeletonLines: {
    flex: 1,
    gap: space.sm,
    justifyContent: 'center',
  },
  skeletonLine: {
    height: 14,
    borderRadius: radius.chip,
  },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.md,
    padding: space.xl,
  },
  retryButton: {
    minHeight: 44,
    borderRadius: radius.button,
    paddingHorizontal: space.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.82,
  },
});
