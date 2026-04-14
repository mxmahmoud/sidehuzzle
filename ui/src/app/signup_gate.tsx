import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { GlassCard } from '@/components/GlassCard'
import { useThemeColors } from '@/theme/useThemeColors'
import { radius, space, type as typeStyles } from '@/theme/tokens'

export default function SignupGateRoute() {
  const c = useThemeColors()
  const router = useRouter()

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: c.surface_secondary }]}
      contentContainerStyle={styles.content}
    >
      <GlassCard style={{ alignItems: 'center' }}>
        <View style={[styles.iconWrap, { backgroundColor: c.accent_primary + '18' }]}>
          <Ionicons name="person-add-outline" size={40} color={c.accent_primary} />
        </View>
        <Text style={[typeStyles.title, { color: c.text_primary, textAlign: 'center' }]}>
          Sign up to continue
        </Text>
        <Text style={{ color: c.text_secondary, fontSize: 14, lineHeight: 21, textAlign: 'center' }}>
          You need an account to access this feature. It only takes a moment.
        </Text>
      </GlassCard>

      <GlassCard style={{ gap: space.md }}>
        <Text style={[styles.benefitsTitle, { color: c.text_secondary }]}>What you get with a free account:</Text>
        {[
          { icon: 'checkmark-circle', text: 'Post tasks and find nearby professionals' },
          { icon: 'chatbubbles', text: 'Chat directly with service providers' },
          { icon: 'star', text: 'Build your reputation with reviews' },
        ].map((b, i) => (
          <View key={i} style={styles.benefitRow}>
            <Ionicons name={b.icon as 'checkmark-circle'} size={18} color={c.accent_primary} />
            <Text style={{ color: c.text_secondary, fontSize: 14, flex: 1, marginLeft: space.md }}>
              {b.text}
            </Text>
          </View>
        ))}
      </GlassCard>

      <Pressable
        style={[styles.signUpBtn, { backgroundColor: c.accent_primary }]}
        onPress={() => router.push('/signup_form')}
        accessibilityRole="button"
      >
        <Text style={styles.signUpText}>Create free account</Text>
      </Pressable>

      <View style={styles.signInRow}>
        <Text style={{ color: c.text_secondary, fontSize: 14 }}>Already have an account? </Text>
        <Pressable onPress={() => router.push('/login_form')} accessibilityRole="button">
          <Text style={{ color: c.accent_primary, fontWeight: '700', fontSize: 14 }}>Sign in</Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', padding: space.xl, gap: space.lg },
  iconWrap: { width: 80, height: 80, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: space.md },
  benefitsTitle: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0 },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  signUpBtn: { paddingVertical: space.md, borderRadius: radius.button, alignItems: 'center' },
  signUpText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  signInRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
})
