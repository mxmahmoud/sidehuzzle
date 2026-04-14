import { Ionicons } from '@expo/vector-icons'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { useMutation } from '@tanstack/react-query'
import { GlassCard } from '@/components/GlassCard'
import { useSessionStore } from '@/stores/sessionStore'
import { useThemeColors } from '@/theme/useThemeColors'
import { radius, space, type as typeStyles } from '@/theme/tokens'

const STAR_LABELS = ['Terrible', 'Poor', 'Okay', 'Good', 'Excellent']

export default function AddReviewFormRoute() {
  const c = useThemeColors()
  const router = useRouter()
  const user = useSessionStore((s) => s.user)
  const { taskId } = useLocalSearchParams<{ taskId?: string }>()
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState('')

  const submitMutation = useMutation({
    mutationFn: () => {
      // TODO: call backend API
      return Promise.resolve()
    },
    onSuccess: () => {
      Alert.alert('Thank you!', 'Your review has been submitted.', [
        { text: 'OK', onPress: () => router.back() },
      ])
    },
    onError: () => {
      Alert.alert('Error', 'Could not submit review. Please try again.')
    },
  })

  function handleSubmit() {
    if (rating === 0) {
      Alert.alert('Select rating', 'Please tap a star to rate.')
      return
    }
    submitMutation.mutate()
  }

  const displayRating = hover || rating

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: c.surface_secondary }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <GlassCard>
        <Text style={[styles.eyebrow, { color: c.accent_primary }]}>Leave a review</Text>
        <Text style={[typeStyles.title, { color: c.text_primary }]}>How was your experience?</Text>
        <Text style={{ color: c.text_secondary, fontSize: 14, lineHeight: 21 }}>
          Your review helps others make informed decisions and rewards great service.
        </Text>
      </GlassCard>

      <GlassCard style={{ alignItems: 'center' }}>
        <Text style={{ color: c.text_secondary, fontSize: 13 }}>
          {displayRating > 0 ? STAR_LABELS[displayRating - 1] : 'Tap to rate'}
        </Text>
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Pressable
              key={n}
              onPress={() => setRating(n)}
              onPressIn={() => setHover(n)}
              onPressOut={() => setHover(0)}
              accessibilityRole="button"
              accessibilityLabel={`${n} star${n !== 1 ? 's' : ''}`}
            >
              <Ionicons
                name={n <= displayRating ? 'star' : 'star-outline'}
                size={40}
                color={n <= displayRating ? '#FFB400' : c.text_secondary}
                style={{ marginHorizontal: 4 }}
              />
            </Pressable>
          ))}
        </View>
      </GlassCard>

      <GlassCard>
        <Text style={[styles.label, { color: c.text_secondary }]}>Write a review (optional)</Text>
        <TextInput
          value={comment}
          onChangeText={setComment}
          placeholder="Share details of your experience…"
          placeholderTextColor={c.text_secondary}
          multiline
          numberOfLines={5}
          style={[styles.input, { borderColor: c.border_subtle, color: c.text_primary }]}
        />
      </GlassCard>

      <Pressable
        style={[
          styles.submitBtn,
          { backgroundColor: submitMutation.isPending ? c.accent_primary + '80' : c.accent_primary },
        ]}
        onPress={handleSubmit}
        disabled={submitMutation.isPending}
        accessibilityRole="button"
      >
        <Text style={styles.submitText}>
          {submitMutation.isPending ? 'Submitting…' : 'Submit review'}
        </Text>
      </Pressable>

      <Pressable style={styles.cancelBtn} onPress={() => router.back()} accessibilityRole="button">
        <Text style={{ color: c.text_secondary, fontSize: 14 }}>Cancel</Text>
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: space.xl, gap: space.lg },
  eyebrow: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0 },
  label: { fontSize: 12, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0 },
  stars: { flexDirection: 'row', marginTop: space.md },
  input: { borderWidth: 1, borderRadius: radius.button, paddingHorizontal: space.md, paddingVertical: space.md, fontSize: 16, minHeight: 120, textAlignVertical: 'top' },
  submitBtn: { paddingVertical: space.md, borderRadius: radius.button, alignItems: 'center' },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  cancelBtn: { alignItems: 'center', paddingVertical: space.md },
})
