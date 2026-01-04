import { getClients } from "@/lib/db-adapter";
import { ClientsList } from "@/components/admin/clients-list";

export const dynamic = "force-dynamic";

export default async function ClientiPage() {
  const clients = await getClients();

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Clienti</h1>
        <p className="text-muted-foreground mt-2">
          Gestisci i tuoi clienti e monitora i loro progressi
        </p>
      </div>
      <ClientsList initialClients={clients} />
    </div>
  );
}
