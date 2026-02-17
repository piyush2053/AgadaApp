import { useRouter } from "expo-router";
import { useState } from "react";
import {
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
import { saveDraft } from "./utils/StorageService";

export default function Identity() {
  const router = useRouter();

  const [role, setRole] = useState("Doctor");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [occupation, setOccupation] = useState("");
  const [address, setAddress] = useState("");
  const [dateOfAdmission, setDateOfAdmission] = useState(
    new Date().toLocaleDateString("en-IN")
  );
  const [maritalStatus, setMaritalStatus] = useState("Single");
  const [admissionType, setAdmissionType] = useState("OPD");
  const [opdEnabled, setOpdEnabled] = useState(false);
  const [opdNumber, setOpdNumber] = useState("");
  const [ipdEnabled, setIpdEnabled] = useState(false);
  const [ipdNumber, setIpdNumber] = useState("");
  const [socio, setSocio] = useState("Middle");
  const [mainComplaint, setMainComplaint] = useState("");
  const [associatedComplaints, setAssociatedComplaints] = useState("");
  const [allergies, setAllergies] = useState("");
  const [history, setHistory] = useState("");
  const [previousBite, setPreviousBite] = useState(false);
  const [nidana, setNidana] = useState("");

  const genders = ["Male", "Female", "Other"];
  const maritalOptions = ["Single", "Married", "Widowed", "Divorced"];

  const handleContinue = async () => {
    const identityData = {
      role, name, age, gender, occupation, address, dateOfAdmission,
      maritalStatus, admissionType,
      opdNumber: opdEnabled ? opdNumber : "",
      ipdNumber: ipdEnabled ? ipdNumber : "",
      socioStatus: socio, mainComplaint, associatedComplaints,
      allergies, history, previousBite, nidana,
    };
    await saveDraft({ identity: identityData });
    router.push("/exposure");
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Preliminary Data</Text>
          <Text style={styles.subtitle}>
            Fill in the patient's information to begin the Agada Tantra
            toxicological assessment.
          </Text>

          {/* ── Record Origin ─────────────────── */}
          <Text style={styles.label}>Record Origin</Text>
          <View style={styles.segment}>
            {["Doctor", "Student", "Patient"].map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.segmentItem, role === item && styles.segmentActive]}
                onPress={() => setRole(item)}
                activeOpacity={0.7}
              >
                <Text style={[styles.segmentText, role === item && styles.segmentTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Full Name ─────────────────────── */}
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter patient name"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
          />

          {/* ── Age + Gender ──────────────────── */}
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Age (Years)</Text>
              <TextInput
                style={styles.input}
                placeholder="Age"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={age}
                onChangeText={setAge}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.genderContainer}>
                {genders.map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[styles.genderBtn, gender === g && styles.genderBtnActive]}
                    onPress={() => setGender(g)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.genderText, gender === g && styles.genderTextActive]}>
                      {g[0]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* ── Marital Status ─────────────────── */}
          <Text style={styles.label}>Marital Status</Text>
          <View style={styles.segment}>
            {maritalOptions.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.segmentItem, maritalStatus === item && styles.segmentActive]}
                onPress={() => setMaritalStatus(item)}
                activeOpacity={0.7}
              >
                <Text style={[styles.segmentText, maritalStatus === item && styles.segmentTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Occupation ────────────────────── */}
          <Text style={styles.label}>Occupation</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Farmer, Industrial Worker"
            placeholderTextColor="#9CA3AF"
            value={occupation}
            onChangeText={setOccupation}
          />

          {/* ── Address ───────────────────────── */}
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            placeholder="Patient's residential address"
            placeholderTextColor="#9CA3AF"
            value={address}
            onChangeText={setAddress}
            textAlignVertical="top"
          />

          {/* ── Date of Admission ─────────────── */}
          <Text style={styles.label}>Date of Admission</Text>
          <TextInput
            style={styles.input}
            placeholder="DD/MM/YYYY"
            placeholderTextColor="#9CA3AF"
            value={dateOfAdmission}
            onChangeText={setDateOfAdmission}
          />

          {/* ── Admission Type ────────────────── */}
          <Text style={styles.label}>Admission Type</Text>
          <View style={styles.segment}>
            {["OPD", "IPD", "Emergency"].map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.segmentItem, admissionType === item && styles.segmentActive]}
                onPress={() => setAdmissionType(item)}
                activeOpacity={0.7}
              >
                <Text style={[styles.segmentText, admissionType === item && styles.segmentTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── OPD Number Toggle ─────────────── */}
          <View style={styles.toggleRow}>
            <Text style={styles.label}>OPD Number</Text>
            <TouchableOpacity
              style={[styles.toggleBtn, opdEnabled && styles.toggleBtnActive]}
              onPress={() => setOpdEnabled((v) => !v)}
              activeOpacity={0.7}
            >
              <Text style={[styles.toggleText, opdEnabled && styles.toggleTextActive]}>
                {opdEnabled ? "Enabled" : "Disabled"}
              </Text>
            </TouchableOpacity>
          </View>
          {opdEnabled && (
            <TextInput
              style={styles.input}
              placeholder="Enter OPD Number"
              placeholderTextColor="#9CA3AF"
              value={opdNumber}
              onChangeText={setOpdNumber}
              keyboardType="numeric"
            />
          )}

          {/* ── IPD Number Toggle ─────────────── */}
          <View style={styles.toggleRow}>
            <Text style={styles.label}>IPD Number</Text>
            <TouchableOpacity
              style={[styles.toggleBtn, ipdEnabled && styles.toggleBtnActive]}
              onPress={() => setIpdEnabled((v) => !v)}
              activeOpacity={0.7}
            >
              <Text style={[styles.toggleText, ipdEnabled && styles.toggleTextActive]}>
                {ipdEnabled ? "Enabled" : "Disabled"}
              </Text>
            </TouchableOpacity>
          </View>
          {ipdEnabled && (
            <TextInput
              style={styles.input}
              placeholder="Enter IPD Number"
              placeholderTextColor="#9CA3AF"
              value={ipdNumber}
              onChangeText={setIpdNumber}
              keyboardType="numeric"
            />
          )}

          {/* ── Socioeconomic Status ──────────── */}
          <Text style={styles.label}>Socioeconomic Status</Text>
          <View style={styles.segment}>
            {["Lower", "Middle", "Upper"].map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.segmentItem, socio === item && styles.segmentActive]}
                onPress={() => setSocio(item)}
                activeOpacity={0.7}
              >
                <Text style={[styles.segmentText, socio === item && styles.segmentTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Main Complaint ────────────────── */}
          <Text style={styles.label}>Main Complaint (Chief Presenting Symptom)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            placeholder="Describe the primary toxic symptoms..."
            placeholderTextColor="#9CA3AF"
            value={mainComplaint}
            onChangeText={setMainComplaint}
            textAlignVertical="top"
          />

          {/* ── Associated Complaints ─────────── */}
          <Text style={styles.label}>Associated Complaints</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            placeholder="Any additional complaints accompanying the main symptom..."
            placeholderTextColor="#9CA3AF"
            value={associatedComplaints}
            onChangeText={setAssociatedComplaints}
            textAlignVertical="top"
          />

          {/* ── Allergies ─────────────────────── */}
          <Text style={styles.label}>Known Allergies</Text>
          <TextInput
            style={styles.input}
            placeholder="Drug, food, or environmental allergies"
            placeholderTextColor="#9CA3AF"
            value={allergies}
            onChangeText={setAllergies}
          />

          {/* ── History ───────────────────────── */}
          <Text style={styles.label}>History of Present Illness</Text>
          <TextInput
            style={[styles.input, styles.textAreaLarge]}
            multiline
            placeholder="Detail the duration and progression of the illness..."
            placeholderTextColor="#9CA3AF"
            value={history}
            onChangeText={setHistory}
            textAlignVertical="top"
          />

          {/* ── Previous Bite in Last 10 Years ── */}
          <Text style={styles.label}>Previous Bite / Exposure in Last 10 Years?</Text>
          <View style={styles.segment}>
            {["Yes", "No"].map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.segmentItem,
                  (item === "Yes" ? previousBite : !previousBite) && styles.segmentActive,
                ]}
                onPress={() => setPreviousBite(item === "Yes")}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.segmentText,
                    (item === "Yes" ? previousBite : !previousBite) && styles.segmentTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Nidana (Causative Factor) ─────── */}
          <Text style={styles.label}>Nidana (Causative Factor)</Text>
          <Text style={styles.helperText}>
            Describe the causative and contextual factors in detail (up to 200 words)
          </Text>
          <TextInput
            style={[styles.input, styles.textAreaLarge]}
            multiline
            maxLength={1200}
            placeholder="Describe in detail: time, place, circumstance of exposure. What was the patient doing? What was consumed or contacted?..."
            placeholderTextColor="#9CA3AF"
            value={nidana}
            onChangeText={setNidana}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>
            {nidana.length} / 1200 characters
          </Text>

          {/* ── Continue ─────────────────────── */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>
              Continue to Exposure Analysis →
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F1F3E1" },
  scrollContent: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 8, color: "#1F2937" },
  subtitle: { color: "#6B7280", marginBottom: 24, fontSize: 14, lineHeight: 20 },
  label: { marginTop: 16, marginBottom: 6, fontWeight: "700", fontSize: 13, color: "#374151" },
  helperText: { fontSize: 11, color: "#9CA3AF", marginBottom: 6, lineHeight: 15 },
  charCount: { fontSize: 11, color: "#9CA3AF", textAlign: "right", marginTop: 4 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  textArea: { height: 90, textAlignVertical: "top" },
  textAreaLarge: { height: 130, textAlignVertical: "top" },
  row: { flexDirection: "row" },
  genderContainer: { flexDirection: "row", gap: 8 },
  genderBtn: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  genderBtnActive: { backgroundColor: "#C45E3D", borderColor: "#C45E3D" },
  genderText: { fontSize: 14, fontWeight: "600", color: "#6B7280" },
  genderTextActive: { color: "#fff" },
  segment: {
    flexDirection: "row",
    backgroundColor: "#E5E7EB",
    borderRadius: 14,
    padding: 4,
    gap: 4,
    flexWrap: "wrap",
  },
  segmentItem: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 10, minWidth: 60 },
  segmentActive: { backgroundColor: "#C45E3D" },
  segmentText: { fontSize: 12, fontWeight: "600", color: "#6B7280" },
  segmentTextActive: { color: "#fff" },
  toggleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 16 },
  toggleBtn: {
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  toggleBtnActive: { backgroundColor: "#C45E3D" },
  toggleText: { fontSize: 12, fontWeight: "700", color: "#6B7280" },
  toggleTextActive: { color: "#fff" },
  primaryButton: {
    backgroundColor: "#C45E3D",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 32,
    shadowColor: "#C45E3D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});