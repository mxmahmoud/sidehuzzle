import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useMutation } from '@tanstack/react-query'
import { GlassCard } from '@/components/GlassCard'
import { useSessionStore } from '@/stores/sessionStore'
import { useThemeColors } from '@/theme/useThemeColors'
import { radius, space, type as typeStyles } from '@/theme/tokens'

const EXPERTISE_OPTIONS = [
  { id: 'plumbing', label: 'Plumbing', icon: 'water-outline' as const },
  { id: 'electrical', label: 'Electrical', icon: 'flash-outline' as const },
  { id: 'carpentry', label: 'Carpentry', icon: 'hammer-outline' as const },
  { id: 'painting', label: 'Painting', icon: 'color-palette-outline' as const },
  { id: 'cleaning', label: 'Cleaning', icon: 'sparkles-outline' as const },
  { id: 'moving', label: 'Moving & Delivery', icon: 'car-outline' as const },
  { id: 'gardening', label: 'Gardening', icon: 'leaf-outline' as const },
  { id: 'it', label: 'IT & Tech', icon: 'laptop-outline' as const },
  { id: 'tutoring', label: 'Tutoring', icon: 'school-outline' as const },
  { id: 'pet', label: 'Pet Care', icon: 'paw-outline' as const },
  { id: 'delivery', label: 'Errands & Delivery', icon: 'basket-outline' as const },
  { id: 'handyman', label: 'Handyman', icon: 'construct-outline' as const },
]

function ExpertiseChip({
  option,
  selected,
  onToggle,
}: {
  option: { id: string; label: string; icon: keyof typeof Ionicons.glyphMap }
  selected: boolean
  onToggle: () => void
}) {
  const c = useThemeColors()
  return (
    <Pressable
      style={[
        styles.chip,
        {
          backgroundColor: selected ? c.accent_primary + '22' : c.surface_primary,
          borderColor: selected ? c.accent_primary : c.border_subtle,
        },
      ]}
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
    >
      <Ionicons
        name={option.icon}
        size={20}
        color={selected ? c.accent_primary : c.text_secondary}
      />
      <Text
        style={[
          styles.chipLabel,
          { color: selected ? c.accent_primary : c.text_primary },
        ]}
      >
        {option.label}
      </Text>
    </Pressable>
  )
}

export default function OnboardingExpertiseRoute() {
  const c = useThemeColors()
  const router = useRouter()
  const user = useSessionStore((s) => s.user)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleContinue() {
    if (selected.size === 0) {
      Alert.alert('Select expertise', 'Please choose at least one area of expertise.')
      return
    }
    // TODO: persist selected expertise to backend
    router.push('/onboarding_availability')
  }

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: c.surface_secondary }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.progress}>
        <View style={[styles.progressBar, { backgroundColor: c.accent_primary, width: '50%' }]} />
      </View>

      <GlassCard>
        <Text style={[styles.eyebrow, { color: c.accent_primary }]}>Step 1 of 2</Text>
        <Text style={[typeStyles.title, { color: c.text_primary }]}>Your expertise</Text>
        <Text style={{ color: c.text_secondary, fontSize: 14, lineHeight: 21 }}>
          Select all the areas where you have skills or experience. This helps us match you with the right tasks.
        </Text>
      </GlassCard>

      <Text style={[styles.sectionTitle, { color: c.text_secondary }]}>
        {selected.size} selected
      </Text>

      <View style={styles.grid}>
        {EXPERTISE_OPTIONS.map((opt) => (
          <ExpertiseChip
            key={opt.id}
            option={opt}
            selected={selected.has(opt.id)}
            onToggle={() => toggle(opt.id)}
          />
        ))}
      </View>

      <Pressable
        style={[
          styles.continueBtn,
          {
            backgroundColor: selected.size > 0 ? c.accent_primary : c.accent_primary + '50',
          },
        ]}
        onPress={handleContinue}
        accessibilityRole="button"
      >
        <Text style={styles.continueText}>Continue</Text>
        <Ionicons name="arrow-forward" size={18} color="#fff" />
      </Pressable>

      <Pressable
        style={styles.skipBtn}
        onPress={() => router.push('/onboarding_availability')}
        accessibilityRole="button"
      >
        <Text style={{ color: c.text_secondary, fontSize: 14 }}>Skip for now</Text>
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: space.xl, gap: space.lg },
  progress: { height: 4, borderRadius: 2, backgroundColor: '#e5e7eb', overflow: 'hidden' },
  progressBar: { height: 4, borderRadius: 2 },
  eyebrow: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0 },
  sectionTitle: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: space.md, paddingVertical: 10, borderWidth: 1, borderRadius: radius.card },
  chipLabel: { fontSize: 13, fontWeight: '600' },
  continueBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: space.md, borderRadius: radius.button },
  continueText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  skipBtn: { alignItems: 'center', paddingVertical: space.md },
})
