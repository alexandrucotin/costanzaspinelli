"use client";

import { useState } from "react";
import {
  Client,
  goalLabelsClient,
  statusLabels,
  genderLabels,
} from "@/lib/types-client";
import { WorkoutPlan, goalLabels } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  User,
  Calendar,
  Target,
  FileText,
  Activity,
  Edit,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateClientAction } from "@/app/actions/clients";
import { toast } from "sonner";

interface ClientDetailProps {
  client: Client;
  plans: WorkoutPlan[];
}

export function ClientDetail({
  client: initialClient,
  plans,
}: ClientDetailProps) {
  const router = useRouter();
  const [client, setClient] = useState(initialClient);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const calculateAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const calculateBMI = () => {
    if (!client.currentWeight || !client.height) return null;
    const heightInMeters = client.height / 100;
    return (client.currentWeight / (heightInMeters * heightInMeters)).toFixed(
      1
    );
  };

  const handleStatusChange = async (newStatus: Client["status"]) => {
    setIsUpdatingStatus(true);
    try {
      const updated = await updateClientAction(client.id, {
        status: newStatus,
      });
      setClient(updated);
      toast.success("Stato aggiornato");
    } catch {
      toast.error("Errore nell'aggiornamento dello stato");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const age = calculateAge(client.dateOfBirth);
  const bmi = calculateBMI();

  const getStatusColor = (status: Client["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-700 border-green-200";
      case "paused":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-200";
      case "completed":
        return "bg-gray-500/10 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/clienti">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Torna ai clienti
            </Button>
          </Link>
        </div>
        <Link href={`/admin/clienti/${client.id}/modifica`}>
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Modifica
          </Button>
        </Link>
      </div>

      {/* Client Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            {client.profilePhoto ? (
              <img
                src={client.profilePhoto}
                alt={client.fullName}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-12 w-12 text-primary" />
              </div>
            )}

            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{client.fullName}</h1>
                  <Badge
                    className={getStatusColor(client.status)}
                    variant="outline"
                  >
                    {statusLabels[client.status]}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {age && <span>{age} anni</span>}
                  {client.gender && (
                    <span>• {genderLabels[client.gender]}</span>
                  )}
                  {client.email && <span>• {client.email}</span>}
                  {client.phone && <span>• {client.phone}</span>}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Stato Cliente
                  </Label>
                  <Select
                    value={client.status}
                    onValueChange={handleStatusChange}
                    disabled={isUpdatingStatus}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Attivo</SelectItem>
                      <SelectItem value="paused">In Pausa</SelectItem>
                      <SelectItem value="completed">Concluso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground">Obiettivo</div>
                  <div className="font-medium">
                    {goalLabelsClient[client.primaryGoal]}
                  </div>
                </div>

                {client.currentWeight && client.targetWeight && (
                  <div>
                    <div className="text-xs text-muted-foreground">Peso</div>
                    <div className="font-medium">
                      {client.currentWeight}kg → {client.targetWeight}kg
                    </div>
                  </div>
                )}

                {bmi && (
                  <div>
                    <div className="text-xs text-muted-foreground">BMI</div>
                    <div className="font-medium">{bmi}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <Activity className="h-4 w-4 mr-2" />
            Panoramica
          </TabsTrigger>
          <TabsTrigger value="anamnesi">
            <FileText className="h-4 w-4 mr-2" />
            Anamnesi
          </TabsTrigger>
          <TabsTrigger value="plans">
            <Target className="h-4 w-4 mr-2" />
            Schede ({plans.length})
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Dati Fisici */}
            <Card>
              <CardHeader>
                <CardTitle>Dati Fisici</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {client.currentWeight && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Peso Attuale:</span>
                    <span className="font-medium">
                      {client.currentWeight} kg
                    </span>
                  </div>
                )}
                {client.height && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Altezza:</span>
                    <span className="font-medium">{client.height} cm</span>
                  </div>
                )}
                {client.bodyFatPercentage && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Massa Grassa:</span>
                    <span className="font-medium">
                      {client.bodyFatPercentage}%
                    </span>
                  </div>
                )}
                {bmi && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">BMI:</span>
                    <span className="font-medium">{bmi}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Obiettivi */}
            <Card>
              <CardHeader>
                <CardTitle>Obiettivi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Obiettivo Primario:
                  </span>
                  <span className="font-medium">
                    {goalLabelsClient[client.primaryGoal]}
                  </span>
                </div>
                {client.targetWeight && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Peso Target:</span>
                    <span className="font-medium">
                      {client.targetWeight} kg
                    </span>
                  </div>
                )}
                {client.targetDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data Target:</span>
                    <span className="font-medium">
                      {new Date(client.targetDate).toLocaleDateString("it-IT")}
                    </span>
                  </div>
                )}
                {client.goalNotes && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">
                      {client.goalNotes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Note */}
          {(client.generalNotes || client.privateNotes) && (
            <Card>
              <CardHeader>
                <CardTitle>Note</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {client.generalNotes && (
                  <div>
                    <Label className="text-sm font-semibold">
                      Note Generali
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {client.generalNotes}
                    </p>
                  </div>
                )}
                {client.privateNotes && (
                  <div>
                    <Label className="text-sm font-semibold">
                      Note Private
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {client.privateNotes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Anamnesi Tab */}
        <TabsContent value="anamnesi" className="space-y-4">
          {client.medicalHistory && (
            <Card>
              <CardHeader>
                <CardTitle>Anamnesi Medica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {client.medicalHistory.currentConditions && (
                  <div>
                    <Label className="text-sm font-semibold">
                      Patologie Attuali
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {client.medicalHistory.currentConditions}
                    </p>
                  </div>
                )}
                {client.medicalHistory.medications && (
                  <div>
                    <Label className="text-sm font-semibold">Farmaci</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {client.medicalHistory.medications}
                    </p>
                  </div>
                )}
                {client.medicalHistory.allergies && (
                  <div>
                    <Label className="text-sm font-semibold">Allergie</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {client.medicalHistory.allergies}
                    </p>
                  </div>
                )}
                {client.medicalHistory.injuries && (
                  <div>
                    <Label className="text-sm font-semibold">
                      Traumi e Infortuni
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {client.medicalHistory.injuries}
                    </p>
                  </div>
                )}
                {client.medicalHistory.limitations && (
                  <div>
                    <Label className="text-sm font-semibold">
                      Limitazioni Fisiche
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {client.medicalHistory.limitations}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {client.lifestyle && (
            <Card>
              <CardHeader>
                <CardTitle>Stile di Vita</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {client.lifestyle.occupation && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Professione:</span>
                    <span className="font-medium">
                      {client.lifestyle.occupation}
                    </span>
                  </div>
                )}
                {client.lifestyle.activityLevel && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Livello Attività:
                    </span>
                    <span className="font-medium">
                      {client.lifestyle.activityLevel}
                    </span>
                  </div>
                )}
                {client.lifestyle.smoker && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fumo:</span>
                    <span className="font-medium">
                      {client.lifestyle.smoker === "yes"
                        ? "Sì"
                        : client.lifestyle.smoker === "no"
                        ? "No"
                        : "Ex fumatore"}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Plans Tab */}
        <TabsContent value="plans" className="space-y-4">
          {plans.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <p className="mb-2">Nessuna scheda associata</p>
                <p className="text-sm">
                  Crea una nuova scheda per questo cliente
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
                    <CardTitle className="text-lg">{plan.title}</CardTitle>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>Obiettivo: {goalLabels[plan.goal]}</div>
                      <div>Durata: {plan.durationWeeks} settimane</div>
                      <div className="text-xs">
                        Creato:{" "}
                        {new Date(plan.createdAt).toLocaleDateString("it-IT")}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/admin/schede/${plan.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        Visualizza Scheda
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Label({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={className}>{children}</div>;
}
