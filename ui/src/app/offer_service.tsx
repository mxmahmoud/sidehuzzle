import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { AmbientGlassBackground } from '@/components/AmbientGlassBackground';
import { GlassCard } from '@/components/GlassCard';
import { GlassFormFooter, GlassFormHeader, formLayoutStyles } from '@/components/GlassFormChrome';
import { GlassInputFrame } from '@/components/GlassInputFrame';
import { useThemeColors } from '@/theme/useThemeColors';
import { radius, space, type as typeStyles } from '@/theme/tokens';

export default function OfferServiceRoute() {
  const c = useThemeColors();
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [rate, setRate] = useState('');

  return (
    <View style={[styles.root, { backgroundColor: c.background_alt }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <AmbientGlassBackground />
      <GlassFormHeader title="Send offer" />
      <ScrollView contentContainerStyle={formLayoutStyles.content} keyboardShouldPersistTaps="handled">
        <GlassCard variant="elevated" style={styles.summary}>
          <View style={[styles.summaryBadge, { backgroundColor: 'rgba(109,156,255,0.22)' }]}>
            <Text style={[styles.summaryBadgeText, { color: c.pin_job }]}>Job</Text>
          </View>
          <Text style={[typeStyles.subtitle, { color: c.text_primary }]}>Deep clean 2BR</Text>
          <Text style={{ color: c.text_secondary, fontSize: 13, lineHeight: 20 }}>
            Share a rate and short note so the customer can compare your offer with others.
          </Text>
        </GlassCard>

        <Text style={[styles.eyebrow, { color: c.accent_primary }]}>Apply to this job</Text>
        <Text style={[typeStyles.title, { color: c.text_primary }]}>Your offer</Text>
        <Text style={[typeStyles.body, { color: c.text_secondary, lineHeight: 22 }]}>Describe your experience and availability. The customer will see your profile, rating, and this message.</Text>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: c.text_secondary }]}>Your rate</Text>
          <GlassInputFrame style={styles.inputRow}>
            <Text style={[styles.currency, { color: c.text_secondary }]}>€</Text>
            <TextInput
              style={[styles.input, { color: c.text_primary }]}
              placeholder="45"
              placeholderTextColor={c.text_secondary}
              keyboardType="numeric"
              value={rate}
              onChangeText={setRate}
            />
            <Text style={[styles.unit, { color: c.text_secondary }]}>/hr</Text>
          </GlassInputFrame>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: c.text_secondary }]}>Cover message</Text>
          <GlassInputFrame>
            <TextInput
              style={[styles.textArea, { color: c.text_primary }]}
              placeholder="I can help with this because..."
              placeholderTextColor={c.text_secondary}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              value={message}
              onChangeText={setMessage}
            />
          </GlassInputFrame>
        </View>

        <GlassCard variant="surface" style={styles.infoBox}>
          <Ionicons name="shield-checkmark-outline" size={20} color={c.accent_positive} />
          <Text style={[typeStyles.caption, { color: c.text_secondary, flex: 1, lineHeight: 20 }]}>Your offer is non-binding until both parties agree on terms in the chat.</Text>
        </GlassCard>
      </ScrollView>

      <GlassFormFooter
        primaryLabel="Send offer"
        icon="send"
        onPrimaryPress={() => router.push('/confirmation_worker_offer_submitted')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  summary: { gap: space.sm, padding: space.lg, borderRadius: radius.card, borderWidth: 1 },
  summaryBadge: { alignSelf: 'flex-start', borderRadius: radius.chip, paddingHorizontal: 10, paddingVertical: 5 },
  summaryBadgeText: { fontSize: 11, fontWeight: '700' },
  eyebrow: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0 },
  fieldGroup: { gap: space.sm },
  label: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0 },
  inputRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: space.md, height: 48 },
  input: { flex: 1, fontSize: 18, fontWeight: '700' },
  currency: { fontSize: 18, fontWeight: '600', marginRight: space.xs },
  unit: { fontSize: 14, fontWeight: '500' },
  textArea: { padding: space.md, fontSize: 15, minHeight: 120 },
  infoBox: { flexDirection: 'row', gap: space.md, padding: space.lg, alignItems: 'flex-start' },
});
