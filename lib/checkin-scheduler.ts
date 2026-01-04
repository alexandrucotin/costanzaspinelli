import { prisma } from "@/lib/prisma";

/**
 * Generate weekly check-ins for all active clients
 * This should be called every Sunday at 20:00
 */
export async function generateWeeklyCheckIns(): Promise<number> {
  // Get all active clients
  const activeClients = await prisma.client.findMany({
    where: {
      status: "active",
      isActivated: true,
    },
    select: {
      id: true,
    },
  });

  if (activeClients.length === 0) {
    return 0;
  }

  // Calculate next Sunday at 20:00
  const now = new Date();
  const nextSunday = new Date(now);
  nextSunday.setDate(now.getDate() + ((7 - now.getDay()) % 7 || 7));
  nextSunday.setHours(20, 0, 0, 0);

  // Check if check-ins already exist for this week
  const existingCheckIns = await prisma.checkIn.findMany({
    where: {
      scheduledAt: nextSunday,
      type: "weekly",
    },
    select: {
      clientId: true,
    },
  });

  const existingClientIds = new Set(existingCheckIns.map((c) => c.clientId));

  // Create check-ins for clients who don't have one yet
  const clientsToCreate = activeClients.filter(
    (client) => !existingClientIds.has(client.id)
  );

  if (clientsToCreate.length === 0) {
    return 0;
  }

  const result = await prisma.checkIn.createMany({
    data: clientsToCreate.map((client) => ({
      clientId: client.id,
      type: "weekly",
      status: "pending",
      scheduledAt: nextSunday,
    })),
  });

  return result.count;
}

/**
 * Mark check-ins as overdue if they're past the deadline (48 hours after scheduled)
 */
export async function markOverdueCheckIns(): Promise<number> {
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

  return result.count;
}

/**
 * Generate initial check-in for a new client
 * Called when a client is activated
 */
export async function generateInitialCheckIn(clientId: string): Promise<void> {
  // Calculate next Sunday at 20:00
  const now = new Date();
  const nextSunday = new Date(now);
  const daysUntilSunday = (7 - now.getDay()) % 7 || 7;
  nextSunday.setDate(now.getDate() + daysUntilSunday);
  nextSunday.setHours(20, 0, 0, 0);

  // Check if check-in already exists
  const existing = await prisma.checkIn.findFirst({
    where: {
      clientId,
      scheduledAt: nextSunday,
      type: "weekly",
    },
  });

  if (existing) {
    return; // Already exists
  }

  // Create check-in
  await prisma.checkIn.create({
    data: {
      clientId,
      type: "weekly",
      status: "pending",
      scheduledAt: nextSunday,
    },
  });
}

/**
 * Get check-in statistics for admin dashboard
 */
export async function getCheckInStats(): Promise<{
  total: number;
  pending: number;
  overdue: number;
  submitted: number;
  reviewed: number;
}> {
  const [total, pending, overdue, submitted, reviewed] = await Promise.all([
    prisma.checkIn.count(),
    prisma.checkIn.count({ where: { status: "pending" } }),
    prisma.checkIn.count({ where: { status: "overdue" } }),
    prisma.checkIn.count({ where: { status: "submitted" } }),
    prisma.checkIn.count({ where: { status: "reviewed" } }),
  ]);

  return {
    total,
    pending,
    overdue,
    submitted,
    reviewed,
  };
}
