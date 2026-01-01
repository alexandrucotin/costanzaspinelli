import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { WorkoutPlan } from "./types";
import { Client } from "./types-client";

export function generateWorkoutPlanPDF(plan: WorkoutPlan, client: Client) {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Costanza Spinelli PT", 105, 15, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Personal Trainer Certificata", 105, 21, { align: "center" });

  // Plan Title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(plan.title, 105, 35, { align: "center" });

  // Client Info
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Cliente: ${client.fullName}`, 20, 45);

  // Plan Details
  let yPos = 55;
  doc.setFontSize(10);
  doc.text(`Obiettivo: ${plan.goal}`, 20, yPos);
  yPos += 6;
  doc.text(`Durata: ${plan.durationWeeks} settimane`, 20, yPos);
  yPos += 6;
  doc.text(`Frequenza: ${plan.frequencyDaysPerWeek}x/settimana`, 20, yPos);
  yPos += 6;

  if (plan.notes) {
    doc.text(`Note: ${plan.notes}`, 20, yPos);
    yPos += 6;
  }

  yPos += 5;

  // Sessions
  if (plan.sessions && plan.sessions.length > 0) {
    plan.sessions.forEach((session, sessionIndex) => {
      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      // Session Title
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`${session.name || `Sessione ${sessionIndex + 1}`}`, 20, yPos);
      yPos += 8;

      // Collect all exercises from sections
      const allExercises = session.sections.flatMap((section) =>
        section.exercises.map((ex) => ({
          name: ex.exerciseName,
          sets: ex.sets?.toString() || "-",
          reps:
            ex.reps?.toString() ||
            (ex.timeSeconds ? `${ex.timeSeconds}s` : "-"),
          rest: ex.restSeconds ? `${ex.restSeconds}s` : "-",
          notes: ex.notes || "-",
        }))
      );

      // Exercise Table
      autoTable(doc, {
        startY: yPos,
        head: [["Esercizio", "Serie", "Rip/Tempo", "Recupero", "Note"]],
        body: allExercises.map((ex) => [
          ex.name,
          ex.sets,
          ex.reps,
          ex.rest,
          ex.notes,
        ]),
        theme: "striped",
        headStyles: { fillColor: [0, 0, 0], fontSize: 9 },
        bodyStyles: { fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 20 },
          2: { cellWidth: 25 },
          3: { cellWidth: 25 },
          4: { cellWidth: 50 },
        },
        margin: { left: 20, right: 20 },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      yPos = (doc as any).lastAutoTable.finalY + 10;
    });
  }

  // Contraindications
  if (plan.contraindications) {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("AVVERTENZE", 20, yPos);
    yPos += 6;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(plan.contraindications, 170);
    doc.text(lines, 20, yPos);
  }

  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text(
      `Pagina ${i} di ${pageCount} - © ${new Date().getFullYear()} Costanza Spinelli PT`,
      105,
      290,
      { align: "center" }
    );
  }

  return doc;
}
