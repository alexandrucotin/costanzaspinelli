import { getAllCheckIns } from "@/app/actions/checkins";
import { getClients } from "@/lib/db-adapter";
import { CheckInsOverview } from "@/components/admin/check-ins-overview";

export default async function AdminCheckInsPage() {
  const [checkIns, clients] = await Promise.all([
    getAllCheckIns(),
    getClients(),
  ]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Check-in</h1>
        <p className="text-muted-foreground">
          Monitora e revisiona i check-in settimanali dei clienti
        </p>
      </div>

      <CheckInsOverview checkIns={checkIns} clients={clients} />
    </div>
  );
}
