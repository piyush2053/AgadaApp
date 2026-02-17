// ============================================================
// AGADA SANJEEVINI — Central Medical Data Schema
// All symptom data, questionnaires, and exposure categories
// ============================================================

export type Symptom = {
  id: string;
  title: string;
  titleSanskrit: string;
  category: string;
};

export type QuestionnaireItem = {
  id: string;
  question: string;
  type: "yesno" | "frequency";
};

export type FrequencyOption = "Never" | "Rarely" | "Occasionally" | "Frequently" | "Daily";

// ─────────────────────────────────────────────
// SNAKE BITES
// ─────────────────────────────────────────────

export const cobraSymptoms: Symptom[] = [
  { id: "cobra_01", title: "Local Swelling", titleSanskrit: "Shotha", category: "Local" },
  { id: "cobra_02", title: "Pain at Bite Site", titleSanskrit: "Vedana", category: "Local" },
  { id: "cobra_03", title: "Fang Marks", titleSanskrit: "Danda Chihn", category: "Local" },
  { id: "cobra_04", title: "Tissue Necrosis", titleSanskrit: "Mamsa Kshaya", category: "Local" },
  { id: "cobra_05", title: "Blister Formation", titleSanskrit: "Sphota", category: "Local" },
  { id: "cobra_06", title: "Ptosis (Drooping Eyelids)", titleSanskrit: "Pakshma Pata", category: "Neurological" },
  { id: "cobra_07", title: "Diplopia (Double Vision)", titleSanskrit: "Dvandva Drishti", category: "Neurological" },
  { id: "cobra_08", title: "Dysphagia (Difficulty Swallowing)", titleSanskrit: "Grasana Kasta", category: "Neurological" },
  { id: "cobra_09", title: "Dysphonia (Altered Voice)", titleSanskrit: "Swara Bheda", category: "Neurological" },
  { id: "cobra_10", title: "Facial Muscle Weakness", titleSanskrit: "Mukha Sthamba", category: "Neurological" },
  { id: "cobra_11", title: "Neck Muscle Weakness", titleSanskrit: "Griva Sthamba", category: "Neurological" },
  { id: "cobra_12", title: "Limb Weakness / Paralysis", titleSanskrit: "Anga Sthamba", category: "Neurological" },
  { id: "cobra_13", title: "Respiratory Failure", titleSanskrit: "Shwasa Rodha", category: "Respiratory" },
  { id: "cobra_14", title: "Breathing Difficulty", titleSanskrit: "Shwasa Kastha", category: "Respiratory" },
  { id: "cobra_15", title: "Excessive Salivation", titleSanskrit: "Praseka", category: "Gastrointestinal" },
  { id: "cobra_16", title: "Nausea", titleSanskrit: "Hrillasa", category: "Gastrointestinal" },
  { id: "cobra_17", title: "Vomiting", titleSanskrit: "Chhardi", category: "Gastrointestinal" },
  { id: "cobra_18", title: "Abdominal Pain", titleSanskrit: "Udara Shula", category: "Gastrointestinal" },
  { id: "cobra_19", title: "Hypotension (Low BP)", titleSanskrit: "Rakta Chapa Hrasa", category: "Cardiovascular" },
  { id: "cobra_20", title: "Bradycardia (Slow Pulse)", titleSanskrit: "Nadi Mandya", category: "Cardiovascular" },
  { id: "cobra_21", title: "Cardiac Arrhythmia", titleSanskrit: "Hridaya Vikrita", category: "Cardiovascular" },
  { id: "cobra_22", title: "Dizziness", titleSanskrit: "Bhrama", category: "General" },
  { id: "cobra_23", title: "Headache", titleSanskrit: "Shirah Shula", category: "General" },
  { id: "cobra_24", title: "Confusion / Altered Sensorium", titleSanskrit: "Moha", category: "General" },
  { id: "cobra_25", title: "Unconsciousness", titleSanskrit: "Murcha", category: "General" },
  { id: "cobra_26", title: "Convulsions", titleSanskrit: "Aakshepaka", category: "Neurological" },
  { id: "cobra_27", title: "Urinary Retention", titleSanskrit: "Mutra Sanga", category: "Urological" },
  { id: "cobra_28", title: "Dark Urine", titleSanskrit: "Krishna Mutra", category: "Urological" },
  { id: "cobra_29", title: "Skin Discoloration", titleSanskrit: "Varna Vikrita", category: "Dermatological" },
  { id: "cobra_30", title: "Cold Clammy Skin", titleSanskrit: "Shita Sparsha", category: "Dermatological" },
  { id: "cobra_31", title: "Death-like Appearance", titleSanskrit: "Mrita Lakshana", category: "General" },
];

