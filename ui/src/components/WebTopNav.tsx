import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useIsDark, useThemeColors } from '@/theme/useThemeColors';
import { useThemeStore } from '@/stores/themeStore';
import { motion, radius, shadow, space } from '@/theme/tokens';

const NAV_ITEMS = [
  { href: '/(tabs)/landing_page', label: 'Home', icon: 'home-outline' },
  { href: '/(tabs)/requests_posts_hub', label: 'Messages', icon: 'chatbubbles-outline' },
  { href: '/(tabs)/post_type_selector', label: 'Post', icon: 'add-circle-outline' },
  { href: '/(tabs)/notifications_list', label: 'Notifications', icon: 'notifications-outline' },
  { href: '/(tabs)/account_profile', label: 'Account', icon: 'person-outline' },
] as const;

type ThemePreference = 'dark' | 'light' | 'system';
const THEME_ICONS: Record<ThemePreference, keyof typeof Ionicons.glyphMap> = {
  dark: 'moon',
  light: 'sunny',
  system: 'sunny',
};

function isActiveRoute(pathname: string, href: string) {
  const tabPath = href.replace('/(tabs)', '');
  return pathname === href || pathname === tabPath || pathname === `${tabPath}/`;
}

export function WebTopNav() {
  if (Platform.OS !== 'web') return null;
  const c = useThemeColors();
  const isDark = useIsDark();
  const router = useRouter();
  const pathname = usePathname();
  const preference = useThemeStore((s) => s.preference);
  const setPreference = useThemeStore((s) => s.setPreference);

  const nextTheme = preference === 'dark' ? 'light' : preference === 'light' ? 'system' : 'dark';
  const themeIcon = preference === 'system' ? (isDark ? 'moon' : 'sunny') : THEME_ICONS[preference];
  const themeLabel =
    preference === 'dark'
      ? 'Switch theme. Current mode: dark'
      : preference === 'light'
        ? 'Switch theme. Current mode: light'
        : `Switch theme. Current mode: system ${isDark ? 'dark' : 'light'}`;
  return (
    <View
      style={[
        styles.shell,
        {
          backgroundColor: c.glass_chrome,
          borderBottomColor: c.glass_border,
          // @ts-ignore – web-only
          WebkitBackdropFilter: `blur(${c.glass_blur_chrome}px) saturate(1.25)`,
          backdropFilter: `blur(${c.glass_blur_chrome}px) saturate(1.25)`,
          ...(Platform.OS === 'web' ? { boxShadow: shadow.chrome.boxShadow } : null),
        },
      ]}
    >
      <View style={styles.inner}>
        <View style={styles.brandGroup}>
          <View style={[styles.brandMark, { backgroundColor: c.surface_selected, borderColor: c.glass_border }]}>
            <Ionicons name="map-outline" size={14} color={c.accent_primary} />
          </View>
          <Text style={[styles.brand, { color: c.text_primary }]}>Sidehuzle</Text>
        </View>
        <View style={[styles.links, { backgroundColor: c.glass_input, borderColor: c.glass_border }]}>
          {NAV_ITEMS.map((item) => {
            const active = isActiveRoute(pathname, item.href);
            return (
              <Pressable
                key={item.href}
                onPress={() => router.push(item.href)}
                style={({ hovered, pressed }) => [
                  styles.navItem,
                  active && { backgroundColor: c.surface_selected, borderColor: c.glass_border_top },
                  hovered && !active && { backgroundColor: c.surface_overlay, borderColor: c.glass_border },
                  hovered && Platform.OS === 'web' ? styles.navItemHover : undefined,
                  pressed && { transform: [{ translateY: 1 }], opacity: 0.9 },
                  hovered && Platform.OS === 'web' ? ({ cursor: 'pointer' } as ViewStyle) : undefined,
                ]}
                accessibilityRole="link"
              >
                <Ionicons name={item.icon} size={18} color={active ? c.accent_primary : c.text_secondary} />
                <Text style={[styles.navLabel, { color: active ? c.text_primary : c.text_secondary }]}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>
        <View style={styles.actions}>
          <Pressable
            onPress={() => setPreference(nextTheme)}
            style={({ hovered, pressed }) => [
              styles.themeBtn,
              { borderColor: c.glass_border, backgroundColor: c.glass_input },
              hovered && Platform.OS === 'web' ? styles.themeHover : undefined,
              pressed ? { transform: [{ scale: 0.96 }], opacity: 0.86 } : undefined,
              hovered && Platform.OS === 'web' ? ({ cursor: 'pointer' } as ViewStyle) : undefined,
            ]}
            accessibilityRole="button"
            accessibilityLabel={themeLabel}
          >
            <Ionicons name={themeIcon} size={19} color={c.text_primary} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    height: 64,
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.lg,
  },
  inner: {
    width: '100%',
    maxWidth: 1180,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.lg,
  },
  brandGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  brandMark: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  brand: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0,
  },
  links: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    borderWidth: 1,
    borderRadius: radius.button,
    padding: 3,
    overflow: 'hidden',
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: 'transparent',
    ...Platform.select({
      web: {
        transitionDuration: `${motion.standardMs}ms`,
        transitionProperty: 'background-color, border-color, box-shadow, opacity, transform',
        transitionTimingFunction: motion.easeOut,
      },
      default: {},
    }),
  },
  navItemHover: {
    transform: [{ translateY: -1 }],
    // @ts-ignore web-only
    boxShadow: shadow.soft.boxShadow,
  },
  navLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  actions: {
    flex: 1,
    alignItems: 'flex-end',
  },
  themeBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    borderRadius: radius.button,
    borderWidth: 1,
    ...Platform.select({
      web: {
        transitionDuration: `${motion.standardMs}ms`,
        transitionProperty: 'background-color, border-color, box-shadow, opacity, transform',
        transitionTimingFunction: motion.easeOut,
      },
      default: {},
    }),
  },
  themeHover: {
    transform: [{ translateY: -2 }],
    // @ts-ignore web-only
    boxShadow: shadow.hover.boxShadow,
  },
});
