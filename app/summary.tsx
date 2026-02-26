import { MaterialIcons } from "@expo/vector-icons";
import * as Print from "expo-print";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { useEffect, useState } from "react";
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
import {
  clearDraft,
  getCaseById,
  loadDraft,
  PatientIdentity,
  saveCase,
} from "./utils/StorageService";

export default function Summary() {
  const {
    type,
    symptoms,
    presentCount,
    totalPossible,
    severityLevel,
    severityPercentage,
    caseId,
    readonly,
  } = useLocalSearchParams();

  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [identity, setIdentity] = useState<PatientIdentity | null>(null);
  const [saved, setSaved] = useState(false);
  const [resolvedType, setResolvedType] = useState((type as string) || "");
  const [resolvedSymptoms, setResolvedSymptoms] = useState<any[]>([]);
  const [resolvedPct, setResolvedPct] = useState(
    parseFloat((severityPercentage as string) || "0")
  );
  const [resolvedLevel, setResolvedLevel] = useState(
    (severityLevel as string) || "Mild"
  );
  const [resolvedPresentCount, setResolvedPresentCount] = useState(
    parseInt((presentCount as string) || "0", 10)
  );

  const isReadonly = readonly === "true";

  useEffect(() => {
    if (caseId) {
      getCaseById(caseId as string).then((c) => {
        if (c) {
          setIdentity(c.identity);
          setNotes(c.notes || "");
          setSaved(true);
          setResolvedType(c.exposureType || "");
          setResolvedSymptoms(c.symptoms || []);
          setResolvedPct(c.severityPercentage || 0);
          setResolvedLevel(c.severityLevel || "Mild");
          setResolvedPresentCount(c.symptoms?.length || 0);
        }
      });
    } else {
      setResolvedSymptoms(symptoms ? JSON.parse(symptoms as string) : []);
      loadDraft().then((draft) => {
        if (draft?.identity) setIdentity(draft.identity as PatientIdentity);
      });
    }
  }, [caseId]);

  const getSeverityColors = (l: string) => {
    switch (l) {
      case "Severe Complicated": return { color: "#DC2626", bgColor: "#FEE2E2" };
      case "Alarming":           return { color: "#EA580C", bgColor: "#FFEDD5" };
      case "Moderate":           return { color: "#D97706", bgColor: "#FEF3C7" };
      default:                   return { color: "#059669", bgColor: "#D1FAE5" };
    }
  };

  const { color, bgColor } = getSeverityColors(resolvedLevel);

  const getTypeLabel = (t: string): string => {
    const map: Record<string, string> = {
      cobra: "Snake Bite — Cobra (Darvikara)",
      viper: "Snake Bite — Viper (Mandali)",
      krait: "Snake Bite — Krait (Rajimanta)",
      scorpion: "Scorpion Sting (Vruschika)",
      insect: "Insect Bite (Keeta)",
      spider: "Spider Bite (Luta)",
      dog: "Dog Bite (Shwana)",
      rat: "Rat Bite (Mushika)",
      animal: "Animal Bite (Pashu Dansha)",
      gara_visha: "Gara Visha Assessment",
      dushi_visha: "Dushi Visha Assessment",
      virruddha_aahara: "Virruddha Aahara Scoring",
    };
    if (t?.startsWith("external_")) return "External Contact";
    return map[t] || t;
  };

  const handleSave = async () => {
    await saveCase({
      identity,
      exposureType: resolvedType,
      biteType: resolvedType,
      snakeSubType: null,
      symptoms: resolvedSymptoms,
      severityPercentage: resolvedPct,
      severityLevel: resolvedLevel,
      notes,
    });
    await clearDraft();
    setSaved(true);
    Alert.alert("Saved", "Case saved offline successfully.");
  };

  // Returns a rich breakdown of every selection step for the PDF
  const getExposureDetails = (t: string): {
    category: string;
    categorySanskrit: string;
    subcategory: string;
    subcategorySanskrit: string;
    description: string;
    toxicityProfile: string;
    pathway: string[];
    icon: string;
  } => {
    const details: Record<string, any> = {
      cobra: {
        category: "Bite / Sting",           categorySanskrit: "Dansha Visha",
        subcategory: "Snake Bite — Cobra",  subcategorySanskrit: "Sarpa Dansha — Darvikara",
        description: "Neurotoxic + cytotoxic envenomation. Causes hood spread, ptosis, descending paralysis, and local tissue necrosis.",
        toxicityProfile: "Neurotoxic, Cytotoxic",
        pathway: ["Exposure Type → Bite / Sting", "Organism → Snake (Sarpa)", "Species → Cobra / Darvikara (Naja sp.)"],
        icon: "🐍",
      },
      viper: {
        category: "Bite / Sting",           categorySanskrit: "Dansha Visha",
        subcategory: "Snake Bite — Viper",  subcategorySanskrit: "Sarpa Dansha — Mandali",
        description: "Hemotoxic envenomation. Causes severe local swelling, haemorrhage, coagulopathy, and tissue destruction.",
        toxicityProfile: "Hemotoxic, Coagulopathic",
        pathway: ["Exposure Type → Bite / Sting", "Organism → Snake (Sarpa)", "Species → Viper / Mandali (Vipera sp.)"],
        icon: "🐍",
      },
      krait: {
        category: "Bite / Sting",           categorySanskrit: "Dansha Visha",
        subcategory: "Snake Bite — Krait",  subcategorySanskrit: "Sarpa Dansha — Rajimanta",
        description: "Neurotoxic envenomation. Minimal local signs, progressive descending paralysis, often nocturnal bite.",
        toxicityProfile: "Neurotoxic (post-synaptic)",
        pathway: ["Exposure Type → Bite / Sting", "Organism → Snake (Sarpa)", "Species → Krait / Rajimanta (Bungarus sp.)"],
        icon: "🐍",
      },
      scorpion: {
        category: "Bite / Sting",           categorySanskrit: "Dansha Visha",
        subcategory: "Scorpion Sting",      subcategorySanskrit: "Vruschika Dansha",
        description: "Venom contains neurotoxins causing pain, paresthesia, autonomic dysfunction, and in severe cases cardiovascular collapse.",
        toxicityProfile: "Neurotoxic, Cardiotoxic",
        pathway: ["Exposure Type → Bite / Sting", "Organism → Scorpion (Vruschika)"],
        icon: "🦂",
      },
      insect: {
        category: "Bite / Sting",           categorySanskrit: "Dansha Visha",
        subcategory: "Insect Bite / Sting", subcategorySanskrit: "Keeta Dansha",
        description: "Local reaction from insect venom or allergic response. May cause anaphylaxis in sensitized individuals.",
        toxicityProfile: "Allergenic, Local irritant",
        pathway: ["Exposure Type → Bite / Sting", "Organism → Insect (Keeta)"],
        icon: "🐛",
      },
      spider: {
        category: "Bite / Sting",           categorySanskrit: "Dansha Visha",
        subcategory: "Spider Bite",         subcategorySanskrit: "Luta Dansha",
        description: "Neurotoxic or necrotic venom depending on species. Local tissue damage with possible systemic involvement.",
        toxicityProfile: "Neurotoxic / Necrotic",
        pathway: ["Exposure Type → Bite / Sting", "Organism → Spider (Luta)"],
        icon: "🕷️",
      },
      dog: {
        category: "Bite / Sting",           categorySanskrit: "Dansha Visha",
        subcategory: "Dog Bite",            subcategorySanskrit: "Shwana Dansha",
        description: "Risk of rabies, bacterial infection, and local trauma. Rabies prophylaxis protocol must be initiated.",
        toxicityProfile: "Infectious (Rabies risk), Bacterial",
        pathway: ["Exposure Type → Bite / Sting", "Organism → Dog (Shwana)"],
        icon: "🐕",
      },
      rat: {
        category: "Bite / Sting",           categorySanskrit: "Dansha Visha",
        subcategory: "Rat Bite",            subcategorySanskrit: "Mushika Dansha",
        description: "Risk of rat-bite fever, leptospirosis, and local infection. Wound care and prophylaxis essential.",
        toxicityProfile: "Infectious, Bacterial",
        pathway: ["Exposure Type → Bite / Sting", "Organism → Rat (Mushika)"],
        icon: "🐀",
      },
      animal: {
        category: "Bite / Sting",           categorySanskrit: "Dansha Visha",
        subcategory: "Other Animal Bite",   subcategorySanskrit: "Anya Pashu Dansha",
        description: "Unspecified animal bite. Assess for envenomation, infection risk, and rabies exposure based on species.",
        toxicityProfile: "Variable — species dependent",
        pathway: ["Exposure Type → Bite / Sting", "Organism → Other Animal (Pashu)"],
        icon: "🦴",
      },
      mushroom: {
        category: "Toxic Food / Ingestion", categorySanskrit: "Garavisha / Ahara Visha",
        subcategory: "Mushroom Poisoning",  subcategorySanskrit: "Chatrak Visha",
        description: "Toxic mushroom ingestion. May cause hepatotoxicity, nephrotoxicity, or neurological effects depending on species.",
        toxicityProfile: "Hepatotoxic, Nephrotoxic, Neurotoxic",
        pathway: ["Exposure Type → Toxic Food / Ingestion", "Food Type → Mushroom (Chatrak)"],
        icon: "🍄",
      },
      seafood: {
        category: "Toxic Food / Ingestion", categorySanskrit: "Garavisha / Ahara Visha",
        subcategory: "Seafood Poisoning",   subcategorySanskrit: "Jalaja Visha",
        description: "Contaminated or toxic seafood ingestion. May involve paralytic shellfish toxins, ciguatera, or bacterial contamination.",
        toxicityProfile: "Neurotoxic, GI irritant",
        pathway: ["Exposure Type → Toxic Food / Ingestion", "Food Type → Seafood (Jalaja)"],
        icon: "🐟",
      },
      chemical: {
        category: "Toxic Food / Ingestion", categorySanskrit: "Garavisha / Ahara Visha",
        subcategory: "Chemical Ingestion",  subcategorySanskrit: "Kritrima Visha",
        description: "Ingested chemical or industrial toxin. Assess for corrosive, systemic, or organ-specific toxicity.",
        toxicityProfile: "Systemic, Corrosive, Organ-specific",
        pathway: ["Exposure Type → Toxic Food / Ingestion", "Food Type → Chemical (Kritrima)"],
        icon: "⚗️",
      },
      pesticide: {
        category: "Toxic Food / Ingestion",  categorySanskrit: "Garavisha / Ahara Visha",
        subcategory: "Pesticide Poisoning",  subcategorySanskrit: "Keeta Nashak Visha",
        description: "Organophosphate or other pesticide ingestion. SLUDGE syndrome, cholinergic crisis, neurological effects.",
        toxicityProfile: "Cholinergic, Neurotoxic",
        pathway: ["Exposure Type → Toxic Food / Ingestion", "Food Type → Pesticide (Keeta Nashak)"],
        icon: "🧪",
      },
      spoiled: {
        category: "Toxic Food / Ingestion", categorySanskrit: "Garavisha / Ahara Visha",
        subcategory: "Spoiled Food",         subcategorySanskrit: "Dushita Anna",
        description: "Contaminated or putrefied food consumption. Risk of bacterial toxins, botulism, or food-borne illness.",
        toxicityProfile: "Bacterial toxins, GI pathogenic",
        pathway: ["Exposure Type → Toxic Food / Ingestion", "Food Type → Spoiled Food (Dushita Anna)"],
        icon: "🤢",
      },
      plant: {
        category: "Toxic Food / Ingestion", categorySanskrit: "Garavisha / Ahara Visha",
        subcategory: "Toxic Plant Ingestion", subcategorySanskrit: "Sthavara Visha",
        description: "Alkaloids, glycosides, or other phytotoxins ingested. Effects vary widely by species — cardiac, neurological, GI.",
        toxicityProfile: "Alkaloid/Glycoside — plant-specific",
        pathway: ["Exposure Type → Toxic Food / Ingestion", "Food Type → Toxic Plant (Sthavara)"],
        icon: "🌿",
      },
      gara_visha: {
        category: "Gara / Dushi Visha",         categorySanskrit: "Questionnaire Assessment",
        subcategory: "Gara Visha",               subcategorySanskrit: "Artificial / Administered Poison",
        description: "Structured diagnostic questionnaire for deliberate or accidental food/water-based acute poisoning. 10 key diagnostic criteria assessed.",
        toxicityProfile: "Acute exogenous — food/water route",
        pathway: ["Exposure Type → Gara / Dushi Visha", "Questionnaire → Gara Visha (Acute Poisoning)"],
        icon: "📋",
      },
      dushi_visha: {
        category: "Gara / Dushi Visha",         categorySanskrit: "Questionnaire Assessment",
        subcategory: "Dushi Visha",              subcategorySanskrit: "Residual / Chronic Toxin",
        description: "Structured diagnostic questionnaire for latent or residual poison accumulated chronically. 10 key diagnostic criteria assessed.",
        toxicityProfile: "Chronic retention — cumulative toxicity",
        pathway: ["Exposure Type → Gara / Dushi Visha", "Questionnaire → Dushi Visha (Chronic Residual)"],
        icon: "📋",
      },
      virruddha_aahara: {
        category: "Toxic Food / Ingestion",         categorySanskrit: "Garavisha / Ahara Visha",
        subcategory: "Viruddha Ahara",              subcategorySanskrit: "Incompatible Food Combinations",
        description: "Frequency-based scoring of incompatible food pairings known to accumulate Dushi Visha (chronic toxicity) over time per Ayurvedic principles.",
        toxicityProfile: "Chronic accumulation — dietary origin",
        pathway: ["Exposure Type → Toxic Food / Ingestion", "Assessment → Viruddha Ahara (Frequency Scoring)"],
        icon: "🍽️",
      },
    };

    // External contact types
    if (t?.startsWith("external_")) {
      const subId = t.replace("external_", "");
      const extNames: Record<string, [string, string]> = {
        skin:       ["Skin / Dermal Contact",    "Twak Sparsha"],
        eye:        ["Eye / Ocular Exposure",     "Netra Sparsha"],
        ear:        ["Ear / Aural Exposure",      "Karna Sparsha"],
        nasal:      ["Nasal / Inhalation",        "Nasa Sparsha"],
        smoke:      ["Smoke / Fumigation",        "Dhooma Sparsha"],
        clothing:   ["Clothing / Fabric Contact", "Vastra Sparsha"],
        water:      ["Water / Bath Exposure",     "Jala Sparsha"],
        soil:       ["Soil / Ground Contact",     "Bhumi Sparsha"],
        plant:      ["Plant / Latex Contact",     "Vriksha Sparsha"],
        insect:     ["Insect Contact / Powder",   "Keeta Sparsha"],
        chemical:   ["Chemical / Industrial",     "Rasayana Sparsha"],
        radiation:  ["Heat / Radiation",          "Agni Sparsha"],
      };
      const [name, sanskrit] = extNames[subId] || ["External Contact", "Bahya Sparsha"];
      return {
        category: "External Contact",        categorySanskrit: "Bahya Sparsha Visha",
        subcategory: name,                   subcategorySanskrit: sanskrit,
        description: "External toxic contact via skin, mucous membranes, or inhalation. Assess entry route, duration, and extent of exposure.",
        toxicityProfile: "Topical / Inhalation — route dependent",
        pathway: ["Exposure Type → External Contact", `Contact Route → ${name}`],
        icon: "🖐️",
      };
    }

    return details[t] || {
      category: "Unknown",     categorySanskrit: "—",
      subcategory: t || "—",  subcategorySanskrit: "—",
      description: "Assessment details not available.",
      toxicityProfile: "—",
      pathway: ["Exposure Type → " + (t || "Unknown")],
      icon: "⚕️",
    };
  };

  const getGradeLabel = (g: number) => {
    if (g <= 2) return "Minimal";
    if (g <= 4) return "Mild";
    if (g <= 6) return "Moderate";
    if (g <= 8) return "Severe";
    return "Critical";
  };

  const getGradeColor = (g: number) => {
    if (g <= 2) return "#059669";
    if (g <= 4) return "#D97706";
    if (g <= 6) return "#EA580C";
    if (g <= 8) return "#DC2626";
    return "#7C3AED";
  };

  const getSeverityBgLight = (l: string) => {
    switch (l) {
      case "Severe Complicated": return "#FFF5F5";
      case "Alarming":           return "#FFF8F5";
      case "Moderate":           return "#FFFDF0";
      default:                   return "#F0FDF4";
    }
  };

  const generatePDF = async () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
    const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

    // Build symptom rows grouped with grade bar
    const symptomRows = resolvedSymptoms.map((s: any, i: number) => {
      const g = s.grade || 0;
      const gc = getGradeColor(g);
      const gl = getGradeLabel(g);
      const barWidth = g * 10;
      return `
        <tr style="background:${i % 2 === 0 ? "#FFFFFF" : "#F9FAFB"}">
          <td style="padding:10px 14px;font-size:13px;color:#374151;border-bottom:1px solid #F1F5F9;">${i + 1}. ${s.symptom}</td>
          <td style="padding:10px 14px;text-align:center;border-bottom:1px solid #F1F5F9;">
            <div style="display:flex;align-items:center;gap:8px;justify-content:center;">
              <div style="width:80px;height:8px;background:#E5E7EB;border-radius:4px;overflow:hidden;">
                <div style="width:${barWidth}%;height:100%;background:${gc};border-radius:4px;"></div>
              </div>
              <span style="font-weight:700;color:${gc};font-size:12px;">${g}/10</span>
            </div>
          </td>
          <td style="padding:10px 14px;text-align:center;border-bottom:1px solid #F1F5F9;">
            <span style="background:${gc}20;color:${gc};font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;">${gl}</span>
          </td>
        </tr>`;
    }).join("");

    const sevDesc = resolvedLevel === "Severe Complicated"
      ? "CRITICAL — Immediate emergency intervention required. Hospital admission mandatory."
      : resolvedLevel === "Alarming"
      ? "HIGH ALERT — Urgent hospital admission needed. Close monitoring essential."
      : resolvedLevel === "Moderate"
      ? "MODERATE — Hospital observation and active treatment required."
      : "MILD — Outpatient care with 24-hour follow-up recommended.";

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Agada Tantra — Clinical Report</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    background: #F8F9FA;
    color: #1F2937;
    font-size: 13px;
    line-height: 1.6;
  }
  .page { max-width: 780px; margin: 0 auto; background: white; }

  /* ── Header ── */
  .header {
    background: linear-gradient(135deg, #1F2937 0%, #374151 100%);
    color: white;
    padding: 32px 40px 28px;
    position: relative;
    overflow: hidden;
  }
  .header::before {
    content: '';
    position: absolute; top: -40px; right: -40px;
    width: 180px; height: 180px;
    background: rgba(196,94,61,0.15);
    border-radius: 50%;
  }
  .header::after {
    content: '';
    position: absolute; bottom: -60px; right: 60px;
    width: 120px; height: 120px;
    background: rgba(196,94,61,0.08);
    border-radius: 50%;
  }
  .header-inner { position: relative; z-index: 1; }
  .header-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; }
  .logo-block { display: flex; align-items: center; gap: 14px; }
  .logo-icon {
    width: 52px; height: 52px;
    background: #C45E3D;
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 24px;
    box-shadow: 0 4px 12px rgba(196,94,61,0.4);
  }
  .logo-text h1 { font-size: 22px; font-weight: 800; color: white; letter-spacing: 0.5px; }
  .logo-text p { font-size: 12px; color: rgba(255,255,255,0.65); margin-top: 2px; }
  .report-meta { text-align: right; }
  .report-meta .report-tag {
    display: inline-block;
    background: rgba(196,94,61,0.3);
    border: 1px solid rgba(196,94,61,0.5);
    color: #FCA58F;
    font-size: 10px; font-weight: 700;
    padding: 4px 12px; border-radius: 20px;
    letter-spacing: 0.5px; margin-bottom: 6px;
  }
  .report-meta p { font-size: 11px; color: rgba(255,255,255,0.55); }
  .header-divider { height: 1px; background: rgba(255,255,255,0.1); margin: 16px 0; }
  .header-bottom { display: flex; justify-content: space-between; align-items: center; }
  .report-title { font-size: 16px; font-weight: 700; color: rgba(255,255,255,0.9); }
  .report-id { font-size: 11px; color: rgba(255,255,255,0.45); font-family: monospace; }

  /* ── Body ── */
  .body { padding: 32px 40px; }

  /* ── Severity Banner ── */
  .sev-banner {
    background: ${getSeverityBgLight(resolvedLevel)};
    border: 2px solid ${color};
    border-radius: 14px;
    padding: 24px 28px;
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }
  .sev-main {}
  .sev-label { font-size: 10px; font-weight: 800; color: ${color}; letter-spacing: 1px; margin-bottom: 6px; }
  .sev-level { font-size: 28px; font-weight: 900; color: ${color}; line-height: 1.1; }
  .sev-desc { font-size: 12px; color: ${color}; margin-top: 6px; opacity: 0.85; }
  .sev-metrics { display: flex; gap: 0; }
  .sev-metric {
    text-align: center;
    padding: 0 24px;
    border-right: 1px solid ${color}30;
  }
  .sev-metric:last-child { border-right: none; }
  .sev-metric-val { font-size: 26px; font-weight: 900; color: ${color}; }
  .sev-metric-lbl { font-size: 9px; font-weight: 800; color: ${color}; letter-spacing: 0.5px; margin-top: 2px; opacity: 0.75; }

  /* ── Section blocks ── */
  .section { margin-bottom: 24px; }
  .section-title {
    font-size: 11px; font-weight: 800; color: #9CA3AF;
    letter-spacing: 1px; text-transform: uppercase;
    padding-bottom: 8px;
    border-bottom: 2px solid #F1F5F9;
    margin-bottom: 14px;
    display: flex; align-items: center; gap: 8px;
  }
  .section-title::before {
    content: '';
    width: 4px; height: 14px;
    background: #C45E3D;
    border-radius: 2px;
    display: inline-block;
  }

  /* ── 2-col grid ── */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
  .field {
    background: #F9FAFB;
    border: 1px solid #F1F5F9;
    border-radius: 10px;
    padding: 10px 14px;
  }
  .field-label { font-size: 10px; font-weight: 700; color: #9CA3AF; letter-spacing: 0.3px; }
  .field-value { font-size: 14px; font-weight: 700; color: #1F2937; margin-top: 3px; }
  .field-value.small { font-size: 13px; }

  /* ── Full-width text block ── */
  .text-block {
    background: #F9FAFB;
    border: 1px solid #F1F5F9;
    border-left: 3px solid #C45E3D;
    border-radius: 0 10px 10px 0;
    padding: 14px 16px;
    font-size: 13px;
    color: #374151;
    line-height: 1.7;
  }
  .text-block.italic { font-style: italic; color: #6B7280; }

  /* ── Badge row ── */
  .badge-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
  .badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 12px; border-radius: 20px;
    font-size: 11px; font-weight: 700;
  }
  .badge-warning { background: #FEF3C7; color: #D97706; }
  .badge-purple  { background: #EDE9FE; color: #7C3AED; }
  .badge-green   { background: #D1FAE5; color: #059669; }
  .badge-red     { background: #FEE2E2; color: #DC2626; }
  .badge-blue    { background: #DBEAFE; color: #2563EB; }
  .badge-terracotta { background: #FFF4EE; color: #C45E3D; border: 1px solid #FDEAD7; }

  /* ── Exposure card ── */
  .exposure-card {
    background: #FFF4EE;
    border: 1.5px solid #FDEAD7;
    border-radius: 12px;
    padding: 16px 20px;
    display: flex; align-items: center; gap: 14px;
  }
  .exposure-icon {
    width: 44px; height: 44px;
    background: #C45E3D;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; flex-shrink: 0;
  }
  .exposure-label { font-size: 10px; font-weight: 700; color: #C45E3D; letter-spacing: 0.5px; }
  .exposure-type { font-size: 17px; font-weight: 800; color: #1F2937; margin-top: 3px; }

  /* ── Symptoms table ── */
  .symptoms-table {
    width: 100%;
    border-collapse: collapse;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #F1F5F9;
  }
  .symptoms-table th {
    background: #F8F9FA;
    padding: 10px 14px;
    text-align: left;
    font-size: 10px; font-weight: 800;
    color: #9CA3AF; letter-spacing: 0.5px;
    border-bottom: 2px solid #F1F5F9;
  }
  .symptoms-table th:nth-child(2),
  .symptoms-table th:nth-child(3) { text-align: center; }
  .no-symptoms {
    text-align: center; padding: 20px;
    color: #9CA3AF; font-style: italic; font-size: 13px;
  }

  /* ── Notes block ── */
  .notes-block {
    background: #FFFBF0;
    border: 1px solid #FDE68A;
    border-left: 3px solid #F59E0B;
    border-radius: 0 10px 10px 0;
    padding: 14px 16px;
    font-size: 13px;
    color: #374151;
    line-height: 1.7;
  }

  /* ── Footer ── */
  .footer {
    background: #F9FAFB;
    border-top: 2px solid #F1F5F9;
    padding: 20px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .footer-left { font-size: 11px; color: #9CA3AF; }
  .footer-left strong { color: #6B7280; }
  .footer-right { font-size: 10px; color: #D1D5DB; font-family: monospace; }
  .disclaimer {
    background: #FEF9C3;
    border: 1px solid #FDE68A;
    border-radius: 8px;
    padding: 10px 14px;
    margin: 0 40px 20px;
    font-size: 11px; color: #92400E; line-height: 1.5;
  }

  /* ── Page break hints ── */
  .pb { page-break-after: always; }
</style>
</head>
<body>
<div class="page">

  <!-- ══ HEADER ══ -->
  <div class="header">
    <div class="header-inner">
      <div class="header-top">
        <div class="logo-block">
          <div class="logo-icon">🏥</div>
          <div class="logo-text">
            <h1>AGADA SANJEEVINI</h1>
            <p>Agada Tantra Parikshika — Ayurvedic Toxicology</p>
          </div>
        </div>
        <div class="report-meta">
          <div class="report-tag">CLINICAL REPORT</div>
          <p>${dateStr}</p>
          <p>${timeStr}</p>
        </div>
      </div>
      <div class="header-divider"></div>
      <div class="header-bottom">
        <div class="report-title">Visha Pariksha — Toxicological Assessment Report</div>
        <div class="report-id">REF: AGD-${now.getTime().toString().slice(-8)}</div>
      </div>
    </div>
  </div>

  <!-- ══ BODY ══ -->
  <div class="body">

    <!-- ── Severity ── -->
    <div class="sev-banner">
      <div class="sev-main">
        <div class="sev-label">VISHA SEVERITY CLASSIFICATION</div>
        <div class="sev-level">${resolvedLevel}</div>
        <div class="sev-desc">${sevDesc}</div>
      </div>
      <div class="sev-metrics">
        <div class="sev-metric">
          <div class="sev-metric-val">${resolvedPct.toFixed(1)}%</div>
          <div class="sev-metric-lbl">TOXICITY INDEX</div>
        </div>
        <div class="sev-metric">
          <div class="sev-metric-val">${resolvedPresentCount}</div>
          <div class="sev-metric-lbl">SYMPTOMS</div>
        </div>
        <div class="sev-metric">
          <div class="sev-metric-val">${parseInt((totalPossible as string) || "0", 10)}</div>
          <div class="sev-metric-lbl">TOTAL POSSIBLE</div>
        </div>
      </div>
    </div>

    <!-- ── Patient Identity ── -->
    ${identity ? `
    <div class="section">
      <div class="section-title">Patient Identity</div>

      <div style="margin-bottom:10px;">
        <div style="font-size:22px;font-weight:900;color:#1F2937;margin-bottom:4px;">${identity.name || "Patient Name Not Recorded"}</div>
        ${identity.role ? `<span class="badge badge-terracotta">${identity.role}</span>` : ""}
      </div>

      <div class="grid-3" style="margin-bottom:10px;">
        <div class="field">
          <div class="field-label">Age</div>
          <div class="field-value">${identity.age ? identity.age + " years" : "—"}</div>
        </div>
        <div class="field">
          <div class="field-label">Gender</div>
          <div class="field-value">${identity.gender || "—"}</div>
        </div>
        <div class="field">
          <div class="field-label">Marital Status</div>
          <div class="field-value">${identity.maritalStatus || "—"}</div>
        </div>
      </div>

      <div class="grid-2" style="margin-bottom:10px;">
        <div class="field">
          <div class="field-label">Occupation</div>
          <div class="field-value small">${identity.occupation || "—"}</div>
        </div>
        <div class="field">
          <div class="field-label">Socioeconomic Status</div>
          <div class="field-value">${identity.socioStatus || "—"}</div>
        </div>
      </div>

      ${identity.address ? `
      <div class="field" style="margin-bottom:10px;">
        <div class="field-label">Address</div>
        <div class="field-value small">${identity.address}</div>
      </div>` : ""}

      <div class="grid-3" style="margin-bottom:10px;">
        <div class="field">
          <div class="field-label">Admission Type</div>
          <div class="field-value">${identity.admissionType || "—"}</div>
        </div>
        <div class="field">
          <div class="field-label">Date of Admission</div>
          <div class="field-value small">${identity.dateOfAdmission || "—"}</div>
        </div>
        <div class="field">
          <div class="field-label">Record Origin</div>
          <div class="field-value">${identity.role || "—"}</div>
        </div>
      </div>

      ${(identity.opdNumber || identity.ipdNumber) ? `
      <div class="grid-2" style="margin-bottom:10px;">
        ${identity.opdNumber ? `<div class="field"><div class="field-label">OPD Number</div><div class="field-value">${identity.opdNumber}</div></div>` : ""}
        ${identity.ipdNumber ? `<div class="field"><div class="field-label">IPD Number</div><div class="field-value">${identity.ipdNumber}</div></div>` : ""}
      </div>` : ""}

      <div class="badge-row">
        ${identity.allergies ? `<span class="badge badge-warning">⚠ Allergies: ${identity.allergies}</span>` : `<span class="badge badge-green">✓ No Known Allergies</span>`}
        ${identity.previousBite ? `<span class="badge badge-purple">⚡ Previous bite/exposure in last 10 years</span>` : `<span class="badge badge-green">✓ No previous bite history</span>`}
      </div>
    </div>` : ""}

    <!-- ── Exposure Classification ── -->
    ${(() => {
      const ed = getExposureDetails(resolvedType);
      const pathwaySteps = ed.pathway.map((step: string, i: number) => `
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:${i < ed.pathway.length - 1 ? "6px" : "0"};">
          <div style="width:22px;height:22px;border-radius:50%;background:${i === ed.pathway.length - 1 ? "#C45E3D" : "#E5E7EB"};display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;color:${i === ed.pathway.length - 1 ? "#fff" : "#9CA3AF"};flex-shrink:0;">${i + 1}</div>
          <div style="font-size:12px;font-weight:${i === ed.pathway.length - 1 ? "800" : "600"};color:${i === ed.pathway.length - 1 ? "#1F2937" : "#6B7280"};">${step}</div>
          ${i < ed.pathway.length - 1 ? "" : ""}
        </div>
      `).join(`<div style="width:1px;height:10px;background:#E5E7EB;margin-left:11px;margin-bottom:6px;"></div>`);

      return `
    <div class="section">
      <div class="section-title">Exposure Classification & Selection Pathway</div>

      <!-- Selection pathway breadcrumb -->
      <div style="background:#F9FAFB;border:1px solid #F1F5F9;border-radius:12px;padding:16px 18px;margin-bottom:14px;">
        <div style="font-size:10px;font-weight:800;color:#9CA3AF;letter-spacing:0.5px;margin-bottom:12px;">ASSESSMENT PATHWAY</div>
        ${pathwaySteps}
      </div>

      <!-- Main exposure card -->
      <div style="background:#FFF4EE;border:1.5px solid #FDEAD7;border-radius:12px;padding:18px 20px;margin-bottom:14px;display:flex;align-items:flex-start;gap:16px;">
        <div style="width:48px;height:48px;background:#C45E3D;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">${ed.icon}</div>
        <div style="flex:1;">
          <div style="font-size:10px;font-weight:700;color:#C45E3D;letter-spacing:0.5px;margin-bottom:4px;">${ed.category.toUpperCase()} &nbsp;·&nbsp; ${ed.categorySanskrit}</div>
          <div style="font-size:18px;font-weight:900;color:#1F2937;margin-bottom:2px;">${ed.subcategory}</div>
          <div style="font-size:12px;color:#C45E3D;font-style:italic;margin-bottom:10px;">${ed.subcategorySanskrit}</div>
          <div style="font-size:12px;color:#6B7280;line-height:1.6;">${ed.description}</div>
        </div>
      </div>

      <!-- Toxicity profile badge -->
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
        <span style="font-size:10px;font-weight:800;color:#9CA3AF;letter-spacing:0.5px;">TOXICITY PROFILE:</span>
        <span style="background:#FFF4EE;color:#C45E3D;border:1px solid #FDEAD7;font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;">${ed.toxicityProfile}</span>
      </div>
    </div>`;
    })()}

    <!-- ── Chief Complaint ── -->
    ${identity?.mainComplaint ? `
    <div class="section">
      <div class="section-title">Chief Complaint (Mukhya Vedana)</div>
      <div class="text-block">${identity.mainComplaint}</div>
    </div>` : ""}

    <!-- ── Associated Complaints ── -->
    ${identity?.associatedComplaints ? `
    <div class="section">
      <div class="section-title">Associated Complaints</div>
      <div class="text-block">${identity.associatedComplaints}</div>
    </div>` : ""}

    <!-- ── History of Present Illness ── -->
    ${identity?.history ? `
    <div class="section">
      <div class="section-title">History of Present Illness</div>
      <div class="text-block">${identity.history}</div>
    </div>` : ""}

    <!-- ── Nidana ── -->
    ${identity?.nidana ? `
    <div class="section">
      <div class="section-title">Nidana — Causative Factor</div>
      <div class="text-block italic">${identity.nidana}</div>
    </div>` : ""}

    <!-- ── Symptoms / Findings ── -->
    ${(() => {
      const isQuestionnaire = resolvedType === "gara_visha" || resolvedType === "dushi_visha";
      const isViruddha = resolvedType === "virruddha_aahara";
      const sectionLabel = isQuestionnaire
        ? "Positive Diagnostic Criteria"
        : isViruddha
        ? "Incompatible Food Findings (Frequency Scored)"
        : "Observed Symptoms & Severity Grading";

      const tableHeader = isViruddha
        ? `<th>Food Combination / Incompatibility</th><th style="width:130px;">Frequency Score</th><th style="width:110px;">Impact Level</th>`
        : isQuestionnaire
        ? `<th>Positive Criterion / Question</th><th style="width:130px;">Severity Grade</th><th style="width:110px;">Classification</th>`
        : `<th>Symptom / Clinical Finding</th><th style="width:130px;">Severity Grade</th><th style="width:110px;">Classification</th>`;

      const scaleNote = isViruddha
        ? `<span style="font-size:10px;color:#9CA3AF;font-weight:700;">FREQUENCY SCORING:</span>
           <span style="font-size:10px;color:#059669;font-weight:600;">Never=0</span>
           <span style="font-size:10px;color:#10B981;font-weight:600;">Rarely=1</span>
           <span style="font-size:10px;color:#F59E0B;font-weight:600;">Occasionally=2</span>
           <span style="font-size:10px;color:#EF4444;font-weight:600;">Frequently=3</span>
           <span style="font-size:10px;color:#7C3AED;font-weight:600;">Daily=4</span>`
        : `<span style="font-size:10px;color:#9CA3AF;font-weight:700;">GRADE SCALE:</span>
           <span style="font-size:10px;color:#059669;font-weight:600;">1–2 Minimal</span>
           <span style="font-size:10px;color:#D97706;font-weight:600;">3–4 Mild</span>
           <span style="font-size:10px;color:#EA580C;font-weight:600;">5–6 Moderate</span>
           <span style="font-size:10px;color:#DC2626;font-weight:600;">7–8 Severe</span>
           <span style="font-size:10px;color:#7C3AED;font-weight:600;">9–10 Critical</span>`;

      const countSummary = resolvedSymptoms.length > 0
        ? `<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;flex-wrap:wrap;">
            <span style="background:#FFF4EE;color:#C45E3D;border:1px solid #FDEAD7;font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;">${resolvedSymptoms.length} ${isQuestionnaire ? "positive criteria" : isViruddha ? "items scored" : "symptoms present"}</span>
            <span style="background:#F1F5F9;color:#6B7280;font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;">${parseInt((totalPossible as string) || "0", 10)} total possible</span>
            <span style="background:${bgColor};color:${color};font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;">${resolvedPct.toFixed(1)}% toxicity index</span>
          </div>`
        : "";

      return `
    <div class="section">
      <div class="section-title">${sectionLabel}</div>
      ${countSummary}
      ${resolvedSymptoms.length > 0 ? `
      <table class="symptoms-table">
        <thead><tr>${tableHeader}</tr></thead>
        <tbody>${symptomRows}</tbody>
      </table>
      <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;">${scaleNote}</div>`
      : `<p class="no-symptoms">No ${isQuestionnaire ? "positive criteria" : "symptoms"} recorded for this assessment.</p>`}
    </div>`;
    })()}

    <!-- ── Clinical Notes ── -->
    ${notes ? `
    <div class="section">
      <div class="section-title">Clinical Impression & Agada Protocol Notes</div>
      <div class="notes-block">${notes.replace(/\n/g, "<br>")}</div>
    </div>` : ""}

  </div><!-- /body -->

  <!-- ── Disclaimer ── -->
  <div class="disclaimer">
    <strong>⚕ Clinical Disclaimer:</strong> This report is generated by Agada Tantra Parikshika for clinical reference and documentation purposes only. It is intended to assist qualified Ayurvedic and medical practitioners in their assessment. This report does not replace professional medical judgment, formal diagnosis, or treatment. All clinical decisions should be made by a licensed healthcare professional.
  </div>

  <!-- ── Footer ── -->
  <div class="footer">
    <div class="footer-left">
      <strong>Agada Tantra Parikshika</strong> — Ayurvedic Toxicology Clinical Tool<br>
      Patient: ${identity?.name || "Not Recorded"} &nbsp;|&nbsp; Generated: ${dateStr}, ${timeStr}
    </div>
    <div class="footer-right">REF: AGD-${now.getTime().toString().slice(-8)}</div>
  </div>

</div><!-- /page -->
</body>
</html>`;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: "application/pdf", dialogTitle: "Clinical Report", UTI: "com.adobe.pdf" });
      } else {
        Alert.alert("Success", "PDF generated!");
      }
    } catch {
      Alert.alert("Error", "Failed to generate PDF.");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }} keyboardVerticalOffset={100}>
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

            {/* Readonly banner */}
            {isReadonly && (
              <View style={styles.readonlyBanner}>
                <MaterialIcons name="history" size={16} color="#7C3AED" />
                <Text style={styles.readonlyText}>Viewing saved case</Text>
                <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
                  <Text style={styles.readonlyBackText}>← Back to Cases</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Header */}
            <View style={styles.headerSection}>
              <MaterialIcons name="check-circle" size={48} color="#10B981" />
              <Text style={styles.title}>Clinical Summary</Text>
              <Text style={styles.headerSubtitle}>Agada Sanjeevini Assessment Report</Text>
            </View>

            {/* Severity card */}
            <View style={[styles.severityCard, { backgroundColor: bgColor, borderColor: color }]}>
              <Text style={[styles.severityLabel, { color }]}>VISHA SEVERITY CLASSIFICATION</Text>
              <Text style={[styles.severityLevelText, { color }]}>{resolvedLevel}</Text>
              <View style={styles.severityMetrics}>
                <View style={styles.metricItem}>
                  <Text style={[styles.metricValue, { color }]}>{resolvedPct.toFixed(1)}%</Text>
                  <Text style={[styles.metricLabel, { color }]}>TOXICITY INDEX</Text>
                </View>
                <View style={[styles.metricDivider, { backgroundColor: color + "40" }]} />
                <View style={styles.metricItem}>
                  <Text style={[styles.metricValue, { color }]}>{resolvedPresentCount}</Text>
                  <Text style={[styles.metricLabel, { color }]}>SYMPTOMS PRESENT</Text>
                </View>
              </View>
              <Text style={[styles.severityDesc, { color }]}>
                {resolvedLevel === "Severe Complicated" && "🚨 Critical — Immediate emergency intervention required"}
                {resolvedLevel === "Alarming" && "⚠️ High — Urgent hospital admission needed"}
                {resolvedLevel === "Moderate" && "⚡ Moderate — Hospital observation and treatment required"}
                {resolvedLevel === "Mild" && "✅ Mild — Outpatient care with 24hr follow-up"}
              </Text>
            </View>

            {/* Patient identity */}
            {identity && (
              <View style={styles.card}>
                <Text style={styles.cardLabel}>PATIENT IDENTITY</Text>
                <Text style={styles.patientName}>{identity.name || "Patient Name Not Recorded"}</Text>
                <View style={styles.identityGrid}>
                  {[
                    { label: "Age", value: identity.age ? `${identity.age} yrs` : "—" },
                    { label: "Gender", value: identity.gender || "—" },
                    { label: "Admission", value: identity.admissionType || "—" },
                    { label: "Date", value: identity.dateOfAdmission || "—" },
                  ].map((item) => (
                    <View key={item.label} style={styles.identityItem}>
                      <Text style={styles.identityItemLabel}>{item.label}</Text>
                      <Text style={styles.identityItemValue}>{item.value}</Text>
                    </View>
                  ))}
                </View>
                {identity.allergies ? (
                  <View style={styles.allergyBadge}>
                    <MaterialIcons name="warning" size={13} color="#D97706" />
                    <Text style={styles.allergyText}>Allergies: {identity.allergies}</Text>
                  </View>
                ) : null}
                {identity.previousBite && (
                  <View style={styles.prevBiteBadge}>
                    <MaterialIcons name="history" size={13} color="#7C3AED" />
                    <Text style={styles.prevBiteText}>Previous bite/exposure in last 10 years</Text>
                  </View>
                )}
              </View>
            )}

            {/* Exposure */}
            <View style={styles.card}>
              <Text style={styles.cardLabel}>EXPOSURE CLASSIFICATION</Text>
              <Text style={styles.exposureType}>{getTypeLabel(resolvedType)}</Text>
              <Text style={styles.timestamp}>{new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</Text>
            </View>

            {/* Symptoms */}
            {resolvedSymptoms.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.cardLabel}>OBSERVED SYMPTOMS ({resolvedSymptoms.length})</Text>
                {resolvedSymptoms.map((s: any, i: number) => (
                  <View key={i} style={styles.symptomRow}>
                    <View style={styles.symptomDot} />
                    <Text style={styles.symptomText}>{s.symptom}</Text>
                    <View style={styles.gradePill}>
                      <Text style={styles.gradeText}>Grade {s.grade}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Chief complaint */}
            {identity?.mainComplaint ? (
              <View style={styles.card}>
                <Text style={styles.cardLabel}>CHIEF COMPLAINT</Text>
                <Text style={styles.complaintText}>{identity.mainComplaint}</Text>
              </View>
            ) : null}

            {/* Nidana */}
            {identity?.nidana ? (
              <View style={styles.card}>
                <Text style={styles.cardLabel}>NIDANA (CAUSATIVE FACTOR)</Text>
                <Text style={styles.nidanaText}>{identity.nidana}</Text>
              </View>
            ) : null}

            {/* Notes */}
            <View style={styles.notesSection}>
              <Text style={styles.sectionTitle}>Clinical Impression & Agada Protocol Notes</Text>
              <TextInput
                multiline
                editable={!isReadonly}
                placeholder={isReadonly ? "No clinical notes recorded" : "Record clinical observations, visha vega assessment, planned Agada Tantra protocol..."}
                placeholderTextColor="#9CA3AF"
                style={[styles.notesInput, isReadonly && styles.notesInputReadonly]}
                value={notes}
                onChangeText={setNotes}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            {!isReadonly ? (
              <>
                <View style={styles.footerRow}>
                  <TouchableOpacity style={[styles.saveBtn, saved && styles.saveBtnDone]} onPress={handleSave} activeOpacity={0.7}>
                    <MaterialIcons name={saved ? "check" : "save"} size={18} color={saved ? "#fff" : "#C45E3D"} />
                    <Text style={[styles.saveBtnText, saved && { color: "#fff" }]}>{saved ? "Saved" : "Save Case"}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.newCaseBtn} onPress={() => router.replace("/home")} activeOpacity={0.7}>
                    <MaterialIcons name="add" size={18} color="#2563EB" />
                    <Text style={styles.newCaseBtnText}>New Case</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.pdfBtn} onPress={generatePDF} activeOpacity={0.8}>
                  <MaterialIcons name="picture-as-pdf" size={18} color="#fff" />
                  <Text style={styles.pdfText}>Export Full Clinical Report PDF</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={styles.pdfBtn} onPress={generatePDF} activeOpacity={0.8}>
                <MaterialIcons name="picture-as-pdf" size={18} color="#fff" />
                <Text style={styles.pdfText}>Export PDF Report</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F4E6" },
  scrollContent: { padding: 20, paddingBottom: 160 },
  readonlyBanner: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#EDE9FE", borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 10, marginBottom: 16, gap: 8,
  },
  readonlyText: { fontSize: 13, color: "#7C3AED", fontWeight: "600", flex: 1 },
  readonlyBackText: { fontSize: 12, color: "#7C3AED", fontWeight: "700" },
  headerSection: { alignItems: "center", marginBottom: 20 },
  title: { fontSize: 26, fontWeight: "800", marginTop: 12, color: "#1F2937" },
  headerSubtitle: { fontSize: 13, color: "#6B7280", marginTop: 4 },
  severityCard: { borderRadius: 18, padding: 20, marginBottom: 16, borderWidth: 2, alignItems: "center" },
  severityLabel: { fontSize: 10, fontWeight: "800", letterSpacing: 0.5, marginBottom: 8 },
  severityLevelText: { fontSize: 28, fontWeight: "900", marginBottom: 14 },
  severityMetrics: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  metricItem: { alignItems: "center", paddingHorizontal: 20 },
  metricValue: { fontSize: 22, fontWeight: "800" },
  metricLabel: { fontSize: 9, fontWeight: "800", letterSpacing: 0.5, marginTop: 2 },
  metricDivider: { width: 1, height: 36 },
  severityDesc: { fontSize: 13, fontWeight: "600", textAlign: "center" },
  card: {
    backgroundColor: "#fff", borderRadius: 18, padding: 20, marginBottom: 14,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  cardLabel: { fontSize: 10, fontWeight: "800", color: "#9CA3AF", marginBottom: 8, letterSpacing: 0.5 },
  patientName: { fontSize: 20, fontWeight: "800", color: "#1F2937", marginBottom: 14 },
  identityGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 12 },
  identityItem: { backgroundColor: "#F9FAFB", borderRadius: 10, padding: 10, minWidth: "45%" },
  identityItemLabel: { fontSize: 10, fontWeight: "700", color: "#9CA3AF" },
  identityItemValue: { fontSize: 14, fontWeight: "700", color: "#1F2937", marginTop: 2 },
  allergyBadge: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#FEF3C7", padding: 8, borderRadius: 10, marginTop: 4 },
  allergyText: { fontSize: 12, color: "#D97706", fontWeight: "600" },
  prevBiteBadge: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#EDE9FE", padding: 8, borderRadius: 10, marginTop: 6 },
  prevBiteText: { fontSize: 12, color: "#7C3AED", fontWeight: "600" },
  exposureType: { fontSize: 16, fontWeight: "700", color: "#1F2937", marginBottom: 4 },
  timestamp: { fontSize: 12, color: "#6B7280" },
  symptomRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#F1F5F9" },
  symptomDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#C45E3D" },
  symptomText: { flex: 1, fontSize: 13, color: "#374151", fontWeight: "500" },
  gradePill: { backgroundColor: "#F3F4F6", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  gradeText: { fontSize: 11, fontWeight: "700", color: "#6B7280" },
  complaintText: { fontSize: 14, color: "#374151", lineHeight: 20 },
  nidanaText: { fontSize: 13, color: "#6B7280", lineHeight: 20, fontStyle: "italic" },
  notesSection: { marginTop: 8 },
  sectionTitle: { fontSize: 14, fontWeight: "700", marginBottom: 10, color: "#1F2937" },
  notesInput: { backgroundColor: "#fff", borderRadius: 14, padding: 16, height: 120, fontSize: 13, borderWidth: 1, borderColor: "#E5E7EB" },
  notesInputReadonly: { color: "#9CA3AF", backgroundColor: "#F9FAFB" },
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: "#F2F4E6", borderTopWidth: 1, borderTopColor: "#E5E7EB" },
  footerRow: { flexDirection: "row", gap: 10, marginBottom: 10 },
  saveBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, padding: 14, borderRadius: 12, borderWidth: 2, borderColor: "#C45E3D", backgroundColor: "#fff" },
  saveBtnDone: { backgroundColor: "#10B981", borderColor: "#10B981" },
  saveBtnText: { fontWeight: "700", color: "#C45E3D", fontSize: 14 },
  newCaseBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, padding: 14, borderRadius: 12, borderWidth: 2, borderColor: "#2563EB", backgroundColor: "#fff" },
  newCaseBtnText: { fontWeight: "700", color: "#2563EB", fontSize: 14 },
  pdfBtn: { backgroundColor: "#1F2937", padding: 16, borderRadius: 14, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 6 },
  pdfText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});