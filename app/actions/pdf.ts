"use server";

import { getPlanById } from "@/lib/data";
import { generatePdfBuffer } from "@/lib/pdf-generator";

export async function generatePdfAction(
  planId: string
): Promise<{ success: boolean; data?: Uint8Array; error?: string }> {
  try {
    const plan = await getPlanById(planId);

    if (!plan) {
      return { success: false, error: "Scheda non trovata" };
    }

    const pdfBuffer = await generatePdfBuffer(plan);
    return { success: true, data: pdfBuffer };
  } catch (error) {
    console.error("PDF generation error:", error);
    return { success: false, error: "Errore nella generazione del PDF" };
  }
}
