import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { searchTasks } from '@/domain/api/taskApi'
import { GlassCard } from '@/components/GlassCard'
import { SkeletonCard } from '@/components/Skeleton'
import { useSessionStore } from '@/stores/sessionStore'
import { useThemeColors } from '@/theme/useThemeColors'
import { radius, space, type as typeStyles } from '@/theme/tokens'

const STATUS_COLORS: Record<string, string> = {
  open: '#3D5AFE',
  assigned: '#D8B46A',
  completed: '#4CAF50',
  cancelled: '#9E9E9E',
}

function HistoryItem({ task }: { task: { id: number; name: string; status?: string; price?: number | null; price_type?: string | null; completed_at?: string | null; short_description?: string; description?: string; active?: boolean; distance_km?: number } }) {
  const c = useThemeColors()
  const router = useRouter()
  const status = task.status ?? 'open'
  const statusColor = STATUS_COLORS[status] ?? c.text_secondary

  return (
    <Pressable
      onPress={() => router.push(`/job_description?id=${task.id}`)}
      style={[styles.item, { backgroundColor: c.surface_primary, borderColor: c.border_subtle }]}
      accessibilityRole="button"
    >
      <View style={styles.itemTop}>
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        <Text style={[styles.statusLabel, { color: statusColor }]}>{status}</Text>
      </View>
      <Text style={[typeStyles.subtitle, { color: c.text_primary }]} numberOfLines={2}>
        {task.name}
      </Text>
      <View style={styles.itemMeta}>
        {task.price != null && (
          <Text style={{ color: c.text_secondary, fontSize: 13 }}>
            {task.price_type ? `${task.price_type} · ` : ''}{task.price}
          </Text>
        )}
        {task.completed_at && (
          <Text style={{ color: c.text_secondary, fontSize: 12 }}>
            {new Date(task.completed_at).toLocaleDateString()}
          </Text>
        )}
      </View>
    </Pressable>
  )
}

export default function HistoryPageRoute() {
  const c = useThemeColors()
  const router = useRouter()
  const user = useSessionStore((s) => s.user)
  const { data: tasks, isLoading, isError } = useQuery({
    queryKey: ['tasks', 'history'],
    queryFn: () => searchTasks({ limit: 50 }),
    throwOnError: false,
    enabled: !!user,
  })

  if (!user) {
    return (
      <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.center}>
        <Ionicons name="time-outline" size={48} color={c.text_secondary} />
        <Text style={[typeStyles.body, { color: c.text_secondary, marginTop: space.md, textAlign: 'center' }]}>
          Sign in to view your history.
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
        {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
      </ScrollView>
    )
  }

  if (isError || !tasks) {
    return (
      <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.center}>
        <Ionicons name="alert-circle" size={48} color={c.text_secondary} />
        <Text style={[typeStyles.body, { color: c.text_secondary, marginTop: space.md }]}>
          Could not load history.
        </Text>
      </ScrollView>
    )
  }

  const grouped = {
    completed: tasks.filter((t) => t.status === 'completed'),
    active: tasks.filter((t) => t.status === 'open' || t.status === 'assigned'),
    other: tasks.filter((t) => !['completed', 'open', 'assigned'].includes(t.status ?? '')),
  }

  return (
    <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.content}>
      <GlassCard>
        <Text style={[styles.eyebrow, { color: c.accent_primary }]}>Your activity</Text>
        <Text style={[typeStyles.title, { color: c.text_primary }]}>History</Text>
        <Text style={{ color: c.text_secondary, fontSize: 14, lineHeight: 21 }}>
          Review all your past and current tasks.
        </Text>
      </GlassCard>

      {(['completed', 'active', 'other'] as const).map((group) => {
        const items = grouped[group]
        if (items.length === 0) return null
        return (
          <View key={group} style={{ gap: space.sm }}>
            <Text style={[styles.groupLabel, { color: c.text_secondary }]}>
              {group === 'completed' ? '✓ Completed' : group === 'active' ? '◉ Active' : '○ Other'}
            </Text>
            {items.map((task) => (
              <HistoryItem key={task.id} task={task} />
            ))}
          </View>
        )
      })}

      {tasks.length === 0 && (
        <GlassCard style={{ alignItems: 'center', padding: space.xl }}>
          <Ionicons name="time-outline" size={48} color={c.text_secondary} />
          <Text style={[typeStyles.body, { color: c.text_secondary, marginTop: space.md, textAlign: 'center' }]}>
            No history yet.
          </Text>
        </GlassCard>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: space.xl, gap: space.lg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: space.xl },
  eyebrow: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0 },
  groupLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0 },
  item: { padding: space.lg, borderRadius: radius.card, borderWidth: 1, gap: space.sm },
  itemTop: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  itemMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cta: { paddingHorizontal: space.xl, paddingVertical: space.md, borderRadius: radius.button },
  ctaText: { color: '#fff', fontWeight: '700', fontSize: 15 },
})
