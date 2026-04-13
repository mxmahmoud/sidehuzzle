import { Stack, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { login } from '@/data/auth';
import { useThemeColors } from '@/theme/useThemeColors';
import { radius, space, type as typeStyles } from '@/theme/tokens';

export default function LoginFormRoute() {
  const c = useThemeColors();
  const router = useRouter();

  return (
    <View style={[styles.root, { backgroundColor: c.surface_secondary }]}>
      <Stack.Screen options={{ title: 'Log in', headerShown: true }} />
      <View style={[styles.panel, { backgroundColor: c.surface_primary, borderColor: c.border_subtle }]}>
        <Text style={[styles.eyebrow, { color: c.accent_primary }]}>Welcome back</Text>
        <Text style={[typeStyles.title, { color: c.text_primary }]}>Log in</Text>
        <Text style={[typeStyles.body, { color: c.text_secondary, lineHeight: 22 }]}>Use the backend session login to enter the app.</Text>
        <Pressable
          style={[styles.primary, { backgroundColor: c.accent_primary }]}
          onPress={async () => {
            await login({ email: 'demo@sidehuzle.local', password: 'demo-password' });
            router.replace('/(tabs)/landing_page');
          }}
          accessibilityRole="button"
        >
          <Text style={styles.primaryText}>Continue</Text>
        </Pressable>
        <Pressable style={[styles.secondary, { borderColor: c.border_subtle, backgroundColor: c.surface_elevated }]} onPress={() => router.back()} accessibilityRole="button">
          <Text style={[styles.secondaryText, { color: c.text_primary }]}>Back</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: space.xl, justifyContent: 'center' },
  panel: { gap: space.md, borderRadius: radius.sheet, borderWidth: 1, padding: space.xl },
  eyebrow: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  primary: { marginTop: space.lg, paddingVertical: space.md, borderRadius: radius.button, alignItems: 'center' },
  primaryText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  secondary: { borderWidth: 1, paddingVertical: space.md, borderRadius: radius.button, alignItems: 'center' },
  secondaryText: { fontWeight: '600', fontSize: 16 },
});
