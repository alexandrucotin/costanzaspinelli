import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth-admin";

export async function POST() {
  try {
    await deleteSession();

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
