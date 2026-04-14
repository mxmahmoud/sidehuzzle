import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import { GlassCard } from '@/components/GlassCard'
import { useThemeColors } from '@/theme/useThemeColors'
import { radius, space, type as typeStyles } from '@/theme/tokens'

export default function UnfollowConfirmationModalRoute() {
  const c = useThemeColors()
  const router = useRouter()
  return (
    <View style={[styles.root, { backgroundColor: c.surface_secondary }]}>
      <GlassCard style={{ alignItems: 'center', padding: space.xl }}>
        <View style={[styles.iconWrap, { backgroundColor: '#FF6B5522' }]}>
          <Ionicons name="person-remove" size={40} color="#FF6B55" />
        </View>
        <Text style={[typeStyles.title, { color: c.text_primary, marginTop: space.lg, textAlign: 'center' }]}>
          Unfollow this user?
        </Text>
        <Text style={{ color: c.text_secondary, fontSize: 14, textAlign: 'center', lineHeight: 21 }}>
          You'll stop seeing their posts in your feed.
        </Text>
      </GlassCard>
      <View style={styles.actions}>
        <Pressable
          style={[styles.btn, { borderColor: c.border_subtle }]}
          onPress={() => router.back()}
          accessibilityRole="button"
        >
          <Text style={{ color: c.text_primary, fontWeight: '600', fontSize: 15 }}>Cancel</Text>
        </Pressable>
        <Pressable
          style={[styles.btn, { backgroundColor: '#FF6B55' }]}
          onPress={() => Alert.alert('Unfollowed', 'You have unfollowed this user.')}
          accessibilityRole="button"
        >
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Unfollow</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'center', padding: space.xl, gap: space.lg },
  iconWrap: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  actions: { flexDirection: 'row', gap: space.md },
  btn: { flex: 1, borderRadius: radius.button, paddingVertical: space.md, alignItems: 'center' },
})
