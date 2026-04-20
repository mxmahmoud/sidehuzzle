import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { Button } from '@/components/side/Button';
import { GlassSurface } from '@/components/side/GlassSurface';
import { ScreenShell } from '@/components/side/ScreenShell';
import { StateView } from '@/components/side/StateView';
import { TextField } from '@/components/side/TextField';
import { assertAuthBackendReachable, getOAuthLoginUrl, login, signup, type OAuthProvider } from '@/data/auth';
import { useThemeColors } from '@/theme/useThemeColors';
import { type as typeStyles } from '@/theme/tokens';

const PROVIDERS: Array<{ provider: OAuthProvider; label: string; icon: keyof typeof Ionicons.glyphMap }> = [
  { provider: 'google', label: 'Continue with Google', icon: 'logo-google' },
  { provider: 'facebook', label: 'Continue with Facebook', icon: 'logo-facebook' },
  { provider: 'apple', label: 'Continue with Apple', icon: 'logo-apple' },
];

export function MarketplaceAuthPanel({ mode }: { mode: 'login' | 'signup' }) {
  const c = useThemeColors();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<OAuthProvider | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isLogin = mode === 'login';

  async function handleSubmit() {
    setError(null);
    setLoading(true);
    try {
      if (isLogin) await login({ email, password });
      else await signup({ email, password, username });
      router.replace('/(tabs)/landing_page');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Provider sign-in is unavailable right now.');
    } finally {
      setOauthLoading(null);
    }
  }

  return (
    <View className="flex-1" style={{ backgroundColor: c.background_alt }} testID={`${mode}-panel`}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScreenShell keyboard maxWidth="sm" contentClassName="justify-center gap-side-lg" withBackground>
        <View className="absolute left-side-lg right-side-lg top-side-lg z-[2] flex-row items-center justify-between">
          <Button label="Sidehuzle" variant="secondary" onPress={() => router.replace('/(tabs)/landing_page')} />
          <Button icon="close" variant="icon" accessibilityLabel="Back to marketplace" onPress={() => router.replace('/(tabs)/landing_page')} />
        </View>

        <GlassSurface variant="elevated" className="gap-side-md p-side-xl">
          <View className="items-center gap-side-sm">
            <Text style={[typeStyles.title, { color: c.text_primary }]}>{isLogin ? 'Welcome back' : 'Join Sidehuzle'}</Text>
            <Text className="text-center text-[15px] leading-[22px]" style={{ color: c.text_secondary }}>
              {isLogin ? 'Continue with your marketplace account.' : 'Create your account to post jobs, offer services, and manage trust signals.'}
            </Text>
          </View>

          <View className="gap-side-sm">
            {PROVIDERS.map((item) => (
              <Button
                key={item.provider}
                label={oauthLoading === item.provider ? 'Checking backend...' : item.label}
                icon={item.icon}
                variant="secondary"
                disabled={!!oauthLoading}
                onPress={() => handleOAuth(item.provider)}
              />
            ))}
          </View>

          <View className="flex-row items-center gap-side-sm py-side-xs">
            <View className="h-px flex-1" style={{ backgroundColor: c.border_subtle }} />
            <Text className="text-[12px] font-bold leading-4" style={{ color: c.text_secondary }}>
              or email
            </Text>
            <View className="h-px flex-1" style={{ backgroundColor: c.border_subtle }} />
          </View>

          {!isLogin ? <TextField label="Username" value={username} onChangeText={setUsername} placeholder="Username" autoCapitalize="none" /> : null}
          <TextField label="Email" value={email} onChangeText={setEmail} placeholder="Email address" autoCapitalize="none" keyboardType="email-address" />
          <TextField label="Password" value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />

          {error ? <StateView icon="alert-circle" title="Authentication failed" body={error} tone="warning" /> : null}

          <Button
            label={loading ? 'Please wait...' : isLogin ? 'Log in' : 'Create account'}
            variant="primary"
            disabled={loading}
            onPress={handleSubmit}
            testID={`${mode}-submit`}
          />
          <Button
            label={isLogin ? 'New here? Create an account' : 'Already have an account? Log in'}
            variant="ghost"
            onPress={() => router.replace(isLogin ? '/signup_form' : '/login_form')}
          />
          <Button
            label="Back to marketplace"
            icon="arrow-back"
            variant="secondary"
            onPress={() => router.replace('/(tabs)/landing_page')}
            testID={`${mode}-back-home`}
          />
        </GlassSurface>
      </ScreenShell>
    </View>
  );
}
