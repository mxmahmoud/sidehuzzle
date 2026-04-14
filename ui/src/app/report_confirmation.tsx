import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { GlassCard } from '@/components/GlassCard'
import { useThemeColors } from '@/theme/useThemeColors'
import { space, type as typeStyles } from '@/theme/tokens'

export default function ReportConfirmationRoute() {
  const c = useThemeColors()
  const router = useRouter()
  return (
    <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.content}>
      <GlassCard style={{ alignItems: 'center' }}>
        <View style={[styles.iconWrap, { backgroundColor: '#4CAF5022' }]}>
          <Ionicons name="checkmark-circle" size={48} color="#4CAF50" />
        </View>
        <Text style={[typeStyles.title, { color: c.text_primary, marginTop: space.lg }]}>Report submitted</Text>
        <Text style={{ color: c.text_secondary, fontSize: 14, textAlign: 'center', lineHeight: 21 }}>
          Thank you for helping keep Sidehuzle safe. We'll review your report and take action if needed.
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
