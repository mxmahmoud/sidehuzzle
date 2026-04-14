import { Ionicons } from '@expo/vector-icons'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { GlassCard } from '@/components/GlassCard'
import { SkeletonCard } from '@/components/Skeleton'
import { useThemeColors } from '@/theme/useThemeColors'
import { radius, space, type as typeStyles } from '@/theme/tokens'
import { getUserProfile, getUserReviews } from '@/domain/api/userApi'
import type { UserRead } from '@/data/contract'

type UserProfile = UserRead & {
  avatar_url?: string | null
  full_name?: string | null
  tagline?: string | null
  location?: string | null
  bio?: string | null
}

type UserReview = {
  id: number
  rating: number
  comment?: string
  created_at?: string
  author_name?: string
}


function StarRating({ rating }: { rating: number }) {
  const c = useThemeColors()
  return (
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Ionicons
          key={n}
          name={n <= Math.round(rating) ? 'star' : 'star-outline'}
          size={14}
          color={n <= Math.round(rating) ? '#FFB400' : c.text_secondary}
        />
      ))}
    </View>
  )
}

function ReviewItem({ review }: { review: { id: number; rating: number; comment?: string; created_at?: string; author_name?: string } }) {
  const c = useThemeColors()
  return (
    <View style={[styles.reviewItem, { backgroundColor: c.surface_primary, borderColor: c.border_subtle }]}>
      <View style={styles.reviewHeader}>
        <View style={[styles.avatar, { backgroundColor: c.accent_primary + '22' }]}>
          <Ionicons name="person" size={18} color={c.accent_primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[typeStyles.body, { color: c.text_primary, fontWeight: '600' }]}>
            {review.author_name ?? 'Anonymous'}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
            <StarRating rating={review.rating} />
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
  )
}

export default function UserProfileExternalRoute() {
  const c = useThemeColors()
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const userId = Number(id)

  const { data: profile, isLoading: profileLoading } = useQuery<UserProfile | null>({
    queryKey: ['user', userId],
    queryFn: () => getUserProfile(userId) as Promise<UserProfile | null>,
    throwOnError: false,
    enabled: !isNaN(userId),
  })

  const { data: reviews, isLoading: reviewsLoading } = useQuery<UserReview[]>({
    queryKey: ['reviews', userId],
    queryFn: () => getUserReviews(userId) as Promise<UserReview[]>,
    throwOnError: false,
    enabled: !isNaN(userId),
  })

  if (profileLoading) {
    return (
      <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.content}>
        <SkeletonCard />
        <SkeletonCard />
      </ScrollView>
    )
  }

  if (!profile) {
    return (
      <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.center}>
        <Ionicons name="person-outline" size={48} color={c.text_secondary} />
        <Text style={[typeStyles.body, { color: c.text_secondary, marginTop: space.md }]}>
          User not found.
        </Text>
        <Pressable
          style={[styles.cta, { backgroundColor: c.accent_primary }]}
          onPress={() => router.back()}
        >
          <Text style={styles.ctaText}>Go back</Text>
        </Pressable>
      </ScrollView>
    )
  }

  const avgRating = reviews && reviews.length > 0
    ? reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviews.length
    : null

  return (
    <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.content}>
      {/* Profile header */}
      <GlassCard style={{ alignItems: 'center', padding: space.xl }}>
        <View style={[styles.avatar, { width: 80, height: 80, backgroundColor: c.accent_primary + '22' }]}>
          {profile.avatar_url ? (
            <Image source={{ uri: profile.avatar_url }} style={styles.avatarImage} />
          ) : (
            <Ionicons name="person" size={40} color={c.accent_primary} />
          )}
        </View>
        <Text style={[typeStyles.title, { color: c.text_primary, marginTop: space.md }]}>
          {profile.full_name ?? 'User'}
        </Text>
        {profile.tagline && (
          <Text style={{ color: c.text_secondary, fontSize: 14, textAlign: 'center', lineHeight: 21 }}>
            {profile.tagline}
          </Text>
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.md, marginTop: space.md }}>
          {avgRating !== null && (
            <View style={styles.stat}>
              <StarRating rating={avgRating} />
              <Text style={{ color: c.text_secondary, fontSize: 12 }}>({reviews!.length})</Text>
            </View>
          )}
          {profile.location && (
            <View style={styles.stat}>
              <Ionicons name="location-outline" size={14} color={c.text_secondary} />
              <Text style={{ color: c.text_secondary, fontSize: 12 }}>{profile.location}</Text>
            </View>
          )}
        </View>
        {profile.bio && (
          <Text style={{ color: c.text_secondary, fontSize: 13, lineHeight: 20, marginTop: space.md, textAlign: 'center' }}>
            {profile.bio}
          </Text>
        )}
      </GlassCard>

      {/* Reviews section */}
      <View style={{ gap: space.sm }}>
        <Text style={[styles.sectionTitle, { color: c.text_secondary }]}>Reviews</Text>
        {reviewsLoading ? (
          <SkeletonCard />
        ) : reviews && reviews.length > 0 ? (
          reviews.map((review: { rating: number; id: number }) => (
            <ReviewItem key={review.id} review={review} />
          ))
        ) : (
          <GlassCard style={{ alignItems: 'center', padding: space.xl }}>
            <Ionicons name="chatbubbles-outline" size={40} color={c.text_secondary} />
            <Text style={[typeStyles.body, { color: c.text_secondary, marginTop: space.md, textAlign: 'center' }]}>
              No reviews yet.
            </Text>
          </GlassCard>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: space.xl, gap: space.lg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: space.xl },
  avatar: { borderRadius: 999, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  avatarImage: { width: '100%', height: '100%' },
  stars: { flexDirection: 'row', gap: 2 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sectionTitle: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0 },
  reviewItem: { padding: space.lg, borderRadius: radius.card, borderWidth: 1 },
  reviewHeader: { flexDirection: 'row', gap: space.md, alignItems: 'flex-start' },
  cta: { paddingHorizontal: space.xl, paddingVertical: space.md, borderRadius: radius.button, marginTop: space.md },
  ctaText: { color: '#fff', fontWeight: '700', fontSize: 15 },
})
