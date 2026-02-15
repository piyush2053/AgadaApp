import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
    id: "vomiting",
    title: "Vomiting (Chhardi)",
    desc: "Forceful expulsion of stomach contents",
    category: "Gastrointestinal",
  },
  {
    id: "abdominal",
    title: "Abdominal Pain (Shula)",
    desc: "Sharp or dull discomfort in the gut region",
    category: "Gastrointestinal",
  },
  {
    id: "diarrhea",
    title: "Diarrhea (Atisara)",
    desc: "Frequent loose or liquid bowel movements",
    category: "Gastrointestinal",
  },
  {
    id: "dizziness",
    title: "Dizziness (Bhrama)",
    desc: "Sensation of spinning or loss of balance",
    category: "Neurological",
  },
  {
    id: "headache",
    title: "Headache (Shirah Shula)",
    desc: "Pain or pressure in the head region",
    category: "Neurological",
  },
  {
    id: "salivation",
    title: "Excessive Salivation (Praseka)",
    desc: "Abnormal production of saliva",
    category: "Neurological",
  },
  {
    id: "confusion",
    title: "Confusion (Moha)",
    desc: "Disorientation or altered mental state",
    category: "Neurological",
  },
  {
    id: "rash",
    title: "Skin Rash (Mandala)",
    desc: "Redness or circular patches on skin",
    category: "Dermatological",
  },
  {
    id: "swelling",
    title: "Swelling (Shotha)",
    desc: "Localized enlargement or inflammation",
    category: "Dermatological",
  },
  {
    id: "breathing",
    title: "Breathing Difficulty (Shwasa Kastha)",
    desc: "Shortness of breath or labored breathing",
    category: "Respiratory",
  },
  {
    id: "chest",
    title: "Chest Pain (Hrit Shula)",
    desc: "Discomfort or pain in chest area",
    category: "Respiratory",
  },
];

export default function Symptoms() {
  const { type } = useLocalSearchParams();
  const router = useRouter();

  const [activeSymptoms, setActiveSymptoms] = useState<Record<string, boolean>>({});
  const [severity, setSeverity] = useState<Record<string, number>>({});

  const toggleSymptom = (id: string) => {
    setActiveSymptoms((prev) => {
      const newState = { ...prev, [id]: !prev[id] };
      // Reset severity if unchecked
      if (!newState[id]) {
        setSeverity((s) => {
          const newSev = { ...s };
          delete newSev[id];
          return newSev;
        });
      }
      return newState;
    });
  };

  const selectSeverity = (id: string, level: number) => {
    setSeverity((prev) => ({ ...prev, [id]: level }));
  };

  const generateSummary = () => {
    const selected = Object.keys(activeSymptoms)
      .filter((key) => activeSymptoms[key])
      .map((key) => {
        const symptomInfo = symptomData.find((s) => s.id === key);
        return {
          symptom: symptomInfo?.title || key,
          severity: severity[key] || 1,
        };
      });

    router.push({
      pathname: "/summary",
      params: {
        type,
        symptoms: JSON.stringify(selected),
      },
    });
  };

  const categories = useMemo(
    () => [...new Set(symptomData.map((s) => s.category))],
    []
  );

  const selectedCount = Object.values(activeSymptoms).filter(Boolean).length;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={{ flex: 1 }}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Symptom Assessment</Text>
          <Text style={styles.subtitle}>
            Record clinical observations for the toxic exposure case.
            Select symptoms and define their severity levels.
          </Text>

          {/* Selected Count Badge */}
          {selectedCount > 0 && (
            <View style={styles.badge}>
              <MaterialIcons name="check-circle" size={16} color="#2E7D32" />
              <Text style={styles.badgeText}>
                {selectedCount} symptom{selectedCount !== 1 ? 's' : ''} selected
              </Text>
            </View>
          )}

          {categories.map((cat) => (
            <View key={cat}>
              <Text style={styles.category}>{cat.toUpperCase()}</Text>

              {symptomData
                .filter((s) => s.category === cat)
                .map((symptom) => {
                  const isActive = activeSymptoms[symptom.id];

                  return (
                    <View key={symptom.id} style={styles.card}>
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
                          onValueChange={() => toggleSymptom(symptom.id)}
                          trackColor={{ false: "#E5E7EB", true: "#93C5FD" }}
                          thumbColor={isActive ? "#3B82F6" : "#F3F4F6"}
                          ios_backgroundColor="#E5E7EB"
                        />
                      </View>

                      {isActive && (
                        <View style={styles.severityContainer}>
                          <Text style={styles.severityLabel}>
                            SELECT SEVERITY
                          </Text>

                          <View style={styles.severityRow}>
                            {[
                              { level: 1, label: "Mild", color: "#10B981" },
                              { level: 2, label: "Moderate", color: "#F59E0B" },
                              { level: 3, label: "Severe", color: "#EF4444" },
                            ].map(({ level, label, color }) => (
                              <TouchableOpacity
                                key={level}
                                style={[
                                  styles.severityBtn,
                                  severity[symptom.id] === level && {
                                    backgroundColor: color,
                                  },
                                ]}
                                onPress={() =>
                                  selectSeverity(symptom.id, level)
                                }
                                activeOpacity={0.7}
                              >
                                <Text
                                  style={[
                                    styles.severityText,
                                    severity[symptom.id] === level &&
                                      styles.severityTextActive,
                                  ]}
                                >
                                  {label} ({level})
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
            style={[
              styles.generateBtn,
              selectedCount === 0 && styles.generateBtnDisabled,
            ]}
            onPress={generateSummary}
            disabled={selectedCount === 0}
            activeOpacity={0.8}
          >
            <MaterialIcons name="assignment" size={20} color="#fff" />
            <Text style={styles.generateText}>
              Generate Clinical Summary
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    marginTop: 8,
    color: "#1F2937",
  },
  subtitle: {
    color: "#64748B",
    marginVertical: 12,
    fontSize: 13,
    lineHeight: 19,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F8F4",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 16,
    gap: 6,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2E7D32",
  },
  category: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 11,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  symptomTitle: {
    fontWeight: "700",
    fontSize: 15,
    color: "#1F2937",
    marginBottom: 3,
  },
  symptomDesc: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 17,
  },
  severityContainer: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderColor: "#F1F5F9",
  },
  severityLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#94A3B8",
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  severityRow: {
    flexDirection: "row",
    gap: 8,
  },
  severityBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
  },
  severityText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  severityTextActive: {
    color: "#fff",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "#F8FAFC",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  generateBtn: {
    backgroundColor: "#2563EB",
    padding: 18,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  generateBtnDisabled: {
    backgroundColor: "#94A3B8",
    shadowOpacity: 0,
    elevation: 0,
  },
  generateText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});