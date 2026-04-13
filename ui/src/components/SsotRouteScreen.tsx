import { Stack, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '@/theme/useThemeColors';
import { radius, shadow, space, type as typeStyles } from '@/theme/tokens';
import type { PageId } from '@/ssot/generated/pageRegistry';
import { PAGE_TITLES } from '@/ssot/generated/pageRegistry';

type Props = { pageId: PageId };

export function SsotRouteBody({ pageId }: Props) {
  const c = useThemeColors();
  const router = useRouter();
  const title = PAGE_TITLES[pageId];
  return (
    <View style={[styles.root, { backgroundColor: c.surface_secondary }]}>
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={[styles.eyebrow, { color: c.accent_primary }]}>SSOT Screen</Text>
        <Text style={[typeStyles.title, { color: c.text_primary }]}>{title}</Text>
        <View style={[styles.panel, shadow.card, { backgroundColor: c.surface_primary, borderColor: c.border_subtle }]}>
          <Text style={[typeStyles.body, { color: c.text_secondary, lineHeight: 22 }]}>
            This route is wired to the product SSOT but has not been fully designed yet.
          </Text>
          <View style={[styles.metaBlock, { backgroundColor: c.surface_elevated }]}>
            <Text style={[styles.metaLabel, { color: c.text_secondary }]}>page_id</Text>
            <Text style={{ fontFamily: 'monospace', color: c.text_primary }}>{pageId}</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <Pressable
            onPress={() => router.push('/(tabs)/landing_page')}
            style={[styles.primaryBtn, { backgroundColor: c.accent_primary }]}
            accessibilityRole="button"
          >
            <Text style={styles.primaryBtnText}>Back to discovery</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

export function SsotRouteScreen({ pageId }: Props) {
  const title = PAGE_TITLES[pageId];
  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ title, headerShown: true }} />
      <SsotRouteBody pageId={pageId} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  body: { padding: space.xl, gap: space.md },
  eyebrow: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  panel: { borderRadius: radius.card, borderWidth: 1, padding: space.lg, gap: space.md },
  metaBlock: { borderRadius: radius.button, padding: space.md, gap: 4 },
  metaLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  actions: { gap: space.sm, marginTop: space.sm },
  primaryBtn: { borderRadius: radius.button, paddingVertical: space.md, paddingHorizontal: space.lg, alignItems: 'center' },
  primaryBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
