import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, Dumbbell, Tag } from "lucide-react";

export default function ImpostazioniPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Impostazioni</h1>
        <p className="text-muted-foreground mt-2">
          Gestisci attrezzi, gruppi muscolari e categorie per gli esercizi
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Link href="/admin/impostazioni/attrezzi">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Wrench className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Attrezzi</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Gestisci gli attrezzi disponibili per gli esercizi (bilanciere,
                manubri, TRX, etc.)
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/impostazioni/gruppi-muscolari">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Dumbbell className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Gruppi Muscolari</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Gestisci i gruppi muscolari target (petto, schiena, gambe, etc.)
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/impostazioni/categorie">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Tag className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Categorie</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Gestisci le categorie di esercizi (forza, ipertrofia, cardio,
                etc.)
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
