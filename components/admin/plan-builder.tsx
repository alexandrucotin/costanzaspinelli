"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  WorkoutPlan,
  Exercise,
  Session,
  Section,
  ExerciseRow,
} from "@/lib/types";
import { createPlanAction, updatePlanAction } from "@/app/actions/plans";
import { PlanMetaForm } from "./plan-meta-form";
import { SessionEditor } from "./session-editor";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, Save } from "lucide-react";

interface PlanBuilderProps {
  plan?: WorkoutPlan;
  exercises: Exercise[];
}

export function PlanBuilder({ plan, exercises }: PlanBuilderProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(!plan);
  const [isSaving, setIsSaving] = useState(false);

  const [planData, setPlanData] = useState<Partial<WorkoutPlan>>(
    plan || {
      title: "",
      clientName: "",
      goal: "hypertrophy",
      durationWeeks: 4,
      frequencyDaysPerWeek: 3,
      equipment: "gym",
      notes: "",
      contraindications: "",
      sessions: [],
    }
  );

  const handleMetaUpdate = (meta: Partial<WorkoutPlan>) => {
    setPlanData({ ...planData, ...meta });
  };

  const handleAddSession = () => {
    const newSession: Session = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `Giorno ${(planData.sessions?.length || 0) + 1}`,
      sections: [
        {
          id: `section_warmup_${Date.now()}`,
          type: "warmup",
          exercises: [],
        },
        {
          id: `section_main_${Date.now()}`,
          type: "main",
          exercises: [],
        },
        {
          id: `section_cooldown_${Date.now()}`,
          type: "cooldown",
          exercises: [],
        },
      ],
    };

    setPlanData({
      ...planData,
      sessions: [...(planData.sessions || []), newSession],
    });
  };

  const handleSessionUpdate = (sessionId: string, updatedSession: Session) => {
    setPlanData({
      ...planData,
      sessions: planData.sessions?.map((s) =>
        s.id === sessionId ? updatedSession : s
      ),
    });
  };

  const handleSessionDelete = (sessionId: string) => {
    if (!confirm("Sei sicuro di voler eliminare questa sessione?")) return;

    setPlanData({
      ...planData,
      sessions: planData.sessions?.filter((s) => s.id !== sessionId),
    });
  };

  const handleSave = async () => {
    if (!planData.title || !planData.clientName) {
      toast.error("Compila i campi obbligatori");
      return;
    }

    if (!planData.sessions || planData.sessions.length === 0) {
      toast.error("Aggiungi almeno una sessione");
      return;
    }

    setIsSaving(true);
    try {
      if (plan) {
        await updatePlanAction(plan.id, planData as Partial<WorkoutPlan>);
        toast.success("Scheda aggiornata");
        setIsEditing(false);
      } else {
        const created = await createPlanAction(planData as any);
        toast.success("Scheda creata");
        router.push(`/admin/schede/${created.id}`);
      }
    } catch {
      toast.error("Errore nel salvataggio");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {plan
            ? isEditing
              ? "Modifica Scheda"
              : planData.title
            : "Nuova Scheda"}
        </h1>
        <div className="flex gap-2">
          {!isEditing && plan && (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Modifica
            </Button>
          )}
          {isEditing && (
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Salvataggio..." : "Salva"}
            </Button>
          )}
        </div>
      </div>

      <PlanMetaForm
        data={planData}
        onChange={handleMetaUpdate}
        disabled={!isEditing}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Sessioni</h2>
          {isEditing && (
            <Button onClick={handleAddSession} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Aggiungi Sessione
            </Button>
          )}
        </div>

        {!planData.sessions || planData.sessions.length === 0 ? (
          <div className="border rounded-lg p-12 text-center text-muted-foreground">
            Nessuna sessione. Clicca "Aggiungi Sessione" per iniziare.
          </div>
        ) : (
          <Tabs defaultValue={planData.sessions[0]?.id} className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto">
              {planData.sessions.map((session) => (
                <TabsTrigger key={session.id} value={session.id}>
                  {session.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {planData.sessions.map((session) => (
              <TabsContent key={session.id} value={session.id} className="mt-6">
                <SessionEditor
                  session={session}
                  exercises={exercises}
                  disabled={!isEditing}
                  onUpdate={(updated) =>
                    handleSessionUpdate(session.id, updated)
                  }
                  onDelete={() => handleSessionDelete(session.id)}
                />
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
}
