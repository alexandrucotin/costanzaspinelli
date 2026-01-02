import { getStore } from "@netlify/blobs";
import { Exercise, WorkoutPlan, Tool, MuscleGroup, Category } from "./types";
import { Client } from "./types-client";
import { getLocalData, setLocalData } from "./local-storage";

// Check if we're in Netlify environment
const isNetlifyEnvironment = () => {
  return process.env.NETLIFY === "true" || process.env.CONTEXT !== undefined;
};

// Storage wrapper that uses local storage in dev, Netlify Blobs in production
const getStorageWrapper = (storeName: string) => {
  if (isNetlifyEnvironment()) {
    return getStore(storeName);
  }
  // Return a mock store for local development
  return {
    get: async (key: string, options?: { type: "json" }) => {
      if (options?.type === "json") {
        return await getLocalData(storeName, key);
      }
      return await getLocalData(storeName, key);
    },
    setJSON: async (key: string, data: any) => {
      await setLocalData(storeName, key, data);
    },
    set: async (key: string, data: any) => {
      await setLocalData(storeName, key, data);
    },
    delete: async (key: string) => {
      const { deleteLocalData } = await import("./local-storage");
      await deleteLocalData(storeName, key);
    },
  };
};

// Netlify Blobs stores with local fallback
const getExercisesStore = () => getStorageWrapper("exercises");
const getPlansStore = () => getStorageWrapper("plans");
const getLeadsStore = () => getStorageWrapper("leads");
const getToolsStore = () => getStorageWrapper("tools");
const getMuscleGroupsStore = () => getStorageWrapper("muscle-groups");
const getCategoriesStore = () => getStorageWrapper("categories");
const getClientsStore = () => getStorageWrapper("clients");

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
export async function saveContactSubmission(submission: any): Promise<void> {
  const store = getLeadsStore();
  const data = await store.get("all", { type: "json" });
  const submissions = (data as any[]) || [];
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
  await getCategoriesStore().setJSON("all", filtered);
}

// ============================================
// CLIENTS CRUD
// ============================================

export async function getClients(): Promise<Client[]> {
  const store = getClientsStore();
  const clients = await store.get("all", { type: "json" });
  return (clients as Client[]) || [];
}

export async function getClientById(id: string): Promise<Client | null> {
  const clients = await getClients();
  return clients.find((c) => c.id === id) || null;
}

export async function saveClient(client: Client): Promise<void> {
  const clients = await getClients();
  const index = clients.findIndex((c) => c.id === client.id);

  if (index >= 0) {
    clients[index] = client;
  } else {
    clients.push(client);
  }

  const store = getClientsStore();
  await store.setJSON("all", clients);
}

export async function deleteClient(id: string): Promise<void> {
  const clients = await getClients();
  const filtered = clients.filter((c) => c.id !== id);
  const store = getClientsStore();
  await store.setJSON("all", filtered);
}
