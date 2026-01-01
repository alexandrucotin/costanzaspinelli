"use client";

import { Client, goalLabelsClient, genderLabels } from "@/lib/types-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User, Mail, Phone, Calendar, Target } from "lucide-react";
import Link from "next/link";

interface ClientProfileProps {
  client: Client;
}

export function ClientProfile({ client }: ClientProfileProps) {
  const calculateAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const calculateBMI = () => {
    if (!client.currentWeight || !client.height) return null;
    const heightInMeters = client.height / 100;
    return (client.currentWeight / (heightInMeters * heightInMeters)).toFixed(
      1
    );
  };

  const age = calculateAge(client.dateOfBirth);
  const bmi = calculateBMI();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/cliente/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Torna alla Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              {client.profilePhoto ? (
                <img
                  src={client.profilePhoto}
                  alt={client.fullName}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-12 w-12 text-primary" />
                </div>
              )}

              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2">{client.fullName}</h1>
                <div className="space-y-2 text-sm text-muted-foreground">
                  {age && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {age} anni
                      {client.gender && ` • ${genderLabels[client.gender]}`}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {client.email}
                  </div>
                  {client.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {client.phone}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Physical Data */}
        <Card>
          <CardHeader>
            <CardTitle>Dati Fisici</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {client.currentWeight && (
                <div>
                  <p className="text-sm text-muted-foreground">Peso</p>
                  <p className="text-lg font-semibold">
                    {client.currentWeight} kg
                  </p>
                </div>
              )}
              {client.height && (
                <div>
                  <p className="text-sm text-muted-foreground">Altezza</p>
                  <p className="text-lg font-semibold">{client.height} cm</p>
                </div>
              )}
              {bmi && (
                <div>
                  <p className="text-sm text-muted-foreground">BMI</p>
                  <p className="text-lg font-semibold">{bmi}</p>
                </div>
              )}
              {client.bodyFatPercentage && (
                <div>
                  <p className="text-sm text-muted-foreground">Massa Grassa</p>
                  <p className="text-lg font-semibold">
                    {client.bodyFatPercentage}%
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />I Tuoi Obiettivi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Obiettivo Primario
              </p>
              <p className="text-lg font-semibold">
                {goalLabelsClient[client.primaryGoal]}
              </p>
            </div>

            {(client.targetWeight || client.targetDate) && (
              <div className="grid grid-cols-2 gap-4">
                {client.targetWeight && (
                  <div>
                    <p className="text-sm text-muted-foreground">Peso Target</p>
                    <p className="font-semibold">{client.targetWeight} kg</p>
                  </div>
                )}
                {client.targetDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Data Target</p>
                    <p className="font-semibold">
                      {new Date(client.targetDate).toLocaleDateString("it-IT")}
                    </p>
                  </div>
                )}
              </div>
            )}

            {client.goalNotes && (
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  {client.goalNotes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* General Notes */}
        {client.generalNotes && (
          <Card>
            <CardHeader>
              <CardTitle>Note</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {client.generalNotes}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
