import { getPlans } from "@/lib/data-blobs";
import { PlansList } from "@/components/admin/plans-list";

export const dynamic = "force-dynamic";

export default async function SchedePage() {
  const plans = await getPlans();

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Schede Allenamento</h1>
        <p className="text-muted-foreground mt-2">
          Gestisci le schede di allenamento dei tuoi clienti
        </p>
      </div>
      <PlansList initialPlans={plans} />
    </div>
  );
}
