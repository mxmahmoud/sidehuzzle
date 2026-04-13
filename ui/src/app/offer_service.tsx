import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/theme/useThemeColors';
import { radius, space, type as typeStyles } from '@/theme/tokens';

export default function OfferServiceRoute() {
  const c = useThemeColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const [rate, setRate] = useState('');

  return (
    <View style={[styles.root, { backgroundColor: c.surface_secondary }]}>
      <Stack.Screen options={{ title: 'Send offer', headerShown: true }} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.summary, { backgroundColor: c.surface_elevated, borderColor: c.border_subtle }]}>
          <View style={[styles.summaryBadge, { backgroundColor: 'rgba(109,156,255,0.22)' }]}>
            <Text style={[styles.summaryBadgeText, { color: c.pin_job }]}>Job</Text>
          </View>
          <Text style={[typeStyles.subtitle, { color: c.text_primary }]}>Deep clean 2BR</Text>
          <Text style={{ color: c.text_secondary, fontSize: 13, lineHeight: 20 }}>
            Share a rate and short note so the customer can compare your offer with others.
          </Text>
        </View>

        <Text style={[styles.eyebrow, { color: c.accent_primary }]}>Apply to this job</Text>
        <Text style={[typeStyles.title, { color: c.text_primary }]}>Your offer</Text>
        <Text style={[typeStyles.body, { color: c.text_secondary, lineHeight: 22 }]}>Describe your experience and availability. The customer will see your profile, rating, and this message.</Text>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: c.text_secondary }]}>Your rate</Text>
          <View style={[styles.inputRow, { backgroundColor: c.surface_elevated, borderColor: c.border_subtle }]}>
            <Text style={[styles.currency, { color: c.text_secondary }]}>$</Text>
            <TextInput
              style={[styles.input, { color: c.text_primary }]}
              placeholder="45"
              placeholderTextColor={c.text_secondary}
              keyboardType="numeric"
              value={rate}
              onChangeText={setRate}
            />
            <Text style={[styles.unit, { color: c.text_secondary }]}>/hr</Text>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: c.text_secondary }]}>Cover message</Text>
          <TextInput
            style={[styles.textArea, { backgroundColor: c.surface_elevated, borderColor: c.border_subtle, color: c.text_primary }]}
            placeholder="I can help with this because..."
            placeholderTextColor={c.text_secondary}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            value={message}
            onChangeText={setMessage}
          />
        </View>

        <View style={[styles.infoBox, { backgroundColor: c.surface_elevated, borderColor: c.border_subtle }]}>
          <Ionicons name="shield-checkmark-outline" size={20} color={c.accent_positive} />
          <Text style={[typeStyles.caption, { color: c.text_secondary, flex: 1, lineHeight: 20 }]}>Your offer is non-binding until both parties agree on terms in the chat.</Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: c.surface_primary, borderTopColor: c.border_subtle, paddingBottom: insets.bottom + space.md }]}>
        <Pressable
          onPress={() => router.push('/confirmation_worker_offer_submitted')}
          style={[styles.submitBtn, { backgroundColor: c.accent_primary }]}
          accessibilityRole="button"
        >
          <Text style={styles.submitText}>Send offer</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: space.xl, gap: space.lg },
  summary: { gap: space.sm, padding: space.lg, borderRadius: radius.card, borderWidth: 1 },
  summaryBadge: { alignSelf: 'flex-start', borderRadius: radius.chip, paddingHorizontal: 10, paddingVertical: 5 },
  summaryBadgeText: { fontSize: 11, fontWeight: '700' },
  eyebrow: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  fieldGroup: { gap: space.sm },
  label: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderRadius: radius.button, borderWidth: 1, paddingHorizontal: space.md, height: 48 },
  input: { flex: 1, fontSize: 18, fontWeight: '700' },
  currency: { fontSize: 18, fontWeight: '600', marginRight: space.xs },
  unit: { fontSize: 14, fontWeight: '500' },
  textArea: { borderRadius: radius.button, borderWidth: 1, padding: space.md, fontSize: 15, minHeight: 120 },
  infoBox: { flexDirection: 'row', gap: space.md, padding: space.lg, borderRadius: radius.card, borderWidth: 1, alignItems: 'flex-start' },
  footer: { paddingHorizontal: space.lg, paddingTop: space.md, borderTopWidth: 1 },
  submitBtn: { borderRadius: radius.button, paddingVertical: space.lg, alignItems: 'center' },
  submitText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
