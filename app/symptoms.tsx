import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getSymptomsForType, Symptom } from "./utils/MedicalData";
import { calculateSeverity, getSymptomGradeColor, getSymptomGradeLabel } from "./utils/SeverityEngine";

export default function Symptoms() {
  const { type } = useLocalSearchParams();
  const router = useRouter();
  const typeStr = (type as string) || "animal";

  const symptoms: Symptom[] = useMemo(() => getSymptomsForType(typeStr), [typeStr]);
  const totalPossible = symptoms.length;

  const [activeSymptoms, setActiveSymptoms] = useState<Record<string, boolean>>({});
  const [grades, setGrades] = useState<Record<string, number>>({});

  const toggleSymptom = (id: string) => {
    setActiveSymptoms((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (!next[id]) {
        setGrades((g) => {
          const ng = { ...g };
          delete ng[id];
          return ng;
        });
      }
      return next;
    });
  };

  const setGrade = (id: string, grade: number) => {
    setGrades((prev) => ({ ...prev, [id]: grade }));
  };

  const presentCount = Object.values(activeSymptoms).filter(Boolean).length;
  const severityResult = calculateSeverity(presentCount, totalPossible);

  const categories = useMemo(
    () => [...new Set(symptoms.map((s) => s.category))],
    [symptoms]
  );

  const getLabelForType = (t: string): string => {
    const map: Record<string, string> = {
      cobra: "Cobra (Darvikara)",
      viper: "Viper (Mandali)",
      krait: "Krait (Rajimanta)",
      scorpion: "Scorpion (Vruschika)",
      insect: "Insect (Keeta)",
      spider: "Spider (Luta)",
      dog: "Dog (Shwana)",
      rat: "Rat (Mushika)",
      animal: "Animal Bite",
    };
    return map[t] || t.charAt(0).toUpperCase() + t.slice(1);
  };

  const handleGenerate = () => {
    const selected = Object.keys(activeSymptoms)
      .filter((key) => activeSymptoms[key])
      .map((key) => {
        const s = symptoms.find((sym) => sym.id === key);
        return { symptom: s?.title || key, grade: grades[key] || 1 };
      });

    router.push({
      pathname: "/summary",
      params: {
        type: typeStr,
        symptoms: JSON.stringify(selected),
        presentCount: String(presentCount),
        totalPossible: String(totalPossible),
        severityLevel: severityResult.level,
        severityPercentage: String(severityResult.percentage.toFixed(1)),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Symptom Assessment</Text>
          <Text style={styles.typeLabel}>{getLabelForType(typeStr)}</Text>
          <Text style={styles.subtitle}>
            Toggle each symptom as Present or Absent. For present symptoms, grade severity from 1 (minimal) to 10 (critical).
          </Text>

          {/* Live Severity Preview */}
          {presentCount > 0 && (
            <View style={[styles.severityPreview, { backgroundColor: severityResult.bgColor }]}>
              <View style={styles.severityPreviewLeft}>
                <Text style={[styles.severityPreviewLevel, { color: severityResult.color }]}>
                  {severityResult.level}
                </Text>
                <Text style={[styles.severityPreviewPct, { color: severityResult.color }]}>
                  {severityResult.percentage.toFixed(1)}% ({presentCount}/{totalPossible} symptoms)
                </Text>
              </View>
              <View style={[styles.severityPill, { backgroundColor: severityResult.color }]}>
                <Text style={styles.severityPillText}>LIVE</Text>
              </View>
            </View>
          )}

          {/* Symptom Cards by Category */}
          {categories.map((cat) => (
            <View key={cat}>
              <Text style={styles.category}>{cat.toUpperCase()}</Text>

              {symptoms
                .filter((s) => s.category === cat)
                .map((symptom) => {
                  const isActive = !!activeSymptoms[symptom.id];
                  const grade = grades[symptom.id] || 0;

                  return (
                    <View key={symptom.id} style={[styles.card, isActive && styles.cardActive]}>
                      <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.symptomTitle}>{symptom.title}</Text>
                          <Text style={styles.symptomSanskrit}>{symptom.titleSanskrit}</Text>
                        </View>
                        <Switch
                          value={isActive}
                          onValueChange={() => toggleSymptom(symptom.id)}
                          trackColor={{ false: "#E5E7EB", true: "#FCA58F" }}
                          thumbColor={isActive ? "#C45E3D" : "#F3F4F6"}
                          ios_backgroundColor="#E5E7EB"
                        />
                      </View>

                      {isActive && (
                        <View style={styles.gradeContainer}>
                          <View style={styles.gradeLabelRow}>
                            <Text style={styles.gradeLabel}>SEVERITY GRADE</Text>
                            {grade > 0 && (
                              <Text style={[styles.gradeValue, { color: getSymptomGradeColor(grade) }]}>
                                {grade}/10 — {getSymptomGradeLabel(grade)}
                              </Text>
                            )}
                          </View>

                          {/* Grade slider row 1–10 */}
                          <View style={styles.gradeRow}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                              <TouchableOpacity
                                key={n}
                                style={[
                                  styles.gradeBtn,
                                  grade === n && {
                                    backgroundColor: getSymptomGradeColor(n),
                                    borderColor: getSymptomGradeColor(n),
                                  },
                                ]}
                                onPress={() => setGrade(symptom.id, n)}
                                activeOpacity={0.7}
                              >
                                <Text
                                  style={[
                                    styles.gradeBtnText,
                                    grade === n && styles.gradeBtnTextActive,
                                  ]}
                                >
                                  {n}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>

                          {/* Grade scale legend */}
                          <View style={styles.gradeLegend}>
                            <Text style={styles.gradeLegendText}>1–2 Minimal</Text>
                            <Text style={styles.gradeLegendText}>3–4 Mild</Text>
                            <Text style={styles.gradeLegendText}>5–6 Moderate</Text>
                            <Text style={styles.gradeLegendText}>7–8 Severe</Text>
                            <Text style={styles.gradeLegendText}>9–10 Critical</Text>
                          </View>
                        </View>
                      )}
                    </View>
                  );
                })}
            </View>
          ))}
        </ScrollView>

        {/* Bottom Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.generateBtn, presentCount === 0 && styles.generateBtnDisabled]}
            onPress={handleGenerate}
            disabled={presentCount === 0}
            activeOpacity={0.8}
          >
            <MaterialIcons name="assignment" size={20} color="#fff" />
            <Text style={styles.generateText}>Generate Clinical Summary</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  scrollContent: { padding: 20, paddingBottom: 100 },
  title: { fontSize: 24, fontWeight: "800", marginTop: 8, color: "#1F2937" },
  typeLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#C45E3D",
    backgroundColor: "#FFF4EE",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 6,
    marginBottom: 10,
  },
  subtitle: { color: "#64748B", marginBottom: 16, fontSize: 13, lineHeight: 19 },
  severityPreview: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
  },
  severityPreviewLeft: {},
  severityPreviewLevel: { fontSize: 16, fontWeight: "800" },
  severityPreviewPct: { fontSize: 12, fontWeight: "600", marginTop: 2 },
  severityPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  severityPillText: { fontSize: 10, fontWeight: "800", color: "#fff" },
  category: {
    marginTop: 20, marginBottom: 10,
    fontSize: 11, fontWeight: "800",
    color: "#94A3B8", letterSpacing: 0.5,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "transparent",
  },
  cardActive: { borderColor: "#FCA58F", backgroundColor: "#FFFAF8" },
  row: { flexDirection: "row", alignItems: "center" },
  symptomTitle: { fontWeight: "700", fontSize: 14, color: "#1F2937", marginBottom: 2 },
  symptomSanskrit: { fontSize: 11, color: "#9CA3AF", fontStyle: "italic" },
  gradeContainer: { marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderColor: "#F1F5F9" },
  gradeLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  gradeLabel: { fontSize: 10, fontWeight: "800", color: "#94A3B8", letterSpacing: 0.5 },
  gradeValue: { fontSize: 12, fontWeight: "700" },
  gradeRow: { flexDirection: "row", gap: 5, flexWrap: "nowrap" },
  gradeBtn: {
    width: 28, height: 28,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  gradeBtnText: { fontSize: 12, fontWeight: "700", color: "#64748B" },
  gradeBtnTextActive: { color: "#fff" },
  gradeLegend: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  gradeLegendText: { fontSize: 9, color: "#CBD5E1", fontWeight: "600" },
  footer: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    padding: 20, backgroundColor: "#F8FAFC",
    borderTopWidth: 1, borderTopColor: "#E5E7EB",
  },
  generateBtn: {
    backgroundColor: "#C45E3D",
    padding: 18, borderRadius: 16,
    flexDirection: "row", justifyContent: "center", alignItems: "center",
    gap: 8,
    shadowColor: "#C45E3D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  generateBtnDisabled: { backgroundColor: "#94A3B8", shadowOpacity: 0, elevation: 0 },
  generateText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});