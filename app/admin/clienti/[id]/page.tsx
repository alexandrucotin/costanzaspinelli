import { getClientById, getPlans } from "@/lib/data-blobs";
import { ClientDetail } from "@/components/admin/client-detail";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [client, allPlans] = await Promise.all([getClientById(id), getPlans()]);

  if (!client) {
    notFound();
  }

  // Filter plans assigned to this client
  const clientPlans = allPlans.filter(
    (plan) => plan.clientName === client.fullName
  );

  return (
    <div className="container mx-auto py-8">
      <ClientDetail client={client} plans={clientPlans} />
    </div>
  );
}
