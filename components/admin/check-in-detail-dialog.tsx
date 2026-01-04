"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckInWithClient, WeeklyCheckInData } from "@/lib/types-checkin";
import { updateCheckInReview } from "@/app/actions/checkins";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Calendar, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface CheckInDetailDialogProps {
  checkIn: CheckInWithClient;
  clientName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CheckInDetailDialog({
  checkIn,
  clientName,
  open,
  onOpenChange,
}: CheckInDetailDialogProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coachNotes, setCoachNotes] = useState(checkIn.coachNotes || "");
  const [reviewed, setReviewed] = useState(checkIn.reviewed);

  const data = checkIn.data as WeeklyCheckInData | undefined;
  const canEdit =
    checkIn.status === "submitted" || checkIn.status === "reviewed";

  const handleSave = async () => {
    setIsSubmitting(true);

    try {
      await updateCheckInReview(checkIn.id, coachNotes, reviewed);
      toast.success("Check-in aggiornato con successo!");
      router.refresh();
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Errore durante l'aggiornamento"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getObstacleLabel = (obstacle: string) => {
    switch (obstacle) {
      case "time":
        return "Mancanza di tempo";
      case "work":
        return "Lavoro";
      case "fatigue":
        return "Stanchezza";
      case "other":
        return "Altro";
      default:
        return obstacle;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Dettaglio Check-in</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Client Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">
                    {checkIn.client.fullName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {checkIn.client.email}
                  </p>
                </div>
                <Badge
                  variant={
                    checkIn.status === "reviewed" ? "default" : "secondary"
                  }
                >
                  {checkIn.status === "pending" && "Pending"}
                  {checkIn.status === "overdue" && "In ritardo"}
                  {checkIn.status === "submitted" && "Completato"}
                  {checkIn.status === "reviewed" && "Revisionato"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Check-in Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-muted-foreground">Data Prevista</Label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(new Date(checkIn.scheduledAt), "EEEE d MMMM yyyy", {
                    locale: it,
                  })}
                </span>
              </div>
            </div>
            {checkIn.submittedAt && (
              <div>
                <Label className="text-muted-foreground">
                  Data Completamento
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>
                    {format(
                      new Date(checkIn.submittedAt),
                      "d MMMM yyyy 'alle' HH:mm",
                      {
                        locale: it,
                      }
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Check-in Data */}
          {data && (
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="font-semibold mb-4">Risposte del Cliente</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Allenamenti Completati
                    </Label>
                    <div className="text-2xl font-bold mt-1">
                      {data.workoutsCompleted}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Motivazione
                    </Label>
                    <div className="text-2xl font-bold mt-1">
                      {data.motivation}/10
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Stress
                    </Label>
                    <div className="text-2xl font-bold mt-1">
                      {data.stress}/10
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Energia Mentale
                    </Label>
                    <div className="text-2xl font-bold mt-1">
                      {data.mentalEnergy}/10
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Label className="text-sm text-muted-foreground">
                    Difficoltà Percepita
                  </Label>
                  <div className="mt-2">
                    {data.perceivedDifficultyHigherThanNormal ? (
                      <Badge variant="outline">
                        Allenamenti più difficili del normale
                      </Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Difficoltà normale
                      </span>
                    )}
                  </div>
                </div>

                {data.mainObstacles && data.mainObstacles.length > 0 && (
                  <div className="pt-4 border-t">
                    <Label className="text-sm text-muted-foreground">
                      Principali Ostacoli
                    </Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {data.mainObstacles.map((obstacle) => (
                        <Badge key={obstacle} variant="secondary">
                          {getObstacleLabel(obstacle)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {data.notes && (
                  <div className="pt-4 border-t">
                    <Label className="text-sm text-muted-foreground">
                      Note del Cliente
                    </Label>
                    <p className="mt-2 text-sm whitespace-pre-wrap">
                      {data.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Coach Notes */}
          {canEdit && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="coachNotes">Note del Coach</Label>
                <Textarea
                  id="coachNotes"
                  placeholder="Aggiungi note o feedback per il cliente..."
                  value={coachNotes}
                  onChange={(e) => setCoachNotes(e.target.value)}
                  disabled={isSubmitting}
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="reviewed"
                  checked={reviewed}
                  onCheckedChange={(checked) => setReviewed(checked === true)}
                  disabled={isSubmitting}
                />
                <Label
                  htmlFor="reviewed"
                  className="text-sm font-normal cursor-pointer"
                >
                  Marca come revisionato
                </Label>
              </div>
            </div>
          )}

          {/* Read-only Coach Notes */}
          {!canEdit && checkIn.coachNotes && (
            <Card>
              <CardContent className="pt-6">
                <Label className="text-sm text-muted-foreground">
                  Note del Coach
                </Label>
                <p className="mt-2 text-sm whitespace-pre-wrap">
                  {checkIn.coachNotes}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Chiudi
            </Button>
            {canEdit && (
              <Button onClick={handleSave} disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting ? "Salvataggio..." : "Salva"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
