import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Symptom = {
  id: string;
  title: string;
  desc: string;
  category: string;
};

const symptomData: Symptom[] = [
  {
    id: "nausea",
    title: "Nausea (Hrillasa)",
    desc: "Feeling of sickness with an inclination to vomit",
    category: "Gastrointestinal",
  },
  {
    id: "abdominal",
    title: "Abdominal Pain (Shula)",
    desc: "Sharp or dull discomfort in the gut region",
    category: "Gastrointestinal",
  },
  {
    id: "dizziness",
    title: "Dizziness (Bhrama)",
    desc: "Sensation of spinning or loss of balance",
    category: "Neurological",
  },
  {
    id: "salivation",
    title: "Salivation (Praseka)",
    desc: "Excessive production of saliva",
    category: "Neurological",
  },
  {
    id: "rash",
    title: "Skin Rash (Mandala)",
    desc: "Redness or circular patches on skin",
    category: "Dermatological",
  },
];

export default function Symptoms() {
  const { type } = useLocalSearchParams();
  const router = useRouter();

  const [activeSymptoms, setActiveSymptoms] = useState<
    Record<string, boolean>
  >({});
  const [severity, setSeverity] = useState<
    Record<string, number>
  >({});

  const toggleSymptom = (id: string) => {
    setActiveSymptoms((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const selectSeverity = (id: string, level: number) => {
    setSeverity((prev) => ({
      ...prev,
      [id]: level,
    }));
  };

  const generateSummary = () => {
    const selected = Object.keys(activeSymptoms)
      .filter((key) => activeSymptoms[key])
      .map((key) => ({
        symptom: key,
        severity: severity[key] || 1,
      }));

    router.push({
      pathname: "/summary",
      params: {
        type,
        symptoms: JSON.stringify(selected),
      },
    });
  };

  const categories = [
    "Gastrointestinal",
    "Neurological",
    "Dermatological",
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        <Text style={styles.title}>Symptom Assessment</Text>
        <Text style={styles.subtitle}>
          Record clinical observations for the toxic exposure case.
          Select symptoms and define their severity levels.
        </Text>

        {categories.map((cat) => (
          <View key={cat}>
            <Text style={styles.category}>
              {cat.toUpperCase()}
            </Text>

            {symptomData
              .filter((s) => s.category === cat)
              .map((symptom) => {
                const isActive = activeSymptoms[symptom.id];

                return (
                  <View
                    key={symptom.id}
                    style={styles.card}
                  >
                    <View style={styles.row}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.symptomTitle}>
                          {symptom.title}
                        </Text>
                        <Text style={styles.symptomDesc}>
                          {symptom.desc}
                        </Text>
                      </View>

                      <Switch
                        value={!!isActive}
                        onValueChange={() =>
                          toggleSymptom(symptom.id)
                        }
                      />
                    </View>

                    {isActive && (
                      <View style={styles.severityContainer}>
                        <Text style={styles.severityLabel}>
                          SELECT SEVERITY
                        </Text>

                        <View style={styles.severityRow}>
                          {[1, 2, 3].map((level) => (
                            <TouchableOpacity
                              key={level}
                              style={[
                                styles.severityBtn,
                                severity[symptom.id] === level &&
                                  styles.severityActive,
                              ]}
                              onPress={() =>
                                selectSeverity(
                                  symptom.id,
                                  level
                                )
                              }
                            >
                              <Text
                                style={[
                                  styles.severityText,
                                  severity[symptom.id] ===
                                    level &&
                                    styles.severityTextActive,
                                ]}
                              >
                                {level === 1
                                  ? "Mild (1)"
                                  : level === 2
                                  ? "Moderate (2)"
                                  : "Severe (3)"}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
          </View>
        ))}
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.generateBtn}
          onPress={generateSummary}
        >
          <MaterialIcons
            name="assignment"
            size={20}
            color="#fff"
          />
          <Text style={styles.generateText}>
            Generate Clinical Summary
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    marginTop: 20,
  },
  subtitle: {
    color: "#64748B",
    marginVertical: 15,
    fontSize: 13,
  },
  category: {
    marginTop: 20,
    marginBottom: 8,
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 18,
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  symptomTitle: {
    fontWeight: "700",
    fontSize: 16,
  },
  symptomDesc: {
    fontSize: 12,
    color: "#64748B",
  },
  severityContainer: {
    marginTop: 15,
    borderTopWidth: 1,
    borderColor: "#F1F5F9",
    paddingTop: 10,
  },
  severityLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#94A3B8",
    marginBottom: 8,
  },
  severityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  severityBtn: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 3,
    borderRadius: 10,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
  },
  severityActive: {
    backgroundColor: "#2563EB",
  },
  severityText: {
    fontSize: 12,
    color: "#475569",
  },
  severityTextActive: {
    color: "#fff",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 20,
    backgroundColor: "#F8FAFC",
  },
  generateBtn: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  generateText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 8,
  },
});
