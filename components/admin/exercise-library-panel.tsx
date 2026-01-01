"use client";

import { useState } from "react";
import { Exercise, environmentLabels } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, X } from "lucide-react";

interface ExerciseLibraryPanelProps {
  exercises: Exercise[];
  onSelect: (exercise: Exercise) => void;
  show: boolean;
  onClose: () => void;
}

export function ExerciseLibraryPanel({
  exercises,
  onSelect,
  show,
  onClose,
}: ExerciseLibraryPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(
    null
  );

  // Note: This will show IDs until we populate metadata and update to show names
  const muscleGroups = Array.from(
    new Set(exercises.map((ex) => ex.muscleGroupId))
  );

  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch =
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.muscleGroupId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.categoryId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMuscleGroup =
      !selectedMuscleGroup || ex.muscleGroupId === selectedMuscleGroup;

    return matchesSearch && matchesMuscleGroup;
  });

  if (!show) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Libreria Esercizi</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedMuscleGroup === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedMuscleGroup(null)}
          >
            Tutti
          </Button>
          {muscleGroups.map((group) => (
            <Button
              key={group}
              variant={selectedMuscleGroup === group ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMuscleGroup(group)}
            >
              {group}
            </Button>
          ))}
        </div>

        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {filteredExercises.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Nessun esercizio trovato
            </p>
          ) : (
            filteredExercises.map((exercise) => (
              <Button
                key={exercise.id}
                variant="outline"
                className="w-full justify-start text-left h-auto py-3"
                onClick={() => onSelect(exercise)}
              >
                <div className="flex-1">
                  <div className="font-medium">{exercise.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {exercise.muscleGroupId} • {exercise.categoryId} •{" "}
                    {environmentLabels[exercise.environment]}
                  </div>
                </div>
              </Button>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
