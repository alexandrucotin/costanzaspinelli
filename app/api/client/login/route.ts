import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getClients } from "@/lib/db-adapter";
import {
  verifyPassword,
  createSessionToken,
  setSessionCookie,
} from "@/lib/auth-client";

const LoginSchema = z.object({
  email: z.string().email("Email non valida"),
  password: z.string().min(1, "Password richiesta"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = LoginSchema.parse(body);

    // Get all clients
    const clients = await getClients();
    const client = clients.find(
      (c) => c.email.toLowerCase() === validated.email.toLowerCase()
    );

    if (!client) {
      return NextResponse.json(
        { error: "Email o password non validi" },
        { status: 401 }
      );
    }

    // Check if client is activated
    if (!client.auth?.isActivated) {
      return NextResponse.json(
        {
          error:
            "Account non ancora attivato. Controlla la tua email per il link di attivazione.",
        },
        { status: 401 }
      );
    }

    // Verify password
    if (!client.auth.passwordHash) {
      return NextResponse.json(
        { error: "Account non configurato correttamente" },
        { status: 401 }
      );
    }

    const isValidPassword = await verifyPassword(
      validated.password,
      client.auth.passwordHash
    );

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Email o password non validi" },
        { status: 401 }
      );
    }

    // Create session token
    const token = await createSessionToken({
      clientId: client.id,
      email: client.email,
      name: client.fullName,
    });

    // Set session cookie
    await setSessionCookie(token);

    // Update last login
    // Note: We could update this in the database, but for now we'll skip it
    // to avoid additional database writes on every login

    return NextResponse.json({
      success: true,
      message: "Login effettuato con successo",
      client: {
        id: client.id,
        email: client.email,
        name: client.fullName,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Errore durante il login" },
      { status: 500 }
    );
  }
}
