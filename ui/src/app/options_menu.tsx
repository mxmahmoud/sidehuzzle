import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSessionStore } from '@/stores/sessionStore';
import { useThemeStore } from '@/stores/themeStore';
import { useThemeColors } from '@/theme/useThemeColors';
import { radius, space, type as typeStyles } from '@/theme/tokens';

type MenuItemProps = {
  icon: string;
  label: string;
  onPress: () => void;
  accent?: boolean;
};

function MenuItem({ icon, label, onPress, accent }: MenuItemProps) {
  const c = useThemeColors();
  return (
    <Pressable onPress={onPress} style={[styles.menuItem, { borderBottomColor: c.border_subtle }]} accessibilityRole="button">
      <Ionicons name={icon as any} size={20} color={accent ? c.accent_primary : c.text_secondary} />
      <Text style={[styles.menuLabel, { color: c.text_primary }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={c.text_secondary} />
    </Pressable>
  );
}

export default function OptionsMenuRoute() {
  const c = useThemeColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isGuest = useSessionStore((s) => s.isGuest());
  const signOut = useSessionStore((s) => s.signOut);
  const preference = useThemeStore((s) => s.preference);
  const setPreference = useThemeStore((s) => s.setPreference);

  const nextTheme = preference === 'dark' ? 'light' : preference === 'light' ? 'system' : 'dark';
  const themeLabel = preference === 'dark' ? 'Dark mode' : preference === 'light' ? 'Light mode' : 'System theme';

  return (
    <View style={[styles.root, { backgroundColor: c.surface_secondary }]}>
      <Stack.Screen options={{ title: 'Menu', presentation: 'modal' }} />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + space.xl }]}>
        <View style={[styles.section, { backgroundColor: c.surface_primary, borderColor: c.border_subtle }]}>
          <MenuItem icon="search" label="Search" onPress={() => { router.back(); router.push('/search_screen'); }} />
          <MenuItem icon="bookmark-outline" label="Saved posts" onPress={() => { router.back(); router.push('/saved_posts'); }} />
          <MenuItem icon="grid-outline" label="Categories" onPress={() => { router.back(); router.push('/categories_overview'); }} />
          <MenuItem icon="time-outline" label="History" onPress={() => { router.back(); router.push('/history_page'); }} />
        </View>

        <View style={[styles.section, { backgroundColor: c.surface_primary, borderColor: c.border_subtle }]}>
          <MenuItem icon="diamond-outline" label="Membership" onPress={() => { router.back(); router.push('/membership_status'); }} accent />
          <MenuItem icon="people-outline" label="Followed users" onPress={() => { router.back(); router.push('/followed_users_list'); }} />
          <MenuItem icon="document-text-outline" label="Imprint" onPress={() => { router.back(); router.push('/imprint_page'); }} />
        </View>

        <View style={[styles.section, { backgroundColor: c.surface_primary, borderColor: c.border_subtle }]}>
          <Pressable onPress={() => setPreference(nextTheme)} style={[styles.menuItem, { borderBottomColor: c.border_subtle }]} accessibilityRole="button">
            <Ionicons name={preference === 'dark' ? 'moon' : preference === 'light' ? 'sunny' : 'contrast-outline'} size={20} color={c.text_secondary} />
            <Text style={[styles.menuLabel, { color: c.text_primary }]}>{themeLabel}</Text>
            <Text style={[styles.menuMeta, { color: c.text_secondary }]}>Tap to switch</Text>
          </Pressable>
        </View>

        {isGuest ? (
          <View style={[styles.section, { backgroundColor: c.surface_primary, borderColor: c.border_subtle }]}>
            <MenuItem icon="log-in-outline" label="Log in" onPress={() => { router.back(); router.push('/login_form'); }} accent />
            <MenuItem icon="person-add-outline" label="Sign up" onPress={() => { router.back(); router.push('/signup_form'); }} />
          </View>
        ) : (
          <View style={[styles.section, { backgroundColor: c.surface_primary, borderColor: c.border_subtle }]}>
            <MenuItem icon="settings-outline" label="Account settings" onPress={() => { router.back(); router.push('/account_settings'); }} />
            <Pressable onPress={() => { signOut(); router.back(); }} style={[styles.menuItem, { borderBottomColor: c.border_subtle }]} accessibilityRole="button">
              <Ionicons name="log-out-outline" size={20} color={c.accent_warning} />
              <Text style={[styles.menuLabel, { color: c.accent_warning }]}>Sign out</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: space.lg, gap: space.lg },
  section: { borderRadius: radius.card, borderWidth: 1, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.lg, paddingHorizontal: space.lg, borderBottomWidth: StyleSheet.hairlineWidth },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '500' },
  menuMeta: { fontSize: 13 },
});
