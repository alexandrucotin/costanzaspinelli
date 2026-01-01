"use server";

import { revalidatePath } from "next/cache";
import {
  Tool,
  ToolSchema,
  MuscleGroup,
  MuscleGroupSchema,
  Category,
  CategorySchema,
} from "@/lib/types";
import {
  getTools,
  saveTool,
  deleteTool,
  getMuscleGroups,
  saveMuscleGroup,
  deleteMuscleGroup,
  getCategories,
  saveCategory,
  deleteCategory,
} from "@/lib/data-blobs";

// Tools
export async function getToolsAction() {
  return await getTools();
}

export async function createToolAction(name: string) {
  const tool: Tool = {
    id: `tool_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    createdAt: new Date().toISOString(),
  };

  const validated = ToolSchema.parse(tool);
  await saveTool(validated);
  revalidatePath("/admin/impostazioni/attrezzi");
  return validated;
}

export async function deleteToolAction(id: string) {
  await deleteTool(id);
  revalidatePath("/admin/impostazioni/attrezzi");
}

// Muscle Groups
export async function getMuscleGroupsAction() {
  return await getMuscleGroups();
}

export async function createMuscleGroupAction(name: string) {
  const group: MuscleGroup = {
    id: `muscle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    createdAt: new Date().toISOString(),
  };

  const validated = MuscleGroupSchema.parse(group);
  await saveMuscleGroup(validated);
  revalidatePath("/admin/impostazioni/gruppi-muscolari");
  return validated;
}

export async function deleteMuscleGroupAction(id: string) {
  await deleteMuscleGroup(id);
  revalidatePath("/admin/impostazioni/gruppi-muscolari");
}

// Categories
export async function getCategoriesAction() {
  return await getCategories();
}

export async function createCategoryAction(name: string) {
  const category: Category = {
    id: `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    createdAt: new Date().toISOString(),
  };

  const validated = CategorySchema.parse(category);
  await saveCategory(validated);
  revalidatePath("/admin/impostazioni/categorie");
  return validated;
}

export async function deleteCategoryAction(id: string) {
  await deleteCategory(id);
  revalidatePath("/admin/impostazioni/categorie");
}
