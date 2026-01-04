"use client";

import { useState } from "react";
import { WeeklyProgression } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface WeeklyProgressionEditorProps {
  progression?: WeeklyProgression[];
  totalWeeks: number;
  baseExercise: {
    sets: number;
    reps?: number;
    loadKg?: number;
    rpe?: number;
  };
  onChange: (progression: WeeklyProgression[]) => void;
}

export function WeeklyProgressionEditor({
  progression = [],
  totalWeeks,
  baseExercise,
  onChange,
}: WeeklyProgressionEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localProgression, setLocalProgression] = useState<WeeklyProgression[]>(
    progression.length > 0
      ? progression
      : [
          {
            week: 1,
            sets: baseExercise.sets,
            reps: baseExercise.reps,
            loadKg: baseExercise.loadKg,
            rpe: baseExercise.rpe,
          },
        ]
  );

  const handleAddWeek = () => {
    const lastWeek = localProgression[localProgression.length - 1];
    const nextWeek = (lastWeek?.week || 0) + 1;

    if (nextWeek <= totalWeeks) {
      setLocalProgression([
        ...localProgression,
        {
          week: nextWeek,
          sets: lastWeek?.sets || baseExercise.sets,
          reps: lastWeek?.reps || baseExercise.reps,
          loadKg: lastWeek?.loadKg || baseExercise.loadKg,
          rpe: lastWeek?.rpe || baseExercise.rpe,
        },
      ]);
    }
  };

  const handleRemoveWeek = (week: number) => {
    setLocalProgression(localProgression.filter((p) => p.week !== week));
  };

  const handleUpdateWeek = (
    week: number,
    field: keyof WeeklyProgression,
    value: number | string | undefined
  ) => {
    setLocalProgression(
      localProgression.map((p) =>
        p.week === week
          ? {
              ...p,
              [field]:
                typeof value === "string" && value === "" ? undefined : value,
            }
          : p
      )
    );
  };

  const handleSave = () => {
    onChange(localProgression);
    setIsOpen(false);
  };

  const hasProgression = progression.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={hasProgression ? "default" : "outline"}
          size="sm"
          className="gap-2"
        >
          <TrendingUp className="h-4 w-4" />
          {hasProgression ? "Modifica Progressione" : "Aggiungi Progressione"}
          {hasProgression && (
            <Badge variant="secondary" className="ml-1">
              {progression.length} settimane
            </Badge>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Progressione Settimanale</DialogTitle>
          <DialogDescription>
            Definisci come l&apos;esercizio progredisce settimana per settimana.
            Lascia vuoto per mantenere il valore base.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {localProgression.map((week) => (
            <Card key={week.week}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-semibold">Settimana {week.week}</h4>
                  {localProgression.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveWeek(week.week)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`sets-${week.week}`}>Serie</Label>
                    <Input
                      id={`sets-${week.week}`}
                      type="number"
                      min="1"
                      value={week.sets || ""}
                      onChange={(e) =>
                        handleUpdateWeek(
                          week.week,
                          "sets",
                          parseInt(e.target.value) || undefined
                        )
                      }
                      placeholder={baseExercise.sets.toString()}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`reps-${week.week}`}>Reps</Label>
                    <Input
                      id={`reps-${week.week}`}
                      type="number"
                      min="1"
                      value={week.reps || ""}
                      onChange={(e) =>
                        handleUpdateWeek(
                          week.week,
                          "reps",
                          parseInt(e.target.value) || undefined
                        )
                      }
                      placeholder={baseExercise.reps?.toString() || "-"}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`load-${week.week}`}>Carico (kg)</Label>
                    <Input
                      id={`load-${week.week}`}
                      type="number"
                      min="0"
                      step="0.5"
                      value={week.loadKg || ""}
                      onChange={(e) =>
                        handleUpdateWeek(
                          week.week,
                          "loadKg",
                          parseFloat(e.target.value) || undefined
                        )
                      }
                      placeholder={baseExercise.loadKg?.toString() || "-"}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`rpe-${week.week}`}>RPE</Label>
                    <Input
                      id={`rpe-${week.week}`}
                      type="number"
                      min="1"
                      max="10"
                      value={week.rpe || ""}
                      onChange={(e) =>
                        handleUpdateWeek(
                          week.week,
                          "rpe",
                          parseInt(e.target.value) || undefined
                        )
                      }
                      placeholder={baseExercise.rpe?.toString() || "-"}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`notes-${week.week}`}>Note</Label>
                    <Input
                      id={`notes-${week.week}`}
                      value={week.notes || ""}
                      onChange={(e) =>
                        handleUpdateWeek(week.week, "notes", e.target.value)
                      }
                      placeholder="Opzionale"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {localProgression.length < totalWeeks && (
            <Button
              variant="outline"
              className="w-full"
              onClick={handleAddWeek}
            >
              <Plus className="h-4 w-4 mr-2" />
              Aggiungi Settimana {localProgression.length + 1}
            </Button>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Annulla
            </Button>
            <Button onClick={handleSave}>Salva Progressione</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
