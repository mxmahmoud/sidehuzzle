import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { GuestGate } from '@/components/GuestGate';
import { useThemeColors } from '@/theme/useThemeColors';
import { radius, space, type as typeStyles } from '@/theme/tokens';

const MOCK_NOTIFICATIONS = [
  { id: '1', icon: 'chatbubble' as const, title: 'New message from Alex', body: 'About your cleaning request', time: '10m ago', read: false, group: 'Messages' },
  { id: '2', icon: 'checkmark-circle' as const, title: 'Offer accepted', body: 'Deep clean 2BR — Sam confirmed', time: '2h ago', read: false, group: 'Requests' },
  { id: '3', icon: 'star' as const, title: 'New review', body: 'Jordan rated you 5 stars', time: '1d ago', read: true, group: 'Reputation' },
  { id: '4', icon: 'person-add' as const, title: 'New follower', body: 'Riley started following you', time: '2d ago', read: true, group: 'Community' },
];

function NotificationsContent() {
  const c = useThemeColors();
  const router = useRouter();

  return (
    <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.content}>
      <View style={[styles.hero, { backgroundColor: c.surface_primary, borderColor: c.border_subtle }]}>
        <Text style={[styles.eyebrow, { color: c.accent_primary }]}>Updates</Text>
        <Text style={[typeStyles.title, { color: c.text_primary }]}>Notifications</Text>
        <Text style={{ color: c.text_secondary, fontSize: 14, lineHeight: 21 }}>
          Track messages, offers, reviews, and activity without losing your place in the marketplace.
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: c.text_secondary }]}>Recent activity</Text>
        <Text style={{ color: c.text_secondary, fontSize: 13 }}>4 items</Text>
      </View>

      {MOCK_NOTIFICATIONS.map((n) => (
        <Pressable
          key={n.id}
          onPress={() => {
            if (n.icon === 'chatbubble') router.push('/chat_thread');
            else if (n.icon === 'checkmark-circle') router.push('/(tabs)/requests_posts_hub');
            else router.push('/(tabs)/landing_page');
          }}
          style={[styles.notifRow, { backgroundColor: n.read ? c.surface_elevated : c.surface_selected, borderColor: c.border_subtle }]}
          accessibilityRole="button"
        >
          <View style={[styles.iconCircle, { backgroundColor: n.read ? c.surface_primary : 'rgba(255,107,87,0.15)' }]}>
            <Ionicons name={n.icon} size={18} color={n.read ? c.text_secondary : c.accent_primary} />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <View style={styles.rowTop}>
              <Text style={[typeStyles.subtitle, { color: c.text_primary, flex: 1 }]}>{n.title}</Text>
              <Text style={{ color: c.text_secondary, fontSize: 12 }}>{n.time}</Text>
            </View>
            <Text style={{ color: c.text_secondary, fontSize: 13, lineHeight: 19 }}>{n.body}</Text>
            <Text style={{ color: c.accent_primary, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 }}>{n.group}</Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

export default function NotificationsListRoute() {
  return (
    <GuestGate>
      <NotificationsContent />
    </GuestGate>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: space.xl, gap: space.md },
  hero: { gap: space.sm, padding: space.lg, borderRadius: radius.card, borderWidth: 1 },
  eyebrow: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: space.sm },
  sectionTitle: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  notifRow: { flexDirection: 'row', alignItems: 'flex-start', gap: space.md, padding: space.lg, borderRadius: radius.card, borderWidth: 1 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  rowTop: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
});
