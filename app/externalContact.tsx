import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { externalCategories, ExternalCategory, Symptom } from "./utils/MedicalData";
import { calculateSeverity } from "./utils/SeverityEngine";

export default function ExternalContact() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<ExternalCategory | null>(null);
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
  const totalPossible = selectedCategory ? selectedCategory.symptoms.length : 0;
  const severityResult = calculateSeverity(presentCount, totalPossible);

  const handleContinue = () => {
    const selected = Object.keys(activeSymptoms)
      .filter((key) => activeSymptoms[key])
      .map((key) => {
        const sym = selectedCategory?.symptoms.find((s) => s.id === key);
        return { symptom: sym?.title || key, grade: grades[key] || 1 };
      });

    router.push({
      pathname: "/summary",
      params: {
        type: `external_${selectedCategory?.id || "contact"}`,
        symptoms: JSON.stringify(selected),
        presentCount: String(presentCount),
        totalPossible: String(totalPossible),
        severityLevel: severityResult.level,
        severityPercentage: String(severityResult.percentage.toFixed(1)),
      },
    });
  };

  if (selectedCategory) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <TouchableOpacity style={styles.backBtn} onPress={() => { setSelectedCategory(null); setActiveSymptoms({}); setGrades({}); }} activeOpacity={0.7}>
              <MaterialIcons name="arrow-back" size={20} color="#6B7280" />
              <Text style={styles.backText}>Back to Categories</Text>
            </TouchableOpacity>

            <Text style={styles.breadcrumb}>EXTERNAL CONTACT › SYMPTOMS</Text>
            <Text style={styles.title}>{selectedCategory.label}</Text>
            <Text style={styles.subtitleSanskrit}>{selectedCategory.labelSanskrit}</Text>
            <Text style={styles.subtitle}>{selectedCategory.description}</Text>

            {presentCount > 0 && (
              <View style={[styles.severityPreview, { backgroundColor: severityResult.bgColor }]}>
                <Text style={[styles.severityLevel, { color: severityResult.color }]}>
                  {severityResult.level}
                </Text>
                <Text style={[styles.severityPct, { color: severityResult.color }]}>
                  {severityResult.percentage.toFixed(1)}% — {presentCount}/{totalPossible}
                </Text>
              </View>
            )}

            <Text style={styles.sectionLabel}>ASSOCIATED SYMPTOMS</Text>

            {selectedCategory.symptoms.map((symptom: Symptom) => {
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
                      trackColor={{ false: "#E5E7EB", true: "#93C5FD" }}
                      thumbColor={isActive ? "#2563EB" : "#F3F4F6"}
                    />
                  </View>
                  {isActive && (
                    <View style={styles.gradeContainer}>
                      <Text style={styles.gradeLabel}>SEVERITY (1–10)</Text>
                      <View style={styles.gradeRow}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                          <TouchableOpacity
                            key={n}
                            style={[
                              styles.gradeBtn,
                              grade === n && { backgroundColor: "#2563EB", borderColor: "#2563EB" },
                            ]}
                            onPress={() => setGrade(symptom.id, n)}
                          >
                            <Text style={[styles.gradeBtnText, grade === n && { color: "#fff" }]}>{n}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.continueBtn, presentCount === 0 && styles.continueBtnDisabled]}
              onPress={handleContinue}
              disabled={presentCount === 0}
              activeOpacity={0.8}
            >
              <MaterialIcons name="assignment" size={20} color="#fff" />
              <Text style={styles.continueText}>Generate Summary</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.breadcrumb}>ASSESS › EXTERNAL CONTACT</Text>
        <Text style={styles.title}>External <Text style={{ color: "#6B7280" }}>Exposure</Text></Text>
        <Text style={styles.subtitle}>
          Select the type of external toxic contact for assessment.
        </Text>

        {externalCategories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={styles.categoryCard}
            onPress={() => setSelectedCategory(cat)}
            activeOpacity={0.7}
          >
            <View style={styles.categoryIconBox}>
              <MaterialIcons name="pan-tool-alt" size={22} color="#2563EB" />
            </View>
            <View style={styles.categoryContent}>
              <Text style={styles.categoryTitle}>{cat.label}</Text>
              <Text style={styles.categorySanskrit}>{cat.labelSanskrit}</Text>
              <Text style={styles.categoryDesc}>{cat.description}</Text>
            </View>
            <View style={styles.symptomCount}>
              <Text style={styles.symptomCountText}>{cat.symptoms.length}</Text>
              <Text style={styles.symptomCountLabel}>symptoms</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="#D1D5DB" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F8F1" },
  scrollContent: { padding: 20, paddingBottom: 40 },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 },
  backText: { fontSize: 14, color: "#6B7280", fontWeight: "600" },
  breadcrumb: { fontSize: 11, fontWeight: "700", color: "#9CA3AF", letterSpacing: 0.5, marginTop: 8 },
  title: { fontSize: 26, fontWeight: "800", marginTop: 10, color: "#1F2937" },
  subtitleSanskrit: { fontSize: 13, fontStyle: "italic", color: "#2563EB", marginTop: 4 },
  subtitle: { color: "#6B7280", marginTop: 6, marginBottom: 20, fontSize: 13, lineHeight: 19 },
  sectionLabel: { fontSize: 11, fontWeight: "800", color: "#94A3B8", letterSpacing: 0.5, marginBottom: 12 },
  severityPreview: {
    padding: 14, borderRadius: 12, marginBottom: 16,
  },
  severityLevel: { fontSize: 16, fontWeight: "800" },
  severityPct: { fontSize: 12, fontWeight: "600", marginTop: 2 },
  categoryCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    gap: 12,
  },
  categoryIconBox: {
    width: 44, height: 44,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryContent: { flex: 1 },
  categoryTitle: { fontWeight: "700", fontSize: 14, color: "#1F2937" },
  categorySanskrit: { fontSize: 11, fontStyle: "italic", color: "#2563EB", marginTop: 1 },
  categoryDesc: { fontSize: 11, color: "#9CA3AF", marginTop: 2, lineHeight: 15 },
  symptomCount: { alignItems: "center" },
  symptomCountText: { fontSize: 16, fontWeight: "800", color: "#2563EB" },
  symptomCountLabel: { fontSize: 9, color: "#9CA3AF", fontWeight: "600" },
  card: {
    backgroundColor: "#fff", padding: 14, borderRadius: 14, marginBottom: 10,
    borderWidth: 1, borderColor: "transparent",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  cardActive: { borderColor: "#93C5FD", backgroundColor: "#F8FBFF" },
  row: { flexDirection: "row", alignItems: "center" },
  symptomTitle: { fontWeight: "700", fontSize: 14, color: "#1F2937", marginBottom: 2 },
  symptomSanskrit: { fontSize: 11, color: "#9CA3AF", fontStyle: "italic" },
  gradeContainer: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderColor: "#F1F5F9" },
  gradeLabel: { fontSize: 10, fontWeight: "800", color: "#94A3B8", marginBottom: 8, letterSpacing: 0.5 },
  gradeRow: { flexDirection: "row", gap: 5 },
  gradeBtn: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: "#F1F5F9", alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "#E2E8F0",
  },
  gradeBtnText: { fontSize: 11, fontWeight: "700", color: "#64748B" },
  footer: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    padding: 20, backgroundColor: "#F7F8F1",
    borderTopWidth: 1, borderTopColor: "#E5E7EB",
  },
  continueBtn: {
    backgroundColor: "#2563EB", padding: 18, borderRadius: 16,
    flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8,
    shadowColor: "#2563EB", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  continueBtnDisabled: { backgroundColor: "#94A3B8", shadowOpacity: 0, elevation: 0 },
  continueText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});