export const viperSymptoms: Symptom[] = [
  { id: "viper_01", title: "Severe Local Pain", titleSanskrit: "Teevra Vedana", category: "Local" },
  { id: "viper_02", title: "Massive Swelling", titleSanskrit: "Maha Shotha", category: "Local" },
  { id: "viper_03", title: "Hemorrhagic Blister", titleSanskrit: "Rakta Sphota", category: "Local" },
  { id: "viper_04", title: "Tissue Necrosis", titleSanskrit: "Mamsa Nashta", category: "Local" },
  { id: "viper_05", title: "Bleeding from Bite Site", titleSanskrit: "Danstha Rakta Sruti", category: "Local" },
  { id: "viper_06", title: "Gum Bleeding", titleSanskrit: "Danta Mamsa Sruti", category: "Hemorrhagic" },
  { id: "viper_07", title: "Nasal Bleeding (Epistaxis)", titleSanskrit: "Nasa Rakta Sruti", category: "Hemorrhagic" },
  { id: "viper_08", title: "Blood in Urine (Hematuria)", titleSanskrit: "Rakta Mutra", category: "Hemorrhagic" },
  { id: "viper_09", title: "Blood in Stool", titleSanskrit: "Rakta Mala", category: "Hemorrhagic" },
  { id: "viper_10", title: "Vomiting Blood", titleSanskrit: "Rakta Chhardi", category: "Hemorrhagic" },
  { id: "viper_11", title: "Skin Petechiae / Purpura", titleSanskrit: "Tvak Rakta Bindu", category: "Dermatological" },
  { id: "viper_12", title: "Hypotension", titleSanskrit: "Rakta Chapa Hrasa", category: "Cardiovascular" },
  { id: "viper_13", title: "Tachycardia", titleSanskrit: "Nadi Vegata", category: "Cardiovascular" },
  { id: "viper_14", title: "Shock", titleSanskrit: "Vipada", category: "Cardiovascular" },
  { id: "viper_15", title: "Oliguria / Anuria", titleSanskrit: "Mutra Alpa / Kshaya", category: "Urological" },
  { id: "viper_16", title: "Renal Failure Signs", titleSanskrit: "Vrikka Vikara", category: "Urological" },
  { id: "viper_17", title: "Coagulopathy (Clotting Failure)", titleSanskrit: "Rakta Skandana Doshita", category: "Hemorrhagic" },
  { id: "viper_18", title: "DIC Signs (Disseminated Intravascular Coagulation)", titleSanskrit: "Sarvangi Rakta Vikara", category: "Hemorrhagic" },
];

export const kraitSymptoms: Symptom[] = [
  { id: "krait_01", title: "Minimal or No Local Swelling", titleSanskrit: "Alpa Shotha", category: "Local" },
  { id: "krait_02", title: "Faint Fang Marks", titleSanskrit: "Sukshma Chihn", category: "Local" },
  { id: "krait_03", title: "Abdominal Cramps", titleSanskrit: "Udara Shula", category: "Gastrointestinal" },
  { id: "krait_04", title: "Progressive Descending Paralysis", titleSanskrit: "Upagami Sthamba", category: "Neurological" },
  { id: "krait_05", title: "Ptosis", titleSanskrit: "Pakshma Pata", category: "Neurological" },
  { id: "krait_06", title: "Respiratory Failure", titleSanskrit: "Shwasa Nasha", category: "Respiratory" },
  { id: "krait_07", title: "Death (if untreated)", titleSanskrit: "Mrityu", category: "General" },
];

