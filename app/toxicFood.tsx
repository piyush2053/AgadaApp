import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FrequencyOption,
  frequencyOptions,
  frequencyScore,
  virruddhaAaharaItems,
} from "./utils/MedicalData";
import { calculateVirruddhaAaharaSeverity } from "./utils/SeverityEngine";

// ─── Data ─────────────────────────────────────────────────────────────────────

const foodTypes = [
  { key: "mushroom",  label: "Mushroom",    sub: "Chatrak Visha",  icon: "eco" },
  { key: "seafood",   label: "Seafood",      sub: "Jalaja Visha",   icon: "set-meal" },
  { key: "chemical",  label: "Chemical",     sub: "Kritrima Visha", icon: "science" },
  { key: "pesticide", label: "Pesticide",    sub: "Keeta Nashak",   icon: "coronavirus" },
  { key: "spoiled",   label: "Spoiled Food", sub: "Dushita Anna",   icon: "dangerous" },
  { key: "plant",     label: "Toxic Plant",  sub: "Sthavara Visha", icon: "local-florist" },
];

const frequencyColors: Record<FrequencyOption, string> = {
  Never:        "#9CA3AF",
  Rarely:       "#10B981",
  Occasionally: "#F59E0B",
  Frequently:   "#EF4444",
  Daily:        "#7C3AED",
};

// ─── Component ────────────────────────────────────────────────────────────────

type ActiveTab = "toxic" | "viruddha";

