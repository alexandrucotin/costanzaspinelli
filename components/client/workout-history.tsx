"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  TrendingUp,
  Star,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface WorkoutLogData {
  id: string;
  sessionName: string;
  date: Date;
  completed: boolean;
  durationMinutes?: number;
  rating?: number;
  notes?: string;
  exerciseLogs: {
    id: string;
    exerciseName: string;
    setsCompleted: number;
    repsCompleted: number[];
    loadUsed: number[];
    rpe?: number;
    notes?: string;
  }[];
}

interface WorkoutHistoryProps {
  logs: WorkoutLogData[];
}

export function WorkoutHistory({ logs }: WorkoutHistoryProps) {
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  if (logs.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Nessun workout registrato ancora</p>
          <p className="text-sm mt-2">
            Inizia ad allenarsi e registra i tuoi progressi!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => {
        const isExpanded = expandedLog === log.id;
        const avgLoad =
          log.exerciseLogs.reduce(
            (sum, ex) =>
              sum + ex.loadUsed.reduce((s, l) => s + l, 0) / ex.loadUsed.length,
            0
          ) / log.exerciseLogs.length;

        return (
          <Card key={log.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{log.sessionName}</CardTitle>
                    {log.completed && (
                      <Badge variant="default" className="text-xs">
                        Completato
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(log.date), "d MMM yyyy", { locale: it })}
                    </div>
                    {log.durationMinutes && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {log.durationMinutes} min
                      </div>
                    )}
                    {log.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        {log.rating}/5
                      </div>
                    )}
                    {avgLoad > 0 && (
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        {avgLoad.toFixed(1)} kg media
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                >
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>

            {isExpanded && (
              <CardContent className="space-y-4 border-t pt-4">
                {/* Exercise Details */}
                <div className="space-y-3">
                  {log.exerciseLogs.map((exercise) => (
                    <div
                      key={exercise.id}
                      className="bg-muted/50 rounded-lg p-3 space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium">{exercise.exerciseName}</h4>
                        {exercise.rpe && (
                          <Badge variant="outline" className="text-xs">
                            RPE {exercise.rpe}
                          </Badge>
                        )}
                      </div>

                      {/* Sets Table */}
                      <div className="grid grid-cols-[auto_1fr_1fr] gap-2 text-sm">
                        <div className="font-medium">Serie</div>
                        <div className="font-medium">Reps</div>
                        <div className="font-medium">Carico</div>

                        {exercise.repsCompleted.map((reps, idx) => (
                          <div key={idx} className="contents">
                            <div className="text-muted-foreground">
                              {idx + 1}
                            </div>
                            <div>{reps}</div>
                            <div>{exercise.loadUsed[idx]} kg</div>
                          </div>
                        ))}
                      </div>

                      {exercise.notes && (
                        <p className="text-sm text-muted-foreground italic">
                          💭 {exercise.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Workout Notes */}
                {log.notes && (
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-sm font-medium mb-1">Note Generali</p>
                    <p className="text-sm text-muted-foreground">{log.notes}</p>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
