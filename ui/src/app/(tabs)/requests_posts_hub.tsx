import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { GuestGate } from '@/components/GuestGate';
import { useThemeColors } from '@/theme/useThemeColors';
import { radius, space, type as typeStyles } from '@/theme/tokens';

const MOCK_THREADS = [
  { id: '1', name: 'Alex — Handyman', lastMessage: 'I can come tomorrow at 2pm', time: '2h ago', unread: true, kind: 'worker' },
  { id: '2', name: 'Deep clean 2BR', lastMessage: 'Offer accepted! Let\'s discuss details.', time: '5h ago', unread: false, kind: 'job' },
  { id: '3', name: 'Sam — Cleaner', lastMessage: 'Thanks for the review!', time: '1d ago', unread: false, kind: 'worker' },
];

function HubContent() {
  const c = useThemeColors();
  const router = useRouter();

  return (
    <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.content}>
      <Text style={[styles.eyebrow, { color: c.accent_primary }]}>Activity</Text>
      <Text style={[typeStyles.title, { color: c.text_primary }]}>Requests & Posts</Text>
      <Text style={[typeStyles.body, { color: c.text_secondary, lineHeight: 22, marginBottom: space.md }]}>
        Conversations, applicants, and posted jobs live here.
      </Text>

      <View style={[styles.sectionCard, { backgroundColor: c.surface_primary, borderColor: c.border_subtle }]}>
        <Text style={[typeStyles.subtitle, { color: c.text_primary }]}>Recent activity</Text>
        <Text style={{ color: c.text_secondary, fontSize: 13, lineHeight: 20 }}>Track replies, offers, and open requests in one place.</Text>
      </View>

      {MOCK_THREADS.map((thread) => (
        <Pressable
          key={thread.id}
          onPress={() => router.push('/chat_thread')}
          style={[styles.threadRow, { backgroundColor: c.surface_elevated, borderColor: c.border_subtle }]}
          accessibilityRole="button"
        >
          <View style={[styles.avatar, { backgroundColor: thread.kind === 'job' ? 'rgba(109,156,255,0.22)' : 'rgba(255,94,168,0.22)' }]}>
            <Ionicons name={thread.kind === 'job' ? 'briefcase-outline' : 'person-outline'} size={20} color={c.text_secondary} />
          </View>
          <View style={styles.threadBody}>
            <View style={styles.threadTop}>
              <Text style={[typeStyles.subtitle, { color: c.text_primary, flex: 1 }]} numberOfLines={1}>{thread.name}</Text>
              <Text style={{ color: c.text_secondary, fontSize: 12 }}>{thread.time}</Text>
            </View>
            <Text style={{ color: c.text_secondary, fontSize: 14 }} numberOfLines={1}>{thread.lastMessage}</Text>
          </View>
          {thread.unread && <View style={[styles.unreadDot, { backgroundColor: c.accent_primary }]} />}
        </Pressable>
      ))}

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
  content: { padding: space.xl, gap: space.md },
  eyebrow: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  sectionCard: { gap: 4, padding: space.lg, borderRadius: radius.card, borderWidth: 1, marginBottom: space.sm },
  threadRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.lg, borderRadius: radius.card, borderWidth: 1 },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  threadBody: { flex: 1, gap: 4 },
  threadTop: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  unreadDot: { width: 10, height: 10, borderRadius: 5 },
  actionCard: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.lg, borderRadius: radius.card, borderWidth: 1, marginTop: space.md },
});
