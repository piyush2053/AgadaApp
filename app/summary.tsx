import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export default function Summary() {
    const { type, symptoms } = useLocalSearchParams();
    const [notes, setNotes] = useState("");

    const parsedSymptoms = symptoms
        ? JSON.parse(symptoms as string)
        : [];

    const totalSymptoms = parsedSymptoms.length;

    const severityScore =
        totalSymptoms > 0
            ? (
                parsedSymptoms.reduce(
                    (sum: number, s: any) => sum + (s.severity || 1),
                    0
                ) /
                (3 * totalSymptoms)
            ) *
            10
            : 0;

    // 🔥 PDF GENERATION FUNCTION
    const generatePDF = async () => {
        const htmlContent = `
      <html>
        <body style="font-family: Arial; padding: 20px;">
          <h2>Clinical Summary Report</h2>
          <hr/>
          <h3>Exposure Type:</h3>
          <p>${type}</p>

          <h3>Total Symptoms:</h3>
          <p>${totalSymptoms}</p>

          <h3>Severity Index:</h3>
          <p>${severityScore.toFixed(1)} / 10</p>

          <h3>Key Observations:</h3>
          <ul>
            ${parsedSymptoms
                .map(
                    (s: any) =>
                        `<li>${s.symptom} (Severity: ${s.severity})</li>`
                )
                .join("")}
          </ul>

          <h3>Clinical Notes:</h3>
          <p>${notes || "N/A"}</p>

          <br/>
          <p>Generated on: ${new Date().toLocaleString()}</p>
        </body>
      </html>
    `;

        try {
            const { uri } = await Print.printToFileAsync({
                html: htmlContent,
            });

            await Sharing.shareAsync(uri);
        } catch (error) {
            Alert.alert("Error", "Failed to generate PDF");
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 160 }}>
                <Text style={styles.title}>Clinical Summary</Text>

                {/* Patient Profile */}
                <View style={styles.card}>
                    <Text style={styles.cardLabel}>PATIENT PROFILE</Text>
                    <Text style={styles.cardTitle}>
                        Selected Exposure Case
                    </Text>

                    <View style={styles.rowBetween}>
                        <View>
                            <Text style={styles.smallLabel}>
                                Total Symptoms
                            </Text>
                            <Text style={styles.value}>
                                {totalSymptoms}
                            </Text>
                        </View>

                        <View>
                            <Text style={styles.smallLabel}>
                                Case Type
                            </Text>
                            <Text style={styles.value}>
                                {type?.toString().toUpperCase()}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Exposure Details */}
                <View style={styles.card}>
                    <Text style={styles.cardLabel}>
                        EXPOSURE DETAILS
                    </Text>
                    <Text style={styles.cardTitle}>
                        {type} Bite Assessment
                    </Text>
                </View>

                {/* Clinical Findings */}
                <View style={styles.card}>
                    <Text style={styles.cardLabel}>
                        CLINICAL FINDINGS
                    </Text>

                    <View style={styles.metricsRow}>
                        <View style={styles.metricBox}>
                            <Text style={styles.metricLabel}>
                                TOTAL SYMPTOMS
                            </Text>
                            <Text style={styles.metricValue}>
                                {totalSymptoms}
                            </Text>
                        </View>

                        <View
                            style={[
                                styles.metricBox,
                                { backgroundColor: "#FEE2E2" },
                            ]}
                        >
                            <Text style={[styles.metricLabel, { color: "#DC2626" }]}>
                                SEVERITY INDEX
                            </Text>
                            <Text
                                style={[
                                    styles.metricValue,
                                    { color: "#DC2626" },
                                ]}
                            >
                                {severityScore.toFixed(1)}/10
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.smallLabel}>
                        KEY OBSERVATIONS
                    </Text>

                    <View style={styles.chipContainer}>
                        {parsedSymptoms.map((s: any, index: number) => (
                            <View key={index} style={styles.chip}>
                                <Text style={styles.chipText}>
                                    {s.symptom}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Clinical Impression */}
                <View>
                    <Text style={styles.sectionTitle}>
                        Clinical Impression & Notes
                    </Text>

                    <TextInput
                        multiline
                        placeholder="Type clinical observations, visha vega assessment, and planned Agada Tantra protocol..."
                        style={styles.notesInput}
                        value={notes}
                        onChangeText={setNotes}
                    />
                </View>
            </ScrollView>

            {/* Bottom Buttons */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.printBtn} onPress={generatePDF}>
                    <MaterialIcons
                        name="print"
                        size={18}
                        color="#C65D3B"
                    />
                    <Text style={styles.printText}>
                        Print Summary Report
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.pdfBtn} onPress={generatePDF}>
                    <MaterialIcons
                        name="picture-as-pdf"
                        size={18}
                        color="#fff"
                    />
                    <Text style={styles.pdfText}>
                        Export PDF Case File
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F2F4E6",
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "800",
        marginTop: 20,
        marginBottom: 15,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
    },
    cardLabel: {
        fontSize: 10,
        fontWeight: "700",
        color: "#9CA3AF",
        marginBottom: 5,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 15,
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    smallLabel: {
        fontSize: 11,
        fontWeight: "700",
        color: "#9CA3AF",
        marginBottom: 5,
    },
    value: {
        fontSize: 14,
        fontWeight: "700",
    },
    metricsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
    },
    metricBox: {
        flex: 1,
        backgroundColor: "#F3F4F6",
        padding: 15,
        borderRadius: 15,
        marginRight: 10,
        alignItems: "center",
    },
    metricLabel: {
        fontSize: 10,
        fontWeight: "700",
        color: "#6B7280",
    },
    metricValue: {
        fontSize: 22,
        fontWeight: "800",
        marginTop: 5,
    },
    chipContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    chip: {
        backgroundColor: "#E5E7EB",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
    },
    chipText: {
        fontSize: 12,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "700",
        marginBottom: 8,
    },
    notesInput: {
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 15,
        height: 120,
        textAlignVertical: "top",
    },
    footer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        padding: 20,
        backgroundColor: "#F2F4E6",
    },
    printBtn: {
        borderWidth: 2,
        borderColor: "#C65D3B",
        padding: 15,
        borderRadius: 15,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 10,
    },
    printText: {
        color: "#C65D3B",
        fontWeight: "700",
        marginLeft: 8,
    },
    pdfBtn: {
        backgroundColor: "#2563EB",
        padding: 15,
        borderRadius: 15,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
    },
    pdfText: {
        color: "#fff",
        fontWeight: "700",
        marginLeft: 8,
    },
});