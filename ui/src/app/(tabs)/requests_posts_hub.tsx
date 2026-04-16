import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { GuestGate } from '@/components/GuestGate';
import { getChatThreads } from '@/domain/api/chatApi';
import { useThemeColors } from '@/theme/useThemeColors';
import { radius, space, type as typeStyles } from '@/theme/tokens';

function HubContent() {
  const c = useThemeColors();
  const router = useRouter();
  const { data: threads = [], isLoading, isError } = useQuery({
    queryKey: ['chat', 'threads'],
    queryFn: getChatThreads,
    throwOnError: false,
  });

  return (
    <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.content}>
      <Text style={[styles.eyebrow, { color: c.accent_primary }]}>Activity</Text>
      <Text style={[typeStyles.title, { color: c.text_primary }]}>Requests & Posts</Text>
      <Text style={[typeStyles.body, { color: c.text_secondary, lineHeight: 22, marginBottom: space.md }]}>
        Conversations, applicants, and posted jobs stay together here.
      </Text>

      <View style={[styles.sectionCard, { backgroundColor: c.surface_primary, borderColor: c.border_subtle }]}>
        <Text style={[typeStyles.subtitle, { color: c.text_primary }]}>Recent activity</Text>
        <Text style={{ color: c.text_secondary, fontSize: 13, lineHeight: 20 }}>Track replies, offers, and open requests in one place.</Text>
      </View>

      {isLoading ? (
        <View style={[styles.sectionCard, { backgroundColor: c.surface_primary, borderColor: c.border_subtle }]}>
          <Text style={[typeStyles.body, { color: c.text_secondary }]}>Loading conversations...</Text>
        </View>
      ) : isError ? (
        <View style={[styles.sectionCard, { backgroundColor: c.surface_primary, borderColor: c.border_subtle }]}>
          <Text style={[typeStyles.body, { color: c.text_secondary }]}>Messages are unavailable. Check your session or backend.</Text>
        </View>
      ) : threads.length === 0 ? (
        <View style={[styles.sectionCard, { backgroundColor: c.surface_primary, borderColor: c.border_subtle }]}>
          <Text style={[typeStyles.subtitle, { color: c.text_primary }]}>No conversations yet</Text>
          <Text style={{ color: c.text_secondary, fontSize: 13, lineHeight: 20 }}>Open a listing and start a request when you are ready.</Text>
        </View>
      ) : (
        threads.map((thread) => {
          const lastMessage = thread.messages[thread.messages.length - 1];
          return (
            <Pressable
              key={thread.id}
              onPress={() => router.push({ pathname: '/chat_thread', params: { id: String(thread.id) } })}
              style={[styles.threadRow, { backgroundColor: c.surface_elevated, borderColor: c.border_subtle }]}
              accessibilityRole="button"
            >
              <View style={[styles.avatar, { backgroundColor: c.surface_selected }]}>
                <Ionicons name="chatbubble-ellipses-outline" size={20} color={c.accent_primary} />
              </View>
              <View style={styles.threadBody}>
                <View style={styles.threadTop}>
                  <Text style={[typeStyles.subtitle, { color: c.text_primary, flex: 1 }]} numberOfLines={1}>
                    Task #{thread.task_id}
                  </Text>
                  <Text style={{ color: c.text_secondary, fontSize: 12 }}>
                    Room {thread.id}
                  </Text>
                </View>
                <Text style={{ color: c.text_secondary, fontSize: 14 }} numberOfLines={1}>
                  {lastMessage?.content ?? 'No messages yet'}
                </Text>
              </View>
            </Pressable>
          );
        })
      )}

      <Pressable
        onPress={() => router.push('/applicants_list')}
        style={[styles.actionCard, { backgroundColor: c.surface_elevated, borderColor: c.border_subtle }]}
        accessibilityRole="button"
      >
        <Ionicons name="people-outline" size={22} color={c.accent_primary} />
        <View style={{ flex: 1 }}>
          <Text style={[typeStyles.subtitle, { color: c.text_primary }]}>Applicants</Text>
          <Text style={{ color: c.text_secondary, fontSize: 13 }}>Review who applied to your jobs</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={c.text_secondary} />
      </Pressable>
    </ScrollView>
  );
}

export default function RequestsPostsHubRoute() {
  return (
    <GuestGate>
      <HubContent />
    </GuestGate>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { width: '100%', maxWidth: 920, alignSelf: 'center', padding: space.xl, gap: space.md },
  eyebrow: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0 },
  sectionCard: { gap: 4, padding: space.lg, borderRadius: radius.card, borderWidth: 1, marginBottom: space.sm },
  threadRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.lg, borderRadius: radius.card, borderWidth: 1 },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  threadBody: { flex: 1, gap: 4 },
  threadTop: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  unreadDot: { width: 10, height: 10, borderRadius: 5 },
  actionCard: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.lg, borderRadius: radius.card, borderWidth: 1, marginTop: space.md },
});
