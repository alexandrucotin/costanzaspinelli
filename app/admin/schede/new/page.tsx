import {
  getExercises,
  getTools,
  getMuscleGroups,
  getCategories,
  getClients,
} from "@/lib/db-adapter";
import { PlanBuilder } from "@/components/admin/plan-builder";

export const dynamic = "force-dynamic";

export default async function NewPlanPage() {
  const [exercises, tools, muscleGroups, categories, clients] =
    await Promise.all([
      getExercises(),
      getTools(),
      getMuscleGroups(),
      getCategories(),
      getClients(),
    ]);

  return (
    <div className="container mx-auto py-8">
      <PlanBuilder
        exercises={exercises}
        tools={tools}
        muscleGroups={muscleGroups}
        categories={categories}
        clients={clients}
      />
    </div>
  );
}
