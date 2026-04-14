import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { GlassCard } from '@/components/GlassCard'
import { useThemeColors } from '@/theme/useThemeColors'
import { radius, space, type as typeStyles } from '@/theme/tokens'

const CONTACTS = [
  { id: '1', name: 'Sarah Miller', handle: '@sarahm', avatar: 'person' },
  { id: '2', name: 'James Chen', handle: '@jamesc', avatar: 'person' },
  { id: '3', name: 'Alex Rivera', handle: '@alexr', avatar: 'person' },
]

const SOCIAL_CHANNELS = [
  { id: 'sms', label: 'SMS', icon: 'chatbubbles-outline' as const, color: '#3D5AFE' },
  { id: 'whatsapp', label: 'WhatsApp', icon: 'logo-whatsapp' as const, color: '#25D366' },
  { id: 'telegram', label: 'Telegram', icon: 'send' as const, color: '#0088CC' },
  { id: 'twitter', label: 'X (Twitter)', icon: 'at' as const, color: '#1DA1F2' },
]

const REFERRAL_CODE = 'SIDEHUZLE4U'

function ContactRow({ contact, onInvite }: { contact: { id: string; name: string; handle: string; avatar: string }; onInvite: () => void }) {
  const c = useThemeColors()
  return (
    <View style={[styles.contactRow, { borderBottomColor: c.border_subtle }]}>
      <View style={[styles.contactAvatar, { backgroundColor: c.accent_primary + '22' }]}>
        <Ionicons name={contact.avatar as 'person'} size={20} color={c.accent_primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[typeStyles.body, { color: c.text_primary, fontWeight: '600' }]}>{contact.name}</Text>
        <Text style={{ color: c.text_secondary, fontSize: 12 }}>{contact.handle}</Text>
      </View>
      <Pressable
        style={[styles.inviteBtn, { borderColor: c.accent_primary }]}
        onPress={onInvite}
        accessibilityRole="button"
      >
        <Text style={{ color: c.accent_primary, fontWeight: '700', fontSize: 13 }}>Invite</Text>
      </Pressable>
    </View>
  )
}

export default function InviteFriendsRoute() {
  const c = useThemeColors()

  function share(recipient?: string) {
    const msg = `Join Sidehuzle! Use my referral code ${REFERRAL_CODE} to get started.`
    if (recipient === 'sms') {
      Alert.alert('SMS', `Send to contacts: ${msg}`)
    } else {
      Alert.alert('Share', msg)
    }
  }

  return (
    <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.content}>
      <GlassCard style={{ alignItems: 'center' }}>
        <View style={[styles.iconWrap, { backgroundColor: c.accent_primary + '18' }]}>
          <Ionicons name="gift-outline" size={36} color={c.accent_primary} />
        </View>
        <Text style={[typeStyles.title, { color: c.text_primary }]}>Invite friends</Text>
        <Text style={{ color: c.text_secondary, fontSize: 14, textAlign: 'center', lineHeight: 21 }}>
          Earn rewards when your friends join and complete their first task.
        </Text>
        <View style={[styles.codeCard, { backgroundColor: c.surface_secondary, borderColor: c.border_subtle }]}>
          <Text style={{ color: c.text_secondary, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0 }}>Your referral code</Text>
          <Text style={[styles.code, { color: c.accent_primary }]}>{REFERRAL_CODE}</Text>
          <Pressable
            style={[styles.copyBtn, { borderColor: c.border_subtle }]}
            onPress={() => Alert.alert('Copied!', 'Referral code copied to clipboard.')}
            accessibilityRole="button"
          >
            <Ionicons name="copy-outline" size={14} color={c.text_secondary} />
            <Text style={{ color: c.text_secondary, fontSize: 13 }}>Copy</Text>
          </Pressable>
        </View>
      </GlassCard>

      <Text style={[styles.sectionTitle, { color: c.text_secondary }]}>Share via</Text>
      <GlassCard>
        <View style={styles.channelGrid}>
          {SOCIAL_CHANNELS.map((ch) => (
            <Pressable
              key={ch.id}
              style={[styles.channelBtn, { backgroundColor: ch.color + '18' }]}
              onPress={() => share(ch.id)}
              accessibilityRole="button"
            >
              <Ionicons name={ch.icon} size={24} color={ch.color} />
              <Text style={[styles.channelLabel, { color: c.text_primary }]}>{ch.label}</Text>
            </Pressable>
          ))}
        </View>
      </GlassCard>

      <Text style={[styles.sectionTitle, { color: c.text_secondary }]}>Contacts</Text>
      <GlassCard>
        {CONTACTS.map((contact) => (
          <ContactRow
            key={contact.id}
            contact={contact}
            onInvite={() => share('sms')}
          />
        ))}
        <Pressable
          style={[styles.inviteAllBtn, { backgroundColor: c.accent_primary }]}
          onPress={() => Alert.alert('Invite All', 'Sending invites to all contacts…')}
          accessibilityRole="button"
        >
          <Ionicons name="person-add-outline" size={18} color="#fff" />
          <Text style={styles.inviteAllText}>Invite all contacts</Text>
        </Pressable>
      </GlassCard>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: space.xl, gap: space.lg },
  iconWrap: { width: 72, height: 72, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: space.md },
  codeCard: { width: '100%', borderWidth: 1, borderRadius: radius.card, padding: space.lg, alignItems: 'center', gap: space.sm, marginTop: space.lg },
  code: { fontSize: 28, fontWeight: '800', letterSpacing: 0 },
  copyBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderRadius: radius.button, paddingHorizontal: space.md, paddingVertical: 4 },
  sectionTitle: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0 },
  channelGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md },
  channelBtn: { width: '47%', padding: space.lg, borderRadius: radius.card, alignItems: 'center', gap: space.sm },
  channelLabel: { fontSize: 13, fontWeight: '600' },
  contactRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: space.md, borderBottomWidth: 1 },
  contactAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: space.md },
  inviteBtn: { borderWidth: 1.5, borderRadius: radius.button, paddingHorizontal: space.lg, paddingVertical: 6 },
  inviteAllBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: space.lg, paddingVertical: space.md, borderRadius: radius.button },
  inviteAllText: { color: '#fff', fontWeight: '700', fontSize: 15 },
})
