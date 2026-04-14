import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { GlassCard } from '@/components/GlassCard'
import { useSessionStore } from '@/stores/sessionStore'
import { useThemeColors } from '@/theme/useThemeColors'
import { radius, space, type as typeStyles } from '@/theme/tokens'

const SETTINGS_ROWS = [
  { id: 'profile', label: 'Edit profile info', icon: 'person-outline' as const, route: '/account_info_edit' },
  { id: 'password', label: 'Change password', icon: 'lock-closed-outline' as const, route: '/change_password_form' },
  { id: 'phone', label: 'Phone verification', icon: 'phone-portrait-outline' as const, route: '/phone_verification' },
  { id: 'membership', label: 'Membership status', icon: 'card-outline' as const, route: '/membership_status' },
  { id: 'payments', label: 'Payment methods', icon: 'wallet-outline' as const, route: '/payment_cards_list' },
  { id: 'notifications', label: 'Notification preferences', icon: 'notifications-outline' as const, route: '/settings_notifications' },
  { id: 'privacy', label: 'Privacy settings', icon: 'shield-outline' as const, route: '/settings_privacy' },
  { id: 'data', label: 'Data & storage', icon: 'server-outline' as const, route: '/settings_data' },
  { id: 'social', label: 'Social links', icon: 'globe-outline' as const, route: '/social_links' },
]

function SettingRow({ label, icon, onPress }: { label: string; icon: keyof typeof Ionicons.glyphMap; onPress: () => void }) {
  const c = useThemeColors()
  return (
    <Pressable
      style={[styles.row, { borderBottomColor: c.border_subtle }]}
      onPress={onPress}
      accessibilityRole="button"
    >
      <Ionicons name={icon} size={20} color={c.accent_primary} />
      <Text style={[typeStyles.body, { color: c.text_primary, flex: 1, marginLeft: space.md }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={c.text_secondary} />
    </Pressable>
  )
}

export default function AccountSettingsRoute() {
  const c = useThemeColors()
  const router = useRouter()
  const user = useSessionStore((s) => s.user)

  return (
    <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.content}>
      <GlassCard>
        <Text style={[styles.eyebrow, { color: c.accent_primary }]}>Your account</Text>
        <Text style={[typeStyles.title, { color: c.text_primary }]}>Account settings</Text>
        <Text style={{ color: c.text_secondary, fontSize: 14, lineHeight: 21 }}>
          Manage your account, security, and preferences.
        </Text>
      </GlassCard>

      <GlassCard>
        {SETTINGS_ROWS.map((row, i) => (
          <SettingRow key={row.id} {...row} onPress={() => router.push(row.route as any)} />
        ))}
      </GlassCard>

      <GlassCard>
        <Pressable
          style={[styles.dangerRow, { borderColor: '#ef4444' }]}
          onPress={() => Alert.alert('Deactivate', 'Please contact support to deactivate your account.')}
          accessibilityRole="button"
        >
          <Ionicons name="warning-outline" size={20} color="#ef4444" />
          <Text style={[typeStyles.body, { color: '#ef4444', flex: 1, marginLeft: space.md }]}>
            Deactivate account
          </Text>
        </Pressable>
      </GlassCard>

      {user && (
        <Text style={{ color: c.text_secondary, fontSize: 12, textAlign: 'center' }}>
          Signed in as {user.email}
        </Text>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: space.xl, gap: space.lg },
  eyebrow: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: space.md, borderBottomWidth: 1 },
  dangerRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: radius.card, padding: space.md },
})
