import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/theme/useThemeColors';
import { radius, space, type as typeStyles } from '@/theme/tokens';

const TRENDING = ['Deep cleaning', 'IKEA assembly', 'Dog walking', 'Moving help', 'Garden work', 'Handyman', 'Painting', 'Plumbing'];
const RECENT = ['Cleaner in Bondi', 'Handyman Surry Hills'];

export default function SearchScreenRoute() {
  const c = useThemeColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const filtered = query.length > 1
    ? TRENDING.filter((t) => t.toLowerCase().includes(query.toLowerCase()))
    : [];

  const goToResults = useCallback(
    (q: string) => {
      router.push({ pathname: '/search_results', params: { q } });
    },
    [router]
  );

  return (
    <View style={[styles.root, { backgroundColor: c.surface_secondary }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.header, { paddingTop: insets.top + space.sm, backgroundColor: c.surface_primary, borderBottomColor: c.border_subtle }]}>
        <Pressable onPress={() => router.back()} style={({ hovered, pressed }) => [styles.backBtn, hovered && { backgroundColor: c.surface_elevated }, pressed && { opacity: 0.85 }]} accessibilityRole="button">
          <Ionicons name="arrow-back" size={22} color={c.text_primary} />
        </Pressable>
        <View style={[styles.inputRow, { backgroundColor: c.surface_elevated, borderColor: c.border_subtle }]}>
          <Ionicons name="search" size={18} color={c.text_secondary} />
          <TextInput
            style={[styles.input, { color: c.text_primary }]}
            placeholder="Search freelancers or jobs..."
            placeholderTextColor={c.text_secondary}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => query.trim() && goToResults(query.trim())}
            autoFocus
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} accessibilityRole="button">
              <Ionicons name="close-circle" size={18} color={c.text_secondary} />
            </Pressable>
          )}
        </View>
        <Pressable onPress={() => router.push('/discovery_filter')} style={styles.filterBtn} accessibilityRole="button">
          <Ionicons name="options-outline" size={20} color={c.accent_primary} />
        </Pressable>
      </View>

      <FlatList
        data={filtered.length > 0 ? filtered : (query.length === 0 ? TRENDING : [])}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.section}>
            {query.length === 0 && RECENT.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { color: c.text_secondary }]}>Recent</Text>
                {RECENT.map((r) => (
                  <Pressable key={r} onPress={() => goToResults(r)} style={[styles.recentRow, { borderBottomColor: c.border_subtle }]}>
                    <Ionicons name="time-outline" size={16} color={c.text_secondary} />
                    <Text style={[styles.recentText, { color: c.text_primary }]}>{r}</Text>
                  </Pressable>
                ))}
                <Text style={[styles.sectionTitle, { color: c.text_secondary, marginTop: space.lg }]}>Trending</Text>
              </>
            )}
            {query.length > 0 && filtered.length === 0 && (
              <Text style={[typeStyles.body, { color: c.text_secondary, textAlign: 'center', paddingVertical: space.xl }]}>
                No suggestions for "{query}"
              </Text>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <Pressable onPress={() => goToResults(item)} style={[styles.suggestionRow, { borderBottomColor: c.border_subtle }]}>
            <Ionicons name="trending-up" size={16} color={c.accent_primary} />
            <Text style={[styles.suggestionText, { color: c.text_primary }]}>{item}</Text>
            <Ionicons name="arrow-forward" size={14} color={c.text_secondary} style={{ marginLeft: 'auto' }} />
          </Pressable>
        )}
      />

      <View style={[styles.footer, { backgroundColor: c.surface_primary, borderTopColor: c.border_subtle, paddingBottom: insets.bottom + space.md }]}>
        <Pressable onPress={() => router.push('/map_view')} style={[styles.mapFab, { backgroundColor: c.accent_primary }]} accessibilityRole="button">
          <Ionicons name="map" size={18} color="#FFF" />
          <Text style={styles.mapFabText}>Map</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingHorizontal: space.md, paddingBottom: space.md, borderBottomWidth: 1 },
  backBtn: { padding: space.xs },
  inputRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: space.sm, borderRadius: radius.button, paddingHorizontal: space.md, height: 44, borderWidth: 1 },
  input: { flex: 1, fontSize: 15 },
  filterBtn: { padding: space.sm },
  listContent: { paddingHorizontal: space.lg },
  section: {},
  sectionTitle: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0, marginBottom: space.sm, marginTop: space.lg },
  recentRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingVertical: space.md, borderBottomWidth: StyleSheet.hairlineWidth },
  recentText: { fontSize: 15 },
  suggestionRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingVertical: space.md, borderBottomWidth: StyleSheet.hairlineWidth },
  suggestionText: { fontSize: 15, fontWeight: '500' },
  footer: { paddingHorizontal: space.lg, paddingTop: space.md, borderTopWidth: 1, alignItems: 'center' },
  mapFab: { flexDirection: 'row', alignItems: 'center', gap: space.sm, borderRadius: radius.chip, paddingHorizontal: space.lg, paddingVertical: space.md },
  mapFabText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
});
