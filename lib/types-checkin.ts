import { z } from "zod";

// ============================================
// CHECK-IN TYPES
// ============================================

export const CheckInTypeEnum = z.enum(["weekly"]);
export type CheckInType = z.infer<typeof CheckInTypeEnum>;

export const CheckInStatusEnum = z.enum([
  "pending",
  "submitted",
  "overdue",
  "reviewed",
]);
export type CheckInStatus = z.infer<typeof CheckInStatusEnum>;

// Weekly Check-in Data Schema
export const WeeklyCheckInDataSchema = z.object({
  workoutsCompleted: z.number().min(0).max(20),
  motivation: z.number().min(1).max(10),
  stress: z.number().min(1).max(10),
  mentalEnergy: z.number().min(1).max(10),
  perceivedDifficultyHigherThanNormal: z.boolean(),
  mainObstacles: z.array(z.enum(["time", "work", "fatigue", "other"])),
  notes: z.string().optional(),
});

export type WeeklyCheckInData = z.infer<typeof WeeklyCheckInDataSchema>;

// Generic CheckIn Schema
export const CheckInSchema = z.object({
  id: z.string(),
  clientId: z.string(),
  type: CheckInTypeEnum,
  status: CheckInStatusEnum,
  scheduledAt: z.string(),
  submittedAt: z.string().optional(),
  data: z.any().optional(), // JSON data, validated based on type
  coachNotes: z.string().optional(),
  reviewed: z.boolean(),
  reviewedAt: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CheckIn = z.infer<typeof CheckInSchema>;

// CheckIn with client info for admin views
export const CheckInWithClientSchema = CheckInSchema.extend({
  client: z.object({
    id: z.string(),
    fullName: z.string(),
    email: z.string(),
    profilePhoto: z.string().optional(),
  }),
});

export type CheckInWithClient = z.infer<typeof CheckInWithClientSchema>;

// ============================================
// PROGRESS TRACKING TYPES
// ============================================

export const PhotoTypeEnum = z.enum(["front", "side", "back"]);
export type PhotoType = z.infer<typeof PhotoTypeEnum>;

export const ProgressPhotoSchema = z.object({
  id: z.string(),
  progressEntryId: z.string(),
  type: PhotoTypeEnum,
  imageUrl: z.string(),
  createdAt: z.string(),
});

export type ProgressPhoto = z.infer<typeof ProgressPhotoSchema>;

export const ProgressEntrySchema = z.object({
  id: z.string(),
  clientId: z.string(),
  weight: z.number().optional(),
  notes: z.string().optional(),
  createdAt: z.string(),
  photos: z.array(ProgressPhotoSchema).optional(),
});

export type ProgressEntry = z.infer<typeof ProgressEntrySchema>;

// Create schemas (without id and timestamps)
export const CreateWeeklyCheckInSchema = z.object({
  workoutsCompleted: z.number().min(0).max(20),
  motivation: z.number().min(1).max(10),
  stress: z.number().min(1).max(10),
  mentalEnergy: z.number().min(1).max(10),
  perceivedDifficultyHigherThanNormal: z.boolean(),
  mainObstacles: z.array(z.enum(["time", "work", "fatigue", "other"])),
  notes: z.string().optional(),
});

export const CreateProgressEntrySchema = z.object({
  weight: z.number().positive().optional(),
  notes: z.string().optional(),
  photos: z
    .array(
      z.object({
        type: PhotoTypeEnum,
        imageUrl: z.string().min(1), // Accept both URLs and relative paths
      })
    )
    .optional(),
});

export type CreateProgressEntry = z.infer<typeof CreateProgressEntrySchema>;

// Filter schemas for admin views
export const CheckInFiltersSchema = z.object({
  clientId: z.string().optional(),
  status: CheckInStatusEnum.optional(),
  type: CheckInTypeEnum.optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type CheckInFilters = z.infer<typeof CheckInFiltersSchema>;
