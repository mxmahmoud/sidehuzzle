import { Stack, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AmbientGlassBackground } from '@/components/AmbientGlassBackground';
import { GlassButton } from '@/components/GlassButton';
import { GlassCard } from '@/components/GlassCard';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { useThemeColors } from '@/theme/useThemeColors';
import { space } from '@/theme/tokens';

const CATEGORIES = ['All', 'Cleaning', 'Assembly', 'Moving', 'Garden', 'Handyman', 'Pet care', 'Painting', 'Plumbing', 'Electrical'];
const SORT_OPTIONS = ['Relevance', 'Price: low to high', 'Price: high to low', 'Rating', 'Distance'];
const DISTANCES = ['1 km', '5 km', '10 km', '25 km', '50 km'];
const RATINGS = ['Any', '3+', '4+', '4.5+'];

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <GlassButton label={label} variant="chip" selected={active} onPress={onPress} />
  );
}

export default function DiscoveryFilterRoute() {
  const c = useThemeColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
    <View style={[styles.root, { backgroundColor: c.background_alt }]}>
      <Stack.Screen options={{ title: 'Filters', presentation: 'modal' }} />
      <AmbientGlassBackground />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionTitle, { color: c.text_secondary }]}>Category</Text>
        <View style={styles.chipRow}>
          {CATEGORIES.map((cat) => (
            <Chip key={cat} label={cat} active={category === cat} onPress={() => setCategory(cat)} />
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: c.text_secondary }]}>Sort by</Text>
        <View style={styles.chipRow}>
          {SORT_OPTIONS.map((opt) => (
            <Chip key={opt} label={opt} active={sortBy === opt} onPress={() => setSortBy(opt)} />
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: c.text_secondary }]}>Price range</Text>
        <GlassCard variant="surface" style={styles.rangeRow}>
          <Text style={[styles.rangeText, { color: c.text_primary }]}>
            €{priceRange[0]}
          </Text>
          <View style={[styles.rangeLine, { backgroundColor: c.accent_primary }]} />
          <Text style={[styles.rangeText, { color: c.text_primary }]}>
            €{priceRange[1]}/hr
          </Text>
        </GlassCard>
        <View style={styles.chipRow}>
          <Chip label="€0 - €50" active={priceRange[1] <= 50} onPress={() => setPriceRange([0, 50])} />
          <Chip label="€50 - €100" active={priceRange[0] === 50 && priceRange[1] === 100} onPress={() => setPriceRange([50, 100])} />
          <Chip label="€100+" active={priceRange[0] >= 100} onPress={() => setPriceRange([100, 200])} />
        </View>

        <Text style={[styles.sectionTitle, { color: c.text_secondary }]}>Distance</Text>
        <View style={styles.chipRow}>
          {DISTANCES.map((d) => (
            <Chip key={d} label={d} active={distance === d} onPress={() => setDistance(d)} />
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: c.text_secondary }]}>Rating</Text>
        <View style={styles.chipRow}>
          {RATINGS.map((r) => (
            <Chip key={r} label={`★ ${r}`} active={rating === r} onPress={() => setRating(r)} />
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: c.glass_chrome, borderTopColor: c.glass_border, paddingBottom: insets.bottom + space.md }]}>
        <GlassButton label="Reset" icon="refresh-outline" onPress={() => { resetFilters(); router.back(); }} style={styles.resetBtn} />
        <GlassButton label="Apply filters" icon="checkmark" variant="primary" onPress={() => router.back()} style={styles.applyBtn} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { width: '100%', maxWidth: 760, alignSelf: 'center', padding: space.xl, gap: space.sm },
  sectionTitle: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0, marginTop: space.lg },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  rangeRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md },
  rangeLine: { flex: 1, height: 3, borderRadius: 2 },
  rangeText: { fontSize: 15, fontWeight: '600' },
  footer: { flexDirection: 'row', gap: space.md, paddingHorizontal: space.lg, paddingTop: space.md, borderTopWidth: 1 },
  resetBtn: { flex: 1 },
  applyBtn: { flex: 2 },
});
