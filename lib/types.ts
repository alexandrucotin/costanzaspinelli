import { z } from "zod";

export const ExerciseSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nome esercizio richiesto"),
  muscleGroup: z.string().min(1, "Gruppo muscolare richiesto"),
  equipment: z.enum(["gym", "home", "both", "bodyweight"]),
  category: z.string().min(1, "Categoria richiesta"),
  defaultRestSeconds: z.number().min(0).optional(),
  defaultTempo: z.string().optional(),
  videoUrl: z.string().url().optional().or(z.literal("")),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Exercise = z.infer<typeof ExerciseSchema>;

export const ExerciseRowSchema = z
  .object({
    id: z.string(),
    exerciseId: z.string().optional(),
    exerciseName: z.string().min(1, "Nome esercizio richiesto"),
    sets: z.number().min(1, "Almeno 1 serie"),
    reps: z.number().optional(),
    timeSeconds: z.number().optional(),
    loadKg: z.number().optional(),
    rpe: z.number().min(1).max(10).optional(),
    rir: z.number().min(0).max(5).optional(),
    restSeconds: z.number().min(0, "Riposo deve essere >= 0"),
    tempo: z.string().optional(),
    notes: z.string().optional(),
  })
  .refine((data) => data.reps !== undefined || data.timeSeconds !== undefined, {
    message: "Specificare ripetizioni o tempo",
    path: ["reps"],
  });

export type ExerciseRow = z.infer<typeof ExerciseRowSchema>;

export const SectionSchema = z.object({
  id: z.string(),
  type: z.enum(["warmup", "main", "cooldown"]),
  exercises: z.array(ExerciseRowSchema),
});

export type Section = z.infer<typeof SectionSchema>;

export const SessionSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nome sessione richiesto"),
  sections: z.array(SectionSchema),
});

export type Session = z.infer<typeof SessionSchema>;

export const WorkoutPlanSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Titolo richiesto"),
  clientName: z.string().min(1, "Nome cliente richiesto"),
  goal: z.enum([
    "hypertrophy",
    "strength",
    "endurance",
    "general",
    "weight_loss",
    "mobility",
  ]),
  startDate: z.string().optional(),
  durationWeeks: z.number().min(1, "Durata minima 1 settimana"),
  frequencyDaysPerWeek: z.number().min(1).max(7, "Frequenza tra 1 e 7 giorni"),
  equipment: z.enum(["gym", "home", "both"]),
  notes: z.string().optional(),
  contraindications: z.string().optional(),
  sessions: z.array(SessionSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type WorkoutPlan = z.infer<typeof WorkoutPlanSchema>;

export const ContactSubmissionSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nome richiesto"),
  email: z.string().email("Email non valida"),
  phone: z.string().optional(),
  message: z.string().min(1, "Messaggio richiesto"),
  submittedAt: z.string(),
});

export type ContactSubmission = z.infer<typeof ContactSubmissionSchema>;

export const goalLabels: Record<WorkoutPlan["goal"], string> = {
  hypertrophy: "Ipertrofia",
  strength: "Forza",
  endurance: "Resistenza",
  general: "Generale",
  weight_loss: "Dimagrimento",
  mobility: "Mobilità",
};

export const equipmentLabels: Record<
  Exercise["equipment"] | WorkoutPlan["equipment"],
  string
> = {
  gym: "Palestra",
  home: "Casa",
  both: "Entrambi",
  bodyweight: "Corpo libero",
};

export const sectionLabels: Record<Section["type"], string> = {
  warmup: "Riscaldamento",
  main: "Allenamento Principale",
  cooldown: "Defaticamento",
};