// ─────────────────────────────────────────────
// SCORPION
// ─────────────────────────────────────────────

export const scorpionSymptoms: Symptom[] = [
  { id: "scorp_01", title: "Intense Local Pain", titleSanskrit: "Teevra Daha", category: "Local" },
  { id: "scorp_02", title: "Local Swelling", titleSanskrit: "Desha Shotha", category: "Local" },
  { id: "scorp_03", title: "Excessive Sweating", titleSanskrit: "Sveda Adhikya", category: "Autonomic" },
  { id: "scorp_04", title: "Hypertension", titleSanskrit: "Rakta Chapa Vriddhi", category: "Cardiovascular" },
  { id: "scorp_05", title: "Tachycardia", titleSanskrit: "Nadi Vegata", category: "Cardiovascular" },
  { id: "scorp_06", title: "Pulmonary Edema", titleSanskrit: "Phupphusa Shotha", category: "Respiratory" },
  { id: "scorp_07", title: "Priapism (Males)", titleSanskrit: "Shishna Utthana", category: "Autonomic" },
];

// ─────────────────────────────────────────────
// INSECT
// ─────────────────────────────────────────────

export const insectSymptoms: Symptom[] = [
  { id: "insect_01", title: "Local Pain and Swelling", titleSanskrit: "Danstha Shotha", category: "Local" },
  { id: "insect_02", title: "Urticaria / Hives", titleSanskrit: "Sheetapitta", category: "Allergic" },
  { id: "insect_03", title: "Anaphylaxis", titleSanskrit: "Sarvanga Visarpa", category: "Allergic" },
  { id: "insect_04", title: "Bronchospasm", titleSanskrit: "Shwasa Sankocha", category: "Respiratory" },
  { id: "insect_05", title: "Hypotension / Shock", titleSanskrit: "Vipada", category: "Cardiovascular" },
];

// ─────────────────────────────────────────────
// DOG BITE
// ─────────────────────────────────────────────

export const dogSymptoms: Symptom[] = [
  { id: "dog_01", title: "Wound / Laceration", titleSanskrit: "Vrana", category: "Local" },
  { id: "dog_02", title: "Bleeding", titleSanskrit: "Rakta Sruti", category: "Local" },
  { id: "dog_03", title: "Hydrophobia (Fear of Water)", titleSanskrit: "Jala Bhaya", category: "Neurological" },
  { id: "dog_04", title: "Aerophobia (Fear of Air)", titleSanskrit: "Vayu Bhaya", category: "Neurological" },
  { id: "dog_05", title: "Hypersalivation", titleSanskrit: "Lala Sruti", category: "Neurological" },
  { id: "dog_06", title: "Agitation / Aggression", titleSanskrit: "Krodha", category: "Neurological" },
  { id: "dog_07", title: "Fever", titleSanskrit: "Jwara", category: "General" },
  { id: "dog_08", title: "Paralysis (Late Stage)", titleSanskrit: "Sthamba", category: "Neurological" },
];

// ─────────────────────────────────────────────
// RAT BITE
// ─────────────────────────────────────────────

