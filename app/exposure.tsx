import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Exposure() {
  const router = useRouter();

  const exposureTypes = [
    {
      key: "bite",
      route: "/bite",
      title: "Bite / Sting",
      titleSanskrit: "Dansha Visha",
      description: "Animal bites, insect stings, snake envenomation. Includes Cobra, Viper, Krait, Scorpion, Dog, Rat.",
      icon: "bug-report",
      bgColor: "#FDEAD7",
      iconColor: "#C05E41",
    },
    {
      key: "toxic-food",
      route: "/toxicFood",
      title: "Toxic Food / Ingestion",
      titleSanskrit: "Garavisha / Ahara Visha",
      description: "Ingested poisons, contaminated food, mushroom, chemical, pesticide, or spoiled food.",
      icon: "restaurant",
      bgColor: "#DDF3E4",
      iconColor: "#2E7D32",
    },
    {
      key: "external",
      route: "/externalContact",
      title: "External Contact",
      titleSanskrit: "Bahya Sparsha Visha",
      description: "Skin, eye, ear, nasal, smoke contact. 12 categories including clothing, bath, fumigation.",
      icon: "pan-tool-alt",
      bgColor: "#DDE7F5",
      iconColor: "#2962FF",
    },
    {
      key: "questionnaire",
      route: "/questionnaire",
      title: "Gara / Dushi Visha",
      titleSanskrit: "Questionnaire Assessment",
      description: "Chronic or residual poisoning via structured Yes/No diagnostic questionnaires.",
      icon: "assignment",
      bgColor: "#F3E8FF",
      iconColor: "#7C3AED",
    },
    {
      key: "virruddha",
      route: "/virruddhaAahara",
      title: "Virruddha Aahara",
      titleSanskrit: "Incompatible Food Scoring",
      description: "Frequency-based scoring of incompatible food combinations causing chronic toxicity.",
      icon: "warning-amber",
      bgColor: "#FEF9C3",
      iconColor: "#CA8A04",
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Exposure Type</Text>
        <Text style={styles.subtitle}>
          Select the primary cause of clinical presentation to begin the assessment.
        </Text>

        {exposureTypes.map((type) => (
          <TouchableOpacity
            key={type.key}
            style={styles.card}
            onPress={() => router.push(type.route as any)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBox, { backgroundColor: type.bgColor }]}>
              <MaterialIcons name={type.icon as any} size={26} color={type.iconColor} />
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{type.title}</Text>
              <Text style={[styles.cardSanskrit, { color: type.iconColor }]}>{type.titleSanskrit}</Text>
              <Text style={styles.cardDesc}>{type.description}</Text>
            </View>

            <MaterialIcons name="chevron-right" size={26} color="#D1D5DB" />
          </TouchableOpacity>
        ))}

        {/* Clinical Triage Info */}
        <View style={styles.triageBox}>
          <View style={styles.triageIconBox}>
            <MaterialIcons name="info" size={20} color="#C05E41" />
          </View>
          <View style={styles.triageContent}>
            <Text style={styles.triageTitle}>Clinical Triage Note</Text>
            <Text style={styles.triageText}>
              Selecting the correct exposure type loads the relevant symptom protocols, 
              grading scales, and Agada Tantra diagnostic tools for that specific visha category.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F8F1" },
  scrollContent: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: "800", marginBottom: 8, color: "#1F2937" },
  subtitle: { color: "#6B7280", marginBottom: 24, fontSize: 14, lineHeight: 20 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 20,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  iconBox: { width: 52, height: 52, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  cardContent: { flex: 1, marginLeft: 14 },
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 2, color: "#1F2937" },
  cardSanskrit: { fontSize: 11, fontStyle: "italic", marginBottom: 4, fontWeight: "600" },
  cardDesc: { fontSize: 12, color: "#6B7280", lineHeight: 17 },
  triageBox: {
    flexDirection: "row",
    backgroundColor: "#FFF4EE",
    padding: 16,
    borderRadius: 18,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#FFE4D6",
  },
  triageIconBox: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: "#FFE4D6", justifyContent: "center", alignItems: "center",
  },
  triageContent: { flex: 1, marginLeft: 12 },
  triageTitle: { fontWeight: "700", color: "#C05E41", marginBottom: 4, fontSize: 14 },
  triageText: { fontSize: 12, color: "#C05E41", lineHeight: 17 },
});