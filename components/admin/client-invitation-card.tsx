"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Copy,
  RefreshCw,
  Mail,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import {
  getClientInvitationAction,
  regenerateClientInvitationAction,
} from "@/app/actions/clients";

interface ClientInvitationCardProps {
  clientId: string;
  clientEmail: string;
  isActivated: boolean;
}

export function ClientInvitationCard({
  clientId,
  clientEmail,
  isActivated,
}: ClientInvitationCardProps) {
  const [invitation, setInvitation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [inviteUrl, setInviteUrl] = useState("");

  useEffect(() => {
    loadInvitation();
  }, [clientId]);

  const loadInvitation = async () => {
    try {
      const inv = await getClientInvitationAction(clientId);
      setInvitation(inv);

      if (inv && inv.token) {
        const baseUrl = window.location.origin;
        setInviteUrl(`${baseUrl}/invito/${inv.token}`);
      }
    } catch (error) {
      console.error("Error loading invitation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (inviteUrl) {
      navigator.clipboard.writeText(inviteUrl);
      toast.success("Link copiato negli appunti");
    }
  };

  const handleRegenerateInvitation = async () => {
    setIsRegenerating(true);
    try {
      const result = await regenerateClientInvitationAction(clientId);

      if (result.success && result.inviteUrl) {
        setInviteUrl(result.inviteUrl);
        toast.success("Nuovo invito generato con successo");
        await loadInvitation();
      }
    } catch (error: any) {
      toast.error(error.message || "Errore durante la generazione dell'invito");
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSendEmail = () => {
    // TODO: Implement email sending
    toast.info("Funzionalità invio email in sviluppo");
  };

  if (isActivated) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <CardTitle>Account Attivato</CardTitle>
          </div>
          <CardDescription>
            Il cliente ha completato la registrazione e può accedere al portale
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Invito Cliente</CardTitle>
          <CardDescription>Caricamento...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const isExpired = invitation && new Date(invitation.expiresAt) < new Date();
  const isUsed = invitation?.usedAt;
  const isInvalid = !invitation?.isValid;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Invito Cliente</CardTitle>
            <CardDescription>
              Link di registrazione per {clientEmail}
            </CardDescription>
          </div>
          {invitation && (
            <div className="flex items-center gap-2 text-sm">
              {isUsed ? (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Utilizzato</span>
                </div>
              ) : isExpired ? (
                <div className="flex items-center gap-1 text-destructive">
                  <XCircle className="h-4 w-4" />
                  <span>Scaduto</span>
                </div>
              ) : isInvalid ? (
                <div className="flex items-center gap-1 text-destructive">
                  <XCircle className="h-4 w-4" />
                  <span>Non valido</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    Scade il{" "}
                    {new Date(invitation.expiresAt).toLocaleDateString("it-IT")}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {invitation && !isUsed && !isExpired && !isInvalid ? (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Link di Invito</label>
              <div className="flex gap-2">
                <Input
                  value={inviteUrl}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  size="icon"
                  title="Copia link"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Invia questo link al cliente per completare la registrazione
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSendEmail}
                variant="outline"
                className="flex-1"
                disabled
              >
                <Mail className="mr-2 h-4 w-4" />
                Invia via Email
              </Button>
              <Button
                onClick={handleRegenerateInvitation}
                variant="outline"
                disabled={isRegenerating}
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${
                    isRegenerating ? "animate-spin" : ""
                  }`}
                />
                Rigenera
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
              {isUsed ? (
                <p>
                  L&apos;invito è stato utilizzato. Il cliente ha completato la
                  registrazione.
                </p>
              ) : isExpired || isInvalid ? (
                <p>
                  L&apos;invito non è più valido. Genera un nuovo invito per
                  permettere al cliente di registrarsi.
                </p>
              ) : (
                <p>
                  Nessun invito attivo trovato. Genera un invito per permettere
                  al cliente di registrarsi.
                </p>
              )}
            </div>

            <Button
              onClick={handleRegenerateInvitation}
              disabled={isRegenerating}
              className="w-full"
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${
                  isRegenerating ? "animate-spin" : ""
                }`}
              />
              {isRegenerating
                ? "Generazione in corso..."
                : "Genera Nuovo Invito"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
