import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Identity() {
  const router = useRouter();

  const [role, setRole] = useState("Doctor");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [occupation, setOccupation] = useState("");
  const [admission, setAdmission] = useState("OPD");
  const [socio, setSocio] = useState("Middle");
  const [mainComplaint, setMainComplaint] = useState("");
  const [history, setHistory] = useState("");

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
        value={name}
        onChangeText={setName}
      />

      {/* Age + Gender */}
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            placeholder="Years"
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
          />
        </View>

        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.label}>Gender</Text>
          <TextInput
            style={styles.input}
            placeholder="Select"
            value={gender}
            onChangeText={setGender}
          />
        </View>
      </View>

      {/* Occupation */}
      <Text style={styles.label}>Occupation</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Industrial Worker, Farmer"
        value={occupation}
        onChangeText={setOccupation}
      />

      {/* Admission Type */}
      <Text style={styles.label}>Admission Type</Text>
      <View style={styles.segment}>
        {["OPD", "IPD"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.segmentItem,
              admission === item && styles.segmentActive,
            ]}
            onPress={() => setAdmission(item)}
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
        value={mainComplaint}
        onChangeText={setMainComplaint}
      />

      {/* History */}
      <Text style={styles.label}>History of Present Illness</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        multiline
        placeholder="Detail the duration and progression..."
        value={history}
        onChangeText={setHistory}
      />

      {/* Socioeconomic Status */}
      <Text style={styles.label}>Socioeconomic Status</Text>
      <View style={styles.segment}>
        {["Lower", "Middle", "Upper"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.segmentItem,
              socio === item && styles.segmentActiveBorder,
            ]}
            onPress={() => setSocio(item)}
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
      >
        <Text style={styles.primaryButtonText}>
          Continue to Exposure Analysis
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F1F3E1",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    color: "#666",
    marginBottom: 20,
  },
  label: {
    marginTop: 15,
    marginBottom: 5,
    fontWeight: "600",
    fontSize: 12,
    color: "#555",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
  },
  segment: {
    flexDirection: "row",
    backgroundColor: "#E5E7EB",
    borderRadius: 25,
    padding: 4,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 20,
  },
  segmentActive: {
    backgroundColor: "#C45E3D",
  },
  segmentActiveBorder: {
    borderWidth: 2,
    borderColor: "#C45E3D",
  },
  segmentText: {
    fontSize: 14,
    color: "#555",
  },
  segmentTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  primaryButton: {
    backgroundColor: "#C45E3D",
    padding: 18,
    borderRadius: 40,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 40,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
});
