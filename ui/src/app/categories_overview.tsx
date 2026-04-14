import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { getCategories } from '@/domain/api/taskApi'
import { GlassCard } from '@/components/GlassCard'
import { SkeletonCard } from '@/components/Skeleton'
import { useThemeColors } from '@/theme/useThemeColors'
import { radius, space, type as typeStyles } from '@/theme/tokens'

export default function CategoriesOverviewRoute() {
  const c = useThemeColors()
  const router = useRouter()
  const { data: categories, isLoading, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    throwOnError: false,
  })

  if (isLoading) {
    return (
      <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.content}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </ScrollView>
    )
  }

  if (isError || !categories) {
    return (
      <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.center}>
        <Ionicons name="alert-circle" size={48} color={c.text_secondary} />
        <Text style={[typeStyles.body, { color: c.text_secondary, marginTop: space.md }]}>
          Could not load categories.
        </Text>
      </ScrollView>
    )
  }

  return (
    <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.content}>
      <View style={[styles.hero, { backgroundColor: c.surface_primary, borderColor: c.border_subtle }]}>
        <Text style={[styles.eyebrow, { color: c.accent_primary }]}>Browse</Text>
        <Text style={[typeStyles.title, { color: c.text_primary }]}>Categories</Text>
        <Text style={{ color: c.text_secondary, fontSize: 14, lineHeight: 21 }}>
          Find exactly what you need — browse by category to discover nearby jobs and professionals.
        </Text>
      </View>

      {categories.length === 0 ? (
        <GlassCard style={{ alignItems: 'center', padding: space.xl }}>
          <Ionicons name="grid-outline" size={48} color={c.text_secondary} />
          <Text style={[typeStyles.body, { color: c.text_secondary, marginTop: space.md, textAlign: 'center' }]}>
            No categories yet.
          </Text>
        </GlassCard>
      ) : (
        <View style={styles.grid}>
          {categories.map((cat) => (
            <Pressable
              key={cat.id}
              style={[styles.catCard, { backgroundColor: c.surface_primary, borderColor: c.border_subtle }]}
              onPress={() => router.push(`/search_results?category=${encodeURIComponent(cat.name)}`)}
              accessibilityRole="button"
            >
              <View style={[styles.catIconWrap, { backgroundColor: c.accent_primary + '18' }]}>
                <Ionicons name="apps" size={22} color={c.accent_primary} />
              </View>
              <Text style={[typeStyles.subtitle, { color: c.text_primary, flex: 1 }]} numberOfLines={2}>
                {cat.name}
              </Text>
              {cat.parent_id && (
                <Text style={{ color: c.text_secondary, fontSize: 11 }}>Subcategory</Text>
              )}
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: space.xl, gap: space.lg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: space.xl },
  hero: { gap: space.sm, padding: space.lg, borderRadius: radius.card, borderWidth: 1 },
  eyebrow: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md },
  catCard: {
    width: '47%',
    padding: space.lg,
    borderRadius: radius.card,
    borderWidth: 1,
    gap: space.sm,
    alignItems: 'flex-start',
  },
  catIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.xs,
  },
})
