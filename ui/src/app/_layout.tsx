import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { registerTileServiceWorker } from '@/lib/registerTileServiceWorker';
import { MODAL_PAGE_IDS, PAGE_TITLES, type PageId } from '@/ssot/generated/pageRegistry';
import { useIsDark, useThemeColors } from '@/theme/useThemeColors';
import { getSession } from '@/domain/api/authApi';
import { useSessionStore } from '@/stores/sessionStore';
import { shadow } from '@/theme/tokens';

const queryClient = new QueryClient();

const modalSet = new Set<string>(MODAL_PAGE_IDS);

function titleForRoute(name: string): string {
  if (name in PAGE_TITLES) return PAGE_TITLES[name as PageId];
  return name;
}

function SessionRestorer() {
  const signIn = useSessionStore((s) => s.signIn);

  useEffect(() => {
    getSession()
      .then((user) => {
        if (user) signIn(user);
      })
      // Silently ignore errors — user stays as guest
      .catch(() => {});
  }, [signIn]);

  return null;
}

function WebBackgroundGradient() {
  const c = useThemeColors();
  const isDark = useIsDark();

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.style.background = isDark
      ? 'linear-gradient(135deg, #17211E 0%, #24342F 48%, #1C2925 100%)'
      : 'linear-gradient(135deg, #F8FCF9 0%, #E7F4EF 42%, #F6FAF8 72%, #EAF3F4 100%)';
    document.body.style.background = 'transparent';
    return () => {
      document.documentElement.style.background = '';
    };
  }, [c.background, isDark]);

  return null;
}

export default function RootLayout() {
  const c = useThemeColors();

  useEffect(() => {
    registerTileServiceWorker();
  }, []);

  const screenOptions = useMemo(
    () =>
      ({ route }: { route: { name: string } }) => {
        const name = route.name;
        if (name === '(tabs)' || name === 'index' || name === 'landing_page') {
          return { headerShown: false };
        }
        const isModal = modalSet.has(name);
        return {
          headerShown: true,
          title: titleForRoute(name),
          presentation: isModal ? ('modal' as const) : ('card' as const),
          headerStyle: {
            backgroundColor: c.surface_primary,
            // Use boxShadow for web (shadow* props are deprecated on web)
            ...(Platform.OS === 'web'
              ? { boxShadow: shadow.card.boxShadow }
              : {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.18,
                  shadowRadius: 24,
                  elevation: 12,
                }),
          },
          headerTintColor: c.text_primary,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: c.background_alt },
          animation: 'fade_from_bottom' as const,
          // Intercept back button on login/signup to navigate to landing instead of using browser history
          ...(name === 'login_form' || name === 'signup_form'
            ? {
                headerBackTitle: 'Home',
                headerBackVisible: true,
              }
            : {}),
        };
      },
    [c],
  );

  return (
    <GestureHandlerRootView style={[styles.root, { backgroundColor: c.background }]}>
      <QueryClientProvider client={queryClient}>
        <BottomSheetModalProvider>
          {/* Session restoration — runs silently on app load */}
          <SessionRestorer />
          {/* Web background gradient */}
          <WebBackgroundGradient />
          <Stack screenOptions={screenOptions} />
        </BottomSheetModalProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
