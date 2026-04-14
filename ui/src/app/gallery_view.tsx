import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { GlassCard } from '@/components/GlassCard'
import { useThemeColors } from '@/theme/useThemeColors'
import { radius, space, type as typeStyles } from '@/theme/tokens'

const TILES = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  color: ['#3D5AFE22', '#D8B46A22', '#4CAF5022', '#FF6B5522', '#9C27B022', '#00BCD422', '#FF980022', '#79554822', '#607D8B22'][i],
  iconColor: ['#3D5AFE', '#D8B46A', '#4CAF50', '#FF6B55', '#9C27B0', '#00BCD4', '#FF9800', '#795548', '#607D8B'][i],
}))

export default function GalleryViewRoute() {
  const c = useThemeColors()
  const router = useRouter()

  return (
    <View style={[styles.root, { backgroundColor: c.surface_secondary }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: c.surface_primary, borderBottomColor: c.border_subtle }]}>
        <Pressable onPress={() => router.back()} accessibilityRole="button">
          <Ionicons name="close" size={24} color={c.text_primary} />
        </Pressable>
        <Text style={[typeStyles.subtitle, { color: c.text_primary }]}>Gallery</Text>
        <Text style={{ color: c.text_secondary, fontSize: 13 }}>{TILES.length} photos</Text>
      </View>

      {/* Grid */}
      <ScrollView contentContainerStyle={styles.grid}>
        {TILES.map((tile) => (
          <Pressable
            key={tile.id}
            style={[styles.tile, { backgroundColor: tile.color }]}
            onPress={() => Alert.alert(`Photo ${tile.id}`, 'Full-size photo viewer would open here.')}
            accessibilityRole="button"
          >
            <Ionicons name="image-outline" size={32} color={tile.iconColor} />
            <Text style={{ color: tile.iconColor, fontSize: 11, fontWeight: '600', marginTop: 4 }}>Photo {tile.id}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Add button */}
      <GlassCard style={styles.addBar}>
        <Pressable
          style={[styles.addBtn, { backgroundColor: c.accent_primary }]}
          onPress={() => Alert.alert('Add photos', 'Photo picker would open here.')}
          accessibilityRole="button"
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>Add photos</Text>
        </Pressable>
      </GlassCard>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: space.lg, borderBottomWidth: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: space.sm, gap: 2 },
  tile: { width: '33.33%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.1)' },
  addBar: { padding: space.lg, borderTopWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: space.md, borderRadius: radius.button },
})
