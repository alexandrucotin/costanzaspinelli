"use client";

import { useState } from "react";
import { Client, goalLabelsClient, statusLabels } from "@/lib/types-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, User, Calendar, Target, Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteClientAction } from "@/app/actions/clients";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ClientsListProps {
  initialClients: Client[];
}

export function ClientsList({ initialClients }: ClientsListProps) {
  const router = useRouter();
  const [clients, setClients] = useState(initialClients);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [goalFilter, setGoalFilter] = useState<string>("all");

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || client.status === statusFilter;

    const matchesGoal =
      goalFilter === "all" || client.primaryGoal === goalFilter;

    return matchesSearch && matchesStatus && matchesGoal;
  });

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Sei sicuro di voler eliminare il cliente "${name}"?`)) return;

    try {
      await deleteClientAction(id);
      setClients(clients.filter((c) => c.id !== id));
      toast.success("Cliente eliminato");
    } catch {
      toast.error("Errore durante l'eliminazione");
    }
  };

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

  const getStatusColor = (status: Client["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-700 border-green-200";
      case "paused":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-200";
      case "completed":
        return "bg-gray-500/10 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con azioni */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca per nome o email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Link href="/admin/clienti/nuovo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuovo Cliente
          </Button>
        </Link>
      </div>

      {/* Filtri */}
      <div className="flex gap-4">
        <div className="w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Stato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti gli stati</SelectItem>
              <SelectItem value="active">Attivo</SelectItem>
              <SelectItem value="paused">In Pausa</SelectItem>
              <SelectItem value="completed">Concluso</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-48">
          <Select value={goalFilter} onValueChange={setGoalFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Obiettivo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti gli obiettivi</SelectItem>
              {Object.entries(goalLabelsClient).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {(searchQuery || statusFilter !== "all" || goalFilter !== "all") && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("all");
              setGoalFilter("all");
            }}
          >
            Reset filtri
          </Button>
        )}
      </div>

      {/* Contatore risultati */}
      <div className="text-sm text-muted-foreground">
        {filteredClients.length}{" "}
        {filteredClients.length === 1 ? "cliente" : "clienti"}{" "}
        {searchQuery || statusFilter !== "all" || goalFilter !== "all"
          ? "trovati"
          : "totali"}
      </div>

      {/* Lista clienti */}
      {filteredClients.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {clients.length === 0 ? (
              <>
                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="mb-2">Nessun cliente ancora</p>
                <p className="text-sm">
                  Inizia aggiungendo il tuo primo cliente!
                </p>
              </>
            ) : (
              <>
                <p className="mb-2">Nessun cliente trovato</p>
                <p className="text-sm">
                  Prova a modificare i filtri di ricerca
                </p>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client) => {
            const age = calculateAge(client.dateOfBirth);

            return (
              <Card
                key={client.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/admin/clienti/${client.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {client.profilePhoto ? (
                        <img
                          src={client.profilePhoto}
                          alt={client.fullName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-lg">
                          {client.fullName}
                        </h3>
                        {age && (
                          <p className="text-sm text-muted-foreground">
                            {age} anni
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={getStatusColor(client.status)}
                        variant="outline"
                      >
                        {statusLabels[client.status]}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(client.id, client.fullName);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Target className="h-4 w-4" />
                      <span>{goalLabelsClient[client.primaryGoal]}</span>
                    </div>

                    {client.currentWeight && client.targetWeight && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>
                          {client.currentWeight}kg → {client.targetWeight}kg
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Dal{" "}
                        {new Date(
                          client.firstAssessmentDate
                        ).toLocaleDateString("it-IT")}
                      </span>
                    </div>

                    {client.assignedPlanIds.length > 0 && (
                      <div className="pt-2 border-t">
                        <Badge variant="secondary">
                          {client.assignedPlanIds.length}{" "}
                          {client.assignedPlanIds.length === 1
                            ? "scheda"
                            : "schede"}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
