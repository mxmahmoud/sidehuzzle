import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { View } from 'react-native';
import { Button } from '@/components/side/Button';
import { GlassSurface } from '@/components/side/GlassSurface';
import { ScreenShell } from '@/components/side/ScreenShell';
import { StateView } from '@/components/side/StateView';
import { TextField } from '@/components/side/TextField';
import { Text } from '@/components/ui/text';
import { assertAuthBackendReachable, getOAuthLoginUrl, login, type OAuthProvider } from '@/data/auth';
import { useThemeColors } from '@/theme/useThemeColors';
import { type as typeStyles } from '@/theme/tokens';

const LOGIN_PROVIDERS: Array<{ provider: OAuthProvider; label: string; icon: keyof typeof Ionicons.glyphMap }> = [
  { provider: 'google', label: 'Continue with Google', icon: 'logo-google' },
  { provider: 'facebook', label: 'Continue with Facebook', icon: 'logo-facebook' },
  { provider: 'apple', label: 'Continue with Apple', icon: 'logo-apple' },
];

type Props = {
  reason?: string;
  testID?: string;
};

export function AccountLoginMask({ reason = 'Log in to open this part of Sidehuzle.', testID = 'account-login-mask' }: Props) {
  const c = useThemeColors();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<OAuthProvider | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);
    setLoading(true);
    try {
      await login({ email, password });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not log in. Please try again.');
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
    <ScreenShell keyboard maxWidth="sm" contentClassName="justify-center gap-side-lg pb-28" testID={testID}>
      <GlassSurface variant="elevated" className="gap-side-lg p-side-xl">
        <View className="items-center gap-side-sm">
          <Text style={[typeStyles.title, { color: c.text_primary }]}>Log in to continue</Text>
          <Text className="text-center text-[15px] leading-[22px]" style={{ color: c.text_secondary }}>
            {reason}
          </Text>
        </View>

        <View className="gap-side-sm">
          {LOGIN_PROVIDERS.map((item) => (
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

        <View className="flex-row items-center gap-side-sm">
          <View className="h-px flex-1" style={{ backgroundColor: c.border_subtle }} />
          <Text className="text-[12px] font-bold leading-4" style={{ color: c.text_secondary }}>
            or email
          </Text>
          <View className="h-px flex-1" style={{ backgroundColor: c.border_subtle }} />
        </View>

        <View className="gap-side-md">
          <TextField label="Email" value={email} onChangeText={setEmail} placeholder="Email address" autoCapitalize="none" keyboardType="email-address" />
          <TextField label="Password" value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
        </View>

        {error ? <StateView icon="alert-circle" title="Login failed" body={error} tone="warning" /> : null}

        <Button label={loading ? 'Please wait...' : 'Log in'} variant="primary" disabled={loading} onPress={handleSubmit} testID="account-login-submit" />
      </GlassSurface>
    </ScreenShell>
  );
}
