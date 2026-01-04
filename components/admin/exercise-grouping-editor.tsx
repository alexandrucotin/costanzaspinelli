"use client";

import { useState } from "react";
import { ExerciseGrouping } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Link2, X } from "lucide-react";

interface ExerciseGroupingEditorProps {
  grouping?: ExerciseGrouping;
  onChange: (grouping: ExerciseGrouping | undefined) => void;
}

const groupingTypeLabels = {
  single: "Singolo",
  superset: "Superset",
  triset: "Triset",
  circuit: "Circuit",
  dropset: "Dropset",
};

const groupingTypeDescriptions = {
  single: "Esercizio eseguito singolarmente",
  superset: "Due esercizi consecutivi senza riposo (A1, A2)",
  triset: "Tre esercizi consecutivi senza riposo (A1, A2, A3)",
  circuit: "Circuito di esercizi multipli",
  dropset: "Serie con riduzione progressiva del carico",
};

export function ExerciseGroupingEditor({
  grouping,
  onChange,
}: ExerciseGroupingEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localGrouping, setLocalGrouping] = useState<ExerciseGrouping>(
    grouping || {
      type: "single",
      groupId: "A",
      order: 1,
    }
  );

  const handleSave = () => {
    if (localGrouping.type === "single") {
      onChange(undefined);
    } else {
      onChange(localGrouping);
    }
    setIsOpen(false);
  };

  const handleRemove = () => {
    onChange(undefined);
    setIsOpen(false);
  };

  const hasGrouping = grouping && grouping.type !== "single";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={hasGrouping ? "default" : "outline"}
          size="sm"
          className="gap-2"
        >
          <Link2 className="h-4 w-4" />
          {hasGrouping ? (
            <>
              {groupingTypeLabels[grouping.type]}
              <Badge variant="secondary" className="ml-1">
                {grouping.groupId}
                {grouping.order}
              </Badge>
            </>
          ) : (
            "Aggiungi Grouping"
          )}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Grouping Esercizio</DialogTitle>
          <DialogDescription>
            Raggruppa esercizi per superset, circuit o altre tecniche avanzate
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo di Grouping</Label>
            <Select
              value={localGrouping.type}
              onValueChange={(value: ExerciseGrouping["type"]) =>
                setLocalGrouping({ ...localGrouping, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(groupingTypeLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{label}</span>
                      <span className="text-xs text-muted-foreground">
                        {
                          groupingTypeDescriptions[
                            key as keyof typeof groupingTypeDescriptions
                          ]
                        }
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {localGrouping.type !== "single" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Gruppo (A, B, C...)</Label>
                  <Select
                    value={localGrouping.groupId}
                    onValueChange={(value) =>
                      setLocalGrouping({ ...localGrouping, groupId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["A", "B", "C", "D", "E", "F"].map((letter) => (
                        <SelectItem key={letter} value={letter}>
                          Gruppo {letter}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Ordine (1, 2, 3...)</Label>
                  <Select
                    value={localGrouping.order.toString()}
                    onValueChange={(value) =>
                      setLocalGrouping({
                        ...localGrouping,
                        order: parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-sm font-medium mb-1">Risultato:</p>
                <Badge variant="outline" className="text-base">
                  {localGrouping.groupId}
                  {localGrouping.order}
                </Badge>
                <p className="text-xs text-muted-foreground mt-2">
                  Questo esercizio sarà etichettato come{" "}
                  <strong>
                    {localGrouping.groupId}
                    {localGrouping.order}
                  </strong>{" "}
                  nel PDF e nella visualizzazione
                </p>
              </div>
            </>
          )}

          <div className="flex justify-between gap-2 pt-4">
            {hasGrouping && (
              <Button variant="destructive" onClick={handleRemove}>
                <X className="h-4 w-4 mr-2" />
                Rimuovi Grouping
              </Button>
            )}
            <div className="flex gap-2 ml-auto">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Annulla
              </Button>
              <Button onClick={handleSave}>Salva</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
