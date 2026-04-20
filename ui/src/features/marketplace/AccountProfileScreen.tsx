import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { Button } from '@/components/side/Button';
import { GlassSurface } from '@/components/side/GlassSurface';
import { ProfileHeader } from '@/components/side/ProfileHeader';
import { ScreenShell } from '@/components/side/ScreenShell';
import { AccountLoginMask } from '@/features/marketplace/AccountLoginMask';
import { useSessionStore } from '@/stores/sessionStore';
import { useThemeStore } from '@/stores/themeStore';
import { useThemeColors } from '@/theme/useThemeColors';
import { type as typeStyles } from '@/theme/tokens';

const PROFILE_STATS = [
  { label: 'Rating', value: '4.8' },
  { label: 'Jobs', value: '12' },
  { label: 'Trust', value: '3/4' },
];

const ACCOUNT_SECTIONS: Array<{
  title: string;
  rows: Array<{ icon: keyof typeof Ionicons.glyphMap; label: string; detail: string; href: string; meta?: string }>;
}> = [
  {
    title: 'Profile',
    rows: [
      { icon: 'person-outline', label: 'Edit profile', detail: 'Public bio, username, skills, gallery, and documents', href: '/account_info_edit' },
      { icon: 'eye-outline', label: 'Public profile', detail: 'Preview how customers and pros see your account', href: '/user_profile_external' },
      { icon: 'share-social-outline', label: 'Share profile', detail: 'Send your profile to customers or collaborators', href: '/share_profile' },
    ],
  },
  {
    title: 'Trust and work',
    rows: [
      { icon: 'shield-checkmark-outline', label: 'Verification', detail: 'Email, phone, ID, and address trust signals', href: '/verification_pending_email', meta: '3/4' },
      { icon: 'briefcase-outline', label: 'Posted jobs', detail: 'Review requests, applicants, and post actions', href: '/user_posted_jobs_list', meta: '2 open' },
      { icon: 'ribbon-outline', label: 'Offered services', detail: 'Create or update the service profile customers discover', href: '/worker_service_form' },
      { icon: 'star-outline', label: 'Reviews', detail: 'Customer and worker feedback', href: '/user_reviews', meta: '4.8' },
    ],
  },
  {
    title: 'Account',
    rows: [
      { icon: 'card-outline', label: 'Payment methods', detail: 'Manage cards and booking payment preferences', href: '/payment_cards_manage' },
      { icon: 'notifications-outline', label: 'Notifications', detail: 'Choose which updates reach you', href: '/settings_notifications' },
      { icon: 'settings-outline', label: 'Account settings', detail: 'Security, privacy, data, and membership', href: '/account_settings' },
    ],
  },
];

function AccountSection({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ icon: keyof typeof Ionicons.glyphMap; label: string; detail: string; href: string; meta?: string }>;
}) {
  const c = useThemeColors();
  const router = useRouter();

  return (
    <GlassSurface variant="surface" className="gap-side-md p-side-lg">
      <Text style={[typeStyles.subtitle, { color: c.text_primary }]}>{title}</Text>
      <View>
        {rows.map((row, index) => (
          <Pressable
            key={row.href}
            accessibilityRole="button"
            accessibilityLabel={row.label}
            onPress={() => router.push(row.href as never)}
            className="min-h-[66px] flex-row items-center gap-side-md py-side-sm web:cursor-pointer"
            style={index === 0 ? undefined : { borderTopWidth: 1, borderTopColor: c.border_subtle }}
          >
            <View className="size-10 items-center justify-center rounded-lg bg-secondary">
              <Ionicons name={row.icon} size={18} color={c.accent_primary} />
            </View>
            <View className="min-w-0 flex-1 gap-[2px]">
              <View className="flex-row items-center gap-side-sm">
                <Text className="min-w-0 flex-1 text-[15px] font-bold leading-5" style={{ color: c.text_primary }} numberOfLines={1}>
                  {row.label}
                </Text>
                {row.meta ? (
                  <Text className="text-[12px] font-extrabold leading-4" style={{ color: c.accent_primary }}>
                    {row.meta}
                  </Text>
                ) : null}
              </View>
              <Text className="text-[13px] leading-[18px]" style={{ color: c.text_secondary }} numberOfLines={2}>
                {row.detail}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={c.text_secondary} />
          </Pressable>
        ))}
      </View>
    </GlassSurface>
  );
}

export function AccountProfileScreen() {
  const c = useThemeColors();
  const user = useSessionStore((s) => s.user);
  const signOut = useSessionStore((s) => s.signOut);
  const preference = useThemeStore((s) => s.preference);
  const setPreference = useThemeStore((s) => s.setPreference);
  const nextTheme = preference === 'dark' ? 'light' : preference === 'light' ? 'system' : 'dark';
  const themeLabel = preference === 'dark' ? 'Dark' : preference === 'light' ? 'Light' : 'System';

  if (!user) {
    return <AccountLoginMask reason="Log in to manage your profile, payments, messages, and trusted marketplace activity." />;
  }

  return (
    <ScreenShell scroll maxWidth="lg" contentClassName="gap-side-lg" testID="account-profile">
      <ProfileHeader
        eyebrow="Signed in"
        title={user.first_name || user.username || 'Your account'}
        body={user.email}
        meta="Profile, trust, jobs, services, and payments"
      />

      <View className="flex-row gap-side-sm">
        {PROFILE_STATS.map((stat) => (
          <GlassSurface key={stat.label} variant="control" className="min-h-[76px] flex-1 items-center justify-center gap-[2px] p-side-sm">
            <Text className="text-[20px] font-black leading-7" style={{ color: c.text_primary }}>
              {stat.value}
            </Text>
            <Text className="text-[12px] font-bold leading-4" style={{ color: c.text_secondary }}>
              {stat.label}
            </Text>
          </GlassSurface>
        ))}
      </View>

      {ACCOUNT_SECTIONS.map((section) => (
        <AccountSection key={section.title} title={section.title} rows={section.rows} />
      ))}

      <GlassSurface variant="surface" className="gap-side-md p-side-lg">
        <Text style={[typeStyles.subtitle, { color: c.text_primary }]}>Display mode</Text>
        <Text className="text-[14px] leading-[21px]" style={{ color: c.text_secondary }}>
          Current mode: {themeLabel}. Tap to cycle dark, light, and system.
        </Text>
        <Button label={`Switch from ${themeLabel}`} icon="contrast-outline" variant="secondary" onPress={() => setPreference(nextTheme)} />
      </GlassSurface>

      <View className="items-center">
        <Button label="Sign out" icon="log-out-outline" variant="danger" className="min-w-[160px] max-w-[220px]" onPress={signOut} />
      </View>
    </ScreenShell>
  );
}
