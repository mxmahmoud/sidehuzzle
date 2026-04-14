import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native'
import { GlassCard } from '@/components/GlassCard'
import { useThemeColors } from '@/theme/useThemeColors'
import { radius, space, type as typeStyles } from '@/theme/tokens'

const SECTIONS = [
  {
    title: 'Profile visibility',
    items: [
      { id: 'profile_public', label: 'Public profile', description: 'Anyone can view your profile and reviews', icon: 'globe-outline' as const },
      { id: 'show_online', label: 'Show online status', description: 'Let others see when you\'re active', icon: 'pulse' as const },
      { id: 'show_location', label: 'Show location', description: 'Display your general area on your profile', icon: 'location' as const },
    ],
  },
  {
    title: 'Data & advertising',
    items: [
      { id: 'personalized_ads', label: 'Personalized ads', description: 'Allow ads tailored to your activity', icon: 'megaphone-outline' as const },
      { id: 'analytics', label: 'Usage analytics', description: 'Help us improve by sharing anonymous usage data', icon: 'stats-chart-outline' as const },
    ],
  },
]

export default function SettingsPrivacyRoute() {
  const c = useThemeColors()

  const [toggles, setToggles] = useState<Record<string, boolean>>({
    profile_public: true,
    show_online: false,
    show_location: true,
    personalized_ads: false,
    analytics: true,
  })

  function handleSave() {
    Alert.alert('Saved', 'Privacy settings updated.')
  }

  return (
    <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.content}>
      <GlassCard>
        <Text style={[styles.eyebrow, { color: c.accent_primary }]}>Your privacy</Text>
        <Text style={[typeStyles.title, { color: c.text_primary }]}>Privacy</Text>
        <Text style={{ color: c.text_secondary, fontSize: 14, lineHeight: 21 }}>
          Control who can see your information and how your data is used.
        </Text>
      </GlassCard>

      {SECTIONS.map((section) => (
        <GlassCard key={section.title}>
          <Text style={[styles.sectionTitle, { color: c.text_secondary }]}>{section.title}</Text>
          {section.items.map((item) => (
            <View key={item.id} style={[styles.row, { borderBottomColor: c.border_subtle }]}>
              <View style={[styles.rowIcon, { backgroundColor: c.accent_primary + '18' }]}>
                <Ionicons name={item.icon} size={18} color={c.accent_primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[typeStyles.body, { color: c.text_primary, fontWeight: '600' }]}>{item.label}</Text>
                <Text style={{ color: c.text_secondary, fontSize: 12, lineHeight: 17 }}>{item.description}</Text>
              </View>
              <Switch
                value={toggles[item.id]}
                onValueChange={(v) => setToggles((prev) => ({ ...prev, [item.id]: v }))}
                trackColor={{ true: c.accent_primary + '80', false: c.border_subtle }}
                thumbColor={toggles[item.id] ? c.accent_primary : '#f4f3f4'}
              />
            </View>
          ))}
        </GlassCard>
      ))}

      <GlassCard>
        <Text style={[styles.sectionTitle, { color: c.text_secondary }]}>Your data</Text>
        <Pressable
          style={[styles.dataBtn, { borderColor: c.border_subtle }]}
          onPress={() => Alert.alert('Export', 'Preparing your data export…')}
          accessibilityRole="button"
        >
          <Ionicons name="download-outline" size={18} color={c.text_primary} />
          <Text style={[typeStyles.body, { color: c.text_primary, flex: 1, marginLeft: space.md }]}>
            Download my data
          </Text>
          <Ionicons name="chevron-forward" size={18} color={c.text_secondary} />
        </Pressable>
        <Pressable
          style={[styles.dataBtn, { borderColor: '#ef4444' }]}
          onPress={() => Alert.alert('Delete Account', 'Please contact support to delete your account.')}
          accessibilityRole="button"
        >
          <Ionicons name="trash-outline" size={18} color="#ef4444" />
          <Text style={[typeStyles.body, { color: '#ef4444', flex: 1, marginLeft: space.md }]}>
            Delete my account
          </Text>
          <Ionicons name="chevron-forward" size={18} color="#ef4444" />
        </Pressable>
      </GlassCard>

      <Pressable
        style={[styles.saveBtn, { backgroundColor: c.accent_primary }]}
        onPress={handleSave}
        accessibilityRole="button"
      >
        <Text style={styles.saveText}>Save settings</Text>
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: space.xl, gap: space.lg },
  eyebrow: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0 },
  sectionTitle: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0, marginBottom: space.md },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: space.md, borderBottomWidth: 1 },
  rowIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: space.md },
  dataBtn: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: radius.card, padding: space.md, marginBottom: space.sm },
  saveBtn: { paddingVertical: space.md, borderRadius: radius.button, alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: '700', fontSize: 16 },
})
