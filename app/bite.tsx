import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const organisms = [
  { key: "snake", label: "Snake", sub: "Sarpa Dansha", icon: "pest-control-rodent" },
  { key: "scorpion", label: "Scorpion", sub: "Vruschika Dansha", icon: "bug-report" },
  { key: "spider", label: "Spider", sub: "Luta Dansha", icon: "category" },
  { key: "insect", label: "Insect", sub: "Keeta Dansha", icon: "flutter-dash" },
  { key: "dog", label: "Dog", sub: "Shwana Dansha", icon: "pets" },
  { key: "rat", label: "Rat", sub: "Mushika Dansha", icon: "mouse" },
];

const snakeSubTypes = [
  {
    key: "cobra",
    label: "Darvikara",
    sub: "Cobra (Naja sp.)",
    icon: "pest-control-rodent",
    description: "Neurotoxic + cytotoxic. Causes hood spread, ptosis, paralysis.",
    color: "#EF4444",
    bgColor: "#FEE2E2",
  },
  {
    key: "viper",
    label: "Mandali",
    sub: "Viper (Vipera sp.)",
    icon: "warning",
    description: "Hemotoxic. Causes severe local swelling, bleeding, coagulopathy.",
    color: "#D97706",
    bgColor: "#FEF3C7",
  },
  {
    key: "krait",
    label: "Rajimanta",
    sub: "Krait (Bungarus sp.)",
    icon: "dangerous",
    description: "Neurotoxic. Minimal local signs, descending paralysis, often nocturnal bite.",
    color: "#7C3AED",
    bgColor: "#EDE9FE",
  },
];

