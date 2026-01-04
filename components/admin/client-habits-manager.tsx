"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Habit,
  HabitTemplate,
  categoryLabels,
  categoryIcons,
  categoryColors,
} from "@/lib/types-habits";
import {
  assignHabitToClient,
  toggleHabitStatus,
  deleteHabit,
} from "@/app/actions/habits";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Power, Trash2, Loader2 } from "lucide-react";

interface ClientHabitsManagerProps {
  clientId: string;
  habits: Habit[];
  templates: HabitTemplate[];
}

export function ClientHabitsManager({
  clientId,
  habits,
  templates,
}: ClientHabitsManagerProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  // Group templates by category
  const templatesByCategory = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, HabitTemplate[]>);

  // Group habits by category
  const habitsByCategory = habits.reduce((acc, habit) => {
    if (!acc[habit.category]) {
      acc[habit.category] = [];
    }
    acc[habit.category].push(habit);
    return acc;
  }, {} as Record<string, Habit[]>);

  const handleAssignHabit = async (templateId: string) => {
    setLoading(templateId);
    try {
      await assignHabitToClient(clientId, templateId);
      toast.success("Abitudine assegnata con successo!");
      router.refresh();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Errore durante l'assegnazione"
      );
    } finally {
      setLoading(null);
    }
  };

  const handleToggleStatus = async (habitId: string) => {
    setLoading(habitId);
    try {
      await toggleHabitStatus(habitId);
      toast.success("Stato abitudine aggiornato!");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Errore durante l'aggiornamento"
      );
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (habitId: string) => {
    if (!confirm("Sei sicuro di voler eliminare questa abitudine?")) {
      return;
    }

    setLoading(habitId);
    try {
      await deleteHabit(habitId);
      toast.success("Abitudine eliminata!");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Errore durante l'eliminazione"
      );
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Abitudini Assegnate</h3>
          <p className="text-sm text-muted-foreground">
            Gestisci le abitudini da tracciare per questo cliente
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Assegna Abitudine
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Seleziona Abitudine da Assegnare</DialogTitle>
            </DialogHeader>
            <div className="h-[60vh] overflow-y-auto pr-4">
              <div className="space-y-6">
                {Object.entries(templatesByCategory).map(
                  ([category, categoryTemplates]) => (
                    <div key={category}>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <span className="text-2xl">
                          {
                            categoryIcons[
                              category as keyof typeof categoryIcons
                            ]
                          }
                        </span>
                        {
                          categoryLabels[
                            category as keyof typeof categoryLabels
                          ]
                        }
                      </h4>
                      <div className="space-y-2">
                        {categoryTemplates.map((template) => (
                          <Card
                            key={template.id}
                            className="hover:shadow-md transition-shadow"
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xl">
                                      {template.icon}
                                    </span>
                                    <h5 className="font-medium">
                                      {template.name}
                                    </h5>
                                  </div>
                                  {template.description && (
                                    <p className="text-sm text-muted-foreground">
                                      {template.description}
                                    </p>
                                  )}
                                  <div className="flex gap-2 mt-2">
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {template.type === "checkbox" && "Sì/No"}
                                      {template.type === "number" && "Quantità"}
                                      {template.type === "scale" &&
                                        "Scala 1-10"}
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {template.frequency === "daily"
                                        ? "Giornaliera"
                                        : "Settimanale"}
                                    </Badge>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => handleAssignHabit(template.id)}
                                  disabled={loading === template.id}
                                >
                                  {loading === template.id && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  )}
                                  Assegna
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Assigned Habits */}
      {habits.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-6xl mb-4">📌</div>
            <h3 className="text-lg font-medium mb-2">
              Nessuna abitudine assegnata
            </h3>
            <p className="text-muted-foreground mb-4">
              Assegna delle abitudini al cliente per iniziare il tracking
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(habitsByCategory).map(
            ([category, categoryHabits]) => (
              <div key={category}>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">
                    {categoryIcons[category as keyof typeof categoryIcons]}
                  </span>
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </h4>
                <div className="grid gap-3 md:grid-cols-2">
                  {categoryHabits.map((habit) => (
                    <Card
                      key={habit.id}
                      className={!habit.isActive ? "opacity-60" : ""}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{habit.icon}</span>
                              <CardTitle className="text-base">
                                {habit.name}
                              </CardTitle>
                            </div>
                            {habit.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {habit.description}
                              </p>
                            )}
                          </div>
                          <Badge
                            variant={habit.isActive ? "default" : "secondary"}
                            style={{
                              backgroundColor: habit.isActive
                                ? habit.color || categoryColors[habit.category]
                                : undefined,
                            }}
                          >
                            {habit.isActive ? "Attiva" : "Disattivata"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleStatus(habit.id)}
                            disabled={loading === habit.id}
                            className="flex-1"
                          >
                            <Power className="h-4 w-4 mr-2" />
                            {habit.isActive ? "Disattiva" : "Attiva"}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(habit.id)}
                            disabled={loading === habit.id}
                          >
                            {loading === habit.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
