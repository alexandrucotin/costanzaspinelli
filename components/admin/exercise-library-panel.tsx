"use client";

import { useState } from "react";
import {
  Exercise,
  environmentLabels,
  Tool,
  MuscleGroup,
  Category,
} from "@/lib/types";
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
  tools: Tool[];
  muscleGroups: MuscleGroup[];
  categories: Category[];
  onSelect: (exercise: Exercise) => void;
  show: boolean;
  onClose: () => void;
}

export function ExerciseLibraryPanel({
  exercises,
  tools,
  muscleGroups,
  categories,
  onSelect,
  show,
  onClose,
}: ExerciseLibraryPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>("");

  // Helper functions to get names from IDs
  const getMuscleGroupName = (id: string) =>
    muscleGroups.find((g) => g.id === id)?.name || id;

  const getCategoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name || id;

  const getToolNames = (toolIds: string[]) =>
    toolIds.map((id) => tools.find((t) => t.id === id)?.name || id);

  const filteredExercises = exercises.filter((ex) => {
    const muscleGroupName = getMuscleGroupName(ex.muscleGroupId);
    const categoryName = getCategoryName(ex.categoryId);

    const matchesSearch =
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      muscleGroupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      categoryName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMuscleGroup =
      !selectedMuscleGroup || ex.muscleGroupId === selectedMuscleGroup;

    const matchesCategory =
      !selectedCategory || ex.categoryId === selectedCategory;

    const matchesEnvironment =
      !selectedEnvironment || ex.environment === selectedEnvironment;

    return (
      matchesSearch &&
      matchesMuscleGroup &&
      matchesCategory &&
      matchesEnvironment
    );
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
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Gruppo Muscolare
            </label>
            <Select
              value={selectedMuscleGroup}
              onValueChange={setSelectedMuscleGroup}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tutti i gruppi" />
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
                <SelectValue placeholder="Tutte le categorie" />
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

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Ambiente
            </label>
            <Select
              value={selectedEnvironment}
              onValueChange={setSelectedEnvironment}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tutti gli ambienti" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti gli ambienti</SelectItem>
                <SelectItem value="gym">Palestra</SelectItem>
                <SelectItem value="home">Casa</SelectItem>
                <SelectItem value="both">Entrambi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-3">
          <span>{filteredExercises.length} esercizi trovati</span>
          {(selectedMuscleGroup ||
            selectedCategory ||
            selectedEnvironment ||
            searchQuery) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedMuscleGroup("");
                setSelectedCategory("");
                setSelectedEnvironment("");
              }}
            >
              Reset filtri
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
                    <Badge variant="outline" className="text-xs">
                      {getCategoryName(exercise.categoryId)}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {environmentLabels[exercise.environment]}
                    </Badge>
                  </div>
                  {exercise.toolIds.length > 0 && (
                    <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
                      {getToolNames(exercise.toolIds).map((tool, idx) => (
                        <span key={idx}>
                          {tool}
                          {idx < exercise.toolIds.length - 1 && ", "}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Button>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