export const ratSymptoms: Symptom[] = [
  { id: "rat_01", title: "Puncture Wound", titleSanskrit: "Chhedana Vrana", category: "Local" },
  { id: "rat_02", title: "Local Swelling", titleSanskrit: "Shotha", category: "Local" },
  { id: "rat_03", title: "Intermittent Fever", titleSanskrit: "Vishamajwara", category: "Systemic" },
  { id: "rat_04", title: "Chills", titleSanskrit: "Shita Kampana", category: "Systemic" },
  { id: "rat_05", title: "Headache", titleSanskrit: "Shirah Shula", category: "Systemic" },
  { id: "rat_06", title: "Muscle Pain (Myalgia)", titleSanskrit: "Mamsa Vedana", category: "Systemic" },
  { id: "rat_07", title: "Joint Pain (Arthralgia)", titleSanskrit: "Sandhi Vedana", category: "Systemic" },
  { id: "rat_08", title: "Skin Rash", titleSanskrit: "Tvak Vikara", category: "Dermatological" },
  { id: "rat_09", title: "Lymph Node Enlargement", titleSanskrit: "Granthi Vriddhi", category: "Systemic" },
  { id: "rat_10", title: "Vomiting", titleSanskrit: "Chhardi", category: "Gastrointestinal" },
  { id: "rat_11", title: "Diarrhea", titleSanskrit: "Atisara", category: "Gastrointestinal" },
  { id: "rat_12", title: "Abdominal Pain", titleSanskrit: "Udara Shula", category: "Gastrointestinal" },
  { id: "rat_13", title: "Jaundice", titleSanskrit: "Kamala", category: "Systemic" },
  { id: "rat_14", title: "Renal Dysfunction", titleSanskrit: "Vrikka Vikara", category: "Urological" },
  { id: "rat_15", title: "Bleeding Tendency", titleSanskrit: "Rakta Pravritti", category: "Hemorrhagic" },
  { id: "rat_16", title: "Meningeal Signs", titleSanskrit: "Mastishka Avarana Vikara", category: "Neurological" },
  { id: "rat_17", title: "Splenomegaly", titleSanskrit: "Pliha Vriddhi", category: "Systemic" },
  { id: "rat_18", title: "Hepatomegaly", titleSanskrit: "Yakrit Vriddhi", category: "Systemic" },
  { id: "rat_19", title: "Conjunctival Hemorrhage", titleSanskrit: "Netra Rakta", category: "Ocular" },
  { id: "rat_20", title: "Pulmonary Hemorrhage", titleSanskrit: "Phupphusa Rakta", category: "Respiratory" },
];

// ─────────────────────────────────────────────
// OTHER ANIMAL BITES (General)
// ─────────────────────────────────────────────

export const animalBiteSymptoms: Symptom[] = [
  { id: "animal_01", title: "Wound / Laceration", titleSanskrit: "Vrana", category: "Local" },
  { id: "animal_02", title: "Bleeding", titleSanskrit: "Rakta Sruti", category: "Local" },
  { id: "animal_03", title: "Swelling", titleSanskrit: "Shotha", category: "Local" },
  { id: "animal_04", title: "Pain", titleSanskrit: "Vedana", category: "Local" },
  { id: "animal_05", title: "Infection Signs", titleSanskrit: "Purna Vrana", category: "Local" },
  { id: "animal_06", title: "Fever", titleSanskrit: "Jwara", category: "Systemic" },
  { id: "animal_07", title: "Lymphadenopathy", titleSanskrit: "Granthi Shotha", category: "Systemic" },
  { id: "animal_08", title: "Septicemia Signs", titleSanskrit: "Rakta Dusthi", category: "Systemic" },
  { id: "animal_09", title: "Nausea", titleSanskrit: "Hrillasa", category: "Gastrointestinal" },
  { id: "animal_10", title: "Vomiting", titleSanskrit: "Chhardi", category: "Gastrointestinal" },
  { id: "animal_11", title: "Dizziness", titleSanskrit: "Bhrama", category: "Neurological" },
  { id: "animal_12", title: "Headache", titleSanskrit: "Shirah Shula", category: "Neurological" },
  { id: "animal_13", title: "Tremors", titleSanskrit: "Kampa", category: "Neurological" },
  { id: "animal_14", title: "Confusion", titleSanskrit: "Moha", category: "Neurological" },
  { id: "animal_15", title: "Skin Rash", titleSanskrit: "Mandala", category: "Dermatological" },
  { id: "animal_16", title: "Allergic Reaction", titleSanskrit: "Apakarsha", category: "Allergic" },
  { id: "animal_17", title: "Respiratory Distress", titleSanskrit: "Shwasa Kastha", category: "Respiratory" },
  { id: "animal_18", title: "Chest Pain", titleSanskrit: "Hrit Shula", category: "Cardiovascular" },
  { id: "animal_19", title: "Palpitations", titleSanskrit: "Hrid Spandana", category: "Cardiovascular" },
  { id: "animal_20", title: "Hypotension", titleSanskrit: "Rakta Chapa Hrasa", category: "Cardiovascular" },
  { id: "animal_21", title: "Muscle Cramps", titleSanskrit: "Mamsa Akunchana", category: "Musculoskeletal" },
  { id: "animal_22", title: "Joint Stiffness", titleSanskrit: "Sandhi Graha", category: "Musculoskeletal" },
  { id: "animal_23", title: "Paralysis", titleSanskrit: "Sthamba", category: "Neurological" },
  { id: "animal_24", title: "Vision Changes", titleSanskrit: "Drishti Vikara", category: "Ocular" },
  { id: "animal_25", title: "Urinary Changes", titleSanskrit: "Mutra Vikara", category: "Urological" },
  { id: "animal_26", title: "Clotting Issues", titleSanskrit: "Skandana Vikara", category: "Hemorrhagic" },
  { id: "animal_27", title: "Loss of Consciousness", titleSanskrit: "Murcha", category: "Neurological" },
];

