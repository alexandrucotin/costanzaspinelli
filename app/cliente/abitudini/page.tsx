import { getMyHabitsWithLogs } from "@/app/actions/habits";
import { HabitTracker } from "@/components/client/habit-tracker";
import { startOfDay, subDays } from "date-fns";

export default async function ClientHabitsPage() {
  // Get habits with logs for last 7 days
  const endDate = startOfDay(new Date());
  const startDate = subDays(endDate, 6);

  const habits = await getMyHabitsWithLogs(startDate, endDate);

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Le Mie Abitudini</h1>
        <p className="text-muted-foreground">
          Traccia le tue abitudini giornaliere per raggiungere i tuoi obiettivi
        </p>
      </div>

      <HabitTracker habits={habits} />
    </div>
  );
}
