import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { GlassCard } from '@/components/GlassCard'
import { useThemeColors } from '@/theme/useThemeColors'
import { space, type as typeStyles } from '@/theme/tokens'

export default function ReportReasonSelectionRoute() {
  const c = useThemeColors()
  const reasons = ['Spam', 'Harassment or hate speech', 'Fake profile', 'Inappropriate content', 'Safety concern', 'Other']
  return (
    <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.content}>
      <GlassCard>
        <Text style={[styles.eyebrow, { color: c.accent_primary }]}>Report</Text>
        <Text style={[typeStyles.title, { color: c.text_primary }]}>What type of issue?</Text>
      </GlassCard>
      {reasons.map((reason) => (
        <GlassCard key={reason}>
          <View style={styles.row}>
            <Text style={{ color: c.text_primary, fontSize: 15 }}>{reason}</Text>
            <Ionicons name="chevron-forward" size={18} color={c.text_secondary} />
          </View>
        </GlassCard>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: space.xl, gap: space.md },
  eyebrow: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
})
