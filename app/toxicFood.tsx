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

const organisms = [
  { key: "snake", label: "Snake", sub: "Sarpa", icon: "pest-control-rodent" },
  { key: "scorpion", label: "Scorpion", sub: "Vruschika", icon: "bug-report" },
  { key: "spider", label: "Spider", sub: "Luta", icon: "category" },
  { key: "insect", label: "Insect", sub: "Keeta", icon: "flutter-dash" },
  { key: "dog", label: "Dog", sub: "Shwana", icon: "pets" },
  { key: "rat", label: "Rat", sub: "Mushika", icon: "mouse" },
];

export default function Bite() {
  const router = useRouter();
  const [selected, setSelected] = useState("snake");

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Text style={styles.breadcrumb}>ASSESS › TOXIC TYPE</Text>

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
                style={[
                  styles.card,
                  isSelected && styles.cardSelected,
                ]}
                onPress={() => setSelected(item.key)}
              >
                <View
                  style={[
                    styles.iconBox,
                    isSelected && styles.iconBoxSelected,
                  ]}
                >
                  <MaterialIcons
                    name={item.icon as any}
                    size={28}
                    color={isSelected ? "#3B82F6" : "#6B7280"}
                  />
                </View>

                <Text style={styles.cardTitle}>{item.label}</Text>
                <Text style={styles.cardSub}>{item.sub}</Text>
              </TouchableOpacity>
            );
          })}

          {/* Other Animal */}
          <TouchableOpacity style={[styles.card, { width: "100%" }]}>
            <View style={styles.otherRow}>
              <View style={styles.iconBox}>
                <MaterialIcons name="warning" size={28} color="#6B7280" />
              </View>
              <View>
                <Text style={styles.cardTitle}>
                  Other Animal Bite
                </Text>
                <Text style={styles.cardSub}>
                  Anya Pashu Dansha
                </Text>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={24}
                color="#ccc"
                style={{ marginLeft: "auto" }}
              />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() =>
            router.push(`/symptoms?type=${selected}`)
          }
        >
          <Text style={styles.continueText}>
            Continue Assessment
          </Text>
          <MaterialIcons
            name="arrow-forward"
            size={20}
            color="#fff"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAF5",
    paddingHorizontal: 20,
  },
  breadcrumb: {
    marginTop: 20,
    fontSize: 10,
    fontWeight: "700",
    color: "#9CA3AF",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginTop: 10,
  },
  subtitle: {
    color: "#6B7280",
    marginTop: 8,
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 20,
    marginBottom: 15,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  cardSelected: {
    borderColor: "#3B82F6",
    backgroundColor: "#EFF6FF",
  },
  iconBox: {
    width: 55,
    height: 55,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  iconBoxSelected: {
    backgroundColor: "#DBEAFE",
  },
  cardTitle: {
    fontWeight: "700",
  },
  cardSub: {
    fontSize: 12,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
  otherRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 20,
    backgroundColor: "#F9FAF5",
  },
  continueBtn: {
    backgroundColor: "#C65F3F",
    padding: 18,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  continueText: {
    color: "#fff",
    fontWeight: "700",
  },
});
