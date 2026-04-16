import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { AmbientGlassBackground } from '@/components/AmbientGlassBackground';
import { GuestGate } from '@/components/GuestGate';
import { GlassCard } from '@/components/GlassCard';
import { useThemeColors } from '@/theme/useThemeColors';
import { space, type as typeStyles } from '@/theme/tokens';

function PostContent() {
  const c = useThemeColors();
  const router = useRouter();

  return (
    <View style={[styles.root, { backgroundColor: c.background_alt }]}>
      <AmbientGlassBackground />
      <View style={styles.content}>
        <Text style={[styles.eyebrow, { color: c.accent_primary }]}>Create</Text>
        <Text style={[typeStyles.title, { color: c.text_primary }]}>What would you like to post?</Text>
        <Text style={[typeStyles.body, { color: c.text_secondary, lineHeight: 22 }]}>Choose the fastest way to get work moving. You can always refine the details after you start.</Text>

        <GlassCard
          pressable
          onPress={() => router.push('/worker_service_form')}
          style={styles.optionCard}
        >
          <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,94,168,0.15)' }]}>
            <Ionicons name="briefcase-outline" size={24} color={c.pin_worker} />
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={[typeStyles.subtitle, { color: c.text_primary }]}>Offer a service</Text>
            <Text style={{ color: c.text_secondary, fontSize: 14, lineHeight: 20 }}>
              Create a worker profile listing your skills, rates, and availability.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={c.text_secondary} />
        </GlassCard>

        <GlassCard
          pressable
          onPress={() => router.push('/help_request_form')}
          style={styles.optionCard}
        >
          <View style={[styles.iconCircle, { backgroundColor: 'rgba(109,156,255,0.15)' }]}>
            <Ionicons name="help-circle-outline" size={24} color={c.pin_job} />
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={[typeStyles.subtitle, { color: c.text_primary }]}>Post a job</Text>
            <Text style={{ color: c.text_secondary, fontSize: 14, lineHeight: 20 }}>
              Describe what you need done and let workers come to you.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={c.text_secondary} />
        </GlassCard>
      </View>
    </View>
  );
}

export default function PostTypeSelectorRoute() {
  return (
    <GuestGate>
      <PostContent />
    </GuestGate>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'center' },
  content: { width: '100%', maxWidth: 760, alignSelf: 'center', padding: space.xl, gap: space.lg, position: 'relative', zIndex: 1 },
  eyebrow: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0 },
  optionCard: { flexDirection: 'row', alignItems: 'center', gap: space.lg, padding: space.xl },
  iconCircle: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
});
