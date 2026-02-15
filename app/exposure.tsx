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
      title: "Bite",
      description: "Animal bites, insect stings, snake envenomation (Sarpavisha)",
      icon: "bug-report",
      bgColor: "#FDEAD7",
      iconColor: "#C05E41",
    },
    {
      key: "toxic-food",
      route: "/toxicFood",
      title: "Toxic Food",
      description: "Ingested poisons, contaminated food (Garavisha), or chemicals",
      icon: "restaurant",
      bgColor: "#DDF3E4",
      iconColor: "#2E7D32",
    },
    {
      key: "external",
      route: "/exposure", // Update this when external contact screen is created
      title: "External Contact",
      description: "Skin contact, irritants, or topical toxic substances",
      icon: "pan-tool-alt",
      bgColor: "#DDE7F5",
      iconColor: "#2962FF",
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Exposure Type</Text>
        <Text style={styles.subtitle}>
          Select the primary cause of clinical presentation to start assessment.
        </Text>

        {exposureTypes.map((type:any) => (
          <TouchableOpacity
            key={type.key}
            style={styles.card}
            onPress={() => router.push(type.route)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBox, { backgroundColor: type.bgColor }]}>
              <MaterialIcons 
                name={type.icon as any} 
                size={28} 
                color={type.iconColor} 
              />
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{type.title}</Text>
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
            <Text style={styles.triageTitle}>Clinical Triage</Text>
            <Text style={styles.triageText}>
              Selecting the correct exposure type will load the relevant
              assessment protocols and specialized diagnostic tools.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8F1",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
    color: "#1F2937",
  },
  subtitle: {
    color: "#6B7280",
    marginBottom: 24,
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
    marginLeft: 14,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 4,
    color: "#1F2937",
  },
  cardDesc: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
  triageBox: {
    flexDirection: "row",
    backgroundColor: "#FFF4EE",
    padding: 16,
    borderRadius: 18,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#FFE4D6",
  },
  triageIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FFE4D6",
    justifyContent: "center",
    alignItems: "center",
  },
  triageContent: {
    flex: 1,
    marginLeft: 12,
  },
  triageTitle: {
    fontWeight: "700",
    color: "#C05E41",
    marginBottom: 4,
    fontSize: 14,
  },
  triageText: {
    fontSize: 13,
    color: "#C05E41",
    lineHeight: 18,
  },
});