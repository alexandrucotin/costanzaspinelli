"use client";

import { useState } from "react";
import { WorkoutPlan, goalLabels } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deletePlanAction, duplicatePlanAction } from "@/app/actions/plans";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Copy, Search, FileDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PlansListProps {
  initialPlans: WorkoutPlan[];
}

export function PlansList({ initialPlans }: PlansListProps) {
  const [plans, setPlans] = useState(initialPlans);
  const [searchQuery, setSearchQuery] = useState("");
  const [goalFilter, setGoalFilter] = useState<string>("all");
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questa scheda?")) return;

    try {
      await deletePlanAction(id);
      setPlans(plans.filter((p) => p.id !== id));
      toast.success("Scheda eliminata");
    } catch {
      toast.error("Errore nell'eliminazione");
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const newPlan = await duplicatePlanAction(id);
      if (newPlan) {
        setPlans([newPlan, ...plans]);
        toast.success("Scheda duplicata");
      }
    } catch {
      toast.error("Errore nella duplicazione");
    }
  };

  const handleExportPdf = async (plan: WorkoutPlan) => {
    try {
      const { generateWorkoutPlanPDF } = await import("@/lib/pdf-generator");

      // Map plan goal to client goal
      const goalMap: Record<string, string> = {
        hypertrophy: "hypertrophy",
        strength: "strength",
        endurance: "endurance",
        general: "general_fitness",
        weight_loss: "weight_loss",
        mobility: "mobility",
      };

      // Create a mock client object with plan's client name
      const mockClient = {
        fullName: plan.clientName,
        id: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: undefined,
        profilePhoto: "",
        currentWeight: undefined,
        height: undefined,
        bodyFatPercentage: undefined,
        leanMass: undefined,
        primaryGoal: (goalMap[plan.goal] || "general_fitness") as
          | "hypertrophy"
          | "strength"
          | "endurance"
          | "weight_loss"
          | "mobility"
          | "recomposition"
          | "general_fitness",
        targetWeight: undefined,
        targetDate: "",
        goalNotes: "",
        status: "active" as const,
        firstAssessmentDate: "",
        generalNotes: "",
        privateNotes: "",
        measurements: [],
        assignedPlanIds: [],
        createdAt: "",
        updatedAt: "",
      };

      const pdf = generateWorkoutPlanPDF(plan, mockClient);
      pdf.save(
        `${plan.title.replace(/\s+/g, "_")}_${plan.clientName.replace(
          /\s+/g,
          "_"
        )}.pdf`
      );
      toast.success("PDF scaricato con successo!");
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Errore durante l'esportazione del PDF");
    }
  };

  const filteredPlans = plans.filter((plan) => {
    const matchesSearch =
      plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.clientName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGoal = goalFilter === "all" || plan.goal === goalFilter;

    return matchesSearch && matchesGoal;
  });

  return (
    <div className="space-y-6">
      {/* Header con ricerca e azioni */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca per titolo o cliente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Link href="/admin/schede/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuova Scheda
          </Button>
        </Link>
      </div>

      {/* Filtri */}
      <div className="flex gap-4">
        <div className="w-48">
          <Select value={goalFilter} onValueChange={setGoalFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Obiettivo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti gli obiettivi</SelectItem>
              {Object.entries(goalLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {(searchQuery || goalFilter !== "all") && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearchQuery("");
              setGoalFilter("all");
            }}
          >
            Reset filtri
          </Button>
        )}
      </div>

      {/* Contatore risultati */}
      <div className="text-sm text-muted-foreground">
        {filteredPlans.length}{" "}
        {filteredPlans.length === 1 ? "scheda" : "schede"}{" "}
        {searchQuery || goalFilter !== "all" ? "trovate" : "totali"}
      </div>

      {filteredPlans.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {plans.length === 0 ? (
              <>
                <p className="mb-2">Nessuna scheda creata</p>
                <p className="text-sm">Inizia creando la tua prima scheda!</p>
              </>
            ) : (
              <>
                <p className="mb-2">Nessuna scheda trovata</p>
                <p className="text-sm">
                  Prova a modificare i filtri di ricerca
                </p>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPlans.map((plan) => (
            <Card key={plan.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{plan.title}</CardTitle>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>Cliente: {plan.clientName}</div>
                  <div>Obiettivo: {goalLabels[plan.goal]}</div>
                  <div>Durata: {plan.durationWeeks} settimane</div>
                  <div className="text-xs">
                    Aggiornato:{" "}
                    {new Date(plan.updatedAt).toLocaleDateString("it-IT", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/admin/schede/${plan.id}`)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Modifica
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportPdf(plan)}
                  >
                    <FileDown className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDuplicate(plan.id)}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Duplica
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(plan.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Elimina
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
