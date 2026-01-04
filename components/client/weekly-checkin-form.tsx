"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckIn, WeeklyCheckInData } from "@/lib/types-checkin";
import { submitWeeklyCheckIn } from "@/app/actions/checkins";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface WeeklyCheckInFormProps {
  checkIn: CheckIn;
  onBack: () => void;
}

export function WeeklyCheckInForm({ checkIn, onBack }: WeeklyCheckInFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isReadOnly =
    checkIn.status === "submitted" || checkIn.status === "reviewed";

  // Form state
  const existingData = checkIn.data as WeeklyCheckInData | undefined;
  const [workoutsCompleted, setWorkoutsCompleted] = useState(
    existingData?.workoutsCompleted ?? 0
  );
  const [motivation, setMotivation] = useState(existingData?.motivation ?? 5);
  const [stress, setStress] = useState(existingData?.stress ?? 5);
  const [mentalEnergy, setMentalEnergy] = useState(
    existingData?.mentalEnergy ?? 5
  );
  const [
    perceivedDifficultyHigherThanNormal,
    setPerceivedDifficultyHigherThanNormal,
  ] = useState(existingData?.perceivedDifficultyHigherThanNormal ?? false);
  const [mainObstacles, setMainObstacles] = useState<
    Array<"time" | "work" | "fatigue" | "other">
  >(existingData?.mainObstacles ?? []);
  const [notes, setNotes] = useState(existingData?.notes ?? "");

  const handleObstacleToggle = (
    obstacle: "time" | "work" | "fatigue" | "other"
  ) => {
    if (mainObstacles.includes(obstacle)) {
      setMainObstacles(mainObstacles.filter((o) => o !== obstacle));
    } else {
      setMainObstacles([...mainObstacles, obstacle]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isReadOnly) {
      onBack();
      return;
    }

    setIsSubmitting(true);

    try {
      const data: WeeklyCheckInData = {
        workoutsCompleted,
        motivation,
        stress,
        mentalEnergy,
        perceivedDifficultyHigherThanNormal,
        mainObstacles,
        notes: notes.trim() || undefined,
      };

      await submitWeeklyCheckIn(checkIn.id, data);
      toast.success("Check-in completato con successo!");
      router.refresh();
      onBack();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Errore durante l'invio del check-in"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Torna alla lista
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Check-in Settimanale</CardTitle>
          <p className="text-sm text-muted-foreground">
            Previsto per{" "}
            {format(new Date(checkIn.scheduledAt), "EEEE d MMMM yyyy", {
              locale: it,
            })}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Workouts Completed */}
            <div className="space-y-2">
              <Label htmlFor="workouts">
                Quanti allenamenti hai completato questa settimana?
              </Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="workouts"
                  min={0}
                  max={10}
                  step={1}
                  value={[workoutsCompleted]}
                  onValueChange={(value) => setWorkoutsCompleted(value[0])}
                  disabled={isReadOnly}
                  className="flex-1"
                />
                <span className="text-2xl font-bold w-12 text-center">
                  {workoutsCompleted}
                </span>
              </div>
            </div>

            {/* Motivation */}
            <div className="space-y-2">
              <Label htmlFor="motivation">
                Come valuti la tua motivazione? (1 = molto bassa, 10 = molto
                alta)
              </Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="motivation"
                  min={1}
                  max={10}
                  step={1}
                  value={[motivation]}
                  onValueChange={(value) => setMotivation(value[0])}
                  disabled={isReadOnly}
                  className="flex-1"
                />
                <span className="text-2xl font-bold w-12 text-center">
                  {motivation}
                </span>
              </div>
            </div>

            {/* Stress */}
            <div className="space-y-2">
              <Label htmlFor="stress">
                Come valuti il tuo livello di stress? (1 = molto basso, 10 =
                molto alto)
              </Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="stress"
                  min={1}
                  max={10}
                  step={1}
                  value={[stress]}
                  onValueChange={(value) => setStress(value[0])}
                  disabled={isReadOnly}
                  className="flex-1"
                />
                <span className="text-2xl font-bold w-12 text-center">
                  {stress}
                </span>
              </div>
            </div>

            {/* Mental Energy */}
            <div className="space-y-2">
              <Label htmlFor="energy">
                Come valuti la tua energia mentale? (1 = molto bassa, 10 = molto
                alta)
              </Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="energy"
                  min={1}
                  max={10}
                  step={1}
                  value={[mentalEnergy]}
                  onValueChange={(value) => setMentalEnergy(value[0])}
                  disabled={isReadOnly}
                  className="flex-1"
                />
                <span className="text-2xl font-bold w-12 text-center">
                  {mentalEnergy}
                </span>
              </div>
            </div>

            {/* Perceived Difficulty */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="difficulty"
                checked={perceivedDifficultyHigherThanNormal}
                onCheckedChange={(checked) =>
                  setPerceivedDifficultyHigherThanNormal(checked === true)
                }
                disabled={isReadOnly}
              />
              <Label
                htmlFor="difficulty"
                className="text-sm font-normal cursor-pointer"
              >
                Gli allenamenti sono stati più difficili del normale
              </Label>
            </div>

            {/* Main Obstacles */}
            <div className="space-y-3">
              <Label>
                Quali sono stati i principali ostacoli questa settimana?
              </Label>
              <div className="space-y-2">
                {[
                  { value: "time", label: "Mancanza di tempo" },
                  { value: "work", label: "Lavoro" },
                  { value: "fatigue", label: "Stanchezza" },
                  { value: "other", label: "Altro" },
                ].map((obstacle) => (
                  <div
                    key={obstacle.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={obstacle.value}
                      checked={mainObstacles.includes(
                        obstacle.value as "time" | "work" | "fatigue" | "other"
                      )}
                      onCheckedChange={() =>
                        handleObstacleToggle(
                          obstacle.value as
                            | "time"
                            | "work"
                            | "fatigue"
                            | "other"
                        )
                      }
                      disabled={isReadOnly}
                    />
                    <Label
                      htmlFor={obstacle.value}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {obstacle.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Note aggiuntive (opzionale)</Label>
              <Textarea
                id="notes"
                placeholder="Aggiungi eventuali note o commenti..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isReadOnly}
                rows={4}
              />
            </div>

            {/* Coach Notes (if reviewed) */}
            {checkIn.reviewed && checkIn.coachNotes && (
              <div className="p-4 bg-muted rounded-lg">
                <Label className="text-sm font-semibold mb-2 block">
                  Note del Coach:
                </Label>
                <p className="text-sm whitespace-pre-wrap">
                  {checkIn.coachNotes}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onBack}>
                {isReadOnly ? "Chiudi" : "Annulla"}
              </Button>
              {!isReadOnly && (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isSubmitting ? "Invio..." : "Completa Check-in"}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
