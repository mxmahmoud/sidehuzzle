import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { GlassCard } from '@/components/GlassCard'
import { useThemeColors } from '@/theme/useThemeColors'
import { radius, space, type as typeStyles } from '@/theme/tokens'

const MOCK_APPLICANTS = [
  { id: 1, name: 'Carlos Rivera', handle: '@carlosr', rating: 4.8, tasks: 34, icon: 'person' },
  { id: 2, name: 'Sarah Miller', handle: '@sarahm', rating: 4.9, tasks: 61, icon: 'person' },
  { id: 3, name: 'James Chen', handle: '@jamesc', rating: 4.5, tasks: 18, icon: 'person' },
  { id: 4, name: 'Alex Kim', handle: '@alexk', rating: 4.7, tasks: 29, icon: 'person' },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Ionicons
          key={n}
          name={n <= Math.round(rating) ? 'star' : 'star-outline'}
          size={12}
          color={n <= Math.round(rating) ? '#FFB400' : '#9E9E9E'}
        />
      ))}
      <Text style={{ color: '#9E9E9E', fontSize: 12, marginLeft: 4 }}>{rating}</Text>
    </View>
  )
}

export default function ApplicantsListRoute() {
  const c = useThemeColors()
  const router = useRouter()

  function handleAccept(id: number, name: string) {
    Alert.alert('Accepted', `${name} has been notified of your acceptance.`)
  }

  function handleDecline(id: number, name: string) {
    Alert.alert('Declined', `${name} has been notified.`)
  }

  return (
    <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.content}>
      <GlassCard>
        <Text style={[styles.eyebrow, { color: c.accent_primary }]}>Your task</Text>
        <Text style={[typeStyles.title, { color: c.text_primary }]}>Applicants</Text>
        <Text style={{ color: c.text_secondary, fontSize: 14, lineHeight: 21 }}>
          {MOCK_APPLICANTS.length} professionals have applied. Review their profiles and accept someone.
        </Text>
      </GlassCard>

      {MOCK_APPLICANTS.map((applicant) => (
        <GlassCard key={applicant.id}>
          <View style={styles.applicantCard}>
            <View style={[styles.avatar, { backgroundColor: c.accent_primary + '22' }]}>
              <Ionicons name={applicant.icon as 'person'} size={24} color={c.accent_primary} />
            </View>
            <View style={styles.applicantInfo}>
              <Text style={[typeStyles.body, { color: c.text_primary, fontWeight: '700' }]}>{applicant.name}</Text>
              <Text style={{ color: c.text_secondary, fontSize: 12 }}>{applicant.handle}</Text>
              <StarRating rating={applicant.rating} />
              <Text style={{ color: c.text_secondary, fontSize: 11, marginTop: 2 }}>{applicant.tasks} tasks completed</Text>
            </View>
            <Pressable
              style={[styles.profileBtn, { borderColor: c.border_subtle }]}
              onPress={() => router.push(`/user_profile_external?id=${applicant.id}`)}
              accessibilityRole="button"
            >
              <Text style={{ color: c.text_secondary, fontSize: 12 }}>View</Text>
            </Pressable>
          </View>
          <View style={styles.actionRow}>
            <Pressable
              style={[styles.declineBtn, { borderColor: c.border_subtle }]}
              onPress={() => handleDecline(applicant.id, applicant.name)}
              accessibilityRole="button"
            >
              <Text style={{ color: c.text_secondary, fontWeight: '600', fontSize: 14 }}>Decline</Text>
            </Pressable>
            <Pressable
              style={[styles.acceptBtn, { backgroundColor: '#4CAF50' }]}
              onPress={() => handleAccept(applicant.id, applicant.name)}
              accessibilityRole="button"
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>Accept</Text>
            </Pressable>
          </View>
        </GlassCard>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: space.xl, gap: space.lg },
  eyebrow: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0 },
  applicantCard: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  avatar: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  applicantInfo: { flex: 1 },
  stars: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  profileBtn: { borderWidth: 1, borderRadius: radius.button, paddingHorizontal: 12, paddingVertical: 6 },
  actionRow: { flexDirection: 'row', gap: space.md, marginTop: space.md },
  declineBtn: { flex: 1, borderWidth: 1, borderRadius: radius.button, paddingVertical: 10, alignItems: 'center' },
  acceptBtn: { flex: 1, borderRadius: radius.button, paddingVertical: 10, alignItems: 'center' },
})
