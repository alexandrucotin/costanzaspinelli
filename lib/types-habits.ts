import { z } from "zod";

// ============================================
// HABIT TYPES
// ============================================

export const HabitTypeEnum = z.enum(["checkbox", "number", "scale"]);
export type HabitType = z.infer<typeof HabitTypeEnum>;

export const HabitCategoryEnum = z.enum([
  "hydration",
  "sleep",
  "nutrition",
  "recovery",
  "movement",
  "mindset",
  "other",
]);
export type HabitCategory = z.infer<typeof HabitCategoryEnum>;

export const HabitFrequencyEnum = z.enum(["daily", "weekly"]);
export type HabitFrequency = z.infer<typeof HabitFrequencyEnum>;

// Habit Schema
export const HabitSchema = z.object({
  id: z.string(),
  clientId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  type: HabitTypeEnum,
  category: HabitCategoryEnum,
  frequency: HabitFrequencyEnum,
  target: z.any().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  isActive: z.boolean(),
  startDate: z.string(),
  endDate: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Habit = z.infer<typeof HabitSchema>;

// Habit with logs for analytics
export const HabitWithLogsSchema = HabitSchema.extend({
  logs: z.array(
    z.object({
      id: z.string(),
      date: z.string(),
      value: z.any(),
      notes: z.string().optional(),
    })
  ),
});

export type HabitWithLogs = z.infer<typeof HabitWithLogsSchema>;

// Habit Log Schema
export const HabitLogSchema = z.object({
  id: z.string(),
  habitId: z.string(),
  date: z.string(),
  value: z.any(),
  notes: z.string().optional(),
  createdAt: z.string(),
});

export type HabitLog = z.infer<typeof HabitLogSchema>;

// Habit Template Schema
export const HabitTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  type: HabitTypeEnum,
  category: HabitCategoryEnum,
  frequency: HabitFrequencyEnum,
  target: z.any().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  isDefault: z.boolean(),
  createdAt: z.string(),
});

export type HabitTemplate = z.infer<typeof HabitTemplateSchema>;

// Create Habit Schema (without id and timestamps)
export const CreateHabitSchema = z.object({
  clientId: z.string(),
  name: z.string().min(1, "Nome richiesto"),
  description: z.string().optional(),
  type: HabitTypeEnum,
  category: HabitCategoryEnum,
  frequency: HabitFrequencyEnum,
  target: z.any().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  startDate: z.string().optional(),
});

export type CreateHabit = z.infer<typeof CreateHabitSchema>;

// Log Habit Schema
export const LogHabitSchema = z.object({
  habitId: z.string(),
  date: z.string(), // ISO date string
  value: z.any(), // { completed: true } or { value: 8 } or { rating: 7 }
  notes: z.string().optional(),
});

export type LogHabit = z.infer<typeof LogHabitSchema>;

// Habit Stats for dashboard
export const HabitStatsSchema = z.object({
  habitId: z.string(),
  habitName: z.string(),
  currentStreak: z.number(),
  longestStreak: z.number(),
  completionRate: z.number(), // percentage
  totalLogs: z.number(),
  lastLogDate: z.string().optional(),
});

export type HabitStats = z.infer<typeof HabitStatsSchema>;

// Category labels for UI
export const categoryLabels: Record<HabitCategory, string> = {
  hydration: "Idratazione",
  sleep: "Sonno",
  nutrition: "Nutrizione",
  recovery: "Recovery",
  movement: "Movimento",
  mindset: "Mindset",
  other: "Altro",
};

// Category colors for UI
export const categoryColors: Record<HabitCategory, string> = {
  hydration: "#3b82f6", // blue
  sleep: "#8b5cf6", // purple
  nutrition: "#10b981", // green
  recovery: "#f59e0b", // amber
  movement: "#ef4444", // red
  mindset: "#ec4899", // pink
  other: "#6b7280", // gray
};

// Category icons (emoji)
export const categoryIcons: Record<HabitCategory, string> = {
  hydration: "💧",
  sleep: "😴",
  nutrition: "🥗",
  recovery: "🧘",
  movement: "🏃",
  mindset: "🧠",
  other: "📌",
};
