"use client";

import { useState } from "react";
import { ProgressEntry } from "@/lib/types-checkin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { AddProgressEntryDialog } from "./add-progress-entry-dialog";
import { ProgressChart } from "./progress-chart";
import Image from "next/image";

interface ProgressTrackerProps {
  entries: ProgressEntry[];
  targetWeight?: number;
}

export function ProgressTracker({
  entries,
  targetWeight,
}: ProgressTrackerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<ProgressEntry | null>(
    null
  );

  // Calculate weight trend
  const weightsWithDates = entries
    .filter((e) => e.weight)
    .map((e) => ({ weight: e.weight!, date: new Date(e.createdAt) }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const latestWeight = weightsWithDates[weightsWithDates.length - 1]?.weight;
  const previousWeight = weightsWithDates[weightsWithDates.length - 2]?.weight;
  const weightChange =
    latestWeight && previousWeight ? latestWeight - previousWeight : null;

  const getTrendIcon = () => {
    if (!weightChange) return <Minus className="h-4 w-4" />;
    if (weightChange > 0)
      return <TrendingUp className="h-4 w-4 text-orange-500" />;
    if (weightChange < 0)
      return <TrendingDown className="h-4 w-4 text-green-500" />;
    return <Minus className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Peso Attuale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {latestWeight ? `${latestWeight.toFixed(1)} kg` : "N/A"}
            </div>
            {weightChange !== null && (
              <div className="flex items-center gap-1 mt-2 text-sm">
                {getTrendIcon()}
                <span
                  className={
                    weightChange > 0
                      ? "text-orange-500"
                      : weightChange < 0
                      ? "text-green-500"
                      : ""
                  }
                >
                  {weightChange > 0 ? "+" : ""}
                  {weightChange.toFixed(1)} kg
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Totale Voci
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{entries.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Foto Caricate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {entries.reduce((sum, e) => sum + (e.photos?.length || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weight Chart */}
      {weightsWithDates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Andamento Peso</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressChart
              data={weightsWithDates}
              targetWeight={targetWeight}
            />
          </CardContent>
        </Card>
      )}

      {/* Add Entry Button */}
      <div className="flex justify-end">
        <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Aggiungi Voce di Progresso
        </Button>
      </div>

      {/* Progress Entries List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Storico</h2>
        {entries.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Nessuna voce di progresso ancora. Inizia aggiungendone una!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <Card
                key={entry.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {format(new Date(entry.createdAt), "d MMMM yyyy", {
                        locale: it,
                      })}
                    </CardTitle>
                    {entry.weight && (
                      <span className="text-2xl font-bold">
                        {entry.weight.toFixed(1)} kg
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {entry.notes && (
                    <div className="text-sm text-muted-foreground">
                      <p className="whitespace-pre-wrap">{entry.notes}</p>
                    </div>
                  )}

                  {entry.photos && entry.photos.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Foto:</p>
                      <div className="grid grid-cols-3 gap-4">
                        {entry.photos.map((photo) => (
                          <div key={photo.id} className="space-y-2">
                            <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                              <Image
                                src={photo.imageUrl}
                                alt={`Foto ${photo.type}`}
                                fill
                                className="object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => setSelectedEntry(entry)}
                              />
                            </div>
                            <p className="text-xs text-center text-muted-foreground capitalize">
                              {photo.type === "front" && "Frontale"}
                              {photo.type === "side" && "Laterale"}
                              {photo.type === "back" && "Posteriore"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Progress Entry Dialog */}
      <AddProgressEntryDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />

      {/* Photo Viewer Modal (optional - can be implemented later) */}
      {selectedEntry && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedEntry(null)}
        >
          <div className="max-w-4xl w-full grid grid-cols-3 gap-4">
            {selectedEntry.photos?.map((photo) => (
              <div
                key={photo.id}
                className="relative aspect-[3/4] rounded-lg overflow-hidden"
              >
                <Image
                  src={photo.imageUrl}
                  alt={`Foto ${photo.type}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
