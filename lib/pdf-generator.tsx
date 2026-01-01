import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import {
  WorkoutPlan,
  goalLabels,
  equipmentLabels,
  sectionLabels,
} from "./types";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    borderBottom: "2 solid #000",
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
  },
  section: {
    marginBottom: 15,
  },
  metaRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  metaLabel: {
    fontWeight: "bold",
    width: 120,
  },
  metaValue: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 8,
    backgroundColor: "#e0e0e0",
    padding: 5,
  },
  sectionType: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    color: "#333",
  },
  table: {
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottom: "1 solid #000",
    paddingBottom: 3,
    marginBottom: 3,
    fontWeight: "bold",
    fontSize: 9,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "0.5 solid #ccc",
    paddingVertical: 3,
    fontSize: 9,
  },
  col1: { width: "30%" },
  col2: { width: "10%", textAlign: "center" },
  col3: { width: "10%", textAlign: "center" },
  col4: { width: "10%", textAlign: "center" },
  col5: { width: "10%", textAlign: "center" },
  col6: { width: "30%" },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#666",
  },
});

const PdfDocument = ({ plan }: { plan: WorkoutPlan }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>{plan.title}</Text>
        <Text style={styles.subtitle}>Scheda Allenamento Personalizzata</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Cliente:</Text>
          <Text style={styles.metaValue}>{plan.clientName}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Obiettivo:</Text>
          <Text style={styles.metaValue}>{goalLabels[plan.goal]}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Durata:</Text>
          <Text style={styles.metaValue}>{plan.durationWeeks} settimane</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Frequenza:</Text>
          <Text style={styles.metaValue}>
            {plan.frequencyDaysPerWeek} giorni/settimana
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Attrezzatura:</Text>
          <Text style={styles.metaValue}>
            {equipmentLabels[plan.equipment]}
          </Text>
        </View>
        {plan.startDate && (
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Data Inizio:</Text>
            <Text style={styles.metaValue}>
              {new Date(plan.startDate).toLocaleDateString("it-IT")}
            </Text>
          </View>
        )}
        {plan.notes && (
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Note:</Text>
            <Text style={styles.metaValue}>{plan.notes}</Text>
          </View>
        )}
        {plan.contraindications && (
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Controindicazioni:</Text>
            <Text style={styles.metaValue}>{plan.contraindications}</Text>
          </View>
        )}
      </View>

      {plan.sessions.map((session) => (
        <View key={session.id} style={styles.section} wrap={false}>
          <Text style={styles.sessionTitle}>{session.name}</Text>

          {session.sections.map((section) => {
            if (section.exercises.length === 0) return null;

            return (
              <View key={section.id} style={{ marginBottom: 10 }}>
                <Text style={styles.sectionType}>
                  {sectionLabels[section.type]}
                </Text>

                <View style={styles.table}>
                  <View style={styles.tableHeader}>
                    <Text style={styles.col1}>Esercizio</Text>
                    <Text style={styles.col2}>Serie</Text>
                    <Text style={styles.col3}>Reps/Tempo</Text>
                    <Text style={styles.col4}>Carico</Text>
                    <Text style={styles.col5}>Recupero</Text>
                    <Text style={styles.col6}>Note</Text>
                  </View>

                  {section.exercises.map((exercise) => (
                    <View key={exercise.id} style={styles.tableRow}>
                      <Text style={styles.col1}>{exercise.exerciseName}</Text>
                      <Text style={styles.col2}>{exercise.sets}</Text>
                      <Text style={styles.col3}>
                        {exercise.reps
                          ? `${exercise.reps} reps`
                          : exercise.timeSeconds
                          ? `${exercise.timeSeconds}s`
                          : "-"}
                      </Text>
                      <Text style={styles.col4}>
                        {exercise.loadKg ? `${exercise.loadKg}kg` : "-"}
                      </Text>
                      <Text style={styles.col5}>{exercise.restSeconds}s</Text>
                      <Text style={styles.col6}>
                        {[
                          exercise.rpe ? `RPE ${exercise.rpe}` : null,
                          exercise.rir !== undefined
                            ? `RIR ${exercise.rir}`
                            : null,
                          exercise.tempo ? `Tempo ${exercise.tempo}` : null,
                          exercise.notes || null,
                        ]
                          .filter(Boolean)
                          .join(" | ")}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
        </View>
      ))}

      <Text style={styles.footer}>
        Generato il {new Date().toLocaleDateString("it-IT")} - Costanza Spinelli
        Personal Trainer
      </Text>
    </Page>
  </Document>
);

export async function generatePdfBuffer(
  plan: WorkoutPlan
): Promise<Uint8Array> {
  const blob = await pdf(<PdfDocument plan={plan} />).toBlob();
  const buffer = await blob.arrayBuffer();
  return new Uint8Array(buffer);
}
