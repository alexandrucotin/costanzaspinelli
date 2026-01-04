import { getClientById, getPlans } from "@/lib/db-adapter";
import { getClientHabits, getHabitTemplates } from "@/app/actions/habits";
import { getAllCheckIns } from "@/app/actions/checkins";
import { ClientDetail } from "@/components/admin/client-detail";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [client, allPlans, habits, templates, checkIns] = await Promise.all([
    getClientById(id),
    getPlans(),
    getClientHabits(id),
    getHabitTemplates(),
    getAllCheckIns({ clientId: id }),
  ]);

  if (!client) {
    notFound();
  }

  // Filter plans assigned to this client
  const clientPlans = allPlans.filter(
    (plan) => plan.clientName === client.fullName
  );

  return (
    <div className="container mx-auto py-8">
      <ClientDetail
        client={client}
        plans={clientPlans}
        habits={habits}
        templates={templates}
        checkIns={checkIns}
      />
    </div>
  );
}
