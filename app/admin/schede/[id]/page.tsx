import {
  getPlanById,
  getExercises,
  getTools,
  getMuscleGroups,
  getCategories,
  getClients,
} from "@/lib/db-adapter";
import { PlanBuilder } from "@/components/admin/plan-builder";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PlanEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [plan, exercises, tools, muscleGroups, categories, clients] =
    await Promise.all([
      getPlanById(id),
      getExercises(),
      getTools(),
      getMuscleGroups(),
      getCategories(),
      getClients(),
    ]);

  if (!plan) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <PlanBuilder
        plan={plan}
        exercises={exercises}
        tools={tools}
        muscleGroups={muscleGroups}
        categories={categories}
        clients={clients}
      />
    </div>
  );
}
