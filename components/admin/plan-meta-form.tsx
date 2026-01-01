"use client";

import { WorkoutPlan, goalLabels, equipmentLabels } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PlanMetaFormProps {
  data: Partial<WorkoutPlan>;
  onChange: (data: Partial<WorkoutPlan>) => void;
  disabled?: boolean;
}

export function PlanMetaForm({ data, onChange, disabled }: PlanMetaFormProps) {
  const handleChange = (field: keyof WorkoutPlan, value: string | number) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informazioni Scheda</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="title">Titolo Scheda *</Label>
            <Input
              id="title"
              value={data.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              disabled={disabled}
              placeholder="es. Scheda Ipertrofia Principiante"
            />
          </div>

          <div>
            <Label htmlFor="clientName">Nome Cliente *</Label>
            <Input
              id="clientName"
              value={data.clientName || ""}
              onChange={(e) => handleChange("clientName", e.target.value)}
              disabled={disabled}
              placeholder="es. Mario Rossi"
            />
          </div>

          <div>
            <Label htmlFor="goal">Obiettivo *</Label>
            <Select
              value={data.goal}
              onValueChange={(value) => handleChange("goal", value)}
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(goalLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="equipment">Attrezzatura *</Label>
            <Select
              value={data.equipment}
              onValueChange={(value) => handleChange("equipment", value)}
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gym">Palestra</SelectItem>
                <SelectItem value="home">Casa</SelectItem>
                <SelectItem value="both">Entrambi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="durationWeeks">Durata (settimane) *</Label>
            <Input
              id="durationWeeks"
              type="number"
              min="1"
              value={data.durationWeeks || ""}
              onChange={(e) =>
                handleChange("durationWeeks", parseInt(e.target.value) || 1)
              }
              disabled={disabled}
            />
          </div>

          <div>
            <Label htmlFor="frequencyDaysPerWeek">
              Frequenza (giorni/settimana) *
            </Label>
            <Input
              id="frequencyDaysPerWeek"
              type="number"
              min="1"
              max="7"
              value={data.frequencyDaysPerWeek || ""}
              onChange={(e) =>
                handleChange(
                  "frequencyDaysPerWeek",
                  parseInt(e.target.value) || 1
                )
              }
              disabled={disabled}
            />
          </div>

          <div>
            <Label htmlFor="startDate">Data Inizio (opzionale)</Label>
            <Input
              id="startDate"
              type="date"
              value={data.startDate || ""}
              onChange={(e) => handleChange("startDate", e.target.value)}
              disabled={disabled}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Note</Label>
          <Textarea
            id="notes"
            value={data.notes || ""}
            onChange={(e) => handleChange("notes", e.target.value)}
            disabled={disabled}
            placeholder="Note generali sulla scheda..."
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="contraindications">Controindicazioni</Label>
          <Textarea
            id="contraindications"
            value={data.contraindications || ""}
            onChange={(e) => handleChange("contraindications", e.target.value)}
            disabled={disabled}
            placeholder="Eventuali controindicazioni o limitazioni..."
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}
