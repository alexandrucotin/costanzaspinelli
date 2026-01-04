import { SignJWT, jwtVerify } from "jose";
import { prisma } from "./prisma";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
);

const INVITATION_EXPIRY_DAYS = 7;

export interface InvitationPayload {
  email: string;
  clientId: string;
  invitationId: string;
}

/**
 * Generate a secure invitation token for a client
 */
export async function generateInvitationToken(
  email: string,
  clientId: string,
  createdBy: string
): Promise<{ token: string; invitationId: string; expiresAt: Date }> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + INVITATION_EXPIRY_DAYS);

  // Create invitation record in database
  const invitation = await prisma.clientInvitation.create({
    data: {
      email,
      clientId,
      createdBy,
      expiresAt,
      token: "", // Will be updated after JWT generation
    },
  });

  // Generate JWT token with invitation ID
  const token = await new SignJWT({
    email,
    clientId,
    invitationId: invitation.id,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(JWT_SECRET);

  // Update invitation with the generated token
  await prisma.clientInvitation.update({
    where: { id: invitation.id },
    data: { token },
  });

  return {
    token,
    invitationId: invitation.id,
    expiresAt,
  };
}

/**
 * Verify and decode an invitation token
 */
export async function verifyInvitationToken(
  token: string
): Promise<InvitationPayload | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    const payload = verified.payload;

    // Validate payload structure
    if (
      typeof payload.email === "string" &&
      typeof payload.clientId === "string" &&
      typeof payload.invitationId === "string"
    ) {
      return {
        email: payload.email,
        clientId: payload.clientId,
        invitationId: payload.invitationId,
      };
    }

    return null;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

/**
 * Validate invitation and check if it can be used
 */
export async function validateInvitation(token: string): Promise<{
  valid: boolean;
  invitation?: {
    id: string;
    email: string;
    clientId: string;
    expiresAt: Date;
  };
  error?: string;
}> {
  // Verify JWT token
  const payload = await verifyInvitationToken(token);
  if (!payload) {
    return { valid: false, error: "Token non valido" };
  }

  // Check invitation in database
  const invitation = await prisma.clientInvitation.findUnique({
    where: { token },
    include: { client: true },
  });

  if (!invitation) {
    return { valid: false, error: "Invito non trovato" };
  }

  // Check if already used
  if (invitation.usedAt) {
    return { valid: false, error: "Invito già utilizzato" };
  }

  // Check if expired
  if (new Date() > invitation.expiresAt) {
    return { valid: false, error: "Invito scaduto" };
  }

  // Check if still valid
  if (!invitation.isValid) {
    return { valid: false, error: "Invito non più valido" };
  }

  // Check if client is already activated
  if (invitation.client.isActivated) {
    return { valid: false, error: "Account già attivato" };
  }

  return {
    valid: true,
    invitation: {
      id: invitation.id,
      email: invitation.email,
      clientId: invitation.clientId,
      expiresAt: invitation.expiresAt,
    },
  };
}

/**
 * Mark invitation as used
 */
export async function markInvitationAsUsed(
  invitationId: string
): Promise<void> {
  await prisma.clientInvitation.update({
    where: { id: invitationId },
    data: {
      usedAt: new Date(),
      isValid: false,
    },
  });
}

/**
 * Get invitation by client ID
 */
export async function getInvitationByClientId(clientId: string) {
  return await prisma.clientInvitation.findUnique({
    where: { clientId },
  });
}

/**
 * Invalidate all invitations for a client
 */
export async function invalidateClientInvitations(
  clientId: string
): Promise<void> {
  await prisma.clientInvitation.updateMany({
    where: { clientId },
    data: { isValid: false },
  });
}

/**
 * Generate invitation URL
 */
export function generateInvitationUrl(token: string, baseUrl?: string): string {
  const base =
    baseUrl || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${base}/invito/${token}`;
}
