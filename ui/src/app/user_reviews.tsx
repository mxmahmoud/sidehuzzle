import { Ionicons } from '@expo/vector-icons'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { GlassCard } from '@/components/GlassCard'
import { SkeletonCard } from '@/components/Skeleton'
import { useThemeColors } from '@/theme/useThemeColors'
import { radius, space, type as typeStyles } from '@/theme/tokens'
import { getUserReviews } from '@/domain/api/userApi'

type UserReview = {
  id: number
  rating: number
  comment?: string
  created_at?: string
  author_name?: string
}

function StarRow({ rating }: { rating: number }) {
  return (
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Ionicons
          key={n}
          name={n <= Math.round(rating) ? 'star' : 'star-outline'}
          size={14}
          color={n <= Math.round(rating) ? '#FFB400' : '#9E9E9E'}
        />
      ))}
    </View>
  )
}

export default function UserReviewsRoute() {
  const c = useThemeColors()
  const { id } = useLocalSearchParams<{ id: string }>()
  const userId = Number(id)

  const { data: reviews, isLoading, isError } = useQuery<UserReview[]>({
    queryKey: ['reviews', userId],
    queryFn: () => getUserReviews(userId) as Promise<UserReview[]>,
    throwOnError: false,
    enabled: !isNaN(userId),
  })

  if (isLoading) {
    return (
      <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.content}>
        {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
      </ScrollView>
    )
  }

  if (isError || !reviews) {
    return (
      <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.center}>
        <Ionicons name="alert-circle" size={48} color={c.text_secondary} />
        <Text style={[typeStyles.body, { color: c.text_secondary, marginTop: space.md }]}>
          Could not load reviews.
        </Text>
      </ScrollView>
    )
  }

  const avg = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0

  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => Math.round(r.rating) === stars).length,
    pct: reviews.length > 0
      ? Math.round((reviews.filter((r) => Math.round(r.rating) === stars).length / reviews.length) * 100)
      : 0,
  }))

  return (
    <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.content}>
      {/* Summary card */}
      <GlassCard style={{ alignItems: 'center' }}>
        <Text style={[styles.eyebrow, { color: c.accent_primary }]}>All reviews</Text>
        <Text style={[styles.bigNumber, { color: c.text_primary }]}>{avg.toFixed(1)}</Text>
        <StarRow rating={avg} />
        <Text style={{ color: c.text_secondary, fontSize: 13, marginTop: space.xs }}>
          {reviews.length} review{reviews.length !== 1 ? 's' : ''}
        </Text>

        <View style={styles.distribution}>
          {distribution.map(({ stars, pct, count }) => (
            <View key={stars} style={styles.distRow}>
              <Text style={{ color: c.text_secondary, fontSize: 12, width: 14 }}>{stars}</Text>
              <Ionicons name="star" size={10} color="#FFB400" />
              <View style={[styles.barTrack, { backgroundColor: c.border_subtle }]}>
                <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: '#FFB400' }]} />
              </View>
              <Text style={{ color: c.text_secondary, fontSize: 11, width: 28, textAlign: 'right' }}>{count}</Text>
            </View>
          ))}
        </View>
      </GlassCard>

      {/* Individual reviews */}
      <Text style={[styles.sectionTitle, { color: c.text_secondary }]}>Latest reviews</Text>

      {reviews.length === 0 ? (
        <GlassCard style={{ alignItems: 'center', padding: space.xl }}>
          <Ionicons name="chatbubbles-outline" size={48} color={c.text_secondary} />
          <Text style={[typeStyles.body, { color: c.text_secondary, marginTop: space.md, textAlign: 'center' }]}>
            No reviews yet.
          </Text>
        </GlassCard>
      ) : (
        reviews.map((review: UserReview) => (
          <View key={review.id} style={[styles.card, { backgroundColor: c.surface_primary, borderColor: c.border_subtle }]}>
            <View style={styles.reviewHeader}>
              <View style={[styles.avatar, { backgroundColor: c.accent_primary + '22' }]}>
                <Ionicons name="person" size={16} color={c.accent_primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[typeStyles.body, { color: c.text_primary, fontWeight: '600' }]}>
                  {review.author_name ?? 'Anonymous'}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
                  <StarRow rating={review.rating} />
                  {review.created_at && (
                    <Text style={{ color: c.text_secondary, fontSize: 11 }}>
                      {new Date(review.created_at).toLocaleDateString()}
                    </Text>
                  )}
                </View>
              </View>
            </View>
            {review.comment && (
              <Text style={{ color: c.text_secondary, fontSize: 13, lineHeight: 19, marginTop: space.sm }}>
                {review.comment}
              </Text>
            )}
          </View>
        ))
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: space.xl, gap: space.lg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: space.xl },
  eyebrow: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0 },
  bigNumber: { fontSize: 56, fontWeight: '200', lineHeight: 64 },
  stars: { flexDirection: 'row', gap: 3 },
  distribution: { width: '100%', marginTop: space.lg, gap: 6 },
  distRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  barTrack: { flex: 1, height: 6, borderRadius: 3 },
  barFill: { height: 6, borderRadius: 3 },
  sectionTitle: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0 },
  card: { padding: space.lg, borderRadius: radius.card, borderWidth: 1, gap: space.sm },
  reviewHeader: { flexDirection: 'row', gap: space.md, alignItems: 'flex-start' },
  avatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
})
