import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { registerTileServiceWorker } from '@/lib/registerTileServiceWorker';
import { MODAL_PAGE_IDS, PAGE_TITLES, type PageId } from '@/ssot/generated/pageRegistry';
import { useThemeColors } from '@/theme/useThemeColors';

const queryClient = new QueryClient();

const modalSet = new Set<string>(MODAL_PAGE_IDS);

function titleForRoute(name: string): string {
  if (name in PAGE_TITLES) return PAGE_TITLES[name as PageId];
  return name;
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
        if (name === '(tabs)' || name === 'index') {
          return { headerShown: false };
        }
        const isModal = modalSet.has(name);
        return {
          headerShown: true,
          title: titleForRoute(name),
          presentation: isModal ? ('modal' as const) : ('card' as const),
          headerStyle: { backgroundColor: c.surface_primary },
          headerTintColor: c.text_primary,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: c.surface_secondary },
          animation: 'fade_from_bottom' as const,
        };
      },
    [c]
  );

  return (
    <GestureHandlerRootView style={[styles.root, { backgroundColor: c.surface_secondary }]}>
      <QueryClientProvider client={queryClient}>
        <BottomSheetModalProvider>
          <View style={[styles.glow, { backgroundColor: c.accent_primary }]} />
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
  glow: {
    position: 'absolute',
    top: -120,
    left: -120,
    width: 240,
    height: 240,
    borderRadius: 999,
    opacity: 0.08,
  },
});
