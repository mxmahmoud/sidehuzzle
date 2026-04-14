import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { GlassCard } from '@/components/GlassCard'
import { useThemeColors } from '@/theme/useThemeColors'
import { radius, space, type as typeStyles } from '@/theme/tokens'

export default function DeletePostConfirmationRoute() {
  const c = useThemeColors()
  const router = useRouter()

  function handleDelete() {
    Alert.alert(
      'Delete post?',
      'This action cannot be undone. Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Deleted', 'Post has been deleted.')
            router.back()
          },
        },
      ]
    )
  }

  return (
    <View style={[styles.root, { backgroundColor: c.surface_secondary }]}>
      <GlassCard style={{ alignItems: 'center', padding: space.xl }}>
        <View style={[styles.iconWrap, { backgroundColor: '#ef444422' }]}>
          <Ionicons name="trash-outline" size={48} color="#ef4444" />
        </View>
        <Text style={[typeStyles.title, { color: c.text_primary, marginTop: space.lg, textAlign: 'center' }]}>
          Delete this post?
        </Text>
        <Text style={{ color: c.text_secondary, fontSize: 14, textAlign: 'center', lineHeight: 21, marginTop: space.sm }}>
          This will permanently remove the post and all associated data. This action cannot be undone.
        </Text>
      </GlassCard>

      <View style={styles.actions}>
        <Pressable
          style={[styles.cancelBtn, { borderColor: c.border_subtle }]}
          onPress={() => router.back()}
          accessibilityRole="button"
        >
          <Text style={{ color: c.text_primary, fontWeight: '600', fontSize: 15 }}>Cancel</Text>
        </Pressable>
        <Pressable
          style={[styles.deleteBtn, { backgroundColor: '#ef4444' }]}
          onPress={handleDelete}
          accessibilityRole="button"
        >
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Delete</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'center', padding: space.xl, gap: space.lg },
  iconWrap: { width: 80, height: 80, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  actions: { flexDirection: 'row', gap: space.md },
  cancelBtn: { flex: 1, borderWidth: 1.5, borderRadius: radius.button, paddingVertical: space.md, alignItems: 'center' },
  deleteBtn: { flex: 1, borderRadius: radius.button, paddingVertical: space.md, alignItems: 'center' },
})
