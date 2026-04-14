import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { GlassCard } from '@/components/GlassCard'
import { useThemeColors } from '@/theme/useThemeColors'
import { radius, space, type as typeStyles } from '@/theme/tokens'

const STATUS = {
  plan: 'Pro',
  renews: 'March 14, 2026',
  amount: '$12.00',
  status: 'Active',
}

export default function MembershipStatusRoute() {
  const c = useThemeColors()
  const router = useRouter()

  return (
    <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.content}>
      <GlassCard style={{ alignItems: 'center' }}>
        <View style={[styles.iconWrap, { backgroundColor: '#3D5AFE22' }]}>
          <Ionicons name="diamond" size={40} color="#3D5AFE" />
        </View>
        <Text style={[typeStyles.title, { color: c.text_primary, marginTop: space.md }]}>Pro Member</Text>
        <View style={[styles.badge, { backgroundColor: '#3D5AFE' }]}>
          <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800', textTransform: 'uppercase' }}>Active</Text>
        </View>
      </GlassCard>

      <GlassCard>
        <Text style={[styles.label, { color: c.text_secondary }]}>Current plan</Text>
        <Text style={{ color: c.text_primary, fontSize: 16, fontWeight: '600' }}>{STATUS.plan}</Text>
      </GlassCard>

      <GlassCard>
        <View style={[styles.row, { borderBottomColor: c.border_subtle }]}>
          <Text style={{ color: c.text_secondary, fontSize: 14 }}>Billing amount</Text>
          <Text style={{ color: c.text_primary, fontSize: 14, fontWeight: '600' }}>{STATUS.amount}/month</Text>
        </View>
        <View style={[styles.row, { borderBottomColor: c.border_subtle }]}>
          <Text style={{ color: c.text_secondary, fontSize: 14 }}>Next renewal</Text>
          <Text style={{ color: c.text_primary, fontSize: 14 }}>{STATUS.renews}</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ color: c.text_secondary, fontSize: 14 }}>Payment method</Text>
          <Text style={{ color: c.text_primary, fontSize: 14 }}>•••• 4242</Text>
        </View>
      </GlassCard>

      <View style={styles.actions}>
        <GlassCard style={styles.actionCard}>
          <Ionicons name="swap-horizontal" size={22} color={c.accent_primary} />
          <Text style={[styles.actionText, { color: c.text_primary }]}>Change plan</Text>
          <Ionicons name="chevron-forward" size={16} color={c.text_secondary} />
        </GlassCard>
        <GlassCard style={styles.actionCard}>
          <Ionicons name="card-outline" size={22} color={c.accent_primary} />
          <Text style={[styles.actionText, { color: c.text_primary }]}>Manage payment</Text>
          <Ionicons name="chevron-forward" size={16} color={c.text_secondary} />
        </GlassCard>
        <GlassCard style={styles.actionCard}>
          <Ionicons name="close-circle-outline" size={22} color="#ef4444" />
          <Text style={[styles.actionText, { color: '#ef4444' }]}>Cancel subscription</Text>
          <Ionicons name="chevron-forward" size={16} color={c.text_secondary} />
        </GlassCard>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: space.xl, gap: space.lg },
  iconWrap: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  badge: { marginTop: space.sm, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  label: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0, marginBottom: space.xs },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  actions: { gap: space.md },
  actionCard: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  actionText: { flex: 1, fontSize: 15, fontWeight: '500' },
})