// ─────────────────────────────────────────────
// EXTERNAL CONTACT EXPOSURE CATEGORIES
// ─────────────────────────────────────────────

export type ExternalCategory = {
  id: string;
  label: string;
  labelSanskrit: string;
  description: string;
  symptoms: Symptom[];
};

export const externalCategories: ExternalCategory[] = [
  {
    id: "savisha_vastra",
    label: "Toxic Clothing Contact",
    labelSanskrit: "Savisha Vastradharana",
    description: "Contact with poison-contaminated clothing or fabric",
    symptoms: [
      { id: "ev_01", title: "Skin Redness", titleSanskrit: "Tvak Rakta", category: "Dermatological" },
      { id: "ev_02", title: "Burning Sensation", titleSanskrit: "Daha", category: "Dermatological" },
      { id: "ev_03", title: "Itching", titleSanskrit: "Kandu", category: "Dermatological" },
      { id: "ev_04", title: "Rash / Urticaria", titleSanskrit: "Kotha", category: "Dermatological" },
    ],
  },
  {
    id: "savisha_mukha",
    label: "Toxic Face Application",
    labelSanskrit: "Savisha Mukhalepa",
    description: "Application of poison-laden face paste or cosmetic",
    symptoms: [
      { id: "em_01", title: "Facial Burning", titleSanskrit: "Mukha Daha", category: "Local" },
      { id: "em_02", title: "Swelling of Face", titleSanskrit: "Mukha Shotha", category: "Local" },
      { id: "em_03", title: "Eye Irritation", titleSanskrit: "Netra Raga", category: "Ocular" },
      { id: "em_04", title: "Blurred Vision", titleSanskrit: "Drishti Dhundha", category: "Ocular" },
      { id: "em_05", title: "Headache", titleSanskrit: "Shirah Shula", category: "Neurological" },
    ],
  },
  {
    id: "savisha_snana",
    label: "Toxic Bath / Water Exposure",
    labelSanskrit: "Savisha Snana",
    description: "Bathing in or contact with toxic water or solution",
    symptoms: [
      { id: "es_01", title: "Diffuse Skin Irritation", titleSanskrit: "Sarvangi Tvak Kopa", category: "Dermatological" },
      { id: "es_02", title: "Hair Loss", titleSanskrit: "Kesha Pata", category: "Dermatological" },
      { id: "es_03", title: "Nail Discoloration", titleSanskrit: "Nakha Vikara", category: "Dermatological" },
      { id: "es_04", title: "Systemic Absorption Signs", titleSanskrit: "Sarira Vikara", category: "Systemic" },
    ],
  },
  {
    id: "savisha_gandha",
    label: "Toxic Fragrance / Inhalation",
    labelSanskrit: "Savisha Gandha Seva",
    description: "Inhalation of toxic fumes, gases, or fragrances",
    symptoms: [
      { id: "eg_01", title: "Headache", titleSanskrit: "Shirah Shula", category: "Neurological" },
      { id: "eg_02", title: "Dizziness", titleSanskrit: "Bhrama", category: "Neurological" },
      { id: "eg_03", title: "Nausea", titleSanskrit: "Hrillasa", category: "Gastrointestinal" },
      { id: "eg_04", title: "Respiratory Irritation", titleSanskrit: "Shwasa Daha", category: "Respiratory" },
      { id: "eg_05", title: "Eye Watering", titleSanskrit: "Ashru Sruti", category: "Ocular" },
    ],
  },
  {
    id: "savisha_dhupa",
    label: "Toxic Smoke Exposure",
    labelSanskrit: "Savisha Dhoopa Seva",
    description: "Exposure to toxic smoke or fumigation substances",
    symptoms: [
      { id: "ed_01", title: "Coughing", titleSanskrit: "Kasa", category: "Respiratory" },
      { id: "ed_02", title: "Choking", titleSanskrit: "Shwasa Rodha", category: "Respiratory" },
      { id: "ed_03", title: "Watery Eyes", titleSanskrit: "Netra Sruti", category: "Ocular" },
      { id: "ed_04", title: "Chest Tightness", titleSanskrit: "Vaksha Sthabdata", category: "Respiratory" },
      { id: "ed_05", title: "Altered Consciousness", titleSanskrit: "Chit Vikara", category: "Neurological" },
    ],
  },
  {
    id: "savisha_anjana",
    label: "Toxic Eye Application",
    labelSanskrit: "Savisha Anjana",
    description: "Application of toxic collyrium or eye drops",
    symptoms: [
      { id: "ea_01", title: "Eye Pain", titleSanskrit: "Netra Vedana", category: "Ocular" },
      { id: "ea_02", title: "Redness of Eyes", titleSanskrit: "Netra Raga", category: "Ocular" },
      { id: "ea_03", title: "Vision Loss", titleSanskrit: "Drishti Nasha", category: "Ocular" },
      { id: "ea_04", title: "Photophobia", titleSanskrit: "Arka Asahishnutva", category: "Ocular" },
    ],
  },
  {
    id: "savisha_lepana",
    label: "Toxic Skin Application",
    labelSanskrit: "Savisha Ang Lepana",
    description: "Application of toxic paste or substance on body",
    symptoms: [
      { id: "el_01", title: "Local Burns", titleSanskrit: "Desha Dagdha", category: "Local" },
      { id: "el_02", title: "Skin Peeling", titleSanskrit: "Tvak Patana", category: "Dermatological" },
      { id: "el_03", title: "Abscess Formation", titleSanskrit: "Vidradhi", category: "Dermatological" },
      { id: "el_04", title: "Systemic Toxicity", titleSanskrit: "Sarira Visha", category: "Systemic" },
    ],
  },
  {
    id: "savisha_nasya",
    label: "Toxic Nasal Administration",
    labelSanskrit: "Savisha Nasya",
    description: "Nasal instillation of toxic substance",
    symptoms: [
      { id: "en_01", title: "Nasal Burning", titleSanskrit: "Nasa Daha", category: "Local" },
      { id: "en_02", title: "Nasal Bleeding", titleSanskrit: "Nasa Sruti", category: "Hemorrhagic" },
      { id: "en_03", title: "Severe Headache", titleSanskrit: "Teevra Shirah Shula", category: "Neurological" },
      { id: "en_04", title: "Altered Consciousness", titleSanskrit: "Sanjnana Vikara", category: "Neurological" },
    ],
  },
  {
    id: "savisha_karnapurana",
    label: "Toxic Ear Instillation",
    labelSanskrit: "Savisha Karnapurana",
    description: "Instillation of toxic substance into the ear",
    symptoms: [
      { id: "ek_01", title: "Ear Pain", titleSanskrit: "Karna Vedana", category: "Local" },
      { id: "ek_02", title: "Tinnitus", titleSanskrit: "Karna Nada", category: "Neurological" },
      { id: "ek_03", title: "Hearing Loss", titleSanskrit: "Shravana Hrasa", category: "Neurological" },
      { id: "ek_04", title: "Vertigo", titleSanskrit: "Bhrama", category: "Neurological" },
    ],
  },
  {
    id: "savisha_pana",
    label: "Toxic Drink Ingestion",
    labelSanskrit: "Savisha Pana",
    description: "Accidental ingestion of toxic liquid",
    symptoms: [
      { id: "ep_01", title: "Oral Burning", titleSanskrit: "Mukha Daha", category: "Local" },
      { id: "ep_02", title: "Dysphagia", titleSanskrit: "Grasana Kastha", category: "Gastrointestinal" },
      { id: "ep_03", title: "Vomiting", titleSanskrit: "Chhardi", category: "Gastrointestinal" },
      { id: "ep_04", title: "Abdominal Pain", titleSanskrit: "Udara Shula", category: "Gastrointestinal" },
      { id: "ep_05", title: "Systemic Toxicity", titleSanskrit: "Sarira Visha Vikara", category: "Systemic" },
    ],
  },
  {
    id: "savisha_shareera",
    label: "Full Body Toxic Contact",
    labelSanskrit: "Savisha Shareera Lepa",
    description: "Full body smearing with toxic substance",
    symptoms: [
      { id: "esh_01", title: "Diffuse Skin Irritation", titleSanskrit: "Sarvangi Kotha", category: "Dermatological" },
      { id: "esh_02", title: "Systemic Absorption", titleSanskrit: "Visha Sharira Pravesha", category: "Systemic" },
      { id: "esh_03", title: "Liver Toxicity Signs", titleSanskrit: "Yakrit Vikara", category: "Systemic" },
      { id: "esh_04", title: "Renal Toxicity Signs", titleSanskrit: "Vrikka Vikara", category: "Urological" },
    ],
  },
  {
    id: "savisha_marma",
    label: "Vital Point Toxic Contact",
    labelSanskrit: "Savisha Marma Sparsha",
    description: "Toxic contact at vital marma points",
    symptoms: [
      { id: "emr_01", title: "Sudden Collapse", titleSanskrit: "Akasmika Patana", category: "Neurological" },
      { id: "emr_02", title: "Cardiac Disturbance", titleSanskrit: "Hridaya Vikara", category: "Cardiovascular" },
      { id: "emr_03", title: "Respiratory Arrest", titleSanskrit: "Shwasa Nasha", category: "Respiratory" },
      { id: "emr_04", title: "Loss of Consciousness", titleSanskrit: "Chit Lopa", category: "Neurological" },
    ],
  },
];

