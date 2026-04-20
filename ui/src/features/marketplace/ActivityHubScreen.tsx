import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Text, View } from 'react-native';
import { Button } from '@/components/side/Button';
import { GlassSurface } from '@/components/side/GlassSurface';
import { ScreenShell } from '@/components/side/ScreenShell';
import { StateView } from '@/components/side/StateView';
import { GuestGate } from '@/components/GuestGate';
import { getChatThreads } from '@/domain/api/chatApi';
import { useThemeColors } from '@/theme/useThemeColors';
import { type as typeStyles } from '@/theme/tokens';

function ActivityHubContent() {
  const c = useThemeColors();
  const router = useRouter();
  const { data: threads = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['chat', 'threads'],
    queryFn: getChatThreads,
    throwOnError: false,
  });

  return (
    <ScreenShell scroll maxWidth="lg" contentClassName="gap-side-md" testID="activity-hub">
      <GlassSurface variant="elevated" className="gap-side-sm p-side-xl">
        <Text className="text-[12px] font-extrabold uppercase leading-4 tracking-[0px]" style={{ color: c.accent_primary }}>
          Activity
        </Text>
        <Text style={[typeStyles.title, { color: c.text_primary }]}>Requests & Posts</Text>
        <Text className="text-[15px] leading-[22px]" style={{ color: c.text_secondary }}>
          Conversations, applicants, offers, and posted jobs stay together here.
        </Text>
      </GlassSurface>

      {isLoading ? (
        <StateView icon="chatbubbles-outline" title="Loading conversations" body="Checking recent requests and posts." />
      ) : isError ? (
        <StateView icon="cloud-offline-outline" title="Messages are unavailable" body="Check your session or backend connection." actionLabel="Retry" tone="warning" onAction={() => void refetch()} />
      ) : threads.length === 0 ? (
        <StateView icon="chatbubble-ellipses-outline" title="No conversations yet" body="Open a listing and start a request when you are ready." />
      ) : (
        threads.map((thread) => {
          const lastMessage = thread.messages[thread.messages.length - 1];
          return (
            <GlassSurface key={thread.id} pressable onPress={() => router.push({ pathname: '/chat_thread', params: { id: String(thread.id) } })} className="flex-row items-center gap-side-md p-side-lg">
              <View className="size-11 items-center justify-center rounded-[8px]" style={{ backgroundColor: c.surface_selected }}>
                <Ionicons name="chatbubble-ellipses-outline" size={21} color={c.accent_primary} />
              </View>
              <View className="min-w-0 flex-1 gap-[3px]">
                <Text style={[typeStyles.subtitle, { color: c.text_primary }]} numberOfLines={1}>
                  Task #{thread.task_id}
                </Text>
                <Text className="text-[14px] leading-5" style={{ color: c.text_secondary }} numberOfLines={1}>
                  {lastMessage?.content ?? 'No messages yet'}
                </Text>
              </View>
            </GlassSurface>
          );
        })
      )}

      <GlassSurface pressable onPress={() => router.push('/applicants_list')} className="flex-row items-center gap-side-md p-side-lg">
        <Ionicons name="people-outline" size={22} color={c.accent_primary} />
        <View className="flex-1">
          <Text style={[typeStyles.subtitle, { color: c.text_primary }]}>Applicants</Text>
          <Text className="text-[13px] leading-[18px]" style={{ color: c.text_secondary }}>
            Review who applied to your jobs.
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={c.text_secondary} />
      </GlassSurface>

      <Button label="Post new work" icon="add-circle-outline" variant="primary" onPress={() => router.push('/(tabs)/post_type_selector')} />
    </ScreenShell>
  );
}

export function ActivityHubScreen() {
  return (
    <GuestGate>
      <ActivityHubContent />
    </GuestGate>
  );
}
