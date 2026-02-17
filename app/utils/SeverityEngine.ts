// ============================================================
// AGADA SANJEEVINI — Severity Engine
// Algorithm: presentCount / totalPossibleSymptoms × 100
// ============================================================

export type SeverityLevel = "Mild" | "Moderate" | "Alarming" | "Severe Complicated";

export type SeverityResult = {
  percentage: number;
  level: SeverityLevel;
  color: string;
  bgColor: string;
  description: string;
  recommendation: string;
};

/**
 * Core severity calculation per document specification:
 * percentage = (presentCount / totalPossibleSymptoms) × 100
 *
 * Classification:
 * < 50%     → Mild
 * 50–69%    → Moderate
 * 70–80%    → Alarming High
 * 80–100%   → Severe Complicated
 */
export function calculateSeverity(
  presentCount: number,
  totalPossibleSymptoms: number
): SeverityResult {
  if (totalPossibleSymptoms === 0) {
    return {
      percentage: 0,
      level: "Mild",
      color: "#059669",
      bgColor: "#D1FAE5",
      description: "No symptoms recorded",
      recommendation: "Continue monitoring. No toxic exposure confirmed.",
    };
  }

  const percentage = (presentCount / totalPossibleSymptoms) * 100;

  if (percentage >= 80) {
    return {
      percentage,
      level: "Severe Complicated",
      color: "#DC2626",
      bgColor: "#FEE2E2",
      description: "Critical toxicity. Immediate emergency intervention required.",
      recommendation: "Immediate hospitalization. Administer antivenom / specific antidote. ICU monitoring required.",
    };
  } else if (percentage >= 70) {
    return {
      percentage,
      level: "Alarming",
      color: "#EA580C",
      bgColor: "#FFEDD5",
      description: "High severity. Urgent medical attention required.",
      recommendation: "Urgent hospital admission. Initiate Agada Tantra protocol. Monitor vitals continuously.",
    };
  } else if (percentage >= 50) {
    return {
      percentage,
      level: "Moderate",
      color: "#D97706",
      bgColor: "#FEF3C7",
      description: "Moderate toxicity. Close observation and treatment needed.",
      recommendation: "Hospital observation. Symptomatic treatment. Evaluate for specific Agada Chikitsa.",
    };
  } else {
    return {
      percentage,
      level: "Mild",
      color: "#059669",
      bgColor: "#D1FAE5",
      description: "Mild exposure. Monitor closely.",
      recommendation: "Outpatient care. Basic detoxification measures. Follow-up in 24 hours.",
    };
  }
}

/**
 * Calculate severity from Gara Visha questionnaire (yes/no)
 * Score = (yes count / 10) × 100
 */
export function calculateGaraVishaSeverity(yesCount: number): SeverityResult {
  return calculateSeverity(yesCount, 10);
}

/**
 * Calculate severity from Dushi Visha questionnaire (yes/no)
 * Score = (yes count / 10) × 100
 */
export function calculateDushiVishaSeverity(yesCount: number): SeverityResult {
  return calculateSeverity(yesCount, 10);
}

/**
 * Calculate Virruddha Aahara severity from frequency scores
 * Max score = 10 items × 4 (Daily) = 40
 */
export function calculateVirruddhaAaharaSeverity(totalFrequencyScore: number): SeverityResult {
  const maxScore = 40; // 10 items × max 4 each
  return calculateSeverity(totalFrequencyScore, maxScore);
}

/**
 * Get a grading description for individual symptom grading (1-10)
 */
export function getSymptomGradeLabel(grade: number): string {
  if (grade <= 2) return "Minimal";
  if (grade <= 4) return "Mild";
  if (grade <= 6) return "Moderate";
  if (grade <= 8) return "Severe";
  return "Critical";
}

export function getSymptomGradeColor(grade: number): string {
  if (grade <= 2) return "#6EE7B7";
  if (grade <= 4) return "#86EFAC";
  if (grade <= 6) return "#FCD34D";
  if (grade <= 8) return "#F97316";
  return "#EF4444";
}