export default function Bite() {
  const router = useRouter();
  const [selected, setSelected] = useState("snake");
  const [snakeSubType, setSnakeSubType] = useState<string | null>(null);
  const [step, setStep] = useState<"organism" | "snake_sub">("organism");

  const handleContinue = () => {
    if (selected === "snake" && step === "organism") {
      setStep("snake_sub");
      return;
    }

    const typeParam = selected === "snake" ? snakeSubType || "cobra" : selected;
    router.push(`/symptoms?type=${typeParam}`);
  };

  const canContinue =
    step === "organism" ? !!selected : selected !== "snake" || !!snakeSubType;

  if (step === "snake_sub") {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => setStep("organism")}
              activeOpacity={0.7}
            >
              <MaterialIcons name="arrow-back" size={20} color="#6B7280" />
              <Text style={styles.backText}>Back to Organism</Text>
            </TouchableOpacity>

            <Text style={styles.breadcrumb}>ASSESS › SNAKE TYPE</Text>
            <Text style={styles.title}>
              Snake{" "}
              <Text style={{ color: "#6B7280" }}>Classification</Text>
            </Text>
            <Text style={styles.subtitle}>
              Select the specific snake species for accurate symptom and severity mapping.
            </Text>

            {snakeSubTypes.map((item) => {
              const isSelected = snakeSubType === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.snakeCard, isSelected && { borderColor: item.color, backgroundColor: item.bgColor }]}
                  onPress={() => setSnakeSubType(item.key)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.snakeIconBox, { backgroundColor: isSelected ? item.color : "#F3F4F6" }]}>
                    <MaterialIcons
                      name={item.icon as any}
                      size={28}
                      color={isSelected ? "#fff" : "#6B7280"}
                    />
                  </View>
                  <View style={styles.snakeContent}>
                    <Text style={[styles.snakeLabel, isSelected && { color: item.color }]}>
                      {item.label}
                    </Text>
                    <Text style={styles.snakeSub}>{item.sub}</Text>
                    <Text style={styles.snakeDesc}>{item.description}</Text>
                  </View>
                  {isSelected && (
                    <MaterialIcons name="check-circle" size={22} color={item.color} />
                  )}
                </TouchableOpacity>
              );
            })}

            {/* Info Box */}
            <View style={styles.infoBox}>
              <MaterialIcons name="info" size={18} color="#C45E3D" />
              <Text style={styles.infoText}>
                If species is unknown, select based on dominant symptoms: fang marks + hood = Cobra, 
                severe swelling + bleeding = Viper, minimal local + paralysis = Krait.
              </Text>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.continueBtn, !snakeSubType && styles.continueBtnDisabled]}
              onPress={handleContinue}
              disabled={!snakeSubType}
              activeOpacity={0.8}
            >
              <Text style={styles.continueText}>Continue to Symptom Assessment</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.breadcrumb}>ASSESS › BITE TYPE</Text>
          <Text style={styles.title}>
            Identify the{" "}
            <Text style={{ color: "#6B7280" }}>Organism</Text>
          </Text>
          <Text style={styles.subtitle}>
            Select the source of toxic exposure for clinical diagnosis.
          </Text>

          <View style={styles.grid}>
            {organisms.map((item) => {
              const isSelected = selected === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.card, isSelected && styles.cardSelected]}
                  onPress={() => setSelected(item.key)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconBox, isSelected && styles.iconBoxSelected]}>
                    <MaterialIcons
                      name={item.icon as any}
                      size={28}
                      color={isSelected ? "#C45E3D" : "#6B7280"}
                    />
                  </View>
                  <Text style={styles.cardTitle}>{item.label}</Text>
                  <Text style={styles.cardSub}>{item.sub}</Text>
                  {item.key === "snake" && isSelected && (
                    <View style={styles.subTypeBadge}>
                      <Text style={styles.subTypeBadgeText}>3 sub-types →</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}

            {/* Other Animal */}
            <TouchableOpacity
              style={[styles.card, styles.otherCard]}
              onPress={() => setSelected("animal")}
              activeOpacity={0.7}
            >
              <View style={styles.otherRow}>
                <View style={[styles.iconBox, selected === "animal" && styles.iconBoxSelected]}>
                  <MaterialIcons name="warning" size={28} color={selected === "animal" ? "#C45E3D" : "#6B7280"} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.cardTitle}>Other Animal Bite</Text>
                  <Text style={styles.cardSub}>Anya Pashu Dansha</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueText}>
              {selected === "snake" ? "Select Snake Type →" : "Continue Assessment"}
            </Text>
            <MaterialIcons
              name={selected === "snake" ? "arrow-forward" : "arrow-forward"}
              size={20}
              color="#fff"
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAF5" },
  scrollContent: { padding: 20, paddingBottom: 100 },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 },
  backText: { fontSize: 14, color: "#6B7280", fontWeight: "600" },
  breadcrumb: { marginTop: 8, fontSize: 11, fontWeight: "700", color: "#9CA3AF", letterSpacing: 0.5 },
  title: { fontSize: 28, fontWeight: "800", marginTop: 10, color: "#1F2937" },
  subtitle: { color: "#6B7280", marginTop: 8, marginBottom: 24, fontSize: 14 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardSelected: { borderColor: "#C45E3D", backgroundColor: "#FFF4EE" },
  iconBox: {
    width: 56, height: 56, borderRadius: 16,
    backgroundColor: "#F3F4F6",
    justifyContent: "center", alignItems: "center", marginBottom: 12,
  },
  iconBoxSelected: { backgroundColor: "#FDEAD7" },
  cardTitle: { fontWeight: "700", fontSize: 15, color: "#1F2937", marginBottom: 2 },
  cardSub: { fontSize: 12, color: "#9CA3AF", fontStyle: "italic" },
  subTypeBadge: {
    marginTop: 6,
    backgroundColor: "#C45E3D",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  subTypeBadgeText: { fontSize: 10, color: "#fff", fontWeight: "700" },
  otherCard: { width: "100%" },
  otherRow: { flexDirection: "row", alignItems: "center", width: "100%" },
  // Snake sub-type cards
  snakeCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    gap: 14,
  },
  snakeIconBox: {
    width: 52, height: 52, borderRadius: 14,
    justifyContent: "center", alignItems: "center",
  },
  snakeContent: { flex: 1 },
  snakeLabel: { fontSize: 17, fontWeight: "800", color: "#1F2937", marginBottom: 2 },
  snakeSub: { fontSize: 12, color: "#6B7280", fontStyle: "italic", marginBottom: 4 },
  snakeDesc: { fontSize: 12, color: "#9CA3AF", lineHeight: 16 },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFF4EE",
    borderWidth: 1,
    borderColor: "#FDEAD7",
    borderRadius: 14,
    padding: 14,
    gap: 10,
    marginTop: 8,
  },
  infoText: { flex: 1, fontSize: 12, color: "#C45E3D", lineHeight: 18 },
  footer: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    padding: 20, backgroundColor: "#F9FAF5",
    borderTopWidth: 1, borderTopColor: "#E5E7EB",
  },
  continueBtn: {
    backgroundColor: "#C65F3F",
    padding: 18, borderRadius: 16,
    flexDirection: "row", justifyContent: "center", alignItems: "center",
    shadowColor: "#C65F3F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  continueBtnDisabled: { backgroundColor: "#9CA3AF", shadowOpacity: 0, elevation: 0 },
  continueText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});