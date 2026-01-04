import { NextResponse } from "next/server";
import { deleteSessionCookie } from "@/lib/auth-client";

export async function POST() {
  try {
    await deleteSessionCookie();

    return NextResponse.json({
      success: true,
      message: "Logout effettuato con successo",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Errore durante il logout" },
      { status: 500 }
    );
  }
}
