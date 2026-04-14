import { Ionicons } from '@expo/vector-icons'
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { GlassCard } from '@/components/GlassCard'
import { useSessionStore } from '@/stores/sessionStore'
import { useThemeColors } from '@/theme/useThemeColors'
import { radius, space, type as typeStyles } from '@/theme/tokens'

const SOCIAL_LINKS = [
  { id: 'website', label: 'Website', icon: 'globe-outline' as const, placeholder: 'https://yoursite.com', color: '#3D5AFE' },
  { id: 'linkedin', label: 'LinkedIn', icon: 'logo-linkedin' as const, placeholder: 'linkedin.com/in/you', color: '#0077B5' },
  { id: 'twitter', label: 'X (Twitter)', icon: 'at' as const, placeholder: '@yourhandle', color: '#1DA1F2' },
  { id: 'instagram', label: 'Instagram', icon: 'logo-instagram' as const, placeholder: '@yourhandle', color: '#E1306C' },
  { id: 'facebook', label: 'Facebook', icon: 'logo-facebook' as const, placeholder: 'facebook.com/you', color: '#1877F2' },
]

export default function SocialLinksRoute() {
  const c = useThemeColors()
  const user = useSessionStore((s) => s.user)

  function handleSave() {
    Alert.alert('Saved', 'Your social links have been updated.')
  }

  return (
    <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.content}>
      <GlassCard>
        <Text style={[styles.eyebrow, { color: c.accent_primary }]}>Public presence</Text>
        <Text style={[typeStyles.title, { color: c.text_primary }]}>Social links</Text>
        <Text style={{ color: c.text_secondary, fontSize: 14, lineHeight: 21 }}>
          Connect your social profiles so others can find and trust you.
        </Text>
      </GlassCard>

      <GlassCard>
        <Text style={[styles.sectionTitle, { color: c.text_secondary }]}>Your profiles</Text>
        {SOCIAL_LINKS.map((link) => (
          <View key={link.id} style={[styles.linkRow, { borderBottomColor: c.border_subtle }]}>
            <Ionicons name={link.icon} size={20} color={link.color} />
            <View style={{ flex: 1, marginLeft: space.md }}>
              <Text style={[typeStyles.body, { color: c.text_primary, fontWeight: '600' }]}>{link.label}</Text>
              <Text style={{ color: c.text_secondary, fontSize: 12 }}>{link.placeholder}</Text>
            </View>
            <Pressable
              style={[styles.editBtn, { borderColor: c.border_subtle }]}
              onPress={() => Alert.alert('Edit', `Editing ${link.label} link…`)}
              accessibilityRole="button"
            >
              <Text style={{ color: c.text_secondary, fontSize: 12, fontWeight: '600' }}>Add</Text>
            </Pressable>
          </View>
        ))}
      </GlassCard>

      <GlassCard style={{ gap: space.sm }}>
        <Text style={[styles.eyebrow, { color: c.accent_primary }]}>Verification</Text>
        <Text style={[typeStyles.body, { color: c.text_secondary }]}>
          Verified social links increase your trust score and help clients find you.
        </Text>
        <View style={styles.trustRow}>
          <Ionicons name="shield-checkmark" size={18} color="#4CAF50" />
          <Text style={{ color: c.text_secondary, fontSize: 13, flex: 1, marginLeft: 6 }}>
            Add at least 2 social links to unlock the Verified badge.
          </Text>
        </View>
      </GlassCard>

      <Pressable
        style={[styles.saveBtn, { backgroundColor: c.accent_primary }]}
        onPress={handleSave}
        accessibilityRole="button"
      >
        <Text style={styles.saveText}>Save links</Text>
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: space.xl, gap: space.lg },
  eyebrow: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0 },
  sectionTitle: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0, marginBottom: space.md },
  linkRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: space.md, borderBottomWidth: 1 },
  editBtn: { borderWidth: 1, borderRadius: radius.button, paddingHorizontal: space.md, paddingVertical: 4 },
  trustRow: { flexDirection: 'row', alignItems: 'center', marginTop: space.sm },
  saveBtn: { paddingVertical: space.md, borderRadius: radius.button, alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: '700', fontSize: 16 },
})
