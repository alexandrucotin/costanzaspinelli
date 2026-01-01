import { getExercises } from "@/lib/data";
import { PlanBuilder } from "@/components/admin/plan-builder";

export default async function NewPlanPage() {
  const exercises = await getExercises();

  return (
    <div className="container mx-auto py-8">
      <PlanBuilder exercises={exercises} />
    </div>
  );
}
