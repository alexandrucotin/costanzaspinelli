import { NextRequest, NextResponse } from "next/server";
import { validateInvitation } from "@/lib/client-invitations";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { valid: false, error: "Token mancante" },
        { status: 400 }
      );
    }

    const result = await validateInvitation(token);

    if (result.valid && result.invitation) {
      return NextResponse.json({
        valid: true,
        email: result.invitation.email,
        clientId: result.invitation.clientId,
      });
    }

    return NextResponse.json({
      valid: false,
      error: result.error || "Invito non valido",
    });
  } catch (error) {
    console.error("Validation error:", error);
    return NextResponse.json(
      { valid: false, error: "Errore durante la validazione" },
      { status: 500 }
    );
  }
}
