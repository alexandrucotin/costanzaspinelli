"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Exercise,
  ExerciseSchema,
  Tool,
  MuscleGroup,
  Category,
} from "@/lib/types";
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
  tools: Tool[];
  muscleGroups: MuscleGroup[];
  categories: Category[];
  onSuccess: (exercise: Exercise) => void;
}

export function ExerciseForm({
  exercise,
  tools,
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
        <Select
          value={watch("categoryId")}
          onValueChange={(value) => setValue("categoryId", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleziona categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.length === 0 ? (
              <div className="p-2 text-sm text-muted-foreground">
                Nessuna categoria. Vai in Impostazioni per aggiungerle.
              </div>
            ) : (
              categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {errors.categoryId && (
          <p className="text-sm text-destructive mt-1">
            {errors.categoryId.message as string}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="toolIds">Attrezzi</Label>
        {tools.length === 0 ? (
          <p className="text-sm text-muted-foreground border rounded-lg p-4">
            Nessun attrezzo disponibile. Vai in Impostazioni per aggiungerli.
          </p>
        ) : (
          <>
            <Select
              onValueChange={(value) => {
                const currentTools = watch("toolIds") || [];
                if (!currentTools.includes(value)) {
                  setValue("toolIds", [...currentTools, value]);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleziona attrezzi..." />
              </SelectTrigger>
              <SelectContent>
                {tools.map((tool) => (
                  <SelectItem key={tool.id} value={tool.id}>
                    {tool.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {watch("toolIds")?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {watch("toolIds")?.map((toolId) => {
                  const tool = tools.find((t) => t.id === toolId);
                  return tool ? (
                    <Badge key={toolId} variant="secondary" className="gap-1">
                      {tool.name}
                      <button
                        type="button"
                        onClick={() => {
                          const currentTools = watch("toolIds") || [];
                          setValue(
                            "toolIds",
                            currentTools.filter((id) => id !== toolId)
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
        <p className="text-xs text-muted-foreground mt-1">
          Seleziona uno o più attrezzi dal menu
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
