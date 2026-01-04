/**
 * Database Adapter Layer
 * Uses Prisma/PostgreSQL
 */

import { prisma } from "./prisma";
import type {
  Tool,
  MuscleGroup,
  Category,
  Exercise,
  WorkoutPlan,
  ContactSubmission,
} from "./types";
import type { Client } from "./types-client";

// ============================================
// TOOLS
// ============================================

export async function getTools(): Promise<Tool[]> {
  const tools = await prisma.tool.findMany({
    orderBy: { name: "asc" },
  });
  return tools.map((t) => ({
    id: t.id,
    name: t.name,
    createdAt: t.createdAt.toISOString(),
  }));
}

export async function saveTool(tool: Tool): Promise<Tool> {
  const saved = await prisma.tool.upsert({
    where: { id: tool.id },
    update: { name: tool.name },
    create: {
      id: tool.id,
      name: tool.name,
    },
  });
  return {
    id: saved.id,
    name: saved.name,
    createdAt: saved.createdAt.toISOString(),
  };
}

export async function deleteTool(id: string): Promise<void> {
  await prisma.tool.delete({ where: { id } });
}

// ============================================
// MUSCLE GROUPS
// ============================================

export async function getMuscleGroups(): Promise<MuscleGroup[]> {
  const groups = await prisma.muscleGroup.findMany({
    orderBy: { name: "asc" },
  });
  return groups.map((g) => ({
    id: g.id,
    name: g.name,
    createdAt: g.createdAt.toISOString(),
  }));
}

export async function saveMuscleGroup(
  group: MuscleGroup
): Promise<MuscleGroup> {
  const saved = await prisma.muscleGroup.upsert({
    where: { id: group.id },
    update: { name: group.name },
    create: {
      id: group.id,
      name: group.name,
    },
  });
  return {
    id: saved.id,
    name: saved.name,
    createdAt: saved.createdAt.toISOString(),
  };
}

export async function deleteMuscleGroup(id: string): Promise<void> {
  await prisma.muscleGroup.delete({ where: { id } });
}

// ============================================
// CATEGORIES
// ============================================

export async function getCategories(): Promise<Category[]> {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
  return categories.map((c) => ({
    id: c.id,
    name: c.name,
    createdAt: c.createdAt.toISOString(),
  }));
}

export async function saveCategory(category: Category): Promise<Category> {
  const saved = await prisma.category.upsert({
    where: { id: category.id },
    update: { name: category.name },
    create: {
      id: category.id,
      name: category.name,
    },
  });
  return {
    id: saved.id,
    name: saved.name,
    createdAt: saved.createdAt.toISOString(),
  };
}

export async function deleteCategory(id: string): Promise<void> {
  await prisma.category.delete({ where: { id } });
}

// ============================================
// EXERCISES
// ============================================

export async function getExercises(): Promise<Exercise[]> {
  const exercises = await prisma.exercise.findMany({
    include: {
      categories: true,
    },
    orderBy: { name: "asc" },
  });
  return exercises.map((e) => ({
    id: e.id,
    name: e.name,
    muscleGroupId: e.muscleGroupId,
    categoryIds: e.categories.map((c) => c.id),
    defaultRestSeconds: e.defaultRestSeconds ?? undefined,
    defaultTempo: e.defaultTempo ?? undefined,
    videoUrl: e.videoUrl ?? undefined,
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
  }));
}

