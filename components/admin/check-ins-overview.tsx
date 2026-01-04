"use client";

import { useState } from "react";
import { CheckInWithClient } from "@/lib/types-checkin";
import { Client } from "@/lib/types-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, CheckCircle2, Clock, AlertCircle, Eye } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { CheckInDetailDialog } from "./check-in-detail-dialog";

interface CheckInsOverviewProps {
  checkIns: CheckInWithClient[];
  clients: Client[];
}

export function CheckInsOverview({ checkIns, clients }: CheckInsOverviewProps) {
  const [selectedClient, setSelectedClient] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedCheckIn, setSelectedCheckIn] =
    useState<CheckInWithClient | null>(null);

  // Filter check-ins
  const filteredCheckIns = checkIns.filter((checkIn) => {
    const matchesClient =
      selectedClient === "all" || checkIn.clientId === selectedClient;
    const matchesStatus =
      selectedStatus === "all" || checkIn.status === selectedStatus;
    return matchesClient && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: checkIns.length,
    pending: checkIns.filter((c) => c.status === "pending").length,
    overdue: checkIns.filter((c) => c.status === "overdue").length,
    submitted: checkIns.filter((c) => c.status === "submitted").length,
    reviewed: checkIns.filter((c) => c.status === "reviewed").length,
  };

  const getStatusBadge = (status: CheckInWithClient["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            Pending
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

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Totale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              In Ritardo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {stats.overdue}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completati
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.submitted}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Revisionati
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {stats.reviewed}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger>
                  <SelectValue placeholder="Tutti i clienti" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti i clienti</SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Tutti gli stati" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti gli stati</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">In ritardo</SelectItem>
                  <SelectItem value="submitted">Completati</SelectItem>
                  <SelectItem value="reviewed">Revisionati</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Check-ins Table */}
      <Card>
        <CardHeader>
          <CardTitle>Check-in ({filteredCheckIns.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCheckIns.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nessun check-in trovato</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Data Prevista</TableHead>
                  <TableHead>Data Completamento</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCheckIns.map((checkIn) => (
                  <TableRow key={checkIn.id}>
                    <TableCell className="font-medium">
                      {checkIn.client.fullName}
                    </TableCell>
                    <TableCell>
                      {format(new Date(checkIn.scheduledAt), "d MMM yyyy", {
                        locale: it,
                      })}
                    </TableCell>
                    <TableCell>
                      {checkIn.submittedAt
                        ? format(new Date(checkIn.submittedAt), "d MMM yyyy", {
                            locale: it,
                          })
                        : "-"}
                    </TableCell>
                    <TableCell>{getStatusBadge(checkIn.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCheckIn(checkIn)}
                        className="gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Visualizza
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Check-in Detail Dialog */}
      {selectedCheckIn && (
        <CheckInDetailDialog
          checkIn={selectedCheckIn}
          open={!!selectedCheckIn}
          onOpenChange={(open) => !open && setSelectedCheckIn(null)}
        />
      )}
    </div>
  );
}
