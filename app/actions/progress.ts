"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  ProgressEntry,
  CreateProgressEntry,
  CreateProgressEntrySchema,
} from "@/lib/types-checkin";
import { getClientSession } from "@/lib/auth-client";
import { getSession as getAdminSession } from "@/lib/auth-admin";
import { startOfWeek, endOfWeek } from "date-fns";

// ============================================
// CLIENT ACTIONS
// ============================================

/**
 * Get all progress entries for the current logged-in client
 */
export async function getMyProgressEntries(): Promise<ProgressEntry[]> {
  const session = await getClientSession();
  if (!session) {
    throw new Error("Non autorizzato");
  }

  const entries = await prisma.progressEntry.findMany({
    where: {
      clientId: session.clientId,
    },
    include: {
      photos: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return entries.map((e) => ({
    id: e.id,
    clientId: e.clientId,
    weight: e.weight ?? undefined,
    notes: e.notes ?? undefined,
    createdAt: e.createdAt.toISOString(),
    photos: e.photos.map((p) => ({
      id: p.id,
      progressEntryId: p.progressEntryId,
      type: p.type as "front" | "side" | "back",
      imageUrl: p.imageUrl,
      createdAt: p.createdAt.toISOString(),
    })),
  }));
}

/**
 * Create a new progress entry
 */
export async function createProgressEntry(
  data: CreateProgressEntry
): Promise<ProgressEntry> {
  const session = await getClientSession();
  if (!session) {
    throw new Error("Non autorizzato");
  }

  // Validate data
  const validatedData = CreateProgressEntrySchema.parse(data);

  // Check weekly upload limit (1 per week)
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 }); // Sunday

  const existingEntryThisWeek = await prisma.progressEntry.findFirst({
    where: {
      clientId: session.clientId,
      createdAt: {
        gte: weekStart,
        lte: weekEnd,
      },
    },
  });

  if (existingEntryThisWeek) {
    throw new Error(
      "Puoi caricare solo un progresso alla settimana. Riprova la prossima settimana."
    );
  }

  // Create progress entry with photos
  const entry = await prisma.progressEntry.create({
    data: {
      clientId: session.clientId,
      weight: validatedData.weight,
      notes: validatedData.notes,
      photos: validatedData.photos
        ? {
            create: validatedData.photos.map((photo) => ({
              type: photo.type,
              imageUrl: photo.imageUrl,
            })),
          }
        : undefined,
    },
    include: {
      photos: true,
    },
  });

  revalidatePath("/cliente/progresso");
  revalidatePath("/cliente/dashboard");

  return {
    id: entry.id,
    clientId: entry.clientId,
    weight: entry.weight ?? undefined,
    notes: entry.notes ?? undefined,
    createdAt: entry.createdAt.toISOString(),
    photos: entry.photos.map((p) => ({
      id: p.id,
      progressEntryId: p.progressEntryId,
      type: p.type as "front" | "side" | "back",
      imageUrl: p.imageUrl,
      createdAt: p.createdAt.toISOString(),
    })),
  };
}

/**
 * Get a specific progress entry by ID
 */
export async function getProgressEntryById(
  entryId: string
): Promise<ProgressEntry> {
  const session = await getClientSession();
  if (!session) {
    throw new Error("Non autorizzato");
  }

  const entry = await prisma.progressEntry.findUnique({
    where: {
      id: entryId,
      clientId: session.clientId, // Ensure client can only access their own
    },
    include: {
      photos: true,
    },
  });

  if (!entry) {
    throw new Error("Voce di progresso non trovata");
  }

  return {
    id: entry.id,
    clientId: entry.clientId,
    weight: entry.weight ?? undefined,
    notes: entry.notes ?? undefined,
    createdAt: entry.createdAt.toISOString(),
    photos: entry.photos.map((p) => ({
      id: p.id,
      progressEntryId: p.progressEntryId,
      type: p.type as "front" | "side" | "back",
      imageUrl: p.imageUrl,
      createdAt: p.createdAt.toISOString(),
    })),
  };
}

/**
 * Delete a progress entry (client can only delete their own)
 */
export async function deleteProgressEntry(entryId: string): Promise<void> {
  const session = await getClientSession();
  if (!session) {
    throw new Error("Non autorizzato");
  }

  // Verify ownership
  const entry = await prisma.progressEntry.findUnique({
    where: {
      id: entryId,
      clientId: session.clientId,
    },
  });

  if (!entry) {
    throw new Error("Voce di progresso non trovata");
  }

  // Delete (photos will be cascade deleted)
  await prisma.progressEntry.delete({
    where: {
      id: entryId,
    },
  });

  revalidatePath("/cliente/progresso");
  revalidatePath("/cliente/dashboard");
}

// ============================================
// ADMIN ACTIONS
// ============================================

/**
 * Get progress entries for a specific client (admin only)
 */
export async function getClientProgressEntries(
  clientId: string
): Promise<ProgressEntry[]> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Non autorizzato");
  }

  const entries = await prisma.progressEntry.findMany({
    where: {
      clientId,
    },
    include: {
      photos: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return entries.map((e) => ({
    id: e.id,
    clientId: e.clientId,
    weight: e.weight ?? undefined,
    notes: e.notes ?? undefined,
    createdAt: e.createdAt.toISOString(),
    photos: e.photos.map((p) => ({
      id: p.id,
      progressEntryId: p.progressEntryId,
      type: p.type as "front" | "side" | "back",
      imageUrl: p.imageUrl,
      createdAt: p.createdAt.toISOString(),
    })),
  }));
}

/**
 * Get latest weight for a client (for dashboard display)
 */
export async function getLatestWeight(
  clientId: string
): Promise<number | null> {
  const session = await getClientSession();

  // Allow both client (own data) and admin (any client)
  if (!session) {
    const adminSession = await getAdminSession();
    if (!adminSession) {
      throw new Error("Non autorizzato");
    }
  } else if (session.clientId !== clientId) {
    throw new Error("Non autorizzato");
  }

  const latestEntry = await prisma.progressEntry.findFirst({
    where: {
      clientId,
      weight: {
        not: null,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      weight: true,
    },
  });

  return latestEntry?.weight ?? null;
}
