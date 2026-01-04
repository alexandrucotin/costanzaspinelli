import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { WorkoutPlan, ExerciseRow } from "./types";
import { Client } from "./types-client";
import QRCode from "qrcode";

const groupingTypeLabels = {
  single: "",
  superset: "Superset",
  triset: "Triset",
  circuit: "Circuit",
  dropset: "Dropset",
};

export async function generateEnhancedWorkoutPlanPDF(
  plan: WorkoutPlan,
  client: Client
) {
  const doc = new jsPDF();
  let yPos = 20;

  // Header with branding
  doc.setFillColor(0, 0, 0);
  doc.rect(0, 0, 210, 30, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("COSTANZA SPINELLI PT", 105, 15, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Personal Trainer Certificata", 105, 22, { align: "center" });

  // Reset text color
  doc.setTextColor(0, 0, 0);
  yPos = 40;

  // Plan Title
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(plan.title, 105, yPos, { align: "center" });
  yPos += 10;

  // Client Info Box
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(20, yPos, 170, 20, 3, 3, "F");

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(`Cliente: ${client.fullName}`, 25, yPos + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Obiettivo: ${plan.goal}`, 25, yPos + 13);
  doc.text(`Durata: ${plan.durationWeeks} settimane`, 80, yPos + 13);
  doc.text(`Frequenza: ${plan.frequencyDaysPerWeek}x/sett`, 135, yPos + 13);

  yPos += 28;

  // Notes if present
  if (plan.notes) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Note:", 20, yPos);
    yPos += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const noteLines = doc.splitTextToSize(plan.notes, 170);
    doc.text(noteLines, 20, yPos);
    yPos += noteLines.length * 4 + 5;
  }

  // Sessions
  if (plan.sessions && plan.sessions.length > 0) {
    for (const session of plan.sessions) {
      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      // Session Title with colored bar
      doc.setFillColor(59, 130, 246); // Blue
      doc.rect(20, yPos, 4, 8, "F");

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(session.name, 27, yPos + 6);
      yPos += 12;

      // Process exercises by section
      for (const section of session.sections) {
        if (section.exercises.length === 0) continue;

        // Section header
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        const sectionLabel =
          section.type === "warmup"
            ? "RISCALDAMENTO"
            : section.type === "main"
            ? "ALLENAMENTO PRINCIPALE"
            : "DEFATICAMENTO";

        doc.setTextColor(100, 100, 100);
        doc.text(sectionLabel, 20, yPos);
        doc.setTextColor(0, 0, 0);
        yPos += 6;

        // Group exercises by grouping
        const groupedExercises = groupExercisesByGrouping(section.exercises);

        for (const group of groupedExercises) {
          // Check page space
          if (yPos > 240) {
            doc.addPage();
            yPos = 20;
          }

          // Group header if not single
          if (group.type !== "single") {
            doc.setFontSize(9);
            doc.setFont("helvetica", "italic");
            doc.setTextColor(59, 130, 246);
            doc.text(
              `${
                groupingTypeLabels[
                  group.type as keyof typeof groupingTypeLabels
                ]
              } ${group.groupId}`,
              20,
              yPos
            );
            doc.setTextColor(0, 0, 0);
            yPos += 5;
          }

          // Create table for exercises in this group
          const tableData = group.exercises.flatMap((ex) =>
            createExerciseRows(ex, plan.durationWeeks || 4)
          );

          autoTable(doc, {
            startY: yPos,
            head: [
              [
                "Ex",
                "Esercizio",
                "Serie",
                "Reps",
                "Carico",
                "Riposo",
                "RPE",
                "Settimana",
                "Carico Usato",
                "Note",
              ],
            ],
            body: tableData,
            theme: "grid",
            headStyles: {
              fillColor: [0, 0, 0],
              fontSize: 8,
              fontStyle: "bold",
            },
            bodyStyles: {
              fontSize: 7,
              cellPadding: 2,
            },
            columnStyles: {
              0: { cellWidth: 10, halign: "center" }, // Group ID
              1: { cellWidth: 35 }, // Exercise name
              2: { cellWidth: 12, halign: "center" }, // Sets
              3: { cellWidth: 12, halign: "center" }, // Reps
              4: { cellWidth: 15, halign: "center" }, // Load
              5: { cellWidth: 12, halign: "center" }, // Rest
              6: { cellWidth: 12, halign: "center" }, // RPE
              7: { cellWidth: 15, halign: "center" }, // Week
              8: { cellWidth: 25 }, // Load used (tracking)
              9: { cellWidth: 30 }, // Notes (tracking)
            },
            margin: { left: 20, right: 20 },
            didDrawCell: (data) => {
              // Highlight tracking columns
              if (data.column.index >= 8 && data.section === "body") {
                doc.setFillColor(255, 255, 200);
              }
            },
          });

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          yPos = (doc as any).lastAutoTable.finalY + 8;
        }

        yPos += 5;
      }
    }
  }

  // Contraindications
  if (plan.contraindications) {
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFillColor(255, 243, 205);
    doc.roundedRect(20, yPos, 170, 5, 2, 2, "F");

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(180, 83, 9);
    doc.text("⚠ AVVERTENZE", 25, yPos + 3.5);
    doc.setTextColor(0, 0, 0);
    yPos += 8;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(plan.contraindications, 170);
    doc.text(lines, 20, yPos);
    yPos += lines.length * 4;
  }

  // Instructions box
  if (yPos > 240) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFillColor(240, 253, 244);
  doc.roundedRect(20, yPos, 170, 25, 2, 2, "F");

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(22, 101, 52);
  doc.text("📝 Come usare questa scheda:", 25, yPos + 5);
  doc.setTextColor(0, 0, 0);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(
    "• Compila le colonne 'Carico Usato' e 'Note' dopo ogni allenamento",
    25,
    yPos + 10
  );
  doc.text(
    "• RPE = Rate of Perceived Exertion (1-10, dove 10 è massimo sforzo)",
    25,
    yPos + 14
  );
  doc.text(
    "• Segui la progressione settimanale indicata per ogni esercizio",
    25,
    yPos + 18
  );
  doc.text(
    "• Per superset/circuit, esegui gli esercizi consecutivamente senza riposo",
    25,
    yPos + 22
  );

  // QR Code for app access (if we have a URL)
  if (process.env.NEXT_PUBLIC_APP_URL) {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(
        `${process.env.NEXT_PUBLIC_APP_URL}/cliente/schede/${plan.id}`,
        { width: 60, margin: 1 }
      );

      doc.addImage(qrCodeDataUrl, "PNG", 165, yPos + 2, 20, 20);

      doc.setFontSize(7);
      doc.text("Scansiona per", 167, yPos + 24);
      doc.text("accedere online", 166, yPos + 27);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  }

  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Pagina ${i} di ${pageCount} - © ${new Date().getFullYear()} Costanza Spinelli PT - Scheda generata il ${new Date().toLocaleDateString(
        "it-IT"
      )}`,
      105,
      290,
      { align: "center" }
    );
  }

  return doc;
}

// Helper function to group exercises by their grouping
function groupExercisesByGrouping(exercises: ExerciseRow[]) {
  const groups: {
    type: string;
    groupId: string;
    exercises: ExerciseRow[];
  }[] = [];

  const groupMap = new Map<string, ExerciseRow[]>();

  exercises.forEach((ex) => {
    if (ex.grouping && ex.grouping.type !== "single") {
      const key = `${ex.grouping.type}-${ex.grouping.groupId}`;
      if (!groupMap.has(key)) {
        groupMap.set(key, []);
      }
      groupMap.get(key)!.push(ex);
    } else {
      // Single exercise gets its own group
      groups.push({
        type: "single",
        groupId: "",
        exercises: [ex],
      });
    }
  });

  // Add grouped exercises
  groupMap.forEach((exs, key) => {
    const [type, groupId] = key.split("-");
    // Sort by order
    exs.sort((a, b) => (a.grouping?.order || 0) - (b.grouping?.order || 0));
    groups.push({
      type,
      groupId,
      exercises: exs,
    });
  });

  return groups;
}

// Helper function to create table rows for an exercise with weekly progression
function createExerciseRows(exercise: ExerciseRow, totalWeeks: number) {
  const rows: any[] = [];

  const hasProgression =
    exercise.weeklyProgression && exercise.weeklyProgression.length > 0;

  if (hasProgression) {
    // Create a row for each week in progression
    exercise.weeklyProgression!.forEach((week) => {
      const groupLabel = exercise.grouping
        ? `${exercise.grouping.groupId}${exercise.grouping.order}`
        : "";

      rows.push([
        groupLabel,
        exercise.exerciseName,
        week.sets?.toString() || exercise.sets.toString(),
        week.reps?.toString() || exercise.reps?.toString() || "-",
        week.loadKg?.toString() || exercise.loadKg?.toString() || "-",
        `${exercise.restSeconds}s`,
        week.rpe?.toString() || exercise.rpe?.toString() || "-",
        `Sett. ${week.week}`,
        "", // Tracking column
        week.notes || "", // Week notes
      ]);
    });
  } else {
    // Single row for all weeks
    const groupLabel = exercise.grouping
      ? `${exercise.grouping.groupId}${exercise.grouping.order}`
      : "";

    rows.push([
      groupLabel,
      exercise.exerciseName,
      exercise.sets.toString(),
      exercise.reps?.toString() || "-",
      exercise.loadKg?.toString() || "-",
      `${exercise.restSeconds}s`,
      exercise.rpe?.toString() || "-",
      `1-${totalWeeks}`,
      "", // Tracking column
      exercise.notes || "",
    ]);
  }

  return rows;
}
