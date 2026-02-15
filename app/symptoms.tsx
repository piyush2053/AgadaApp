import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    Button,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View,
} from "react-native";

const snakeSymptoms = [
  "Numbness at bite site",
  "Blackish bleeding",
  "Headache",
  "Fever",
  "Rigidity",
];

export default function Symptoms() {
  const { type } = useLocalSearchParams();
  const [selected, setSelected] = useState<{ [key: string]: boolean }>({});

  const symptoms = type === "snake" ? snakeSymptoms : [];

  const toggle = (symptom: string) => {
    setSelected({ ...selected, [symptom]: !selected[symptom] });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Symptoms - {type}</Text>

      {symptoms.map((symptom) => (
        <View key={symptom} style={styles.row}>
          <Text style={{ flex: 1 }}>{symptom}</Text>
          <Switch
            value={selected[symptom] || false}
            onValueChange={() => toggle(symptom)}
          />
        </View>
      ))}

      <Button title="Generate Summary" onPress={() => {}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 20 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
});
