import { Suspense } from "react";
import { getAuthenticatedClient } from "@/lib/auth-utils";
import { getClients, getPlans } from "@/lib/db-adapter";
import { ClientDashboard } from "@/components/client/client-dashboard";

export const dynamic = "force-dynamic";

// Separate component that fetches data - only rendered AFTER auth check
async function DashboardContent({ userEmail }: { userEmail: string }) {
  const [allClients, allPlans] = await Promise.all([getClients(), getPlans()]);

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

  const clientPlans = allPlans.filter(
    (plan) => plan.clientName === client.fullName
  );

  return <ClientDashboard client={client} plans={clientPlans} />;
}

export default async function ClientDashboardPage() {
  // CRITICAL: Auth check happens FIRST, in parent component
  // If this fails, redirect happens and DashboardContent NEVER renders
  const { userEmail } = await getAuthenticatedClient();

  // Only if auth succeeds, render the data-fetching component
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Caricamento...
        </div>
      }
    >
      <DashboardContent userEmail={userEmail} />
    </Suspense>
  );
}
