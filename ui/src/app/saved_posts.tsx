import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { searchTasks } from '@/domain/api/taskApi'
import { GlassCard } from '@/components/GlassCard'
import { SkeletonCard } from '@/components/Skeleton'
import { formatPrice, readableTaskType } from '@/data/listingPresentation'
import { useSessionStore } from '@/stores/sessionStore'
import { useThemeColors } from '@/theme/useThemeColors'
import { radius, space, type as typeStyles } from '@/theme/tokens'

const KIND_COLORS: Record<string, string> = {
  task: '#D95F3D',
  tasker: '#2563EB',
}

function TaskCard({ task }: { task: { id: number; name: string; short_description?: string | null; price?: number | null; price_type?: string | null; task_type?: string | null; status?: string; description?: string; active?: boolean; distance_km?: number } }) {
  const c = useThemeColors()
  const router = useRouter()
  const kind = task.task_type ?? 'task'
  const kindColor = KIND_COLORS[kind] ?? c.accent_primary

  return (
    <Pressable
      onPress={() => router.push(`/job_description?id=${task.id}`)}
      style={[styles.card, { backgroundColor: c.surface_primary, borderColor: c.border_subtle }]}
      accessibilityRole="button"
    >
      <View style={[styles.kindBadge, { backgroundColor: kindColor + '22' }]}>
        <Text style={[styles.kindText, { color: kindColor }]}>{readableTaskType(task.task_type as any, kind === 'tasker' ? 'worker' : 'job')}</Text>
      </View>
      <Text style={[typeStyles.subtitle, { color: c.text_primary }]} numberOfLines={2}>
        {task.name}
      </Text>
      {task.short_description && (
        <Text style={{ color: c.text_secondary, fontSize: 13, lineHeight: 19 }} numberOfLines={2}>
          {task.short_description}
        </Text>
      )}
      {task.price != null && (
        <Text style={[styles.price, { color: c.accent_primary }]}>
          {formatPrice(task.price, task.price_type as any)}
        </Text>
      )}
    </Pressable>
  )
}

export default function SavedPostsRoute() {
  const c = useThemeColors()
  const router = useRouter()
  const user = useSessionStore((s) => s.user)
  const { data: tasks, isLoading, isError } = useQuery({
    queryKey: ['tasks', 'saved'],
    queryFn: () => searchTasks({ limit: 20 }),
    throwOnError: false,
    enabled: !!user, // only fetch when logged in
  })

  if (!user) {
    return (
      <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.center}>
        <Ionicons name="bookmark-outline" size={48} color={c.text_secondary} />
        <Text style={[typeStyles.body, { color: c.text_secondary, marginTop: space.md, textAlign: 'center' }]}>
          Sign in to see your saved posts.
        </Text>
        <Pressable
          style={[styles.cta, { backgroundColor: c.accent_primary }]}
          onPress={() => router.push('/login_form')}
        >
          <Text style={styles.ctaText}>Sign in</Text>
        </Pressable>
      </ScrollView>
    )
  }

  if (isLoading) {
    return (
      <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.content}>
        {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
      </ScrollView>
    )
  }

  if (isError || !tasks) {
    return (
      <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.center}>
        <Ionicons name="alert-circle" size={48} color={c.text_secondary} />
        <Text style={[typeStyles.body, { color: c.text_secondary, marginTop: space.md }]}>
          Could not load saved posts.
        </Text>
      </ScrollView>
    )
  }

  return (
    <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.content}>
      <GlassCard style={{ gap: space.sm }}>
        <Text style={[styles.eyebrow, { color: c.accent_primary }]}>Your listings</Text>
        <Text style={[typeStyles.title, { color: c.text_primary }]}>Saved posts</Text>
        <Text style={{ color: c.text_secondary, fontSize: 14, lineHeight: 21 }}>
          Review and manage the tasks you've posted or saved.
        </Text>
      </GlassCard>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: c.text_secondary }]}>Recent posts</Text>
        <Text style={{ color: c.text_secondary, fontSize: 13 }}>{tasks.length} items</Text>
      </View>

      {tasks.length === 0 ? (
        <GlassCard style={{ alignItems: 'center', padding: space.xl }}>
          <Ionicons name="bookmark-outline" size={48} color={c.text_secondary} />
          <Text style={[typeStyles.body, { color: c.text_secondary, marginTop: space.md, textAlign: 'center' }]}>
            No posts yet. Post your first task!
          </Text>
          <Pressable
            style={[styles.cta, { backgroundColor: c.accent_primary, marginTop: space.md }]}
            onPress={() => router.push('/help_request_form')}
          >
            <Text style={styles.ctaText}>Post a task</Text>
          </Pressable>
        </GlassCard>
      ) : (
        <View style={{ gap: space.md }}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
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
  eyebrow: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0 },
  card: { padding: space.lg, borderRadius: radius.card, borderWidth: 1, gap: space.sm },
  kindBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  kindText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  price: { fontSize: 15, fontWeight: '700' },
  cta: { paddingHorizontal: space.xl, paddingVertical: space.md, borderRadius: radius.button },
  ctaText: { color: '#fff', fontWeight: '700', fontSize: 15 },
})
