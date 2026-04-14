import { GlassCard } from "@/components/GlassCard";
import { useThemeColors } from "@/theme/useThemeColors";
import { radius, space } from "@/theme/tokens";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function ConfirmationCustomerRequestSentRoute() {
  const c = useThemeColors();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <View style={styles.centerContent}>
        <GlassCard style={styles.card}>
          <View style={[styles.iconWrap, { backgroundColor: c.accent_primary }]}>
            <Ionicons name="checkmark" size={48} color="#fff" />
          </View>
          <Text style={[styles.eyebrow, { color: c.accent_primary }]}>REQUEST SENT</Text>
          <Text style={[styles.title, { color: c.text_primary }]}>
            Your Request is On Its Way!
          </Text>
          <Text style={[styles.subtitle, { color: c.text_secondary }]}>
            Service providers will be notified and can send you offers. You'll be contacted soon.
          </Text>
          <Pressable
            style={[styles.doneBtn, { backgroundColor: c.accent_primary }]}
            onPress={() => router.back()}
          >
            <Text style={styles.doneBtnText}>Done</Text>
          </Pressable>
        </GlassCard>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContent: { flex: 1, justifyContent: "center", padding: space.lg },
  card: { alignItems: "center", padding: space.xl },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: space.lg,
  },
  eyebrow: { fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0, marginBottom: space.sm },
  title: { fontSize: 22, fontWeight: "700", textAlign: "center", marginBottom: space.sm },
  subtitle: { fontSize: 15, fontWeight: "400", textAlign: "center", marginBottom: space.xl },
  doneBtn: {
    paddingHorizontal: space.xl * 2,
    paddingVertical: space.md,
    borderRadius: radius.button,
  },
  doneBtnText: { color: "#fff", fontWeight: "700" },
});