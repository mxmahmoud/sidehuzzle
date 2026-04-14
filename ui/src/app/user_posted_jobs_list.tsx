import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { GlassCard } from '@/components/GlassCard'
import { useThemeColors } from '@/theme/useThemeColors'
import { space, type as typeStyles } from '@/theme/tokens'

export default function UserPostedJobsListRoute() {
  const c = useThemeColors()
  const router = useRouter()
  return (
    <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.content}>
      <GlassCard>
        <Text style={[styles.eyebrow, { color: c.accent_primary }]}>Profile</Text>
        <Text style={[typeStyles.title, { color: c.text_primary }]}>Posted tasks</Text>
      </GlassCard>
      <GlassCard>
        <View style={styles.empty}>
          <Ionicons name="briefcase-outline" size={48} color={c.text_secondary} />
          <Text style={{ color: c.text_secondary, fontSize: 14, marginTop: space.sm }}>No tasks posted yet.</Text>
        </View>
      </GlassCard>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: space.xl, gap: space.lg },
  eyebrow: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0 },
  empty: { alignItems: 'center', paddingVertical: space.xl },
})
