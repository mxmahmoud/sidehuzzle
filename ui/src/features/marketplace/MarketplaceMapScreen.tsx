import { useFocusEffect } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { Platform, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/side/Button';
import { GlassBackdrop } from '@/components/side/GlassBackdrop';
import { GlassSurface } from '@/components/side/GlassSurface';
import { MapSurface } from '@/components/MapSurface';
import { useDiscoveryListings } from '@/data/listingsQueries';
import { DiscoveryFilterPanel, SearchSuggestionsPanel } from '@/features/marketplace/DiscoveryOverlayPanels';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { useThemeColors } from '@/theme/useThemeColors';

export function MarketplaceMapScreen() {
  const c = useThemeColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [appliedQuery, setAppliedQuery] = useState('');
  const [searchInputKey, setSearchInputKey] = useState(0);
  const [activePanel, setActivePanel] = useState<'search' | 'filter' | null>(null);
  const listingMode = useDiscoveryStore((s) => s.listingMode);
  const category = useDiscoveryStore((s) => s.category);
  const sortBy = useDiscoveryStore((s) => s.sortBy);
  const priceRange = useDiscoveryStore((s) => s.priceRange);
  const distance = useDiscoveryStore((s) => s.distance);
  const rating = useDiscoveryStore((s) => s.rating);
  const filters = useMemo(() => ({ category, sortBy, priceRange, distance, rating, query: appliedQuery }), [appliedQuery, category, distance, priceRange, rating, sortBy]);
  const { data: listings = [] } = useDiscoveryListings(listingMode, filters);

  useFocusEffect(
    useCallback(() => {
      return () => setActivePanel(null);
    }, []),
  );

  useEffect(() => {
    if (Platform.OS !== 'web' || !activePanel || typeof document === 'undefined') return;

    const closeOnOutsidePointerDown = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      if (target.closest('[data-testid="map-search-chrome"], [data-testid="map-search-suggestions-overlay"], [data-testid="map-filter-overlay"]')) {
        return;
      }
      setActivePanel(null);
    };

    document.addEventListener('pointerdown', closeOnOutsidePointerDown);
    return () => document.removeEventListener('pointerdown', closeOnOutsidePointerDown);
  }, [activePanel]);

  const submitSearch = useCallback(() => {
    const next = searchQuery.trim();
    setAppliedQuery(next);
    if (next) router.push({ pathname: '/search_results', params: { q: next } });
    setActivePanel(null);
  }, [router, searchQuery]);

  const selectSearchSuggestion = useCallback((value: string) => {
    setSearchQuery(value);
    setAppliedQuery(value);
    setSearchInputKey((current) => current + 1);
    setActivePanel(null);
  }, []);

  return (
    <View className="flex-1" style={{ backgroundColor: c.background_alt }} testID="marketplace-map">
      <Stack.Screen options={{ title: 'Map', headerShown: false }} />
      <MapSurface listings={listings} style={{ flex: 1 }} />

      {activePanel ? <GlassBackdrop blur={false} testID="map-panel-backdrop" className="z-[2]" onPress={() => setActivePanel(null)} /> : null}

      <View className="absolute left-0 right-0 top-0 z-[4] gap-side-sm px-side-md" style={{ paddingTop: insets.top + 8 }}>
        <GlassSurface variant="chrome" className="flex-row items-center gap-side-sm p-side-sm" testID="map-search-chrome">
          <Button icon="arrow-back" variant="icon" accessibilityLabel="Back" onPress={() => router.back()} />
          <View className="min-w-0 flex-1 justify-center">
            <TextInput
              key={searchInputKey}
              defaultValue={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setActivePanel('search')}
              onSubmitEditing={submitSearch}
              returnKeyType="search"
              placeholder="Search this map"
              placeholderTextColor={c.text_secondary}
              className="min-h-7 text-[15px] font-bold leading-5"
              style={{ color: c.text_primary }}
              accessibilityLabel="Search the map"
            />
          </View>
          <Button
            icon="options-outline"
            variant="icon"
            selected={activePanel === 'filter'}
            accessibilityLabel="Open filters"
            onPress={() => setActivePanel((current) => (current === 'filter' ? null : 'filter'))}
          />
          <Button icon="search" variant="primary" accessibilityLabel="Search" onPress={submitSearch} />
        </GlassSurface>

        {activePanel === 'search' ? (
          <View testID="map-search-suggestions-overlay">
            <SearchSuggestionsPanel query={deferredSearchQuery} onSelect={selectSearchSuggestion} onClose={() => setActivePanel(null)} />
          </View>
        ) : null}

        {activePanel === 'filter' ? (
          <View testID="map-filter-overlay">
            <DiscoveryFilterPanel onApply={() => setActivePanel(null)} onClose={() => setActivePanel(null)} />
          </View>
        ) : null}
      </View>

      <View
        className="absolute right-side-md z-[3] gap-side-sm"
        style={{ top: '50%', transform: [{ translateY: -48 }] }}
        testID="map-screen-utility-controls"
      >
        <Button icon="locate-outline" variant="icon" accessibilityLabel="Locate me" />
        <Button icon="expand-outline" variant="icon" accessibilityLabel="Fullscreen map" />
      </View>

      <View className="absolute bottom-0 left-0 right-0 z-[4] items-center px-side-md" style={{ paddingBottom: insets.bottom + 12 }} pointerEvents="box-none">
        <Button label="List" icon="list-outline" variant="secondary" onPress={() => router.push('/(tabs)/landing_page')} testID="map-screen-list-button" />
      </View>
    </View>
  );
}
