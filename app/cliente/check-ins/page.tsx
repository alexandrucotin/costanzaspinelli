import { getMyCheckIns } from "@/app/actions/checkins";
import { CheckInList } from "@/components/client/check-in-list";

export default async function ClientCheckInsPage() {
  const checkIns = await getMyCheckIns();

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">I Miei Check-in</h1>
        <p className="text-muted-foreground">
          Completa i check-in settimanali per monitorare i tuoi progressi
        </p>
      </div>

      <CheckInList checkIns={checkIns} />
    </div>
  );
}
