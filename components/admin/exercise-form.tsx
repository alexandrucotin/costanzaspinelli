"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Exercise, ExerciseSchema, MuscleGroup, Category } from "@/lib/types";
import {
  createExerciseAction,
  updateExerciseAction,
} from "@/app/actions/exercises";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { X } from "lucide-react";

interface ExerciseFormProps {
  exercise?: Exercise;
  muscleGroups: MuscleGroup[];
  categories: Category[];
  onSuccess: (exercise: Exercise) => void;
}

export function ExerciseForm({
  exercise,
  muscleGroups,
  categories,
  onSuccess,
}: ExerciseFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(
      ExerciseSchema.omit({ id: true, createdAt: true, updatedAt: true })
    ),
    defaultValues: exercise || {
      name: "",
      muscleGroupId: "",
      categoryIds: [],
      defaultRestSeconds: undefined,
      defaultTempo: "",
      videoUrl: "",
    },
  });

  const onSubmit = async (
    data: Omit<Exercise, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      if (exercise) {
        const updated = await updateExerciseAction(exercise.id, data);
        onSuccess(updated);
      } else {
        const created = await createExerciseAction(data);
        onSuccess(created);
      }
    } catch {
      toast.error("Errore nel salvataggio");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome Esercizio *</Label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="text-sm text-destructive mt-1">
            {errors.name.message as string}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="muscleGroupId">Gruppo Muscolare *</Label>
        <Select
          value={watch("muscleGroupId")}
          onValueChange={(value) => setValue("muscleGroupId", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleziona gruppo muscolare" />
          </SelectTrigger>
          <SelectContent>
            {muscleGroups.length === 0 ? (
              <div className="p-2 text-sm text-muted-foreground">
                Nessun gruppo muscolare. Vai in Impostazioni per aggiungerli.
              </div>
            ) : (
              muscleGroups.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {errors.muscleGroupId && (
          <p className="text-sm text-destructive mt-1">
            {errors.muscleGroupId.message as string}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="categoryIds">Categorie *</Label>
        {categories.length === 0 ? (
          <p className="text-sm text-muted-foreground border rounded-lg p-4">
            Nessuna categoria disponibile. Vai in Impostazioni per aggiungerle.
          </p>
        ) : (
          <>
            <Select
              onValueChange={(value) => {
                const currentCategories = watch("categoryIds") || [];
                if (!currentCategories.includes(value)) {
                  setValue("categoryIds", [...currentCategories, value]);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleziona categorie..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(watch("categoryIds")?.length ?? 0) > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {watch("categoryIds")?.map((categoryId) => {
                  const category = categories.find((c) => c.id === categoryId);
                  return category ? (
                    <Badge
                      key={categoryId}
                      variant="secondary"
                      className="gap-1"
                    >
                      {category.name}
                      <button
                        type="button"
                        onClick={() => {
                          const currentCategories = watch("categoryIds") || [];
                          setValue(
                            "categoryIds",
                            currentCategories.filter((id) => id !== categoryId)
                          );
                        }}
                        className="ml-1 hover:bg-secondary-foreground/20 rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ) : null;
                })}
              </div>
            )}
          </>
        )}
        {errors.categoryIds && (
          <p className="text-sm text-destructive mt-1">
            {errors.categoryIds.message as string}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Seleziona una o più categorie dal menu
        </p>
      </div>

      <div>
        <Label htmlFor="defaultRestSeconds">Riposo Predefinito (secondi)</Label>
        <Input
          id="defaultRestSeconds"
          type="number"
          {...register("defaultRestSeconds", { valueAsNumber: true })}
        />
        {errors.defaultRestSeconds && (
          <p className="text-sm text-destructive mt-1">
            {errors.defaultRestSeconds.message as string}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="defaultTempo">Tempo Predefinito</Label>
        <Input
          id="defaultTempo"
          {...register("defaultTempo")}
          placeholder="es. 3010"
        />
        {errors.defaultTempo && (
          <p className="text-sm text-destructive mt-1">
            {errors.defaultTempo.message as string}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="videoUrl">URL Video (opzionale)</Label>
        <Input
          id="videoUrl"
          {...register("videoUrl")}
          placeholder="https://..."
        />
        {errors.videoUrl && (
          <p className="text-sm text-destructive mt-1">
            {errors.videoUrl.message as string}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvataggio..." : exercise ? "Aggiorna" : "Crea"}
        </Button>
      </div>
    </form>
  );
}
