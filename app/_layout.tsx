import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerTitleAlign: "center" }}>
      
      {/* Splash */}
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />

      {/* Landing Screen */}
      <Stack.Screen
        name="home"
        options={{ headerShown: false }}
      />

      {/* Main Flow */}
      <Stack.Screen
        name="identity"
        options={{ title: "Preliminary Data" }}
      />
      <Stack.Screen
        name="exposure"
        options={{ title: "Exposure Type" }}
      />
      <Stack.Screen
        name="bite"
        options={{ title: "Bite Type" }}
      />

      <Stack.Screen
        name="toxicFood"
        options={{ title: "Toxic Food" }}
      />
      <Stack.Screen
        name="symptoms"
        options={{ title: "Symptoms" }}
      />
      <Stack.Screen
        name="summary"
        options={{ title: "Summary" }}
      />
    </Stack>
  );
}
