import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text } from "react-native";

export default function Summary() {
  const { type, symptoms } = useLocalSearchParams();

  const parsedSymptoms = symptoms
    ? JSON.parse(symptoms as string)
    : [];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Clinical Summary</Text>

      <Text style={styles.section}>
        Exposure Type: Bite
      </Text>

      <Text style={styles.section}>
        Bite Type: {type}
      </Text>

      <Text style={styles.section}>
        Total Symptoms Present: {parsedSymptoms.length}
      </Text>

      <Text style={styles.subHeading}>Symptoms Observed:</Text>

      {parsedSymptoms.length > 0 ? (
        parsedSymptoms.map((symptom: string, index: number) => (
          <Text key={index} style={styles.symptom}>
            • {symptom}
          </Text>
        ))
      ) : (
        <Text>No symptoms selected.</Text>
      )}

      <Text style={styles.conclusion}>
        Clinical Impression: Based on selected symptoms, further
        toxicological assessment required.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  section: {
    marginBottom: 10,
    fontWeight: "600",
  },
  subHeading: {
    marginTop: 15,
    fontWeight: "bold",
  },
  symptom: {
    marginLeft: 10,
    marginBottom: 5,
  },
  conclusion: {
    marginTop: 20,
    fontStyle: "italic",
  },
});
