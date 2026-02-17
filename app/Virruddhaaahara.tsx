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

export default function VirruddhaAahara() {
  const router = useRouter();
  const [scores, setScores] = useState<Record<string, FrequencyOption | null>>({});

  const totalFrequencyScore = Object.values(scores).reduce((sum, freq) => {
    if (!freq) return sum;
    return sum + frequencyScore[freq];
  }, 0);

  const answeredCount = Object.values(scores).filter((v) => v !== null && v !== undefined).length;
  const severity = calculateVirruddhaAaharaSeverity(totalFrequencyScore);

  const handleContinue = () => {
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
        severityLevel: severity.level,
        severityPercentage: String(severity.percentage.toFixed(1)),
      },
    });
  };

  const frequencyColors: Record<FrequencyOption, string> = {
    Never: "#9CA3AF",
    Rarely: "#10B981",
    Occasionally: "#F59E0B",
    Frequently: "#EF4444",
    Daily: "#7C3AED",
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.breadcrumb}>ASSESS › VIRRUDDHA AAHARA</Text>
          <Text style={styles.title}>
            Incompatible <Text style={{ color: "#6B7280" }}>Food Combinations</Text>
          </Text>
          <Text style={styles.subtitle}>
            Rate how frequently the patient consumes each incompatible food combination (Viruddha Ahara).
          </Text>

          {/* Score summary */}
          {answeredCount > 0 && (
            <View style={[styles.scorePreview, { backgroundColor: severity.bgColor }]}>
              <View>
                <Text style={[styles.scoreLevel, { color: severity.color }]}>{severity.level}</Text>
                <Text style={[styles.scorePct, { color: severity.color }]}>
                  Score: {totalFrequencyScore}/40 — {severity.percentage.toFixed(1)}%
                </Text>
              </View>
              <View style={[styles.scoreBadge, { backgroundColor: severity.color }]}>
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

          {virruddhaAaharaItems.map((item, index) => {
            const selected = scores[item.id];
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
                    const isSelected = selected === opt;
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
                        onPress={() => setScores((prev) => ({ ...prev, [item.id]: opt }))}
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
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.continueBtn, answeredCount === 0 && styles.continueBtnDisabled]}
            onPress={handleContinue}
            disabled={answeredCount === 0}
            activeOpacity={0.8}
          >
            <MaterialIcons name="assignment" size={20} color="#fff" />
            <Text style={styles.continueText}>Generate Clinical Summary</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9F0" },
  scrollContent: { padding: 20, paddingBottom: 100 },
  breadcrumb: { fontSize: 11, fontWeight: "700", color: "#9CA3AF", letterSpacing: 0.5, marginTop: 8 },
  title: { fontSize: 24, fontWeight: "800", marginTop: 10, color: "#1F2937" },
  subtitle: { color: "#64748B", marginTop: 8, marginBottom: 16, fontSize: 13, lineHeight: 19 },
  scorePreview: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    padding: 14, borderRadius: 12, marginBottom: 16,
  },
  scoreLevel: { fontSize: 15, fontWeight: "800" },
  scorePct: { fontSize: 12, fontWeight: "600", marginTop: 2 },
  scoreBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  scoreBadgeText: { color: "#fff", fontWeight: "800", fontSize: 13 },
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
  footer: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    padding: 20, backgroundColor: "#F8F9F0",
    borderTopWidth: 1, borderTopColor: "#E5E7EB",
  },
  continueBtn: {
    backgroundColor: "#C45E3D", padding: 18, borderRadius: 16,
    flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8,
    shadowColor: "#C45E3D", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  continueBtnDisabled: { backgroundColor: "#94A3B8", shadowOpacity: 0, elevation: 0 },
  continueText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});