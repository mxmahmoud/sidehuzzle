import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { GlassCard } from '@/components/GlassCard'
import { useThemeColors } from '@/theme/useThemeColors'
import { space, type as typeStyles } from '@/theme/tokens'

const FILTERS = ['Most recent', 'Highest rated', 'Lowest rated', 'Most helpful']

export default function ReviewFilterRoute() {
  const c = useThemeColors()
  const router = useRouter()
  return (
    <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.content}>
      <GlassCard>
        <Text style={[styles.eyebrow, { color: c.accent_primary }]}>Reviews</Text>
        <Text style={[typeStyles.title, { color: c.text_primary }]}>Filter reviews</Text>
      </GlassCard>
      {FILTERS.map((filter, i) => (
        <GlassCard key={filter}>
          <View style={styles.row}>
            <Text style={{ color: c.text_primary, fontSize: 15 }}>{filter}</Text>
            {i === 0 && <Ionicons name="checkmark" size={20} color={c.accent_primary} />}
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
