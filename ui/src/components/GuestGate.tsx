import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GlassCard } from '@/components/GlassCard';
import { useSessionStore } from '@/stores/sessionStore';
import { useThemeColors } from '@/theme/useThemeColors';
import { radius, space, type as typeStyles } from '@/theme/tokens';

type Props = { children: React.ReactNode };

export function GuestGate({ children }: Props) {
  const c = useThemeColors();
  const isGuest = useSessionStore((s) => s.isGuest());
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      if (isGuest) {
        router.push('/signup_gate');
      }
    }, [isGuest, router]),
  );

  if (isGuest) {
    return (
      <View style={[styles.shell, { backgroundColor: c.surface_secondary }]}>
        <GlassCard style={styles.panel as object}>
          <Text style={[styles.eyebrow, { color: c.accent_primary }]}>Guest access</Text>
          <Text style={[typeStyles.title, { color: c.text_primary }]}>Continue as guest</Text>
          <Text
            style={[
              typeStyles.body,
              { color: c.text_secondary, textAlign: 'center', lineHeight: 22 },
            ]}
          >
            Sign in to use this tab and keep your activity synced across devices.
          </Text>
        </GlassCard>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  shell: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: space.xl },
  panel: {
    width: '100%',
    maxWidth: 420,
    borderRadius: radius.sheet,
    padding: space.xl,
    alignItems: 'center',
    gap: space.md,
  },
  eyebrow: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0 },
});
