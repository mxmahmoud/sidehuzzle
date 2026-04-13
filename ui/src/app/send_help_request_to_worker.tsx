import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/theme/useThemeColors';
import { radius, space, type as typeStyles } from '@/theme/tokens';

export default function SendHelpRequestRoute() {
  const c = useThemeColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [description, setDescription] = useState('');

  return (
    <View style={[styles.root, { backgroundColor: c.surface_secondary }]}>
      <Stack.Screen options={{ title: 'Request worker', headerShown: true }} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.summary, { backgroundColor: c.surface_elevated, borderColor: c.border_subtle }]}>
          <Text style={[typeStyles.subtitle, { color: c.text_primary }]}>Alex — Handyman</Text>
          <Text style={{ color: c.text_secondary, fontSize: 13, lineHeight: 20 }}>
            High-rated pro, same-day availability, and repeat clients nearby.
          </Text>
        </View>

        <Text style={[styles.eyebrow, { color: c.accent_primary }]}>Direct request</Text>
        <Text style={[typeStyles.title, { color: c.text_primary }]}>Describe what you need</Text>
        <Text style={[typeStyles.body, { color: c.text_secondary, lineHeight: 22 }]}>The worker will receive your request and can respond with availability and pricing.</Text>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: c.text_secondary }]}>What do you need help with?</Text>
          <TextInput
            style={[styles.textArea, { backgroundColor: c.surface_elevated, borderColor: c.border_subtle, color: c.text_primary }]}
            placeholder="I need someone to help with..."
            placeholderTextColor={c.text_secondary}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View style={styles.optionRow}>
          <Pressable
            onPress={() => router.push('/help_request_form')}
            style={[styles.optionCard, { backgroundColor: c.surface_elevated, borderColor: c.border_subtle }]}
            accessibilityRole="button"
          >
            <Text style={[typeStyles.subtitle, { color: c.text_primary }]}>Create new job post</Text>
            <Text style={[typeStyles.caption, { color: c.text_secondary }]}>Post publicly and link this worker</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/confirmation_customer_request_sent')}
            style={[styles.optionCard, { backgroundColor: c.surface_elevated, borderColor: c.border_subtle }]}
            accessibilityRole="button"
          >
            <Text style={[typeStyles.subtitle, { color: c.text_primary }]}>Send direct message</Text>
            <Text style={[typeStyles.caption, { color: c.text_secondary }]}>Private request to this worker only</Text>
          </Pressable>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: c.surface_primary, borderTopColor: c.border_subtle, paddingBottom: insets.bottom + space.md }]}>
        <Pressable
          onPress={() => router.push('/confirmation_customer_request_sent')}
          style={[styles.submitBtn, { backgroundColor: c.accent_primary }]}
          accessibilityRole="button"
        >
          <Text style={styles.submitText}>Send request</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: space.xl, gap: space.lg },
  summary: { gap: space.xs, padding: space.lg, borderRadius: radius.card, borderWidth: 1 },
  eyebrow: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  fieldGroup: { gap: space.sm },
  label: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  textArea: { borderRadius: radius.button, borderWidth: 1, padding: space.md, fontSize: 15, minHeight: 120 },
  optionRow: { gap: space.md },
  optionCard: { borderRadius: radius.card, borderWidth: 1, padding: space.lg, gap: space.xs },
  footer: { paddingHorizontal: space.lg, paddingTop: space.md, borderTopWidth: 1 },
  submitBtn: { borderRadius: radius.button, paddingVertical: space.lg, alignItems: 'center' },
  submitText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