export default function ToxicFood() {
  const router = useRouter();

  // Toxic food selection
  const [selected, setSelected] = useState("mushroom");

  // Tab toggle
  const [activeTab, setActiveTab] = useState<ActiveTab>("toxic");

  // Viruddha Ahara frequency scores
  const [scores, setScores] = useState<Record<string, FrequencyOption | null>>({});

  const totalFrequencyScore = Object.values(scores).reduce((sum, freq) => {
    if (!freq) return sum;
    return sum + frequencyScore[freq];
  }, 0);
  const answeredCount = Object.values(scores).filter(
    (v) => v !== null && v !== undefined
  ).length;
  const viruddhaSeverity = calculateVirruddhaAaharaSeverity(totalFrequencyScore);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleToxicContinue = () => {
    router.push(`/symptoms?type=${selected}`);
  };

  const handleViruddhaContinue = () => {
    const positiveItems = virruddhaAaharaItems
      .filter((item) => scores[item.id] && scores[item.id] !== "Never")
      .map((item) => ({
        symptom: `${item.food} — ${scores[item.id]}`,
        grade: frequencyScore[scores[item.id] as FrequencyOption] * 2,
      }));

    router.push({
      pathname: "/summary",
      params: {
        type: "virruddha_aahara",
        symptoms: JSON.stringify(positiveItems),
        presentCount: String(totalFrequencyScore),
        totalPossible: "40",
        severityLevel: viruddhaSeverity.level,
        severityPercentage: String(viruddhaSeverity.percentage.toFixed(1)),
      },
    });
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.breadcrumb}>ASSESS › TOXIC FOOD / INGESTION</Text>
          <Text style={styles.title}>
            Food &{" "}
            <Text style={{ color: "#6B7280" }}>Dietary Toxicity</Text>
          </Text>
          <Text style={styles.subtitle}>
            Assess acute toxic ingestion or chronic incompatible food habits.
          </Text>

          {/* ── Tab switcher ── */}
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "toxic" && styles.tabActive]}
              onPress={() => setActiveTab("toxic")}
              activeOpacity={0.8}
            >
              <MaterialIcons
                name="dangerous"
                size={16}
                color={activeTab === "toxic" ? "#2E7D32" : "#9CA3AF"}
              />
              <Text style={[styles.tabText, activeTab === "toxic" && styles.tabTextActive]}>
                Toxic Food
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === "viruddha" && styles.tabActiveViruddha]}
              onPress={() => setActiveTab("viruddha")}
              activeOpacity={0.8}
            >
              <MaterialIcons
                name="no-meals"
                size={16}
                color={activeTab === "viruddha" ? "#C45E3D" : "#9CA3AF"}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === "viruddha" && styles.tabTextViruddha,
                ]}
              >
                Viruddha Ahara
              </Text>
            </TouchableOpacity>
          </View>

          {/* ══════════════════════════════════════════
              SECTION A: Toxic Food
          ══════════════════════════════════════════ */}
          {activeTab === "toxic" && (
            <>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionDot, { backgroundColor: "#2E7D32" }]} />
                <Text style={[styles.sectionTitle, { color: "#2E7D32" }]}>
                  TOXIC FOOD / GARAVISHA
                </Text>
              </View>
              <Text style={styles.sectionDesc}>
                Select the type of toxic food or substance ingested for symptom assessment.
              </Text>

              <View style={styles.grid}>
                {foodTypes.map((item) => {
                  const isSelected = selected === item.key;
                  return (
                    <TouchableOpacity
                      key={item.key}
                      style={[styles.card, isSelected && styles.cardSelected]}
                      onPress={() => setSelected(item.key)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.iconBox, isSelected && styles.iconBoxSelected]}>
                        <MaterialIcons
                          name={item.icon as any}
                          size={28}
                          color={isSelected ? "#2E7D32" : "#6B7280"}
                        />
                      </View>
                      <Text style={styles.cardTitle}>{item.label}</Text>
                      <Text style={styles.cardSub}>{item.sub}</Text>
                    </TouchableOpacity>
                  );
                })}

                {/* Other Toxic Food */}
                <TouchableOpacity
                  style={[styles.card, styles.otherCard, selected === "other" && styles.cardSelected]}
                  onPress={() => setSelected("other")}
                  activeOpacity={0.7}
                >
                  <View style={styles.otherRow}>
                    <View style={[styles.iconBox, selected === "other" && styles.iconBoxSelected]}>
                      <MaterialIcons
                        name="fastfood"
                        size={28}
                        color={selected === "other" ? "#2E7D32" : "#6B7280"}
                      />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.cardTitle}>Other Toxic Food</Text>
                      <Text style={styles.cardSub}>Anya Garavisha</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
                  </View>
                </TouchableOpacity>
              </View>

              {/* Info box */}
              <View style={[styles.infoBox, { borderColor: "#DDF3E4" }]}>
                <View style={[styles.infoIconBox, { backgroundColor: "#DDF3E4" }]}>
                  <MaterialIcons name="info" size={18} color="#2E7D32" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={[styles.infoTitle, { color: "#2E7D32" }]}>Garavisha Assessment</Text>
                  <Text style={[styles.infoText, { color: "#2E7D32" }]}>
                    Ingested poisons require immediate attention. Document the time of ingestion and quantity consumed if known.
                  </Text>
                </View>
              </View>
            </>
          )}

          {/* ══════════════════════════════════════════
              SECTION B: Viruddha Ahara
          ══════════════════════════════════════════ */}
          {activeTab === "viruddha" && (
            <>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionDot, { backgroundColor: "#C45E3D" }]} />
                <Text style={[styles.sectionTitle, { color: "#C45E3D" }]}>
                  VIRUDDHA AAHARA
                </Text>
              </View>
              <Text style={styles.sectionDesc}>
                Rate how frequently the patient consumes each incompatible food combination.
              </Text>

              {/* Score preview */}
              {answeredCount > 0 && (
                <View style={[styles.scorePreview, { backgroundColor: viruddhaSeverity.bgColor }]}>
                  <View>
                    <Text style={[styles.scoreLevel, { color: viruddhaSeverity.color }]}>
                      {viruddhaSeverity.level}
                    </Text>
                    <Text style={[styles.scorePct, { color: viruddhaSeverity.color }]}>
                      Score: {totalFrequencyScore}/40 — {viruddhaSeverity.percentage.toFixed(1)}%
                    </Text>
                  </View>
                  <View style={[styles.scoreBadge, { backgroundColor: viruddhaSeverity.color }]}>
                    <Text style={styles.scoreBadgeText}>{answeredCount}/10</Text>
                  </View>
                </View>
              )}

              {/* Frequency legend */}
              <View style={styles.legendBox}>
                <Text style={styles.legendTitle}>FREQUENCY SCALE</Text>
                <View style={styles.legendRow}>
                  {frequencyOptions.map((opt) => (
                    <View key={opt} style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: frequencyColors[opt] }]} />
                      <Text style={styles.legendText}>{opt}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Food combination items */}
              {virruddhaAaharaItems.map((item, index) => {
                const sel = scores[item.id];
                return (
                  <View key={item.id} style={styles.itemCard}>
                    <View style={styles.itemHeader}>
                      <View style={styles.itemNumBox}>
                        <Text style={styles.itemNum}>{index + 1}</Text>
                      </View>
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemFood}>{item.food}</Text>
                        <Text style={styles.itemCombination}>{item.combination}</Text>
                        <Text style={styles.itemSanskrit}>{item.sanskritName}</Text>
                      </View>
                    </View>
                    <View style={styles.frequencyRow}>
                      {frequencyOptions.map((opt) => {
                        const isSelected = sel === opt;
                        return (
                          <TouchableOpacity
                            key={opt}
                            style={[
                              styles.freqBtn,
                              isSelected && {
                                backgroundColor: frequencyColors[opt],
                                borderColor: frequencyColors[opt],
                              },
                            ]}
                            onPress={() =>
                              setScores((prev) => ({ ...prev, [item.id]: opt }))
                            }
                            activeOpacity={0.7}
                          >
                            <Text style={[styles.freqText, isSelected && { color: "#fff" }]}>
                              {opt}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                );
              })}

              {/* Info box */}
              <View style={[styles.infoBox, { borderColor: "#FDEAD7" }]}>
                <View style={[styles.infoIconBox, { backgroundColor: "#FDEAD7" }]}>
                  <MaterialIcons name="info" size={18} color="#C45E3D" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={[styles.infoTitle, { color: "#C45E3D" }]}>Viruddha Ahara</Text>
                  <Text style={[styles.infoText, { color: "#C45E3D" }]}>
                    Incompatible food combinations build up chronic toxicity (Dushi Visha) over time, even without acute poisoning.
                  </Text>
                </View>
              </View>
            </>
          )}
        </ScrollView>

        {/* ── Footer button — changes based on active tab ── */}
        <View style={styles.footer}>
          {activeTab === "toxic" ? (
            <TouchableOpacity
              style={[styles.continueBtn, { backgroundColor: "#2E7D32", shadowColor: "#2E7D32" }]}
              onPress={handleToxicContinue}
              activeOpacity={0.8}
            >
              <Text style={styles.continueText}>Continue Assessment</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.continueBtn,
                { backgroundColor: "#C45E3D", shadowColor: "#C45E3D" },
                answeredCount === 0 && styles.continueBtnDisabled,
              ]}
              onPress={handleViruddhaContinue}
              disabled={answeredCount === 0}
              activeOpacity={0.8}
            >
              <MaterialIcons name="assignment" size={20} color="#fff" />
              <Text style={styles.continueText}>Generate Clinical Summary</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAF5" },
  scrollContent: { padding: 20, paddingBottom: 110 },

  breadcrumb: { marginTop: 8, fontSize: 11, fontWeight: "700", color: "#9CA3AF", letterSpacing: 0.5 },
  title: { fontSize: 26, fontWeight: "800", marginTop: 10, color: "#1F2937" },
  subtitle: { color: "#6B7280", marginTop: 8, marginBottom: 20, fontSize: 13, lineHeight: 19 },

  // ── Tab switcher
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 11,
  },
  tabActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabActiveViruddha: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: { fontSize: 13, fontWeight: "700", color: "#9CA3AF" },
  tabTextActive: { color: "#2E7D32" },
  tabTextViruddha: { color: "#C45E3D" },

  // ── Section labels
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  sectionDot: { width: 10, height: 10, borderRadius: 5 },
  sectionTitle: { fontSize: 11, fontWeight: "800", letterSpacing: 0.5 },
  sectionDesc: { fontSize: 13, color: "#6B7280", marginBottom: 20, lineHeight: 19 },

  // ── Food type grid
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardSelected: { borderColor: "#2E7D32", backgroundColor: "#F1F8F4" },
  iconBox: {
    width: 56, height: 56, borderRadius: 16,
    backgroundColor: "#F3F4F6",
    justifyContent: "center", alignItems: "center", marginBottom: 12,
  },
  iconBoxSelected: { backgroundColor: "#DDF3E4" },
  cardTitle: { fontWeight: "700", fontSize: 15, color: "#1F2937", marginBottom: 2 },
  cardSub: { fontSize: 12, color: "#9CA3AF", fontStyle: "italic" },
  otherCard: { width: "100%" },
  otherRow: { flexDirection: "row", alignItems: "center", width: "100%" },

  // ── Info box
  infoBox: {
    flexDirection: "row",
    padding: 16, borderRadius: 18, marginTop: 12,
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  infoIconBox: {
    width: 34, height: 34, borderRadius: 10,
    justifyContent: "center", alignItems: "center",
  },
  infoContent: { flex: 1, marginLeft: 12 },
  infoTitle: { fontWeight: "700", marginBottom: 4, fontSize: 14 },
  infoText: { fontSize: 12, lineHeight: 17 },

  // ── Viruddha score preview
  scorePreview: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    padding: 14, borderRadius: 12, marginBottom: 16,
  },
  scoreLevel: { fontSize: 15, fontWeight: "800" },
  scorePct: { fontSize: 12, fontWeight: "600", marginTop: 2 },
  scoreBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  scoreBadgeText: { color: "#fff", fontWeight: "800", fontSize: 13 },

  // ── Frequency legend
  legendBox: {
    backgroundColor: "#fff", borderRadius: 14, padding: 14, marginBottom: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  legendTitle: { fontSize: 10, fontWeight: "800", color: "#94A3B8", letterSpacing: 0.5, marginBottom: 10 },
  legendRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, color: "#6B7280", fontWeight: "600" },

  // ── Viruddha item cards
  itemCard: {
    backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 14,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
  },
  itemHeader: { flexDirection: "row", gap: 12, marginBottom: 14 },
  itemNumBox: {
    width: 30, height: 30, borderRadius: 8,
    backgroundColor: "#F3F4F6", justifyContent: "center", alignItems: "center",
  },
  itemNum: { fontSize: 14, fontWeight: "800", color: "#374151" },
  itemInfo: { flex: 1 },
  itemFood: { fontSize: 15, fontWeight: "800", color: "#1F2937" },
  itemCombination: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  itemSanskrit: { fontSize: 11, color: "#9CA3AF", fontStyle: "italic", marginTop: 2 },
  frequencyRow: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  freqBtn: {
    paddingHorizontal: 10, paddingVertical: 7, borderRadius: 10,
    backgroundColor: "#F3F4F6", borderWidth: 1.5, borderColor: "#E5E7EB",
  },
  freqText: { fontSize: 11, fontWeight: "700", color: "#6B7280" },

  // ── Footer
  footer: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    padding: 20, backgroundColor: "#F9FAF5",
    borderTopWidth: 1, borderTopColor: "#E5E7EB",
  },
  continueBtn: {
    padding: 18, borderRadius: 16,
    flexDirection: "row", justifyContent: "center", alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  continueBtnDisabled: { backgroundColor: "#94A3B8", shadowOpacity: 0, elevation: 0 },
  continueText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
