import { redirect } from "next/navigation";
import { getClientSession } from "@/lib/auth-client";
import { getClientById, getPlanById } from "@/lib/data-blobs";
import { ClientPlanView } from "@/components/client/client-plan-view";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ClientPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getClientSession();

  if (!session) {
    redirect("/cliente/login");
  }

  const { id } = await params;
  const [client, plan] = await Promise.all([
    getClientById(session.clientId),
    getPlanById(id),
  ]);

  if (!client || !plan) {
    notFound();
  }

  // Verify plan belongs to this client
  if (plan.clientName !== client.fullName) {
    notFound();
  }

  return <ClientPlanView plan={plan} client={client} />;
}
