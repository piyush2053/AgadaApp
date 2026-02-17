import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatCaseDate, getAllCases, SavedCase } from "./utils/StorageService";

const getSeverityColors = (level: string) => {
  switch (level) {
    case "Severe Complicated": return { color: "#DC2626", bgColor: "#FEE2E2" };
    case "Alarming":           return { color: "#EA580C", bgColor: "#FFEDD5" };
    case "Moderate":           return { color: "#D97706", bgColor: "#FEF3C7" };
    default:                   return { color: "#059669", bgColor: "#D1FAE5" };
  }
};

const getTypeLabel = (t: string): string => {
  const map: Record<string, string> = {
    cobra: "Cobra Bite", viper: "Viper Bite", krait: "Krait Bite",
    scorpion: "Scorpion", insect: "Insect", spider: "Spider",
    dog: "Dog Bite", rat: "Rat Bite", animal: "Animal Bite",
    gara_visha: "Gara Visha", dushi_visha: "Dushi Visha",
    virruddha_aahara: "Virruddha Aahara",
  };
  if (t?.startsWith("external_")) return "External Contact";
  return map[t] || t || "Unknown";
};

const getTypeIcon = (t: string): string => {
  if (!t) return "help-outline";
  if (["cobra", "viper", "krait"].some((k) => t.includes(k))) return "pest-control-rodent";
  if (["scorpion", "insect", "spider"].some((k) => t.includes(k))) return "bug-report";
  if (t.includes("dog")) return "pets";
  if (t.includes("rat") || t.includes("animal")) return "mouse";
  if (t.includes("external")) return "pan-tool-alt";
  if (t.includes("gara") || t.includes("dushi")) return "assignment";
  if (t.includes("virruddha")) return "restaurant";
  return "medical-services";
};

