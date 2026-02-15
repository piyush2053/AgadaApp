import { useRouter } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function Bite() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Bite Type</Text>

      <Button title="Snake (Sarpa)" onPress={() => router.push("/symptoms?type=snake")} />
      <Button title="Scorpion (Vruschika)" onPress={() => router.push("/symptoms?type=scorpion")} />
      <Button title="Insect (Kita)" onPress={() => router.push("/symptoms?type=insect")} />
      <Button title="Dog (Alarka)" onPress={() => router.push("/symptoms?type=dog")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 20 },
});