// ─────────────────────────────────────────────
// GARA VISHA QUESTIONNAIRE (10 Questions)
// ─────────────────────────────────────────────

export const garaVishaQuestionnaire: QuestionnaireItem[] = [
  { id: "gv_01", question: "Did symptoms start after consuming a specific food or drink outside home?", type: "yesno" },
  { id: "gv_02", question: "Was there a change in taste (bitter, sour, foul) in food or water before consumption?", type: "yesno" },
  { id: "gv_03", question: "Did multiple people who ate the same food also fall ill?", type: "yesno" },
  { id: "gv_04", question: "Did symptoms appear gradually over hours or days (not sudden onset)?", type: "yesno" },
  { id: "gv_05", question: "Has the patient been exposed to contaminated well water or stored water?", type: "yesno" },
  { id: "gv_06", question: "Has the patient consumed food with unusual smell, color, or texture?", type: "yesno" },
  { id: "gv_07", question: "Is there a history of chronic intermittent poisoning symptoms (recurrent)?", type: "yesno" },
  { id: "gv_08", question: "Is the patient in a hostile environment (disputes, family conflicts)?", type: "yesno" },
  { id: "gv_09", question: "Did the patient consume food prepared by an unfamiliar or new person?", type: "yesno" },
  { id: "gv_10", question: "Did the patient experience relief after fasting or stopping a specific food?", type: "yesno" },
];

