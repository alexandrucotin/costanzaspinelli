"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  CheckIn,
  CheckInWithClient,
  WeeklyCheckInData,
  CheckInFilters,
  CreateWeeklyCheckInSchema,
} from "@/lib/types-checkin";
import { getClientSession } from "@/lib/auth-client";
import { getSession as getAdminSession } from "@/lib/auth-admin";

// ============================================
// CLIENT ACTIONS
// ============================================

/**
 * Get all check-ins for the current logged-in client
 */
export async function getMyCheckIns(): Promise<CheckIn[]> {
  const session = await getClientSession();
  if (!session) {
    throw new Error("Non autorizzato");
  }

  const checkIns = await prisma.checkIn.findMany({
    where: {
      clientId: session.clientId,
    },
    orderBy: {
      scheduledAt: "desc",
    },
  });

  return checkIns.map((c) => ({
    id: c.id,
    clientId: c.clientId,
    type: c.type as "weekly",
    status: c.status as "pending" | "submitted" | "overdue" | "reviewed",
    scheduledAt: c.scheduledAt.toISOString(),
    submittedAt: c.submittedAt?.toISOString(),
    data: c.data,
    coachNotes: c.coachNotes ?? undefined,
    reviewed: c.reviewed,
    reviewedAt: c.reviewedAt?.toISOString(),
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));
}

/**
 * Get a specific check-in by ID (client can only access their own)
 */
export async function getCheckInById(checkInId: string): Promise<CheckIn> {
  const session = await getClientSession();
  if (!session) {
    throw new Error("Non autorizzato");
  }

  const checkIn = await prisma.checkIn.findUnique({
    where: {
      id: checkInId,
      clientId: session.clientId, // Ensure client can only access their own
    },
  });

  if (!checkIn) {
    throw new Error("Check-in non trovato");
  }

  return {
    id: checkIn.id,
    clientId: checkIn.clientId,
    type: checkIn.type as "weekly",
    status: checkIn.status as "pending" | "submitted" | "overdue" | "reviewed",
    scheduledAt: checkIn.scheduledAt.toISOString(),
    submittedAt: checkIn.submittedAt?.toISOString(),
    data: checkIn.data,
    coachNotes: checkIn.coachNotes ?? undefined,
    reviewed: checkIn.reviewed,
    reviewedAt: checkIn.reviewedAt?.toISOString(),
    createdAt: checkIn.createdAt.toISOString(),
    updatedAt: checkIn.updatedAt.toISOString(),
  };
}

/**
 * Submit a weekly check-in
 */
export async function submitWeeklyCheckIn(
  checkInId: string,
  data: WeeklyCheckInData
): Promise<CheckIn> {
  const session = await getClientSession();
  if (!session) {
    throw new Error("Non autorizzato");
  }

  // Validate data
  const validatedData = CreateWeeklyCheckInSchema.parse(data);

  // Check if check-in exists and belongs to client
  const existingCheckIn = await prisma.checkIn.findUnique({
    where: {
      id: checkInId,
      clientId: session.clientId,
    },
  });

  if (!existingCheckIn) {
    throw new Error("Check-in non trovato");
  }

  if (
    existingCheckIn.status === "submitted" ||
    existingCheckIn.status === "reviewed"
  ) {
    throw new Error("Check-in già completato");
  }

  // Update check-in
  const updated = await prisma.checkIn.update({
    where: {
      id: checkInId,
    },
    data: {
      data: validatedData,
      status: "submitted",
      submittedAt: new Date(),
    },
  });

  revalidatePath("/cliente/dashboard");
  revalidatePath("/cliente/check-ins");

  return {
    id: updated.id,
    clientId: updated.clientId,
    type: updated.type as "weekly",
    status: updated.status as "pending" | "submitted" | "overdue" | "reviewed",
    scheduledAt: updated.scheduledAt.toISOString(),
    submittedAt: updated.submittedAt?.toISOString(),
    data: updated.data,
    coachNotes: updated.coachNotes ?? undefined,
    reviewed: updated.reviewed,
    reviewedAt: updated.reviewedAt?.toISOString(),
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  };
}

/**
 * Get pending check-ins count for dashboard widget
 */
export async function getPendingCheckInsCount(): Promise<number> {
  const session = await getClientSession();
  if (!session) {
    return 0;
  }

  const count = await prisma.checkIn.count({
    where: {
      clientId: session.clientId,
      status: {
        in: ["pending", "overdue"],
      },
    },
  });

  return count;
}

// ============================================
// ADMIN ACTIONS
// ============================================

/**
 * Get all check-ins with optional filters (admin only)
 */
export async function getAllCheckIns(
  filters?: CheckInFilters
): Promise<CheckInWithClient[]> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Non autorizzato");
  }

  const where: {
    clientId?: string;
    status?: "pending" | "submitted" | "overdue" | "reviewed";
    type?: "weekly";
    scheduledAt?: {
      gte?: Date;
      lte?: Date;
    };
  } = {};

  if (filters?.clientId) {
    where.clientId = filters.clientId;
  }

  if (filters?.status) {
    where.status = filters.status as
      | "pending"
      | "submitted"
      | "overdue"
      | "reviewed";
  }

  if (filters?.type) {
    where.type = filters.type as "weekly";
  }

  if (filters?.startDate || filters?.endDate) {
    where.scheduledAt = {};
    if (filters.startDate) {
      where.scheduledAt.gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      where.scheduledAt.lte = new Date(filters.endDate);
    }
  }

  const checkIns = await prisma.checkIn.findMany({
    where,
    include: {
      client: {
        select: {
          id: true,
          fullName: true,
          email: true,
          profilePhoto: true,
        },
      },
    },
    orderBy: {
      scheduledAt: "desc",
    },
  });

  return checkIns.map((c) => ({
    id: c.id,
    clientId: c.clientId,
    type: c.type as "weekly",
    status: c.status as "pending" | "submitted" | "overdue" | "reviewed",
    scheduledAt: c.scheduledAt.toISOString(),
    submittedAt: c.submittedAt?.toISOString(),
    data: c.data,
    coachNotes: c.coachNotes ?? undefined,
    reviewed: c.reviewed,
    reviewedAt: c.reviewedAt?.toISOString(),
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
    client: {
      id: c.client.id,
      fullName: c.client.fullName,
      email: c.client.email,
      profilePhoto: c.client.profilePhoto ?? undefined,
    },
  }));
}

