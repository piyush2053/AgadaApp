import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    deleteCase,
    formatCaseDate,
    getAllCases,
    SavedCase,
} from "./utils/StorageService";

const getSeverityColors = (level: string) => {
  switch (level) {
    case "Severe Complicated": return { color: "#DC2626", bgColor: "#FEE2E2", dot: "#DC2626" };
    case "Alarming":           return { color: "#EA580C", bgColor: "#FFEDD5", dot: "#EA580C" };
    case "Moderate":           return { color: "#D97706", bgColor: "#FEF3C7", dot: "#D97706" };
    default:                   return { color: "#059669", bgColor: "#D1FAE5", dot: "#059669" };
  }
};

const getTypeLabel = (t: string): string => {
  const map: Record<string, string> = {
    cobra: "Cobra Bite",
    viper: "Viper Bite",
    krait: "Krait Bite",
    scorpion: "Scorpion Sting",
    insect: "Insect Bite",
    spider: "Spider Bite",
    dog: "Dog Bite",
    rat: "Rat Bite",
    animal: "Animal Bite",
    gara_visha: "Gara Visha",
    dushi_visha: "Dushi Visha",
    virruddha_aahara: "Virruddha Aahara",
  };
  if (t?.startsWith("external_")) return "External Contact";
  return map[t] || t || "Unknown";
};

const getTypeIcon = (t: string): string => {
  if (!t) return "help-outline";
  if (t.includes("cobra") || t.includes("viper") || t.includes("krait") || t.includes("snake")) return "pest-control-rodent";
  if (t.includes("scorpion") || t.includes("insect") || t.includes("spider")) return "bug-report";
  if (t.includes("dog")) return "pets";
  if (t.includes("rat") || t.includes("animal")) return "mouse";
  if (t.includes("external")) return "pan-tool-alt";
  if (t.includes("gara") || t.includes("dushi")) return "assignment";
  if (t.includes("virruddha")) return "restaurant";
  return "medical-services";
};

