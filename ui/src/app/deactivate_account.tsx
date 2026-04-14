import { GlassCard } from "@/components/GlassCard";
import { useThemeColors } from "@/theme/useThemeColors";
import { radius, space } from "@/theme/tokens";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function DeactivateAccountRoute() {
  const c = useThemeColors();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <GlassCard style={styles.headerCard}>
          <View style={[styles.iconWrap, { backgroundColor: "#FF3B3022" }]}>
            <Ionicons name="warning" size={40} color="#FF3B30" />
          </View>
          <Text style={[styles.title, { color: c.text_primary }]}>Deactivate Account</Text>
          <Text style={[styles.subtitle, { color: c.text_secondary }]}>
            This action will disable your account. You can reactivate it at any time.
          </Text>
        </GlassCard>

        <GlassCard style={styles.infoCard}>
          <Text style={[styles.sectionTitle, { color: c.text_primary }]}>
            What happens when you deactivate:
          </Text>
          <View style={styles.bulletRow}>
            <Ionicons name="close-circle-outline" size={18} color={c.text_secondary} />
            <Text style={[styles.bulletText, { color: c.text_secondary }]}>
              Your profile will no longer be visible
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Ionicons name="close-circle-outline" size={18} color={c.text_secondary} />
            <Text style={[styles.bulletText, { color: c.text_secondary }]}>
              All active job posts will be removed
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Ionicons name="close-circle-outline" size={18} color={c.text_secondary} />
            <Text style={[styles.bulletText, { color: c.text_secondary }]}>
              Pending offers will be cancelled
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Ionicons name="close-circle-outline" size={18} color={c.text_secondary} />
            <Text style={[styles.bulletText, { color: c.text_secondary }]}>
              Your data will be retained for 30 days
            </Text>
          </View>
        </GlassCard>

        <Pressable
          style={[styles.deactivateBtn, { backgroundColor: "#FF3B30" }]}
          onPress={() => {
            Alert.alert(
              "Account Deactivated",
              "Your account has been deactivated. You can reactivate within 30 days.",
              [{ text: "OK", onPress: () => router.back() }]
            );
          }}
        >
          <Text style={styles.deactivateBtnText}>Deactivate My Account</Text>
        </Pressable>

        <Pressable style={styles.cancelBtn} onPress={() => router.back()}>
          <Text style={[styles.cancelBtnText, { color: c.text_secondary }]}>Cancel</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: space.md },
  headerCard: { marginBottom: space.lg, alignItems: "center" },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: space.md,
  },
  eyebrow: { fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0, marginBottom: space.sm },
  title: { fontSize: 22, fontWeight: "700", textAlign: "center", marginBottom: space.sm },
  subtitle: { fontSize: 15, fontWeight: "400", textAlign: "center" },
  infoCard: { marginBottom: space.lg },
  sectionTitle: { fontWeight: "700", marginBottom: space.md },
  bulletRow: { flexDirection: "row", alignItems: "center", marginBottom: space.sm },
  bulletText: { fontSize: 15, fontWeight: "400", marginLeft: space.sm, flex: 1 },
  deactivateBtn: {
    paddingVertical: space.md,
    borderRadius: radius.button,
    alignItems: "center",
    marginBottom: space.md,
  },
  deactivateBtnText: { color: "#fff", fontWeight: "700" },
  cancelBtn: { alignItems: "center", paddingVertical: space.md },
  cancelBtnText: { fontSize: 15, fontWeight: "400" },
});