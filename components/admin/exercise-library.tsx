"use client";

import { useState } from "react";
import { Exercise, MuscleGroup, Category } from "@/lib/types";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ExerciseForm } from "@/components/admin/exercise-form";
import { deleteExerciseAction } from "@/app/actions/exercises";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

interface ExerciseLibraryProps {
  initialExercises: Exercise[];
  muscleGroups: MuscleGroup[];
  categories: Category[];
}

export function ExerciseLibrary({
  initialExercises,
  muscleGroups,
  categories,
}: ExerciseLibraryProps) {
  const [exercises, setExercises] = useState(initialExercises);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const filteredExercises = exercises.filter((ex) => {
    const query = searchQuery.toLowerCase();
    const categoryNames = ex.categoryIds
      .map((id) => categories.find((c) => c.id === id)?.name || "")
      .join(" ");
    return (
      ex.name.toLowerCase().includes(query) ||
      ex.muscleGroupId.toLowerCase().includes(query) ||
      categoryNames.toLowerCase().includes(query)
    );
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo esercizio?")) return;

    try {
      await deleteExerciseAction(id);
      setExercises(exercises.filter((ex) => ex.id !== id));
      toast.success("Esercizio eliminato");
    } catch {
      toast.error("Errore nell'eliminazione");
    }
  };

  const handleExerciseCreated = (exercise: Exercise) => {
    setExercises([...exercises, exercise]);
    setIsCreateOpen(false);
    toast.success("Esercizio creato");
  };

  const handleExerciseUpdated = (exercise: Exercise) => {
    setExercises(
      exercises.map((ex) => (ex.id === exercise.id ? exercise : ex))
    );
    setIsEditOpen(false);
    setEditingExercise(null);
    toast.success("Esercizio aggiornato");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca esercizi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuovo Esercizio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nuovo Esercizio</DialogTitle>
            </DialogHeader>
            <ExerciseForm
              muscleGroups={muscleGroups}
              categories={categories}
              onSuccess={handleExerciseCreated}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Gruppo Muscolare</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Riposo (s)</TableHead>
              <TableHead>Tempo</TableHead>
              <TableHead className="text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExercises.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground py-8"
                >
                  Nessun esercizio trovato
                </TableCell>
              </TableRow>
            ) : (
              filteredExercises.map((exercise) => (
                <TableRow key={exercise.id}>
                  <TableCell className="font-medium">{exercise.name}</TableCell>
                  <TableCell>
                    {muscleGroups.find((g) => g.id === exercise.muscleGroupId)
                      ?.name || exercise.muscleGroupId}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {exercise.categoryIds.map((catId) => {
                        const category = categories.find((c) => c.id === catId);
                        return category ? (
                          <span
                            key={catId}
                            className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                          >
                            {category.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </TableCell>
                  <TableCell>{exercise.defaultRestSeconds || "-"}</TableCell>
                  <TableCell>{exercise.defaultTempo || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingExercise(exercise);
                          setIsEditOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(exercise.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifica Esercizio</DialogTitle>
          </DialogHeader>
          {editingExercise && (
            <ExerciseForm
              exercise={editingExercise}
              muscleGroups={muscleGroups}
              categories={categories}
              onSuccess={handleExerciseUpdated}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
