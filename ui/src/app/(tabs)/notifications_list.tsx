import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { GuestGate } from '@/components/GuestGate'
import { useNotifications, useMarkRead } from '@/domain/queries/useNotifications'
import { useThemeColors } from '@/theme/useThemeColors'
import { radius, space, type as typeStyles } from '@/theme/tokens'

const KIND_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  info: 'information-circle',
  success: 'checkmark-circle',
  warning: 'warning',
  error: 'alert-circle',
  message: 'chatbubble',
  offer: 'pricetag',
  review: 'star',
  system: 'cog',
}

function timeAgo(iso: string | null): string {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  return `${Math.floor(hr / 24)}d ago`
}

function NotificationsContent() {
  const c = useThemeColors()
  const router = useRouter()
  const { data: notifications, isLoading, isError } = useNotifications()
  const markRead = useMarkRead()

  if (isLoading) {
    return (
      <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.center}>
        <Text style={{ color: c.text_secondary }}>Loading…</Text>
      </ScrollView>
    )
  }

  if (isError || !notifications) {
    return (
      <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.center}>
        <Ionicons name="alert-circle" size={48} color={c.text_secondary} />
        <Text style={{ color: c.text_secondary, textAlign: 'center', marginTop: space.md }}>
          Could not load notifications.{'\n'}Please try again later.
        </Text>
      </ScrollView>
    )
  }

  return (
    <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.content}>
      <View style={[styles.hero, { backgroundColor: c.surface_primary, borderColor: c.border_subtle }]}>
        <Text style={[styles.eyebrow, { color: c.accent_primary }]}>Updates</Text>
        <Text style={[typeStyles.title, { color: c.text_primary }]}>Notifications</Text>
        <Text style={{ color: c.text_secondary, fontSize: 14, lineHeight: 21 }}>
          Track messages, offers, reviews, and activity without losing your place in the marketplace.
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: c.text_secondary }]}>Recent activity</Text>
        <Text style={{ color: c.text_secondary, fontSize: 13 }}>{notifications.length} items</Text>
      </View>

      {notifications.length === 0 ? (
        <View style={[styles.emptyState, { backgroundColor: c.surface_primary, borderColor: c.border_subtle }]}>
          <Ionicons name="notifications-outline" size={48} color={c.text_secondary} />
          <Text style={[typeStyles.subtitle, { color: c.text_secondary, textAlign: 'center', marginTop: space.md }]}>
            No notifications yet
          </Text>
          <Text style={{ color: c.text_secondary, fontSize: 13, textAlign: 'center', marginTop: space.xs }}>
            We'll notify you when something happens.
          </Text>
        </View>
      ) : (
        notifications.map((n) => {
          const icon = KIND_ICONS[n.kind] ?? 'information-circle'
          return (
            <Pressable
              key={n.id}
              onPress={() => {
                if (!n.read) markRead.mutate(n.id)
                if (n.link) router.push(n.link as any)
              }}
              style={[
                styles.notifRow,
                { backgroundColor: n.read ? c.surface_elevated : c.surface_selected, borderColor: c.border_subtle },
              ]}
              accessibilityRole="button"
            >
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: n.read ? c.surface_primary : 'rgba(216,180,106,0.15)' },
                ]}
              >
                <Ionicons name={icon} size={18} color={n.read ? c.text_secondary : c.accent_primary} />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <View style={styles.rowTop}>
                  <Text style={[typeStyles.subtitle, { color: c.text_primary, flex: 1 }]} numberOfLines={1}>
                    {n.title}
                  </Text>
                  <Text style={{ color: c.text_secondary, fontSize: 12 }}>{timeAgo(n.created_at)}</Text>
                </View>
                <Text style={{ color: c.text_secondary, fontSize: 13, lineHeight: 19 }} numberOfLines={2}>
                  {n.message}
                </Text>
                {!n.read && (
                  <Text style={{ color: c.accent_primary, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0 }}>
                    New
                  </Text>
                )}
              </View>
            </Pressable>
          )
        })
      )}
    </ScrollView>
  )
}

export default function NotificationsListRoute() {
  return (
    <GuestGate>
      <NotificationsContent />
    </GuestGate>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { width: '100%', maxWidth: 920, alignSelf: 'center', padding: space.xl, gap: space.md },
  center: { flex: 1, width: '100%', maxWidth: 920, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', padding: space.xl },
  hero: { gap: space.sm, padding: space.lg, borderRadius: radius.card, borderWidth: 1 },
  eyebrow: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: space.sm },
  sectionTitle: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0 },
  notifRow: { flexDirection: 'row', alignItems: 'flex-start', gap: space.md, padding: space.lg, borderRadius: radius.card, borderWidth: 1 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  rowTop: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  emptyState: { padding: space.xl, borderRadius: radius.card, borderWidth: 1, alignItems: 'center' },
})
