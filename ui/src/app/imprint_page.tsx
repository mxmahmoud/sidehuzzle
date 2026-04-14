import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { GlassCard } from '@/components/GlassCard'
import { useThemeColors } from '@/theme/useThemeColors'
import { space, type as typeStyles } from '@/theme/tokens'

export default function ImprintPageRoute() {
  const c = useThemeColors()
  const router = useRouter()

  return (
    <ScrollView style={[styles.root, { backgroundColor: c.surface_secondary }]} contentContainerStyle={styles.content}>
      <GlassCard style={{ alignItems: 'center' }}>
        <Ionicons name="business-outline" size={48} color={c.accent_primary} />
        <Text style={[typeStyles.title, { color: c.text_primary, marginTop: space.md }]}>Sidehuzle</Text>
        <Text style={{ color: c.text_secondary, fontSize: 14 }}>Local Services Marketplace</Text>
      </GlassCard>

      <GlassCard>
        <Text style={[styles.heading, { color: c.text_primary }]}>Imprint / Legal Notice</Text>
        <Text style={[styles.label, { color: c.text_secondary }]}>Company</Text>
        <Text style={{ color: c.text_primary, fontSize: 14, lineHeight: 20 }}>Sidehuzle Inc.{'\n'}123 Marketplace Street{'\n'}San Francisco, CA 94103</Text>
      </GlassCard>

      <GlassCard>
        <Text style={[styles.label, { color: c.text_secondary }]}>Contact</Text>
        <Text style={{ color: c.text_primary, fontSize: 14, lineHeight: 20 }}>Email: support@sidehuzle.app{'\n'}Phone: +1 (555) 123-4567</Text>
      </GlassCard>

      <GlassCard>
        <Text style={[styles.label, { color: c.text_secondary }]}>Commercial Register</Text>
        <Text style={{ color: c.text_primary, fontSize: 14, lineHeight: 20 }}>Registration number: 2024-SIDEH-0001{'\n'}VAT ID: US123456789</Text>
      </GlassCard>

      <GlassCard>
        <Text style={[styles.label, { color: c.text_secondary }]}>Responsible for content</Text>
        <Text style={{ color: c.text_primary, fontSize: 14, lineHeight: 20 }}>CEO: Alex Johnson{'\n'}Data Protection Officer: Maria Garcia</Text>
      </GlassCard>

      <GlassCard>
        <Text style={[styles.label, { color: c.text_secondary }]}>Disclaimer</Text>
        <Text style={{ color: c.text_secondary, fontSize: 13, lineHeight: 19 }}>
          The information on this page is provided for imprint purposes in accordance with applicable law. Sidehuzle is a platform connecting service providers with customers. We are not liable for the services provided by third parties through our platform.
        </Text>
      </GlassCard>

      <GlassCard>
        <Text style={[styles.label, { color: c.text_secondary }]}>Platform regulation</Text>
        <Text style={{ color: c.text_secondary, fontSize: 13, lineHeight: 19 }}>
          Sidehuzle operates under the EU Digital Services Act and provides a trusted intermediary platform for local services. All service providers are independent contractors.
        </Text>
      </GlassCard>

      <Text style={{ color: c.text_secondary, fontSize: 11, textAlign: 'center', marginTop: space.lg }}>
        © {new Date().getFullYear()} Sidehuzle Inc. All rights reserved.
      </Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: space.xl, gap: space.lg },
  heading: { fontSize: 18, fontWeight: '700', marginBottom: space.md },
  label: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0, marginBottom: space.xs },
})
