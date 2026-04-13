import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSessionStore } from '@/stores/sessionStore';
import { useThemeStore } from '@/stores/themeStore';
import { useThemeColors } from '@/theme/useThemeColors';
import { radius, space, type as typeStyles } from '@/theme/tokens';

const QUICK_ACTIONS = [
  { icon: 'person-outline', label: 'Edit profile' },
  { icon: 'shield-checkmark-outline', label: 'Verification' },
  { icon: 'card-outline', label: 'Payments' },
  { icon: 'settings-outline', label: 'Account settings' },
];

export default function AccountProfileRoute() {
  const c = useThemeColors();
  const router = useRouter();
  const user = useSessionStore((s) => s.user);
  const signOut = useSessionStore((s) => s.signOut);
  const preference = useThemeStore((s) => s.preference);
  const setPreference = useThemeStore((s) => s.setPreference);

  const nextTheme = preference === 'dark' ? 'light' : preference === 'light' ? 'system' : 'dark';
  const themeIcon = preference === 'dark' ? 'moon' : preference === 'light' ? 'sunny' : 'contrast-outline';
  const themeLabel = preference === 'dark' ? 'Dark' : preference === 'light' ? 'Light' : 'System';

  return (
    <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.content}>
      <View style={[styles.hero, { backgroundColor: c.surface_primary, borderColor: c.border_subtle }]}>
        <View style={[styles.avatar, { backgroundColor: c.surface_selected }]}>
          <Ionicons name="person" size={28} color={c.text_secondary} />
        </View>
        <Text style={[styles.eyebrow, { color: c.accent_primary }]}>{user ? 'Signed in' : 'Guest'}</Text>
        <Text style={[typeStyles.title, { color: c.text_primary }]}>{user ? (user.first_name || user.username || 'Your account') : 'Your account'}</Text>
        <Text style={{ color: c.text_secondary, fontSize: 14, lineHeight: 21 }}>
          {user ? user.email : 'Log in to manage your profile, preferences, and marketplace activity.'}
        </Text>
      </View>

      <View style={styles.quickGrid}>
        {QUICK_ACTIONS.map((action) => (
          <Pressable
            key={action.label}
            onPress={() => router.push('/account_settings')}
            style={[styles.quickCard, { backgroundColor: c.surface_elevated, borderColor: c.border_subtle }]}
            accessibilityRole="button"
          >
            <Ionicons name={action.icon as any} size={20} color={c.accent_primary} />
            <Text style={[styles.quickLabel, { color: c.text_primary }]}>{action.label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={[styles.section, { backgroundColor: c.surface_primary, borderColor: c.border_subtle }]}>
        <Pressable onPress={() => setPreference(nextTheme)} style={[styles.themeRow, { backgroundColor: c.surface_elevated }]} accessibilityRole="button">
          <Ionicons name={themeIcon as any} size={20} color={c.text_secondary} />
          <Text style={[styles.themeLabel, { color: c.text_primary }]}>{themeLabel} mode</Text>
          <Text style={{ color: c.text_secondary, fontSize: 13 }}>Tap to switch</Text>
        </Pressable>
      </View>

      {user ? (
        <Pressable style={[styles.primary, { backgroundColor: c.accent_primary }]} onPress={() => signOut()} accessibilityRole="button">
          <Text style={styles.primaryText}>Sign out</Text>
        </Pressable>
      ) : (
        <View style={styles.authRow}>
          <Pressable
            onPress={() => router.push('/login_form')}
            style={[styles.secondary, { borderColor: c.border_subtle, backgroundColor: c.surface_elevated }]}
            accessibilityRole="button"
          >
            <Text style={[styles.secondaryText, { color: c.text_primary }]}>Log in</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/signup_form')}
            style={[styles.primary, { backgroundColor: c.accent_primary }]}
            accessibilityRole="button"
          >
            <Text style={styles.primaryText}>Sign up</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: space.xl, gap: space.lg },
  hero: { gap: space.sm, borderRadius: radius.sheet, borderWidth: 1, padding: space.xl, alignItems: 'flex-start' },
  avatar: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: space.sm },
  eyebrow: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  quickCard: { width: '48%', borderRadius: radius.card, borderWidth: 1, padding: space.md, gap: space.sm, minHeight: 88 },
  quickLabel: { fontSize: 14, fontWeight: '600' },
  section: { borderRadius: radius.card, borderWidth: 1, overflow: 'hidden' },
  themeRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.lg, borderRadius: radius.button },
  themeLabel: { flex: 1, fontSize: 15, fontWeight: '500' },
  authRow: { flexDirection: 'row', gap: space.md },
  primary: { flex: 1, paddingVertical: space.md, borderRadius: radius.button, alignItems: 'center' },
  primaryText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  secondary: { flex: 1, borderWidth: 1, paddingVertical: space.md, borderRadius: radius.button, alignItems: 'center' },
  secondaryText: { fontWeight: '600', fontSize: 16 },
});
