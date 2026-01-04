"use client";

import { useState } from "react";
import { CheckIn, CheckInWithClient } from "@/lib/types-checkin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Eye } from "lucide-react";
import { CheckInDetailDialog } from "./check-in-detail-dialog";

interface ClientCheckInsListProps {
  checkIns: CheckIn[];
  clientName: string;
}

export function ClientCheckInsList({
  checkIns,
  clientName,
}: ClientCheckInsListProps) {
  const [selectedCheckIn, setSelectedCheckIn] = useState<CheckIn | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50">
            In Attesa
          </Badge>
        );
      case "overdue":
        return <Badge variant="destructive">Scaduto</Badge>;
      case "submitted":
        return (
          <Badge variant="default" className="bg-blue-500">
            Completato
          </Badge>
        );
      case "reviewed":
        return (
          <Badge variant="default" className="bg-green-500">
            Revisionato
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "weekly":
        return <Badge variant="secondary">Settimanale</Badge>;
      case "biweekly":
        return <Badge variant="secondary">Bisettimanale</Badge>;
      case "monthly":
        return <Badge variant="secondary">Mensile</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  if (checkIns.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium mb-2">Nessun check-in</h3>
          <p className="text-muted-foreground">
            Non ci sono ancora check-in per questo cliente
          </p>
        </CardContent>
      </Card>
    );
  }

  // Sort by scheduled date (most recent first)
  const sortedCheckIns = [...checkIns].sort(
    (a, b) =>
      new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
  );

  return (
    <>
      <div className="space-y-4">
        {sortedCheckIns.map((checkIn) => (
          <Card key={checkIn.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base">
                    Check-in del{" "}
                    {format(new Date(checkIn.scheduledAt), "d MMMM yyyy", {
                      locale: it,
                    })}
                  </CardTitle>
                  <div className="flex gap-2">
                    {getTypeBadge(checkIn.type)}
                    {getStatusBadge(checkIn.status)}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCheckIn(checkIn)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Visualizza
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Schedulato:</span>
                  <div className="font-medium">
                    {format(new Date(checkIn.scheduledAt), "d MMM yyyy", {
                      locale: it,
                    })}
                  </div>
                </div>
                {checkIn.submittedAt && (
                  <div>
                    <span className="text-muted-foreground">Completato:</span>
                    <div className="font-medium">
                      {format(new Date(checkIn.submittedAt), "d MMM yyyy", {
                        locale: it,
                      })}
                    </div>
                  </div>
                )}
                {checkIn.reviewed && checkIn.reviewedAt && (
                  <div>
                    <span className="text-muted-foreground">Revisionato:</span>
                    <div className="font-medium">
                      {format(new Date(checkIn.reviewedAt), "d MMM yyyy", {
                        locale: it,
                      })}
                    </div>
                  </div>
                )}
                {checkIn.data &&
                  typeof checkIn.data === "object" &&
                  "workoutsCompleted" in checkIn.data && (
                    <div>
                      <span className="text-muted-foreground">
                        Allenamenti:
                      </span>
                      <div className="font-medium">
                        {checkIn.data.workoutsCompleted || 0}/10
                      </div>
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedCheckIn && (
        <CheckInDetailDialog
          checkIn={
            {
              ...selectedCheckIn,
              client: {
                id: selectedCheckIn.clientId,
                fullName: clientName,
                email: "", // Email non necessario per il dialog
              },
            } as CheckInWithClient
          }
          open={!!selectedCheckIn}
          onOpenChange={(open) => !open && setSelectedCheckIn(null)}
        />
      )}
    </>
  );
}
