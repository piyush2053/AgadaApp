// ============================================================
// AGADA SANJEEVINI — Storage Service (AsyncStorage)
// Offline case saving, listing, and reopening
// ============================================================

import AsyncStorage from "@react-native-async-storage/async-storage";

export type SavedCase = {
  id: string;
  createdAt: string;
  updatedAt: string;
  identity: PatientIdentity | null;
  exposureType: string | null;
  biteType: string | null;
  snakeSubType: string | null;
  symptoms: SelectedSymptom[];
  severityPercentage: number;
  severityLevel: string;
  notes: string;
  garaVishaAnswers?: Record<string, boolean>;
  dushiVishaAnswers?: Record<string, boolean>;
  virruddhaScores?: Record<string, number>;
};

export type PatientIdentity = {
  role: string;
  name: string;
  age: string;
  gender: string;
  occupation: string;
  address: string;
  dateOfAdmission: string;
  maritalStatus: string;
  admissionType: string;
  opdNumber: string;
  ipdNumber: string;
  socioStatus: string;
  mainComplaint: string;
  associatedComplaints: string;
  allergies: string;
  history: string;
  previousBite: boolean;
  nidana: string;
};

export type SelectedSymptom = {
  symptom: string;
  grade: number;
};

const CASES_KEY = "agada_cases";
const DRAFT_KEY = "agada_draft";

// ─────────────────────────────────────────────
// CASE CRUD OPERATIONS
// ─────────────────────────────────────────────

/** Get all saved cases */
export async function getAllCases(): Promise<SavedCase[]> {
  try {
    const raw = await AsyncStorage.getItem(CASES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedCase[];
  } catch {
    return [];
  }
}

/** Get a single case by ID */
export async function getCaseById(id: string): Promise<SavedCase | null> {
  try {
    const cases = await getAllCases();
    return cases.find((c) => c.id === id) || null;
  } catch {
    return null;
  }
}

/** Save a new case or update existing */
export async function saveCase(data: Omit<SavedCase, "id" | "createdAt" | "updatedAt"> & { id?: string }): Promise<SavedCase> {
  const cases = await getAllCases();
  const now = new Date().toISOString();

  if (data.id) {
    // Update existing
    const idx = cases.findIndex((c) => c.id === data.id);
    const updated: SavedCase = { ...data, id: data.id, createdAt: cases[idx]?.createdAt || now, updatedAt: now };
    if (idx >= 0) {
      cases[idx] = updated;
    } else {
      cases.unshift(updated);
    }
    await AsyncStorage.setItem(CASES_KEY, JSON.stringify(cases));
    return updated;
  } else {
    // Create new
    const newCase: SavedCase = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    cases.unshift(newCase);
    await AsyncStorage.setItem(CASES_KEY, JSON.stringify(cases));
    return newCase;
  }
}

/** Delete a case */
export async function deleteCase(id: string): Promise<void> {
  const cases = await getAllCases();
  const filtered = cases.filter((c) => c.id !== id);
  await AsyncStorage.setItem(CASES_KEY, JSON.stringify(filtered));
}

// ─────────────────────────────────────────────
// DRAFT SESSION (current in-progress case)
// ─────────────────────────────────────────────

/** Save current in-progress draft */
export async function saveDraft(draft: Partial<SavedCase>): Promise<void> {
  try {
    await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch (e) {
    console.warn("Draft save failed:", e);
  }
}

/** Load current in-progress draft */
export async function loadDraft(): Promise<Partial<SavedCase> | null> {
  try {
    const raw = await AsyncStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Clear the draft after saving */
export async function clearDraft(): Promise<void> {
  try {
    await AsyncStorage.removeItem(DRAFT_KEY);
  } catch {
    // silent
  }
}

// ─────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────

function generateId(): string {
  return `case_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function formatCaseDate(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}