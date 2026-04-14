import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions, type ViewStyle } from 'react-native';
import { AmbientGlassBackground } from '@/components/AmbientGlassBackground';
import { GlassCard } from '@/components/GlassCard';
import { assertAuthBackendReachable, getOAuthLoginUrl, login, signup, type OAuthProvider } from '@/data/auth';
import { useThemeColors } from '@/theme/useThemeColors';
import { motion, radius, space, type as typeStyles } from '@/theme/tokens';

function ProviderButton({
  provider,
  label,
  icon,
  loading,
  onPress,
}: {
  provider: OAuthProvider;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  onPress: (provider: OAuthProvider) => void;
}) {
  const c = useThemeColors();
  return (
    <Pressable
      onPress={() => onPress(provider)}
      disabled={loading}
      style={({ pressed, hovered }) => [
        styles.providerButton,
        { borderColor: c.border_subtle, backgroundColor: c.surface_elevated },
        Platform.OS === 'web' ? styles.motion : undefined,
        hovered && Platform.OS === 'web' ? styles.hovered : undefined,
        pressed ? styles.pressed : undefined,
        loading ? styles.disabled : undefined,
        hovered && Platform.OS === 'web' ? ({ cursor: loading ? 'not-allowed' : 'pointer' } as ViewStyle) : undefined,
      ]}
      accessibilityRole="button"
    >
      <Ionicons name={icon} size={18} color={c.text_primary} />
      <Text style={[styles.providerLabel, { color: c.text_primary }]}>{loading ? 'Checking backend...' : label}</Text>
    </Pressable>
  );
}

