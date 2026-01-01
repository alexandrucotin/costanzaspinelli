"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Exercise, ExerciseSchema } from "@/lib/types";
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
import { toast } from "sonner";

interface ExerciseFormProps {
  exercise?: Exercise;
  onSuccess: (exercise: Exercise) => void;
}

export function ExerciseForm({ exercise, onSuccess }: ExerciseFormProps) {
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
      muscleGroup: "",
      equipment: "gym",
      category: "",
      defaultRestSeconds: undefined,
      defaultTempo: "",
      videoUrl: "",
    },
  });

  const equipment = watch("equipment");

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
        <Label htmlFor="muscleGroup">Gruppo Muscolare *</Label>
        <Input
          id="muscleGroup"
          {...register("muscleGroup")}
          placeholder="es. Petto, Gambe, Schiena"
        />
        {errors.muscleGroup && (
          <p className="text-sm text-destructive mt-1">
            {errors.muscleGroup.message as string}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="equipment">Attrezzatura *</Label>
        <Select
          value={equipment}
          onValueChange={(value) =>
            setValue("equipment", value as Exercise["equipment"])
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gym">Palestra</SelectItem>
            <SelectItem value="home">Casa</SelectItem>
            <SelectItem value="both">Entrambi</SelectItem>
            <SelectItem value="bodyweight">Corpo libero</SelectItem>
          </SelectContent>
        </Select>
        {errors.equipment && (
          <p className="text-sm text-destructive mt-1">
            {errors.equipment.message as string}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="category">Categoria *</Label>
        <Input
          id="category"
          {...register("category")}
          placeholder="es. Spinta, Tirata, Isolamento"
        />
        {errors.category && (
          <p className="text-sm text-destructive mt-1">
            {errors.category.message as string}
          </p>
        )}
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
