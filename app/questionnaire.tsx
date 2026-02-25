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
  dushiVishaQuestionnaire,
  FrequencyOption,
  frequencyOptions,
  frequencyScore,
  garaVishaQuestionnaire,
  virruddhaAaharaItems,
} from "./utils/MedicalData";
import {
  calculateDushiVishaSeverity,
  calculateGaraVishaSeverity,
  calculateVirruddhaAaharaSeverity,
} from "./utils/SeverityEngine";

type Mode = "select" | "gara" | "dushi" | "viruddha";

const frequencyColors: Record<FrequencyOption, string> = {
  Never:        "#9CA3AF",
  Rarely:       "#10B981",
  Occasionally: "#F59E0B",
  Frequently:   "#EF4444",
  Daily:        "#7C3AED",
};

export default function Questionnaire() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("select");

  // Gara / Dushi yes-no answers
  const [garaAnswers, setGaraAnswers]   = useState<Record<string, boolean | null>>({});
  const [dushiAnswers, setDushiAnswers] = useState<Record<string, boolean | null>>({});

  // Viruddha Ahara frequency scores
  const [viruddhaScores, setViruddhaScores] = useState<Record<string, FrequencyOption | null>>({});

  // ── Computed ───────────────────────────────────────────────────────────────
  const garaYesCount       = Object.values(garaAnswers).filter((v) => v === true).length;
  const dushiYesCount      = Object.values(dushiAnswers).filter((v) => v === true).length;
  const garaAnsweredCount  = Object.values(garaAnswers).filter((v) => v !== null && v !== undefined).length;
  const dushiAnsweredCount = Object.values(dushiAnswers).filter((v) => v !== null && v !== undefined).length;

  const garaSeverity  = calculateGaraVishaSeverity(garaYesCount);
  const dushiSeverity = calculateDushiVishaSeverity(dushiYesCount);

  const viruddhaFreqScore = Object.values(viruddhaScores).reduce(
    (sum, freq) => (freq ? sum + frequencyScore[freq] : sum), 0
  );
  const viruddhaAnsweredCount = Object.values(viruddhaScores).filter(
    (v) => v !== null && v !== undefined
  ).length;
  const viruddhaSeverity = calculateVirruddhaAaharaSeverity(viruddhaFreqScore);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleGaraDushiContinue = () => {
    const type      = mode === "gara" ? "gara_visha" : "dushi_visha";
    const answers   = mode === "gara" ? garaAnswers : dushiAnswers;
    const yesCount  = mode === "gara" ? garaYesCount : dushiYesCount;
    const severity  = mode === "gara" ? garaSeverity : dushiSeverity;
    const questions = mode === "gara" ? garaVishaQuestionnaire : dushiVishaQuestionnaire;

    const selectedSymptoms = questions
      .filter((q) => answers[q.id] === true)
      .map((q) => ({ symptom: q.question.slice(0, 50) + "...", grade: 5 }));

    router.push({
      pathname: "/summary",
      params: {
        type,
        symptoms: JSON.stringify(selectedSymptoms),
        presentCount: String(yesCount),
        totalPossible: "10",
        severityLevel: severity.level,
        severityPercentage: String(severity.percentage.toFixed(1)),
      },
    });
  };

  const handleViruddhaContinue = () => {
    const positiveItems = virruddhaAaharaItems
      .filter((item) => viruddhaScores[item.id] && viruddhaScores[item.id] !== "Never")
      .map((item) => ({
        symptom: `${item.food} — ${viruddhaScores[item.id]}`,
        grade: frequencyScore[viruddhaScores[item.id] as FrequencyOption] * 2,
      }));

    router.push({
      pathname: "/summary",
      params: {
        type: "virruddha_aahara",
        symptoms: JSON.stringify(positiveItems),
        presentCount: String(viruddhaFreqScore),
        totalPossible: "40",
        severityLevel: viruddhaSeverity.level,
        severityPercentage: String(viruddhaSeverity.percentage.toFixed(1)),
      },
    });
  };

  // ══════════════════════════════════════════════════════
  // SCREEN: Selection
  // ══════════════════════════════════════════════════════
  if (mode === "select") {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.breadcrumb}>ASSESS › QUESTIONNAIRE</Text>
          <Text style={styles.title}>
            Visha{" "}
            <Text style={{ color: "#6B7280" }}>Questionnaires</Text>
          </Text>
          <Text style={styles.subtitle}>
            Select the appropriate questionnaire for toxicity evaluation.
          </Text>

          {/* Gara Visha */}
          <TouchableOpacity
            style={[styles.typeCard, { borderColor: "#2E7D32" }]}
            onPress={() => setMode("gara")}
            activeOpacity={0.7}
          >
            <View style={[styles.typeIcon, { backgroundColor: "#DDF3E4" }]}>
              <MaterialIcons name="restaurant" size={26} color="#2E7D32" />
            </View>
            <View style={styles.typeContent}>
              <Text style={styles.typeTitle}>Gara Visha</Text>
              <Text style={styles.typeSub}>Artificial / Administered Poison</Text>
              <Text style={styles.typeDesc}>
                10 diagnostic questions for food or water-based deliberate or accidental poisoning.
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="#D1D5DB" />
          </TouchableOpacity>

          {/* Dushi Visha */}
          <TouchableOpacity
            style={[styles.typeCard, { borderColor: "#7C3AED" }]}
            onPress={() => setMode("dushi")}
            activeOpacity={0.7}
          >
            <View style={[styles.typeIcon, { backgroundColor: "#EDE9FE" }]}>
              <MaterialIcons name="history" size={26} color="#7C3AED" />
            </View>
            <View style={styles.typeContent}>
              <Text style={styles.typeTitle}>Dushi Visha</Text>
              <Text style={styles.typeSub}>Residual / Chronic Toxin</Text>
              <Text style={styles.typeDesc}>
                10 diagnostic questions for latent or residual poison accumulated over time.
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="#D1D5DB" />
          </TouchableOpacity>

          {/* Viruddha Ahara — 3rd card */}
          <TouchableOpacity
            style={[styles.typeCard, { borderColor: "#C45E3D" }]}
            onPress={() => setMode("viruddha")}
            activeOpacity={0.7}
          >
            <View style={[styles.typeIcon, { backgroundColor: "#FFF4EE" }]}>
              <MaterialIcons name="no-meals" size={26} color="#C45E3D" />
            </View>
            <View style={styles.typeContent}>
              <Text style={styles.typeTitle}>Viruddha Ahara</Text>
              <Text style={styles.typeSub}>Incompatible Food Combinations</Text>
              <Text style={styles.typeDesc}>
                Rate frequency of 10 known incompatible food pairings that accumulate toxicity over time.
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="#D1D5DB" />
          </TouchableOpacity>

          {/* Format hint */}
          <View style={styles.hintBox}>
            <MaterialIcons name="info-outline" size={15} color="#9CA3AF" />
            <Text style={styles.hintText}>
              Gara & Dushi use Yes / No answers. Viruddha Ahara uses a frequency scale (Never → Daily).
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ══════════════════════════════════════════════════════
  // SCREEN: Viruddha Ahara frequency questionnaire
  // ══════════════════════════════════════════════════════
  if (mode === "viruddha") {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => setMode("select")}
              activeOpacity={0.7}
            >
              <MaterialIcons name="arrow-back" size={20} color="#6B7280" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <Text style={styles.breadcrumb}>QUESTIONNAIRE › VIRUDDHA AAHARA</Text>
            <Text style={styles.title}>
              Incompatible{" "}
              <Text style={{ color: "#6B7280" }}>Food Combinations</Text>
            </Text>
            <Text style={styles.subtitle}>
              Rate how frequently the patient consumes each incompatible food combination.
            </Text>

            {/* Score preview */}
            {viruddhaAnsweredCount > 0 && (
              <View style={[styles.severityPreview, { backgroundColor: viruddhaSeverity.bgColor }]}>
                <View>
                  <Text style={[styles.severityLevel, { color: viruddhaSeverity.color }]}>
                    {viruddhaSeverity.level}
                  </Text>
                  <Text style={[styles.severityPct, { color: viruddhaSeverity.color }]}>
                    Score: {viruddhaFreqScore}/40 — {viruddhaAnsweredCount}/10 answered
                  </Text>
                </View>
                <View style={[styles.severityBadge, { backgroundColor: viruddhaSeverity.color }]}>
                  <Text style={styles.severityBadgeText}>
                    {viruddhaSeverity.percentage.toFixed(0)}%
                  </Text>
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
              const sel = viruddhaScores[item.id];
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
                            setViruddhaScores((prev) => ({ ...prev, [item.id]: opt }))
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
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.continueBtn,
                { backgroundColor: "#C45E3D", shadowColor: "#C45E3D" },
                viruddhaAnsweredCount === 0 && styles.continueBtnDisabled,
              ]}
              onPress={handleViruddhaContinue}
              disabled={viruddhaAnsweredCount === 0}
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

  // ══════════════════════════════════════════════════════
  // SCREEN: Gara / Dushi Yes-No questionnaire
  // ══════════════════════════════════════════════════════
  const isGara        = mode === "gara";
  const questions     = isGara ? garaVishaQuestionnaire : dushiVishaQuestionnaire;
  const answers       = isGara ? garaAnswers : dushiAnswers;
  const setAnswers    = isGara ? setGaraAnswers : setDushiAnswers;
  const yesCount      = isGara ? garaYesCount : dushiYesCount;
  const answeredCount = isGara ? garaAnsweredCount : dushiAnsweredCount;
  const severity      = isGara ? garaSeverity : dushiSeverity;
  const accentColor   = isGara ? "#2E7D32" : "#7C3AED";
  const accentBg      = isGara ? "#DDF3E4" : "#EDE9FE";

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => setMode("select")}
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back" size={20} color="#6B7280" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <Text style={styles.breadcrumb}>
            {isGara ? "GARA VISHA" : "DUSHI VISHA"} QUESTIONNAIRE
          </Text>
          <Text style={styles.title}>{isGara ? "Gara Visha" : "Dushi Visha"}</Text>
          <Text style={styles.subtitle}>
            Answer Yes or No for each question based on the patient's history.
          </Text>

          {/* Progress bar */}
          <View style={styles.progressRow}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(answeredCount / 10) * 100}%`, backgroundColor: accentColor },
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: accentColor }]}>
              {answeredCount}/10 answered
            </Text>
          </View>

          {/* Live severity preview */}
          {answeredCount > 0 && (
            <View style={[styles.severityPreview, { backgroundColor: severity.bgColor }]}>
              <Text style={[styles.severityLevel, { color: severity.color }]}>
                {severity.level}
              </Text>
              <Text style={[styles.severityPct, { color: severity.color }]}>
                {yesCount}/10 positive • {severity.percentage.toFixed(1)}%
              </Text>
            </View>
          )}

          {questions.map((q, index) => {
            const answer = answers[q.id];
            return (
              <View key={q.id} style={styles.questionCard}>
                <View style={styles.questionHeader}>
                  <View style={[styles.questionNum, { backgroundColor: accentBg }]}>
                    <Text style={[styles.questionNumText, { color: accentColor }]}>
                      {index + 1}
                    </Text>
                  </View>
                  <Text style={styles.questionText}>{q.question}</Text>
                </View>

                <View style={styles.answerRow}>
                  <TouchableOpacity
                    style={[
                      styles.answerBtn,
                      answer === true && { backgroundColor: "#10B981", borderColor: "#10B981" },
                    ]}
                    onPress={() => setAnswers((prev) => ({ ...prev, [q.id]: true }))}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons
                      name="check"
                      size={16}
                      color={answer === true ? "#fff" : "#6B7280"}
                    />
                    <Text style={[styles.answerText, answer === true && { color: "#fff" }]}>
                      Yes
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.answerBtn,
                      answer === false && { backgroundColor: "#EF4444", borderColor: "#EF4444" },
                    ]}
                    onPress={() => setAnswers((prev) => ({ ...prev, [q.id]: false }))}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons
                      name="close"
                      size={16}
                      color={answer === false ? "#fff" : "#6B7280"}
                    />
                    <Text style={[styles.answerText, answer === false && { color: "#fff" }]}>
                      No
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.continueBtn,
              { backgroundColor: accentColor, shadowColor: accentColor },
              answeredCount === 0 && styles.continueBtnDisabled,
            ]}
            onPress={handleGaraDushiContinue}
            disabled={answeredCount === 0}
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

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  scrollContent: { padding: 20, paddingBottom: 100 },

  backBtn: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 },
  backText: { fontSize: 14, color: "#6B7280", fontWeight: "600" },
  breadcrumb: { fontSize: 11, fontWeight: "700", color: "#9CA3AF", letterSpacing: 0.5, marginTop: 8 },
  title: { fontSize: 26, fontWeight: "800", marginTop: 8, color: "#1F2937" },
  subtitle: { color: "#64748B", marginTop: 8, marginBottom: 16, fontSize: 13, lineHeight: 19 },

  // ── Selection cards
  typeCard: {
    backgroundColor: "#fff", borderRadius: 18, padding: 18,
    flexDirection: "row", alignItems: "center",
    borderWidth: 2, marginBottom: 14,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
    gap: 14,
  },
  typeIcon: { width: 52, height: 52, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  typeContent: { flex: 1 },
  typeTitle: { fontSize: 17, fontWeight: "800", color: "#1F2937" },
  typeSub: { fontSize: 12, color: "#6B7280", fontStyle: "italic", marginTop: 2 },
  typeDesc: { fontSize: 12, color: "#9CA3AF", marginTop: 4, lineHeight: 16 },

  // ── Format hint
  hintBox: {
    flexDirection: "row", alignItems: "flex-start", gap: 8,
    backgroundColor: "#F8FAFC", borderRadius: 12, padding: 14, marginTop: 6,
    borderWidth: 1, borderColor: "#E5E7EB",
  },
  hintText: { flex: 1, fontSize: 12, color: "#9CA3AF", lineHeight: 17 },

  // ── Progress
  progressRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  progressBar: { flex: 1, height: 6, backgroundColor: "#E5E7EB", borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3 },
  progressText: { fontSize: 12, fontWeight: "700" },

  // ── Severity preview (shared by all modes)
  severityPreview: {
    padding: 14, borderRadius: 12, marginBottom: 16,
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
  },
  severityLevel: { fontSize: 15, fontWeight: "800" },
  severityPct: { fontSize: 12, fontWeight: "600", marginTop: 2 },
  severityBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  severityBadgeText: { color: "#fff", fontWeight: "800", fontSize: 13 },

  // ── Yes/No question cards
  questionCard: {
    backgroundColor: "#fff", borderRadius: 14, padding: 16, marginBottom: 12,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  questionHeader: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 14 },
  questionNum: {
    width: 28, height: 28, borderRadius: 8,
    justifyContent: "center", alignItems: "center", marginTop: 1,
  },
  questionNumText: { fontSize: 13, fontWeight: "800" },
  questionText: { flex: 1, fontSize: 13, color: "#374151", lineHeight: 19, fontWeight: "500" },
  answerRow: { flexDirection: "row", gap: 12 },
  answerBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, paddingVertical: 10, borderRadius: 12,
    backgroundColor: "#F3F4F6", borderWidth: 1.5, borderColor: "#E5E7EB",
  },
  answerText: { fontSize: 14, fontWeight: "700", color: "#6B7280" },

  // ── Viruddha frequency items
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

  // ── Footer
  footer: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    padding: 20, backgroundColor: "#F8FAFC",
    borderTopWidth: 1, borderTopColor: "#E5E7EB",
  },
  continueBtn: {
    padding: 18, borderRadius: 16,
    flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  continueBtnDisabled: { backgroundColor: "#94A3B8", shadowOpacity: 0, elevation: 0 },
  continueText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
