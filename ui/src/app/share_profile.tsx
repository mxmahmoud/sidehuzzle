import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { GlassCard } from '@/components/GlassCard'
import { useSessionStore } from '@/stores/sessionStore'
import { useThemeColors } from '@/theme/useThemeColors'
import { radius, space, type as typeStyles } from '@/theme/tokens'

const PROFILE_URL_BASE = 'https://sidehuzle.app/profile'

function ShareButton({
  icon,
  label,
  color,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap
  label: string
  color: string
  onPress: () => void
}) {
  return (
    <Pressable
      style={[styles.shareBtn, { backgroundColor: color + '18' }]}
      onPress={onPress}
      accessibilityRole="button"
    >
      <Ionicons name={icon} size={24} color={color} />
      <Text style={[styles.shareLabel, { color: color }]}>{label}</Text>
    </Pressable>
  )
}

export default function ShareProfileRoute() {
  const c = useThemeColors()
  const router = useRouter()
  const user = useSessionStore((s) => s.user)
  const profileUrl = user ? `${PROFILE_URL_BASE}/${user.id}` : PROFILE_URL_BASE

  function doShare(label: string, text: string) {
    Alert.alert(`Share via ${label}`, text)
  }

  const shareText = user
    ? `Check out my Sidehuzle profile! ${profileUrl}`
    : 'Check out Sidehuzle — the local services marketplace.'

  return (
    <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.content}>
      <GlassCard style={{ alignItems: 'center' }}>
        <View style={[styles.iconWrap, { backgroundColor: c.accent_primary + '18' }]}>
          <Ionicons name="share-social-outline" size={36} color={c.accent_primary} />
        </View>
        <Text style={[typeStyles.title, { color: c.text_primary }]}>Share your profile</Text>
        <Text style={{ color: c.text_secondary, fontSize: 14, textAlign: 'center', lineHeight: 21 }}>
          Let others discover you on Sidehuzle. Share your unique profile link.
        </Text>

        <View style={[styles.urlCard, { backgroundColor: c.surface_secondary, borderColor: c.border_subtle }]}>
          <Text style={{ color: c.text_secondary, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0 }}>Your profile link</Text>
          <Text style={[styles.url, { color: c.accent_primary }]} numberOfLines={1}>
            {profileUrl}
          </Text>
          <Pressable
            style={[styles.copyBtn, { borderColor: c.border_subtle }]}
            onPress={() => Alert.alert('Copied!', 'Link copied to clipboard.')}
            accessibilityRole="button"
          >
            <Ionicons name="copy-outline" size={14} color={c.text_secondary} />
            <Text style={{ color: c.text_secondary, fontSize: 13 }}>Copy link</Text>
          </Pressable>
        </View>
      </GlassCard>

      <Text style={[styles.sectionTitle, { color: c.text_secondary }]}>Share to</Text>
      <View style={styles.shareGrid}>
        <ShareButton
          icon="chatbubbles-outline"
          label="SMS"
          color="#3D5AFE"
          onPress={() => doShare('SMS', shareText)}
        />
        <ShareButton
          icon="logo-whatsapp"
          label="WhatsApp"
          color="#25D366"
          onPress={() => doShare('WhatsApp', shareText)}
        />
        <ShareButton
          icon="at"
          label="X (Twitter)"
          color="#1DA1F2"
          onPress={() => doShare('X', shareText)}
        />
        <ShareButton
          icon="link"
          label="Copy link"
          color="#9E9E9E"
          onPress={() => Alert.alert('Copied!', 'Link copied to clipboard.')}
        />
      </View>

      <Text style={[styles.sectionTitle, { color: c.text_secondary }]}>Embed</Text>
      <GlassCard>
        <Text style={{ color: c.text_secondary, fontSize: 13, lineHeight: 19 }}>
          Paste this into your website or blog to embed your Sidehuzle profile badge.
        </Text>
        <View style={[styles.embedBox, { backgroundColor: c.surface_secondary, borderColor: c.border_subtle }]}>
          <Text style={{ color: c.text_secondary, fontSize: 11, fontFamily: 'monospace' }} numberOfLines={3}>
            {'<a href="' + profileUrl + '">My Sidehuzle Profile</a>'}
          </Text>
        </View>
        <Pressable
          style={[styles.copyBtn, { borderColor: c.border_subtle, alignSelf: 'flex-start' }]}
          onPress={() => Alert.alert('Copied!', 'Embed code copied.')}
          accessibilityRole="button"
        >
          <Ionicons name="copy-outline" size={14} color={c.text_secondary} />
          <Text style={{ color: c.text_secondary, fontSize: 13 }}>Copy embed</Text>
        </Pressable>
      </GlassCard>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: space.xl, gap: space.lg },
  iconWrap: { width: 72, height: 72, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: space.md },
  urlCard: { width: '100%', borderWidth: 1, borderRadius: radius.card, padding: space.lg, alignItems: 'center', gap: space.sm, marginTop: space.lg },
  url: { fontSize: 13, fontWeight: '600', fontFamily: 'monospace' },
  copyBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderRadius: radius.button, paddingHorizontal: space.md, paddingVertical: 6 },
  sectionTitle: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0 },
  shareGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md },
  shareBtn: { width: '47%', padding: space.lg, borderRadius: radius.card, alignItems: 'center', gap: space.sm },
  shareLabel: { fontSize: 13, fontWeight: '600' },
  embedBox: { width: '100%', borderWidth: 1, borderRadius: radius.card, padding: space.md, marginTop: space.md },
})
