import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { GlassCard } from '@/components/GlassCard'
import { useThemeColors } from '@/theme/useThemeColors'
import { radius, space, type as typeStyles } from '@/theme/tokens'

const TIERS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    color: '#9E9E9E',
    features: ['3 task posts / month', 'Basic search', 'Standard placement', 'Email support'],
    cta: 'Current plan',
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$12',
    period: '/month',
    color: '#3D5AFE',
    features: [
      'Unlimited task posts',
      'Priority search placement',
      'Advanced analytics',
      'Verified badge',
      'Dedicated support',
    ],
    cta: 'Upgrade to Pro',
    highlighted: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: '$29',
    period: '/month',
    color: '#D8B46A',
    features: [
      'Everything in Pro',
      'Multi-user team accounts',
      'API access',
      'Custom branding',
      'White-label options',
    ],
    cta: 'Go Business',
    highlighted: false,
  },
]

export default function MembershipPlansRoute() {
  const c = useThemeColors()

  return (
    <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.content}>
      <GlassCard>
        <Text style={[styles.eyebrow, { color: c.accent_primary }]}>Membership</Text>
        <Text style={[typeStyles.title, { color: c.text_primary }]}>Choose your plan</Text>
        <Text style={{ color: c.text_secondary, fontSize: 14, lineHeight: 21 }}>
          Upgrade for more reach, unlimited posts, and powerful tools.
        </Text>
      </GlassCard>

      <View style={styles.tiers}>
        {TIERS.map((tier) => (
          <GlassCard
            key={tier.id}
            style={[
              tier.highlighted ? { borderColor: tier.color, borderWidth: 2 } : {},
            ]}
          >
            {tier.highlighted && (
              <View style={[styles.popularBadge, { backgroundColor: tier.color }]}>
                <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800', textTransform: 'uppercase' }}>Most popular</Text>
              </View>
            )}
            <Text style={[styles.tierName, { color: tier.color }]}>{tier.name}</Text>
            <View style={styles.priceRow}>
              <Text style={[styles.price, { color: c.text_primary }]}>{tier.price}</Text>
              <Text style={{ color: c.text_secondary, fontSize: 13 }}>{tier.period}</Text>
            </View>
            {tier.features.map((f, i) => (
              <View key={i} style={[styles.featureRow, { borderBottomColor: c.border_subtle }]}>
                <Ionicons name="checkmark-circle" size={16} color={tier.color} />
                <Text style={{ color: c.text_secondary, fontSize: 13, flex: 1, marginLeft: space.sm }}>{f}</Text>
              </View>
            ))}
            <Pressable
              style={[
                styles.ctaBtn,
                {
                  backgroundColor: tier.highlighted ? tier.color : 'transparent',
                  borderColor: tier.color,
                },
              ]}
              onPress={() => {}}
              accessibilityRole="button"
            >
              <Text
                style={{
                  color: tier.highlighted ? '#fff' : tier.color,
                  fontWeight: '700',
                  fontSize: 14,
                }}
              >
                {tier.cta}
              </Text>
            </Pressable>
          </GlassCard>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: space.xl, gap: space.lg },
  eyebrow: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0 },
  tiers: { gap: space.lg },
  popularBadge: { position: 'absolute', top: -10, right: 16, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  tierName: { fontSize: 16, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: space.xs, marginBottom: space.md },
  price: { fontSize: 36, fontWeight: '800', lineHeight: 40 },
  featureRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 7, borderBottomWidth: 1 },
  ctaBtn: { marginTop: space.lg, paddingVertical: space.md, borderRadius: radius.button, borderWidth: 1.5, alignItems: 'center' },
})
