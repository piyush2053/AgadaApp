import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Home() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="menu" size={28} color="#C45E3D" />
      </View>

      <View style={styles.centerSection}>
        <View style={styles.logoBox}>
          <MaterialIcons name="medical-services" size={36} color="#fff" />
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
        >
          <MaterialIcons name="person" size={28} color="#C45E3D" />
          <View style={{ marginLeft: 15 }}>
            <Text style={styles.cardTitle}>Patient / Self Diagnosis</Text>
            <Text style={styles.cardSub}>
              Assess symptoms and toxic exposure
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/identity")}
        >
          <MaterialIcons name="medical-information" size={28} color="#2D5A27" />
          <View style={{ marginLeft: 15 }}>
            <Text style={styles.cardTitle}>Doctor / Professional Use</Text>
            <Text style={styles.cardSub}>
              Clinical evaluation tools
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => router.push("/identity")}
      >
        <Text style={styles.primaryButtonText}>
          Start New Diagnosis
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F3E1",
    padding: 20,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "flex-end",
  },
  centerSection: {
    alignItems: "center",
  },
  logoBox: {
    backgroundColor: "#C45E3D",
    width: 70,
    height: 70,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
  },
  primary: {
    color: "#C45E3D",
  },
  subtitle: {
    textAlign: "center",
    marginTop: 10,
    color: "#555",
  },
  cardSection: {
    gap: 15,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
  },
  cardTitle: {
    fontWeight: "700",
  },
  cardSub: {
    color: "#666",
    fontSize: 12,
  },
  primaryButton: {
    backgroundColor: "#C45E3D",
    padding: 18,
    borderRadius: 40,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
});
