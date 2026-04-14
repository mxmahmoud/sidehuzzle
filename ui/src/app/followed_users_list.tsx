import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { GlassCard } from '@/components/GlassCard'
import { useThemeColors } from '@/theme/useThemeColors'
import { radius, space, type as typeStyles } from '@/theme/tokens'

const MOCK_USERS = [
  { id: 1, name: 'Sarah Miller', handle: '@sarahm', tasks: 28 },
  { id: 2, name: 'James Chen', handle: '@jamesc', tasks: 15 },
  { id: 3, name: 'Alex Rivera', handle: '@alexr', tasks: 42 },
  { id: 4, name: 'Maria Santos', handle: '@mariasan', tasks: 9 },
]

export default function FollowedUsersListRoute() {
  const c = useThemeColors()
  const router = useRouter()

  function handleUnfollow(id: number, name: string) {
    Alert.alert('Unfollow', `Unfollow ${name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Unfollow', style: 'destructive', onPress: () => Alert.alert('Unfollowed', `You unfollowed ${name}.`) },
    ])
  }

  return (
    <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.content}>
      <GlassCard>
        <Text style={[styles.eyebrow, { color: c.accent_primary }]}>Social</Text>
        <Text style={[typeStyles.title, { color: c.text_primary }]}>Followed users</Text>
        <Text style={{ color: c.text_secondary, fontSize: 14, lineHeight: 21 }}>
          {MOCK_USERS.length} users you're following.
        </Text>
      </GlassCard>

      {MOCK_USERS.map((user) => (
        <GlassCard key={user.id}>
          <Pressable
            style={styles.userRow}
            onPress={() => router.push(`/user_profile_external?id=${user.id}`)}
            accessibilityRole="button"
          >
            <View style={[styles.avatar, { backgroundColor: c.accent_primary + '22' }]}>
              <Ionicons name="person" size={22} color={c.accent_primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[typeStyles.body, { color: c.text_primary, fontWeight: '600' }]}>{user.name}</Text>
              <Text style={{ color: c.text_secondary, fontSize: 12 }}>{user.handle}</Text>
              <Text style={{ color: c.text_secondary, fontSize: 11 }}>{user.tasks} tasks posted</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={c.text_secondary} />
          </Pressable>
          <Pressable
            style={[styles.unfollowBtn, { borderColor: c.border_subtle }]}
            onPress={() => handleUnfollow(user.id, user.name)}
            accessibilityRole="button"
          >
            <Ionicons name="person-remove-outline" size={16} color={c.text_secondary} />
            <Text style={{ color: c.text_secondary, fontSize: 13, fontWeight: '600', marginLeft: 6 }}>Unfollow</Text>
          </Pressable>
        </GlassCard>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: space.xl, gap: space.lg },
  eyebrow: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0 },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  avatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  unfollowBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: radius.button, paddingVertical: 8, marginTop: space.md },
})
