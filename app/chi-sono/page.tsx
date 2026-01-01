import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Award,
  GraduationCap,
  Heart,
  Target,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";

export default function ChiSonoPage() {
  return (
    <div className="min-h-screen mt-[81px]">
      {/* Hero Section - Personal Story */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />

        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-block mb-6">
              <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 ring-primary/20 shadow-xl">
                <Image
                  src="/costanza-profile2.DNG"
                  alt="Costanza Spinelli"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Ciao, sono Costanza
            </h1>

            <p className="text-2xl md:text-3xl text-muted-foreground mb-8 font-medium">
              Da fisioterapista a Personal Trainer specializzata
            </p>

            <div className="max-w-3xl mx-auto space-y-6 text-lg leading-relaxed">
              <p>
                Il mio percorso nel mondo del fitness è iniziato con la{" "}
                <span className="font-semibold text-foreground">
                  laurea in Fisioterapia
                </span>{" "}
                in Venezuela. Lavorare con pazienti in riabilitazione mi ha
                fatto capire quanto il movimento corretto e la programmazione
                scientifica possano trasformare non solo il corpo, ma la vita
                delle persone.
              </p>

              <p>
                Questa passione mi ha portato a specializzarmi come{" "}
                <span className="font-semibold text-foreground">
                  Personal Trainer certificata EREPs
                </span>
                , combinando la mia conoscenza medica con le più avanzate
                tecniche di allenamento per ipertrofia e ricomposizione
                corporea.
              </p>

              <p className="text-xl font-medium text-primary">
                Oggi aiuto persone come te a raggiungere obiettivi che pensavano
                impossibili, attraverso programmi basati su scienza,
                personalizzazione e sostenibilità.
              </p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-primary/10">
              <div className="text-4xl font-bold text-primary mb-2">100+</div>
              <div className="text-sm text-muted-foreground">
                Clienti Seguiti
              </div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-primary/10">
              <div className="text-4xl font-bold text-primary mb-2">5+</div>
              <div className="text-sm text-muted-foreground">
                Anni Esperienza
              </div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-primary/10">
              <div className="text-4xl font-bold text-primary mb-2">24h</div>
              <div className="text-sm text-muted-foreground">
                Tempo Risposta
              </div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-primary/10">
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-sm text-muted-foreground">
                Personalizzato
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials Timeline */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Formazione & Certificazioni
            </h2>
            <p className="text-xl text-muted-foreground">
              Un percorso di studio continuo per offrirti il meglio
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/20" />

            {/* Timeline Items */}
            <div className="space-y-12">
              {/* Item 1 */}
              <div className="relative flex items-start gap-8 md:gap-12">
                <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-primary ring-4 ring-white shadow-lg -translate-x-1/2 mt-2" />

                <div className="md:w-1/2 md:pr-12 md:text-right ml-20 md:ml-0">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-primary/20">
                    <div className="flex items-center gap-3 mb-3 md:justify-end">
                      <GraduationCap className="h-8 w-8 text-primary" />
                      <h3 className="text-2xl font-bold">
                        Laurea in Fisioterapia
                      </h3>
                    </div>
                    <p className="text-muted-foreground font-medium mb-2">
                      Universidad Arturo Michelena, Venezuela
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Formazione medico-scientifica in anatomia, biomeccanica e
                      fisiologia del movimento. La base per comprendere il corpo
                      umano a 360°.
                    </p>
                  </div>
                </div>

                <div className="hidden md:block md:w-1/2" />
              </div>

              {/* Item 2 */}
              <div className="relative flex items-start gap-8 md:gap-12">
                <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-primary ring-4 ring-white shadow-lg -translate-x-1/2 mt-2" />

                <div className="hidden md:block md:w-1/2" />

                <div className="md:w-1/2 md:pl-12 ml-20 md:ml-0">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-primary/20">
                    <div className="flex items-center gap-3 mb-3">
                      <Award className="h-8 w-8 text-primary" />
                      <h3 className="text-2xl font-bold">
                        Certificazione EREPs
                      </h3>
                    </div>
                    <p className="text-muted-foreground font-medium mb-2">
                      European Register of Exercise Professionals
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Certificazione europea che garantisce competenze
                      professionali di alto livello e standard di qualità
                      riconosciuti internazionalmente.
                    </p>
                  </div>
                </div>
              </div>

              {/* Item 3 */}
              <div className="relative flex items-start gap-8 md:gap-12">
                <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-primary ring-4 ring-white shadow-lg -translate-x-1/2 mt-2" />

                <div className="md:w-1/2 md:pr-12 md:text-right ml-20 md:ml-0">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-primary/20">
                    <div className="flex items-center gap-3 mb-3 md:justify-end">
                      <Target className="h-8 w-8 text-primary" />
                      <h3 className="text-2xl font-bold">Specializzazioni</h3>
                    </div>
                    <p className="text-muted-foreground font-medium mb-2">
                      Formazione continua
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Corsi avanzati in ipertrofia muscolare, ricomposizione
                      corporea, programmazione evidence-based e nutrizione
                      sportiva.
                    </p>
                  </div>
                </div>

                <div className="hidden md:block md:w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Me - Differentiators */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Perché Scegliere Me
            </h2>
            <p className="text-xl text-muted-foreground">
              Cosa mi rende diversa dagli altri personal trainer
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Differentiator 1 */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-primary/10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-6 shadow-lg">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Background Medico</h3>
              <p className="text-muted-foreground leading-relaxed">
                Non sono solo una PT, ma una{" "}
                <span className="font-semibold text-foreground">
                  fisioterapista laureata
                </span>
                . Conosco anatomia, biomeccanica e fisiologia a livello medico.
                Questo mi permette di creare programmi sicuri ed efficaci,
                prevenendo infortuni.
              </p>
            </div>

            {/* Differentiator 2 */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-primary/10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-6 shadow-lg">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Approccio Scientifico</h3>
              <p className="text-muted-foreground leading-relaxed">
                Zero improvvisazione. Ogni decisione è basata su{" "}
                <span className="font-semibold text-foreground">
                  evidenze scientifiche
                </span>{" "}
                e dati concreti. Monitoro i tuoi progressi costantemente per
                ottimizzare il programma e garantire risultati misurabili.
              </p>
            </div>

            {/* Differentiator 3 */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-primary/10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-6 shadow-lg">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Supporto Continuo</h3>
              <p className="text-muted-foreground leading-relaxed">
                Non ti lascio mai solo.{" "}
                <span className="font-semibold text-foreground">
                  Rispondo entro 24h
                </span>
                , ti seguo con check-in settimanali e aggiusto il programma in
                tempo reale. Sei seguito come se fossi il mio unico cliente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Specializations Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Le Mie Specializzazioni
            </h2>
            <p className="text-xl text-muted-foreground">
              Aree in cui posso aiutarti a eccellere
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="group bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 hover:shadow-xl transition-all border-2 border-transparent hover:border-primary/20">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Ipertrofia Muscolare</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Programmazione avanzata per massimizzare la crescita muscolare.
                Utilizzo tecniche evidence-based, periodizzazione e progressive
                overload per garantire guadagni costanti e duraturi.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 hover:shadow-xl transition-all border-2 border-transparent hover:border-primary/20">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Ricomposizione Corporea</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Strategie integrate per perdere grasso e costruire muscolo
                simultaneamente. Combino allenamento mirato, linee guida
                nutrizionali e monitoraggio costante per trasformare la tua
                composizione corporea.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 hover:shadow-xl transition-all border-2 border-transparent hover:border-primary/20">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Forza & Performance</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Programmazione specifica per aumentare forza massimale e
                potenza. Ideale per atleti o chi vuole migliorare le proprie
                performance nei grandi esercizi fondamentali.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 hover:shadow-xl transition-all border-2 border-transparent hover:border-primary/20">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Recupero & Prevenzione</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Grazie al mio background in fisioterapia, posso gestire
                limitazioni fisiche, recupero post-infortunio e creare programmi
                che prevengono problematiche mantenendo alta l&apos;efficacia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Compelling */}
      <section className="relative py-32 px-4 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="/hero-bg.jpg"
            alt="CTA background"
            fill
            className="object-cover"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-primary/70" />
        </div>

        {/* Content */}
        <div className="container mx-auto max-w-4xl text-center relative z-10 text-white">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Sei Pronto a Trasformare il Tuo Corpo?
          </h2>
          <p className="text-xl md:text-2xl mb-4 leading-relaxed">
            Prenota ora la tua{" "}
            <span className="font-bold">consulenza gratuita</span>
          </p>
          <p className="text-lg mb-12 text-white/90 max-w-2xl mx-auto">
            Analizzeremo insieme i tuoi obiettivi, valuterò la tua situazione
            attuale e ti mostrerò esattamente come posso aiutarti a raggiungere
            i risultati che desideri.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/contatti">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-7 w-full sm:w-auto shadow-2xl hover:scale-105 transition-transform"
              >
                Richiedi Consulenza Gratuita
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/servizi">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-7 w-full sm:w-auto bg-white/10 hover:bg-white/20 border-white/30 text-white"
              >
                Scopri i Programmi
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-white/80">
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
    </div>
  );
}
