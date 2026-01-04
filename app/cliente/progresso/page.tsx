import { getMyProgressEntries } from "@/app/actions/progress";
import { getClientSession } from "@/lib/auth-client";
import { getClients } from "@/lib/db-adapter";
import { ProgressTracker } from "@/components/client/progress-tracker";

export default async function ClientProgressPage() {
  const session = await getClientSession();
  const [progressEntries, clients] = await Promise.all([
    getMyProgressEntries(),
    getClients(),
  ]);

  const client = session
    ? clients.find((c) => c.id === session.clientId)
    : null;

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Il Mio Progresso</h1>
        <p className="text-muted-foreground">
          Monitora il tuo peso e i tuoi progressi con foto nel tempo
        </p>
      </div>

      <ProgressTracker
        entries={progressEntries}
        targetWeight={client?.targetWeight ?? undefined}
      />
    </div>
  );
}
