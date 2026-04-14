import { Ionicons } from '@expo/vector-icons'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { GlassCard } from '@/components/GlassCard'
import { useThemeColors } from '@/theme/useThemeColors'
import { space, type as typeStyles } from '@/theme/tokens'

export default function PaymentCardAddRoute() {
  const c = useThemeColors()
  return (
    <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.content}>
      <GlassCard style={{ alignItems: 'center' }}>
        <Ionicons name="card" size={48} color={c.accent_primary} />
        <Text style={[typeStyles.title, { color: c.text_primary, marginTop: space.md }]}>Add new card</Text>
        <Text style={{ color: c.text_secondary, fontSize: 14, textAlign: 'center', lineHeight: 21 }}>
          Securely add a credit or debit card to your account.
        </Text>
      </GlassCard>
      <GlassCard>
        <Text style={[styles.label, { color: c.text_secondary }]}>Card number</Text>
        <Text style={{ color: c.text_secondary, fontSize: 14 }}>•••• •••• •••• ••••</Text>
      </GlassCard>
      <GlassCard>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: c.text_secondary }]}>Expiry</Text>
            <Text style={{ color: c.text_secondary, fontSize: 14 }}>MM / YY</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: c.text_secondary }]}>CVC</Text>
            <Text style={{ color: c.text_secondary, fontSize: 14 }}>•••</Text>
          </View>
        </View>
      </GlassCard>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: space.xl, gap: space.lg },
  label: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0, marginBottom: space.xs },
  row: { flexDirection: 'row', gap: space.lg },
})
