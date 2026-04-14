import { Ionicons } from '@expo/vector-icons'
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { GlassCard } from '@/components/GlassCard'
import { useSessionStore } from '@/stores/sessionStore'
import { useThemeColors } from '@/theme/useThemeColors'
import { radius, space, type as typeStyles } from '@/theme/tokens'

const DATA_ITEMS = [
  {
    id: 'tasks',
    label: 'Task history',
    description: 'All tasks you\'ve posted or completed',
    icon: 'clipboard-outline' as const,
    value: '47 tasks',
  },
  {
    id: 'messages',
    label: 'Messages',
    description: 'Your chat history with other users',
    icon: 'chatbubbles-outline' as const,
    value: '128 messages',
  },
  {
    id: 'reviews',
    label: 'Reviews received',
    description: 'Reviews others have left for you',
    icon: 'star-outline' as const,
    value: '12 reviews',
  },
  {
    id: 'payments',
    label: 'Payment history',
    description: 'Transactions and payouts',
    icon: 'card-outline' as const,
    value: 'View history',
  },
]

export default function SettingsDataRoute() {
  const c = useThemeColors()
  const user = useSessionStore((s) => s.user)

  return (
    <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.content}>
      <GlassCard>
        <Text style={[styles.eyebrow, { color: c.accent_primary }]}>Your information</Text>
        <Text style={[typeStyles.title, { color: c.text_primary }]}>Data & storage</Text>
        <Text style={{ color: c.text_secondary, fontSize: 14, lineHeight: 21 }}>
          Review and manage the data associated with your Sidehuzle account.
        </Text>
      </GlassCard>

      {user && (
        <GlassCard>
          <Text style={[styles.sectionTitle, { color: c.text_secondary }]}>Account overview</Text>
          <View style={[styles.accountRow, { borderBottomColor: c.border_subtle }]}>
            <Ionicons name="mail-outline" size={18} color={c.text_secondary} />
            <Text style={[typeStyles.body, { color: c.text_primary, flex: 1, marginLeft: space.md }]}>
              {user.email}
            </Text>
            <View style={[styles.badge, { backgroundColor: '#4CAF5040' }]}>
              <Text style={{ color: '#4CAF50', fontSize: 11, fontWeight: '700' }}>Active</Text>
            </View>
          </View>
          <View style={styles.accountRow}>
            <Ionicons name="calendar-outline" size={18} color={c.text_secondary} />
            <Text style={[typeStyles.body, { color: c.text_secondary, flex: 1, marginLeft: space.md }]}>
              Member since N/A
            </Text>
          </View>
        </GlassCard>
      )}

      <GlassCard>
        <Text style={[styles.sectionTitle, { color: c.text_secondary }]}>Your data</Text>
        {DATA_ITEMS.map((item) => (
          <Pressable
            key={item.id}
            style={[styles.dataRow, { borderBottomColor: c.border_subtle }]}
            onPress={() => Alert.alert(item.label, item.description)}
            accessibilityRole="button"
          >
            <View style={[styles.rowIcon, { backgroundColor: c.accent_primary + '18' }]}>
              <Ionicons name={item.icon} size={18} color={c.accent_primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[typeStyles.body, { color: c.text_primary, fontWeight: '600' }]}>{item.label}</Text>
              <Text style={{ color: c.text_secondary, fontSize: 12 }}>{item.description}</Text>
            </View>
            <Text style={{ color: c.text_secondary, fontSize: 12, marginRight: space.sm }}>{item.value}</Text>
            <Ionicons name="chevron-forward" size={16} color={c.text_secondary} />
          </Pressable>
        ))}
      </GlassCard>

      <GlassCard>
        <Text style={[styles.sectionTitle, { color: c.text_secondary }]}>Storage</Text>
        <View style={styles.storageBar}>
          <View style={[styles.storageUsed, { backgroundColor: c.accent_primary, width: '23%' }]} />
        </View>
        <Text style={{ color: c.text_secondary, fontSize: 12, marginTop: space.sm }}>
          2.3 GB of 10 GB used
        </Text>

        <Pressable
          style={[styles.clearBtn, { borderColor: c.border_subtle, marginTop: space.lg }]}
          onPress={() => Alert.alert('Clear Cache', 'This will remove cached images and data.')}
          accessibilityRole="button"
        >
          <Ionicons name="trash-outline" size={16} color={c.text_secondary} />
          <Text style={{ color: c.text_secondary, fontSize: 14, marginLeft: space.sm }}>Clear cache</Text>
        </Pressable>
      </GlassCard>

      <Pressable
        style={[styles.exportBtn, { borderColor: c.accent_primary }]}
        onPress={() => Alert.alert('Export', 'Preparing your full data export…')}
        accessibilityRole="button"
      >
        <Ionicons name="download-outline" size={18} color={c.accent_primary} />
        <Text style={{ color: c.accent_primary, fontWeight: '700', fontSize: 15, marginLeft: space.sm }}>
          Export all my data
        </Text>
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: space.xl, gap: space.lg },
  eyebrow: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0 },
  sectionTitle: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0, marginBottom: space.md },
  accountRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: space.md, borderBottomWidth: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  dataRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: space.md, borderBottomWidth: 1 },
  rowIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: space.md },
  storageBar: { height: 8, borderRadius: 4, backgroundColor: '#e5e7eb', overflow: 'hidden' },
  storageUsed: { height: 8, borderRadius: 4 },
  clearBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: radius.button, paddingVertical: space.md },
  exportBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderRadius: radius.button, paddingVertical: space.md },
})
