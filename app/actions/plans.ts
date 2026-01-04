"use server";

import { revalidatePath } from "next/cache";
import { WorkoutPlan, WorkoutPlanSchema } from "@/lib/types";
import {
  getPlans,
  getPlanById,
  savePlan,
  deletePlan,
  duplicatePlan,
} from "@/lib/db-adapter";

export async function getPlansAction() {
  return await getPlans();
}

export async function getPlanByIdAction(id: string) {
  return await getPlanById(id);
}

export async function createPlanAction(
  data: Omit<WorkoutPlan, "id" | "createdAt" | "updatedAt">
) {
  const plan: WorkoutPlan = {
    ...data,
    id: `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const validated = WorkoutPlanSchema.parse(plan);
  await savePlan(validated);
  revalidatePath("/admin/schede");
  return validated;
}

export async function updatePlanAction(id: string, data: Partial<WorkoutPlan>) {
  const existing = await getPlanById(id);

  if (!existing) {
    throw new Error("Scheda non trovata");
  }

  const updated: WorkoutPlan = {
    ...existing,
    ...data,
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  };

  const validated = WorkoutPlanSchema.parse(updated);
  await savePlan(validated);
  revalidatePath("/admin/schede");
  revalidatePath(`/admin/schede/${id}`);
  return validated;
}

export async function deletePlanAction(id: string) {
  await deletePlan(id);
  revalidatePath("/admin/schede");
}

export async function duplicatePlanAction(id: string) {
  const newPlan = await duplicatePlan(id);
  revalidatePath("/admin/schede");
  return newPlan;
}
