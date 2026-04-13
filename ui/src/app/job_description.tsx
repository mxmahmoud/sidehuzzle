import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDiscoveryListings } from '@/data/listingsQueries';
import { useThemeColors } from '@/theme/useThemeColors';
import { radius, space, type as typeStyles } from '@/theme/tokens';

export default function JobDescriptionRoute() {
  const c = useThemeColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: listings = [] } = useDiscoveryListings('job');
  const item = listings.find((listing) => listing.id === id) ?? listings[0];

  return (
    <View style={[styles.root, { backgroundColor: c.surface_secondary }]}>
      <Stack.Screen options={{ title: 'Job detail', headerShown: true }} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.hero, { backgroundColor: item?.imageColor ?? c.surface_elevated }]}>
          <View style={[styles.badge, { backgroundColor: 'rgba(109,156,255,0.22)' }]}>
            <Text style={[styles.badgeText, { color: c.pin_job }]}>Job</Text>
          </View>
        </View>

        <Text style={[typeStyles.title, { color: c.text_primary }]}>{item?.title ?? 'Job detail'}</Text>
        <Text style={{ color: c.text_secondary, fontSize: 14, lineHeight: 22 }}>
          {item?.subtitle ?? 'Loading details from the backend-backed discovery data.'}
        </Text>

        <View style={styles.metaGrid}>
          <View style={[styles.metaItem, { backgroundColor: c.surface_elevated, borderColor: c.border_subtle }]}>
            <Text style={{ color: c.text_secondary, fontSize: 12, fontWeight: '600' }}>Rate</Text>
            <Text style={[typeStyles.price, { color: c.text_primary }]}>{item?.rateLabel ?? 'Contact'}</Text>
          </View>
          <View style={[styles.metaItem, { backgroundColor: c.surface_elevated, borderColor: c.border_subtle }]}>
            <Text style={{ color: c.text_secondary, fontSize: 12, fontWeight: '600' }}>Rating</Text>
            <Text style={[typeStyles.price, { color: c.text_primary }]}>★ {item?.rating.toFixed(1) ?? '4.8'}</Text>
          </View>
          <View style={[styles.metaItem, { backgroundColor: c.surface_elevated, borderColor: c.border_subtle }]}>
            <Text style={{ color: c.text_secondary, fontSize: 12, fontWeight: '600' }}>Distance</Text>
            <Text style={[typeStyles.price, { color: c.text_primary }]}>{item ? `${item.distanceKm.toFixed(1)} km` : 'Nearby'}</Text>
          </View>
        </View>

        <Pressable onPress={() => router.push('/user_profile_external')} style={[styles.posterRow, { backgroundColor: c.surface_elevated, borderColor: c.border_subtle }]} accessibilityRole="button">
          <View style={[styles.avatar, { backgroundColor: c.surface_selected }]}>
            <Ionicons name="person" size={20} color={c.text_secondary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[typeStyles.subtitle, { color: c.text_primary }]}>Posted by Jamie</Text>
            <Text style={{ color: c.text_secondary, fontSize: 13 }}>12 reviews · member since 2024</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={c.text_secondary} />
        </Pressable>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: c.surface_primary, borderTopColor: c.border_subtle, paddingBottom: insets.bottom + space.md }]}>
        <Pressable onPress={() => router.push('/offer_service')} style={[styles.applyBtn, { backgroundColor: c.accent_primary }]} accessibilityRole="button">
          <Text style={styles.applyText}>Apply / Counter-offer</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: space.xl, gap: space.lg },
  hero: { height: 180, borderRadius: radius.card, justifyContent: 'flex-end', padding: space.md },
  badge: { alignSelf: 'flex-start', borderRadius: radius.chip, paddingHorizontal: 12, paddingVertical: 6 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  metaGrid: { flexDirection: 'row', gap: space.sm },
  metaItem: { flex: 1, padding: space.md, borderRadius: radius.button, borderWidth: 1, gap: 4, alignItems: 'center' },
  posterRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.lg, borderRadius: radius.card, borderWidth: 1 },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  footer: { paddingHorizontal: space.lg, paddingTop: space.md, borderTopWidth: 1 },
  applyBtn: { borderRadius: radius.button, paddingVertical: space.lg, alignItems: 'center' },
  applyText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