// ─────────────────────────────────────────────
// DUSHI VISHA QUESTIONNAIRE (10 Questions)
// ─────────────────────────────────────────────

export const dushiVishaQuestionnaire: QuestionnaireItem[] = [
  { id: "dv_01", question: "Has the patient had past exposure to snake bite, insect bite, or toxic substance that was treated and apparently resolved?", type: "yesno" },
  { id: "dv_02", question: "Did symptoms recur after months or years of apparent wellbeing?", type: "yesno" },
  { id: "dv_03", question: "Is there chronic unexplained fatigue, weight loss, or wasting?", type: "yesno" },
  { id: "dv_04", question: "Are symptoms worsened by seasonal changes (especially rainy/cold seasons)?", type: "yesno" },
  { id: "dv_05", question: "Does the patient have recurrent skin disorders without clear cause?", type: "yesno" },
  { id: "dv_06", question: "Is there recurring fever of unknown origin?", type: "yesno" },
  { id: "dv_07", question: "Has the patient experienced progressive weakness or loss of function over months?", type: "yesno" },
  { id: "dv_08", question: "Does the patient have recurrent joint pain or swelling?", type: "yesno" },
  { id: "dv_09", question: "Are digestive complaints persistent without treatable cause?", type: "yesno" },
  { id: "dv_10", question: "Did the patient use Shodhana (purification) therapy that temporarily resolved symptoms?", type: "yesno" },
];

