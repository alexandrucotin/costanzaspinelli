import {
  getExercises,
  getTools,
  getMuscleGroups,
  getCategories,
} from "@/lib/data-blobs";
import { PlanBuilder } from "@/components/admin/plan-builder";

export const dynamic = "force-dynamic";

export default async function NewPlanPage() {
  const [exercises, tools, muscleGroups, categories] = await Promise.all([
    getExercises(),
    getTools(),
    getMuscleGroups(),
    getCategories(),
  ]);

  return (
    <div className="container mx-auto py-8">
      <PlanBuilder
        exercises={exercises}
        tools={tools}
        muscleGroups={muscleGroups}
        categories={categories}
      />
    </div>
  );
}
