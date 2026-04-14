import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { GlassCard } from '@/components/GlassCard'
import { useThemeColors } from '@/theme/useThemeColors'
import { radius, space, type as typeStyles } from '@/theme/tokens'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const TIME_BLOCKS = [
  { id: 'morning', label: 'Morning', icon: 'sunny-outline' as const, hours: '8am – 12pm' },
  { id: 'afternoon', label: 'Afternoon', icon: 'partly-sunny-outline' as const, hours: '12pm – 5pm' },
  { id: 'evening', label: 'Evening', icon: 'moon-outline' as const, hours: '5pm – 9pm' },
]

const AVAILABILITY_TYPES = [
  { id: 'flexible', label: 'Flexible', description: 'I can work anytime', icon: 'repeat-outline' as const },
  { id: 'part_time', label: 'Part-time', description: 'I have set hours each week', icon: 'time-outline' as const },
  { id: 'full_time', label: 'Full-time', description: 'I work on Sidehuzle as my main job', icon: 'briefcase-outline' as const },
]

function AvailabilityTypeCard({
  type,
  selected,
  onSelect,
}: {
  type: { id: string; label: string; description: string; icon: keyof typeof Ionicons.glyphMap }
  selected: boolean
  onSelect: () => void
}) {
  const c = useThemeColors()
  return (
    <Pressable
      style={[
        styles.typeCard,
        {
          backgroundColor: selected ? c.accent_primary + '22' : c.surface_primary,
          borderColor: selected ? c.accent_primary : c.border_subtle,
        },
      ]}
      onPress={onSelect}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
    >
      <Ionicons
        name={type.icon}
        size={24}
        color={selected ? c.accent_primary : c.text_secondary}
      />
      <Text style={[typeStyles.body, { color: c.text_primary, fontWeight: '700', marginTop: space.sm }]}>
        {type.label}
      </Text>
      <Text style={{ color: c.text_secondary, fontSize: 12, textAlign: 'center' }}>
        {type.description}
      </Text>
      {selected && (
        <View style={[styles.checkmark, { backgroundColor: c.accent_primary }]}>
          <Ionicons name="checkmark" size={12} color="#fff" />
        </View>
      )}
    </Pressable>
  )
}

export default function OnboardingAvailabilityRoute() {
  const c = useThemeColors()
  const router = useRouter()
  const [availType, setAvailType] = useState<string | null>(null)
  const [selectedDays, setSelectedDays] = useState<Set<string>>(new Set())
  const [selectedTimes, setSelectedTimes] = useState<Set<string>>(new Set())

  function toggleDay(day: string) {
    setSelectedDays((prev) => {
      const next = new Set(prev)
      if (next.has(day)) next.delete(day)
      else next.add(day)
      return next
    })
  }

  function toggleTime(id: string) {
    setSelectedTimes((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleFinish() {
    if (!availType) {
      Alert.alert('Select availability', 'Please choose how available you are.')
      return
    }
    // TODO: persist availability to backend
    router.push('/(tabs)/landing_page')
  }

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: c.surface_secondary }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.progress}>
        <View style={[styles.progressBar, { backgroundColor: c.accent_primary, width: '100%' }]} />
      </View>

      <GlassCard>
        <Text style={[styles.eyebrow, { color: c.accent_primary }]}>Step 2 of 2</Text>
        <Text style={[typeStyles.title, { color: c.text_primary }]}>When are you available?</Text>
        <Text style={{ color: c.text_secondary, fontSize: 14, lineHeight: 21 }}>
          Tell us your typical availability so clients know when they can reach you.
        </Text>
      </GlassCard>

      {/* Availability type */}
      <Text style={[styles.sectionTitle, { color: c.text_secondary }]}>Commitment level</Text>
      <View style={styles.typeGrid}>
        {AVAILABILITY_TYPES.map((type) => (
          <AvailabilityTypeCard
            key={type.id}
            type={type}
            selected={availType === type.id}
            onSelect={() => setAvailType(type.id)}
          />
        ))}
      </View>

      {/* Days of week */}
      <Text style={[styles.sectionTitle, { color: c.text_secondary }]}>Days available</Text>
      <GlassCard>
        <View style={styles.daysRow}>
          {DAYS.map((day) => (
            <Pressable
              key={day}
              style={[
                styles.dayBtn,
                {
                  backgroundColor: selectedDays.has(day) ? c.accent_primary + '22' : c.surface_secondary,
                  borderColor: selectedDays.has(day) ? c.accent_primary : c.border_subtle,
                },
              ]}
              onPress={() => toggleDay(day)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: selectedDays.has(day) }}
            >
              <Text
                style={{
                  color: selectedDays.has(day) ? c.accent_primary : c.text_secondary,
                  fontSize: 12,
                  fontWeight: '700',
                }}
              >
                {day}
              </Text>
            </Pressable>
          ))}
        </View>
      </GlassCard>

      {/* Time blocks */}
      <Text style={[styles.sectionTitle, { color: c.text_secondary }]}>Time of day</Text>
      <View style={styles.timeGrid}>
        {TIME_BLOCKS.map((block) => (
          <Pressable
            key={block.id}
            style={[
              styles.timeCard,
              {
                backgroundColor: selectedTimes.has(block.id) ? c.accent_primary + '22' : c.surface_primary,
                borderColor: selectedTimes.has(block.id) ? c.accent_primary : c.border_subtle,
              },
            ]}
            onPress={() => toggleTime(block.id)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: selectedTimes.has(block.id) }}
          >
            <Ionicons
              name={block.icon}
              size={22}
              color={selectedTimes.has(block.id) ? c.accent_primary : c.text_secondary}
            />
            <Text style={[typeStyles.body, { color: c.text_primary, fontWeight: '600', marginTop: 6 }]}>
              {block.label}
            </Text>
            <Text style={{ color: c.text_secondary, fontSize: 11 }}>{block.hours}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        style={[
          styles.finishBtn,
          { backgroundColor: availType ? c.accent_primary : c.accent_primary + '50' },
        ]}
        onPress={handleFinish}
        accessibilityRole="button"
      >
        <Text style={styles.finishText}>Finish setup</Text>
      </Pressable>

      <Pressable
        style={styles.skipBtn}
        onPress={() => router.push('/(tabs)/landing_page')}
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
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md },
  typeCard: { width: '31%', padding: space.md, borderWidth: 1, borderRadius: radius.card, alignItems: 'center', gap: 4 },
  checkmark: { position: 'absolute', top: 8, right: 8, width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  daysRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dayBtn: { width: 42, height: 42, borderRadius: 21, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  timeGrid: { flexDirection: 'row', gap: space.md },
  timeCard: { flex: 1, padding: space.md, borderWidth: 1, borderRadius: radius.card, alignItems: 'center', gap: 4 },
  finishBtn: { paddingVertical: space.md, borderRadius: radius.button, alignItems: 'center' },
  finishText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  skipBtn: { alignItems: 'center', paddingVertical: space.md },
})
