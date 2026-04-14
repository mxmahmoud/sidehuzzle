import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { GlassCard } from '@/components/GlassCard'
import { useThemeColors } from '@/theme/useThemeColors'
import { space, type as typeStyles } from '@/theme/tokens'

export default function ReportMessageInputRoute() {
  const c = useThemeColors()
  return (
    <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.content}>
      <GlassCard>
        <Text style={[styles.eyebrow, { color: c.accent_primary }]}>Report</Text>
        <Text style={[typeStyles.title, { color: c.text_primary }]}>Additional details</Text>
        <Text style={{ color: c.text_secondary, fontSize: 14, lineHeight: 21 }}>
          Please provide any additional context that will help us review this report.
        </Text>
      </GlassCard>
      <GlassCard>
        <Text style={[styles.label, { color: c.text_secondary }]}>Details</Text>
        <Text style={{ color: c.text_secondary, fontSize: 14 }}>Type your message here…</Text>
      </GlassCard>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: space.xl, gap: space.lg },
  eyebrow: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0 },
  label: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0, marginBottom: space.xs },
})
