import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <MaterialIcons name="menu" size={28} color="#C45E3D" />
      </View>

      <View style={styles.centerSection}>
        <View style={styles.logoBox}>
          <MaterialIcons name="medical-services" size={40} color="#fff" />
        </View>

        <Text style={styles.title}>
          Agada Tantra{"\n"}
          <Text style={styles.primary}>Parikshika</Text>
        </Text>

        <Text style={styles.subtitle}>
          Expert Ayurvedic Toxicology Diagnosis at your fingertips.
        </Text>
      </View>

      <View style={styles.cardSection}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/identity")}
          activeOpacity={0.7}
        >
          <View style={[styles.iconCircle, { backgroundColor: "#FDEAD7" }]}>
            <MaterialIcons name="person" size={24} color="#C45E3D" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Patient / Self Diagnosis</Text>
            <Text style={styles.cardSub}>
              Assess symptoms and toxic exposure
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/identity")}
          activeOpacity={0.7}
        >
          <View style={[styles.iconCircle, { backgroundColor: "#DDF3E4" }]}>
            <MaterialIcons name="medical-information" size={24} color="#2D5A27" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Doctor / Professional Use</Text>
            <Text style={styles.cardSub}>
              Clinical evaluation tools
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => router.push("/identity")}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryButtonText}>
          Start New Diagnosis
        </Text>
        <MaterialIcons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F3E1",
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "flex-end",
    paddingVertical: 12,
  },
  centerSection: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 60,
  },
  logoBox: {
    backgroundColor: "#C45E3D",
    width: 80,
    height: 80,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 38,
  },
  primary: {
    color: "#C45E3D",
  },
  subtitle: {
    textAlign: "center",
    marginTop: 12,
    color: "#6B7280",
    fontSize: 14,
    paddingHorizontal: 20,
  },
  cardSection: {
    gap: 12,
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 2,
  },
  cardSub: {
    color: "#6B7280",
    fontSize: 12,
  },
  primaryButton: {
    backgroundColor: "#C45E3D",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#C45E3D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});