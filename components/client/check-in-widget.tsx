"use client";

import { CheckIn } from "@/lib/types-checkin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import Link from "next/link";

interface CheckInWidgetProps {
  checkIns: CheckIn[];
}

export function CheckInWidget({ checkIns }: CheckInWidgetProps) {
  const pendingCheckIns = checkIns.filter(
    (c) => c.status === "pending" || c.status === "overdue"
  );

  const nextCheckIn = pendingCheckIns[0];

  if (pendingCheckIns.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Check-in
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Tutti i check-in sono completati! 🎉
          </p>
          <Link href="/cliente/check-ins">
            <Button variant="outline" size="sm" className="mt-4 gap-2">
              Visualizza Storico
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={nextCheckIn.status === "overdue" ? "border-destructive" : ""}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {nextCheckIn.status === "overdue" ? (
            <AlertCircle className="h-5 w-5 text-destructive" />
          ) : (
            <Calendar className="h-5 w-5" />
          )}
          Check-in da Completare
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Check-in Settimanale
            </p>
            <p className="text-sm font-medium">
              {format(new Date(nextCheckIn.scheduledAt), "EEEE d MMMM", {
                locale: it,
              })}
            </p>
          </div>
          <Badge
            variant={
              nextCheckIn.status === "overdue" ? "destructive" : "outline"
            }
          >
            {nextCheckIn.status === "overdue" ? "In ritardo" : "Da completare"}
          </Badge>
        </div>

        {pendingCheckIns.length > 1 && (
          <p className="text-xs text-muted-foreground">
            + altri {pendingCheckIns.length - 1} check-in da completare
          </p>
        )}

        <Link href="/cliente/check-ins">
          <Button className="w-full gap-2">
            Completa Check-in
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
