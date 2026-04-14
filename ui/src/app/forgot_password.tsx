import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { useMutation } from '@tanstack/react-query'
import { requestPasswordReset } from '@/domain/api/authApi'
import { GlassCard } from '@/components/GlassCard'
import { useThemeColors } from '@/theme/useThemeColors'
import { radius, space, type as typeStyles } from '@/theme/tokens'

export default function ForgotPasswordRoute() {
  const c = useThemeColors()
  const router = useRouter()
  const [email, setEmail] = useState('')

  const resetMutation = useMutation({
    mutationFn: () => requestPasswordReset(email),
    onSuccess: () => {
      Alert.alert(
        'Check your email',
        `If ${email} is registered, we sent a reset link there.`,
        [{ text: 'OK', onPress: () => router.back() }]
      )
    },
    onError: (e: Error) => {
      Alert.alert('Error', e.message ?? 'Could not send reset email.')
    },
  })

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: c.surface_secondary }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <GlassCard>
        <View style={[styles.iconWrap, { backgroundColor: c.accent_primary + '18' }]}>
          <Ionicons name="key-outline" size={32} color={c.accent_primary} />
        </View>
        <Text style={[typeStyles.title, { color: c.text_primary }]}>Reset password</Text>
        <Text style={{ color: c.text_secondary, fontSize: 14, lineHeight: 21, textAlign: 'center' }}>
          Enter your email and we'll send you a link to reset your password.
        </Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email address"
          placeholderTextColor={c.text_secondary}
          autoCapitalize="none"
          keyboardType="email-address"
          style={[styles.input, { borderColor: c.border_subtle, color: c.text_primary }]}
        />

        <Pressable
          style={[
            styles.submit,
            {
              backgroundColor: resetMutation.isPending
                ? c.accent_primary + '80'
                : c.accent_primary,
            },
          ]}
          onPress={() => resetMutation.mutate()}
          disabled={resetMutation.isPending || !email}
          accessibilityRole="button"
        >
          <Text style={styles.submitText}>
            {resetMutation.isPending ? 'Sending…' : 'Send reset link'}
          </Text>
        </Pressable>

        <Pressable
          style={styles.backLink}
          onPress={() => router.back()}
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={16} color={c.text_secondary} />
          <Text style={{ color: c.text_secondary, fontSize: 14 }}>Back to sign in</Text>
        </Pressable>
      </GlassCard>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', padding: space.xl },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: space.md,
  },
  input: {
    borderWidth: 1,
    borderRadius: radius.button,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    fontSize: 16,
    marginTop: space.md,
  },
  submit: {
    paddingVertical: space.md,
    borderRadius: radius.button,
    alignItems: 'center',
    marginTop: space.md,
  },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: space.lg,
  },
})
