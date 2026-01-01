import { getPlanById } from "@/lib/data-blobs";
import { getExercises } from "@/lib/data-blobs";
import { PlanBuilder } from "@/components/admin/plan-builder";
import { notFound } from "next/navigation";

export default async function PlanEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [plan, exercises] = await Promise.all([
    getPlanById(id),
    getExercises(),
  ]);

  if (!plan) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <PlanBuilder plan={plan} exercises={exercises} />
    </div>
  );
}
