"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export interface CreateWorkoutLogData {
  clientId: string;
  planId: string;
  sessionId: string;
  sessionName: string;
  completed?: boolean;
  durationMinutes?: number;
  notes?: string;
  rating?: number;
  exercises: {
    exerciseId: string;
    exerciseName: string;
    setsCompleted: number;
    repsCompleted: number[];
    loadUsed: number[];
    rpe?: number;
    notes?: string;
    completed: boolean;
  }[];
}

export async function createWorkoutLog(data: CreateWorkoutLogData) {
  try {
    const workoutLog = await prisma.workoutLog.create({
      data: {
        clientId: data.clientId,
        planId: data.planId,
        sessionId: data.sessionId,
        sessionName: data.sessionName,
        completed: data.completed ?? false,
        durationMinutes: data.durationMinutes,
        notes: data.notes,
        rating: data.rating,
        exerciseLogs: {
          create: data.exercises.map((ex) => ({
            exerciseId: ex.exerciseId,
            exerciseName: ex.exerciseName,
            setsCompleted: ex.setsCompleted,
            repsCompleted: ex.repsCompleted,
            loadUsed: ex.loadUsed,
            rpe: ex.rpe,
            notes: ex.notes,
            completed: ex.completed,
          })),
        },
      },
      include: {
        exerciseLogs: true,
      },
    });

    revalidatePath(`/cliente/schede/${data.planId}`);
    return workoutLog;
  } catch (error) {
    console.error("Error creating workout log:", error);
    throw new Error("Errore durante il salvataggio del workout");
  }
}

export async function getWorkoutLogsByClient(clientId: string) {
  try {
    return await prisma.workoutLog.findMany({
      where: { clientId },
      include: {
        exerciseLogs: true,
      },
      orderBy: {
        date: "desc",
      },
    });
  } catch (error) {
    console.error("Error fetching workout logs:", error);
    return [];
  }
}

export async function getWorkoutLogsByPlan(clientId: string, planId: string) {
  try {
    return await prisma.workoutLog.findMany({
      where: {
        clientId,
        planId,
      },
      include: {
        exerciseLogs: true,
      },
      orderBy: {
        date: "desc",
      },
    });
  } catch (error) {
    console.error("Error fetching workout logs:", error);
    return [];
  }
}

export async function getExerciseHistory(
  clientId: string,
  exerciseId: string,
  limit: number = 10
) {
  try {
    const logs = await prisma.exerciseLog.findMany({
      where: {
        exerciseId,
        workoutLog: {
          clientId,
        },
      },
      include: {
        workoutLog: {
          select: {
            date: true,
            sessionName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    return logs;
  } catch (error) {
    console.error("Error fetching exercise history:", error);
    return [];
  }
}

export async function updateWorkoutLog(
  logId: string,
  data: {
    completed?: boolean;
    durationMinutes?: number;
    notes?: string;
    rating?: number;
  }
) {
  try {
    const updated = await prisma.workoutLog.update({
      where: { id: logId },
      data,
      include: {
        exerciseLogs: true,
      },
    });

    revalidatePath(`/cliente/schede`);
    return updated;
  } catch (error) {
    console.error("Error updating workout log:", error);
    throw new Error("Errore durante l'aggiornamento del workout");
  }
}

export async function deleteWorkoutLog(logId: string) {
  try {
    await prisma.workoutLog.delete({
      where: { id: logId },
    });

    revalidatePath(`/cliente/schede`);
  } catch (error) {
    console.error("Error deleting workout log:", error);
    throw new Error("Errore durante l'eliminazione del workout");
  }
}

// Get workout statistics for a client
export async function getWorkoutStats(clientId: string) {
  try {
    const [totalWorkouts, completedWorkouts, recentLogs] = await Promise.all([
      prisma.workoutLog.count({
        where: { clientId },
      }),
      prisma.workoutLog.count({
        where: { clientId, completed: true },
      }),
      prisma.workoutLog.findMany({
        where: { clientId },
        orderBy: { date: "desc" },
        take: 30,
        select: {
          date: true,
          completed: true,
          rating: true,
        },
      }),
    ]);

    const avgRating =
      recentLogs.reduce(
        (
          sum: number,
          log: { date: Date; completed: boolean | null; rating: number | null }
        ) => sum + (log.rating || 0),
        0
      ) /
        recentLogs.filter(
          (log: {
            date: Date;
            completed: boolean | null;
            rating: number | null;
          }) => log.rating
        ).length || 0;

    const completionRate =
      totalWorkouts > 0 ? (completedWorkouts / totalWorkouts) * 100 : 0;

    return {
      totalWorkouts,
      completedWorkouts,
      completionRate: Math.round(completionRate),
      avgRating: Math.round(avgRating * 10) / 10,
      recentLogs,
    };
  } catch (error) {
    console.error("Error fetching workout stats:", error);
    return {
      totalWorkouts: 0,
      completedWorkouts: 0,
      completionRate: 0,
      avgRating: 0,
      recentLogs: [],
    };
  }
}
