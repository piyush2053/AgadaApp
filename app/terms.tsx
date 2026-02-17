import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TermsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>1. Introduction</Text>
        <Text style={styles.text}>
          This is a dummy Terms & Conditions page for the Agada Tantra Parikshika app. 
          The content here is for demonstration purposes only and should be replaced 
          with legally reviewed terms before publishing the app.
        </Text>

        <Text style={styles.sectionTitle}>2. Use of the App</Text>
        <Text style={styles.text}>
          This application is intended to assist with preliminary assessment and 
          educational purposes only. It does not replace professional medical advice, 
          diagnosis, or treatment. Always consult a qualified healthcare professional.
        </Text>

        <Text style={styles.sectionTitle}>3. Data & Privacy</Text>
        <Text style={styles.text}>
          Any data entered into the app is stored locally on your device unless stated 
          otherwise. The developers are not responsible for data loss, misuse, or 
          unauthorized access.
        </Text>

        <Text style={styles.sectionTitle}>4. Liability</Text>
        <Text style={styles.text}>
          The app and its content are provided "as is" without any warranties. The 
          developers shall not be liable for any damages arising from the use or 
          inability to use this application.
        </Text>

        <Text style={styles.sectionTitle}>5. Changes to Terms</Text>
        <Text style={styles.text}>
          These terms may be updated from time to time. Continued use of the app after 
          changes means you accept the updated terms.
        </Text>

        <Text style={styles.footerNote}>
          This is a sample Terms & Conditions page. Please replace this with your real, 
          legally approved content before releasing the app.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F3E1",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "800",
    color: "#1F2937",
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#C45E3D",
    marginBottom: 6,
    marginTop: 16,
  },
  text: {
    fontSize: 13,
    lineHeight: 20,
    color: "#374151",
  },
  footerNote: {
    marginTop: 24,
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
});
