import '../../global.css';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Platform } from 'react-native';
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
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('light', !isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    const backgroundColor = isDark ? '#090A0A' : '#F6F7F4';
    const backgroundImage = isDark
      ? 'linear-gradient(135deg, #090A0A 0%, #151815 38%, #101211 68%, #0B0D0C 100%)'
      : 'linear-gradient(135deg, #F6F7F4 0%, #E8EDE7 38%, #F9FAF7 70%, #EDEFEB 100%)';
    document.documentElement.style.backgroundColor = backgroundColor;
    document.documentElement.style.backgroundImage = backgroundImage;
    document.documentElement.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundColor = backgroundColor;
    document.body.style.backgroundImage = backgroundImage;
    document.body.style.backgroundAttachment = 'fixed';
    return () => {
      document.documentElement.style.backgroundColor = '';
      document.documentElement.style.backgroundImage = '';
      document.documentElement.style.backgroundAttachment = '';
      document.body.style.backgroundColor = '';
      document.body.style.backgroundImage = '';
      document.body.style.backgroundAttachment = '';
      document.documentElement.style.colorScheme = '';
    };
  }, [c.background, isDark]);

  return null;
}

export default function RootLayout() {
  const c = useThemeColors();
  const isDark = useIsDark();
  useEffect(() => {
    registerTileServiceWorker();
  }, []);

  const navigationTheme = useMemo(() => {
    const baseTheme = isDark ? DarkTheme : DefaultTheme;
    return {
      ...baseTheme,
      dark: isDark,
      colors: {
        ...baseTheme.colors,
        primary: c.accent_primary,
        background: c.background_alt,
        card: c.glass_chrome,
        text: c.text_primary,
        border: c.glass_border,
        notification: c.accent_danger,
      },
    };
  }, [c, isDark]);

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
            backgroundColor: c.glass_chrome,
            // Use boxShadow for web (shadow* props are deprecated on web)
            ...(Platform.OS === 'web'
              ? {
                  boxShadow: shadow.chrome.boxShadow,
                  // @ts-ignore web-only glass
                  WebkitBackdropFilter: `blur(${c.glass_blur_chrome}px)`,
                  backdropFilter: `blur(${c.glass_blur_chrome}px)`,
                }
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
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: c.background_alt }}>
      <QueryClientProvider client={queryClient}>
        <BottomSheetModalProvider>
          <ThemeProvider value={navigationTheme}>
            {/* Session restoration — runs silently on app load */}
            <SessionRestorer />
            {/* Web background gradient */}
            <WebBackgroundGradient />
            <Stack screenOptions={screenOptions} />
          </ThemeProvider>
        </BottomSheetModalProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
