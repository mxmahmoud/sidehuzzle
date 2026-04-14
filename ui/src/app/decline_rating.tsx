import { GlassCard } from "@/components/GlassCard";
import { useThemeColors } from "@/theme/useThemeColors";
import { radius, space } from "@/theme/tokens";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function DeclineRatingRoute() {
  const c = useThemeColors();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <View style={styles.centerContent}>
        <GlassCard style={styles.card}>
          <View style={[styles.iconWrap, { backgroundColor: c.surface_primary }]}>
            <Ionicons name="star-outline" size={48} color={c.text_secondary} />
          </View>
          <Text style={[styles.eyebrow, { color: c.accent_primary }]}>RATING</Text>
          <Text style={[styles.title, { color: c.text_primary }]}>
            Skip Rating?
          </Text>
          <Text style={[styles.subtitle, { color: c.text_secondary }]}>
            You can rate this service provider later from your history.
          </Text>
          <View style={styles.btnRow}>
            <Pressable
              style={[styles.btn, { borderColor: c.text_secondary }]}
              onPress={() => router.back()}
            >
              <Text style={[styles.btnText, { color: c.text_secondary }]}>Skip</Text>
            </Pressable>
            <Pressable
              style={[styles.btn, { backgroundColor: c.accent_primary }]}
              onPress={() => {
                router.back();
              }}
            >
              <Text style={[styles.btnText, { color: "#fff" }]}>Rate Now</Text>
            </Pressable>
          </View>
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
  btnRow: { flexDirection: "row", gap: space.md },
  btn: {
    paddingHorizontal: space.xl,
    paddingVertical: space.sm,
    borderRadius: radius.button,
    borderWidth: 1.5,
  },
  btnText: { fontWeight: "700" },
});