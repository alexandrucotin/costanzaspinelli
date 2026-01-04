"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  Habit,
  HabitWithLogs,
  HabitLog,
  HabitTemplate,
  CreateHabit,
  LogHabit,
  HabitStats,
  CreateHabitSchema,
  LogHabitSchema,
} from "@/lib/types-habits";
import { getClientSession } from "@/lib/auth-client";
import { getSession as getAdminSession } from "@/lib/auth-admin";
import { startOfDay, subDays, differenceInDays } from "date-fns";

// ============================================
// CLIENT ACTIONS
// ============================================

/**
 * Get all active habits for the current logged-in client
 */
export async function getMyHabits(): Promise<Habit[]> {
  const session = await getClientSession();
  if (!session) {
    throw new Error("Non autorizzato");
  }

  const habits = await prisma.habit.findMany({
    where: {
      clientId: session.clientId,
      isActive: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return habits.map((h) => ({
    id: h.id,
    clientId: h.clientId,
    name: h.name,
    description: h.description ?? undefined,
    type: h.type as "checkbox" | "number" | "scale",
    category: h.category as
      | "hydration"
      | "sleep"
      | "nutrition"
      | "recovery"
      | "movement"
      | "mindset"
      | "other",
    frequency: h.frequency as "daily" | "weekly",
    target: h.target,
    icon: h.icon ?? undefined,
    color: h.color ?? undefined,
    isActive: h.isActive,
    startDate: h.startDate.toISOString(),
    endDate: h.endDate?.toISOString(),
    createdAt: h.createdAt.toISOString(),
    updatedAt: h.updatedAt.toISOString(),
  }));
}

/**
 * Get habits with logs for a specific date range
 */
export async function getMyHabitsWithLogs(
  startDate: Date,
  endDate: Date
): Promise<HabitWithLogs[]> {
  const session = await getClientSession();
  if (!session) {
    throw new Error("Non autorizzato");
  }

  const habits = await prisma.habit.findMany({
    where: {
      clientId: session.clientId,
      isActive: true,
    },
    include: {
      logs: {
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: {
          date: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return habits.map((h) => ({
    id: h.id,
    clientId: h.clientId,
    name: h.name,
    description: h.description ?? undefined,
    type: h.type as "checkbox" | "number" | "scale",
    category: h.category as
      | "hydration"
      | "sleep"
      | "nutrition"
      | "recovery"
      | "movement"
      | "mindset"
      | "other",
    frequency: h.frequency as "daily" | "weekly",
    target: h.target,
    icon: h.icon ?? undefined,
    color: h.color ?? undefined,
    isActive: h.isActive,
    startDate: h.startDate.toISOString(),
    endDate: h.endDate?.toISOString(),
    createdAt: h.createdAt.toISOString(),
    updatedAt: h.updatedAt.toISOString(),
    logs: h.logs.map((l) => ({
      id: l.id,
      date: l.date.toISOString(),
      value: l.value,
      notes: l.notes ?? undefined,
    })),
  }));
}

/**
 * Log a habit for a specific date
 */
export async function logHabit(data: LogHabit): Promise<HabitLog> {
  const session = await getClientSession();
  if (!session) {
    throw new Error("Non autorizzato");
  }

  // Validate data
  const validatedData = LogHabitSchema.parse(data);

  // Verify habit belongs to client
  const habit = await prisma.habit.findUnique({
    where: {
      id: validatedData.habitId,
      clientId: session.clientId,
    },
  });

  if (!habit) {
    throw new Error("Abitudine non trovata");
  }

  // Normalize date to start of day
  const logDate = startOfDay(new Date(validatedData.date));

  // Upsert log (create or update if exists)
  const log = await prisma.habitLog.upsert({
    where: {
      habitId_date: {
        habitId: validatedData.habitId,
        date: logDate,
      },
    },
    update: {
      value: validatedData.value,
      notes: validatedData.notes,
    },
    create: {
      habitId: validatedData.habitId,
      date: logDate,
      value: validatedData.value,
      notes: validatedData.notes,
    },
  });

  revalidatePath("/cliente/abitudini");
  revalidatePath("/cliente/dashboard");

  return {
    id: log.id,
    habitId: log.habitId,
    date: log.date.toISOString(),
    value: log.value,
    notes: log.notes ?? undefined,
    createdAt: log.createdAt.toISOString(),
  };
}

/**
 * Get habit statistics (streaks, completion rate, etc.)
 */
export async function getHabitStats(habitId: string): Promise<HabitStats> {
  const session = await getClientSession();
  if (!session) {
    throw new Error("Non autorizzato");
  }

  // Verify habit belongs to client
  const habit = await prisma.habit.findUnique({
    where: {
      id: habitId,
      clientId: session.clientId,
    },
    include: {
      logs: {
        orderBy: {
          date: "desc",
        },
      },
    },
  });

  if (!habit) {
    throw new Error("Abitudine non trovata");
  }

  const logs = habit.logs;
  const totalLogs = logs.length;

  // Calculate current streak
  let currentStreak = 0;
  const today = startOfDay(new Date());
  let checkDate = today;

  for (let i = 0; i < logs.length; i++) {
    const logDate = startOfDay(logs[i].date);
    const daysDiff = differenceInDays(checkDate, logDate);

    if (daysDiff === 0) {
      // Check if completed
      const value = logs[i].value as any;
      if (value.completed === true || value.value > 0 || value.rating > 0) {
        currentStreak++;
        checkDate = subDays(checkDate, 1);
      } else {
        break;
      }
    } else if (daysDiff === 1) {
      checkDate = logDate;
      i--; // Recheck this log
    } else {
      break;
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate: Date | null = null;

  for (const log of logs.reverse()) {
    const logDate = startOfDay(log.date);
    const value = log.value as any;
    const isCompleted =
      value.completed === true || value.value > 0 || value.rating > 0;

    if (isCompleted) {
      if (prevDate === null || differenceInDays(logDate, prevDate) === 1) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
      prevDate = logDate;
    } else {
      tempStreak = 0;
      prevDate = null;
    }
  }

  // Calculate completion rate (last 30 days)
  const thirtyDaysAgo = subDays(today, 30);
  const recentLogs = logs.filter((l) => l.date >= thirtyDaysAgo);
  const completedLogs = recentLogs.filter((l) => {
    const value = l.value as any;
    return value.completed === true || value.value > 0 || value.rating > 0;
  });
  const completionRate =
    recentLogs.length > 0
      ? (completedLogs.length / recentLogs.length) * 100
      : 0;

  const lastLog = logs[0];

  return {
    habitId: habit.id,
    habitName: habit.name,
    currentStreak,
    longestStreak,
    completionRate: Math.round(completionRate),
    totalLogs,
    lastLogDate: lastLog?.date.toISOString(),
  };
}

// ============================================
// ADMIN ACTIONS
// ============================================

/**
 * Get all habit templates
 */
export async function getHabitTemplates(): Promise<HabitTemplate[]> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Non autorizzato");
  }

  const templates = await prisma.habitTemplate.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  return templates.map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description ?? undefined,
    type: t.type as "checkbox" | "number" | "scale",
    category: t.category as any,
    frequency: t.frequency as "daily" | "weekly",
    target: t.target,
    icon: t.icon ?? undefined,
    color: t.color ?? undefined,
    isDefault: t.isDefault,
    createdAt: t.createdAt.toISOString(),
  }));
}

/**
 * Get habits for a specific client (admin only)
 */
export async function getClientHabits(clientId: string): Promise<Habit[]> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Non autorizzato");
  }

  const habits = await prisma.habit.findMany({
    where: {
      clientId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return habits.map((h) => ({
    id: h.id,
    clientId: h.clientId,
    name: h.name,
    description: h.description ?? undefined,
    type: h.type as "checkbox" | "number" | "scale",
    category: h.category as
      | "hydration"
      | "sleep"
      | "nutrition"
      | "recovery"
      | "movement"
      | "mindset"
      | "other",
    frequency: h.frequency as "daily" | "weekly",
    target: h.target,
    icon: h.icon ?? undefined,
    color: h.color ?? undefined,
    isActive: h.isActive,
    startDate: h.startDate.toISOString(),
    endDate: h.endDate?.toISOString(),
    createdAt: h.createdAt.toISOString(),
    updatedAt: h.updatedAt.toISOString(),
  }));
}

/**
 * Assign habit to client from template (admin only)
 */
export async function assignHabitToClient(
  clientId: string,
  templateId: string
): Promise<Habit> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Non autorizzato");
  }

  // Get template
  const template = await prisma.habitTemplate.findUnique({
    where: { id: templateId },
  });

  if (!template) {
    throw new Error("Template non trovato");
  }

  // Create habit from template
  const habit = await prisma.habit.create({
    data: {
      clientId,
      name: template.name,
      description: template.description ?? undefined,
      type: template.type,
      category: template.category,
      frequency: template.frequency,
      target: template.target ?? undefined,
      icon: template.icon ?? undefined,
      color: template.color ?? undefined,
      isActive: true,
    },
  });

  revalidatePath(`/admin/clienti/${clientId}`);

  return {
    id: habit.id,
    clientId: habit.clientId,
    name: habit.name,
    description: habit.description ?? undefined,
    type: habit.type as "checkbox" | "number" | "scale",
    category: habit.category as any,
    frequency: habit.frequency as "daily" | "weekly",
    target: habit.target,
    icon: habit.icon ?? undefined,
    color: habit.color ?? undefined,
    isActive: habit.isActive,
    startDate: habit.startDate.toISOString(),
    endDate: habit.endDate?.toISOString(),
    createdAt: habit.createdAt.toISOString(),
    updatedAt: habit.updatedAt.toISOString(),
  };
}

/**
 * Create custom habit for client (admin only)
 */
export async function createHabitForClient(data: CreateHabit): Promise<Habit> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Non autorizzato");
  }

  // Validate data
  const validatedData = CreateHabitSchema.parse(data);

  const habit = await prisma.habit.create({
    data: {
      clientId: validatedData.clientId,
      name: validatedData.name,
      description: validatedData.description,
      type: validatedData.type,
      category: validatedData.category,
      frequency: validatedData.frequency,
      target: validatedData.target,
      icon: validatedData.icon,
      color: validatedData.color,
      isActive: true,
      startDate: validatedData.startDate
        ? new Date(validatedData.startDate)
        : new Date(),
    },
  });

  revalidatePath(`/admin/clienti/${validatedData.clientId}`);

  return {
    id: habit.id,
    clientId: habit.clientId,
    name: habit.name,
    description: habit.description ?? undefined,
    type: habit.type as "checkbox" | "number" | "scale",
    category: habit.category as any,
    frequency: habit.frequency as "daily" | "weekly",
    target: habit.target,
    icon: habit.icon ?? undefined,
    color: habit.color ?? undefined,
    isActive: habit.isActive,
    startDate: habit.startDate.toISOString(),
    endDate: habit.endDate?.toISOString(),
    createdAt: habit.createdAt.toISOString(),
    updatedAt: habit.updatedAt.toISOString(),
  };
}

/**
 * Toggle habit active status (admin only)
 */
export async function toggleHabitStatus(habitId: string): Promise<Habit> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Non autorizzato");
  }

  const habit = await prisma.habit.findUnique({
    where: { id: habitId },
  });

  if (!habit) {
    throw new Error("Abitudine non trovata");
  }

  const updated = await prisma.habit.update({
    where: { id: habitId },
    data: {
      isActive: !habit.isActive,
      endDate: !habit.isActive ? null : new Date(),
    },
  });

  revalidatePath(`/admin/clienti/${habit.clientId}`);

  return {
    id: updated.id,
    clientId: updated.clientId,
    name: updated.name,
    description: updated.description ?? undefined,
    type: updated.type as "checkbox" | "number" | "scale",
    category: updated.category as any,
    frequency: updated.frequency as "daily" | "weekly",
    target: updated.target,
    icon: updated.icon ?? undefined,
    color: updated.color ?? undefined,
    isActive: updated.isActive,
    startDate: updated.startDate.toISOString(),
    endDate: updated.endDate?.toISOString(),
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  };
}

/**
 * Delete habit (admin only)
 */
export async function deleteHabit(habitId: string): Promise<void> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Non autorizzato");
  }

  const habit = await prisma.habit.findUnique({
    where: { id: habitId },
  });

  if (!habit) {
    throw new Error("Abitudine non trovata");
  }

  await prisma.habit.delete({
    where: { id: habitId },
  });

  revalidatePath(`/admin/clienti/${habit.clientId}`);
}
