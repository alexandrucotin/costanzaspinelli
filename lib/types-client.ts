import { z } from "zod";

// Measurement record for tracking progress over time
export const MeasurementRecordSchema = z.object({
  id: z.string(),
  date: z.string(),
  weight: z.number().optional(),
  bodyFatPercentage: z.number().optional(),
  leanMass: z.number().optional(),
  // Circonferenze
  chest: z.number().optional(),
  waist: z.number().optional(),
  hips: z.number().optional(),
  arms: z.number().optional(),
  thighs: z.number().optional(),
  // Note sulla misurazione
  notes: z.string().optional(),
  // Foto associate (URLs)
  photos: z.array(z.string()).default([]),
});

export type MeasurementRecord = z.infer<typeof MeasurementRecordSchema>;

// Medical history and injuries
export const MedicalHistorySchema = z.object({
  currentConditions: z.string().optional(), // Patologie attuali
  pastConditions: z.string().optional(), // Patologie passate
  medications: z.string().optional(), // Farmaci
  allergies: z.string().optional(), // Allergie
  surgeries: z.string().optional(), // Interventi chirurgici
  injuries: z.string().optional(), // Traumi e infortuni
  limitations: z.string().optional(), // Limitazioni fisiche
  recurringPain: z.string().optional(), // Dolori ricorrenti
});

export type MedicalHistory = z.infer<typeof MedicalHistorySchema>;

// Lifestyle information
export const LifestyleSchema = z.object({
  activityLevel: z.enum([
    "sedentary",
    "lightly_active",
    "moderately_active",
    "very_active",
    "extremely_active",
  ]),
  occupation: z.string().optional(),
  sleepHours: z.number().optional(),
  stressLevel: z.number().min(1).max(10).optional(),
  smoker: z.enum(["yes", "no", "ex"]).optional(),
  alcoholConsumption: z
    .enum(["never", "occasional", "moderate", "frequent"])
    .optional(),
});

export type Lifestyle = z.infer<typeof LifestyleSchema>;

// Fitness experience
export const FitnessExperienceSchema = z.object({
  yearsTraining: z.number().optional(),
  currentFrequency: z.number().optional(), // giorni/settimana
  sportsPlayed: z.string().optional(),
  previousExperience: z.string().optional(),
  trainingPreference: z.enum(["gym", "home", "outdoor", "mixed"]).optional(),
  weeklyAvailability: z.string().optional(), // giorni e orari disponibili
});

export type FitnessExperience = z.infer<typeof FitnessExperienceSchema>;

// Nutrition info (optional)
export const NutritionInfoSchema = z.object({
  dietType: z
    .enum(["omnivore", "vegetarian", "vegan", "pescatarian", "other"])
    .optional(),
  dailyCalories: z.number().optional(),
  proteinGrams: z.number().optional(),
  carbsGrams: z.number().optional(),
  fatGrams: z.number().optional(),
  supplements: z.string().optional(),
  mealsPerDay: z.number().optional(),
});

export type NutritionInfo = z.infer<typeof NutritionInfoSchema>;

// Main Client schema
export const ClientSchema = z.object({
  id: z.string(),

  // Anagrafica
  fullName: z.string().min(1, "Nome completo richiesto"),
  email: z.string().email("Email non valida"),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  profilePhoto: z.string().url().optional().or(z.literal("")),

  // Dati antropometrici attuali
  currentWeight: z.number().optional(),
  height: z.number().optional(), // cm
  bodyFatPercentage: z.number().optional(),
  leanMass: z.number().optional(),

  // Obiettivi
  primaryGoal: z.enum([
    "hypertrophy",
    "strength",
    "weight_loss",
    "recomposition",
    "endurance",
    "general_fitness",
    "mobility",
  ]),
  targetWeight: z.number().optional(),
  targetDate: z.string().optional(),
  goalNotes: z.string().optional(),

  // Anamnesi
  medicalHistory: MedicalHistorySchema.optional(),

  // Stile di vita
  lifestyle: LifestyleSchema.optional(),

  // Esperienza fitness
  fitnessExperience: FitnessExperienceSchema.optional(),

  // Nutrizione (opzionale)
  nutrition: NutritionInfoSchema.optional(),

  // Storico misurazioni
  measurements: z.array(MeasurementRecordSchema).default([]),

  // Schede associate
  assignedPlanIds: z.array(z.string()).default([]),

  // Tracking
  status: z.enum(["active", "paused", "completed"]).default("active"),
  firstAssessmentDate: z.string(),
  lastAssessmentDate: z.string().optional(),

  // Note
  generalNotes: z.string().optional(),
  privateNotes: z.string().optional(),

  // Auth (for client portal access)
  auth: z
    .object({
      activationToken: z.string().optional(),
      activationTokenExpiry: z.string().optional(),
      passwordHash: z.string().optional(),
      isActivated: z.boolean().default(false),
      lastLogin: z.string().optional(),
    })
    .optional(),

  // Metadata
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Client = z.infer<typeof ClientSchema>;

// Labels for UI
export const goalLabelsClient = {
  hypertrophy: "Ipertrofia Muscolare",
  strength: "Forza",
  weight_loss: "Dimagrimento",
  recomposition: "Ricomposizione Corporea",
  endurance: "Resistenza",
  general_fitness: "Fitness Generale",
  mobility: "Mobilità",
} as const;

export const statusLabels = {
  active: "Attivo",
  paused: "In Pausa",
  completed: "Concluso",
} as const;

export const activityLevelLabels = {
  sedentary: "Sedentario",
  lightly_active: "Leggermente Attivo",
  moderately_active: "Moderatamente Attivo",
  very_active: "Molto Attivo",
  extremely_active: "Estremamente Attivo",
} as const;

export const genderLabels = {
  male: "Maschio",
  female: "Femmina",
  other: "Altro",
} as const;
