"use client";

import { ExerciseRow } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Copy, Trash2 } from "lucide-react";
import { WeeklyProgressionEditor } from "./weekly-progression-editor";
import { ExerciseGroupingEditor } from "./exercise-grouping-editor";

interface ExerciseTableProps {
  exercises: ExerciseRow[];
  disabled?: boolean;
  totalWeeks?: number;
  onUpdate: (id: string, updates: Partial<ExerciseRow>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onAddClick: () => void;
}

export function ExerciseTable({
  exercises,
  disabled,
  totalWeeks = 4,
  onUpdate,
  onDelete,
  onDuplicate,
  onAddClick,
}: ExerciseTableProps) {
  return (
    <div className="space-y-4">
      {exercises.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p className="mb-4">Nessun esercizio in questa sezione</p>
          {!disabled && (
            <Button onClick={onAddClick} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Aggiungi Esercizio
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Gruppo</TableHead>
                  <TableHead className="w-[200px]">Esercizio</TableHead>
                  <TableHead className="w-[80px]">Serie</TableHead>
                  <TableHead className="w-[80px]">Reps</TableHead>
                  <TableHead className="w-[80px]">Carico (kg)</TableHead>
                  <TableHead className="w-[80px]">Riposo (s)</TableHead>
                  <TableHead className="w-[80px]">RPE</TableHead>
                  <TableHead className="w-[150px]">Note</TableHead>
                  {!disabled && (
                    <TableHead className="w-[200px]">Avanzate</TableHead>
                  )}
                  {!disabled && (
                    <TableHead className="w-[120px]">Azioni</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {exercises.map((exercise) => (
                  <TableRow key={exercise.id}>
                    <TableCell>
                      {exercise.grouping &&
                      exercise.grouping.type !== "single" ? (
                        <Badge variant="outline" className="font-mono">
                          {exercise.grouping.groupId}
                          {exercise.grouping.order}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {exercise.exerciseName}
                      {exercise.weeklyProgression &&
                        exercise.weeklyProgression.length > 0 && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {exercise.weeklyProgression.length}w
                          </Badge>
                        )}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        value={exercise.sets}
                        onChange={(e) =>
                          onUpdate(exercise.id, {
                            sets: parseInt(e.target.value) || 1,
                          })
                        }
                        disabled={disabled}
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        value={exercise.reps || ""}
                        onChange={(e) =>
                          onUpdate(exercise.id, {
                            reps: e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          })
                        }
                        disabled={disabled}
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        step="0.5"
                        value={exercise.loadKg || ""}
                        onChange={(e) =>
                          onUpdate(exercise.id, {
                            loadKg: e.target.value
                              ? parseFloat(e.target.value)
                              : undefined,
                          })
                        }
                        disabled={disabled}
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        value={exercise.restSeconds}
                        onChange={(e) =>
                          onUpdate(exercise.id, {
                            restSeconds: parseInt(e.target.value) || 0,
                          })
                        }
                        disabled={disabled}
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        value={exercise.rpe || ""}
                        onChange={(e) =>
                          onUpdate(exercise.id, {
                            rpe: e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          })
                        }
                        disabled={disabled}
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={exercise.notes || ""}
                        onChange={(e) =>
                          onUpdate(exercise.id, { notes: e.target.value })
                        }
                        disabled={disabled}
                        className="w-full"
                      />
                    </TableCell>
                    {!disabled && (
                      <TableCell>
                        <div className="flex flex-col gap-2">
                          <WeeklyProgressionEditor
                            progression={exercise.weeklyProgression}
                            totalWeeks={totalWeeks}
                            baseExercise={{
                              sets: exercise.sets,
                              reps: exercise.reps,
                              loadKg: exercise.loadKg,
                              rpe: exercise.rpe,
                            }}
                            onChange={(progression) =>
                              onUpdate(exercise.id, {
                                weeklyProgression: progression,
                              })
                            }
                          />
                          <ExerciseGroupingEditor
                            grouping={exercise.grouping}
                            onChange={(grouping) =>
                              onUpdate(exercise.id, { grouping })
                            }
                          />
                        </div>
                      </TableCell>
                    )}
                    {!disabled && (
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDuplicate(exercise.id)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(exercise.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {!disabled && (
            <Button onClick={onAddClick} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Aggiungi Esercizio
            </Button>
          )}
        </>
      )}
    </div>
  );
}
