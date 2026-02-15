import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="identity" options={{ title: "Preliminary Data" }} />
      <Stack.Screen name="exposure" options={{ title: "Exposure Type" }} />
      <Stack.Screen name="bite" options={{ title: "Bite Type" }} />
      <Stack.Screen name="symptoms" options={{ title: "Symptoms" }} />
      <Stack.Screen name="summary" options={{ title: "Summary" }} />
    </Stack>
  );
}
