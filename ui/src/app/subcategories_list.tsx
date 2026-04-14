import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { GlassCard } from '@/components/GlassCard'
import { useThemeColors } from '@/theme/useThemeColors'
import { space, type as typeStyles } from '@/theme/tokens'

const SUBCATS = [
  'Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Cleaning',
  'Moving', 'Gardening', 'Pet care', 'Tutoring', 'Photography',
]

export default function SubcategoriesListRoute() {
  const c = useThemeColors()
  const router = useRouter()
  return (
    <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.content}>
      <GlassCard>
        <Text style={[styles.eyebrow, { color: c.accent_primary }]}>Categories</Text>
        <Text style={[typeStyles.title, { color: c.text_primary }]}>Subcategories</Text>
      </GlassCard>
      {SUBCATS.map((sub) => (
        <GlassCard key={sub}>
          <View style={styles.row}>
            <Text style={{ color: c.text_primary, fontSize: 15 }}>{sub}</Text>
            <Ionicons name="chevron-forward" size={18} color={c.text_secondary} />
          </View>
        </GlassCard>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: space.xl, gap: space.sm },
  eyebrow: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
})
