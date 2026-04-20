import { FlashList } from '@shopify/flash-list';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, TextInput, View, useWindowDimensions, type LayoutChangeEvent, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassBackdrop } from '@/components/side/GlassBackdrop';
import { GlassSurface } from '@/components/side/GlassSurface';
import { ListingCard } from '@/components/side/ListingCard';
import { Button } from '@/components/side/Button';
import { ScreenShell } from '@/components/side/ScreenShell';
import { SegmentedControl } from '@/components/side/SegmentedControl';
import { StateView } from '@/components/side/StateView';
import { Text } from '@/components/ui/text';
import { Skeleton } from '@/components/ui/skeleton';
import { MapSurface } from '@/components/MapSurface';
import { useDiscoveryListings } from '@/data/listingsQueries';
import type { DiscoveryListing } from '@/data/listingTypes';
import { DiscoveryFilterPanel, SearchSuggestionsPanel } from '@/features/marketplace/DiscoveryOverlayPanels';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { useThemeStore } from '@/stores/themeStore';
import { useIsDark, useThemeColors } from '@/theme/useThemeColors';
import { space, type as typeStyles } from '@/theme/tokens';

const MODE_OPTIONS = [
  { value: 'group', label: 'All work', icon: 'sparkles-outline' },
  { value: 'worker', label: 'Pros', icon: 'shield-checkmark-outline' },
  { value: 'job', label: 'Jobs', icon: 'briefcase-outline' },
] as const;

function ResultsState({
  loading,
  error,
  empty,
  onRetry,
  onAdjustFilters,
}: {
  loading: boolean;
  error: boolean;
  empty: boolean;
  onRetry: () => void;
  onAdjustFilters: () => void;
}) {
  if (loading) {
    return (
      <View className="gap-side-md px-side-md py-side-md" testID="discovery-loading">
        {Array.from({ length: 4 }).map((_, index) => (
          <GlassSurface key={index} className="min-h-[148px] p-side-md opacity-80">
            <View className="flex-row gap-side-md">
              <Skeleton className="size-28 rounded-lg" />
              <View className="flex-1 gap-side-sm">
                <Skeleton className="h-3 w-1/3 rounded-lg" />
                <Skeleton className="h-5 w-4/5 rounded-lg" />
                <Skeleton className="h-4 w-3/5 rounded-lg" />
                <View className="mt-auto flex-row gap-side-xs">
                  <Skeleton className="h-7 w-20 rounded-lg" />
                  <Skeleton className="h-7 w-24 rounded-lg" />
                </View>
              </View>
            </View>
          </GlassSurface>
        ))}
      </View>
    );
  }

  if (error) {
    return (
      <View className="p-side-md">
        <StateView
          testID="discovery-error"
          icon="cloud-offline-outline"
          title="Could not load the market nearby"
          body="Check that FastAPI is running and reachable from this app."
          actionLabel="Retry"
          tone="warning"
          onAction={onRetry}
        />
      </View>
    );
  }

  if (empty) {
    return (
      <View className="p-side-md">
        <StateView
          testID="discovery-empty"
          icon="search-outline"
          title="No matching work nearby"
          body="Try a broader radius, reset a few filters, or search another service."
          actionLabel="Adjust filters"
          onAction={onAdjustFilters}
        />
      </View>
    );
  }

  return null;
}

