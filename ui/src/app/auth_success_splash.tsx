import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native'
import { GlassCard } from '@/components/GlassCard'
import { getSession } from '@/domain/api/authApi'
import { useSessionStore } from '@/stores/sessionStore'
import { useThemeColors } from '@/theme/useThemeColors'
import { radius, space, type as typeStyles } from '@/theme/tokens'

export default function AuthSuccessSplashRoute() {
  const c = useThemeColors()
  const router = useRouter()
  const user = useSessionStore((s) => s.user)
  const signIn = useSessionStore((s) => s.signIn)
  const [fade] = useState(() => new Animated.Value(0))

  useEffect(() => {
    let cancelled = false
    Animated.timing(fade, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start()

    getSession()
      .then((sessionUser) => {
        if (cancelled) return
        if (sessionUser) {
          signIn(sessionUser)
          setTimeout(() => router.replace('/(tabs)/landing_page'), 600)
          return
        }
        setTimeout(() => router.replace('/login_form'), 1200)
      })
      .catch(() => {
        if (!cancelled) setTimeout(() => router.replace('/login_form'), 1200)
      })

    return () => {
      cancelled = true
    }
  }, [fade, router, signIn])

  return (
    <Animated.View style={[styles.root, { backgroundColor: c.surface_secondary, opacity: fade }]}>
      <GlassCard style={{ alignItems: 'center', padding: space.xl }}>
        <View style={[styles.iconWrap, { backgroundColor: '#4CAF5022' }]}>
          <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
        </View>
        <Text style={[typeStyles.title, { color: c.text_primary, marginTop: space.lg }]}>
          Welcome{user?.first_name ? `, ${user.first_name}` : ''}!
        </Text>
        <Text style={{ color: c.text_secondary, fontSize: 14, textAlign: 'center', lineHeight: 21, marginTop: space.sm }}>
          {user
            ? "You're all set. Redirecting you now…"
            : 'Authentication successful. Setting up your session…'}
        </Text>
      </GlassCard>

      <Pressable
        style={[styles.continueBtn, { borderColor: c.accent_primary }]}
        onPress={() => {
          if (user) {
            router.replace('/(tabs)/landing_page')
          } else {
            router.replace('/login_form')
          }
        }}
        accessibilityRole="button"
      >
        <Text style={{ color: c.accent_primary, fontWeight: '700', fontSize: 15 }}>
          Continue
        </Text>
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'center', padding: space.xl },
  iconWrap: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center' },
  continueBtn: { marginTop: space.xl, alignSelf: 'center', paddingVertical: space.md, paddingHorizontal: space.xl, borderWidth: 1.5, borderRadius: radius.button },
})
