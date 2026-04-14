import { Ionicons } from '@expo/vector-icons'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { GlassCard } from '@/components/GlassCard'
import { useThemeColors } from '@/theme/useThemeColors'
import { radius, space, type as typeStyles } from '@/theme/tokens'

export default function PaymentMethodsEmptyRoute() {
  const c = useThemeColors()
  return (
    <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.content}>
      <GlassCard style={{ alignItems: 'center' }}>
        <View style={[styles.iconWrap, { backgroundColor: c.accent_primary + '22' }]}>
          <Ionicons name="card-outline" size={48} color={c.accent_primary} />
        </View>
        <Text style={[typeStyles.title, { color: c.text_primary, marginTop: space.lg }]}>No payment methods</Text>
        <Text style={{ color: c.text_secondary, fontSize: 14, textAlign: 'center', lineHeight: 21 }}>
          Add a card to start posting tasks and subscribing to plans.
        </Text>
      </GlassCard>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: space.xl, gap: space.lg },
  iconWrap: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
})
