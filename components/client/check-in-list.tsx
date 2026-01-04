"use client";

import { useState } from "react";
import { CheckIn } from "@/lib/types-checkin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { WeeklyCheckInForm } from "./weekly-checkin-form";

interface CheckInListProps {
  checkIns: CheckIn[];
}

export function CheckInList({ checkIns }: CheckInListProps) {
  const [selectedCheckIn, setSelectedCheckIn] = useState<CheckIn | null>(null);

  const getStatusBadge = (status: CheckIn["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            Da completare
          </Badge>
        );
      case "overdue":
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            In ritardo
          </Badge>
        );
      case "submitted":
        return (
          <Badge variant="secondary" className="gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Completato
          </Badge>
        );
      case "reviewed":
        return (
          <Badge variant="default" className="gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Revisionato
          </Badge>
        );
    }
  };

  const pendingCheckIns = checkIns.filter(
    (c) => c.status === "pending" || c.status === "overdue"
  );
  const completedCheckIns = checkIns.filter(
    (c) => c.status === "submitted" || c.status === "reviewed"
  );

  if (selectedCheckIn) {
    return (
      <WeeklyCheckInForm
        checkIn={selectedCheckIn}
        onBack={() => setSelectedCheckIn(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Pending Check-ins */}
      {pendingCheckIns.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Da Completare</h2>
          <div className="space-y-3">
            {pendingCheckIns.map((checkIn) => (
              <Card
                key={checkIn.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Check-in Settimanale
                    </CardTitle>
                    {getStatusBadge(checkIn.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Previsto per{" "}
                        {format(
                          new Date(checkIn.scheduledAt),
                          "EEEE d MMMM yyyy 'alle' HH:mm",
                          {
                            locale: it,
                          }
                        )}
                      </span>
                    </div>
                    <Button onClick={() => setSelectedCheckIn(checkIn)}>
                      Completa
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Completed Check-ins */}
      {completedCheckIns.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Completati</h2>
          <div className="space-y-3">
            {completedCheckIns.map((checkIn) => (
              <Card key={checkIn.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Check-in Settimanale
                    </CardTitle>
                    {getStatusBadge(checkIn.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Completato il{" "}
                        {checkIn.submittedAt &&
                          format(
                            new Date(checkIn.submittedAt),
                            "d MMMM yyyy 'alle' HH:mm",
                            {
                              locale: it,
                            }
                          )}
                      </span>
                    </div>
                    {checkIn.reviewed && checkIn.coachNotes && (
                      <div className="mt-3 p-3 bg-muted rounded-lg">
                        <p className="font-medium text-sm mb-1">
                          Note del Coach:
                        </p>
                        <p className="text-sm">{checkIn.coachNotes}</p>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCheckIn(checkIn)}
                      className="mt-2"
                    >
                      Visualizza Dettagli
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {checkIns.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">
              Nessun check-in disponibile
            </h3>
            <p className="text-muted-foreground">
              I check-in settimanali verranno generati automaticamente ogni
              domenica
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
