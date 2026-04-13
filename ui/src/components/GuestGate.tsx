import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSessionStore } from '@/stores/sessionStore';
import { useThemeColors } from '@/theme/useThemeColors';
import { space, type as typeStyles } from '@/theme/tokens';

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
    }, [isGuest, router])
  );

  if (isGuest) {
    return (
      <View style={[styles.fallback, { backgroundColor: c.surface_secondary }]}>
        <Text style={[typeStyles.body, { color: c.text_secondary }]}>Sign in to use this tab</Text>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  fallback: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: space.xl },
});
