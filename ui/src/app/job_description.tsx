import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { getTaskById } from '@/domain/api/taskApi';
import { readableTaskType, taskToListing } from '@/data/listingPresentation';
import { useThemeColors } from '@/theme/useThemeColors';
import { radius, space, type as typeStyles } from '@/theme/tokens';

export default function JobDescriptionRoute() {
  const c = useThemeColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data: task, isLoading } = useQuery({
    queryKey: ['task', id],
    queryFn: () => getTaskById(id ?? '0'),
    enabled: id != null,
  });
  const listing = task ? taskToListing(task, 0) : null;

  return (
    <View style={[styles.root, { backgroundColor: c.surface_secondary }]}>
      <Stack.Screen options={{ title: 'Job detail', headerShown: true }} />
      <ScrollView contentContainerStyle={styles.content}>
        {isLoading ? (
          <Text style={{ color: c.text_secondary, textAlign: 'center', padding: space.xl }}>Loading...</Text>
        ) : !task ? (
          <View style={styles.centerState}>
            <Ionicons name="alert-circle-outline" size={48} color={c.border_subtle} />
            <Text style={{ color: c.text_secondary, marginTop: space.md }}>Job not found</Text>
          </View>
        ) : (
          <>
            <ImageBackground source={{ uri: listing?.imageUrl }} imageStyle={styles.heroImage} style={[styles.hero, { backgroundColor: listing?.imageColor ?? c.surface_elevated }]}>
              <View style={[styles.badge, { backgroundColor: c.surface_overlay, borderColor: c.border_glass }]}>
                <Text style={[styles.badgeText, { color: c.pin_job }]}>Job request</Text>
              </View>
            </ImageBackground>

            <Text style={[typeStyles.title, { color: c.text_primary }]}>{task.name}</Text>
            <Text style={{ color: c.text_secondary, fontSize: 14, lineHeight: 22 }}>
              {task.short_description ?? task.description ?? 'No description provided.'}
            </Text>

            <View style={styles.metaGrid}>
              <View style={[styles.metaItem, { backgroundColor: c.surface_elevated, borderColor: c.border_subtle }]}>
                <Text style={{ color: c.text_secondary, fontSize: 12, fontWeight: '600' }}>Rate</Text>
                <Text style={[typeStyles.price, { color: c.text_primary }]}>
                  {listing?.rateLabel ?? 'Contact'}
                </Text>
              </View>
              <View style={[styles.metaItem, { backgroundColor: c.surface_elevated, borderColor: c.border_subtle }]}>
                <Text style={{ color: c.text_secondary, fontSize: 12, fontWeight: '600' }}>Type</Text>
                <Text style={[typeStyles.price, { color: c.text_primary }]}>{readableTaskType(task.task_type, 'job')}</Text>
              </View>
              {task.distance_km != null && (
                <View style={[styles.metaItem, { backgroundColor: c.surface_elevated, borderColor: c.border_subtle }]}>
                  <Text style={{ color: c.text_secondary, fontSize: 12, fontWeight: '600' }}>Distance</Text>
                  <Text style={[typeStyles.price, { color: c.text_primary }]}>{task.distance_km.toFixed(1)} km</Text>
                </View>
              )}
            </View>

            <Pressable
              onPress={() => router.push({ pathname: '/user_profile_external', params: { id: String(task.user_id) } })}
              style={[styles.posterRow, { backgroundColor: c.surface_elevated, borderColor: c.border_subtle }]}
              accessibilityRole="button"
            >
              <View style={[styles.avatar, { backgroundColor: c.surface_selected }]}>
                <Ionicons name="person" size={20} color={c.text_secondary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[typeStyles.subtitle, { color: c.text_primary }]}>View profile</Text>
                <Text style={{ color: c.text_secondary, fontSize: 13 }}>Tap to see this poster's full profile and reviews</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={c.text_secondary} />
            </Pressable>

            {task.description && (
              <View style={[styles.descCard, { backgroundColor: c.surface_elevated, borderColor: c.border_subtle }]}>
                <Text style={[typeStyles.subtitle, { color: c.text_primary, marginBottom: space.sm }]}>Full description</Text>
                <Text style={{ color: c.text_secondary, fontSize: 14, lineHeight: 22 }}>{task.description}</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: c.surface_primary, borderTopColor: c.border_subtle, paddingBottom: insets.bottom + space.md }]}>
        <Pressable
          onPress={() => {
            if (id) router.push({ pathname: '/offer_service', params: { id } });
          }}
          style={[styles.applyBtn, { backgroundColor: c.accent_primary }]}
          accessibilityRole="button"
        >
          <Text style={styles.applyText}>Apply to this job</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { width: '100%', maxWidth: 920, alignSelf: 'center', padding: space.xl, gap: space.lg },
  hero: { height: 180, borderRadius: radius.card, justifyContent: 'flex-end', padding: space.md },
  heroImage: { borderRadius: radius.card },
  badge: { alignSelf: 'flex-start', borderRadius: radius.chip, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  metaGrid: { flexDirection: 'row', gap: space.sm },
  metaItem: { flex: 1, padding: space.md, borderRadius: radius.button, borderWidth: 1, gap: 4, alignItems: 'center' },
  posterRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.lg, borderRadius: radius.card, borderWidth: 1 },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  descCard: { padding: space.lg, borderRadius: radius.card, borderWidth: 1 },
  centerState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: space.xl, gap: space.md },
  footer: { paddingHorizontal: space.lg, paddingTop: space.md, borderTopWidth: 1 },
  applyBtn: { borderRadius: radius.button, paddingVertical: space.lg, alignItems: 'center' },
  applyText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
