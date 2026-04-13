import { Stack, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { useThemeColors } from '@/theme/useThemeColors';
import { radius, space, type as typeStyles } from '@/theme/tokens';

const CATEGORIES = ['All', 'Cleaning', 'Assembly', 'Moving', 'Garden', 'Handyman', 'Pet care', 'Painting', 'Plumbing', 'Electrical'];
const SORT_OPTIONS = ['Relevance', 'Price: low to high', 'Price: high to low', 'Rating', 'Distance'];
const DISTANCES = ['1 km', '5 km', '10 km', '25 km', '50 km'];
const RATINGS = ['Any', '3+', '4+', '4.5+'];

function Chip({ label, active, onPress, c }: { label: string; active: boolean; onPress: () => void; c: any }) {
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
    <View style={[styles.root, { backgroundColor: c.surface_secondary }]}>
      <Stack.Screen options={{ title: 'Filters', presentation: 'modal' }} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionTitle, { color: c.text_secondary }]}>Category</Text>
        <View style={styles.chipRow}>
          {CATEGORIES.map((cat) => (
            <Chip key={cat} label={cat} active={category === cat} onPress={() => setCategory(cat)} c={c} />
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: c.text_secondary }]}>Sort by</Text>
        <View style={styles.chipRow}>
          {SORT_OPTIONS.map((opt) => (
            <Chip key={opt} label={opt} active={sortBy === opt} onPress={() => setSortBy(opt)} c={c} />
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: c.text_secondary }]}>Price range</Text>
        <View style={[styles.rangeRow, { backgroundColor: c.surface_elevated, borderColor: c.border_subtle }]}>
          <Text style={[styles.rangeText, { color: c.text_primary }]}>
            ${priceRange[0]}
          </Text>
          <View style={[styles.rangeLine, { backgroundColor: c.accent_primary }]} />
          <Text style={[styles.rangeText, { color: c.text_primary }]}>
            ${priceRange[1]}/hr
          </Text>
        </View>
        <View style={styles.chipRow}>
          <Chip label="$0 - $50" active={priceRange[1] <= 50} onPress={() => setPriceRange([0, 50])} c={c} />
          <Chip label="$50 - $100" active={priceRange[0] === 50 && priceRange[1] === 100} onPress={() => setPriceRange([50, 100])} c={c} />
          <Chip label="$100+" active={priceRange[0] >= 100} onPress={() => setPriceRange([100, 200])} c={c} />
        </View>

        <Text style={[styles.sectionTitle, { color: c.text_secondary }]}>Distance</Text>
        <View style={styles.chipRow}>
          {DISTANCES.map((d) => (
            <Chip key={d} label={d} active={distance === d} onPress={() => setDistance(d)} c={c} />
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: c.text_secondary }]}>Rating</Text>
        <View style={styles.chipRow}>
          {RATINGS.map((r) => (
            <Chip key={r} label={`★ ${r}`} active={rating === r} onPress={() => setRating(r)} c={c} />
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: c.surface_primary, borderTopColor: c.border_subtle, paddingBottom: insets.bottom + space.md }]}>
        <Pressable onPress={() => { resetFilters(); router.back(); }} style={[styles.resetBtn, { borderColor: c.border_subtle }]} accessibilityRole="button">
          <Text style={[styles.resetText, { color: c.text_primary }]}>Reset</Text>
        </Pressable>
        <Pressable onPress={() => router.back()} style={[styles.applyBtn, { backgroundColor: c.accent_primary }]} accessibilityRole="button">
          <Text style={styles.applyText}>Apply filters</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: space.xl, gap: space.sm },
  sectionTitle: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginTop: space.lg },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  chip: { borderRadius: radius.chip, borderWidth: 1, paddingHorizontal: space.md, paddingVertical: space.sm },
  chipText: { fontSize: 13, fontWeight: '600' },
  rangeRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, borderRadius: radius.button, borderWidth: 1, padding: space.md },
  rangeLine: { flex: 1, height: 3, borderRadius: 2 },
  rangeText: { fontSize: 15, fontWeight: '600' },
  footer: { flexDirection: 'row', gap: space.md, paddingHorizontal: space.lg, paddingTop: space.md, borderTopWidth: 1 },
  resetBtn: { flex: 1, borderWidth: 1, borderRadius: radius.button, paddingVertical: space.md, alignItems: 'center' },
  resetText: { fontSize: 15, fontWeight: '600' },
  applyBtn: { flex: 2, borderRadius: radius.button, paddingVertical: space.md, alignItems: 'center' },
  applyText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
});
