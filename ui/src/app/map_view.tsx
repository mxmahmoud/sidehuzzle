import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapSurface } from '@/components/MapSurface';
import { useDiscoveryListings } from '@/data/listingsQueries';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { useThemeColors } from '@/theme/useThemeColors';
import { radius, space } from '@/theme/tokens';

export default function MapViewRoute() {
  const c = useThemeColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const listingMode = useDiscoveryStore((s) => s.listingMode);
  const filters = useDiscoveryStore((s) => ({
    category: s.category,
    sortBy: s.sortBy,
    priceRange: s.priceRange,
    distance: s.distance,
    rating: s.rating,
  }));
  const { data: listings = [] } = useDiscoveryListings(listingMode, filters);

  return (
    <View style={[styles.root, { backgroundColor: c.surface_secondary }]}>
      <Stack.Screen options={{ title: 'Map', headerShown: true }} />

      <View style={styles.hero}>
        <Text style={[styles.eyebrow, { color: c.accent_primary }]}>Spatial discovery</Text>
        <Text style={[styles.title, { color: c.text_primary }]}>Search the city from the map</Text>
        <Text style={{ color: c.text_secondary, fontSize: 14, lineHeight: 21 }}>
          Use the map to compare nearby jobs and trusted pros with real context.
        </Text>
      </View>

      <View style={[styles.mapFrame, { backgroundColor: c.surface_primary, borderColor: c.border_subtle }]}>
        <MapSurface listings={listings} style={styles.map} />
        <View style={styles.overlayStack}>
          <Pressable onPress={() => router.push('/search_screen')} style={[styles.fab, { backgroundColor: c.surface_overlay, borderColor: c.border_subtle }]} accessibilityRole="button">
            <Ionicons name="search" size={18} color={c.text_primary} />
          </Pressable>
          <Pressable onPress={() => router.push('/discovery_filter')} style={[styles.fab, { backgroundColor: c.surface_overlay, borderColor: c.border_subtle }]} accessibilityRole="button">
            <Ionicons name="options-outline" size={18} color={c.text_primary} />
          </Pressable>
          <Pressable onPress={() => router.back()} style={[styles.fab, { backgroundColor: c.accent_primary, borderColor: c.accent_primary }]} accessibilityRole="button">
            <Ionicons name="arrow-back" size={18} color="#FFF" />
          </Pressable>
        </View>
      </View>

      <View style={[styles.bottomSheet, { backgroundColor: c.surface_primary, borderTopColor: c.border_subtle, paddingBottom: insets.bottom + space.md }]}>
        <View style={styles.sheetHandle} />
        <Text style={[styles.sheetTitle, { color: c.text_primary }]}>Live discovery</Text>
        <Text style={{ color: c.text_secondary, fontSize: 13, lineHeight: 19 }}>Tap a pin, then open the matching card for more detail.</Text>
        <View style={styles.sheetActions}>
          <Pressable onPress={() => router.push('/search_results')} style={[styles.sheetBtn, { backgroundColor: c.surface_elevated, borderColor: c.border_subtle }]} accessibilityRole="button">
            <Ionicons name="list" size={16} color={c.text_primary} />
            <Text style={[styles.sheetBtnText, { color: c.text_primary }]}>Results</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/(tabs)/requests_posts_hub')} style={[styles.sheetBtn, { backgroundColor: c.surface_elevated, borderColor: c.border_subtle }]} accessibilityRole="button">
            <Ionicons name="chatbubbles-outline" size={16} color={c.text_primary} />
            <Text style={[styles.sheetBtnText, { color: c.text_primary }]}>Messages</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  hero: { paddingHorizontal: space.xl, paddingTop: space.lg, paddingBottom: space.md, gap: space.xs },
  eyebrow: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  title: { fontSize: 24, lineHeight: 30, fontWeight: '800', letterSpacing: -0.6 },
  mapFrame: { flex: 1, marginHorizontal: space.md, borderRadius: radius.sheet, borderWidth: 1, overflow: 'hidden', position: 'relative' },
  map: { flex: 1, minHeight: 240 },
  overlayStack: { position: 'absolute', right: space.md, top: space.md, gap: space.sm },
  fab: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  bottomSheet: { marginTop: -18, marginHorizontal: space.md, borderTopWidth: 1, borderRadius: radius.sheet, paddingHorizontal: space.lg, paddingTop: space.md, gap: space.sm },
  sheetHandle: { alignSelf: 'center', width: 48, height: 5, borderRadius: 999, backgroundColor: 'rgba(128,128,128,0.35)' },
  sheetTitle: { fontSize: 16, fontWeight: '700' },
  sheetActions: { flexDirection: 'row', gap: space.sm, paddingTop: space.xs },
  sheetBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.sm, borderRadius: radius.button, borderWidth: 1, paddingVertical: space.md },
  sheetBtnText: { fontSize: 14, fontWeight: '600' },
});
