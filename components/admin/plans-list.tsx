"use client";

import { useState } from "react";
import { WorkoutPlan, goalLabels } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deletePlanAction, duplicatePlanAction } from "@/app/actions/plans";
import { generatePdfAction } from "@/app/actions/pdf";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Copy, FileDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PlansListProps {
  initialPlans: WorkoutPlan[];
}

export function PlansList({ initialPlans }: PlansListProps) {
  const [plans, setPlans] = useState(initialPlans);
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
      toast.loading("Generazione PDF...");
      const result = await generatePdfAction(plan.id);

      if (result.success && result.data) {
        const blob = new Blob([result.data as BlobPart], {
          type: "application/pdf",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${plan.title.replace(
          /\s+/g,
          "_"
        )}_${plan.clientName.replace(/\s+/g, "_")}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.dismiss();
        toast.success("PDF scaricato");
      } else {
        toast.dismiss();
        toast.error(result.error || "Errore nella generazione del PDF");
      }
    } catch {
      toast.dismiss();
      toast.error("Errore nella generazione del PDF");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link href="/admin/schede/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuova Scheda
          </Button>
        </Link>
      </div>

      {plans.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Nessuna scheda creata. Inizia creando la tua prima scheda!
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
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
