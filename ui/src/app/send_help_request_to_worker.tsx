import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { AmbientGlassBackground } from '@/components/AmbientGlassBackground';
import { GlassCard } from '@/components/GlassCard';
import { GlassFormFooter, GlassFormHeader, formLayoutStyles } from '@/components/GlassFormChrome';
import { GlassInputFrame } from '@/components/GlassInputFrame';
import { useThemeColors } from '@/theme/useThemeColors';
import { radius, space, type as typeStyles } from '@/theme/tokens';

export default function SendHelpRequestRoute() {
  const c = useThemeColors();
  const router = useRouter();
  const [description, setDescription] = useState('');

  return (
    <View style={[styles.root, { backgroundColor: c.background_alt }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <AmbientGlassBackground />
      <GlassFormHeader title="Request worker" />
      <ScrollView contentContainerStyle={formLayoutStyles.content} keyboardShouldPersistTaps="handled">
        <GlassCard variant="elevated" style={styles.summary}>
          <Text style={[typeStyles.subtitle, { color: c.text_primary }]}>Alex — Handyman</Text>
          <Text style={{ color: c.text_secondary, fontSize: 13, lineHeight: 20 }}>
            High-rated pro, same-day availability, and repeat clients nearby.
          </Text>
        </GlassCard>

        <Text style={[styles.eyebrow, { color: c.accent_primary }]}>Direct request</Text>
        <Text style={[typeStyles.title, { color: c.text_primary }]}>Describe what you need</Text>
        <Text style={[typeStyles.body, { color: c.text_secondary, lineHeight: 22 }]}>The worker will receive your request and can respond with availability and pricing.</Text>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: c.text_secondary }]}>What do you need help with?</Text>
          <GlassInputFrame>
            <TextInput
              style={[styles.textArea, { color: c.text_primary }]}
              placeholder="I need someone to help with..."
              placeholderTextColor={c.text_secondary}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
          </GlassInputFrame>
        </View>

        <View style={styles.optionRow}>
          <GlassCard
            pressable
            onPress={() => router.push('/help_request_form')}
            style={styles.optionCard}
          >
            <Text style={[typeStyles.subtitle, { color: c.text_primary }]}>Create new job post</Text>
            <Text style={[typeStyles.caption, { color: c.text_secondary }]}>Post publicly and link this worker</Text>
          </GlassCard>
          <GlassCard
            pressable
            onPress={() => router.push('/confirmation_customer_request_sent')}
            style={styles.optionCard}
          >
            <Text style={[typeStyles.subtitle, { color: c.text_primary }]}>Send direct message</Text>
            <Text style={[typeStyles.caption, { color: c.text_secondary }]}>Private request to this worker only</Text>
          </GlassCard>
        </View>
      </ScrollView>

      <GlassFormFooter
        primaryLabel="Send request"
        icon="send"
        onPrimaryPress={() => router.push('/confirmation_customer_request_sent')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  summary: { gap: space.xs, padding: space.lg, borderRadius: radius.card, borderWidth: 1 },
  eyebrow: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0 },
  fieldGroup: { gap: space.sm },
  label: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0 },
  textArea: { padding: space.md, fontSize: 15, minHeight: 120 },
  optionRow: { gap: space.md },
  optionCard: { padding: space.lg, gap: space.xs },
});
