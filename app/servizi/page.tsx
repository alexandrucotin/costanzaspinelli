import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

export default function ServiziPage() {
  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-4 text-center">I Miei Servizi</h1>
      <p className="text-xl text-muted-foreground mb-12 text-center max-w-2xl mx-auto">
        Scegli il servizio più adatto alle tue esigenze
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Scheda Personalizzata</CardTitle>
            <CardDescription>
              Programma di allenamento su misura
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Analisi obiettivi e livello</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Scheda personalizzata 4-12 settimane</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>
                  Esercizi dettagliati con serie, ripetizioni e recuperi
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>PDF professionale da portare in palestra</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consulenza Online</CardTitle>
            <CardDescription>Supporto a distanza</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Videocall di valutazione iniziale</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Scheda personalizzata</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Check-in settimanali</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Aggiustamenti in base ai progressi</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personal Training</CardTitle>
            <CardDescription>Allenamento in presenza</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Sessioni individuali in palestra</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Correzione tecnica in tempo reale</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Motivazione e supporto costante</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Programmazione personalizzata</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Come Funziona</h2>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Contatto Iniziale</h3>
              <p className="text-muted-foreground">
                Compila il form di contatto o scrivimi direttamente. Ti
                risponderò entro 24 ore.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Consulenza Gratuita
              </h3>
              <p className="text-muted-foreground">
                Parliamo dei tuoi obiettivi, del tuo livello attuale e delle tue
                esigenze.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Creazione Scheda</h3>
              <p className="text-muted-foreground">
                Creo la tua scheda personalizzata basata sulle informazioni
                raccolte.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Inizio Allenamento</h3>
              <p className="text-muted-foreground">
                Ricevi la tua scheda in formato PDF e inizia il tuo percorso
                verso i tuoi obiettivi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
