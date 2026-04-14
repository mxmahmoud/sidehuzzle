import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/theme/useThemeColors';
import { radius, space, type as typeStyles } from '@/theme/tokens';

export default function ConfirmationHelpWantedPostedRoute() {
  const c = useThemeColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { backgroundColor: c.surface_secondary }]}>
      <View style={styles.content}>
        <View style={[styles.iconWrap, { backgroundColor: 'rgba(109,156,255,0.18)' }]}>
          <Ionicons name="checkmark-circle" size={56} color={c.pin_job} />
        </View>
        <Text style={[styles.eyebrow, { color: c.accent_primary }]}>Posted</Text>
        <Text style={[typeStyles.title, { color: c.text_primary, textAlign: 'center' }]}>Your request is live</Text>
        <Text style={[typeStyles.body, { color: c.text_secondary, textAlign: 'center', lineHeight: 22 }]}>
          Workers in your area can now find and respond to your request. You'll be notified when offers come in.
        </Text>

        <View style={[styles.infoCard, { backgroundColor: c.surface_elevated, borderColor: c.border_subtle }]}>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={16} color={c.text_secondary} />
            <Text style={{ color: c.text_secondary, fontSize: 14 }}>Typically receives responses within hours</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="shield-checkmark-outline" size={16} color={c.text_secondary} />
            <Text style={{ color: c.text_secondary, fontSize: 14 }}>Verified workers only</Text>
          </View>
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + space.lg }]}>
        <Pressable
          onPress={() => router.push('/(tabs)/landing_page')}
          style={[styles.primaryBtn, { backgroundColor: c.accent_primary }]}
          accessibilityRole="button"
        >
          <Text style={styles.primaryBtnText}>Back to discovery</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push('/(tabs)/requests_posts_hub')}
          style={[styles.secondaryBtn, { borderColor: c.border_subtle }]}
          accessibilityRole="button"
        >
          <Ionicons name="chatbubbles-outline" size={18} color={c.accent_primary} />
          <Text style={[styles.secondaryBtnText, { color: c.accent_primary }]}>View messages</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: space.xl, gap: space.lg },
  iconWrap: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center' },
  eyebrow: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0 },
  infoCard: { width: '100%', gap: space.md, padding: space.lg, borderRadius: radius.card, borderWidth: 1, marginTop: space.sm },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  footer: { paddingHorizontal: space.xl, paddingTop: space.lg, gap: space.md },
  primaryBtn: { borderRadius: radius.button, paddingVertical: space.lg, alignItems: 'center' },
  primaryBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  secondaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.sm, borderRadius: radius.button, paddingVertical: space.lg, borderWidth: 1 },
  secondaryBtnText: { fontSize: 16, fontWeight: '700' },
});