export default function Cases() {
  const router = useRouter();
  const [cases, setCases] = useState<SavedCase[]>([]);
  const [filtered, setFiltered] = useState<SavedCase[]>([]);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadCases = useCallback(async () => {
    const all = await getAllCases();
    setCases(all);
    setFiltered(all);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadCases();
  }, [loadCases]);

  // Refresh when navigating back to this screen
  useEffect(() => {
    loadCases();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCases();
    setRefreshing(false);
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    if (!text.trim()) {
      setFiltered(cases);
      return;
    }
    const q = text.toLowerCase();
    setFiltered(
      cases.filter(
        (c) =>
          c.identity?.name?.toLowerCase().includes(q) ||
          getTypeLabel(c.exposureType || "").toLowerCase().includes(q) ||
          c.severityLevel?.toLowerCase().includes(q)
      )
    );
  };

  const handleDelete = (c: SavedCase) => {
    Alert.alert(
      "Delete Case",
      `Delete case for "${c.identity?.name || "Unknown Patient"}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteCase(c.id);
            await loadCases();
          },
        },
      ]
    );
  };

  const handleOpen = (c: SavedCase) => {
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
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={styles.emptyState}>
          <Text style={styles.loadingText}>Loading cases…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#C45E3D" />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Saved Cases</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{cases.length}</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>
          All offline-saved Agada Sanjeevini assessments. Pull down to refresh.
        </Text>

        {/* Search */}
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, type, severity..."
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={handleSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch("")}>
              <MaterialIcons name="close" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Empty state */}
        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconBox}>
              <MaterialIcons name="folder-open" size={40} color="#D1D5DB" />
            </View>
            <Text style={styles.emptyTitle}>
              {search ? "No matching cases" : "No saved cases yet"}
            </Text>
            <Text style={styles.emptySubtitle}>
              {search
                ? "Try a different search term"
                : "Complete an assessment and tap Save Case to store it here."}
            </Text>
            {!search && (
              <TouchableOpacity
                style={styles.startBtn}
                onPress={() => router.push("/identity")}
                activeOpacity={0.8}
              >
                <Text style={styles.startBtnText}>Start New Diagnosis</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Case cards */}
        {filtered.map((c) => {
          const sev = getSeverityColors(c.severityLevel || "Mild");
          return (
            <TouchableOpacity
              key={c.id}
              style={styles.caseCard}
              onPress={() => handleOpen(c)}
              activeOpacity={0.7}
            >
              {/* Left color bar */}
              <View style={[styles.colorBar, { backgroundColor: sev.dot }]} />

              <View style={styles.caseBody}>
                {/* Top row */}
                <View style={styles.caseTopRow}>
                  <View style={[styles.typeIconBox, { backgroundColor: sev.bgColor }]}>
                    <MaterialIcons
                      name={getTypeIcon(c.exposureType || "") as any}
                      size={20}
                      color={sev.color}
                    />
                  </View>

                  <View style={styles.caseTitleBlock}>
                    <Text style={styles.patientName} numberOfLines={1}>
                      {c.identity?.name || "Unknown Patient"}
                    </Text>
                    <Text style={styles.caseType} numberOfLines={1}>
                      {getTypeLabel(c.exposureType || "")}
                    </Text>
                  </View>

                  {/* Severity badge */}
                  <View style={[styles.severityBadge, { backgroundColor: sev.bgColor }]}>
                    <Text style={[styles.severityBadgeText, { color: sev.color }]}>
                      {c.severityLevel || "Mild"}
                    </Text>
                  </View>
                </View>

                {/* Meta row */}
                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <MaterialIcons name="schedule" size={12} color="#9CA3AF" />
                    <Text style={styles.metaText}>{formatCaseDate(c.createdAt)}</Text>
                  </View>

                  {c.identity?.age && (
                    <View style={styles.metaItem}>
                      <MaterialIcons name="person" size={12} color="#9CA3AF" />
                      <Text style={styles.metaText}>
                        {c.identity.age} yrs • {c.identity.gender || ""}
                      </Text>
                    </View>
                  )}

                  <View style={styles.metaItem}>
                    <MaterialIcons name="analytics" size={12} color="#9CA3AF" />
                    <Text style={styles.metaText}>
                      {c.severityPercentage?.toFixed(1) || 0}%
                    </Text>
                  </View>
                </View>

                {/* Symptom chips preview */}
                {c.symptoms?.length > 0 && (
                  <View style={styles.chipRow}>
                    {c.symptoms.slice(0, 3).map((s, i) => (
                      <View key={i} style={styles.chip}>
                        <Text style={styles.chipText} numberOfLines={1}>
                          {s.symptom.length > 22 ? s.symptom.slice(0, 22) + "…" : s.symptom}
                        </Text>
                      </View>
                    ))}
                    {c.symptoms.length > 3 && (
                      <View style={[styles.chip, styles.chipMore]}>
                        <Text style={styles.chipMoreText}>+{c.symptoms.length - 3}</Text>
                      </View>
                    )}
                  </View>
                )}

                {/* Action row */}
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.openBtn}
                    onPress={() => handleOpen(c)}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons name="open-in-new" size={14} color="#C45E3D" />
                    <Text style={styles.openBtnText}>View Full Report</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(c)}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons name="delete-outline" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Bottom spacer */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F1F3E1" },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 8 },
  title: { fontSize: 26, fontWeight: "800", color: "#1F2937" },
  countBadge: {
    backgroundColor: "#C45E3D",
    width: 28, height: 28,
    borderRadius: 14,
    justifyContent: "center", alignItems: "center",
  },
  countText: { color: "#fff", fontWeight: "800", fontSize: 13 },
  subtitle: { color: "#6B7280", fontSize: 13, marginTop: 6, marginBottom: 18, lineHeight: 19 },
  searchBox: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#fff", borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 12,
    gap: 10, marginBottom: 18,
    borderWidth: 1, borderColor: "#E5E7EB",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  searchInput: { flex: 1, fontSize: 14, color: "#1F2937", padding: 0 },
  emptyState: {
    alignItems: "center", paddingVertical: 60,
  },
  loadingText: { color: "#9CA3AF", fontSize: 14 },
  emptyIconBox: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: "#F3F4F6",
    justifyContent: "center", alignItems: "center", marginBottom: 16,
  },
  emptyTitle: { fontSize: 17, fontWeight: "700", color: "#1F2937", marginBottom: 6 },
  emptySubtitle: {
    fontSize: 13, color: "#9CA3AF",
    textAlign: "center", lineHeight: 19, paddingHorizontal: 20, marginBottom: 24,
  },
  startBtn: {
    backgroundColor: "#C45E3D", paddingHorizontal: 24, paddingVertical: 14,
    borderRadius: 14,
    shadowColor: "#C45E3D", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  startBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  // Case card
  caseCard: {
    backgroundColor: "#fff", borderRadius: 18,
    marginBottom: 14, flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
  },
  colorBar: { width: 4 },
  caseBody: { flex: 1, padding: 16 },
  caseTopRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10 },
  typeIconBox: {
    width: 40, height: 40, borderRadius: 12,
    justifyContent: "center", alignItems: "center",
  },
  caseTitleBlock: { flex: 1 },
  patientName: { fontSize: 15, fontWeight: "800", color: "#1F2937" },
  caseType: { fontSize: 12, color: "#6B7280", marginTop: 1 },
  severityBadge: {
    paddingHorizontal: 9, paddingVertical: 4,
    borderRadius: 10,
  },
  severityBadgeText: { fontSize: 11, fontWeight: "800" },
  metaRow: { flexDirection: "row", gap: 14, flexWrap: "wrap", marginBottom: 10 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 11, color: "#9CA3AF", fontWeight: "500" },
  chipRow: { flexDirection: "row", gap: 6, flexWrap: "wrap", marginBottom: 12 },
  chip: {
    backgroundColor: "#F3F4F6", borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  chipText: { fontSize: 11, color: "#6B7280", fontWeight: "500" },
  chipMore: { backgroundColor: "#E5E7EB" },
  chipMoreText: { fontSize: 11, color: "#374151", fontWeight: "700" },
  actionRow: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1, borderTopColor: "#F1F5F9",
    paddingTop: 10,
  },
  openBtn: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "#FFF4EE", paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 10,
  },
  openBtnText: { fontSize: 12, fontWeight: "700", color: "#C45E3D" },
  deleteBtn: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: "#FEF2F2",
    justifyContent: "center", alignItems: "center",
  },
});