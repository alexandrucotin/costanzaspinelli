"use client";

import { useState } from "react";
import { Session, ExerciseRow } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { createWorkoutLog } from "@/app/actions/workout-logs";
import { toast } from "sonner";
import { CheckCircle2, Circle, Star, Clock, Save } from "lucide-react";

interface WorkoutLoggerProps {
  session: Session;
  planId: string;
  clientId: string;
  onComplete?: () => void;
}

interface ExerciseLogState {
  exerciseId: string;
  exerciseName: string;
  completed: boolean;
  sets: {
    reps: number;
    load: number;
  }[];
  rpe?: number;
  notes: string;
}

export function WorkoutLogger({
  session,
  planId,
  clientId,
  onComplete,
}: WorkoutLoggerProps) {
  const [startTime] = useState(Date.now());
  const [rating, setRating] = useState<number>(0);
  const [workoutNotes, setWorkoutNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Initialize exercise log state
  const allExercises = session.sections.flatMap((section) =>
    section.exercises.map((ex) => ({
      ...ex,
      sectionType: section.type,
    }))
  );

  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLogState[]>(
    allExercises.map((ex) => ({
      exerciseId: ex.id,
      exerciseName: ex.exerciseName,
      completed: false,
      sets: Array.from({ length: ex.sets }, () => ({
        reps: ex.reps || 0,
        load: ex.loadKg || 0,
      })),
      rpe: ex.rpe,
      notes: "",
    }))
  );

  const handleToggleExercise = (exerciseId: string) => {
    setExerciseLogs((prev) =>
      prev.map((log) =>
        log.exerciseId === exerciseId
          ? { ...log, completed: !log.completed }
          : log
      )
    );
  };

  const handleUpdateSet = (
    exerciseId: string,
    setIndex: number,
    field: "reps" | "load",
    value: number
  ) => {
    setExerciseLogs((prev) =>
      prev.map((log) =>
        log.exerciseId === exerciseId
          ? {
              ...log,
              sets: log.sets.map((set, idx) =>
                idx === setIndex ? { ...set, [field]: value } : set
              ),
            }
          : log
      )
    );
  };

  const handleUpdateRPE = (exerciseId: string, rpe: number) => {
    setExerciseLogs((prev) =>
      prev.map((log) => (log.exerciseId === exerciseId ? { ...log, rpe } : log))
    );
  };

  const handleUpdateNotes = (exerciseId: string, notes: string) => {
    setExerciseLogs((prev) =>
      prev.map((log) =>
        log.exerciseId === exerciseId ? { ...log, notes } : log
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const durationMinutes = Math.round((Date.now() - startTime) / 60000);
      const completedCount = exerciseLogs.filter((log) => log.completed).length;
      const allCompleted = completedCount === exerciseLogs.length;

      await createWorkoutLog({
        clientId,
        planId,
        sessionId: session.id,
        sessionName: session.name,
        completed: allCompleted,
        durationMinutes,
        notes: workoutNotes,
        rating: rating || undefined,
        exercises: exerciseLogs.map((log) => ({
          exerciseId: log.exerciseId,
          exerciseName: log.exerciseName,
          setsCompleted: log.sets.length,
          repsCompleted: log.sets.map((s) => s.reps),
          loadUsed: log.sets.map((s) => s.load),
          rpe: log.rpe,
          notes: log.notes,
          completed: log.completed,
        })),
      });

      toast.success("Workout salvato con successo!");
      onComplete?.();
    } catch (error) {
      console.error("Error saving workout:", error);
      toast.error("Errore durante il salvataggio");
    } finally {
      setIsSaving(false);
    }
  };

  const completedCount = exerciseLogs.filter((log) => log.completed).length;
  const totalCount = exerciseLogs.length;
  const progress = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{session.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {completedCount} di {totalCount} esercizi completati
              </p>
            </div>
            <div className="text-right">
              <Badge variant={progress === 100 ? "default" : "secondary"}>
                {progress}%
              </Badge>
            </div>
          </div>
          <div className="w-full bg-secondary h-2 rounded-full mt-4">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardHeader>
      </Card>

      {/* Exercises by Section */}
      {session.sections.map((section) => {
        const sectionExercises = allExercises.filter(
          (ex) => ex.sectionType === section.type
        );

        if (sectionExercises.length === 0) return null;

        return (
          <div key={section.id} className="space-y-4">
            <h3 className="text-lg font-semibold capitalize">
              {section.type === "warmup"
                ? "Riscaldamento"
                : section.type === "main"
                ? "Principale"
                : "Defaticamento"}
            </h3>

            {sectionExercises.map((exercise) => {
              const log = exerciseLogs.find(
                (l) => l.exerciseId === exercise.id
              );
              if (!log) return null;

              return (
                <Card
                  key={exercise.id}
                  className={log.completed ? "border-primary" : ""}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <Checkbox
                          checked={log.completed}
                          onCheckedChange={() =>
                            handleToggleExercise(exercise.id)
                          }
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">
                            {exercise.exerciseName}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {exercise.sets} serie ×{" "}
                            {exercise.reps || exercise.timeSeconds + "s"}
                            {exercise.restSeconds &&
                              ` • ${exercise.restSeconds}s riposo`}
                          </p>
                          {exercise.notes && (
                            <p className="text-sm text-muted-foreground mt-1">
                              💡 {exercise.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      {log.completed && (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Sets Table */}
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold">Serie</Label>
                      <div className="grid gap-2">
                        {log.sets.map((set, idx) => (
                          <div
                            key={idx}
                            className="grid grid-cols-[auto_1fr_1fr] gap-2 items-center"
                          >
                            <span className="text-sm font-medium w-8">
                              {idx + 1}
                            </span>
                            <div>
                              <Input
                                type="number"
                                placeholder="Reps"
                                value={set.reps || ""}
                                onChange={(e) =>
                                  handleUpdateSet(
                                    exercise.id,
                                    idx,
                                    "reps",
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                className="h-9"
                              />
                            </div>
                            <div>
                              <Input
                                type="number"
                                placeholder="Kg"
                                step="0.5"
                                value={set.load || ""}
                                onChange={(e) =>
                                  handleUpdateSet(
                                    exercise.id,
                                    idx,
                                    "load",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="h-9"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* RPE */}
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold">
                        RPE (Difficoltà Percepita)
                      </Label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                          <Button
                            key={value}
                            variant={log.rpe === value ? "default" : "outline"}
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleUpdateRPE(exercise.id, value)}
                          >
                            {value}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Exercise Notes */}
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold">
                        Note Esercizio
                      </Label>
                      <Textarea
                        placeholder="Come è andata? Difficoltà, sensazioni..."
                        value={log.notes}
                        onChange={(e) =>
                          handleUpdateNotes(exercise.id, e.target.value)
                        }
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        );
      })}

      {/* Workout Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Riepilogo Workout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Rating */}
          <div className="space-y-2">
            <Label>Come è andata la sessione?</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <Button
                  key={value}
                  variant="outline"
                  size="lg"
                  onClick={() => setRating(value)}
                  className={rating >= value ? "text-yellow-500" : ""}
                >
                  <Star
                    className="h-5 w-5"
                    fill={rating >= value ? "currentColor" : "none"}
                  />
                </Button>
              ))}
            </div>
          </div>

          {/* Workout Notes */}
          <div className="space-y-2">
            <Label>Note Generali</Label>
            <Textarea
              placeholder="Come ti sei sentito? Energia, recupero, eventuali problemi..."
              value={workoutNotes}
              onChange={(e) => setWorkoutNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full"
            size="lg"
          >
            {isSaving ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Salvataggio...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salva Workout
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
