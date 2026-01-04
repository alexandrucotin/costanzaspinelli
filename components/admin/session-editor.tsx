"use client";

import { useState } from "react";
import {
  Session,
  Exercise,
  ExerciseRow,
  sectionLabels,
  Tool,
  MuscleGroup,
  Category,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { ExerciseTable } from "./exercise-table";
import { ExerciseLibraryPanel } from "./exercise-library-panel";

interface SessionEditorProps {
  session: Session;
  exercises: Exercise[];
  tools: Tool[];
  muscleGroups: MuscleGroup[];
  categories: Category[];
  disabled?: boolean;
  totalWeeks?: number;
  onUpdate: (session: Session) => void;
  onDelete: () => void;
}

export function SessionEditor({
  session,
  exercises,
  tools,
  muscleGroups,
  categories,
  disabled,
  totalWeeks = 4,
  onUpdate,
  onDelete,
}: SessionEditorProps) {
  const [showLibrary, setShowLibrary] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "warmup" | "main" | "cooldown"
  >("main");

  const handleNameChange = (name: string) => {
    onUpdate({ ...session, name });
  };

  const generateExerciseRowId = () =>
    `ex_row_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const handleAddExercise = (
    exercise: Exercise,
    sectionType: "warmup" | "main" | "cooldown"
  ) => {
    const newExerciseRow: ExerciseRow = {
      id: generateExerciseRowId(),
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      toolId: undefined, // Will be selected by user in the exercise table
      sets: 3,
      reps: 10,
      restSeconds: exercise.defaultRestSeconds || 90,
      tempo: exercise.defaultTempo || "",
      notes: "",
    };

    const updatedSections = session.sections.map((section) => {
      if (section.type === sectionType) {
        return {
          ...section,
          exercises: [...section.exercises, newExerciseRow],
        };
      }
      return section;
    });

    onUpdate({ ...session, sections: updatedSections });
    setShowLibrary(false);
  };

  const handleUpdateExerciseRow = (
    sectionType: "warmup" | "main" | "cooldown",
    exerciseId: string,
    updates: Partial<ExerciseRow>
  ) => {
    const updatedSections = session.sections.map((section) => {
      if (section.type === sectionType) {
        return {
          ...section,
          exercises: section.exercises.map((ex) =>
            ex.id === exerciseId ? { ...ex, ...updates } : ex
          ),
        };
      }
      return section;
    });

    onUpdate({ ...session, sections: updatedSections });
  };

  const handleDeleteExerciseRow = (
    sectionType: "warmup" | "main" | "cooldown",
    exerciseId: string
  ) => {
    const updatedSections = session.sections.map((section) => {
      if (section.type === sectionType) {
        return {
          ...section,
          exercises: section.exercises.filter((ex) => ex.id !== exerciseId),
        };
      }
      return section;
    });

    onUpdate({ ...session, sections: updatedSections });
  };

  const handleDuplicateExerciseRow = (
    sectionType: "warmup" | "main" | "cooldown",
    exerciseId: string
  ) => {
    const section = session.sections.find((s) => s.type === sectionType);
    const exercise = section?.exercises.find((ex) => ex.id === exerciseId);

    if (!exercise) return;

    const duplicated: ExerciseRow = {
      ...exercise,
      id: generateExerciseRowId(),
    };

    const updatedSections = session.sections.map((s) => {
      if (s.type === sectionType) {
        const index = s.exercises.findIndex((ex) => ex.id === exerciseId);
        const newExercises = [...s.exercises];
        newExercises.splice(index + 1, 0, duplicated);
        return { ...s, exercises: newExercises };
      }
      return s;
    });

    onUpdate({ ...session, sections: updatedSections });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Input
                value={session.name}
                onChange={(e) => handleNameChange(e.target.value)}
                disabled={disabled}
                className="text-lg font-semibold"
              />
            </div>
            {!disabled && (
              <Button variant="ghost" size="sm" onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          {session.sections.map((section) => (
            <Card key={section.id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {sectionLabels[section.type]}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ExerciseTable
                  exercises={section.exercises}
                  tools={tools}
                  disabled={disabled}
                  totalWeeks={totalWeeks}
                  onUpdate={(id, updates) =>
                    handleUpdateExerciseRow(section.type, id, updates)
                  }
                  onDelete={(id) => handleDeleteExerciseRow(section.type, id)}
                  onDuplicate={(id) =>
                    handleDuplicateExerciseRow(section.type, id)
                  }
                  onAddClick={() => {
                    setActiveSection(section.type);
                    setShowLibrary(true);
                  }}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        {!disabled && (
          <div className="lg:sticky lg:top-4 lg:h-fit">
            <ExerciseLibraryPanel
              exercises={exercises}
              muscleGroups={muscleGroups}
              categories={categories}
              onSelect={(exercise) =>
                handleAddExercise(exercise, activeSection)
              }
              show={showLibrary}
              onClose={() => setShowLibrary(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
