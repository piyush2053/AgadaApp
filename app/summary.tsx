import { MaterialIcons } from "@expo/vector-icons";
import * as Print from "expo-print";
import { useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Summary() {
  const { type, symptoms } = useLocalSearchParams();
  const [notes, setNotes] = useState("");

  const parsedSymptoms = symptoms ? JSON.parse(symptoms as string) : [];
  const totalSymptoms = parsedSymptoms.length;

  const severityScore =
    totalSymptoms > 0
      ? (parsedSymptoms.reduce(
          (sum: number, s: any) => sum + (s.severity || 1),
          0
        ) /
          (3 * totalSymptoms)) *
        10
      : 0;

  const getSeverityColor = (score: number) => {
    if (score >= 7) return { bg: "#FEE2E2", text: "#DC2626" };
    if (score >= 4) return { bg: "#FEF3C7", text: "#D97706" };
    return { bg: "#D1FAE5", text: "#059669" };
  };

  const severityColors = getSeverityColor(severityScore);

  // PDF GENERATION FUNCTION
  const generatePDF = async () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: 'Helvetica Neue', Arial, sans-serif;
              padding: 30px;
              color: #1F2937;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #C45E3D;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #C45E3D;
              margin: 0 0 10px 0;
              font-size: 28px;
            }
            .header p {
              color: #6B7280;
              margin: 5px 0;
            }
            .section {
              margin-bottom: 25px;
              padding: 20px;
              background: #F9FAFB;
              border-radius: 12px;
              border-left: 4px solid #C45E3D;
            }
            .section h3 {
              color: #1F2937;
              margin: 0 0 12px 0;
              font-size: 18px;
            }
            .section p {
              margin: 8px 0;
              color: #374151;
            }
            .metrics {
              display: flex;
              justify-content: space-around;
              margin: 20px 0;
              gap: 15px;
            }
            .metric-box {
              flex: 1;
              background: white;
              padding: 20px;
              border-radius: 12px;
              text-align: center;
              border: 2px solid #E5E7EB;
            }
            .metric-label {
              font-size: 11px;
              color: #6B7280;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .metric-value {
              font-size: 32px;
              font-weight: bold;
              color: #1F2937;
              margin-top: 8px;
            }
            .severity-high .metric-value { color: #DC2626; }
            .symptoms-list {
              list-style: none;
              padding: 0;
            }
            .symptoms-list li {
              background: white;
              padding: 12px 16px;
              margin-bottom: 8px;
              border-radius: 8px;
              border-left: 3px solid #3B82F6;
            }
            .symptom-name {
              font-weight: 600;
              color: #1F2937;
            }
            .symptom-severity {
              color: #6B7280;
              font-size: 13px;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #E5E7EB;
              text-align: center;
              color: #6B7280;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🏥 Clinical Summary Report</h1>
            <p>Agada Tantra Parikshika</p>
            <p>Ayurvedic Toxicology Assessment</p>
          </div>

          <div class="section">
            <h3>📋 Exposure Information</h3>
            <p><strong>Exposure Type:</strong> ${type || "Not specified"}</p>
            <p><strong>Assessment Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Assessment Time:</strong> ${new Date().toLocaleTimeString()}</p>
          </div>

          <div class="metrics">
            <div class="metric-box">
              <div class="metric-label">Total Symptoms</div>
              <div class="metric-value">${totalSymptoms}</div>
            </div>
            <div class="metric-box severity-high">
              <div class="metric-label">Severity Index</div>
              <div class="metric-value">${severityScore.toFixed(1)}/10</div>
            </div>
          </div>

          <div class="section">
            <h3>🔍 Observed Symptoms</h3>
            ${
              parsedSymptoms.length > 0
                ? `
              <ul class="symptoms-list">
                ${parsedSymptoms
                  .map(
                    (s: any) => `
                  <li>
                    <span class="symptom-name">${s.symptom}</span><br>
                    <span class="symptom-severity">Severity: Level ${s.severity} of 3</span>
                  </li>
                `
                  )
                  .join("")}
              </ul>
            `
                : "<p>No symptoms recorded</p>"
            }
          </div>

          <div class="section">
            <h3>📝 Clinical Notes & Impression</h3>
            <p>${notes || "No additional notes provided"}</p>
          </div>

          <div class="footer">
            <p>Generated on: ${new Date().toLocaleString()}</p>
            <p>Agada Tantra Parikshika • Ayurvedic Toxicology Clinical Tool</p>
          </div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: "Clinical Summary Report",
          UTI: "com.adobe.pdf",
        });
      } else {
        Alert.alert("Success", "PDF generated successfully!");
      }
    } catch (error) {
      console.error("PDF generation error:", error);
      Alert.alert("Error", "Failed to generate PDF. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={100}
      >
        <View style={{ flex: 1 }}>
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.headerSection}>
              <MaterialIcons name="check-circle" size={48} color="#10B981" />
              <Text style={styles.title}>Clinical Summary</Text>
              <Text style={styles.headerSubtitle}>
                Assessment completed successfully
              </Text>
            </View>

            {/* Patient Profile */}
            <View style={styles.card}>
              <Text style={styles.cardLabel}>PATIENT PROFILE</Text>
              <Text style={styles.cardTitle}>Exposure Case Assessment</Text>

              <View style={styles.rowBetween}>
                <View style={styles.infoBlock}>
                  <Text style={styles.smallLabel}>Total Symptoms</Text>
                  <Text style={styles.value}>{totalSymptoms}</Text>
                </View>

                <View style={styles.infoBlock}>
                  <Text style={styles.smallLabel}>Case Type</Text>
                  <Text style={styles.value}>
                    {type?.toString().toUpperCase() || "N/A"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Exposure Details */}
            <View style={styles.card}>
              <Text style={styles.cardLabel}>EXPOSURE DETAILS</Text>
              <Text style={styles.cardTitle}>
                {type || "Unknown"} Exposure Assessment
              </Text>
              <Text style={styles.timestamp}>
                Assessed on {new Date().toLocaleDateString()} at{" "}
                {new Date().toLocaleTimeString()}
              </Text>
            </View>

            {/* Clinical Findings */}
            <View style={styles.card}>
              <Text style={styles.cardLabel}>CLINICAL FINDINGS</Text>

              <View style={styles.metricsRow}>
                <View style={styles.metricBox}>
                  <Text style={styles.metricLabel}>TOTAL SYMPTOMS</Text>
                  <Text style={styles.metricValue}>{totalSymptoms}</Text>
                </View>

                <View
                  style={[
                    styles.metricBox,
                    { backgroundColor: severityColors.bg },
                  ]}
                >
                  <Text
                    style={[
                      styles.metricLabel,
                      { color: severityColors.text },
                    ]}
                  >
                    SEVERITY INDEX
                  </Text>
                  <Text
                    style={[
                      styles.metricValue,
                      { color: severityColors.text },
                    ]}
                  >
                    {severityScore.toFixed(1)}/10
                  </Text>
                </View>
              </View>

              {parsedSymptoms.length > 0 && (
                <>
                  <Text style={styles.smallLabel}>KEY OBSERVATIONS</Text>
                  <View style={styles.chipContainer}>
                    {parsedSymptoms.map((s: any, index: number) => (
                      <View key={index} style={styles.chip}>
                        <Text style={styles.chipText}>{s.symptom}</Text>
                        <View
                          style={[
                            styles.severityDot,
                            {
                              backgroundColor:
                                s.severity === 3
                                  ? "#EF4444"
                                  : s.severity === 2
                                  ? "#F59E0B"
                                  : "#10B981",
                            },
                          ]}
                        />
                      </View>
                    ))}
                  </View>
                </>
              )}
            </View>

            {/* Clinical Impression */}
            <View style={styles.notesSection}>
              <Text style={styles.sectionTitle}>
                Clinical Impression & Notes
              </Text>

              <TextInput
                multiline
                placeholder="Type clinical observations, visha vega assessment, and planned Agada Tantra protocol..."
                placeholderTextColor="#9CA3AF"
                style={styles.notesInput}
                value={notes}
                onChangeText={setNotes}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          {/* Bottom Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.printBtn}
              onPress={generatePDF}
              activeOpacity={0.7}
            >
              <MaterialIcons name="print" size={18} color="#C65D3B" />
              <Text style={styles.printText}>Print Summary Report</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.pdfBtn}
              onPress={generatePDF}
              activeOpacity={0.8}
            >
              <MaterialIcons name="picture-as-pdf" size={18} color="#fff" />
              <Text style={styles.pdfText}>Export PDF Case File</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F4E6",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 140,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    marginTop: 12,
    color: "#1F2937",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#9CA3AF",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#1F2937",
  },
  timestamp: {
    fontSize: 12,
    color: "#6B7280",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoBlock: {
    flex: 1,
  },
  smallLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9CA3AF",
    marginBottom: 6,
    marginTop: 12,
  },
  value: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },
  metricsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  metricBox: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#6B7280",
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "800",
    marginTop: 6,
    color: "#1F2937",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  chip: {
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },
  severityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  notesSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
    color: "#1F2937",
  },
  notesInput: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    height: 120,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 20 : 20,
    backgroundColor: "#F2F4E6",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  printBtn: {
    borderWidth: 2,
    borderColor: "#C65D3B",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  printText: {
    color: "#C65D3B",
    fontWeight: "700",
    marginLeft: 8,
    fontSize: 15,
  },
  pdfBtn: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  pdfText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 8,
    fontSize: 15,
  },
});