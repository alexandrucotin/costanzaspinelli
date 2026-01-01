import { Button } from "@/components/ui/button";
import {
  Check,
  Target,
  TrendingUp,
  Award,
  ArrowRight,
  Users,
  MessageCircle,
  CheckCircle2,
  Star,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ServiziPage() {
  return (
    <div className="min-h-screen mt-[81px]">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Programmi di Allenamento
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Scegli il programma più adatto ai tuoi obiettivi. Tutti includono
              coaching online personalizzato e supporto continuo.
            </p>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="font-medium">Consulenza gratuita</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="font-medium">Risposta in 24h</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="font-medium">100% personalizzato</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section with Pricing */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Program 1 - Ipertrofia */}
            <div className="relative bg-white rounded-3xl p-8 shadow-lg border-2 border-primary/10 hover:border-primary/30 transition-all hover:shadow-xl group">
              <div className="flex items-center mb-6 gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                  <Target className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Ipertrofia Muscolare</h3>
              </div>

              {/* Pricing */}
              <div className="mb-6 pb-6 border-b border-border">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-primary">€85</span>
                  <span className="text-muted-foreground">/mese</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Durata minima: 3 mesi
                </p>
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                Massimizza la crescita muscolare con programmazione scientifica
                e periodizzazione avanzata
              </p>

              {/* What's Included */}
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    Schede personalizzate 8-12 settimane
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Progressione programmata</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Check-in settimanali</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Supporto WhatsApp continuo</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Video tutorial esercizi</span>
                </div>
              </div>

              <Link href="/contatti" className="block">
                <Button className="w-full group-hover:scale-105 transition-transform">
                  Inizia Ora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Program 2 - Ricomposizione (MOST POPULAR) */}
            <div className="relative bg-white rounded-3xl p-8 shadow-xl border-2 border-primary hover:border-primary transition-all hover:shadow-2xl group lg:scale-105">
              {/* Popular Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                PIÙ POPOLARE
              </div>

              <div className="flex items-center mb-6 gap-4 mt-2">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                  <TrendingUp className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Ricomposizione Corporea</h3>
              </div>

              {/* Pricing */}
              <div className="mb-6 pb-6 border-b border-border">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-primary">€100</span>
                  <span className="text-muted-foreground">/mese</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Durata minima: 3 mesi
                </p>
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                Perdi grasso e costruisci muscolo simultaneamente con strategie
                integrate
              </p>

              {/* What's Included */}
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    Tutto del programma Ipertrofia
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    Analisi tecnica degli esercizi
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    Tracking composizione corporea
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Check-in bi-settimanali</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Correzioni tecniche continue</span>
                </div>
              </div>

              <Link href="/contatti" className="block">
                <Button className="w-full group-hover:scale-105 transition-transform">
                  Inizia Ora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Program 3 - Forza & Performance */}
            <div className="relative bg-white rounded-3xl p-8 shadow-lg border-2 border-primary/10 hover:border-primary/30 transition-all hover:shadow-xl group">
              <div className="flex items-center mb-6 gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                  <Award className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Forza & Performance</h3>
              </div>

              {/* Pricing */}
              <div className="mb-6 pb-6 border-b border-border">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-primary">€90</span>
                  <span className="text-muted-foreground">/mese</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Durata minima: 3 mesi
                </p>
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                Migliora forza, potenza e performance atletica con
                programmazione specifica
              </p>

              {/* What's Included */}
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Programmazione forza avanzata</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Periodizzazione specifica</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Analisi tecnica esercizi</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Check-in settimanali</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Supporto continuo</span>
                </div>
              </div>

              <Link href="/contatti" className="block">
                <Button className="w-full group-hover:scale-105 transition-transform">
                  Inizia Ora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Process */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Come Funziona
            </h2>
            <p className="text-xl text-muted-foreground">
              Un processo semplice e trasparente per iniziare il tuo percorso
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-bold text-primary mb-1">
                    STEP 1
                  </div>
                  <h3 className="text-xl font-bold mb-2">Contatto Iniziale</h3>
                  <p className="text-muted-foreground">
                    Compila il form di contatto o scrivimi su Instagram. Ti
                    risponderò entro 24 ore per fissare la consulenza gratuita.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-bold text-primary mb-1">
                    STEP 2
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    Consulenza Gratuita
                  </h3>
                  <p className="text-muted-foreground">
                    Videocall di 30-45 minuti dove analizziamo obiettivi, storia
                    clinica, esperienza e stile di vita. Scelgo il programma più
                    adatto a te.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-bold text-primary mb-1">
                    STEP 3
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    Creazione Programma
                  </h3>
                  <p className="text-muted-foreground">
                    Creo la tua scheda personalizzata con video tutorial per
                    ogni esercizio. Ricevi tutto in formato digitale
                    professionale.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-bold text-primary mb-1">
                    STEP 4
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    Inizio & Monitoraggio
                  </h3>
                  <p className="text-muted-foreground">
                    Inizi il programma e ti seguo costantemente con check-in,
                    aggiustamenti e supporto continuo per massimizzare i
                    risultati.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Domande Frequenti
            </h2>
            <p className="text-xl text-muted-foreground">
              Tutto quello che devi sapere prima di iniziare
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-muted/30 rounded-2xl p-6 border border-primary/10">
              <h3 className="text-xl font-bold mb-3">
                Posso cambiare programma durante il percorso?
              </h3>
              <p className="text-muted-foreground">
                Assolutamente sì. Il programma si adatta ai tuoi progressi e
                obiettivi che possono evolvere nel tempo. Durante i check-in
                valutiamo insieme se serve modificare l&apos;approccio.
              </p>
            </div>

            <div className="bg-muted/30 rounded-2xl p-6 border border-primary/10">
              <h3 className="text-xl font-bold mb-3">
                Come funziona il supporto online?
              </h3>
              <p className="text-muted-foreground">
                Ricevi le schede tramite app/PDF, comunichiamo via WhatsApp per
                domande quotidiane, e facciamo check-in settimanali (o
                bi-settimanali) con foto e misurazioni per aggiustare il
                programma.
              </p>
            </div>

            <div className="bg-muted/30 rounded-2xl p-6 border border-primary/10">
              <h3 className="text-xl font-bold mb-3">
                Quanto tempo ci vuole per vedere risultati?
              </h3>
              <p className="text-muted-foreground">
                I primi cambiamenti sono visibili dopo 4-6 settimane
                (miglioramento forza, sensazione muscolare). Risultati estetici
                significativi richiedono 12-16 settimane di costanza. La
                trasformazione è un percorso, non una sprint.
              </p>
            </div>

            <div className="bg-muted/30 rounded-2xl p-6 border border-primary/10">
              <h3 className="text-xl font-bold mb-3">
                Devo allenarmi tutti i giorni?
              </h3>
              <p className="text-muted-foreground">
                No. I programmi prevedono 3-5 allenamenti a settimana (in base
                al programma scelto e alla tua disponibilità). Il recupero è
                fondamentale quanto l&apos;allenamento per i risultati.
              </p>
            </div>

            <div className="bg-muted/30 rounded-2xl p-6 border border-primary/10">
              <h3 className="text-xl font-bold mb-3">
                Cosa succede se devo saltare allenamenti?
              </h3>
              <p className="text-muted-foreground">
                La vita è imprevedibile. Adattiamo il programma alla tua realtà.
                L&apos;importante è la costanza nel lungo periodo, non la
                perfezione assoluta. Ti aiuto a trovare soluzioni pratiche.
              </p>
            </div>

            <div className="bg-muted/30 rounded-2xl p-6 border border-primary/10">
              <h3 className="text-xl font-bold mb-3">
                Serve attrezzatura specifica?
              </h3>
              <p className="text-muted-foreground">
                I programmi sono pensati per palestre attrezzate. Se ti alleni a
                casa o hai limitazioni, posso adattare gli esercizi
                all&apos;attrezzatura disponibile. Parliamone in consulenza.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero-bg.jpg"
            alt="CTA background"
            fill
            className="object-cover"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#161612]/90 via-[#161612]/85 to-[#161612]/80" />
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10 text-white">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Pronto a Iniziare la Tua Trasformazione?
          </h2>
          <p className="text-xl md:text-2xl mb-4 leading-relaxed">
            Prenota ora la tua{" "}
            <span className="font-bold">consulenza gratuita</span> senza impegno
          </p>
          <p className="text-lg mb-12 text-white/90 max-w-2xl mx-auto">
            Ti risponderò entro 24 ore e fisseremo una call per capire insieme
            quale programma è perfetto per te.
          </p>

          <Link href="/contatti">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-7 shadow-2xl hover:scale-105 transition-transform"
            >
              Richiedi Consulenza Gratuita
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>

          <div className="flex flex-wrap justify-center gap-8 text-sm text-white/80 mt-8">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>Nessun impegno</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>Risposta in 24h</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>100% personalizzato</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Cosa Dicono i Miei Clienti
            </h2>
            <p className="text-xl text-muted-foreground">
              Risultati reali da persone reali
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 italic">
                &ldquo;In 4 mesi ho perso 8kg di grasso e guadagnato massa
                muscolare. Costanza mi ha seguito passo passo, rispondendo
                sempre alle mie domande. Professionalità e competenza al
                top!&rdquo;
              </p>
              <div className="font-bold">Marco R.</div>
              <div className="text-sm text-muted-foreground">
                Ricomposizione Corporea
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 italic">
                &ldquo;Finalmente ho trovato una PT che capisce davvero di
                biomeccanica. Il suo background in fisioterapia fa la
                differenza. Zero infortuni e risultati costanti.&rdquo;
              </p>
              <div className="font-bold">Laura M.</div>
              <div className="text-sm text-muted-foreground">
                Ipertrofia Muscolare
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 italic">
                &ldquo;Ho aumentato tutti i miei massimali del 20-30% in 3 mesi.
                La programmazione è scientifica e i risultati parlano chiaro.
                Consigliatissima!&rdquo;
              </p>
              <div className="font-bold">Andrea P.</div>
              <div className="text-sm text-muted-foreground">
                Forza & Performance
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
