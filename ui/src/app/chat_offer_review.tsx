import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { GlassCard } from '@/components/GlassCard'
import { useThemeColors } from '@/theme/useThemeColors'
import { radius, space, type as typeStyles } from '@/theme/tokens'

const MESSAGES = [
  { id: 1, text: "Hi! I'm interested in your task. I can complete it by tomorrow.", fromMe: false, time: '10:32 AM' },
  { id: 2, text: 'Great! What experience do you have with this type of work?', fromMe: true, time: '10:35 AM' },
  { id: 3, text: "I've done similar work for 5+ years and have 40+ 5-star reviews.", fromMe: false, time: '10:37 AM' },
  { id: 4, text: "Perfect. What's your best price?", fromMe: true, time: '10:40 AM' },
  { id: 5, text: 'I can do it for $85 — includes all materials and labour.', fromMe: false, time: '10:42 AM' },
]

export default function ChatOfferReviewRoute() {
  const c = useThemeColors()
  const router = useRouter()

  return (
    <View style={[styles.root, { backgroundColor: c.surface_secondary }]}>
      {/* Chat thread */}
      <ScrollView style={styles.chatArea} contentContainerStyle={styles.chatContent}>
        {MESSAGES.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.bubbleRow,
              msg.fromMe ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' },
            ]}
          >
            <View
              style={[
                styles.bubble,
                msg.fromMe
                  ? { backgroundColor: c.accent_primary }
                  : { backgroundColor: c.surface_primary, borderColor: c.border_subtle, borderWidth: 1 },
              ]}
            >
              <Text
                style={{
                  color: msg.fromMe ? '#fff' : c.text_primary,
                  fontSize: 15,
                  lineHeight: 20,
                }}
              >
                {msg.text}
              </Text>
              <Text
                style={{
                  color: msg.fromMe ? 'rgba(255,255,255,0.7)' : c.text_secondary,
                  fontSize: 11,
                  marginTop: 4,
                  alignSelf: 'flex-end',
                }}
              >
                {msg.time}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Offer review panel */}
      <GlassCard style={styles.offerPanel}>
        <View style={[styles.offerBadge, { backgroundColor: '#D8B46A22' }]}>
          <Text style={{ color: '#D8B46A', fontWeight: '700', fontSize: 13 }}>Offer: $85</Text>
        </View>
        <Text style={[typeStyles.body, { color: c.text_primary, fontWeight: '600' }]}>
          Review this offer
        </Text>
        <Text style={{ color: c.text_secondary, fontSize: 13, lineHeight: 18 }}>
          Carlos Rivera offered $85 for this task.
        </Text>
        <View style={styles.offerActions}>
          <Pressable
            style={[styles.declineBtn, { borderColor: c.border_subtle }]}
            onPress={() => Alert.alert('Declined', 'Offer has been declined.')}
            accessibilityRole="button"
          >
            <Text style={{ color: c.text_secondary, fontWeight: '600', fontSize: 14 }}>Decline</Text>
          </Pressable>
          <Pressable
            style={[styles.acceptBtn, { backgroundColor: '#4CAF50' }]}
            onPress={() => {
              Alert.alert('Offer accepted!', 'Carlos has been notified.', [
                { text: 'OK', onPress: () => router.push('/confirmation_customer_request_sent') },
              ])
            }}
            accessibilityRole="button"
          >
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>Accept offer</Text>
          </Pressable>
        </View>
      </GlassCard>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  chatArea: { flex: 1, paddingHorizontal: space.lg },
  chatContent: { paddingVertical: space.lg, gap: space.sm },
  bubbleRow: { marginBottom: space.sm },
  bubble: { maxWidth: '75%', padding: space.md, borderRadius: 16 },
  offerPanel: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: space.lg, gap: space.sm },
  offerBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  offerActions: { flexDirection: 'row', gap: space.md, marginTop: space.sm },
  declineBtn: { flex: 1, borderWidth: 1, borderRadius: radius.button, paddingVertical: 12, alignItems: 'center' },
  acceptBtn: { flex: 2, borderRadius: radius.button, paddingVertical: 12, alignItems: 'center' },
})
