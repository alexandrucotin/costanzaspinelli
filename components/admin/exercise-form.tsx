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
      muscleGroupId: "",
      environment: "gym",
      categoryId: "",
      toolIds: [],
      defaultRestSeconds: undefined,
      defaultTempo: "",
      videoUrl: "",
    },
  });

  const environment = watch("environment");

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
        <Input
          id="muscleGroupId"
          {...register("muscleGroupId")}
          placeholder="Inserisci ID gruppo muscolare (temporaneo)"
        />
        {errors.muscleGroupId && (
          <p className="text-sm text-destructive mt-1">
            {errors.muscleGroupId.message as string}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Nota: Popola prima i metadata in Impostazioni
        </p>
      </div>

      <div>
        <Label htmlFor="environment">Ambiente *</Label>
        <Select
          value={environment}
          onValueChange={(value) =>
            setValue("environment", value as Exercise["environment"])
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gym">Palestra</SelectItem>
            <SelectItem value="home">Casa</SelectItem>
            <SelectItem value="both">Entrambi</SelectItem>
          </SelectContent>
        </Select>
        {errors.environment && (
          <p className="text-sm text-destructive mt-1">
            {errors.environment.message as string}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="categoryId">Categoria *</Label>
        <Input
          id="categoryId"
          {...register("categoryId")}
          placeholder="Inserisci ID categoria (temporaneo)"
        />
        {errors.categoryId && (
          <p className="text-sm text-destructive mt-1">
            {errors.categoryId.message as string}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Nota: Popola prima i metadata in Impostazioni
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
