/* eslint-disable @typescript-eslint/no-explicit-any */
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
      router.push(`/admin/clienti/${created.client.id}`);
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
          <CardTitle>Anamnesi Generale</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stile di vita */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Stile di Vita</Label>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="lifestyle.occupation" className="text-sm">
                  Lavoro
                </Label>
                <Input
                  id="lifestyle.occupation"
                  {...register("lifestyle.occupation")}
                  placeholder="Professione"
                />
              </div>
              <div>
                <Label htmlFor="lifestyle.activityLevel" className="text-sm">
                  Livello Attività
                </Label>
                <Select
                  value={watch("lifestyle.activityLevel") || ""}
                  onValueChange={(value) =>
                    setValue("lifestyle.activityLevel", value as any)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentario</SelectItem>
                    <SelectItem value="lightly_active">
                      Leggermente Attivo
                    </SelectItem>
                    <SelectItem value="moderately_active">
                      Moderatamente Attivo
                    </SelectItem>
                    <SelectItem value="very_active">Molto Attivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Anamnesi Clinica */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Anamnesi Clinica</Label>

            <div className="space-y-2">
              <Label className="text-sm">Assume farmaci?</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    {...register("medicalHistory.medications")}
                    value="Si"
                  />
                  <span className="text-sm">Sì</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    {...register("medicalHistory.medications")}
                    value="No"
                  />
                  <span className="text-sm">No</span>
                </label>
              </div>
              {watch("medicalHistory.medications") === "Si" && (
                <Input
                  placeholder="Specificare farmaci..."
                  {...register("medicalHistory.medications")}
                />
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Fuma?</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    {...register("lifestyle.smoker")}
                    value="yes"
                  />
                  <span className="text-sm">Sì</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    {...register("lifestyle.smoker")}
                    value="no"
                  />
                  <span className="text-sm">No</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    {...register("lifestyle.smoker")}
                    value="ex"
                  />
                  <span className="text-sm">Ex fumatore</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Alcol?</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    {...register("lifestyle.alcoholConsumption")}
                    value="never"
                  />
                  <span className="text-sm">No</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    {...register("lifestyle.alcoholConsumption")}
                    value="occasional"
                  />
                  <span className="text-sm">Occasionale</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Disturbi sistema nervoso?</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register("medicalHistory.currentConditions")}
                    value="disturbi_nervosi"
                  />
                  <span className="text-sm">Sì</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Patologie diagnosticate?</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" value="artrite" />
                  <span className="text-sm">Artrite</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" value="osteoporosi" />
                  <span className="text-sm">Osteoporosi</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" value="artrosi" />
                  <span className="text-sm">Artrosi</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" value="rachitismo" />
                  <span className="text-sm">Rachitismo</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" value="frattura" />
                  <span className="text-sm">Frattura</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" value="fibromialgia" />
                  <span className="text-sm">Fibromialgia</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" value="ipertensione" />
                  <span className="text-sm">Ipertensione arteriosa</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" value="asma" />
                  <span className="text-sm">Asma</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" value="diabete" />
                  <span className="text-sm">Diabete</span>
                </label>
              </div>
              <Textarea
                placeholder="Altre patologie..."
                {...register("medicalHistory.currentConditions")}
                rows={2}
                className="mt-2"
              />
            </div>
          </div>

          {/* Lesioni sistema muscolo-scheletrico */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              Lesioni del Sistema Muscolo-Scheletrico
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" value="frattura" />
                <span className="text-sm">Frattura</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" value="meniscopatia" />
                <span className="text-sm">Meniscopatia</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" value="distorsione" />
                <span className="text-sm">Distorsione</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" value="tendinite" />
                <span className="text-sm">Tendinite</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" value="dislocazione" />
                <span className="text-sm">Dislocazione</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" value="capsulite" />
                <span className="text-sm">Capsulite</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" value="borsite" />
                <span className="text-sm">Borsite</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" value="ernia" />
                <span className="text-sm">Ernia discale</span>
              </label>
            </div>
            <Textarea
              placeholder="Indicare la zona della lesione e dettagli..."
              {...register("medicalHistory.injuries")}
              rows={2}
              className="mt-2"
            />
          </div>

          {/* Note aggiuntive */}
          <div>
            <Label htmlFor="medicalHistory.limitations">
              Note e Limitazioni
            </Label>
            <Textarea
              id="medicalHistory.limitations"
              {...register("medicalHistory.limitations")}
              placeholder="Limitazioni fisiche, dolori ricorrenti, altre informazioni rilevanti..."
              rows={3}
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
