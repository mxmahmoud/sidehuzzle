import Ionicons from '@expo/vector-icons/Ionicons';
import { usePathname, useRouter } from 'expo-router';
import { Platform, View, useWindowDimensions } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/side/Button';
import { GlassSurface } from '@/components/side/GlassSurface';
import { useThemeStore } from '@/stores/themeStore';
import { useIsDark, useThemeColors } from '@/theme/useThemeColors';

const NAV_ITEMS = [
  { href: '/(tabs)/landing_page', label: 'Home', icon: 'home-outline' },
  { href: '/(tabs)/requests_posts_hub', label: 'Messages', icon: 'chatbubbles-outline' },
  { href: '/(tabs)/post_type_selector', label: 'Post', icon: 'add-circle-outline' },
  { href: '/(tabs)/notifications_list', label: 'Notifications', icon: 'notifications-outline' },
  { href: '/(tabs)/account_profile', label: 'Account', icon: 'person-outline' },
] as const;

function isActive(pathname: string, href: string) {
  const tabPath = href.replace('/(tabs)', '');
  return pathname === href || pathname === tabPath || pathname === `${tabPath}/`;
}

export function AppNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const c = useThemeColors();
  const isDark = useIsDark();
  const setPreference = useThemeStore((s) => s.setPreference);
  const isDesktop = Platform.OS === 'web' && width >= 1024;

  if (!isDesktop) return null;

  const navigate = (href: (typeof NAV_ITEMS)[number]['href']) => {
    router.push(href);
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      window.requestAnimationFrame(() => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });
    }
  };

  return (
    <View className="absolute left-0 right-0 top-0 z-20 items-center px-side-lg pt-side-sm">
      <GlassSurface variant="chrome" className="h-14 w-full max-w-[1120px] flex-row items-center gap-side-md px-side-md py-side-sm">
        <View className="flex-1 flex-row items-center gap-side-sm">
          <View className="size-8 items-center justify-center rounded-lg bg-primary/10">
            <Ionicons name="map-outline" size={15} color={c.accent_primary} />
          </View>
          <Text className="text-[18px] font-black leading-6">Sidehuzle</Text>
        </View>
        <View className="flex-row items-center gap-side-xs">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Button
                key={item.href}
                label={item.label}
                icon={item.icon}
                variant={active ? 'primary' : 'ghost'}
                selected={active}
                className="focus-visible:border-transparent focus-visible:ring-0"
                onPress={() => navigate(item.href)}
                testID={`desktop-nav-${item.label.toLowerCase()}`}
              />
            );
          })}
        </View>
        <View className="flex-1 items-end">
          <Button
            icon={isDark ? 'sunny-outline' : 'moon-outline'}
            variant="icon"
            accessibilityLabel={isDark ? 'Use light mode' : 'Use dark mode'}
            onPress={() => setPreference(isDark ? 'light' : 'dark')}
          />
        </View>
      </GlassSurface>
    </View>
  );
}
