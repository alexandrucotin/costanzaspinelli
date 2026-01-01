import { getStore } from "@netlify/blobs";
import {
  Exercise,
  WorkoutPlan,
  ContactSubmission,
  Tool,
  MuscleGroup,
  Category,
} from "./types";

// Netlify Blobs stores
const getExercisesStore = () => getStore("exercises");
const getPlansStore = () => getStore("plans");
const getLeadsStore = () => getStore("leads");
const getToolsStore = () => getStore("tools");
const getMuscleGroupsStore = () => getStore("muscle-groups");
const getCategoriesStore = () => getStore("categories");

// Exercises
export async function getExercises(): Promise<Exercise[]> {
  const store = getExercisesStore();
  const data = await store.get("all", { type: "json" });
  return (data as Exercise[]) || [];
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

  const store = getExercisesStore();
  await store.setJSON("all", exercises);
}

export async function deleteExercise(id: string): Promise<void> {
  const exercises = await getExercises();
  const filtered = exercises.filter((ex) => ex.id !== id);
  const store = getExercisesStore();
  await store.setJSON("all", filtered);
}

// Plans
export async function getPlans(): Promise<WorkoutPlan[]> {
  const store = getPlansStore();
  const data = await store.get("all", { type: "json" });
  const plans = (data as WorkoutPlan[]) || [];
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

  const store = getPlansStore();
  await store.setJSON("all", plans);
}

export async function deletePlan(id: string): Promise<void> {
  const plans = await getPlans();
  const filtered = plans.filter((p) => p.id !== id);
  const store = getPlansStore();
  await store.setJSON("all", filtered);
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

// Contact Submissions
export async function saveContactSubmission(
  submission: ContactSubmission
): Promise<void> {
  const store = getLeadsStore();
  const data = await store.get("all", { type: "json" });
  const submissions = (data as ContactSubmission[]) || [];
  submissions.push(submission);
  await store.setJSON("all", submissions);
}

// PDF Exports - Store as blobs
export async function savePdfExport(
  planId: string,
  pdfBuffer: Buffer
): Promise<string> {
  const store = getStore("pdf-exports");
  const filename = `${planId}_${Date.now()}.pdf`;
  // Store as string (base64) to avoid ArrayBuffer type issues
  await store.set(filename, pdfBuffer.toString("base64"));
  return filename;
}

export async function getPdfExport(filename: string): Promise<Buffer | null> {
  const store = getStore("pdf-exports");
  const data = await store.get(filename, { type: "text" });
  return data ? Buffer.from(data, "base64") : null;
}

// Tools
export async function getTools(): Promise<Tool[]> {
  const store = getToolsStore();
  const data = await store.get("all", { type: "json" });
  return (data as Tool[]) || [];
}

export async function saveTool(tool: Tool): Promise<void> {
  const tools = await getTools();
  const existingIndex = tools.findIndex((t) => t.id === tool.id);

  if (existingIndex >= 0) {
    tools[existingIndex] = tool;
  } else {
    tools.push(tool);
  }

  const store = getToolsStore();
  await store.setJSON("all", tools);
}

export async function deleteTool(id: string): Promise<void> {
  const tools = await getTools();
  const filtered = tools.filter((t) => t.id !== id);
  const store = getToolsStore();
  await store.setJSON("all", filtered);
}

// Muscle Groups
export async function getMuscleGroups(): Promise<MuscleGroup[]> {
  const store = getMuscleGroupsStore();
  const data = await store.get("all", { type: "json" });
  return (data as MuscleGroup[]) || [];
}

export async function saveMuscleGroup(group: MuscleGroup): Promise<void> {
  const groups = await getMuscleGroups();
  const existingIndex = groups.findIndex((g) => g.id === group.id);

  if (existingIndex >= 0) {
    groups[existingIndex] = group;
  } else {
    groups.push(group);
  }

  const store = getMuscleGroupsStore();
  await store.setJSON("all", groups);
}

export async function deleteMuscleGroup(id: string): Promise<void> {
  const groups = await getMuscleGroups();
  const filtered = groups.filter((g) => g.id !== id);
  const store = getMuscleGroupsStore();
  await store.setJSON("all", filtered);
}

// Categories
export async function getCategories(): Promise<Category[]> {
  const store = getCategoriesStore();
  const data = await store.get("all", { type: "json" });
  return (data as Category[]) || [];
}

export async function saveCategory(category: Category): Promise<void> {
  const categories = await getCategories();
  const existingIndex = categories.findIndex((c) => c.id === category.id);

  if (existingIndex >= 0) {
    categories[existingIndex] = category;
  } else {
    categories.push(category);
  }

  const store = getCategoriesStore();
  await store.setJSON("all", categories);
}

export async function deleteCategory(id: string): Promise<void> {
  const categories = await getCategories();
  const filtered = categories.filter((c) => c.id !== id);
  const store = getCategoriesStore();
  await store.setJSON("all", filtered);
}
