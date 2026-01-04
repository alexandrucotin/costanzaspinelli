import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { hashPassword } from "@/lib/auth-admin";
import {
  validateInvitation,
  markInvitationAsUsed,
} from "@/lib/client-invitations";
import { getClientById, saveClient } from "@/lib/db-adapter";

const RegisterSchema = z
  .object({
    token: z.string(),
    password: z
      .string()
      .min(8, "La password deve essere di almeno 8 caratteri"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Le password non coincidono",
    path: ["confirmPassword"],
  });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = RegisterSchema.parse(body);

    // Validate invitation token
    const invitationResult = await validateInvitation(validated.token);

    if (!invitationResult.valid || !invitationResult.invitation) {
      return NextResponse.json(
        { error: invitationResult.error || "Invito non valido" },
        { status: 400 }
      );
    }

    const { clientId, email } = invitationResult.invitation;

    // Get client from database
    const client = await getClientById(clientId);

    if (!client) {
      return NextResponse.json(
        { error: "Cliente non trovato" },
        { status: 404 }
      );
    }

    // Check if already activated
    if (client.auth?.isActivated) {
      return NextResponse.json(
        { error: "Account già attivato" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(validated.password);

    // Update client with auth info
    const updatedClient = {
      ...client,
      auth: {
        passwordHash,
        isActivated: true,
        activationToken: undefined,
        activationTokenExpiry: undefined,
        lastLogin: undefined,
      },
      updatedAt: new Date().toISOString(),
    };

    await saveClient(updatedClient);

    // Mark invitation as used
    await markInvitationAsUsed(invitationResult.invitation.id);

    return NextResponse.json({
      success: true,
      message: "Registrazione completata con successo",
      email,
    });
  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Errore durante la registrazione" },
      { status: 500 }
    );
  }
}
