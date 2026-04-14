import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { GlassCard } from '@/components/GlassCard'
import { useThemeColors } from '@/theme/useThemeColors'
import { space, type as typeStyles } from '@/theme/tokens'

const OPTIONS = ['Most relevant', 'Newest first', 'Oldest first', 'Highest rated', 'Lowest rated']

export default function SortByModalRoute() {
  const c = useThemeColors()
  const router = useRouter()
  return (
    <View style={[styles.root, { backgroundColor: c.surface_secondary }]}>
      <View style={[styles.header, { borderBottomColor: c.border_subtle }]}>
        <Text style={[typeStyles.subtitle, { color: c.text_primary }]}>Sort by</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {OPTIONS.map((option, i) => (
          <View key={option} style={[styles.row, { borderBottomColor: c.border_subtle }]}>
            <Text style={{ color: c.text_primary, fontSize: 16 }}>{option}</Text>
            {i === 0 && <Ionicons name="checkmark" size={22} color={c.accent_primary} />}
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { padding: space.lg, borderBottomWidth: 1 },
  content: { padding: space.lg },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: space.md, borderBottomWidth: 1 },
})
