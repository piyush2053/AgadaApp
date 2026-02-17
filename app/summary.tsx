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
import {
  clearDraft,
  getCaseById,
  loadDraft,
  PatientIdentity,
  saveCase,
} from "./utils/StorageService";

export default function Summary() {
  const {
    type,
    symptoms,
    presentCount,
    totalPossible,
    severityLevel,
    severityPercentage,
    caseId,
    readonly,
  } = useLocalSearchParams();

  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [identity, setIdentity] = useState<PatientIdentity | null>(null);
  const [saved, setSaved] = useState(false);
  const [resolvedType, setResolvedType] = useState((type as string) || "");
  const [resolvedSymptoms, setResolvedSymptoms] = useState<any[]>([]);
  const [resolvedPct, setResolvedPct] = useState(
    parseFloat((severityPercentage as string) || "0")
  );
  const [resolvedLevel, setResolvedLevel] = useState(
    (severityLevel as string) || "Mild"
  );
  const [resolvedPresentCount, setResolvedPresentCount] = useState(
    parseInt((presentCount as string) || "0", 10)
  );

  const isReadonly = readonly === "true";

  useEffect(() => {
    if (caseId) {
      getCaseById(caseId as string).then((c) => {
        if (c) {
          setIdentity(c.identity);
          setNotes(c.notes || "");
          setSaved(true);
          setResolvedType(c.exposureType || "");
          setResolvedSymptoms(c.symptoms || []);
          setResolvedPct(c.severityPercentage || 0);
          setResolvedLevel(c.severityLevel || "Mild");
          setResolvedPresentCount(c.symptoms?.length || 0);
        }
      });
    } else {
      setResolvedSymptoms(symptoms ? JSON.parse(symptoms as string) : []);
      loadDraft().then((draft) => {
        if (draft?.identity) setIdentity(draft.identity as PatientIdentity);
      });
    }
  }, [caseId]);

  const getSeverityColors = (l: string) => {
    switch (l) {
      case "Severe Complicated": return { color: "#DC2626", bgColor: "#FEE2E2" };
      case "Alarming":           return { color: "#EA580C", bgColor: "#FFEDD5" };
      case "Moderate":           return { color: "#D97706", bgColor: "#FEF3C7" };
      default:                   return { color: "#059669", bgColor: "#D1FAE5" };
    }
  };

  const { color, bgColor } = getSeverityColors(resolvedLevel);

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
    if (t?.startsWith("external_")) return "External Contact";
    return map[t] || t;
  };

  const handleSave = async () => {
    await saveCase({
      identity,
      exposureType: resolvedType,
      biteType: resolvedType,
      snakeSubType: null,
      symptoms: resolvedSymptoms,
      severityPercentage: resolvedPct,
      severityLevel: resolvedLevel,
      notes,
    });
    await clearDraft();
    setSaved(true);
    Alert.alert("Saved", "Case saved offline successfully.");
  };

  const generatePDF = async () => {
    const html = `
      <!DOCTYPE html><html><head><meta charset="utf-8">
      <style>
        body{font-family:'Helvetica Neue',Arial,sans-serif;padding:30px;color:#1F2937;line-height:1.6}
        .hdr{text-align:center;border-bottom:3px solid #C45E3D;padding-bottom:20px;margin-bottom:28px}
        .hdr h1{color:#C45E3D;margin:0 0 8px 0;font-size:26px}
        .hdr p{color:#6B7280;margin:4px 0;font-size:13px}
        .sec{margin-bottom:22px;padding:18px;background:#F9FAFB;border-radius:10px;border-left:4px solid #C45E3D}
        .sec h3{color:#1F2937;margin:0 0 12px 0;font-size:16px}
        .sec p{margin:6px 0;color:#374151;font-size:13px}
        .sev{padding:16px;border-radius:10px;margin-bottom:22px;background:${bgColor};border:2px solid ${color};text-align:center}
        .sev-l{font-size:24px;font-weight:bold;color:${color}}
        .sev-p{font-size:14px;color:${color};margin-top:4px}
        .sr{display:flex;justify-content:space-between;padding:8px 12px;background:white;margin-bottom:6px;border-radius:8px;border-left:3px solid #C45E3D;font-size:13px}
        .ft{margin-top:30px;padding-top:16px;border-top:2px solid #E5E7EB;text-align:center;color:#9CA3AF;font-size:11px}
      </style></head><body>
      <div class="hdr"><h1>🏥 AGADA SANJEEVINI</h1>
      <p>Agada Tantra Parikshika — Ayurvedic Toxicology Clinical Report</p>
      <p>Generated: ${new Date().toLocaleString("en-IN")}</p></div>
      ${identity ? `<div class="sec"><h3>👤 Patient Identity</h3>
        <p><strong>Name:</strong> ${identity.name || "—"}</p>
        <p><strong>Age/Gender:</strong> ${identity.age || "—"} yrs / ${identity.gender || "—"}</p>
        <p><strong>Admission:</strong> ${identity.admissionType || "—"} on ${identity.dateOfAdmission || "—"}</p>
        <p><strong>Allergies:</strong> ${identity.allergies || "None"}</p>
        <p><strong>Previous Bite:</strong> ${identity.previousBite ? "Yes" : "No"}</p></div>` : ""}
      <div class="sec"><h3>☣️ Exposure Classification</h3>
        <p><strong>Type:</strong> ${getTypeLabel(resolvedType)}</p></div>
      <div class="sev"><div class="sev-l">${resolvedLevel}</div>
        <div class="sev-p">${resolvedPct.toFixed(1)}% — ${resolvedPresentCount} symptoms</div></div>
      <div class="sec"><h3>🔍 Symptoms (${resolvedSymptoms.length})</h3>
        ${resolvedSymptoms.map((s: any) =>
          `<div class="sr"><span>${s.symptom}</span><span>Grade ${s.grade}/10</span></div>`
        ).join("")}</div>
      ${identity?.mainComplaint ? `<div class="sec"><h3>📋 Chief Complaint</h3><p>${identity.mainComplaint}</p></div>` : ""}
      ${identity?.nidana ? `<div class="sec"><h3>📜 Nidana</h3><p>${identity.nidana}</p></div>` : ""}
      ${notes ? `<div class="sec"><h3>📝 Notes</h3><p>${notes}</p></div>` : ""}
      <div class="ft"><p>Agada Tantra Parikshika • For clinical reference only</p></div>
      </body></html>`;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: "application/pdf", dialogTitle: "Clinical Report", UTI: "com.adobe.pdf" });
      } else {
        Alert.alert("Success", "PDF generated!");
      }
    } catch {
      Alert.alert("Error", "Failed to generate PDF.");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }} keyboardVerticalOffset={100}>
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

            {/* Readonly banner */}
            {isReadonly && (
              <View style={styles.readonlyBanner}>
                <MaterialIcons name="history" size={16} color="#7C3AED" />
                <Text style={styles.readonlyText}>Viewing saved case</Text>
                <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
                  <Text style={styles.readonlyBackText}>← Back to Cases</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Header */}
            <View style={styles.headerSection}>
              <MaterialIcons name="check-circle" size={48} color="#10B981" />
              <Text style={styles.title}>Clinical Summary</Text>
              <Text style={styles.headerSubtitle}>Agada Sanjeevini Assessment Report</Text>
            </View>

            {/* Severity card */}
            <View style={[styles.severityCard, { backgroundColor: bgColor, borderColor: color }]}>
              <Text style={[styles.severityLabel, { color }]}>VISHA SEVERITY CLASSIFICATION</Text>
              <Text style={[styles.severityLevelText, { color }]}>{resolvedLevel}</Text>
              <View style={styles.severityMetrics}>
                <View style={styles.metricItem}>
                  <Text style={[styles.metricValue, { color }]}>{resolvedPct.toFixed(1)}%</Text>
                  <Text style={[styles.metricLabel, { color }]}>TOXICITY INDEX</Text>
                </View>
                <View style={[styles.metricDivider, { backgroundColor: color + "40" }]} />
                <View style={styles.metricItem}>
                  <Text style={[styles.metricValue, { color }]}>{resolvedPresentCount}</Text>
                  <Text style={[styles.metricLabel, { color }]}>SYMPTOMS PRESENT</Text>
                </View>
              </View>
              <Text style={[styles.severityDesc, { color }]}>
                {resolvedLevel === "Severe Complicated" && "🚨 Critical — Immediate emergency intervention required"}
                {resolvedLevel === "Alarming" && "⚠️ High — Urgent hospital admission needed"}
                {resolvedLevel === "Moderate" && "⚡ Moderate — Hospital observation and treatment required"}
                {resolvedLevel === "Mild" && "✅ Mild — Outpatient care with 24hr follow-up"}
              </Text>
            </View>

            {/* Patient identity */}
            {identity && (
              <View style={styles.card}>
                <Text style={styles.cardLabel}>PATIENT IDENTITY</Text>
                <Text style={styles.patientName}>{identity.name || "Patient Name Not Recorded"}</Text>
                <View style={styles.identityGrid}>
                  {[
                    { label: "Age", value: identity.age ? `${identity.age} yrs` : "—" },
                    { label: "Gender", value: identity.gender || "—" },
                    { label: "Admission", value: identity.admissionType || "—" },
                    { label: "Date", value: identity.dateOfAdmission || "—" },
                  ].map((item) => (
                    <View key={item.label} style={styles.identityItem}>
                      <Text style={styles.identityItemLabel}>{item.label}</Text>
                      <Text style={styles.identityItemValue}>{item.value}</Text>
                    </View>
                  ))}
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

            {/* Exposure */}
            <View style={styles.card}>
              <Text style={styles.cardLabel}>EXPOSURE CLASSIFICATION</Text>
              <Text style={styles.exposureType}>{getTypeLabel(resolvedType)}</Text>
              <Text style={styles.timestamp}>{new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</Text>
            </View>

            {/* Symptoms */}
            {resolvedSymptoms.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.cardLabel}>OBSERVED SYMPTOMS ({resolvedSymptoms.length})</Text>
                {resolvedSymptoms.map((s: any, i: number) => (
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

            {/* Chief complaint */}
            {identity?.mainComplaint ? (
              <View style={styles.card}>
                <Text style={styles.cardLabel}>CHIEF COMPLAINT</Text>
                <Text style={styles.complaintText}>{identity.mainComplaint}</Text>
              </View>
            ) : null}

            {/* Nidana */}
            {identity?.nidana ? (
              <View style={styles.card}>
                <Text style={styles.cardLabel}>NIDANA (CAUSATIVE FACTOR)</Text>
                <Text style={styles.nidanaText}>{identity.nidana}</Text>
              </View>
            ) : null}

            {/* Notes */}
            <View style={styles.notesSection}>
              <Text style={styles.sectionTitle}>Clinical Impression & Agada Protocol Notes</Text>
              <TextInput
                multiline
                editable={!isReadonly}
                placeholder={isReadonly ? "No clinical notes recorded" : "Record clinical observations, visha vega assessment, planned Agada Tantra protocol..."}
                placeholderTextColor="#9CA3AF"
                style={[styles.notesInput, isReadonly && styles.notesInputReadonly]}
                value={notes}
                onChangeText={setNotes}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            {!isReadonly ? (
              <>
                <View style={styles.footerRow}>
                  <TouchableOpacity style={[styles.saveBtn, saved && styles.saveBtnDone]} onPress={handleSave} activeOpacity={0.7}>
                    <MaterialIcons name={saved ? "check" : "save"} size={18} color={saved ? "#fff" : "#C45E3D"} />
                    <Text style={[styles.saveBtnText, saved && { color: "#fff" }]}>{saved ? "Saved" : "Save Case"}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.newCaseBtn} onPress={() => router.replace("/home")} activeOpacity={0.7}>
                    <MaterialIcons name="add" size={18} color="#2563EB" />
                    <Text style={styles.newCaseBtnText}>New Case</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.pdfBtn} onPress={generatePDF} activeOpacity={0.8}>
                  <MaterialIcons name="picture-as-pdf" size={18} color="#fff" />
                  <Text style={styles.pdfText}>Export Full Clinical Report PDF</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={styles.pdfBtn} onPress={generatePDF} activeOpacity={0.8}>
                <MaterialIcons name="picture-as-pdf" size={18} color="#fff" />
                <Text style={styles.pdfText}>Export PDF Report</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F4E6" },
  scrollContent: { padding: 20, paddingBottom: 160 },
  readonlyBanner: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#EDE9FE", borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 10, marginBottom: 16, gap: 8,
  },
  readonlyText: { fontSize: 13, color: "#7C3AED", fontWeight: "600", flex: 1 },
  readonlyBackText: { fontSize: 12, color: "#7C3AED", fontWeight: "700" },
  headerSection: { alignItems: "center", marginBottom: 20 },
  title: { fontSize: 26, fontWeight: "800", marginTop: 12, color: "#1F2937" },
  headerSubtitle: { fontSize: 13, color: "#6B7280", marginTop: 4 },
  severityCard: { borderRadius: 18, padding: 20, marginBottom: 16, borderWidth: 2, alignItems: "center" },
  severityLabel: { fontSize: 10, fontWeight: "800", letterSpacing: 0.5, marginBottom: 8 },
  severityLevelText: { fontSize: 28, fontWeight: "900", marginBottom: 14 },
  severityMetrics: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  metricItem: { alignItems: "center", paddingHorizontal: 20 },
  metricValue: { fontSize: 22, fontWeight: "800" },
  metricLabel: { fontSize: 9, fontWeight: "800", letterSpacing: 0.5, marginTop: 2 },
  metricDivider: { width: 1, height: 36 },
  severityDesc: { fontSize: 13, fontWeight: "600", textAlign: "center" },
  card: {
    backgroundColor: "#fff", borderRadius: 18, padding: 20, marginBottom: 14,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  cardLabel: { fontSize: 10, fontWeight: "800", color: "#9CA3AF", marginBottom: 8, letterSpacing: 0.5 },
  patientName: { fontSize: 20, fontWeight: "800", color: "#1F2937", marginBottom: 14 },
  identityGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 12 },
  identityItem: { backgroundColor: "#F9FAFB", borderRadius: 10, padding: 10, minWidth: "45%" },
  identityItemLabel: { fontSize: 10, fontWeight: "700", color: "#9CA3AF" },
  identityItemValue: { fontSize: 14, fontWeight: "700", color: "#1F2937", marginTop: 2 },
  allergyBadge: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#FEF3C7", padding: 8, borderRadius: 10, marginTop: 4 },
  allergyText: { fontSize: 12, color: "#D97706", fontWeight: "600" },
  prevBiteBadge: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#EDE9FE", padding: 8, borderRadius: 10, marginTop: 6 },
  prevBiteText: { fontSize: 12, color: "#7C3AED", fontWeight: "600" },
  exposureType: { fontSize: 16, fontWeight: "700", color: "#1F2937", marginBottom: 4 },
  timestamp: { fontSize: 12, color: "#6B7280" },
  symptomRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#F1F5F9" },
  symptomDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#C45E3D" },
  symptomText: { flex: 1, fontSize: 13, color: "#374151", fontWeight: "500" },
  gradePill: { backgroundColor: "#F3F4F6", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  gradeText: { fontSize: 11, fontWeight: "700", color: "#6B7280" },
  complaintText: { fontSize: 14, color: "#374151", lineHeight: 20 },
  nidanaText: { fontSize: 13, color: "#6B7280", lineHeight: 20, fontStyle: "italic" },
  notesSection: { marginTop: 8 },
  sectionTitle: { fontSize: 14, fontWeight: "700", marginBottom: 10, color: "#1F2937" },
  notesInput: { backgroundColor: "#fff", borderRadius: 14, padding: 16, height: 120, fontSize: 13, borderWidth: 1, borderColor: "#E5E7EB" },
  notesInputReadonly: { color: "#9CA3AF", backgroundColor: "#F9FAFB" },
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: "#F2F4E6", borderTopWidth: 1, borderTopColor: "#E5E7EB" },
  footerRow: { flexDirection: "row", gap: 10, marginBottom: 10 },
  saveBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, padding: 14, borderRadius: 12, borderWidth: 2, borderColor: "#C45E3D", backgroundColor: "#fff" },
  saveBtnDone: { backgroundColor: "#10B981", borderColor: "#10B981" },
  saveBtnText: { fontWeight: "700", color: "#C45E3D", fontSize: 14 },
  newCaseBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, padding: 14, borderRadius: 12, borderWidth: 2, borderColor: "#2563EB", backgroundColor: "#fff" },
  newCaseBtnText: { fontWeight: "700", color: "#2563EB", fontSize: 14 },
  pdfBtn: { backgroundColor: "#1F2937", padding: 16, borderRadius: 14, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 6 },
  pdfText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});