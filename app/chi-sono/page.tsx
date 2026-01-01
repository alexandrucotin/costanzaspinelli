import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Award,
  GraduationCap,
  Heart,
  Target,
  TrendingUp,
  Users,
  CheckCircle2,
} from "lucide-react";

export default function ChiSonoPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h1 className="text-5xl font-bold mb-6">Ciao, sono Costanza</h1>
              <p className="text-xl text-muted-foreground mb-6">
                Personal Trainer certificata con background in Fisioterapia,
                specializzata in ipertrofia muscolare e ricomposizione corporea.
              </p>
              <p className="text-lg mb-8">
                La mia missione è aiutarti a trasformare il tuo corpo attraverso
                programmi scientifici, personalizzati e sostenibili nel tempo.
              </p>
              <Link href="/contatti">
                <Button size="lg">Inizia il Tuo Percorso</Button>
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center">
                <div className="text-center p-8">
                  <Users className="h-24 w-24 mx-auto mb-4 text-primary" />
                  <p className="text-lg font-semibold">Foto Professionale</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    [Inserire foto di Costanza]
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Background & Credentials */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Il Mio Percorso</h2>
            <p className="text-xl text-muted-foreground">
              Formazione accademica e certificazioni professionali
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">
                      Laurea in Fisioterapia
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Universidad Central de Venezuela
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  La mia formazione in fisioterapia mi ha dato una comprensione
                  profonda di anatomia, biomeccanica e fisiologia del movimento.
                  Questo background medico-scientifico è la base di ogni
                  programma che creo.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">
                      Certificazione EREPs
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      European Register of Exercise Professionals
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  Certificazione riconosciuta a livello europeo che attesta le
                  mie competenze professionali come Personal Trainer, garantendo
                  standard elevati di qualità e sicurezza.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Specializations */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 md:p-12">
            <h3 className="text-3xl font-bold mb-8 text-center">
              Specializzazioni
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-lg mb-1">
                    Ipertrofia Muscolare
                  </h4>
                  <p className="text-muted-foreground">
                    Programmazione avanzata per massimizzare la crescita
                    muscolare con tecniche evidence-based
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-lg mb-1">
                    Ricomposizione Corporea
                  </h4>
                  <p className="text-muted-foreground">
                    Strategie integrate per perdere grasso e costruire muscolo
                    simultaneamente
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-lg mb-1">
                    Allenamento Funzionale
                  </h4>
                  <p className="text-muted-foreground">
                    Movimenti che migliorano la qualità della vita quotidiana e
                    la performance atletica
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-lg mb-1">
                    Recupero Post-Infortunio
                  </h4>
                  <p className="text-muted-foreground">
                    Background in fisioterapia per gestire limitazioni e
                    prevenire infortuni
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 px-4 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">La Mia Filosofia</h2>
          </div>

          <div className="space-y-8">
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">
                      Approccio Personalizzato
                    </h3>
                    <p className="text-muted-foreground text-lg">
                      Non esistono programmi universali. Ogni persona è unica e
                      merita un piano studiato su misura, considerando livello
                      di partenza, obiettivi, preferenze e stile di vita.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">
                      Scienza e Risultati
                    </h3>
                    <p className="text-muted-foreground text-lg">
                      Ogni decisione è basata su evidenze scientifiche e dati
                      concreti. Monitoro i progressi costantemente per
                      ottimizzare il programma e garantire risultati misurabili.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">
                      Sostenibilità nel Tempo
                    </h3>
                    <p className="text-muted-foreground text-lg">
                      Il mio obiettivo non è solo farti raggiungere i risultati,
                      ma darti gli strumenti per mantenerli. Creo abitudini
                      sostenibili che durano per tutta la vita.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold mb-6">Pronto a Iniziare?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Prenota la tua consulenza gratuita e scopri come posso aiutarti a
            raggiungere i tuoi obiettivi
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contatti">
              <Button size="lg" className="w-full sm:w-auto">
                Richiedi Consulenza Gratuita
              </Button>
            </Link>
            <Link href="/servizi">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Scopri i Servizi
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
