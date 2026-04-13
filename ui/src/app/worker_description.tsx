import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDiscoveryListings } from '@/data/listingsQueries';
import { useThemeColors } from '@/theme/useThemeColors';
import { radius, space, type as typeStyles } from '@/theme/tokens';

export default function WorkerDescriptionRoute() {
  const c = useThemeColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: listings = [] } = useDiscoveryListings('worker');
  const item = listings.find((listing) => listing.id === id) ?? listings[0];

  return (
    <View style={[styles.root, { backgroundColor: c.surface_secondary }]}>
      <Stack.Screen options={{ title: 'Worker profile', headerShown: true }} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.hero, { backgroundColor: item?.imageColor ?? c.surface_elevated }]}>
          <View style={[styles.badge, { backgroundColor: 'rgba(255,94,168,0.22)' }]}>
            <Text style={[styles.badgeText, { color: c.pin_worker }]}>Pro</Text>
          </View>
        </View>

        <Text style={[typeStyles.title, { color: c.text_primary }]}>{item?.title ?? 'Worker profile'}</Text>
        <Text style={{ color: c.text_secondary, fontSize: 14, lineHeight: 22 }}>
          {item?.subtitle ?? 'Loading worker details from the backend-backed discovery data.'}
        </Text>

        <View style={styles.metaGrid}>
          <View style={[styles.metaItem, { backgroundColor: c.surface_elevated, borderColor: c.border_subtle }]}>
            <Text style={{ color: c.text_secondary, fontSize: 12, fontWeight: '600' }}>Rate</Text>
            <Text style={[typeStyles.price, { color: c.text_primary }]}>{item?.rateLabel ?? 'Contact'}</Text>
          </View>
          <View style={[styles.metaItem, { backgroundColor: c.surface_elevated, borderColor: c.border_subtle }]}>
            <Text style={{ color: c.text_secondary, fontSize: 12, fontWeight: '600' }}>Rating</Text>
            <Text style={[typeStyles.price, { color: c.text_primary }]}>★ {item?.rating.toFixed(1) ?? '4.9'}</Text>
          </View>
          <View style={[styles.metaItem, { backgroundColor: c.surface_elevated, borderColor: c.border_subtle }]}>
            <Text style={{ color: c.text_secondary, fontSize: 12, fontWeight: '600' }}>Jobs done</Text>
            <Text style={[typeStyles.price, { color: c.text_primary }]}>{item ? `${Math.round(item.reviewCount * 2)}` : '87'}</Text>
          </View>
        </View>

        <Pressable onPress={() => router.push('/gallery_view')} style={[styles.galleryBtn, { backgroundColor: c.surface_elevated, borderColor: c.border_subtle }]} accessibilityRole="button">
          <Ionicons name="images-outline" size={20} color={c.accent_primary} />
          <Text style={{ color: c.text_primary, fontSize: 15, fontWeight: '500', flex: 1 }}>View portfolio</Text>
          <Ionicons name="chevron-forward" size={16} color={c.text_secondary} />
        </Pressable>

        <Pressable onPress={() => router.push('/user_reviews')} style={[styles.galleryBtn, { backgroundColor: c.surface_elevated, borderColor: c.border_subtle }]} accessibilityRole="button">
          <Ionicons name="star-outline" size={20} color={c.accent_primary} />
          <Text style={{ color: c.text_primary, fontSize: 15, fontWeight: '500', flex: 1 }}>Reviews ({item?.reviewCount ?? 42})</Text>
          <Ionicons name="chevron-forward" size={16} color={c.text_secondary} />
        </Pressable>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: c.surface_primary, borderTopColor: c.border_subtle, paddingBottom: insets.bottom + space.md }]}>
        <Pressable onPress={() => router.push('/send_help_request_to_worker')} style={[styles.requestBtn, { backgroundColor: c.accent_primary }]} accessibilityRole="button">
          <Text style={styles.requestText}>Request this worker</Text>
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
  galleryBtn: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.lg, borderRadius: radius.card, borderWidth: 1 },
  footer: { paddingHorizontal: space.lg, paddingTop: space.md, borderTopWidth: 1 },
  requestBtn: { borderRadius: radius.button, paddingVertical: space.lg, alignItems: 'center' },
  requestText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
