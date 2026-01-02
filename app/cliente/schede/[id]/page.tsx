import { Suspense } from "react";
import { getAuthenticatedClient } from "@/lib/auth-utils";
import { getClients, getPlanById } from "@/lib/data-blobs";
import { ClientPlanView } from "@/components/client/client-plan-view";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function PlanContent({
  userEmail,
  planId,
}: {
  userEmail: string;
  planId: string;
}) {
  const allClients = await getClients();
  const client = allClients.find((c) => c.email === userEmail);

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Profilo non trovato</h1>
          <p className="text-muted-foreground">
            Contatta il tuo personal trainer per completare la configurazione.
          </p>
        </div>
      </div>
    );
  }

  const plan = await getPlanById(planId);

  if (!plan) {
    notFound();
  }

  if (plan.clientName !== client.fullName) {
    notFound();
  }

  return <ClientPlanView plan={plan} client={client} />;
}

export default async function ClientPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userEmail } = await getAuthenticatedClient();
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Caricamento...
        </div>
      }
    >
      <PlanContent userEmail={userEmail} planId={id} />
    </Suspense>
  );
}