/**
 * Get check-ins for a specific client (admin only)
 */
export async function getClientCheckIns(clientId: string): Promise<CheckIn[]> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Non autorizzato");
  }

  const checkIns = await prisma.checkIn.findMany({
    where: {
      clientId,
    },
    orderBy: {
      scheduledAt: "desc",
    },
  });

  return checkIns.map((c) => ({
    id: c.id,
    clientId: c.clientId,
    type: c.type as "weekly",
    status: c.status as "pending" | "submitted" | "overdue" | "reviewed",
    scheduledAt: c.scheduledAt.toISOString(),
    submittedAt: c.submittedAt?.toISOString(),
    data: c.data,
    coachNotes: c.coachNotes ?? undefined,
    reviewed: c.reviewed,
    reviewedAt: c.reviewedAt?.toISOString(),
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));
}

/**
 * Update coach notes and reviewed status (admin only)
 */
export async function updateCheckInReview(
  checkInId: string,
  coachNotes: string,
  reviewed: boolean
): Promise<CheckIn> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Non autorizzato");
  }

  const updated = await prisma.checkIn.update({
    where: {
      id: checkInId,
    },
    data: {
      coachNotes,
      reviewed,
      reviewedAt: reviewed ? new Date() : null,
      status: reviewed ? "reviewed" : "submitted",
    },
  });

  revalidatePath("/admin/check-ins");
  revalidatePath(`/admin/clienti/${updated.clientId}`);

  return {
    id: updated.id,
    clientId: updated.clientId,
    type: updated.type as "weekly",
    status: updated.status as "pending" | "submitted" | "overdue" | "reviewed",
    scheduledAt: updated.scheduledAt.toISOString(),
    submittedAt: updated.submittedAt?.toISOString(),
    data: updated.data,
    coachNotes: updated.coachNotes ?? undefined,
    reviewed: updated.reviewed,
    reviewedAt: updated.reviewedAt?.toISOString(),
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  };
}

/**
 * Get check-in by ID (admin can access any)
 */
export async function getCheckInByIdAdmin(
  checkInId: string
): Promise<CheckInWithClient> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Non autorizzato");
  }

  const checkIn = await prisma.checkIn.findUnique({
    where: {
      id: checkInId,
    },
    include: {
      client: {
        select: {
          id: true,
          fullName: true,
          email: true,
          profilePhoto: true,
        },
      },
    },
  });

  if (!checkIn) {
    throw new Error("Check-in non trovato");
  }

  return {
    id: checkIn.id,
    clientId: checkIn.clientId,
    type: checkIn.type as "weekly",
    status: checkIn.status as "pending" | "submitted" | "overdue" | "reviewed",
    scheduledAt: checkIn.scheduledAt.toISOString(),
    submittedAt: checkIn.submittedAt?.toISOString(),
    data: checkIn.data,
    coachNotes: checkIn.coachNotes ?? undefined,
    reviewed: checkIn.reviewed,
    reviewedAt: checkIn.reviewedAt?.toISOString(),
    createdAt: checkIn.createdAt.toISOString(),
    updatedAt: checkIn.updatedAt.toISOString(),
    client: {
      id: checkIn.client.id,
      fullName: checkIn.client.fullName,
      email: checkIn.client.email,
      profilePhoto: checkIn.client.profilePhoto ?? undefined,
    },
  };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Mark overdue check-ins (to be called by cron job or on-demand)
 */
export async function markOverdueCheckIns(): Promise<number> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Non autorizzato");
  }

  const fortyEightHoursAgo = new Date();
  fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);

  const result = await prisma.checkIn.updateMany({
    where: {
      status: "pending",
      scheduledAt: {
        lt: fortyEightHoursAgo,
      },
    },
    data: {
      status: "overdue",
    },
  });

  revalidatePath("/admin/check-ins");

  return result.count;
}
