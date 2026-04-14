import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { GlassCard } from '@/components/GlassCard'
import { useSessionStore } from '@/stores/sessionStore'
import { useThemeColors } from '@/theme/useThemeColors'
import { radius, space, type as typeStyles } from '@/theme/tokens'

export default function AccountInfoEditRoute() {
  const c = useThemeColors()
  const router = useRouter()
  const user = useSessionStore((s) => s.user)

  const [fullName, setFullName] = useState(user?.name ?? '')
  const [bio, setBio] = useState('')
  const [tagline, setTagline] = useState('')
  const [location, setLocation] = useState('')

  function handleSave() {
    Alert.alert('Saved', 'Your profile has been updated.')
    router.back()
  }

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: c.surface_secondary }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <GlassCard>
        <Text style={[styles.eyebrow, { color: c.accent_primary }]}>Profile</Text>
        <Text style={[typeStyles.title, { color: c.text_primary }]}>Edit account info</Text>
        <Text style={{ color: c.text_secondary, fontSize: 14, lineHeight: 21 }}>
          Update your personal information and how others see you.
        </Text>
      </GlassCard>

      <GlassCard style={{ gap: space.lg }}>
        <View>
          <Text style={[styles.label, { color: c.text_secondary }]}>Full name</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            placeholder="Your full name"
            placeholderTextColor={c.text_secondary}
            style={[styles.input, { borderColor: c.border_subtle, color: c.text_primary }]}
          />
        </View>
        <View>
          <Text style={[styles.label, { color: c.text_secondary }]}>Tagline</Text>
          <TextInput
            value={tagline}
            onChangeText={setTagline}
            placeholder="One-line bio (e.g. Professional plumber)"
            placeholderTextColor={c.text_secondary}
            style={[styles.input, { borderColor: c.border_subtle, color: c.text_primary }]}
          />
        </View>
        <View>
          <Text style={[styles.label, { color: c.text_secondary }]}>Bio</Text>
          <TextInput
            value={bio}
            onChangeText={setBio}
            placeholder="Tell others about yourself"
            placeholderTextColor={c.text_secondary}
            multiline
            numberOfLines={4}
            style={[styles.input, { borderColor: c.border_subtle, color: c.text_primary, minHeight: 100 }]}
          />
        </View>
        <View>
          <Text style={[styles.label, { color: c.text_secondary }]}>Location</Text>
          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder="City or area"
            placeholderTextColor={c.text_secondary}
            style={[styles.input, { borderColor: c.border_subtle, color: c.text_primary }]}
          />
        </View>
      </GlassCard>

      <Pressable
        style={[styles.saveBtn, { backgroundColor: c.accent_primary }]}
        onPress={handleSave}
        accessibilityRole="button"
      >
        <Text style={styles.saveText}>Save changes</Text>
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: space.xl, gap: space.lg },
  eyebrow: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0 },
  label: { fontSize: 12, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0 },
  input: { borderWidth: 1, borderRadius: radius.button, paddingHorizontal: space.md, paddingVertical: space.md, fontSize: 16, textAlignVertical: 'top' },
  saveBtn: { paddingVertical: space.md, borderRadius: radius.button, alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: '700', fontSize: 16 },
})
