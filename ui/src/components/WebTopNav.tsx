import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '@/theme/useThemeColors';
import { useThemeStore } from '@/stores/themeStore';
import { radius, shadow, space } from '@/theme/tokens';

const NAV_ITEMS = [
  { href: '/(tabs)/landing_page', label: 'Home', icon: 'home-outline' },
  { href: '/(tabs)/requests_posts_hub', label: 'Messages', icon: 'chatbubbles-outline' },
  { href: '/(tabs)/post_type_selector', label: 'Post', icon: 'add-circle-outline' },
  { href: '/(tabs)/notifications_list', label: 'Alerts', icon: 'notifications-outline' },
  { href: '/(tabs)/account_profile', label: 'Account', icon: 'person-outline' },
] as const;

type ThemePreference = 'dark' | 'light' | 'system';
const THEME_ICONS: Record<ThemePreference, keyof typeof Ionicons.glyphMap> = {
  dark: 'moon',
  light: 'sunny',
  system: 'contrast-outline',
};

function isActiveRoute(pathname: string, href: string) {
  const tabPath = href.replace('/(tabs)', '');
  return pathname === href || pathname === tabPath || pathname === `${tabPath}/`;
}

export function WebTopNav() {
  const c = useThemeColors();
  const router = useRouter();
  const pathname = usePathname();
  const preference = useThemeStore((s) => s.preference);
  const setPreference = useThemeStore((s) => s.setPreference);

  const nextTheme = preference === 'dark' ? 'light' : preference === 'light' ? 'system' : 'dark';
  const themeLabel = preference === 'dark' ? 'Dark' : preference === 'light' ? 'Light' : 'System';
  const shellShadow = Platform.OS === 'web' ? shadow.card.boxShadow : undefined;

  return (
    <View
      style={[
        styles.shell,
        {
          backgroundColor: c.surface_elevated,
          borderBottomColor: c.border_subtle,
          shadowColor: '#000',
          shadowOpacity: 0.3,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 14 },
          elevation: 18,
        },
        shellShadow ? { boxShadow: shellShadow } : null,
      ]}
    >
      <View style={styles.brandGroup}>
        <View style={[styles.brandMark, { backgroundColor: c.surface_selected, borderColor: c.border_subtle }]}>
          <Ionicons name="sparkles" size={14} color={c.accent_primary} />
        </View>
        <Text style={[styles.brand, { color: c.text_primary }]}>Sidehuzle</Text>
      </View>
      <View style={styles.links}>
        {NAV_ITEMS.map((item) => {
          const active = isActiveRoute(pathname, item.href);
          return (
            <Pressable
              key={item.href}
              onPress={() => router.push(item.href)}
              style={[styles.navItem, active && { backgroundColor: c.surface_selected, borderColor: c.border_strong }]}
              accessibilityRole="link"
            >
              <Ionicons name={item.icon} size={18} color={active ? c.accent_primary : c.text_secondary} />
              <Text style={[styles.navLabel, { color: active ? c.text_primary : c.text_secondary }]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>
      <Pressable onPress={() => setPreference(nextTheme)} style={[styles.themeBtn, { borderColor: c.border_subtle }]} accessibilityRole="button">
        <Ionicons name={THEME_ICONS[preference]} size={18} color={c.text_secondary} />
        <Text style={[styles.themeLabel, { color: c.text_secondary }]}>{themeLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.lg,
    height: 64,
    borderBottomWidth: 1,
    gap: space.lg,
    backdropFilter: 'blur(22px)',
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  brandMark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  brand: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  links: {
    flex: 1,
    flexDirection: 'row',
    gap: space.xs,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.button,
    borderWidth: 1,
  },
  navLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  themeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.button,
    borderWidth: 1,
  },
  themeLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
});
