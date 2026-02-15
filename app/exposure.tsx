import { useRouter } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function Exposure() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Exposure Type</Text>

      <Button title="Bite" onPress={() => router.push("/bite")} />
      <Button title="Toxic Food" onPress={() => {}} />
      <Button title="External Contact" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 20 },
});
