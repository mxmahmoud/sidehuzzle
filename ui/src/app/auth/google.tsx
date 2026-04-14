import { Ionicons } from '@expo/vector-icons'
import { useEffect } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { GlassCard } from '@/components/GlassCard'
import { getApiBaseUrl } from '@/data/api'
import { space, type as typeStyles } from '@/theme/tokens'
import { useThemeColors } from '@/theme/useThemeColors'

export default function GoogleAuthCallbackRoute() {
  const c = useThemeColors()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const callbackUrl = new URL(`${getApiBaseUrl()}/auth/google`)
    callbackUrl.search = window.location.search
    window.location.replace(callbackUrl.toString())
  }, [])

  return (
    <View style={[styles.root, { backgroundColor: c.surface_secondary }]}>
      <GlassCard style={styles.card}>
        <View style={[styles.iconWrap, { backgroundColor: '#6DE3C222' }]}>
          <Ionicons name="shield-checkmark-outline" size={48} color={c.accent_primary} />
        </View>
        <ActivityIndicator color={c.accent_primary} style={styles.loader} />
        <Text style={[typeStyles.title, styles.title, { color: c.text_primary }]}>
          Finishing sign in
        </Text>
        <Text style={[styles.copy, { color: c.text_secondary }]}>
          One moment while Sidehuzle completes the secure Google handshake.
        </Text>
      </GlassCard>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.xl,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    padding: space.xl,
  },
  iconWrap: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    marginTop: space.lg,
  },
  title: {
    marginTop: space.md,
    textAlign: 'center',
  },
  copy: {
    marginTop: space.sm,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
})
