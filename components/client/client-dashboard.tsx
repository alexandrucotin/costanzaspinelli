"use client";

import { Client } from "@/lib/types-client";
import { WorkoutPlan, goalLabels } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { logoutClientAction } from "@/app/actions/client-auth";
import { User, Target, Calendar, LogOut, Dumbbell } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ClientDashboardProps {
  client: Client;
  plans: WorkoutPlan[];
}

export function ClientDashboard({ client, plans }: ClientDashboardProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutClientAction();
      toast.success("Logout effettuato");
      router.push("/cliente/login");
    } catch {
      toast.error("Errore durante il logout");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                Benvenuto, {client.fullName.split(" ")[0]}!
              </h1>
              <p className="text-sm text-muted-foreground">{client.email}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Esci
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Client Info Summary */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Obiettivo</p>
                  <p className="font-semibold">{client.primaryGoal}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Peso Attuale</p>
                  <p className="font-semibold">
                    {client.currentWeight
                      ? `${client.currentWeight} kg`
                      : "Non specificato"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Dumbbell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Schede Attive</p>
                  <p className="font-semibold">{plans.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Plans Section */}
        <div>
          <h2 className="text-xl font-bold mb-4">
            Le Tue Schede di Allenamento
          </h2>

          {plans.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Dumbbell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="mb-2 font-medium">Nessuna scheda disponibile</p>
                <p className="text-sm">
                  Il tuo trainer ti assegnerà presto una scheda personalizzata
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{plan.title}</CardTitle>
                        <div className="text-sm text-muted-foreground space-y-1 mt-2">
                          <div className="flex items-center gap-2">
                            <Target className="h-3 w-3" />
                            {goalLabels[plan.goal]}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            {plan.durationWeeks} settimane •{" "}
                            {plan.frequencyDaysPerWeek}x/settimana
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {plan.sessions?.length || 0} sessioni
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {plan.notes && (
                      <p className="text-sm text-muted-foreground mb-4">
                        {plan.notes}
                      </p>
                    )}
                    <Link href={`/cliente/schede/${plan.id}`}>
                      <Button className="w-full">
                        <Dumbbell className="h-4 w-4 mr-2" />
                        Visualizza Scheda
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Profile Link */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Il Tuo Profilo</h3>
                <p className="text-sm text-muted-foreground">
                  Visualizza i tuoi dati e progressi
                </p>
              </div>
              <Link href="/cliente/profilo">
                <Button variant="outline">
                  <User className="h-4 w-4 mr-2" />
                  Vai al Profilo
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
