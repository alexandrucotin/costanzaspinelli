"use server";

import { revalidatePath } from "next/cache";
import { Exercise, ExerciseSchema } from "@/lib/types";
import { getExercises, saveExercise, deleteExercise } from "@/lib/db-adapter";

export async function getExercisesAction() {
  return await getExercises();
}

export async function createExerciseAction(
  data: Omit<Exercise, "id" | "createdAt" | "updatedAt">
) {
  const exercise: Exercise = {
    ...data,
    id: `ex_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const validated = ExerciseSchema.parse(exercise);
  await saveExercise(validated);
  revalidatePath("/admin/esercizi");
  return validated;
}

export async function updateExerciseAction(
  id: string,
  data: Partial<Exercise>
) {
  const exercises = await getExercises();
  const existing = exercises.find((ex) => ex.id === id);

  if (!existing) {
    throw new Error("Esercizio non trovato");
  }

  const updated: Exercise = {
    ...existing,
    ...data,
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  };

  const validated = ExerciseSchema.parse(updated);
  await saveExercise(validated);
  revalidatePath("/admin/esercizi");
  return validated;
}

export async function deleteExerciseAction(id: string) {
  await deleteExercise(id);
  revalidatePath("/admin/esercizi");
}
