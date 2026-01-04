"use client";

import { WorkoutPlan, goalLabels, equipmentLabels } from "@/lib/types";
import { Client } from "@/lib/types-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Target, Dumbbell, Download } from "lucide-react";
import Link from "next/link";
import { generateWorkoutPlanPDF } from "@/lib/pdf-generator-landscape";
import { toast } from "sonner";
import { ClientNavbar } from "./client-navbar";

interface ClientPlanViewProps {
  plan: WorkoutPlan;
  client: Client;
}

export function ClientPlanView({ plan, client }: ClientPlanViewProps) {
  const handleDownloadPDF = async () => {
    try {
      // Load tools from API route
      const response = await fetch("/api/tools");
      const tools = await response.json();
      const pdf = await generateWorkoutPlanPDF(plan, client, tools);
      pdf.save(
        `${plan.title.replace(/\s+/g, "_")}_${client.fullName.replace(
          /\s+/g,
          "_"
        )}.pdf`
      );
      toast.success("PDF scaricato con successo!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Errore durante la generazione del PDF");
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <ClientNavbar clientName={client.fullName} />

      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        {/* Back Button */}
        <Link href="/cliente/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Torna alla Dashboard
          </Button>
        </Link>

        {/* Plan Header */}
        <Card>
          <CardHeader>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <h1 className="text-3xl font-bold">{plan.title}</h1>
                <Button onClick={handleDownloadPDF} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Scarica PDF
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="outline">
                  <Target className="h-3 w-3 mr-1" />
                  {goalLabels[plan.goal]}
                </Badge>
                <Badge variant="outline">
                  <Calendar className="h-3 w-3 mr-1" />
                  {plan.durationWeeks} settimane
                </Badge>
                <Badge variant="outline">
                  <Dumbbell className="h-3 w-3 mr-1" />
                  {plan.frequencyDaysPerWeek}x/settimana
                </Badge>
                {plan.equipment && (
                  <Badge variant="outline">
                    {equipmentLabels[plan.equipment]}
                  </Badge>
                )}
              </div>
              {plan.notes && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">{plan.notes}</p>
                </div>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Sessions */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Sessioni di Allenamento</h2>

          {!plan.sessions || plan.sessions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <p>Nessuna sessione disponibile</p>
              </CardContent>
            </Card>
          ) : (
            plan.sessions.map((session, index) => {
              const allExercises = session.sections.flatMap(
                (section) => section.exercises
              );
              return (
                <Card key={session.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{session.name || `Sessione ${index + 1}`}</span>
                      <Badge variant="outline">
                        {allExercises.length} esercizi
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {allExercises.map((exercise, exIndex) => {
                        const hasProgression =
                          exercise.weeklyProgression &&
                          exercise.weeklyProgression.length > 0;
                        const groupingColor =
                          exercise.grouping?.type === "superset"
                            ? "bg-blue-50 border-blue-200"
                            : exercise.grouping?.type === "triset"
                            ? "bg-purple-50 border-purple-200"
                            : exercise.grouping?.type === "circuit"
                            ? "bg-green-50 border-green-200"
                            : exercise.grouping?.type === "dropset"
                            ? "bg-orange-50 border-orange-200"
                            : "bg-gray-50";

                        return (
                          <div
                            key={exercise.id}
                            className={`p-4 rounded-lg border ${groupingColor}`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  {exercise.grouping &&
                                    exercise.grouping.type !== "single" && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {exercise.grouping.type === "superset"
                                          ? "🔵 Superset"
                                          : exercise.grouping.type === "triset"
                                          ? "🟣 Triset"
                                          : exercise.grouping.type === "circuit"
                                          ? "🟢 Circuit"
                                          : exercise.grouping.type === "dropset"
                                          ? "🟠 Dropset"
                                          : ""}{" "}
                                        {exercise.grouping.groupId}
                                        {exercise.grouping.order}
                                      </Badge>
                                    )}
                                  <span className="font-mono text-sm text-muted-foreground">
                                    {exIndex + 1}.
                                  </span>
                                  <h4 className="font-semibold">
                                    {exercise.exerciseName}
                                  </h4>
                                  {hasProgression && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      📈 {exercise.weeklyProgression!.length}{" "}
                                      settimane
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Base Parameters */}
                            {!hasProgression && (
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mt-3">
                                {exercise.sets && (
                                  <div>
                                    <span className="text-muted-foreground">
                                      Serie:
                                    </span>
                                    <span className="font-medium ml-1">
                                      {exercise.sets}
                                    </span>
                                  </div>
                                )}
                                {exercise.reps && (
                                  <div>
                                    <span className="text-muted-foreground">
                                      Reps:
                                    </span>
                                    <span className="font-medium ml-1">
                                      {exercise.reps}
                                    </span>
                                  </div>
                                )}
                                {exercise.loadKg && (
                                  <div>
                                    <span className="text-muted-foreground">
                                      Carico:
                                    </span>
                                    <span className="font-medium ml-1">
                                      {exercise.loadKg} kg
                                    </span>
                                  </div>
                                )}
                                {exercise.restSeconds && (
                                  <div>
                                    <span className="text-muted-foreground">
                                      Recupero:
                                    </span>
                                    <span className="font-medium ml-1">
                                      {exercise.restSeconds}s
                                    </span>
                                  </div>
                                )}
                                {exercise.rpe && (
                                  <div>
                                    <span className="text-muted-foreground">
                                      RPE:
                                    </span>
                                    <span className="font-medium ml-1">
                                      {exercise.rpe}/10
                                    </span>
                                  </div>
                                )}
                                {exercise.tempo && (
                                  <div>
                                    <span className="text-muted-foreground">
                                      Tempo:
                                    </span>
                                    <span className="font-medium ml-1">
                                      {exercise.tempo}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Weekly Progression */}
                            {hasProgression && (
                              <div className="mt-3 space-y-2">
                                <div className="text-xs font-semibold text-muted-foreground mb-2">
                                  📅 PROGRESSIONE SETTIMANALE:
                                </div>
                                <div className="space-y-2">
                                  {exercise.weeklyProgression!.map((week) => (
                                    <div
                                      key={week.week}
                                      className="bg-white p-3 rounded border"
                                    >
                                      <div className="flex items-center gap-2 mb-2">
                                        <Badge
                                          variant="outline"
                                          className="text-xs font-bold"
                                        >
                                          Settimana {week.week}
                                        </Badge>
                                      </div>
                                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                                        <div>
                                          <span className="text-muted-foreground">
                                            Serie:
                                          </span>
                                          <span className="font-medium ml-1">
                                            {week.sets || exercise.sets}
                                          </span>
                                        </div>
                                        <div>
                                          <span className="text-muted-foreground">
                                            Reps:
                                          </span>
                                          <span className="font-medium ml-1">
                                            {week.reps || exercise.reps || "-"}
                                          </span>
                                        </div>
                                        {(week.loadKg || exercise.loadKg) && (
                                          <div>
                                            <span className="text-muted-foreground">
                                              Carico:
                                            </span>
                                            <span className="font-medium ml-1">
                                              {week.loadKg || exercise.loadKg}{" "}
                                              kg
                                            </span>
                                          </div>
                                        )}
                                        {exercise.restSeconds && (
                                          <div>
                                            <span className="text-muted-foreground">
                                              Recupero:
                                            </span>
                                            <span className="font-medium ml-1">
                                              {exercise.restSeconds}s
                                            </span>
                                          </div>
                                        )}
                                        {(week.rpe || exercise.rpe) && (
                                          <div>
                                            <span className="text-muted-foreground">
                                              RPE:
                                            </span>
                                            <span className="font-medium ml-1">
                                              {week.rpe || exercise.rpe}/10
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                      {week.notes && (
                                        <div className="mt-2 pt-2 border-t">
                                          <p className="text-xs text-muted-foreground italic">
                                            💡 {week.notes}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {exercise.notes && !hasProgression && (
                              <div className="mt-3 pt-3 border-t">
                                <p className="text-sm text-muted-foreground">
                                  💡 {exercise.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Contraindications */}
        {plan.contraindications && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-yellow-800">Avvertenze</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-yellow-700">
                {plan.contraindications}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