export async function saveExercise(exercise: Exercise): Promise<Exercise> {
  const saved = await prisma.exercise.upsert({
    where: { id: exercise.id },
    update: {
      name: exercise.name,
      muscleGroupId: exercise.muscleGroupId,
      defaultRestSeconds: exercise.defaultRestSeconds,
      defaultTempo: exercise.defaultTempo,
      videoUrl: exercise.videoUrl,
      categories: {
        set: exercise.categoryIds.map((id) => ({ id })),
      },
    },
    create: {
      id: exercise.id,
      name: exercise.name,
      muscleGroupId: exercise.muscleGroupId,
      defaultRestSeconds: exercise.defaultRestSeconds,
      defaultTempo: exercise.defaultTempo,
      videoUrl: exercise.videoUrl,
      categories: {
        connect: exercise.categoryIds.map((id) => ({ id })),
      },
    },
    include: {
      categories: true,
    },
  });
  return {
    id: saved.id,
    name: saved.name,
    muscleGroupId: saved.muscleGroupId,
    categoryIds: saved.categories.map((c) => c.id),
    defaultRestSeconds: saved.defaultRestSeconds ?? undefined,
    defaultTempo: saved.defaultTempo ?? undefined,
    videoUrl: saved.videoUrl ?? undefined,
    createdAt: saved.createdAt.toISOString(),
    updatedAt: saved.updatedAt.toISOString(),
  };
}

export async function deleteExercise(id: string): Promise<void> {
  await prisma.exercise.delete({ where: { id } });
}

// ============================================
// WORKOUT PLANS
// ============================================

