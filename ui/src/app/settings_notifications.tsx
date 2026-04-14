import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native'
import { GlassCard } from '@/components/GlassCard'
import { useSessionStore } from '@/stores/sessionStore'
import { useThemeColors } from '@/theme/useThemeColors'
import { radius, space, type as typeStyles } from '@/theme/tokens'

const TOGGLES = [
  { id: 'push_task_assigned', label: 'Task assigned', description: 'When a task is assigned to you', icon: 'checkmark-circle-outline' as const },
  { id: 'push_task_near', label: 'Nearby tasks', description: 'When tasks match your expertise nearby', icon: 'location-outline' as const },
  { id: 'push_message', label: 'Messages', description: 'When someone sends you a message', icon: 'chatbubbles-outline' as const },
  { id: 'push_offer', label: 'Offers', description: 'When you receive an offer on your task', icon: 'cash-outline' as const },
  { id: 'push_review', label: 'Reviews', description: 'When you receive a new review', icon: 'star-outline' as const },
  { id: 'email_digest', label: 'Email digest', description: 'Weekly summary of activity', icon: 'mail-outline' as const },
]

function ToggleRow({ label, description, icon, value, onValueChange }: { label: string; description: string; icon: keyof typeof Ionicons.glyphMap; value: boolean; onValueChange: (v: boolean) => void }) {
  const c = useThemeColors()
  return (
    <View style={[styles.row, { borderBottomColor: c.border_subtle }]}>
      <View style={[styles.rowIcon, { backgroundColor: c.accent_primary + '18' }]}>
        <Ionicons name={icon} size={18} color={c.accent_primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[typeStyles.body, { color: c.text_primary, fontWeight: '600' }]}>{label}</Text>
        <Text style={{ color: c.text_secondary, fontSize: 12, lineHeight: 17 }}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ true: c.accent_primary + '80', false: c.border_subtle }}
        thumbColor={value ? c.accent_primary : '#f4f3f4'}
      />
    </View>
  )
}

export default function SettingsNotificationsRoute() {
  const c = useThemeColors()
  const user = useSessionStore((s) => s.user)

  const [toggles, setToggles] = useState<Record<string, boolean>>({
    push_task_assigned: true,
    push_task_near: true,
    push_message: true,
    push_offer: true,
    push_review: false,
    email_digest: false,
  })

  function handleSave() {
    Alert.alert('Saved', 'Notification preferences updated.')
  }

  return (
    <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.content}>
      <GlassCard>
        <Text style={[styles.eyebrow, { color: c.accent_primary }]}>Control your alerts</Text>
        <Text style={[typeStyles.title, { color: c.text_primary }]}>Notifications</Text>
        <Text style={{ color: c.text_secondary, fontSize: 14, lineHeight: 21 }}>
          Choose how and when you want to be notified about activity on Sidehuzle.
        </Text>
      </GlassCard>

      <GlassCard>
        <Text style={[styles.sectionTitle, { color: c.text_secondary }]}>Push notifications</Text>
        {TOGGLES.slice(0, 5).map((t) => (
          <ToggleRow
            key={t.id}
            {...t}
            value={toggles[t.id]}
            onValueChange={(v) => setToggles((prev) => ({ ...prev, [t.id]: v }))}
          />
        ))}
      </GlassCard>

      <GlassCard>
        <Text style={[styles.sectionTitle, { color: c.text_secondary }]}>Email</Text>
        <ToggleRow
          {...TOGGLES[5]}
          value={toggles['email_digest']}
          onValueChange={(v) => setToggles((prev) => ({ ...prev, email_digest: v }))}
        />
      </GlassCard>

      {!user && (
        <GlassCard>
          <View style={styles.signInRow}>
            <Ionicons name="alert-circle-outline" size={20} color={c.text_secondary} />
            <Text style={{ color: c.text_secondary, fontSize: 13, flex: 1, marginLeft: space.sm }}>
              Sign in to save your notification preferences.
            </Text>
          </View>
        </GlassCard>
      )}

      <Pressable
        style={[styles.saveBtn, { backgroundColor: c.accent_primary }]}
        onPress={handleSave}
        accessibilityRole="button"
      >
        <Text style={styles.saveText}>Save preferences</Text>
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: space.xl, gap: space.lg },
  eyebrow: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0 },
  sectionTitle: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0, marginBottom: space.md },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: space.md, borderBottomWidth: 1 },
  rowIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: space.md },
  signInRow: { flexDirection: 'row', alignItems: 'center' },
  saveBtn: { paddingVertical: space.md, borderRadius: radius.button, alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: '700', fontSize: 16 },
})
