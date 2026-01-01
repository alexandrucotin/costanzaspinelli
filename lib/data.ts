import fs from "fs/promises";
import path from "path";
import { Exercise, WorkoutPlan, ContactSubmission } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const EXERCISES_FILE = path.join(DATA_DIR, "exercises.json");
const PLANS_FILE = path.join(DATA_DIR, "plans.json");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");
const EXPORTS_DIR = path.join(DATA_DIR, "exports");

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function ensureExportsDir() {
  try {
    await fs.access(EXPORTS_DIR);
  } catch {
    await fs.mkdir(EXPORTS_DIR, { recursive: true });
  }
}

async function readJsonFile<T>(filePath: string, defaultValue: T): Promise<T> {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return defaultValue;
  }
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export async function getExercises(): Promise<Exercise[]> {
  return readJsonFile<Exercise[]>(EXERCISES_FILE, []);
}

export async function getExerciseById(id: string): Promise<Exercise | null> {
  const exercises = await getExercises();
  return exercises.find((ex) => ex.id === id) || null;
}

export async function saveExercise(exercise: Exercise): Promise<void> {
  const exercises = await getExercises();
  const existingIndex = exercises.findIndex((ex) => ex.id === exercise.id);

  if (existingIndex >= 0) {
    exercises[existingIndex] = exercise;
  } else {
    exercises.push(exercise);
  }

  await writeJsonFile(EXERCISES_FILE, exercises);
}

export async function deleteExercise(id: string): Promise<void> {
  const exercises = await getExercises();
  const filtered = exercises.filter((ex) => ex.id !== id);
  await writeJsonFile(EXERCISES_FILE, filtered);
}

export async function getPlans(): Promise<WorkoutPlan[]> {
  const plans = await readJsonFile<WorkoutPlan[]>(PLANS_FILE, []);
  return plans.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export async function getPlanById(id: string): Promise<WorkoutPlan | null> {
  const plans = await getPlans();
  return plans.find((plan) => plan.id === id) || null;
}

export async function savePlan(plan: WorkoutPlan): Promise<void> {
  const plans = await getPlans();
  const existingIndex = plans.findIndex((p) => p.id === plan.id);

  if (existingIndex >= 0) {
    plans[existingIndex] = plan;
  } else {
    plans.push(plan);
  }

  await writeJsonFile(PLANS_FILE, plans);
}

export async function deletePlan(id: string): Promise<void> {
  const plans = await getPlans();
  const filtered = plans.filter((p) => p.id !== id);
  await writeJsonFile(PLANS_FILE, filtered);
}

export async function duplicatePlan(id: string): Promise<WorkoutPlan | null> {
  const plan = await getPlanById(id);
  if (!plan) return null;

  const newPlan: WorkoutPlan = {
    ...plan,
    id: `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: `${plan.title} (Copia)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await savePlan(newPlan);
  return newPlan;
}

export async function saveContactSubmission(
  submission: ContactSubmission
): Promise<void> {
  const submissions = await readJsonFile<ContactSubmission[]>(LEADS_FILE, []);
  submissions.push(submission);
  await writeJsonFile(LEADS_FILE, submissions);
}

export async function savePdfExport(
  planId: string,
  pdfBuffer: Buffer
): Promise<string> {
  await ensureExportsDir();
  const filename = `${planId}_${Date.now()}.pdf`;
  const filepath = path.join(EXPORTS_DIR, filename);
  await fs.writeFile(filepath, pdfBuffer);
  return filename;
}

export async function getPdfExportPath(filename: string): Promise<string> {
  return path.join(EXPORTS_DIR, filename);
}
