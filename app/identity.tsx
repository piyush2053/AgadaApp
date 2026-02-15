import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Button,
    ScrollView,
    StyleSheet,
    Text,
    TextInput
} from "react-native";

export default function Identity() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [mainComplaint, setMainComplaint] = useState("");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Preliminary Data</Text>

      <Text>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text>Age</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />

      <Text>Gender</Text>
      <TextInput style={styles.input} value={gender} onChangeText={setGender} />

      <Text>Main Complaints</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        multiline
        value={mainComplaint}
        onChangeText={setMainComplaint}
      />

      <Button title="Next" onPress={() => router.push("/exposure")} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 6,
  },
});
