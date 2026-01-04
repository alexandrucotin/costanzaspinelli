"use client";

import { useState } from "react";
import { Exercise, MuscleGroup, Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, X, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExerciseLibraryPanelProps {
  exercises: Exercise[];
  muscleGroups: MuscleGroup[];
  categories: Category[];
  onSelect: (exercise: Exercise) => void;
  show: boolean;
  onClose: () => void;
}

export function ExerciseLibraryPanel({
  exercises,
  muscleGroups,
  categories,
  onSelect,
  show,
  onClose,
}: ExerciseLibraryPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Helper functions to get names from IDs
  const getMuscleGroupName = (id: string) =>
    muscleGroups.find((g) => g.id === id)?.name || id;

  const getCategoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name || id;

  const filteredExercises = exercises
    .filter((ex) => {
      const muscleGroupName = getMuscleGroupName(ex.muscleGroupId);
      const categoryNames = ex.categoryIds
        .map((id) => getCategoryName(id))
        .join(" ");

      // Search: nome, gruppo muscolare, categoria
      const matchesSearch =
        !searchQuery ||
        ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        muscleGroupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        categoryNames.toLowerCase().includes(searchQuery.toLowerCase());

      // Filtro gruppo muscolare
      const matchesMuscleGroup =
        selectedMuscleGroup === "all" ||
        ex.muscleGroupId === selectedMuscleGroup;

      // Filtro categoria (supporta categorie multiple)
      const matchesCategory =
        selectedCategory === "all" || ex.categoryIds.includes(selectedCategory);

      return matchesSearch && matchesMuscleGroup && matchesCategory;
    })
    .sort((a, b) => {
      // Se c'è una ricerca, ordina per rilevanza
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();

        // Priorità 1: Match esatto all'inizio del nome
        const aStartsWith = aName.startsWith(query);
        const bStartsWith = bName.startsWith(query);
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;

        // Priorità 2: Match nel nome
        const aIncludes = aName.includes(query);
        const bIncludes = bName.includes(query);
        if (aIncludes && !bIncludes) return -1;
        if (!aIncludes && bIncludes) return 1;
      }

      // Default: ordine alfabetico
      return a.name.localeCompare(b.name);
    });

  if (!show) return null;

  return (
    <Card className="shadow-lg">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            <CardTitle>Libreria Esercizi</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca esercizio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filters */}
        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Gruppo Muscolare
              </label>
              <Select
                value={selectedMuscleGroup}
                onValueChange={setSelectedMuscleGroup}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tutti" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti i gruppi</SelectItem>
                  {muscleGroups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Categoria
              </label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tutte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutte le categorie</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(selectedMuscleGroup !== "all" || selectedCategory !== "all") && (
          <div className="flex flex-wrap gap-2">
            {selectedMuscleGroup !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {getMuscleGroupName(selectedMuscleGroup)}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => setSelectedMuscleGroup("all")}
                />
              </Badge>
            )}
            {selectedCategory !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {getCategoryName(selectedCategory)}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => setSelectedCategory("all")}
                />
              </Badge>
            )}
          </div>
        )}

        {/* Results count */}
        <div className="flex items-center justify-between text-sm border-t pt-3">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">
              {filteredExercises.length}
            </span>
            <span className="text-muted-foreground">
              {filteredExercises.length === 1
                ? "esercizio trovato"
                : "esercizi trovati"}
            </span>
            {filteredExercises.length < exercises.length && (
              <span className="text-xs text-muted-foreground">
                su {exercises.length} totali
              </span>
            )}
          </div>
          {(selectedMuscleGroup !== "all" ||
            selectedCategory !== "all" ||
            searchQuery) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedMuscleGroup("all");
                setSelectedCategory("all");
              }}
            >
              <X className="h-3 w-3 mr-1" />
              Reset
            </Button>
          )}
        </div>

        {/* Exercise list */}
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
          {filteredExercises.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="mb-2">Nessun esercizio trovato</p>
              <p className="text-xs">Prova a modificare i filtri</p>
            </div>
          ) : (
            filteredExercises.map((exercise) => (
              <Button
                key={exercise.id}
                variant="outline"
                className="w-full justify-start text-left h-auto py-4 hover:bg-primary/5 hover:border-primary transition-all"
                onClick={() => onSelect(exercise)}
              >
                <div className="flex-1 space-y-2">
                  <div className="font-semibold text-base">{exercise.name}</div>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="secondary" className="text-xs">
                      {getMuscleGroupName(exercise.muscleGroupId)}
                    </Badge>
                    {exercise.categoryIds.map((catId) => (
                      <Badge key={catId} variant="outline" className="text-xs">
                        {getCategoryName(catId)}
                      </Badge>
                    ))}
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
