import { Stack, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '@/theme/useThemeColors';
import { radius, space, type as typeStyles } from '@/theme/tokens';

export default function SignupGateRoute() {
  const c = useThemeColors();
  const router = useRouter();

  return (
    <View style={[styles.root, { backgroundColor: c.surface_secondary }]}>
      <Stack.Screen options={{ title: 'Join', headerShown: true }} />
      <View style={[styles.panel, { backgroundColor: c.surface_primary, borderColor: c.border_subtle }]}>
        <Text style={[styles.eyebrow, { color: c.accent_primary }]}>Protected area</Text>
        <Text style={[typeStyles.title, { color: c.text_primary }]}>Create an account</Text>
        <Text style={[typeStyles.body, { color: c.text_secondary, lineHeight: 22 }]}>
          Messages, posting, and notifications are gated for guests. Join to manage jobs and respond faster.
        </Text>
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
        <Pressable onPress={() => router.back()} style={styles.ghost} accessibilityRole="button">
          <Text style={{ color: c.text_secondary, fontSize: 15 }}>Continue browsing</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: space.xl, justifyContent: 'center' },
  panel: { gap: space.md, borderRadius: radius.sheet, borderWidth: 1, padding: space.xl },
  eyebrow: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  primary: { paddingVertical: space.md, borderRadius: radius.button, alignItems: 'center' },
  primaryText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  secondary: { borderWidth: 1, paddingVertical: space.md, borderRadius: radius.button, alignItems: 'center' },
  secondaryText: { fontWeight: '600', fontSize: 16 },
  ghost: { alignSelf: 'center', padding: space.md },
});
