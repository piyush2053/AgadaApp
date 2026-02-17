import { MaterialIcons } from "@expo/vector-icons";
import * as Print from "expo-print";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { clearDraft, loadDraft, PatientIdentity, saveCase } from "./utils/StorageService";

export default function Summary() {
  const { type, symptoms, presentCount, totalPossible, severityLevel, severityPercentage } =
    useLocalSearchParams();
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [identity, setIdentity] = useState<PatientIdentity | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadDraft().then((draft) => {
      if (draft?.identity) setIdentity(draft.identity as PatientIdentity);
    });
  }, []);

  const parsedSymptoms = symptoms ? JSON.parse(symptoms as string) : [];
  const pCount = parseInt((presentCount as string) || "0", 10);
  const tPossible = parseInt((totalPossible as string) || "0", 10);
  const pct = parseFloat((severityPercentage as string) || "0");
  const level = (severityLevel as string) || "Mild";

  const getSeverityColors = (l: string): { color: string; bgColor: string } => {
    switch (l) {
      case "Severe Complicated": return { color: "#DC2626", bgColor: "#FEE2E2" };
      case "Alarming": return { color: "#EA580C", bgColor: "#FFEDD5" };
      case "Moderate": return { color: "#D97706", bgColor: "#FEF3C7" };
      default: return { color: "#059669", bgColor: "#D1FAE5" };
    }
  };

  const { color, bgColor } = getSeverityColors(level);

  const getTypeLabel = (t: string): string => {
    const map: Record<string, string> = {
      cobra: "Snake Bite — Cobra (Darvikara)",
      viper: "Snake Bite — Viper (Mandali)",
      krait: "Snake Bite — Krait (Rajimanta)",
      scorpion: "Scorpion Sting (Vruschika)",
      insect: "Insect Bite (Keeta)",
      spider: "Spider Bite (Luta)",
      dog: "Dog Bite (Shwana)",
      rat: "Rat Bite (Mushika)",
      animal: "Animal Bite (Pashu Dansha)",
      gara_visha: "Gara Visha Assessment",
      dushi_visha: "Dushi Visha Assessment",
      virruddha_aahara: "Virruddha Aahara Scoring",
    };
    if (t.startsWith("external_")) return "External Contact — " + t.replace("external_", "");
    return map[t] || t;
  };

  const handleSave = async () => {
    await saveCase({
      identity,
      exposureType: type as string,
      biteType: type as string,
      snakeSubType: null,
      symptoms: parsedSymptoms,
      severityPercentage: pct,
      severityLevel: level,
      notes,
    });
    await clearDraft();
    setSaved(true);
    Alert.alert("Saved", "Case has been saved offline successfully.");
  };

  const generatePDF = async () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 30px; color: #1F2937; line-height: 1.6; }
            .header { text-align: center; border-bottom: 3px solid #C45E3D; padding-bottom: 20px; margin-bottom: 28px; }
            .header h1 { color: #C45E3D; margin: 0 0 8px 0; font-size: 26px; }
            .header p { color: #6B7280; margin: 4px 0; font-size: 13px; }
            .section { margin-bottom: 22px; padding: 18px; background: #F9FAFB; border-radius: 10px; border-left: 4px solid #C45E3D; }
            .section h3 { color: #1F2937; margin: 0 0 12px 0; font-size: 16px; }
            .section p { margin: 6px 0; color: #374151; font-size: 13px; }
            .severity-box { padding: 16px; border-radius: 10px; margin-bottom: 22px; background: ${bgColor}; border: 2px solid ${color}; text-align: center; }
            .severity-level { font-size: 24px; font-weight: bold; color: ${color}; }
            .severity-pct { font-size: 14px; color: ${color}; margin-top: 4px; }
            .symptom-row { display: flex; justify-content: space-between; padding: 8px 12px; background: white; margin-bottom: 6px; border-radius: 8px; border-left: 3px solid #C45E3D; }
            .footer { margin-top: 30px; padding-top: 16px; border-top: 2px solid #E5E7EB; text-align: center; color: #9CA3AF; font-size: 11px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🏥 AGADA SANJEEVINI</h1>
            <p>Agada Tantra Parikshika — Ayurvedic Toxicology Clinical Report</p>
            <p>Generated: ${new Date().toLocaleString("en-IN")}</p>
          </div>

          ${identity ? `
          <div class="section">
            <h3>👤 Patient Identity</h3>
            <p><strong>Name:</strong> ${identity.name || "—"}</p>
            <p><strong>Age / Gender:</strong> ${identity.age || "—"} yrs / ${identity.gender || "—"}</p>
            <p><strong>Marital Status:</strong> ${identity.maritalStatus || "—"}</p>
            <p><strong>Occupation:</strong> ${identity.occupation || "—"}</p>
            <p><strong>Address:</strong> ${identity.address || "—"}</p>
            <p><strong>Date of Admission:</strong> ${identity.dateOfAdmission || "—"}</p>
            <p><strong>Admission Type:</strong> ${identity.admissionType || "—"}${identity.opdNumber ? ` | OPD: ${identity.opdNumber}` : ""}${identity.ipdNumber ? ` | IPD: ${identity.ipdNumber}` : ""}</p>
            <p><strong>Socioeconomic Status:</strong> ${identity.socioStatus || "—"}</p>
            <p><strong>Known Allergies:</strong> ${identity.allergies || "None recorded"}</p>
            <p><strong>Previous Bite (last 10 years):</strong> ${identity.previousBite ? "Yes" : "No"}</p>
          </div>
          ` : ""}

          <div class="section">
            <h3>☣️ Exposure & Visha Classification</h3>
            <p><strong>Type:</strong> ${getTypeLabel(type as string)}</p>
            <p><strong>Assessment Date:</strong> ${new Date().toLocaleDateString("en-IN")}</p>
          </div>

          <div class="severity-box">
            <div class="severity-level">${level}</div>
            <div class="severity-pct">${pct.toFixed(1)}% Toxicity Index — ${pCount} of ${tPossible} symptoms present</div>
          </div>

          <div class="section">
            <h3>🔍 Observed Symptoms (${parsedSymptoms.length})</h3>
            ${parsedSymptoms.map((s: any) =>
              `<div class="symptom-row"><span>${s.symptom}</span><span>Grade ${s.grade}/10</span></div>`
            ).join("")}
          </div>

          ${identity?.mainComplaint ? `
          <div class="section">
            <h3>📋 Chief Complaint</h3>
            <p>${identity.mainComplaint}</p>
          </div>
          ` : ""}

          ${identity?.nidana ? `
          <div class="section">
            <h3>📜 Nidana (Causative Factor)</h3>
            <p>${identity.nidana}</p>
          </div>
          ` : ""}

          ${notes ? `
          <div class="section">
            <h3>📝 Clinical Notes & Impression</h3>
            <p>${notes}</p>
          </div>
          ` : ""}

          <div class="footer">
            <p>Agada Tantra Parikshika • Ayurvedic Toxicology Clinical Tool</p>
            <p>This report is for clinical reference. Consult qualified medical professional for treatment.</p>
          </div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: "Agada Sanjeevini Clinical Report",
          UTI: "com.adobe.pdf",
        });
      } else {
        Alert.alert("Success", "PDF generated successfully!");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to generate PDF. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={100}
      >
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.headerSection}>
              <MaterialIcons name="check-circle" size={48} color="#10B981" />
              <Text style={styles.title}>Clinical Summary</Text>
              <Text style={styles.headerSubtitle}>Agada Sanjeevini Assessment Report</Text>
            </View>

            {/* ── Severity Classification ─────── */}
            <View style={[styles.severityCard, { backgroundColor: bgColor, borderColor: color }]}>
              <Text style={[styles.severityLabel, { color }]}>VISHA SEVERITY CLASSIFICATION</Text>
              <Text style={[styles.severityLevel, { color }]}>{level}</Text>
              <View style={styles.severityMetrics}>
                <View style={styles.metricItem}>
                  <Text style={[styles.metricValue, { color }]}>{pct.toFixed(1)}%</Text>
                  <Text style={[styles.metricLabel, { color }]}>TOXICITY INDEX</Text>
                </View>
                <View style={[styles.metricDivider, { backgroundColor: color + "40" }]} />
                <View style={styles.metricItem}>
                  <Text style={[styles.metricValue, { color }]}>{pCount}/{tPossible}</Text>
                  <Text style={[styles.metricLabel, { color }]}>SYMPTOMS PRESENT</Text>
                </View>
              </View>
              <Text style={[styles.severityDesc, { color }]}>
                {level === "Severe Complicated" && "🚨 Critical — Immediate emergency intervention required"}
                {level === "Alarming" && "⚠️ High — Urgent hospital admission needed"}
                {level === "Moderate" && "⚡ Moderate — Hospital observation and treatment required"}
                {level === "Mild" && "✅ Mild — Outpatient care with 24hr follow-up"}
              </Text>
            </View>

            {/* ── Patient Identity ─────────────── */}
            {identity && (
              <View style={styles.card}>
                <Text style={styles.cardLabel}>PATIENT IDENTITY</Text>
                <Text style={styles.patientName}>{identity.name || "Patient Name Not Recorded"}</Text>
                <View style={styles.identityGrid}>
                  <View style={styles.identityItem}>
                    <Text style={styles.identityItemLabel}>Age</Text>
                    <Text style={styles.identityItemValue}>{identity.age || "—"} yrs</Text>
                  </View>
                  <View style={styles.identityItem}>
                    <Text style={styles.identityItemLabel}>Gender</Text>
                    <Text style={styles.identityItemValue}>{identity.gender || "—"}</Text>
                  </View>
                  <View style={styles.identityItem}>
                    <Text style={styles.identityItemLabel}>Admission</Text>
                    <Text style={styles.identityItemValue}>{identity.admissionType || "—"}</Text>
                  </View>
                  <View style={styles.identityItem}>
                    <Text style={styles.identityItemLabel}>Date</Text>
                    <Text style={styles.identityItemValue}>{identity.dateOfAdmission || "—"}</Text>
                  </View>
                </View>
                {identity.allergies ? (
                  <View style={styles.allergyBadge}>
                    <MaterialIcons name="warning" size={13} color="#D97706" />
                    <Text style={styles.allergyText}>Allergies: {identity.allergies}</Text>
                  </View>
                ) : null}
                {identity.previousBite && (
                  <View style={styles.prevBiteBadge}>
                    <MaterialIcons name="history" size={13} color="#7C3AED" />
                    <Text style={styles.prevBiteText}>Previous bite/exposure in last 10 years</Text>
                  </View>
                )}
              </View>
            )}

            {/* ── Exposure Classification ───────── */}
            <View style={styles.card}>
              <Text style={styles.cardLabel}>EXPOSURE CLASSIFICATION</Text>
              <Text style={styles.exposureType}>{getTypeLabel(type as string)}</Text>
              <Text style={styles.timestamp}>
                {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
                {" at "}
                {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
              </Text>
            </View>

            {/* ── Observed Symptoms ─────────────── */}
            {parsedSymptoms.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.cardLabel}>OBSERVED SYMPTOMS ({parsedSymptoms.length})</Text>
                {parsedSymptoms.map((s: any, i: number) => (
                  <View key={i} style={styles.symptomRow}>
                    <View style={styles.symptomDot} />
                    <Text style={styles.symptomText}>{s.symptom}</Text>
                    <View style={styles.gradePill}>
                      <Text style={styles.gradeText}>Grade {s.grade}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* ── Chief Complaint ───────────────── */}
            {identity?.mainComplaint ? (
              <View style={styles.card}>
                <Text style={styles.cardLabel}>CHIEF COMPLAINT</Text>
                <Text style={styles.complaintText}>{identity.mainComplaint}</Text>
              </View>
            ) : null}

            {/* ── Nidana ────────────────────────── */}
            {identity?.nidana ? (
              <View style={styles.card}>
                <Text style={styles.cardLabel}>NIDANA (CAUSATIVE FACTOR)</Text>
                <Text style={styles.nidanaText}>{identity.nidana}</Text>
              </View>
            ) : null}

            {/* ── Clinical Notes ────────────────── */}
            <View style={styles.notesSection}>
              <Text style={styles.sectionTitle}>Clinical Impression & Agada Protocol Notes</Text>
              <TextInput
                multiline
                placeholder="Record clinical observations, visha vega assessment, planned Agada Tantra protocol, antidote administration..."
                placeholderTextColor="#9CA3AF"
                style={styles.notesInput}
                value={notes}
                onChangeText={setNotes}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          {/* Bottom Buttons */}
          <View style={styles.footer}>
            <View style={styles.footerRow}>
              <TouchableOpacity
                style={[styles.saveBtn, saved && styles.saveBtnDone]}
                onPress={handleSave}
                activeOpacity={0.7}
              >
                <MaterialIcons name={saved ? "check" : "save"} size={18} color={saved ? "#fff" : "#C45E3D"} />
                <Text style={[styles.saveBtnText, saved && { color: "#fff" }]}>
                  {saved ? "Saved" : "Save Case"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.newCaseBtn}
                onPress={() => router.replace("/home")}
                activeOpacity={0.7}
              >
                <MaterialIcons name="add" size={18} color="#2563EB" />
                <Text style={styles.newCaseBtnText}>New Case</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.pdfBtn} onPress={generatePDF} activeOpacity={0.8}>
              <MaterialIcons name="picture-as-pdf" size={18} color="#fff" />
              <Text style={styles.pdfText}>Export Full Clinical Report PDF</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F4E6" },
  scrollContent: { padding: 20, paddingBottom: 160 },
  headerSection: { alignItems: "center", marginBottom: 20 },
  title: { fontSize: 26, fontWeight: "800", marginTop: 12, color: "#1F2937" },
  headerSubtitle: { fontSize: 13, color: "#6B7280", marginTop: 4 },
  severityCard: {
    borderRadius: 18, padding: 20, marginBottom: 16,
    borderWidth: 2, alignItems: "center",
  },
  severityLabel: { fontSize: 10, fontWeight: "800", letterSpacing: 0.5, marginBottom: 8 },
  severityLevel: { fontSize: 28, fontWeight: "900", marginBottom: 14 },
  severityMetrics: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  metricItem: { alignItems: "center", paddingHorizontal: 20 },
  metricValue: { fontSize: 22, fontWeight: "800" },
  metricLabel: { fontSize: 9, fontWeight: "800", letterSpacing: 0.5, marginTop: 2 },
  metricDivider: { width: 1, height: 36 },
  severityDesc: { fontSize: 13, fontWeight: "600", textAlign: "center" },
  card: {
    backgroundColor: "#fff", borderRadius: 18, padding: 20, marginBottom: 14,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  cardLabel: { fontSize: 10, fontWeight: "800", color: "#9CA3AF", marginBottom: 8, letterSpacing: 0.5 },
  patientName: { fontSize: 20, fontWeight: "800", color: "#1F2937", marginBottom: 14 },
  identityGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 12 },
  identityItem: {
    backgroundColor: "#F9FAFB", borderRadius: 10, padding: 10, minWidth: "45%",
  },
  identityItemLabel: { fontSize: 10, fontWeight: "700", color: "#9CA3AF" },
  identityItemValue: { fontSize: 14, fontWeight: "700", color: "#1F2937", marginTop: 2 },
  allergyBadge: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "#FEF3C7", padding: 8, borderRadius: 10, marginTop: 4,
  },
  allergyText: { fontSize: 12, color: "#D97706", fontWeight: "600" },
  prevBiteBadge: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "#EDE9FE", padding: 8, borderRadius: 10, marginTop: 6,
  },
  prevBiteText: { fontSize: 12, color: "#7C3AED", fontWeight: "600" },
  exposureType: { fontSize: 16, fontWeight: "700", color: "#1F2937", marginBottom: 4 },
  timestamp: { fontSize: 12, color: "#6B7280" },
  symptomRow: {
    flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8,
    borderBottomWidth: 1, borderBottomColor: "#F1F5F9",
  },
  symptomDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#C45E3D" },
  symptomText: { flex: 1, fontSize: 13, color: "#374151", fontWeight: "500" },
  gradePill: {
    backgroundColor: "#F3F4F6", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
  },
  gradeText: { fontSize: 11, fontWeight: "700", color: "#6B7280" },
  complaintText: { fontSize: 14, color: "#374151", lineHeight: 20 },
  nidanaText: { fontSize: 13, color: "#6B7280", lineHeight: 20, fontStyle: "italic" },
  notesSection: { marginTop: 8 },
  sectionTitle: { fontSize: 14, fontWeight: "700", marginBottom: 10, color: "#1F2937" },
  notesInput: {
    backgroundColor: "#fff", borderRadius: 14, padding: 16, height: 120,
    fontSize: 13, borderWidth: 1, borderColor: "#E5E7EB",
  },
  footer: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    padding: 20, backgroundColor: "#F2F4E6",
    borderTopWidth: 1, borderTopColor: "#E5E7EB",
  },
  footerRow: { flexDirection: "row", gap: 10, marginBottom: 10 },
  saveBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, padding: 14, borderRadius: 12, borderWidth: 2, borderColor: "#C45E3D", backgroundColor: "#fff",
  },
  saveBtnDone: { backgroundColor: "#10B981", borderColor: "#10B981" },
  saveBtnText: { fontWeight: "700", color: "#C45E3D", fontSize: 14 },
  newCaseBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, padding: 14, borderRadius: 12, borderWidth: 2, borderColor: "#2563EB", backgroundColor: "#fff",
  },
  newCaseBtnText: { fontWeight: "700", color: "#2563EB", fontSize: 14 },
  pdfBtn: {
    backgroundColor: "#1F2937", padding: 16, borderRadius: 14,
    flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 6,
  },
  pdfText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});