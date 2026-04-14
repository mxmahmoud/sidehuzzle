import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { GlassCard } from '@/components/GlassCard'
import { useThemeColors } from '@/theme/useThemeColors'
import { radius, space, type as typeStyles } from '@/theme/tokens'

export default function ChangePasswordFormRoute() {
  const c = useThemeColors()
  const router = useRouter()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')

  function handleChange() {
    if (!current || !next || !confirm) {
      Alert.alert('Missing fields', 'Please fill in all fields.')
      return
    }
    if (next !== confirm) {
      Alert.alert('Mismatch', 'New password and confirmation do not match.')
      return
    }
    if (next.length < 8) {
      Alert.alert('Too short', 'Password must be at least 8 characters.')
      return
    }
    Alert.alert('Password updated', 'Your password has been changed successfully.')
    router.back()
  }

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: c.surface_secondary }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <GlassCard>
        <Text style={[styles.eyebrow, { color: c.accent_primary }]}>Security</Text>
        <Text style={[typeStyles.title, { color: c.text_primary }]}>Change password</Text>
        <Text style={{ color: c.text_secondary, fontSize: 14, lineHeight: 21 }}>
          Use a strong password with letters, numbers, and special characters.
        </Text>
      </GlassCard>

      <GlassCard style={{ gap: space.lg }}>
        <View>
          <Text style={[styles.label, { color: c.text_secondary }]}>Current password</Text>
          <TextInput
            value={current}
            onChangeText={setCurrent}
            placeholder="Enter current password"
            placeholderTextColor={c.text_secondary}
            secureTextEntry
            style={[styles.input, { borderColor: c.border_subtle, color: c.text_primary }]}
          />
        </View>
        <View>
          <Text style={[styles.label, { color: c.text_secondary }]}>New password</Text>
          <TextInput
            value={next}
            onChangeText={setNext}
            placeholder="At least 8 characters"
            placeholderTextColor={c.text_secondary}
            secureTextEntry
            style={[styles.input, { borderColor: c.border_subtle, color: c.text_primary }]}
          />
        </View>
        <View>
          <Text style={[styles.label, { color: c.text_secondary }]}>Confirm new password</Text>
          <TextInput
            value={confirm}
            onChangeText={setConfirm}
            placeholder="Repeat new password"
            placeholderTextColor={c.text_secondary}
            secureTextEntry
            style={[styles.input, { borderColor: c.border_subtle, color: c.text_primary }]}
          />
        </View>
      </GlassCard>

      <Pressable
        style={[styles.submitBtn, { backgroundColor: c.accent_primary }]}
        onPress={handleChange}
        accessibilityRole="button"
      >
        <Text style={styles.submitText}>Change password</Text>
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
  input: { borderWidth: 1, borderRadius: radius.button, paddingHorizontal: space.md, paddingVertical: space.md, fontSize: 16 },
  submitBtn: { paddingVertical: space.md, borderRadius: radius.button, alignItems: 'center' },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  cancelBtn: { alignItems: 'center', paddingVertical: space.md },
})
