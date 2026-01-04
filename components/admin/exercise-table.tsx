"use client";

import { useState } from "react";
import { ExerciseRow, WeeklyProgression, Tool } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Copy, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { ExerciseGroupingEditor } from "./exercise-grouping-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExerciseTableProps {
  exercises: ExerciseRow[];
  tools: Tool[];
  disabled?: boolean;
  totalWeeks?: number;
  onUpdate: (id: string, updates: Partial<ExerciseRow>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onAddClick: () => void;
}

export function ExerciseTable({
  exercises,
  tools,
  disabled,
  totalWeeks = 4,
  onUpdate,
  onDelete,
  onDuplicate,
  onAddClick,
}: ExerciseTableProps) {
  // Auto-expand all exercises with progressions in view mode
  const initialExpanded = disabled
    ? new Set<string>(
        exercises
          .filter((e) => e.weeklyProgression && e.weeklyProgression.length > 0)
          .map((e) => e.id)
      )
    : new Set<string>();

  const [expandedExercises, setExpandedExercises] =
    useState<Set<string>>(initialExpanded);

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedExercises);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedExercises(newExpanded);
  };

  const handleProgressionToggle = (exerciseId: string, enabled: boolean) => {
    if (enabled) {
      const exercise = exercises.find((e) => e.id === exerciseId);
      // Create default progression for all weeks with all base values
      const defaultProgression: WeeklyProgression[] = Array.from(
        { length: totalWeeks },
        (_, i) => ({
          week: i + 1,
          sets: exercise?.sets || 3,
          reps: exercise?.reps || 10,
          loadKg: exercise?.loadKg,
          restSeconds: exercise?.restSeconds || 90,
          tempo: exercise?.tempo,
          rpe: exercise?.rpe,
        })
      );
      onUpdate(exerciseId, { weeklyProgression: defaultProgression });
      setExpandedExercises(new Set(expandedExercises).add(exerciseId));
    } else {
      onUpdate(exerciseId, { weeklyProgression: undefined });
      const newExpanded = new Set(expandedExercises);
      newExpanded.delete(exerciseId);
      setExpandedExercises(newExpanded);
    }
  };

  const handleProgressionUpdate = (
    exerciseId: string,
    weekIndex: number,
    field: keyof WeeklyProgression,
    value: number | string | undefined
  ) => {
    const exercise = exercises.find((e) => e.id === exerciseId);
    if (!exercise?.weeklyProgression) return;

    const updated = [...exercise.weeklyProgression];
    updated[weekIndex] = {
      ...updated[weekIndex],
      [field]: value === "" ? undefined : value,
    };

    onUpdate(exerciseId, { weeklyProgression: updated });
  };

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
          <div className="space-y-3">
            {exercises.map((exercise) => {
              const hasProgression =
                exercise.weeklyProgression &&
                exercise.weeklyProgression.length > 0;
              const isExpanded = expandedExercises.has(exercise.id);

              return (
                <div
                  key={exercise.id}
                  className="border rounded-lg p-4 space-y-3 bg-card"
                >
                  {/* Exercise Header */}
                  <div className="flex items-start gap-3">
                    {/* Grouping Badge */}
                    <div className="w-12 flex-shrink-0">
                      {exercise.grouping &&
                      exercise.grouping.type !== "single" ? (
                        <Badge variant="outline" className="font-mono">
                          {exercise.grouping.groupId}
                          {exercise.grouping.order}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </div>

                    {/* Exercise Name */}
                    <div className="flex-1">
                      <div className="font-semibold text-base">
                        {exercise.exerciseName}
                      </div>
                    </div>

                    {/* Actions */}
                    {!disabled && (
                      <div className="flex gap-2">
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
                    )}
                  </div>

                  {/* Base Parameters - Show when NO progression OR in view mode */}
                  {(!hasProgression || disabled) && (
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground">
                          Attrezzo
                        </label>
                        <Select
                          value={exercise.toolId || "none"}
                          onValueChange={(value) =>
                            onUpdate(exercise.id, {
                              toolId: value === "none" ? undefined : value,
                            })
                          }
                          disabled={disabled}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Seleziona..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Nessuno</SelectItem>
                            {tools.map((tool) => (
                              <SelectItem key={tool.id} value={tool.id}>
                                {tool.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">
                          Serie
                        </label>
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
                          className="h-9"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">
                          Reps
                        </label>
                        <Input
                          type="number"
                          min="1"
                          value={exercise.reps || ""}
                          onChange={(e) =>
                            onUpdate(exercise.id, {
                              reps: parseInt(e.target.value) || undefined,
                            })
                          }
                          disabled={disabled}
                          className="h-9"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">
                          Carico (kg)
                        </label>
                        <Input
                          type="number"
                          min="0"
                          step="0.5"
                          value={exercise.loadKg || ""}
                          onChange={(e) =>
                            onUpdate(exercise.id, {
                              loadKg: parseFloat(e.target.value) || undefined,
                            })
                          }
                          disabled={disabled}
                          className="h-9"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">
                          Riposo (s)
                        </label>
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
                          className="h-9"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">
                          RPE
                        </label>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          value={exercise.rpe || ""}
                          onChange={(e) =>
                            onUpdate(exercise.id, {
                              rpe: parseInt(e.target.value) || undefined,
                            })
                          }
                          disabled={disabled}
                          className="h-9"
                        />
                      </div>
                    </div>
                  )}

                  {/* Note */}
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Note
                    </label>
                    <Input
                      value={exercise.notes || ""}
                      onChange={(e) =>
                        onUpdate(exercise.id, { notes: e.target.value })
                      }
                      disabled={disabled}
                      placeholder="Note per l'esercizio..."
                      className="h-9"
                    />
                  </div>

                  {/* Progression Toggle and Info */}
                  {!disabled && (
                    <div className="flex items-center gap-3 pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`progression-${exercise.id}`}
                          checked={hasProgression}
                          onCheckedChange={(checked) =>
                            handleProgressionToggle(
                              exercise.id,
                              checked as boolean
                            )
                          }
                        />
                        <label
                          htmlFor={`progression-${exercise.id}`}
                          className="text-sm font-medium cursor-pointer"
                        >
                          Progressione Settimanale
                        </label>
                        {hasProgression && (
                          <Badge variant="secondary" className="text-xs">
                            {exercise.weeklyProgression!.length} settimane
                          </Badge>
                        )}
                      </div>

                      {hasProgression && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpanded(exercise.id)}
                          className="ml-auto"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronDown className="h-4 w-4 mr-1" />
                              Nascondi
                            </>
                          ) : (
                            <>
                              <ChevronRight className="h-4 w-4 mr-1" />
                              Mostra
                            </>
                          )}
                        </Button>
                      )}

                      <ExerciseGroupingEditor
                        grouping={exercise.grouping}
                        onChange={(grouping) =>
                          onUpdate(exercise.id, { grouping })
                        }
                      />
                    </div>
                  )}

                  {/* View mode - show progression info */}
                  {disabled && hasProgression && (
                    <div className="flex items-center gap-3 pt-2 border-t">
                      <Badge variant="secondary" className="text-xs">
                        📅 Progressione: {exercise.weeklyProgression!.length}{" "}
                        settimane
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(exercise.id)}
                      >
                        {isExpanded ? (
                          <>
                            <ChevronDown className="h-4 w-4 mr-1" />
                            Nascondi
                          </>
                        ) : (
                          <>
                            <ChevronRight className="h-4 w-4 mr-1" />
                            Mostra
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Progression Rows */}
                  {hasProgression && isExpanded && (
                    <div className="space-y-2 pt-3 border-t bg-muted/30 -mx-4 -mb-3 px-4 pb-3 rounded-b-lg">
                      <div className="text-sm font-medium text-muted-foreground mb-3">
                        📅 PROGRESSIONE SETTIMANALE:
                      </div>

                      {/* Column Headers */}
                      <div className="grid grid-cols-9 gap-2 items-center px-2 pb-2">
                        <div className="text-xs font-semibold text-muted-foreground">
                          Sett.
                        </div>
                        <div className="text-xs font-semibold text-muted-foreground">
                          Serie
                        </div>
                        <div className="text-xs font-semibold text-muted-foreground">
                          Reps
                        </div>
                        <div className="text-xs font-semibold text-muted-foreground">
                          Carico (kg)
                        </div>
                        <div className="text-xs font-semibold text-muted-foreground">
                          Riposo (s)
                        </div>
                        <div className="text-xs font-semibold text-muted-foreground">
                          TUT
                        </div>
                        <div className="text-xs font-semibold text-muted-foreground">
                          RPE
                        </div>
                        <div className="text-xs font-semibold text-muted-foreground col-span-2">
                          Note
                        </div>
                      </div>

                      {exercise.weeklyProgression!.map((week, index) => (
                        <div
                          key={week.week}
                          className="grid grid-cols-9 gap-2 items-center bg-background p-2 rounded border"
                        >
                          <div className="font-medium text-sm">
                            <Badge variant="outline">W{week.week}</Badge>
                          </div>
                          <div>
                            <Input
                              type="number"
                              min="1"
                              value={week.sets || ""}
                              onChange={(e) =>
                                handleProgressionUpdate(
                                  exercise.id,
                                  index,
                                  "sets",
                                  parseInt(e.target.value)
                                )
                              }
                              placeholder="3"
                              className="h-8 text-sm"
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              min="1"
                              value={week.reps || ""}
                              onChange={(e) =>
                                handleProgressionUpdate(
                                  exercise.id,
                                  index,
                                  "reps",
                                  parseInt(e.target.value)
                                )
                              }
                              placeholder="10"
                              className="h-8 text-sm"
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              min="0"
                              step="0.5"
                              value={week.loadKg || ""}
                              onChange={(e) =>
                                handleProgressionUpdate(
                                  exercise.id,
                                  index,
                                  "loadKg",
                                  parseFloat(e.target.value)
                                )
                              }
                              placeholder="60"
                              className="h-8 text-sm"
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              min="0"
                              value={week.restSeconds || ""}
                              onChange={(e) =>
                                handleProgressionUpdate(
                                  exercise.id,
                                  index,
                                  "restSeconds",
                                  parseInt(e.target.value)
                                )
                              }
                              placeholder="90"
                              className="h-8 text-sm"
                            />
                          </div>
                          <div>
                            <Input
                              value={week.tempo || ""}
                              onChange={(e) =>
                                handleProgressionUpdate(
                                  exercise.id,
                                  index,
                                  "tempo",
                                  e.target.value
                                )
                              }
                              placeholder="3010"
                              className="h-8 text-sm"
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              min="1"
                              max="10"
                              value={week.rpe || ""}
                              onChange={(e) =>
                                handleProgressionUpdate(
                                  exercise.id,
                                  index,
                                  "rpe",
                                  parseInt(e.target.value)
                                )
                              }
                              placeholder="7"
                              className="h-8 text-sm"
                            />
                          </div>
                          <div className="col-span-2">
                            <Input
                              value={week.notes || ""}
                              onChange={(e) =>
                                handleProgressionUpdate(
                                  exercise.id,
                                  index,
                                  "notes",
                                  e.target.value
                                )
                              }
                              placeholder="Note..."
                              className="h-8 text-sm"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!disabled && (
            <Button onClick={onAddClick} variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Aggiungi Esercizio
            </Button>
          )}
        </>
      )}
    </div>
  );
}
