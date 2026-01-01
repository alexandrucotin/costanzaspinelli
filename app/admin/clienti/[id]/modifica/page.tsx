import { getClientById } from "@/lib/data-blobs";
import { ClientEditForm } from "@/components/admin/client-edit-form";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ClientEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await getClientById(id);

  if (!client) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Modifica Cliente</h1>
        <p className="text-muted-foreground mt-2">
          Aggiorna i dati di {client.fullName}
        </p>
      </div>
      <ClientEditForm client={client} />
    </div>
  );
}
