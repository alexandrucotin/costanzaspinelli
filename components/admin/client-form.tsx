"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Client,
  ClientSchema,
  goalLabelsClient,
  genderLabels,
  activityLevelLabels,
} from "@/lib/types-client";
import { createClientAction } from "@/app/actions/clients";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

interface ClientFormProps {
  client?: Client;
}

export function ClientForm({ client }: ClientFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      ClientSchema.omit({
        id: true,
        createdAt: true,
        updatedAt: true,
        measurements: true,
        assignedPlanIds: true,
      })
    ),
    defaultValues: client || {
      fullName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: undefined,
      profilePhoto: "",
      currentWeight: undefined,
      height: undefined,
      bodyFatPercentage: undefined,
      leanMass: undefined,
      primaryGoal: "general_fitness",
      targetWeight: undefined,
      targetDate: "",
      goalNotes: "",
      status: "active",
      firstAssessmentDate: new Date().toISOString().split("T")[0],
      generalNotes: "",
      privateNotes: "",
      medicalHistory: {
        currentConditions: "",
        pastConditions: "",
        medications: "",
        allergies: "",
        surgeries: "",
        injuries: "",
        limitations: "",
        recurringPain: "",
      },
    },
  });

  const primaryGoal = watch("primaryGoal");
  const gender = watch("gender");

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const created = await createClientAction(data);
      toast.success("Cliente creato con successo");
      router.push(`/admin/clienti/${created.id}`);
    } catch (error) {
      toast.error("Errore durante la creazione del cliente");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/clienti">
          <Button variant="ghost" size="sm" type="button">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Torna ai clienti
          </Button>
        </Link>
      </div>

      {/* Anagrafica */}
      <Card>
        <CardHeader>
          <CardTitle>Informazioni Anagrafiche</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="fullName">Nome Completo *</Label>
              <Input id="fullName" {...register("fullName")} />
              {errors.fullName && (
                <p className="text-sm text-destructive mt-1">
                  {errors.fullName.message as string}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">
                  {errors.email.message as string}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Telefono</Label>
              <Input id="phone" type="tel" {...register("phone")} />
            </div>

            <div>
              <Label htmlFor="dateOfBirth">Data di Nascita</Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register("dateOfBirth")}
              />
            </div>

            <div>
              <Label htmlFor="gender">Genere</Label>
              <Select
                value={gender}
                onValueChange={(value) => setValue("gender", value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona genere" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(genderLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="firstAssessmentDate">
                Data Prima Valutazione *
              </Label>
              <Input
                id="firstAssessmentDate"
                type="date"
                {...register("firstAssessmentDate")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Anamnesi Medica */}
      <Card>
        <CardHeader>
          <CardTitle>Anamnesi Medica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="medicalHistory.currentConditions">
              Patologie Attuali
            </Label>
            <Textarea
              id="medicalHistory.currentConditions"
              {...register("medicalHistory.currentConditions")}
              placeholder="Es: diabete, ipertensione, problemi cardiaci..."
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="medicalHistory.pastConditions">
              Patologie Passate
            </Label>
            <Textarea
              id="medicalHistory.pastConditions"
              {...register("medicalHistory.pastConditions")}
              placeholder="Malattie o condizioni mediche pregresse..."
              rows={2}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="medicalHistory.medications">
                Farmaci Assunti
              </Label>
              <Textarea
                id="medicalHistory.medications"
                {...register("medicalHistory.medications")}
                placeholder="Elenco farmaci e dosaggi..."
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="medicalHistory.allergies">
                Allergie/Intolleranze
              </Label>
              <Textarea
                id="medicalHistory.allergies"
                {...register("medicalHistory.allergies")}
                placeholder="Allergie alimentari, farmacologiche..."
                rows={2}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="medicalHistory.surgeries">
              Interventi Chirurgici
            </Label>
            <Textarea
              id="medicalHistory.surgeries"
              {...register("medicalHistory.surgeries")}
              placeholder="Operazioni subite con date approssimative..."
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="medicalHistory.injuries">Traumi e Infortuni</Label>
            <Textarea
              id="medicalHistory.injuries"
              {...register("medicalHistory.injuries")}
              placeholder="Infortuni sportivi, incidenti, fratture con dettagli e date..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="medicalHistory.limitations">
              Limitazioni Fisiche
            </Label>
            <Textarea
              id="medicalHistory.limitations"
              {...register("medicalHistory.limitations")}
              placeholder="Problemi articolari, posturali, mobilità ridotta..."
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="medicalHistory.recurringPain">
              Dolori Ricorrenti
            </Label>
            <Textarea
              id="medicalHistory.recurringPain"
              {...register("medicalHistory.recurringPain")}
              placeholder="Zone del corpo con dolore cronico, intensità, frequenza..."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Dati Fisici e Obiettivi */}
      <Card>
        <CardHeader>
          <CardTitle>Dati Fisici e Obiettivi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="currentWeight">Peso Attuale (kg)</Label>
              <Input
                id="currentWeight"
                type="number"
                step="0.1"
                {...register("currentWeight", { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor="height">Altezza (cm)</Label>
              <Input
                id="height"
                type="number"
                {...register("height", { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor="bodyFatPercentage">Massa Grassa (%)</Label>
              <Input
                id="bodyFatPercentage"
                type="number"
                step="0.1"
                {...register("bodyFatPercentage", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="primaryGoal">Obiettivo Primario *</Label>
            <Select
              value={primaryGoal}
              onValueChange={(value) => setValue("primaryGoal", value as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(goalLabelsClient).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="targetWeight">Peso Target (kg)</Label>
              <Input
                id="targetWeight"
                type="number"
                step="0.1"
                {...register("targetWeight", { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor="targetDate">Data Target</Label>
              <Input id="targetDate" type="date" {...register("targetDate")} />
            </div>
          </div>

          <div>
            <Label htmlFor="goalNotes">Note Obiettivi</Label>
            <Textarea
              id="goalNotes"
              {...register("goalNotes")}
              placeholder="Dettagli specifici sugli obiettivi del cliente..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Note */}
      <Card>
        <CardHeader>
          <CardTitle>Note</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="generalNotes">Note Generali</Label>
            <Textarea
              id="generalNotes"
              {...register("generalNotes")}
              placeholder="Note visibili al cliente..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="privateNotes">Note Private</Label>
            <Textarea
              id="privateNotes"
              {...register("privateNotes")}
              placeholder="Note riservate, visibili solo a te..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Link href="/admin/clienti">
          <Button variant="outline" type="button">
            Annulla
          </Button>
        </Link>
        <Button type="submit" disabled={isSubmitting}>
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? "Salvataggio..." : "Salva Cliente"}
        </Button>
      </div>
    </form>
  );
}
