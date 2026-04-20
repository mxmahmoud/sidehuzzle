import { Stack, useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { BottomActionBar } from '@/components/side/BottomActionBar';
import { Button } from '@/components/side/Button';
import { Chip } from '@/components/side/Button';
import { GlassSurface } from '@/components/side/GlassSurface';
import { ScreenShell } from '@/components/side/ScreenShell';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { useThemeColors } from '@/theme/useThemeColors';

const CATEGORIES = ['All', 'Cleaning', 'Assembly', 'Moving', 'Garden', 'Handyman', 'Pet care', 'Painting', 'Plumbing', 'Electrical'];
const SORT_OPTIONS = ['Relevance', 'Price: low to high', 'Price: high to low', 'Rating', 'Distance'];
const DISTANCES = ['1 km', '5 km', '10 km', '25 km', '50 km'];
const RATINGS = ['Any', '3+', '4+', '4.5+'];

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  const c = useThemeColors();
  return (
    <View className="gap-side-sm">
      <Text className="text-[12px] font-extrabold uppercase leading-4 tracking-[0px]" style={{ color: c.text_secondary }}>
        {title}
      </Text>
      <View className="flex-row flex-wrap gap-side-sm">{children}</View>
    </View>
  );
}

export function DiscoveryFilterScreen() {
  const c = useThemeColors();
  const router = useRouter();
  const category = useDiscoveryStore((s) => s.category);
  const sortBy = useDiscoveryStore((s) => s.sortBy);
  const priceRange = useDiscoveryStore((s) => s.priceRange);
  const distance = useDiscoveryStore((s) => s.distance);
  const rating = useDiscoveryStore((s) => s.rating);
  const setCategory = useDiscoveryStore((s) => s.setCategory);
  const setSortBy = useDiscoveryStore((s) => s.setSortBy);
  const setPriceRange = useDiscoveryStore((s) => s.setPriceRange);
  const setDistance = useDiscoveryStore((s) => s.setDistance);
  const setRating = useDiscoveryStore((s) => s.setRating);
  const resetFilters = useDiscoveryStore((s) => s.resetFilters);

  return (
    <View className="flex-1" style={{ backgroundColor: c.background_alt }} testID="discovery-filter">
      <Stack.Screen options={{ title: 'Filters', presentation: 'modal' }} />
      <ScreenShell scroll maxWidth="md" contentClassName="gap-side-xl" withBackground>
        <FilterGroup title="Category">
          {CATEGORIES.map((cat) => (
            <Chip key={cat} label={cat} selected={category === cat} onPress={() => setCategory(cat)} />
          ))}
        </FilterGroup>

        <FilterGroup title="Sort by">
          {SORT_OPTIONS.map((opt) => (
            <Chip key={opt} label={opt} selected={sortBy === opt} onPress={() => setSortBy(opt)} />
          ))}
        </FilterGroup>

        <FilterGroup title="Price range">
          <GlassSurface variant="surface" className="w-full flex-row items-center gap-side-md p-side-md">
            <Text className="text-[15px] font-bold leading-5" style={{ color: c.text_primary }}>
              €{priceRange[0]}
            </Text>
            <View className="h-[3px] flex-1 rounded-full" style={{ backgroundColor: c.accent_primary }} />
            <Text className="text-[15px] font-bold leading-5" style={{ color: c.text_primary }}>
              €{priceRange[1]}/hr
            </Text>
          </GlassSurface>
          <Chip label="€0 - €50" selected={priceRange[1] <= 50} onPress={() => setPriceRange([0, 50])} />
          <Chip label="€50 - €100" selected={priceRange[0] === 50 && priceRange[1] === 100} onPress={() => setPriceRange([50, 100])} />
          <Chip label="€100+" selected={priceRange[0] >= 100} onPress={() => setPriceRange([100, 200])} />
        </FilterGroup>

        <FilterGroup title="Distance">
          {DISTANCES.map((d) => (
            <Chip key={d} label={d} selected={distance === d} onPress={() => setDistance(d)} />
          ))}
        </FilterGroup>

        <FilterGroup title="Rating">
          {RATINGS.map((r) => (
            <Chip key={r} label={`★ ${r}`} selected={rating === r} onPress={() => setRating(r)} />
          ))}
        </FilterGroup>
      </ScreenShell>

      <BottomActionBar>
        <Button label="Reset" icon="refresh-outline" variant="secondary" className="flex-1" onPress={() => { resetFilters(); router.back(); }} />
        <Button label="Apply filters" icon="checkmark" variant="primary" className="flex-[2]" onPress={() => router.back()} testID="apply-filters" />
      </BottomActionBar>
    </View>
  );
}