export function AuthPanel({ mode }: { mode: 'login' | 'signup' }) {
  const c = useThemeColors();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const panelWidth = width >= 700 ? 420 : '100%';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<OAuthProvider | null>(null);
  const [error, setError] = useState<string | null>(null);

  const title = mode === 'login' ? 'Welcome back' : 'Join Sidehuzle';
  const body = mode === 'login' ? 'Continue with your account.' : 'Create your marketplace account.';

  async function handleSubmit() {
    setError(null);
    setLoading(true);
    try {
      if (mode === 'login') {
        await login({ email, password });
      } else {
        await signup({ email, password, username });
      }
      router.replace('/(tabs)/landing_page');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleOAuth(provider: OAuthProvider) {
    setError(null);
    setOauthLoading(provider);
    try {
      await assertAuthBackendReachable();
      if (typeof window !== 'undefined') {
        window.location.assign(getOAuthLoginUrl(provider));
        return;
      }
      setError('Provider sign-in is only available in the web build for now.');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Provider sign-in is unavailable right now.');
    } finally {
      setOauthLoading(null);
    }
  }

  return (
    <View style={[styles.shell, { backgroundColor: c.background_alt }]}>
      <AmbientGlassBackground />
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.replace('/(tabs)/landing_page')}
          accessibilityRole="button"
          style={({ pressed, hovered }) => [
            styles.brandButton,
            { borderColor: c.border_subtle, backgroundColor: c.surface_primary },
            pressed ? styles.pressed : undefined,
            hovered && Platform.OS === 'web' ? ({ cursor: 'pointer' } as ViewStyle) : undefined,
          ]}
        >
          <Text style={[styles.brand, { color: c.text_primary }]}>Sidehuzle</Text>
        </Pressable>
        <Pressable
          onPress={() => router.replace('/(tabs)/landing_page')}
          accessibilityRole="button"
          accessibilityLabel="Back to market"
          style={({ pressed, hovered }) => [
            styles.topIcon,
            { borderColor: c.border_subtle, backgroundColor: c.surface_primary },
            pressed ? styles.pressed : undefined,
            hovered && Platform.OS === 'web' ? ({ cursor: 'pointer' } as ViewStyle) : undefined,
          ]}
        >
          <Ionicons name="close" size={20} color={c.text_primary} />
        </Pressable>
      </View>

      <GlassCard variant="elevated" style={[styles.panel, { maxWidth: panelWidth }]}>
        <Text style={[typeStyles.title, { color: c.text_primary }]}>{title}</Text>
        <Text style={[typeStyles.body, { color: c.text_secondary, textAlign: 'center' }]}>{body}</Text>

        <View style={styles.providerGrid}>
          <ProviderButton provider="google" label="Continue with Google" icon="logo-google" loading={oauthLoading === 'google'} onPress={handleOAuth} />
          <ProviderButton provider="apple" label="Continue with Apple" icon="logo-apple" loading={oauthLoading === 'apple'} onPress={handleOAuth} />
          <ProviderButton provider="microsoft" label="Continue with Microsoft" icon="logo-windows" loading={oauthLoading === 'microsoft'} onPress={handleOAuth} />
        </View>

        <View style={styles.dividerRow}>
          <View style={[styles.divider, { backgroundColor: c.border_subtle }]} />
          <Text style={{ color: c.text_secondary, fontSize: 12, fontWeight: '600' }}>or email</Text>
          <View style={[styles.divider, { backgroundColor: c.border_subtle }]} />
        </View>

        {mode === 'signup' ? (
          <TextInput value={username} onChangeText={setUsername} placeholder="Username" style={[styles.input, { borderColor: c.border_subtle, color: c.text_primary }]} placeholderTextColor={c.text_secondary} />
        ) : null}
        <TextInput value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" keyboardType="email-address" style={[styles.input, { borderColor: c.border_subtle, color: c.text_primary }]} placeholderTextColor={c.text_secondary} />
        <TextInput value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry style={[styles.input, { borderColor: c.border_subtle, color: c.text_primary }]} placeholderTextColor={c.text_secondary} />

        {error ? (
          <Text style={[styles.errorText, { color: '#ef4444' }]}>{error}</Text>
        ) : null}

        <Pressable
          style={({ pressed, hovered }) => [
            styles.primary,
            { backgroundColor: loading ? c.accent_primary + '80' : c.accent_primary },
            Platform.OS === 'web' ? styles.motion : undefined,
            hovered && Platform.OS === 'web' ? styles.hovered : undefined,
            pressed ? styles.pressed : undefined,
          ]}
          onPress={handleSubmit}
          disabled={loading}
          accessibilityRole="button"
        >
          <Text style={styles.primaryText}>{loading ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Create account'}</Text>
        </Pressable>

        <Pressable
          onPress={() => router.replace(mode === 'login' ? '/signup_form' : '/login_form')}
          accessibilityRole="button"
          style={({ hovered }) => [
            styles.switchLink,
            hovered && Platform.OS === 'web' ? ({ cursor: 'pointer' } as ViewStyle) : undefined,
          ]}
        >
          <Text style={[styles.switchText, { color: c.text_secondary }]}>
            {mode === 'login' ? 'New here? Create an account' : 'Already have an account? Log in'}
          </Text>
        </Pressable>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: space.xl },
  topBar: { position: 'absolute', top: space.lg, left: space.lg, right: space.lg, zIndex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brandButton: { minHeight: 42, borderRadius: radius.button, borderWidth: 1, paddingHorizontal: space.md, alignItems: 'center', justifyContent: 'center' },
  brand: { fontSize: 16, lineHeight: 22, fontWeight: '900' },
  topIcon: { width: 42, height: 42, borderRadius: radius.button, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  panel: { width: '100%', padding: space.xl, gap: space.md, alignItems: 'stretch' },
  providerGrid: { gap: space.sm },
  providerButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.sm, borderWidth: 1, borderRadius: radius.button, paddingVertical: space.md },
  providerLabel: { fontSize: 15, fontWeight: '600' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm, marginVertical: space.xs },
  divider: { flex: 1, height: 1 },
  input: { borderWidth: 1, borderRadius: radius.button, paddingHorizontal: space.md, paddingVertical: space.md, fontSize: 16 },
  primary: { marginTop: space.sm, paddingVertical: space.md, borderRadius: radius.button, alignItems: 'center' },
  primaryText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  errorText: { fontSize: 13, fontWeight: '500', textAlign: 'center' },
  switchLink: { alignItems: 'center', paddingVertical: space.xs },
  switchText: { fontSize: 13, fontWeight: '700' },
  motion: { transitionDuration: `${motion.standardMs}ms`, transitionProperty: 'opacity, transform, background-color, border-color', transitionTimingFunction: motion.easeOut } as ViewStyle,
  hovered: { transform: [{ translateY: -2 }] },
  pressed: { opacity: 0.82, transform: [{ scale: 0.985 }] },
  disabled: { opacity: 0.62 },
});
