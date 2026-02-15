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

export default function Identity() {
  const router = useRouter();

  const [role, setRole] = useState("Doctor");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [occupation, setOccupation] = useState("");
  const [admission, setAdmission] = useState("OPD");
  const [socio, setSocio] = useState("Middle");
  const [mainComplaint, setMainComplaint] = useState("");
  const [history, setHistory] = useState("");

  const genders = ["Male", "Female", "Other"];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
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
            Please fill in the patient's basic information to begin the
            toxicological assessment.
          </Text>

          {/* Role Selector */}
          <Text style={styles.label}>Record Origin</Text>
          <View style={styles.segment}>
            {["Doctor", "Student", "Patient"].map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.segmentItem,
                  role === item && styles.segmentActive,
                ]}
                onPress={() => setRole(item)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.segmentText,
                    role === item && styles.segmentTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Name */}
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter patient name"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
          />

          {/* Age + Gender */}
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
                    style={[
                      styles.genderBtn,
                      gender === g && styles.genderBtnActive,
                    ]}
                    onPress={() => setGender(g)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.genderText,
                        gender === g && styles.genderTextActive,
                      ]}
                    >
                      {g[0]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Occupation */}
          <Text style={styles.label}>Occupation</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Industrial Worker, Farmer"
            placeholderTextColor="#9CA3AF"
            value={occupation}
            onChangeText={setOccupation}
          />

          {/* Admission Type */}
          <Text style={styles.label}>Admission Type</Text>
          <View style={styles.segment}>
            {["OPD", "IPD", "Emergency"].map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.segmentItem,
                  admission === item && styles.segmentActive,
                ]}
                onPress={() => setAdmission(item)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.segmentText,
                    admission === item && styles.segmentTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Main Complaint */}
          <Text style={styles.label}>Main Complaint</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            placeholder="Describe the primary toxic symptoms..."
            placeholderTextColor="#9CA3AF"
            value={mainComplaint}
            onChangeText={setMainComplaint}
            textAlignVertical="top"
          />

          {/* History */}
          <Text style={styles.label}>History of Present Illness</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            placeholder="Detail the duration and progression..."
            placeholderTextColor="#9CA3AF"
            value={history}
            onChangeText={setHistory}
            textAlignVertical="top"
          />

          {/* Socioeconomic Status */}
          <Text style={styles.label}>Socioeconomic Status</Text>
          <View style={styles.segment}>
            {["Lower", "Middle", "Upper"].map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.segmentItem,
                  socio === item && styles.segmentActive,
                ]}
                onPress={() => setSocio(item)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.segmentText,
                    socio === item && styles.segmentTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/exposure")}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>
              Continue to Exposure Analysis
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F3E1",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
    color: "#1F2937",
  },
  subtitle: {
    color: "#6B7280",
    marginBottom: 24,
    fontSize: 14,
    lineHeight: 20,
  },
  label: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: "700",
    fontSize: 13,
    color: "#374151",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
  },
  genderContainer: {
    flexDirection: "row",
    gap: 8,
  },
  genderBtn: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  genderBtnActive: {
    backgroundColor: "#C45E3D",
    borderColor: "#C45E3D",
  },
  genderText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  genderTextActive: {
    color: "#fff",
  },
  segment: {
    flexDirection: "row",
    backgroundColor: "#E5E7EB",
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  segmentActive: {
    backgroundColor: "#C45E3D",
  },
  segmentText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  segmentTextActive: {
    color: "#fff",
  },
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
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});