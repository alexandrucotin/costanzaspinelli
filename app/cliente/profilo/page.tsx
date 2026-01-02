import { Suspense } from "react";
import { getAuthenticatedClient } from "@/lib/auth-utils";
import { getClients } from "@/lib/data-blobs";
import { ClientProfile } from "@/components/client/client-profile";

export const dynamic = "force-dynamic";

async function ProfileContent({ userEmail }: { userEmail: string }) {
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

  return <ClientProfile client={client} />;
}

export default async function ClientProfilePage() {
  const { userEmail } = await getAuthenticatedClient();

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Caricamento...
        </div>
      }
    >
      <ProfileContent userEmail={userEmail} />
    </Suspense>
  );
}
