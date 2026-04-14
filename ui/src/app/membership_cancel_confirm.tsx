import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { GlassCard } from '@/components/GlassCard'
import { useThemeColors } from '@/theme/useThemeColors'
import { radius, space, type as typeStyles } from '@/theme/tokens'

export default function MembershipCancelConfirmRoute() {
  const c = useThemeColors()
  const router = useRouter()

  function handleCancel() {
    Alert.alert(
      'Cancel subscription?',
      'You will lose access to Pro features at the end of your billing period.',
      [
        { text: 'Keep subscription', style: 'cancel' },
        {
          text: 'Cancel subscription',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Cancelled', 'Your subscription will end at the billing date.')
            router.back()
          },
        },
      ]
    )
  }

  return (
    <View style={[styles.root, { backgroundColor: c.surface_secondary }]}>
      <GlassCard style={{ alignItems: 'center', padding: space.xl }}>
        <View style={[styles.iconWrap, { backgroundColor: '#FF6B5522' }]}>
          <Ionicons name="warning" size={48} color="#FF6B55" />
        </View>
        <Text style={[typeStyles.title, { color: c.text_primary, marginTop: space.lg, textAlign: 'center' }]}>
          Cancel subscription?
        </Text>
        <Text style={{ color: c.text_secondary, fontSize: 14, textAlign: 'center', lineHeight: 21, marginTop: space.sm }}>
          You'll lose access to all Pro features including unlimited posts, priority visibility, and advanced analytics at the end of your billing period.
        </Text>
      </GlassCard>

      <GlassCard>
        <Text style={[styles.sectionTitle, { color: c.text_secondary }]}>What you lose:</Text>
        {['Unlimited task posts', 'Priority search placement', 'Advanced analytics', 'Badge on your profile'].map((item, i) => (
          <View key={i} style={[styles.row, { borderBottomColor: c.border_subtle }]}>
            <Ionicons name="close-circle" size={16} color="#FF6B55" />
            <Text style={{ color: c.text_secondary, fontSize: 14, flex: 1, marginLeft: space.sm }}>{item}</Text>
          </View>
        ))}
      </GlassCard>

      <View style={styles.actions}>
        <Pressable
          style={[styles.keepBtn, { borderColor: c.border_subtle }]}
          onPress={() => router.back()}
          accessibilityRole="button"
        >
          <Text style={{ color: c.text_primary, fontWeight: '600', fontSize: 15 }}>Keep subscription</Text>
        </Pressable>
        <Pressable
          style={[styles.cancelBtn, { borderColor: '#ef4444' }]}
          onPress={handleCancel}
          accessibilityRole="button"
        >
          <Text style={{ color: '#ef4444', fontWeight: '700', fontSize: 15 }}>Cancel subscription</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'center', padding: space.xl, gap: space.lg },
  iconWrap: { width: 80, height: 80, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0, marginBottom: space.md },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1 },
  actions: { gap: space.md },
  keepBtn: { borderWidth: 1.5, borderRadius: radius.button, paddingVertical: space.md, alignItems: 'center' },
  cancelBtn: { borderWidth: 1.5, borderRadius: radius.button, paddingVertical: space.md, alignItems: 'center' },
})