export async function getPlans(): Promise<WorkoutPlan[]> {
  const plans = await prisma.workoutPlan.findMany({
    include: {
      sessions: {
        include: {
          sections: {
            include: {
              exercises: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return plans.map((p) => ({
    id: p.id,
    title: p.title,
    clientName: p.clientName,
    goal: p.goal as WorkoutPlan["goal"],
    startDate: p.startDate?.toISOString(),
    durationWeeks: p.durationWeeks,
    frequencyDaysPerWeek: p.frequencyDaysPerWeek,
    equipment: p.equipment as WorkoutPlan["equipment"],
    notes: p.notes ?? undefined,
    contraindications: p.contraindications ?? undefined,
    sessions: p.sessions.map((s) => ({
      id: s.id,
      name: s.name,
      sections: s.sections.map((sec) => ({
        id: sec.id,
        type: sec.type as "warmup" | "main" | "cooldown",
        exercises: sec.exercises.map((ex) => ({
          id: ex.id,
          exerciseId: ex.exerciseId ?? undefined,
          exerciseName: ex.exerciseName,
          toolId: ex.toolId ?? undefined,
          sets: ex.sets,
          reps: ex.reps ?? undefined,
          timeSeconds: ex.timeSeconds ?? undefined,
          loadKg: ex.loadKg ?? undefined,
          rpe: ex.rpe ?? undefined,
          rir: ex.rir ?? undefined,
          restSeconds: ex.restSeconds,
          tempo: ex.tempo ?? undefined,
          notes: ex.notes ?? undefined,
          weeklyProgression: ex.weeklyProgression
            ? JSON.parse(ex.weeklyProgression as string)
            : undefined,
          grouping: ex.grouping ? JSON.parse(ex.grouping as string) : undefined,
          videoUrl: ex.videoUrl ?? undefined,
          alternativeExerciseIds: ex.alternativeExerciseIds
            ? JSON.parse(ex.alternativeExerciseIds as string)
            : undefined,
        })),
      })),
    })),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));
}

export async function getPlanById(id: string): Promise<WorkoutPlan | null> {
  const plan = await prisma.workoutPlan.findUnique({
    where: { id },
    include: {
      sessions: {
        include: {
          sections: {
            include: {
              exercises: true,
            },
          },
        },
      },
    },
  });

  if (!plan) return null;

  return {
    id: plan.id,
    title: plan.title,
    clientName: plan.clientName,
    goal: plan.goal as WorkoutPlan["goal"],
    startDate: plan.startDate?.toISOString(),
    durationWeeks: plan.durationWeeks,
    frequencyDaysPerWeek: plan.frequencyDaysPerWeek,
    equipment: plan.equipment as WorkoutPlan["equipment"],
    notes: plan.notes ?? undefined,
    contraindications: plan.contraindications ?? undefined,
    sessions: plan.sessions.map((s) => ({
      id: s.id,
      name: s.name,
      sections: s.sections.map((sec) => ({
        id: sec.id,
        type: sec.type as "warmup" | "main" | "cooldown",
        exercises: sec.exercises.map((ex) => ({
          id: ex.id,
          exerciseId: ex.exerciseId ?? undefined,
          exerciseName: ex.exerciseName,
          toolId: ex.toolId ?? undefined,
          sets: ex.sets,
          reps: ex.reps ?? undefined,
          timeSeconds: ex.timeSeconds ?? undefined,
          loadKg: ex.loadKg ?? undefined,
          rpe: ex.rpe ?? undefined,
          rir: ex.rir ?? undefined,
          restSeconds: ex.restSeconds,
          tempo: ex.tempo ?? undefined,
          notes: ex.notes ?? undefined,
          weeklyProgression: ex.weeklyProgression
            ? JSON.parse(ex.weeklyProgression as string)
            : undefined,
          grouping: ex.grouping ? JSON.parse(ex.grouping as string) : undefined,
          videoUrl: ex.videoUrl ?? undefined,
          alternativeExerciseIds: ex.alternativeExerciseIds
            ? JSON.parse(ex.alternativeExerciseIds as string)
            : undefined,
        })),
      })),
    })),
    createdAt: plan.createdAt.toISOString(),
    updatedAt: plan.updatedAt.toISOString(),
  };
}

export async function savePlan(plan: WorkoutPlan): Promise<WorkoutPlan> {
  // Delete existing plan and recreate (simpler than complex nested updates)
  await prisma.workoutPlan.delete({ where: { id: plan.id } }).catch(() => {});

  const saved = await prisma.workoutPlan.create({
    data: {
      id: plan.id,
      title: plan.title,
      clientName: plan.clientName,
      goal: plan.goal,
      startDate: plan.startDate ? new Date(plan.startDate) : null,
      durationWeeks: plan.durationWeeks,
      frequencyDaysPerWeek: plan.frequencyDaysPerWeek,
      equipment: plan.equipment,
      notes: plan.notes,
      contraindications: plan.contraindications,
      createdAt: new Date(plan.createdAt),
      sessions: {
        create: plan.sessions.map((session, sessionIdx) => ({
          id: session.id,
          name: session.name,
          order: sessionIdx,
          sections: {
            create: session.sections.map((section, sectionIdx) => ({
              id: section.id,
              type: section.type,
              order: sectionIdx,
              exercises: {
                create: section.exercises.map((exercise, exerciseIdx) => {
                  const data = {
                    id: exercise.id,
                    exerciseName: exercise.exerciseName,
                    sets: exercise.sets,
                    restSeconds: exercise.restSeconds,
                    order: exerciseIdx,
                    ...(exercise.exerciseId && {
                      exercise: { connect: { id: exercise.exerciseId } },
                    }),
                    ...(exercise.toolId && {
                      tool: { connect: { id: exercise.toolId } },
                    }),
                    ...(exercise.reps !== undefined && { reps: exercise.reps }),
                    ...(exercise.timeSeconds !== undefined && {
                      timeSeconds: exercise.timeSeconds,
                    }),
                    ...(exercise.loadKg !== undefined && {
                      loadKg: exercise.loadKg,
                    }),
                    ...(exercise.rpe !== undefined && { rpe: exercise.rpe }),
                    ...(exercise.rir !== undefined && { rir: exercise.rir }),
                    ...(exercise.tempo && { tempo: exercise.tempo }),
                    ...(exercise.notes && { notes: exercise.notes }),
                    ...(exercise.weeklyProgression && {
                      weeklyProgression: JSON.stringify(
                        exercise.weeklyProgression
                      ),
                    }),
                    ...(exercise.grouping && {
                      grouping: JSON.stringify(exercise.grouping),
                    }),
                    ...(exercise.videoUrl && { videoUrl: exercise.videoUrl }),
                    ...(exercise.alternativeExerciseIds && {
                      alternativeExerciseIds: JSON.stringify(
                        exercise.alternativeExerciseIds
                      ),
                    }),
                  };

                  return data;
                }),
              },
            })),
          },
        })),
      },
    },
    include: {
      sessions: {
        include: {
          sections: {
            include: {
              exercises: true,
            },
          },
        },
      },
    },
  });

  return {
    id: saved.id,
    title: saved.title,
    clientName: saved.clientName,
    goal: saved.goal as WorkoutPlan["goal"],
    startDate: saved.startDate?.toISOString(),
    durationWeeks: saved.durationWeeks,
    frequencyDaysPerWeek: saved.frequencyDaysPerWeek,
    equipment: saved.equipment as WorkoutPlan["equipment"],
    notes: saved.notes ?? undefined,
    contraindications: saved.contraindications ?? undefined,
    sessions: saved.sessions.map((s) => ({
      id: s.id,
      name: s.name,
      sections: s.sections.map((sec) => ({
        id: sec.id,
        type: sec.type as "warmup" | "main" | "cooldown",
        exercises: sec.exercises.map((ex) => ({
          id: ex.id,
          exerciseId: ex.exerciseId ?? undefined,
          exerciseName: ex.exerciseName,
          toolId: ex.toolId ?? undefined,
          sets: ex.sets,
          reps: ex.reps ?? undefined,
          timeSeconds: ex.timeSeconds ?? undefined,
          loadKg: ex.loadKg ?? undefined,
          rpe: ex.rpe ?? undefined,
          rir: ex.rir ?? undefined,
          restSeconds: ex.restSeconds,
          tempo: ex.tempo ?? undefined,
          notes: ex.notes ?? undefined,
          weeklyProgression: ex.weeklyProgression
            ? JSON.parse(ex.weeklyProgression as string)
            : undefined,
          grouping: ex.grouping ? JSON.parse(ex.grouping as string) : undefined,
          videoUrl: ex.videoUrl ?? undefined,
          alternativeExerciseIds: ex.alternativeExerciseIds
            ? JSON.parse(ex.alternativeExerciseIds as string)
            : undefined,
        })),
      })),
    })),
    createdAt: saved.createdAt.toISOString(),
    updatedAt: saved.updatedAt.toISOString(),
  };
}

export async function deletePlan(id: string): Promise<void> {
  await prisma.workoutPlan.delete({ where: { id } });
}

export async function duplicatePlan(id: string): Promise<WorkoutPlan> {
  const plan = await getPlanById(id);
  if (!plan) throw new Error("Plan not found");

  const newPlan: WorkoutPlan = {
    ...plan,
    id: `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: `${plan.title} (Copia)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sessions: plan.sessions.map((session) => ({
      ...session,
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sections: session.sections.map((section) => ({
        ...section,
        id: `section_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        exercises: section.exercises.map((exercise) => ({
          ...exercise,
          id: `exercise_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`,
        })),
      })),
    })),
  };

  return savePlan(newPlan);
}

// ============================================
// CLIENTS
// ============================================

export async function getClients(): Promise<Client[]> {
  const clients = await prisma.client.findMany({
    include: {
      measurements: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return clients.map((c) => ({
    id: c.id,
    fullName: c.fullName,
    email: c.email,
    phone: c.phone ?? undefined,
    dateOfBirth: c.dateOfBirth ? c.dateOfBirth.toISOString() : undefined,
    gender: (c.gender as "male" | "female" | undefined) ?? undefined,
    profilePhoto: c.profilePhoto ?? undefined,
    currentWeight: c.currentWeight ?? undefined,
    height: c.height ?? undefined,
    bodyFatPercentage: c.bodyFatPercentage ?? undefined,
    leanMass: c.leanMass ?? undefined,
    primaryGoal: c.primaryGoal as Client["primaryGoal"],
    targetWeight: c.targetWeight ?? undefined,
    targetDate: c.targetDate ? c.targetDate.toISOString() : undefined,
    goalNotes: c.goalNotes ?? undefined,
    medicalHistory: c.medicalHistory ? (c.medicalHistory as any) : undefined,
    lifestyle: c.lifestyle ? (c.lifestyle as any) : undefined,
    fitnessExperience: c.fitnessExperience
      ? (c.fitnessExperience as any)
      : undefined,
    nutrition: c.nutrition ? (c.nutrition as any) : undefined,
    assignedPlanIds: c.assignedPlanIds as string[],
    status: c.status as Client["status"],
    firstAssessmentDate: c.firstAssessmentDate.toISOString(),
    lastAssessmentDate: c.lastAssessmentDate
      ? c.lastAssessmentDate.toISOString()
      : undefined,
    generalNotes: c.generalNotes ?? undefined,
    privateNotes: c.privateNotes ?? undefined,
    measurements: c.measurements.map((m) => ({
      id: m.id,
      date: typeof m.date === "string" ? m.date : m.date.toISOString(),
      weight: m.weight ?? undefined,
      bodyFatPercentage: m.bodyFatPercentage ?? undefined,
      leanMass: m.leanMass ?? undefined,
      chest: m.chest ?? undefined,
      waist: m.waist ?? undefined,
      hips: m.hips ?? undefined,
      arms: m.arms ?? undefined,
      thighs: m.thighs ?? undefined,
      notes: m.notes ?? undefined,
      photos: (m.photos as string[]) ?? [],
    })),
    auth: c.passwordHash
      ? {
          activationToken: c.activationToken ?? undefined,
          activationTokenExpiry: c.activationTokenExpiry?.toISOString(),
          passwordHash: c.passwordHash,
          isActivated: c.isActivated ?? false,
          lastLogin: c.lastLogin?.toISOString(),
        }
      : undefined,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));
}

export async function getClientById(id: string): Promise<Client | null> {
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      measurements: true,
    },
  });

  if (!client) return null;

  return {
    id: client.id,
    fullName: client.fullName,
    email: client.email,
    phone: client.phone ?? undefined,
    dateOfBirth: client.dateOfBirth
      ? client.dateOfBirth.toISOString()
      : undefined,
    gender: (client.gender as "male" | "female" | undefined) ?? undefined,
    profilePhoto: client.profilePhoto ?? undefined,
    currentWeight: client.currentWeight ?? undefined,
    height: client.height ?? undefined,
    bodyFatPercentage: client.bodyFatPercentage ?? undefined,
    leanMass: client.leanMass ?? undefined,
    primaryGoal: client.primaryGoal as Client["primaryGoal"],
    targetWeight: client.targetWeight ?? undefined,
    targetDate: client.targetDate ? client.targetDate.toISOString() : undefined,
    goalNotes: client.goalNotes ?? undefined,
    medicalHistory: client.medicalHistory
      ? (client.medicalHistory as any)
      : undefined,
    lifestyle: client.lifestyle ? (client.lifestyle as any) : undefined,
    fitnessExperience: client.fitnessExperience
      ? (client.fitnessExperience as any)
      : undefined,
    nutrition: client.nutrition ? (client.nutrition as any) : undefined,
    assignedPlanIds: client.assignedPlanIds as string[],
    status: client.status as Client["status"],
    firstAssessmentDate: client.firstAssessmentDate.toISOString(),
    lastAssessmentDate: client.lastAssessmentDate
      ? client.lastAssessmentDate.toISOString()
      : undefined,
    generalNotes: client.generalNotes ?? undefined,
    privateNotes: client.privateNotes ?? undefined,
    measurements: client.measurements.map((m) => ({
      id: m.id,
      date: typeof m.date === "string" ? m.date : m.date.toISOString(),
      weight: m.weight ?? undefined,
      bodyFatPercentage: m.bodyFatPercentage ?? undefined,
      leanMass: m.leanMass ?? undefined,
      chest: m.chest ?? undefined,
      waist: m.waist ?? undefined,
      hips: m.hips ?? undefined,
      arms: m.arms ?? undefined,
      thighs: m.thighs ?? undefined,
      notes: m.notes ?? undefined,
      photos: (m.photos as string[]) ?? [],
    })),
    auth: client.passwordHash
      ? {
          activationToken: client.activationToken ?? undefined,
          activationTokenExpiry: client.activationTokenExpiry?.toISOString(),
          passwordHash: client.passwordHash,
          isActivated: client.isActivated ?? false,
          lastLogin: client.lastLogin?.toISOString(),
        }
      : undefined,
    createdAt: client.createdAt.toISOString(),
    updatedAt: client.updatedAt.toISOString(),
  };
}

export async function saveClient(client: Client): Promise<Client> {
  // Delete existing measurements if updating
  await prisma.measurementRecord
    .deleteMany({ where: { clientId: client.id } })
    .catch(() => {});

  const saved = await prisma.client.upsert({
    where: { id: client.id },
    update: {
      fullName: client.fullName,
      email: client.email,
      phone: client.phone,
      dateOfBirth: client.dateOfBirth,
      gender: client.gender,
      profilePhoto: client.profilePhoto,
      currentWeight: client.currentWeight,
      height: client.height,
      bodyFatPercentage: client.bodyFatPercentage,
      leanMass: client.leanMass,
      primaryGoal: client.primaryGoal,
      targetWeight: client.targetWeight,
      targetDate: client.targetDate,
      goalNotes: client.goalNotes,
      medicalHistory: client.medicalHistory,
      lifestyle: client.lifestyle,
      fitnessExperience: client.fitnessExperience,
      nutrition: client.nutrition,
      assignedPlanIds: client.assignedPlanIds,
      status: client.status,
      firstAssessmentDate: client.firstAssessmentDate,
      lastAssessmentDate: client.lastAssessmentDate,
      generalNotes: client.generalNotes,
      privateNotes: client.privateNotes,
      activationToken: client.auth?.activationToken,
      activationTokenExpiry: client.auth?.activationTokenExpiry
        ? new Date(client.auth.activationTokenExpiry)
        : null,
      passwordHash: client.auth?.passwordHash,
      isActivated: client.auth?.isActivated,
      lastLogin: client.auth?.lastLogin
        ? new Date(client.auth.lastLogin)
        : null,
      measurements: {
        create: client.measurements?.map((m) => ({
          id: m.id,
          date: m.date,
          weight: m.weight,
          bodyFatPercentage: m.bodyFatPercentage,
          leanMass: m.leanMass,
          chest: m.chest,
          waist: m.waist,
          hips: m.hips,
          arms: m.arms,
          thighs: m.thighs,
          notes: m.notes,
          photos: m.photos,
        })),
      },
    },
    create: {
      id: client.id,
      fullName: client.fullName,
      email: client.email,
      phone: client.phone,
      dateOfBirth: client.dateOfBirth,
      gender: client.gender,
      profilePhoto: client.profilePhoto,
      currentWeight: client.currentWeight,
      height: client.height,
      bodyFatPercentage: client.bodyFatPercentage,
      leanMass: client.leanMass,
      primaryGoal: client.primaryGoal,
      targetWeight: client.targetWeight,
      targetDate: client.targetDate,
      goalNotes: client.goalNotes,
      medicalHistory: client.medicalHistory,
      lifestyle: client.lifestyle,
      fitnessExperience: client.fitnessExperience,
      nutrition: client.nutrition,
      assignedPlanIds: client.assignedPlanIds,
      status: client.status,
      firstAssessmentDate: client.firstAssessmentDate,
      lastAssessmentDate: client.lastAssessmentDate,
      generalNotes: client.generalNotes,
      privateNotes: client.privateNotes,
      activationToken: client.auth?.activationToken,
      activationTokenExpiry: client.auth?.activationTokenExpiry
        ? new Date(client.auth.activationTokenExpiry)
        : undefined,
      passwordHash: client.auth?.passwordHash,
      isActivated: client.auth?.isActivated,
      lastLogin: client.auth?.lastLogin
        ? new Date(client.auth.lastLogin)
        : undefined,
      measurements: {
        create: client.measurements?.map((m) => ({
          id: m.id,
          date: m.date,
          weight: m.weight,
          bodyFatPercentage: m.bodyFatPercentage,
          leanMass: m.leanMass,
          chest: m.chest,
          waist: m.waist,
          hips: m.hips,
          arms: m.arms,
          thighs: m.thighs,
          notes: m.notes,
          photos: m.photos,
        })),
      },
    },
    include: {
      measurements: true,
    },
  });

  return {
    id: saved.id,
    fullName: saved.fullName,
    email: saved.email,
    phone: saved.phone ?? undefined,
    dateOfBirth: saved.dateOfBirth
      ? saved.dateOfBirth.toISOString()
      : undefined,
    gender: (saved.gender as "male" | "female" | undefined) ?? undefined,
    profilePhoto: saved.profilePhoto ?? undefined,
    currentWeight: saved.currentWeight ?? undefined,
    height: saved.height ?? undefined,
    bodyFatPercentage: saved.bodyFatPercentage ?? undefined,
    leanMass: saved.leanMass ?? undefined,
    primaryGoal: saved.primaryGoal as Client["primaryGoal"],
    targetWeight: saved.targetWeight ?? undefined,
    targetDate: saved.targetDate ? saved.targetDate.toISOString() : undefined,
    goalNotes: saved.goalNotes ?? undefined,
    medicalHistory: saved.medicalHistory
      ? (saved.medicalHistory as any)
      : undefined,
    lifestyle: saved.lifestyle ? (saved.lifestyle as any) : undefined,
    fitnessExperience: saved.fitnessExperience
      ? (saved.fitnessExperience as any)
      : undefined,
    nutrition: saved.nutrition ? (saved.nutrition as any) : undefined,
    assignedPlanIds: saved.assignedPlanIds as string[],
    status: saved.status as Client["status"],
    firstAssessmentDate: saved.firstAssessmentDate.toISOString(),
    lastAssessmentDate: saved.lastAssessmentDate
      ? saved.lastAssessmentDate.toISOString()
      : undefined,
    generalNotes: saved.generalNotes ?? undefined,
    privateNotes: saved.privateNotes ?? undefined,
    measurements: saved.measurements.map((m) => ({
      id: m.id,
      date: typeof m.date === "string" ? m.date : m.date.toISOString(),
      weight: m.weight ?? undefined,
      bodyFatPercentage: m.bodyFatPercentage ?? undefined,
      leanMass: m.leanMass ?? undefined,
      chest: m.chest ?? undefined,
      waist: m.waist ?? undefined,
      hips: m.hips ?? undefined,
      arms: m.arms ?? undefined,
      thighs: m.thighs ?? undefined,
      notes: m.notes ?? undefined,
      photos: (m.photos as string[]) ?? [],
    })),
    auth: saved.passwordHash
      ? {
          activationToken: saved.activationToken ?? undefined,
          activationTokenExpiry: saved.activationTokenExpiry?.toISOString(),
          passwordHash: saved.passwordHash,
          isActivated: saved.isActivated ?? false,
          lastLogin: saved.lastLogin?.toISOString(),
        }
      : undefined,
    createdAt: saved.createdAt.toISOString(),
    updatedAt: saved.updatedAt.toISOString(),
  };
}

export async function deleteClient(id: string): Promise<void> {
  await prisma.client.delete({ where: { id } });
}

// ============================================
// CONTACT SUBMISSIONS
// ============================================

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  const submissions = await prisma.contactSubmission.findMany({
    orderBy: { submittedAt: "desc" },
  });
  return submissions.map((s) => ({
    id: s.id,
    name: s.name,
    email: s.email,
    phone: s.phone ?? undefined,
    message: s.message,
    submittedAt: s.submittedAt.toISOString(),
  }));
}

export async function saveContactSubmission(
  submission: ContactSubmission
): Promise<ContactSubmission> {
  const saved = await prisma.contactSubmission.create({
    data: {
      id: submission.id,
      name: submission.name,
      email: submission.email,
      phone: submission.phone,
      message: submission.message,
    },
  });
  return {
    id: saved.id,
    name: saved.name,
    email: saved.email,
    phone: saved.phone ?? undefined,
    message: saved.message,
    submittedAt: saved.submittedAt.toISOString(),
  };
}
