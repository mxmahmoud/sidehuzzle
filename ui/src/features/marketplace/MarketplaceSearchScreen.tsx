import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { BottomActionBar } from '@/components/side/BottomActionBar';
import { Button } from '@/components/side/Button';
import { GlassSurface } from '@/components/side/GlassSurface';
import { ScreenShell } from '@/components/side/ScreenShell';
import { useThemeColors } from '@/theme/useThemeColors';
import { type as typeStyles } from '@/theme/tokens';

const TRENDING = ['Deep cleaning', 'IKEA assembly', 'Dog walking', 'Moving help', 'Garden work', 'Handyman', 'Painting', 'Plumbing'];
const RECENT = ['Cleaner near Vienna', 'Handyman in Neubau'];

export function MarketplaceSearchScreen() {
  const c = useThemeColors();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const suggestions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (normalized.length > 1) return TRENDING.filter((item) => item.toLowerCase().includes(normalized));
    return TRENDING;
  }, [query]);

  const goToResults = useCallback(
    (value: string) => {
      const next = value.trim();
      if (next) router.push({ pathname: '/search_results', params: { q: next } });
    },
    [router],
  );

  return (
    <View className="flex-1" style={{ backgroundColor: c.background_alt }} testID="marketplace-search">
      <Stack.Screen options={{ headerShown: false }} />
      <ScreenShell scroll keyboard maxWidth="md" contentClassName="gap-side-lg" withBackground>
        <GlassSurface variant="chrome" className="flex-row items-center gap-side-sm p-side-sm">
          <Button icon="arrow-back" variant="icon" accessibilityLabel="Back" onPress={() => router.back()} />
          <View className="min-h-11 flex-1 flex-row items-center gap-side-sm rounded-[8px] px-side-sm" style={{ backgroundColor: c.glass_input }}>
            <Ionicons name="search" size={18} color={c.text_secondary} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={() => goToResults(query)}
              autoFocus
              returnKeyType="search"
              placeholder="Search freelancers or jobs..."
              placeholderTextColor={c.text_secondary}
              className="min-h-11 flex-1 text-[15px] font-semibold leading-[21px]"
              style={{ color: c.text_primary }}
              accessibilityLabel="Search freelancers or jobs"
            />
            {query.length > 0 ? (
              <Pressable onPress={() => setQuery('')} accessibilityRole="button" accessibilityLabel="Clear search">
                <Ionicons name="close-circle" size={18} color={c.text_secondary} />
              </Pressable>
            ) : null}
          </View>
          <Button icon="options-outline" variant="icon" accessibilityLabel="Open filters" onPress={() => router.push('/discovery_filter')} />
        </GlassSurface>

        {query.length === 0 ? (
          <GlassSurface variant="surface" className="gap-side-sm p-side-lg">
            <Text style={[typeStyles.subtitle, { color: c.text_primary }]}>Recent</Text>
            {RECENT.map((item) => (
              <Pressable key={item} onPress={() => goToResults(item)} className="flex-row items-center gap-side-sm py-side-sm" accessibilityRole="button">
                <Ionicons name="time-outline" size={16} color={c.text_secondary} />
                <Text className="text-[15px] font-semibold leading-5" style={{ color: c.text_primary }}>
                  {item}
                </Text>
              </Pressable>
            ))}
          </GlassSurface>
        ) : null}

        <GlassSurface variant="surface" className="overflow-hidden p-side-lg">
          <Text style={[typeStyles.subtitle, { color: c.text_primary }]}>{query.length > 1 ? 'Matches' : 'Trending'}</Text>
          {query.length > 1 && suggestions.length === 0 ? (
            <Text className="py-side-xl text-center text-[15px] leading-[22px]" style={{ color: c.text_secondary }}>
              No suggestions for "{query}"
            </Text>
          ) : (
            <FlatList
              data={suggestions}
              keyExtractor={(item) => item}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <Pressable onPress={() => goToResults(item)} className="flex-row items-center gap-side-sm border-b py-side-md" style={{ borderBottomColor: c.border_subtle }} accessibilityRole="button">
                  <Ionicons name="trending-up" size={16} color={c.accent_primary} />
                  <Text className="flex-1 text-[15px] font-semibold leading-5" style={{ color: c.text_primary }}>
                    {item}
                  </Text>
                  <Ionicons name="arrow-forward" size={14} color={c.text_secondary} />
                </Pressable>
              )}
            />
          )}
        </GlassSurface>
      </ScreenShell>

      <BottomActionBar>
        <Button label="View map" icon="map" variant="primary" onPress={() => router.push('/map_view')} />
      </BottomActionBar>
    </View>
  );
}
