import jsPDF from "jspdf";
import { WorkoutPlan, ExerciseRow, Tool } from "./types";
import { Client } from "./types-client";
import QRCode from "qrcode";

const groupingColors = {
  superset: [59, 130, 246], // Blue
  triset: [139, 92, 246], // Purple
  circuit: [16, 185, 129], // Green
  dropset: [245, 158, 11], // Orange
};

export async function generateWorkoutPlanPDF(
  plan: WorkoutPlan,
  client: Client,
  tools: Tool[]
) {
  // Landscape orientation
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  let yPos = 15;
  const pageWidth = 297; // A4 landscape width
  const pageHeight = 210; // A4 landscape height
  const margin = 15;

  // ============================================
  // HEADER
  // ============================================
  doc.setFillColor(0, 0, 0);
  doc.rect(0, 0, pageWidth, 25, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("COSTANZA SPINELLI PT", pageWidth / 2, 12, { align: "center" });

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Personal Trainer Certificata", pageWidth / 2, 18, {
    align: "center",
  });

  doc.setTextColor(0, 0, 0);
  yPos = 32;

  // ============================================
  // PLAN TITLE & CLIENT INFO
  // ============================================
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(plan.title, pageWidth / 2, yPos, { align: "center" });
  yPos += 8;

  // Client info box
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 15, 2, 2, "F");

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`Cliente: ${client.fullName}`, margin + 5, yPos + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Obiettivo: ${plan.goal}`, margin + 5, yPos + 11);
  doc.text(`Durata: ${plan.durationWeeks} settimane`, margin + 80, yPos + 11);
  doc.text(
    `Frequenza: ${plan.frequencyDaysPerWeek}x/settimana`,
    margin + 140,
    yPos + 11
  );

  const today = new Date().toLocaleDateString("it-IT");
  doc.text(`Generato: ${today}`, pageWidth - margin - 40, yPos + 11);

  yPos += 20;

  // Notes if present
  if (plan.notes) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Note:", margin, yPos);
    yPos += 4;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    const noteLines = doc.splitTextToSize(plan.notes, pageWidth - 2 * margin);
    doc.text(noteLines, margin, yPos);
    yPos += noteLines.length * 3.5 + 3;
  }

  // ============================================
  // SESSIONS
  // ============================================
  if (plan.sessions && plan.sessions.length > 0) {
    for (const session of plan.sessions) {
      // Check if we need a new page
      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = 15;
      }

      // Session title with colored bar
      doc.setFillColor(59, 130, 246);
      doc.rect(margin, yPos, 3, 7, "F");

      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text(session.name, margin + 6, yPos + 5);
      yPos += 10;

      // Process exercises by section - ONE TABLE PER SECTION
      for (const section of session.sections) {
        if (section.exercises.length === 0) continue;

        // Check page space
        if (yPos > pageHeight - 50) {
          doc.addPage();
          yPos = 15;
        }

        // Section header
        const sectionLabel =
          section.type === "warmup"
            ? "RISCALDAMENTO"
            : section.type === "main"
            ? "ALLENAMENTO PRINCIPALE"
            : "DEFATICAMENTO";

        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(100, 100, 100);
        doc.text(sectionLabel, margin, yPos);
        doc.setTextColor(0, 0, 0);
        yPos += 5;

        // Draw custom table for this section
        yPos = drawCustomTable(doc, section.exercises, yPos, margin, tools);
      }

      yPos += 5;
    }
  }

  // ============================================
  // CONTRAINDICATIONS
  // ============================================
  if (plan.contraindications) {
    if (yPos > pageHeight - 30) {
      doc.addPage();
      yPos = 15;
    }

    doc.setFillColor(255, 243, 205);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 5, 2, 2, "F");

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(180, 83, 9);
    doc.text("⚠ AVVERTENZE", margin + 3, yPos + 3.5);
    doc.setTextColor(0, 0, 0);
    yPos += 7;

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(
      plan.contraindications,
      pageWidth - 2 * margin
    );
    doc.text(lines, margin, yPos);
    yPos += lines.length * 3.5;
  }

  // ============================================
  // INSTRUCTIONS BOX
  // ============================================
  if (yPos > pageHeight - 30) {
    doc.addPage();
    yPos = 15;
  }

  doc.setFillColor(240, 253, 244);
  doc.roundedRect(margin, yPos, pageWidth - 2 * margin - 30, 20, 2, 2, "F");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(22, 101, 52);
  doc.text("📝 Come usare questa scheda:", margin + 3, yPos + 5);
  doc.setTextColor(0, 0, 0);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text(
    "• Compila le colonne gialle 'Carico Usato', 'Reps Eseguite' e 'Note' dopo ogni allenamento",
    margin + 3,
    yPos + 9
  );
  doc.text(
    "• RPE = Rate of Perceived Exertion (1-10, dove 10 è massimo sforzo)",
    margin + 3,
    yPos + 13
  );
  doc.text(
    "• Segui la progressione settimanale indicata per ogni esercizio",
    margin + 3,
    yPos + 17
  );

  // Legend for grouping
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("Legenda:", margin + 130, yPos + 5);
  doc.setFont("helvetica", "normal");

  let legendY = yPos + 9;
  const legendItems = [
    { label: "Superset", color: groupingColors.superset },
    { label: "Triset", color: groupingColors.triset },
    { label: "Circuit", color: groupingColors.circuit },
    { label: "Dropset", color: groupingColors.dropset },
  ];

  legendItems.forEach((item) => {
    doc.setFillColor(item.color[0], item.color[1], item.color[2]);
    doc.rect(margin + 130, legendY - 2, 3, 3, "F");
    doc.text(item.label, margin + 135, legendY);
    legendY += 4;
  });

  // QR Code for app access
  if (process.env.NEXT_PUBLIC_APP_URL) {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(
        `${process.env.NEXT_PUBLIC_APP_URL}/cliente/schede/${plan.id}`,
        { width: 60, margin: 1 }
      );

      doc.addImage(
        qrCodeDataUrl,
        "PNG",
        pageWidth - margin - 25,
        yPos + 2,
        18,
        18
      );

      doc.setFontSize(6);
      doc.text("Scansiona per", pageWidth - margin - 23, yPos + 21);
      doc.text("accedere online", pageWidth - margin - 24, yPos + 24);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  }

  // ============================================
  // FOOTER ON ALL PAGES
  // ============================================
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Pagina ${i} di ${pageCount} - © ${new Date().getFullYear()} Costanza Spinelli PT`,
      pageWidth / 2,
      pageHeight - 5,
      { align: "center" }
    );
  }

  return doc;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function drawCustomTable(
  doc: jsPDF,
  exercises: ExerciseRow[],
  startY: number,
  margin: number,
  tools: Tool[]
): number {
  let yPos = startY;
  const rowHeight = 7;
  const headerHeight = 8;

  // Column widths
  const colWidths = {
    id: 10,
    exercise: 40,
    tools: 25,
    sets: 12,
    reps: 12,
    load: 15,
    rest: 12,
    rpe: 10,
    week: 12,
    note: 30,
  };

  const tableWidth = Object.values(colWidths).reduce((a, b) => a + b, 0);
  const xPos = margin;

  // Draw header row
  doc.setFillColor(0, 0, 0);
  doc.rect(xPos, yPos, tableWidth, headerHeight, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");

  let currentX = xPos;
  const headers = [
    "ID",
    "Esercizio",
    "Attrezzi",
    "Serie",
    "Reps",
    "Carico",
    "Riposo",
    "RPE",
    "Sett.",
    "Note",
  ];
  const widths = Object.values(colWidths);

  headers.forEach((header, i) => {
    doc.text(header, currentX + widths[i] / 2, yPos + 5.5, { align: "center" });
    currentX += widths[i];
  });

  yPos += headerHeight;
  doc.setTextColor(0, 0, 0);

  // Draw exercises
  let exerciseId = 1;

  for (const exercise of exercises) {
    // Get tool name from toolId
    const toolName = exercise.toolId
      ? tools.find((t) => t.id === exercise.toolId)?.name || "-"
      : "-";
    const hasProgression =
      exercise.weeklyProgression && exercise.weeklyProgression.length > 0;

    if (hasProgression) {
      // Draw progression header row (yellow)
      doc.setFillColor(255, 250, 205);
      doc.rect(xPos, yPos, tableWidth, rowHeight, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);

      currentX = xPos;
      doc.text(exerciseId.toString(), currentX + colWidths.id / 2, yPos + 5, {
        align: "center",
      });
      currentX += colWidths.id;

      doc.text(exercise.exerciseName, currentX + 2, yPos + 5);
      currentX += colWidths.exercise;

      const progressionText = `PROGRESSIONE (${
        exercise.weeklyProgression!.length
      } settimane) - Vedi dettagli sotto`;
      doc.setFontSize(6);
      doc.text(progressionText, currentX + 2, yPos + 5);

      yPos += rowHeight;

      // Draw week detail rows (gray)
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);

      for (const week of exercise.weeklyProgression!) {
        doc.setFillColor(245, 245, 245);
        doc.rect(xPos, yPos, tableWidth, rowHeight, "FD");

        currentX = xPos;

        // Empty ID cell
        currentX += colWidths.id;

        // Week label with indentation
        doc.text(`  └─ W${week.week}`, currentX + 2, yPos + 5);
        currentX += colWidths.exercise;

        // Tools
        doc.text(toolName, currentX + 2, yPos + 5);
        currentX += colWidths.tools;

        // Sets
        const sets = week.sets?.toString() || exercise.sets.toString();
        doc.text(sets, currentX + colWidths.sets / 2, yPos + 5, {
          align: "center",
        });
        currentX += colWidths.sets;

        // Reps
        const reps = week.reps?.toString() || exercise.reps?.toString() || "-";
        doc.text(reps, currentX + colWidths.reps / 2, yPos + 5, {
          align: "center",
        });
        currentX += colWidths.reps;

        // Load
        const load = week.loadKg
          ? `${week.loadKg}kg`
          : exercise.loadKg
          ? `${exercise.loadKg}kg`
          : "-";
        doc.text(load, currentX + colWidths.load / 2, yPos + 5, {
          align: "center",
        });
        currentX += colWidths.load;

        // Rest
        const rest = week.restSeconds
          ? `${week.restSeconds}s`
          : exercise.restSeconds
          ? `${exercise.restSeconds}s`
          : "-";
        doc.text(rest, currentX + colWidths.rest / 2, yPos + 5, {
          align: "center",
        });
        currentX += colWidths.rest;

        // RPE
        const rpe = week.rpe?.toString() || exercise.rpe?.toString() || "-";
        doc.text(rpe, currentX + colWidths.rpe / 2, yPos + 5, {
          align: "center",
        });
        currentX += colWidths.rpe;

        // Week
        doc.text(`W${week.week}`, currentX + colWidths.week / 2, yPos + 5, {
          align: "center",
        });
        currentX += colWidths.week;

        // Note
        const note = week.notes || "";
        doc.text(note, currentX + 2, yPos + 5);

        yPos += rowHeight;
      }
    } else {
      // Single row for exercise without progression
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.1);
      doc.rect(xPos, yPos, tableWidth, rowHeight, "D");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);

      currentX = xPos;

      // ID
      doc.text(exerciseId.toString(), currentX + colWidths.id / 2, yPos + 5, {
        align: "center",
      });
      currentX += colWidths.id;

      // Exercise name
      doc.text(exercise.exerciseName, currentX + 2, yPos + 5);
      currentX += colWidths.exercise;

      // Tools
      doc.text(toolName, currentX + 2, yPos + 5);
      currentX += colWidths.tools;

      // Sets
      doc.text(
        exercise.sets.toString(),
        currentX + colWidths.sets / 2,
        yPos + 5,
        { align: "center" }
      );
      currentX += colWidths.sets;

      // Reps
      const reps =
        exercise.reps?.toString() ||
        (exercise.timeSeconds ? `${exercise.timeSeconds}s` : "-");
      doc.text(reps, currentX + colWidths.reps / 2, yPos + 5, {
        align: "center",
      });
      currentX += colWidths.reps;

      // Load
      const load = exercise.loadKg ? `${exercise.loadKg}kg` : "-";
      doc.text(load, currentX + colWidths.load / 2, yPos + 5, {
        align: "center",
      });
      currentX += colWidths.load;

      // Rest
      const rest = exercise.restSeconds ? `${exercise.restSeconds}s` : "-";
      doc.text(rest, currentX + colWidths.rest / 2, yPos + 5, {
        align: "center",
      });
      currentX += colWidths.rest;

      // RPE
      const rpe = exercise.rpe?.toString() || "-";
      doc.text(rpe, currentX + colWidths.rpe / 2, yPos + 5, {
        align: "center",
      });
      currentX += colWidths.rpe;

      // Week
      doc.text("Tutte", currentX + colWidths.week / 2, yPos + 5, {
        align: "center",
      });
      currentX += colWidths.week;

      // Note
      const note = exercise.notes || "";
      doc.text(note, currentX + 2, yPos + 5);

      yPos += rowHeight;
    }

    exerciseId++;
  }

  // Draw final border
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.rect(xPos, startY, tableWidth, yPos - startY, "D");

  return yPos + 5;
}
