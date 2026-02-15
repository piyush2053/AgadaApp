import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/home");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoBox}>
          <MaterialIcons name="medical-services" size={48} color="#fff" />
        </View>
        
        <Text style={styles.title}>AGADA APP</Text>
        <Text style={styles.subtitle}>Ayurvedic Toxicology Clinical Tool</Text>
        
        <ActivityIndicator 
          size="large" 
          color="#C45E3D" 
          style={styles.loader}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F3E1",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logoBox: {
    backgroundColor: "#C45E3D",
    width: 90,
    height: 90,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1F2937",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 8,
  },
  loader: {
    marginTop: 32,
  },
});