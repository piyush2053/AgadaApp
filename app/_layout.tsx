import { Stack, usePathname } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

// Progress indicator component
function ProgressHeader() {
  const pathname = usePathname();
  
  // Define progress steps
  const steps = [
    { path: "/identity", step: 1, total: 5, label: "Patient Info" },
    { path: "/exposure", step: 2, total: 5, label: "Exposure Type" },
    { path: "/bite", step: 3, total: 5, label: "Organism" },
    { path: "/toxicFood", step: 3, total: 5, label: "Food Type" },
    { path: "/symptoms", step: 4, total: 5, label: "Symptoms" },
    { path: "/summary", step: 5, total: 5, label: "Summary" },
  ];

  const currentStep = steps.find(s => s.path === pathname);
  
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
        headerStyle: {
          backgroundColor: "#F1F3E1",
        },
        headerTintColor: "#C45E3D",
        headerTitleStyle: {
          fontWeight: "700",
        },
      }}
    >
      {/* Splash */}
      <Stack.Screen name="index" options={{ headerShown: false }} />

      {/* Landing Screen */}
      <Stack.Screen name="home" options={{ headerShown: false }} />

      {/* Main Flow with Progress */}
      <Stack.Screen
        name="identity"
        options={{
          title: "Patient Information",
          headerRight: () => <ProgressHeader />,
        }}
      />
      <Stack.Screen
        name="exposure"
        options={{
          title: "Exposure Type",
          headerRight: () => <ProgressHeader />,
        }}
      />
      <Stack.Screen
        name="bite"
        options={{
          title: "Bite Assessment",
          headerRight: () => <ProgressHeader />,
        }}
      />
      <Stack.Screen
        name="toxicFood"
        options={{
          title: "Toxic Food",
          headerRight: () => <ProgressHeader />,
        }}
      />
      <Stack.Screen
        name="symptoms"
        options={{
          title: "Symptom Assessment",
          headerRight: () => <ProgressHeader />,
        }}
      />
      <Stack.Screen
        name="summary"
        options={{
          title: "Clinical Summary",
          headerRight: () => <ProgressHeader />,
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    alignItems: "center",
    marginRight: 15,
  },
  progressBar: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 4,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D1D5DB",
  },
  progressDotActive: {
    backgroundColor: "#C45E3D",
  },
  progressText: {
    fontSize: 10,
    color: "#6B7280",
    fontWeight: "600",
  },
});