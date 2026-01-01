"use client";

import { WorkoutPlan, goalLabels, equipmentLabels } from "@/lib/types";
import { Client } from "@/lib/types-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Target, Dumbbell } from "lucide-react";
import Link from "next/link";

interface ClientPlanViewProps {
  plan: WorkoutPlan;
  client: Client;
}

export function ClientPlanView({ plan }: ClientPlanViewProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/cliente/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Torna alla Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        {/* Plan Header */}
        <Card>
          <CardHeader>
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold">{plan.title}</h1>
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
                      {allExercises.map((exercise, exIndex) => (
                        <div
                          key={exercise.id}
                          className="p-4 bg-gray-50 rounded-lg border"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm text-muted-foreground">
                                  {exIndex + 1}.
                                </span>
                                <h4 className="font-semibold">
                                  {exercise.exerciseName}
                                </h4>
                              </div>
                            </div>
                          </div>

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
                                  Ripetizioni:
                                </span>
                                <span className="font-medium ml-1">
                                  {exercise.reps}
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

                          {exercise.notes && (
                            <div className="mt-3 pt-3 border-t">
                              <p className="text-sm text-muted-foreground">
                                {exercise.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
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
