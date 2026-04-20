import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { GlassSurface } from '@/components/side/GlassSurface';
import { ScreenShell } from '@/components/side/ScreenShell';
import { StateView } from '@/components/side/StateView';
import { GuestGate } from '@/components/GuestGate';
import { useMarkRead, useNotifications } from '@/domain/queries/useNotifications';
import { useThemeColors } from '@/theme/useThemeColors';
import { type as typeStyles } from '@/theme/tokens';

const KIND_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  info: 'information-circle',
  success: 'checkmark-circle',
  warning: 'warning',
  error: 'alert-circle',
  message: 'chatbubble',
  offer: 'pricetag',
  review: 'star',
  system: 'cog',
};

function timeAgo(iso: string | null): string {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
}

function NotificationsContent() {
  const c = useThemeColors();
  const router = useRouter();
  const { data: notifications, isLoading, isError, refetch } = useNotifications();
  const markRead = useMarkRead();

  return (
    <ScreenShell scroll maxWidth="lg" contentClassName="gap-side-md" testID="notifications-screen">
      <GlassSurface variant="elevated" className="gap-side-sm p-side-xl">
        <Text className="text-[12px] font-extrabold uppercase leading-4 tracking-[0px]" style={{ color: c.accent_primary }}>
          Updates
        </Text>
        <Text style={[typeStyles.title, { color: c.text_primary }]}>Notifications</Text>
        <Text className="text-[15px] leading-[22px]" style={{ color: c.text_secondary }}>
          Track messages, offers, reviews, and activity without losing your place in the marketplace.
        </Text>
      </GlassSurface>

      {isLoading ? (
        <StateView icon="notifications-outline" title="Loading notifications" body="Checking recent marketplace activity." />
      ) : isError || !notifications ? (
        <StateView icon="alert-circle" title="Could not load notifications" body="Please try again later." actionLabel="Retry" tone="warning" onAction={() => void refetch()} />
      ) : notifications.length === 0 ? (
        <StateView icon="notifications-outline" title="No notifications yet" body="We'll notify you when something happens." />
      ) : (
        notifications.map((n) => {
          const icon = KIND_ICONS[n.kind] ?? 'information-circle';
          return (
            <GlassSurface
              key={n.id}
              pressable
              selected={!n.read}
              onPress={() => {
                if (!n.read) markRead.mutate(n.id);
                if (n.link) router.push(n.link as never);
              }}
              className="flex-row items-start gap-side-md p-side-lg"
            >
              <View className="size-10 items-center justify-center rounded-[8px]" style={{ backgroundColor: n.read ? c.surface_primary : c.surface_selected }}>
                <Ionicons name={icon} size={18} color={n.read ? c.text_secondary : c.accent_primary} />
              </View>
              <View className="min-w-0 flex-1 gap-[3px]">
                <View className="flex-row items-center gap-side-sm">
                  <Text style={[typeStyles.subtitle, { color: c.text_primary, flex: 1 }]} numberOfLines={1}>
                    {n.title}
                  </Text>
                  <Text className="text-[12px] leading-4" style={{ color: c.text_secondary }}>
                    {timeAgo(n.created_at)}
                  </Text>
                </View>
                <Text className="text-[13px] leading-[19px]" style={{ color: c.text_secondary }} numberOfLines={2}>
                  {n.message}
                </Text>
                {!n.read ? (
                  <Text className="text-[11px] font-extrabold uppercase leading-4 tracking-[0px]" style={{ color: c.accent_primary }}>
                    New
                  </Text>
                ) : null}
              </View>
            </GlassSurface>
          );
        })
      )}
    </ScreenShell>
  );
}

export function NotificationsScreen() {
  return (
    <GuestGate>
      <NotificationsContent />
    </GuestGate>
  );
}
