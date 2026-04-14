import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import { GlassCard } from '@/components/GlassCard'
import { useThemeColors } from '@/theme/useThemeColors'
import { radius, space } from '@/theme/tokens'

export default function PostActionsSheetRoute() {
  const c = useThemeColors()
  const router = useRouter()

  return (
    <View style={[styles.root, { backgroundColor: c.surface_secondary }]}>
      <View style={[styles.handle, { backgroundColor: c.border_subtle }]} />
      <View style={styles.actions}>
        {[
          { icon: 'share-outline', label: 'Share post', color: c.text_primary },
          { icon: 'flag-outline', label: 'Report post', color: '#ef4444' },
          { icon: 'bookmark-outline', label: 'Save post', color: c.text_primary },
          { icon: 'close-circle-outline', label: 'Hide this', color: c.text_secondary },
        ].map(({ icon, label, color }) => (
          <Pressable
            key={label}
            style={styles.row}
            onPress={() => Alert.alert(label, `Action: ${label}`)}
            accessibilityRole="button"
          >
            <Ionicons name={icon as any} size={22} color={color} />
            <Text style={[styles.rowText, { color }]}>{label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: space.lg, paddingTop: space.sm },
  handle: { width: 36, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: space.lg },
  actions: { gap: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.md },
  rowText: { fontSize: 16 },
})
