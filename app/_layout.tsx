import { Stack, usePathname } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

function ProgressHeader() {
  const pathname = usePathname();

  const steps = [
    { path: "/identity", step: 1, total: 6, label: "Patient Info" },
    { path: "/exposure", step: 2, total: 6, label: "Exposure Type" },
    { path: "/bite", step: 3, total: 6, label: "Organism" },
    { path: "/toxicFood", step: 3, total: 6, label: "Food Type" },
    { path: "/externalContact", step: 3, total: 6, label: "External" },
    { path: "/questionnaire", step: 3, total: 6, label: "Questionnaire" },
    { path: "/virruddhaAahara", step: 3, total: 6, label: "Virruddha" },
    { path: "/symptoms", step: 4, total: 6, label: "Symptoms" },
    { path: "/summary", step: 6, total: 6, label: "Summary" },
  ];

  const currentStep = steps.find((s) => s.path === pathname);
  if (!currentStep) return null;

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        {Array.from({ length: currentStep.total }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index < currentStep.step && styles.progressDotActive,
            ]}
          />
        ))}
      </View>
      <Text style={styles.progressText}>
        Step {currentStep.step} of {currentStep.total} • {currentStep.label}
      </Text>
    </View>
  );
}

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: "#F1F3E1" },
        headerTintColor: "#C45E3D",
        headerTitleStyle: { fontWeight: "700" },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ headerShown: false }} />

      <Stack.Screen
        name="identity"
        options={{ title: "Patient Information", headerRight: () => <ProgressHeader /> }}
      />
      <Stack.Screen
        name="exposure"
        options={{ title: "Exposure Type", headerRight: () => <ProgressHeader /> }}
      />
      <Stack.Screen
        name="bite"
        options={{ title: "Bite Assessment", headerRight: () => <ProgressHeader /> }}
      />
      <Stack.Screen
        name="toxicFood"
        options={{ title: "Toxic Food", headerRight: () => <ProgressHeader /> }}
      />
      <Stack.Screen
        name="externalContact"
        options={{ title: "External Contact", headerRight: () => <ProgressHeader /> }}
      />
      <Stack.Screen
        name="questionnaire"
        options={{ title: "Visha Questionnaire", headerRight: () => <ProgressHeader /> }}
      />
      <Stack.Screen
        name="virruddhaAahara"
        options={{ title: "Virruddha Aahara", headerRight: () => <ProgressHeader /> }}
      />
      <Stack.Screen
        name="symptoms"
        options={{ title: "Symptom Assessment", headerRight: () => <ProgressHeader /> }}
      />
      <Stack.Screen
        name="summary"
        options={{ title: "Clinical Summary", headerRight: () => <ProgressHeader /> }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  progressContainer: { alignItems: "center", marginRight: 15 },
  progressBar: { flexDirection: "row", gap: 5, marginBottom: 3 },
  progressDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: "#D1D5DB" },
  progressDotActive: { backgroundColor: "#C45E3D" },
  progressText: { fontSize: 9, color: "#6B7280", fontWeight: "600" },
});