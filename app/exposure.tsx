import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Exposure() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Exposure Type</Text>
      <Text style={styles.subtitle}>
        Select the primary cause of clinical presentation to start assessment.
      </Text>

      {/* Bite Card */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/bite")}
      >
        <View style={[styles.iconBox, { backgroundColor: "#FDEAD7" }]}>
          <MaterialIcons name="bug-report" size={28} color="#C05E41" />
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Bite</Text>
          <Text style={styles.cardDesc}>
            Animal bites, insect stings, snake envenomation (Sarpavisha).
          </Text>
        </View>

        <MaterialIcons name="chevron-right" size={28} color="#ccc" />
      </TouchableOpacity>

      {/* Toxic Food Card */}
      <TouchableOpacity 
        style={styles.card}
        onPress={() => router.push("/toxicFood")}
      >
        <View style={[styles.iconBox, { backgroundColor: "#DDF3E4" }]}>
          <MaterialIcons name="restaurant" size={28} color="#2E7D32" />
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Toxic Food</Text>
          <Text style={styles.cardDesc}>
            Ingested poisons, contaminated food (Garavisha), or chemicals.
          </Text>
        </View>

        <MaterialIcons name="chevron-right" size={28} color="#ccc" />
      </TouchableOpacity>

      {/* External Contact Card */}
      <TouchableOpacity style={styles.card}>
        <View style={[styles.iconBox, { backgroundColor: "#DDE7F5" }]}>
          <MaterialIcons name="pan-tool-alt" size={28} color="#2962FF" />
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>External Contact</Text>
          <Text style={styles.cardDesc}>
            Skin contact, irritants, or topical toxic substances.
          </Text>
        </View>

        <MaterialIcons name="chevron-right" size={28} color="#ccc" />
      </TouchableOpacity>

      {/* Clinical Triage Info */}
      <View style={styles.triageBox}>
        <MaterialIcons name="info" size={22} color="#C05E41" />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.triageTitle}>Clinical Triage</Text>
          <Text style={styles.triageText}>
            Selecting the correct exposure type will load the relevant
            assessment protocols and specialized diagnostic tools.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F7F8F1",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    color: "#6B7280",
    marginBottom: 25,
    fontSize: 14,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 30,
    marginBottom: 20,
    elevation: 2,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
    marginLeft: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 5,
  },
  cardDesc: {
    fontSize: 13,
    color: "#6B7280",
  },
  triageBox: {
    flexDirection: "row",
    backgroundColor: "#FFF4EE",
    padding: 20,
    borderRadius: 25,
    marginTop: 20,
  },
  triageTitle: {
    fontWeight: "700",
    color: "#C05E41",
    marginBottom: 5,
  },
  triageText: {
    fontSize: 13,
    color: "#C05E41",
  },
});
