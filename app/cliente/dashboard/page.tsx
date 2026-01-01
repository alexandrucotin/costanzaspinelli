import { redirect } from "next/navigation";
import { getClientSession, requireClientAuth } from "@/lib/auth-client";
import { getClientById } from "@/lib/data-blobs";
import { getPlans } from "@/lib/data-blobs";
import { ClientDashboard } from "@/components/client/client-dashboard";

export const dynamic = "force-dynamic";

export default async function ClientDashboardPage() {
  const session = await getClientSession();

  if (!session) {
    redirect("/cliente/login");
  }

  const [client, allPlans] = await Promise.all([
    getClientById(session.clientId),
    getPlans(),
  ]);

  if (!client) {
    redirect("/cliente/login");
  }

  // Filter plans for this client
  const clientPlans = allPlans.filter(
    (plan) => plan.clientName === client.fullName
  );

  return <ClientDashboard client={client} plans={clientPlans} />;
}
