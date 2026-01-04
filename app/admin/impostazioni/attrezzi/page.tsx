import { getTools } from "@/lib/db-adapter";
import { MetadataList } from "@/components/admin/metadata-list";
import { createToolAction, deleteToolAction } from "@/app/actions/metadata";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AttrezziPage() {
  const tools = await getTools();

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <div className="mb-8">
        <Link href="/admin/impostazioni">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Torna a Impostazioni
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Gestione Attrezzi</h1>
        <p className="text-muted-foreground mt-2">
          Aggiungi e gestisci gli attrezzi disponibili per gli esercizi
        </p>
      </div>

      <MetadataList
        items={tools}
        title="Attrezzo"
        onAdd={createToolAction}
        onDelete={deleteToolAction}
      />
    </div>
  );
}
