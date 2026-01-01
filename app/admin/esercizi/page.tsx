import { getExercises } from "@/lib/data-blobs";
import { ExerciseLibrary } from "@/components/admin/exercise-library";

export const dynamic = "force-dynamic";

export default async function ExercisesPage() {
  const exercises = await getExercises();

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Libreria Esercizi</h1>
        <p className="text-muted-foreground mt-2">
          Gestisci la tua libreria di esercizi
        </p>
      </div>
      <ExerciseLibrary initialExercises={exercises} />
    </div>
  );
}