export function MarketplaceHomeScreen() {
  const c = useThemeColors();
  const isDark = useIsDark();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const searchInputRef = useRef<TextInput>(null);
  const { width, height } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 1024;
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [appliedQuery, setAppliedQuery] = useState('');
  const [searchInputKey, setSearchInputKey] = useState(0);
  const [activePanel, setActivePanel] = useState<'search' | 'filter' | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(() => new Set());
  const [mobileSearchChromeY, setMobileSearchChromeY] = useState(0);
  const [searchBarHeight, setSearchBarHeight] = useState(66);
  const [mobileScrollY, setMobileScrollY] = useState(0);

  const listingMode = useDiscoveryStore((s) => s.listingMode);
  const selectedListingId = useDiscoveryStore((s) => s.selectedListingId);
  const category = useDiscoveryStore((s) => s.category);
  const sortBy = useDiscoveryStore((s) => s.sortBy);
  const priceRange = useDiscoveryStore((s) => s.priceRange);
  const distance = useDiscoveryStore((s) => s.distance);
  const rating = useDiscoveryStore((s) => s.rating);
  const setListingMode = useDiscoveryStore((s) => s.setListingMode);
  const setSelectedListingId = useDiscoveryStore((s) => s.setSelectedListingId);
  const setThemePreference = useThemeStore((s) => s.setPreference);

  const filters = useMemo(
    () => ({ category, sortBy, priceRange, distance, rating, query: appliedQuery }),
    [appliedQuery, category, distance, priceRange, rating, sortBy],
  );
  const { data: listings = [], isLoading, isError, refetch } = useDiscoveryListings(listingMode, filters);

  useEffect(() => {
    if (Platform.OS !== 'web' || !activePanel || typeof document === 'undefined') return;

    const closeOnOutsidePointerDown = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      if (target.closest('[data-testid="discovery-search"], [data-testid="search-suggestions-overlay"], [data-testid="filter-overlay"]')) {
        return;
      }
      setActivePanel(null);
    };

    document.addEventListener('pointerdown', closeOnOutsidePointerDown);
    return () => document.removeEventListener('pointerdown', closeOnOutsidePointerDown);
  }, [activePanel]);

  useFocusEffect(
    useCallback(() => {
      return () => setActivePanel(null);
    }, []),
  );

  const heading = listingMode === 'worker' ? 'Pros' : listingMode === 'job' ? 'Jobs' : 'Results';
  const showList = true;
  const showMap = true;
  const mapHeight = isDesktop ? undefined : Math.max(230, Math.min(320, Math.round(height * 0.32)));
  const overlayTop = searchBarHeight + space.sm;
  const mobileOverlayTop = Math.round(mobileSearchChromeY - mobileScrollY + overlayTop);
  const mobileMapBottomY = mobileSearchChromeY + searchBarHeight + space.md + (mapHeight ?? 260);
  const showMobileMapButton = !isDesktop && !activePanel && mobileMapBottomY > 0 && mobileScrollY > mobileMapBottomY - 84;
  const resultText = isLoading ? 'Loading' : isError ? 'Backend unavailable' : `${listings.length} results`;
  const listExtraData = useMemo(
    () => ({ savedKey: Array.from(savedIds).sort().join('|'), selectedListingId }),
    [savedIds, selectedListingId],
  );

  const closePanel = useCallback(() => setActivePanel(null), []);

  const submitSearch = useCallback(() => {
    const next = searchQuery.trim();
    setAppliedQuery(next);
    if (next) router.push({ pathname: '/search_results', params: { q: next } });
    else router.push('/search_screen');
    setActivePanel(null);
  }, [router, searchQuery]);

  const selectSearchSuggestion = useCallback((value: string) => {
    setSearchQuery(value);
    setAppliedQuery(value);
    setSearchInputKey((current) => current + 1);
    setActivePanel(null);
  }, []);

  const updateMobileScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!isDesktop) {
        const nativeEvent = event.nativeEvent as NativeScrollEvent & { target?: { scrollTop?: number } };
        setMobileScrollY(nativeEvent.contentOffset?.y ?? nativeEvent.target?.scrollTop ?? 0);
      }
    },
    [isDesktop],
  );

  const openDetail = useCallback(
    (item: DiscoveryListing) => {
      router.push({ pathname: item.kind === 'worker' ? '/worker_description' : '/job_description', params: { id: item.id } });
    },
    [router],
  );

  const toggleSave = useCallback((item: DiscoveryListing) => {
    setSavedIds((current) => {
      const next = new Set(current);
      if (next.has(item.id)) next.delete(item.id);
      else next.add(item.id);
      return next;
    });
  }, []);

  const renderListing = useCallback(
    ({ item }: { item: DiscoveryListing }) => (
      <View pointerEvents={activePanel ? 'none' : 'auto'}>
        <ListingCard
          item={item}
          selected={selectedListingId === item.id}
          saved={savedIds.has(item.id)}
          onPreview={() => setSelectedListingId(item.id)}
          onPress={() => {
            if (isDesktop && selectedListingId !== item.id) {
              setSelectedListingId(item.id);
              return;
            }
            openDetail(item);
          }}
          onSave={() => toggleSave(item)}
        />
      </View>
    ),
    [activePanel, isDesktop, openDetail, savedIds, selectedListingId, setSelectedListingId, toggleSave],
  );

  const searchChrome = (
    <View
      className="relative z-[10] w-full items-center gap-side-sm"
      style={{ zIndex: activePanel ? 90 : 2, elevation: activePanel ? 90 : 2 }}
      testID="discovery-hero"
      onLayout={(event) => {
        if (!isDesktop) setMobileSearchChromeY(event.nativeEvent.layout.y);
      }}
    >
      <View
        className="relative w-full max-w-[720px]"
        onLayout={(event: LayoutChangeEvent) => setSearchBarHeight(Math.max(58, Math.round(event.nativeEvent.layout.height)))}
      >
        <GlassSurface variant="chrome" className="min-h-[58px] flex-row items-center gap-side-sm px-side-sm py-side-xs" testID="discovery-search">
          <Ionicons name="search-outline" size={18} color={c.text_secondary} />
          <TextInput
            key={searchInputKey}
            ref={searchInputRef}
            defaultValue={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setActivePanel('search')}
            onSubmitEditing={submitSearch}
            returnKeyType="search"
            placeholder={isDesktop ? 'Search jobs, pros, or skills...' : 'Search jobs or pros'}
            placeholderTextColor={c.text_secondary}
            className="min-h-10 min-w-0 flex-1 text-[15px] font-semibold leading-[21px]"
            style={[{ color: c.text_primary }, Platform.OS === 'web' ? ({ outlineStyle: 'none' } as never) : undefined]}
            accessibilityLabel="Search tasks, skills, and places"
          />
          <View className="flex-row gap-side-xs">
            <Button
              icon="options-outline"
              variant="icon"
              selected={activePanel === 'filter'}
              accessibilityLabel="Open filters"
              onPress={() => setActivePanel((current) => (current === 'filter' ? null : 'filter'))}
              testID="discovery-filter-open"
            />
            <Button icon="search" variant="primary" accessibilityLabel="Search" onPress={submitSearch} testID="discovery-search-submit" />
          </View>
        </GlassSurface>
      </View>

      {isDesktop && activePanel === 'search' ? (
        <View className="absolute left-0 right-0 z-[80] items-center" style={{ top: overlayTop, zIndex: 80, elevation: 80 }}>
          <View className="w-full max-w-[720px]" testID="search-suggestions-overlay">
            <SearchSuggestionsPanel query={deferredSearchQuery} onSelect={selectSearchSuggestion} onClose={closePanel} />
          </View>
        </View>
      ) : null}

      {isDesktop && activePanel === 'filter' ? (
        <View className="absolute left-0 right-0 z-[80] items-center" style={{ top: overlayTop, zIndex: 80, elevation: 80 }}>
          <View className="w-full max-w-[720px]" testID="filter-overlay">
            <DiscoveryFilterPanel onApply={closePanel} onClose={closePanel} />
          </View>
        </View>
      ) : null}
    </View>
  );

  const listingModeControls = (
    <View className={`absolute left-side-md right-side-md z-[6] items-center ${isDesktop ? 'top-side-md' : 'bottom-side-md'}`} testID="map-listing-mode-controls">
      <SegmentedControl
        value={listingMode}
        options={MODE_OPTIONS as never}
        onChange={setListingMode as never}
        className="w-full max-w-[380px]"
        testID="discovery-listing-mode"
      />
    </View>
  );

  const mapUtilityControls = (
    <View
      className="absolute right-side-md z-[6] gap-side-sm"
      style={{ top: '50%', transform: [{ translateY: -48 }] }}
      testID="map-utility-controls"
    >
      <Button icon="locate-outline" variant="icon" accessibilityLabel="Locate me" />
      <Button icon="expand" variant="icon" accessibilityLabel="Fullscreen map" onPress={() => router.push('/map_view')} />
    </View>
  );

  const mapPanel = showMap ? (
    <GlassSurface
      variant="surface"
      className="relative min-w-0 flex-[1.08] p-0"
      style={{ minHeight: mapHeight ?? 0 }}
    >
      <MapSurface listings={listings} style={{ flex: 1, minHeight: mapHeight ?? 260 }} />
      {listingModeControls}
      {mapUtilityControls}
    </GlassSurface>
  ) : null;

  const resultsHeader = showList ? (
    <View className="gap-side-xs px-side-md pb-side-sm pt-side-md" testID="discovery-results-header">
      <View className="flex-row items-start justify-between gap-side-md">
        <View className="min-w-0 flex-1 gap-[2px]">
          <Text style={[typeStyles.title, { color: c.text_primary }]}>{heading}</Text>
          <Text className="text-[13px] font-semibold leading-[18px]" style={{ color: c.text_secondary }}>
            {resultText}
          </Text>
        </View>
      </View>
    </View>
  ) : null;

  const emptyState = showList ? (
    <ResultsState
      loading={isLoading}
      error={isError}
      empty={!isLoading && !isError && listings.length === 0}
      onRetry={() => void refetch()}
      onAdjustFilters={() => setActivePanel('filter')}
    />
  ) : null;

  const desktopListPanel = showList ? (
    <GlassSurface variant="surface" className="min-w-0 flex-1 p-0">
      {resultsHeader}
      {isLoading || isError || listings.length === 0 ? (
        emptyState
      ) : (
        <FlashList
          data={listings}
          renderItem={renderListing}
          keyExtractor={(item: DiscoveryListing) => item.id}
          ItemSeparatorComponent={() => <View style={{ height: space.md }} />}
          extraData={listExtraData}
          contentContainerStyle={{ padding: space.md, paddingBottom: space.xl * 2 }}
          style={{ flex: 1 }}
          maintainVisibleContentPosition={{ disabled: true }}
        />
      )}
    </GlassSurface>
  ) : null;

  const mobileHeader = (
    <View className="gap-side-md pb-side-md" style={{ paddingTop: insets.top + 8 }}>
      <View className="flex-row items-center justify-between">
        <Text className="text-[20px] font-black leading-7 tracking-[0px]" style={{ color: c.text_primary }}>
          Sidehuzle
        </Text>
        <View className="flex-row gap-side-sm">
          <Button
            icon={isDark ? 'sunny-outline' : 'moon-outline'}
            variant="icon"
            accessibilityLabel={isDark ? 'Use light mode' : 'Use dark mode'}
            onPress={() => setThemePreference(isDark ? 'light' : 'dark')}
          />
          <Button icon="menu" variant="icon" accessibilityLabel="Open menu" onPress={() => router.push('/options_menu')} />
        </View>
      </View>

      {searchChrome}

      <View className="gap-side-md" pointerEvents={activePanel ? 'none' : 'auto'}>
        {showMap ? (
          <GlassSurface variant="surface" className="relative min-h-[260px] p-0" style={{ minHeight: mapHeight ?? 260 }}>
            <MapSurface listings={listings} style={{ flex: 1, minHeight: mapHeight ?? 260 }} />
            {listingModeControls}
            {mapUtilityControls}
          </GlassSurface>
        ) : null}

        {resultsHeader}
      </View>
    </View>
  );

  const mobileData = showList && !isLoading && !isError ? listings : [];

  const mobileFloatingPanel = !isDesktop && activePanel ? (
    <View
      className="absolute left-side-sm right-side-sm z-[80]"
      style={{ top: mobileOverlayTop, bottom: insets.bottom + 96, zIndex: 80, elevation: 80 }}
      testID={activePanel === 'search' ? 'search-suggestions-overlay' : 'filter-overlay'}
    >
      {activePanel === 'search' ? (
        <SearchSuggestionsPanel query={deferredSearchQuery} onSelect={selectSearchSuggestion} onClose={closePanel} />
      ) : (
        <DiscoveryFilterPanel onApply={closePanel} onClose={closePanel} />
      )}
    </View>
  ) : null;

  return (
    <ScreenShell
      testID="marketplace-home"
      scroll={false}
      padded={false}
      maxWidth="none"
      contentClassName={isDesktop ? 'px-side-md pb-side-md' : 'px-side-sm pb-0'}
      withBackground
    >
      <View className={isDesktop ? 'relative w-full max-w-[1280px] flex-1 self-center gap-side-md pt-[72px]' : 'relative w-full flex-1 self-center'}>
        {isDesktop && activePanel ? (
          <GlassBackdrop
            blur={false}
            testID="discovery-panel-backdrop"
            className="absolute inset-0 z-[70]"
            onPress={closePanel}
          />
        ) : null}
        {!isDesktop && activePanel ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close discovery panel"
            className="absolute inset-0 z-[70]"
            style={{ zIndex: 70, elevation: 70 }}
            onPress={closePanel}
          />
        ) : null}
        {mobileFloatingPanel}

        {isDesktop ? (
          <>
            {searchChrome}
            <View
              className="min-h-0 flex-1 flex-row gap-side-md"
              style={{ zIndex: 1, minHeight: 600 }}
            >
              {mapPanel}
              {desktopListPanel}
            </View>
          </>
        ) : (
          <FlashList
            data={mobileData}
            renderItem={renderListing}
            keyExtractor={(item: DiscoveryListing) => item.id}
            ListHeaderComponent={mobileHeader}
            ListEmptyComponent={emptyState}
            ItemSeparatorComponent={() => <View style={{ height: space.md }} />}
            extraData={listExtraData}
            contentContainerStyle={{ paddingBottom: insets.bottom + 112 }}
            showsVerticalScrollIndicator={false}
            onScroll={updateMobileScroll}
            scrollEventThrottle={16}
            style={{ flex: 1 }}
            maintainVisibleContentPosition={{ disabled: true }}
          />
        )}

        {showMobileMapButton ? (
          <View className="absolute left-0 right-0 z-[60] items-center" style={{ bottom: insets.bottom + 92 }} pointerEvents="box-none">
            <Button label="Map" icon="map-outline" variant="secondary" onPress={() => router.push('/map_view')} testID="mobile-floating-map" />
          </View>
        ) : null}
      </View>
    </ScreenShell>
  );
}
