import { Ionicons } from '@expo/vector-icons'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { GlassCard } from '@/components/GlassCard'
import { useThemeColors } from '@/theme/useThemeColors'
import { radius, space, type as typeStyles } from '@/theme/tokens'

export default function PaymentMethodSelectRoute() {
  const c = useThemeColors()
  return (
    <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.content}>
      <GlassCard>
        <Text style={[styles.eyebrow, { color: c.accent_primary }]}>Payments</Text>
        <Text style={[typeStyles.title, { color: c.text_primary }]}>Select payment method</Text>
      </GlassCard>
      <GlassCard>
        <View style={styles.cardRow}>
          <View style={[styles.cardIcon, { backgroundColor: '#1A73E822' }]}>
            <Ionicons name="card" size={24} color="#1A73E8" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: c.text_primary, fontWeight: '600', fontSize: 15 }}>Visa •••• 4242</Text>
            <Text style={{ color: c.text_secondary, fontSize: 12 }}>Default</Text>
          </View>
          <Ionicons name="radio-button-on" size={22} color={c.accent_primary} />
        </View>
      </GlassCard>
      <GlassCard>
        <View style={styles.cardRow}>
          <View style={[styles.cardIcon, { backgroundColor: '#F5A62322' }]}>
            <Ionicons name="card" size={24} color="#F5A623" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: c.text_primary, fontWeight: '600', fontSize: 15 }}>Mastercard •••• 8888</Text>
            <Text style={{ color: c.text_secondary, fontSize: 12 }}>Expires 09/27</Text>
          </View>
          <Ionicons name="radio-button-off" size={22} color={c.text_secondary} />
        </View>
      </GlassCard>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: space.xl, gap: space.lg },
  eyebrow: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  cardIcon: { width: 52, height: 36, borderRadius: radius.button, alignItems: 'center', justifyContent: 'center' },
})
