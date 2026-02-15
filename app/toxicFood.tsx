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

const foodTypes = [
  { key: "mushroom", label: "Mushroom", sub: "Chatrak Visha", icon: "eco" },
  { key: "seafood", label: "Seafood", sub: "Jalaja Visha", icon: "set-meal" },
  { key: "chemical", label: "Chemical", sub: "Kritrima Visha", icon: "science" },
  { key: "pesticide", label: "Pesticide", sub: "Keeta Nashak", icon: "coronavirus" },
  { key: "spoiled", label: "Spoiled Food", sub: "Dushita Anna", icon: "dangerous" },
  { key: "plant", label: "Toxic Plant", sub: "Sthavara Visha", icon: "local-florist" },
];

export default function ToxicFood() {
  const router = useRouter();
  const [selected, setSelected] = useState("mushroom");

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={{ flex: 1 }}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.breadcrumb}>ASSESS › TOXIC FOOD TYPE</Text>

          <Text style={styles.title}>
            Identify the{" "}
            <Text style={{ color: "#6B7280" }}>Toxic Source</Text>
          </Text>

          <Text style={styles.subtitle}>
            Select the type of toxic food or substance ingested.
          </Text>

          <View style={styles.grid}>
            {foodTypes.map((item) => {
              const isSelected = selected === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[
                    styles.card,
                    isSelected && styles.cardSelected,
                  ]}
                  onPress={() => setSelected(item.key)}
                  activeOpacity={0.7}
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
                      color={isSelected ? "#2E7D32" : "#6B7280"}
                    />
                  </View>

                  <Text style={styles.cardTitle}>{item.label}</Text>
                  <Text style={styles.cardSub}>{item.sub}</Text>
                </TouchableOpacity>
              );
            })}

            {/* Other Toxic Food */}
            <TouchableOpacity 
              style={[styles.card, styles.otherCard]}
              activeOpacity={0.7}
            >
              <View style={styles.otherRow}>
                <View style={styles.iconBox}>
                  <MaterialIcons name="warning" size={28} color="#6B7280" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.cardTitle}>
                    Other Toxic Food
                  </Text>
                  <Text style={styles.cardSub}>
                    Anya Garavisha
                  </Text>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={24}
                  color="#D1D5DB"
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <View style={styles.infoIconBox}>
              <MaterialIcons name="info" size={18} color="#2E7D32" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Garavisha Assessment</Text>
              <Text style={styles.infoText}>
                Ingested poisons require immediate attention. Document the time of
                ingestion and quantity consumed if known.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={() => router.push(`/symptoms?type=${selected}`)}
            activeOpacity={0.8}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAF5",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  breadcrumb: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: "700",
    color: "#9CA3AF",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginTop: 10,
    color: "#1F2937",
  },
  subtitle: {
    color: "#6B7280",
    marginTop: 8,
    marginBottom: 24,
    fontSize: 14,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
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
  cardSelected: {
    borderColor: "#2E7D32",
    backgroundColor: "#F1F8F4",
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  iconBoxSelected: {
    backgroundColor: "#DDF3E4",
  },
  cardTitle: {
    fontWeight: "700",
    fontSize: 15,
    color: "#1F2937",
    marginBottom: 2,
  },
  cardSub: {
    fontSize: 12,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
  otherCard: {
    width: "100%",
  },
  otherRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#F1F8F4",
    padding: 16,
    borderRadius: 18,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#DDF3E4",
  },
  infoIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#DDF3E4",
    justifyContent: "center",
    alignItems: "center",
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontWeight: "700",
    color: "#2E7D32",
    marginBottom: 4,
    fontSize: 14,
  },
  infoText: {
    fontSize: 12,
    color: "#2E7D32",
    lineHeight: 17,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "#F9FAF5",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  continueBtn: {
    backgroundColor: "#2E7D32",
    padding: 18,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  continueText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});