// ─────────────────────────────────────────────
// VIRRUDDHA AAHARA (Incompatible Food) Scoring
// ─────────────────────────────────────────────

export type VirruddhaItem = {
  id: string;
  food: string;
  combination: string;
  sanskritName: string;
};

export const virruddhaAaharaItems: VirruddhaItem[] = [
  { id: "va_01", food: "Milk + Fish", combination: "Dairy with seafood", sanskritName: "Ksheera-Matsya" },
  { id: "va_02", food: "Milk + Sour Fruits", combination: "Dairy with acidic fruits", sanskritName: "Ksheera-Amla Phala" },
  { id: "va_03", food: "Honey + Ghee (equal parts)", combination: "Equal measure mixing", sanskritName: "Madhu-Ghrita Samana" },
  { id: "va_04", food: "Honey + Hot Water/Food", combination: "Heated honey consumption", sanskritName: "Ushna Madhu" },
  { id: "va_05", food: "Milk + Salt", combination: "Dairy with salt together", sanskritName: "Ksheera-Lavana" },
  { id: "va_06", food: "Curds / Yogurt at Night", combination: "Night-time curd consumption", sanskritName: "Ratri Dadhi" },
  { id: "va_07", food: "Radish + Milk", combination: "Mula-Ksheera combination", sanskritName: "Mula-Ksheera" },
  { id: "va_08", food: "Banana + Milk", combination: "Kadali-Ksheera combination", sanskritName: "Kadali-Ksheera" },
  { id: "va_09", food: "Non-veg + Milk", combination: "Mamsa-Ksheera combination", sanskritName: "Mamsa-Ksheera" },
  { id: "va_10", food: "Sprouts + Milk", combination: "Ankurita Dhanya-Ksheera", sanskritName: "Ankura-Ksheera" },
];

export const frequencyOptions: FrequencyOption[] = ["Never", "Rarely", "Occasionally", "Frequently", "Daily"];

export const frequencyScore: Record<FrequencyOption, number> = {
  "Never": 0,
  "Rarely": 1,
  "Occasionally": 2,
  "Frequently": 3,
  "Daily": 4,
};

// ─────────────────────────────────────────────
// MASTER LOOKUP — get symptoms by type key
// ─────────────────────────────────────────────

export function getSymptomsForType(type: string): Symptom[] {
  switch (type) {
    case "cobra": return cobraSymptoms;
    case "viper": return viperSymptoms;
    case "krait": return kraitSymptoms;
    case "scorpion": return scorpionSymptoms;
    case "spider":
    case "insect": return insectSymptoms;
    case "dog": return dogSymptoms;
    case "rat": return ratSymptoms;
    case "animal": return animalBiteSymptoms;
    // food types
    case "mushroom":
    case "seafood":
    case "chemical":
    case "pesticide":
    case "spoiled":
    case "plant": return animalBiteSymptoms.slice(0, 15); // generic food poisoning proxy
    default: return animalBiteSymptoms;
  }
}

export function getTotalSymptomCount(type: string): number {
  return getSymptomsForType(type).length;
}