export default function Home() {
  const router = useRouter();
  const [recentCases, setRecentCases] = useState<SavedCase[]>([]);

  // Reload cases every time the screen is focused
  useFocusEffect(
    useCallback(() => {
      getAllCases().then((all) => setRecentCases(all.slice(0, 3)));
    }, [])
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <MaterialIcons name="medical-services" size={36} color="#fff" />
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.appName}>Agada Tantra</Text>
            <Text style={styles.appSubtitle}>Parikshika</Text>
          </View>
          <TouchableOpacity
            style={styles.casesIconBtn}
            onPress={() => router.push("/cases")}
            activeOpacity={0.7}
          >
            <MaterialIcons name="folder-open" size={22} color="#C45E3D" />
            {recentCases.length > 0 && (
              <View style={styles.caseBadge}>
                <Text style={styles.caseBadgeText}>
                  {recentCases.length > 9 ? "9+" : recentCases.length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* ── Hero tagline ──────────────────── */}
        <Text style={styles.heroText}>
          Expert Ayurvedic Toxicology{"\n"}
          <Text style={styles.heroBold}>Diagnosis</Text> at your fingertips.
        </Text>

        {/* ── Quick action cards ────────────── */}
        <View style={styles.cardSection}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/identity")}
            activeOpacity={0.7}
          >
            <View style={[styles.iconCircle, { backgroundColor: "#FDEAD7" }]}>
              <MaterialIcons name="person" size={22} color="#C45E3D" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Patient / Self Diagnosis</Text>
              <Text style={styles.cardSub}>Assess symptoms and toxic exposure</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="#D1D5DB" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/identity")}
            activeOpacity={0.7}
          >
            <View style={[styles.iconCircle, { backgroundColor: "#DDF3E4" }]}>
              <MaterialIcons name="medical-information" size={22} color="#2D5A27" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Doctor / Professional Use</Text>
              <Text style={styles.cardSub}>Clinical evaluation tools</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="#D1D5DB" />
          </TouchableOpacity>
        </View>

        {/* ── Previously Saved Cases ────────── */}
        {recentCases.length > 0 && (
          <View style={styles.savedSection}>
            <View style={styles.savedHeader}>
              <View style={styles.savedHeaderLeft}>
                <MaterialIcons name="history" size={18} color="#C45E3D" />
                <Text style={styles.savedTitle}>Previously Saved Cases</Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push("/cases")}
                activeOpacity={0.7}
              >
                <Text style={styles.viewAllText}>View All →</Text>
              </TouchableOpacity>
            </View>

            {recentCases.map((c) => {
              const sev = getSeverityColors(c.severityLevel || "Mild");
              return (
                <TouchableOpacity
                  key={c.id}
                  style={styles.savedCard}
                  onPress={() =>
                    router.push({
                      pathname: "/summary",
                      params: {
                        caseId: c.id,
                        type: c.exposureType || "",
                        symptoms: JSON.stringify(c.symptoms || []),
                        presentCount: String(c.symptoms?.length || 0),
                        totalPossible: "0",
                        severityLevel: c.severityLevel || "Mild",
                        severityPercentage: String(c.severityPercentage || 0),
                        readonly: "true",
                      },
                    })
                  }
                  activeOpacity={0.7}
                >
                  {/* Left accent */}
                  <View style={[styles.savedCardAccent, { backgroundColor: sev.color }]} />

                  <View style={[styles.savedIconBox, { backgroundColor: sev.bgColor }]}>
                    <MaterialIcons
                      name={getTypeIcon(c.exposureType || "") as any}
                      size={18}
                      color={sev.color}
                    />
                  </View>

                  <View style={styles.savedCardContent}>
                    <Text style={styles.savedName} numberOfLines={1}>
                      {c.identity?.name || "Unknown Patient"}
                    </Text>
                    <Text style={styles.savedMeta}>
                      {getTypeLabel(c.exposureType || "")} • {formatCaseDate(c.createdAt)}
                    </Text>
                  </View>

                  <View style={[styles.sevPill, { backgroundColor: sev.bgColor }]}>
                    <Text style={[styles.sevPillText, { color: sev.color }]}>
                      {c.severityLevel === "Severe Complicated"
                        ? "Severe"
                        : c.severityLevel || "Mild"}
                    </Text>
                  </View>

                  <MaterialIcons name="chevron-right" size={18} color="#D1D5DB" style={{ marginLeft: 4 }} />
                </TouchableOpacity>
              );
            })}

            {/* See all button */}
            <TouchableOpacity
              style={styles.seeAllBtn}
              onPress={() => router.push("/cases")}
              activeOpacity={0.7}
            >
              <MaterialIcons name="folder-open" size={16} color="#C45E3D" />
              <Text style={styles.seeAllText}>See All Saved Cases</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Start New Diagnosis ───────────── */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push("/identity")}
          activeOpacity={0.8}
        >
          <MaterialIcons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>Start New Diagnosis</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F1F3E1" },
  scroll: { padding: 20, paddingBottom: 40 },

  // Header
  header: { flexDirection: "row", alignItems: "center", marginBottom: 28 },
  logoBox: {
    backgroundColor: "#C45E3D", width: 52, height: 52, borderRadius: 14,
    alignItems: "center", justifyContent: "center",
    shadowColor: "#C45E3D", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  appName: { fontSize: 20, fontWeight: "800", color: "#1F2937", lineHeight: 24 },
  appSubtitle: { fontSize: 13, color: "#C45E3D", fontWeight: "700" },
  casesIconBtn: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: "#fff", alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  caseBadge: {
    position: "absolute", top: 6, right: 6,
    backgroundColor: "#C45E3D", width: 16, height: 16,
    borderRadius: 8, alignItems: "center", justifyContent: "center",
  },
  caseBadgeText: { fontSize: 9, color: "#fff", fontWeight: "800" },

  // Hero
  heroText: {
    fontSize: 22, color: "#374151", lineHeight: 32,
    marginBottom: 24, fontWeight: "500",
  },
  heroBold: { fontWeight: "800", color: "#C45E3D" },

  // Quick action cards
  cardSection: { gap: 12, marginBottom: 28 },
  card: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#fff", padding: 16, borderRadius: 18,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  iconCircle: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  cardContent: { flex: 1, marginLeft: 12 },
  cardTitle: { fontWeight: "700", fontSize: 15, marginBottom: 2, color: "#1F2937" },
  cardSub: { color: "#6B7280", fontSize: 12 },

  // Saved cases section
  savedSection: { marginBottom: 20 },
  savedHeader: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", marginBottom: 12,
  },
  savedHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  savedTitle: { fontSize: 15, fontWeight: "800", color: "#1F2937" },
  viewAllText: { fontSize: 13, fontWeight: "700", color: "#C45E3D" },

  savedCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#fff", borderRadius: 16,
    marginBottom: 10, paddingVertical: 12, paddingRight: 14,
    overflow: "hidden",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
    gap: 10,
  },
  savedCardAccent: { width: 4, alignSelf: "stretch" },
  savedIconBox: {
    width: 36, height: 36, borderRadius: 10,
    justifyContent: "center", alignItems: "center",
  },
  savedCardContent: { flex: 1 },
  savedName: { fontSize: 14, fontWeight: "700", color: "#1F2937", marginBottom: 2 },
  savedMeta: { fontSize: 11, color: "#9CA3AF" },
  sevPill: {
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
  },
  sevPillText: { fontSize: 10, fontWeight: "800" },

  seeAllBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, paddingVertical: 12,
    borderWidth: 1.5, borderColor: "#C45E3D",
    borderRadius: 14, borderStyle: "dashed", marginTop: 4,
  },
  seeAllText: { fontSize: 13, fontWeight: "700", color: "#C45E3D" },

  // CTA button
  primaryButton: {
    backgroundColor: "#C45E3D", padding: 18, borderRadius: 16,
    alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 10,
    shadowColor: "#C45E3D", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  primaryButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});