import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Award,
  GraduationCap,
  Target,
  TrendingUp,
  Users,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Video Background - UX Optimized */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background - Image fallback with video overlay */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-bg.jpg')" }}
        />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="/hero-bg.jpg"
        >
          <source src="/hero_video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 z-10" />

        <div className="container mx-auto px-4 relative z-20 text-white">
          {/* Left Column - Main Content */}
          <div className="text-center lg:text-left">
            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-2 text-white max-w-4xl">
              Trasforma il tuo corpo con un metodo scientifico
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-3xl text-white leading-relaxed">
              Programmi personalizzati di ipertrofia e ricomposizione corporea.
            </p>

            {/* Trust Bar */}
            <div className="flex flex-wrap gap-6 text-sm my-10  justify-center lg:justify-start">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="h-5 w-5 text-[#f6f5f4]" />
                </div>
                <div>
                  <p className="font-semibold">Laurea in Fisioterapia</p>
                  <p className="text-sm text-gray-300">
                    Universidad Arturo Michelena
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Award className="h-5 w-5 text-[#f6f5f4]" />
                </div>
                <div>
                  <p className="font-semibold">Certificazione EREPS</p>
                  <p className="text-sm text-gray-300">
                    Personal trainer europeo certificato EREPS
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Target className="h-5 w-5 text-[#f6f5f4]" />
                </div>
                <div>
                  <p className="font-semibold">Allenamenti mirati</p>
                  <p className="text-sm text-gray-300">
                    Programmi personalizzati di ipertrofia e ricomposizione
                    corporea.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/servizi">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-7 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:text-white"
                >
                  Scopri i Servizi
                </Button>
              </Link>
              <Link href="/contatti">
                <Button
                  size="lg"
                  className="text-lg px-8 py-7 shadow-2xl transition-all hover:scale-105 group bg-[#f6f5f4] text-primary hover:bg-primary hover:text-white"
                >
                  Consulenza Gratuita
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <div className="flex flex-col items-center gap-2 text-white/80">
            <span className="text-sm font-medium">Scopri di più</span>
            <ChevronDown className="h-6 w-6" />
          </div>
        </div>
      </section>

      {/* About Section with Image */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center  mx-auto">
            {/* Image Column */}
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/costanza-profile1.jpg"
                  alt="Costanza Spinelli Personal Trainer"
                  className="w-full h-full object-cover"
                  width={500}
                  height={500}
                />
              </div>
            </div>

            {/* Content Column */}
            <div>
              <h2 className="text-4xl font-bold mb-6">Chi Sono</h2>
              <p className="text-xl text-muted-foreground mb-6">
                Costanza Spinelli - Personal Trainer Certificata con background
                in Fisioterapia
              </p>

              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">
                      Laurea in Fisioterapia
                    </h3>
                    <p className="text-muted-foreground">
                      Universidad Arturo Michelena - Conoscenza approfondita di
                      anatomia e biomeccanica con approccio scientifico
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">
                      Certificazione EREPS
                    </h3>
                    <p className="text-muted-foreground">
                      Riconoscimento europeo per Personal Trainer professionisti
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">
                      Specializzazione Ipertrofia
                    </h3>
                    <p className="text-muted-foreground">
                      Programmazione avanzata per massimizzare la crescita
                      muscolare
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">
                      Ricomposizione Corporea e Valutazione posturale
                    </h3>
                    <p className="text-muted-foreground">
                      Strategie per perdere grasso e costruire muscolo
                      simultaneamente, con analisi posturale per prevenire
                      infortuni
                    </p>
                  </div>
                </div>
              </div>

              <Link href="/chi-sono">
                <Button size="lg">Scopri di Più su di Me</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Il Mio Approccio Section - Clean Timeline Design */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Il Mio Approccio
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Un percorso strutturato in 3 fasi per garantire risultati concreti
              e duraturi
            </p>
          </div>

          {/* Timeline - 3 Steps */}
          <div className="relative max-w-4xl mx-auto mb-20">
            {/* Connecting line - only visible on desktop, positioned at number level */}
            <div className="hidden md:block absolute left-[16.666%] right-[16.666%] top-6 h-0.5 bg-primary/20" />

            <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-3 md:gap-8 md:items-stretch">
              {/* Step 1 */}
              <div className="relative md:pt-0 flex flex-col">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-bold text-2xl shadow-xl mx-auto mb-6 relative z-10 ring-4 ring-white">
                  1
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-primary/10 hover:border-primary/30 group flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 flex items-center justify-center ">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold">Valutazione</h3>
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Analizziamo obiettivi, storia clinica, postura e
                    composizione corporea
                  </p>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-foreground/80">
                        Analisi posturale completa
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-foreground/80">
                        Definizione obiettivi SMART
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-foreground/80">
                        Valutazione composizione corporea
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative md:pt-0 flex flex-col">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-bold text-2xl shadow-xl mx-auto mb-6 relative z-10 ring-4 ring-white">
                  2
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-primary/10 hover:border-primary/30 group flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 flex items-center justify-center ">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold">Programmazione</h3>
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Schede personalizzate basate su evidenze scientifiche e
                    adattate a te
                  </p>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-foreground/80">
                        Metodo evidence-based
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-foreground/80">
                        Progressione graduale e sicura
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-foreground/80">
                        Linee guida nutrizionali
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative md:pt-0 flex flex-col">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-bold text-2xl shadow-xl mx-auto mb-6 relative z-10 ring-4 ring-white">
                  3
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-primary/10 hover:border-primary/30 group flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 flex items-center justify-center ">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold">Monitoraggio</h3>
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Check-in settimanali e aggiustamenti continui per
                    massimizzare i risultati
                  </p>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-foreground/80">
                        Check-in settimanali con foto
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-foreground/80">
                        Supporto continuo via chat
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-foreground/80">
                        Aggiustamenti in tempo reale
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Philosophy Section */}
          <div className="relative overflow-hidden bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-primary/20 max-w-4xl mx-auto">
            {/* Decorative gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />

            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold mb-2">
                La mia filosofia
              </h3>

              <blockquote className="relative mb-6">
                <p className="text-xl md:text-2xl font-medium text-foreground leading-relaxed italic relative z-10">
                  Non esistono scorciatoie, ma solo il metodo giusto applicato
                  con costanza
                </p>
              </blockquote>

              <p className="text-base md:text-lg text-muted-foreground leading-relaxed mt-8">
                Credo fermamente che i risultati duraturi si ottengano
                attraverso un approccio{" "}
                <span className="font-semibold text-foreground">
                  scientifico
                </span>
                ,{" "}
                <span className="font-semibold text-foreground">
                  personalizzato
                </span>{" "}
                e{" "}
                <span className="font-semibold text-foreground">
                  sostenibile
                </span>{" "}
                nel tempo. Il mio obiettivo non è solo farti raggiungere i tuoi
                traguardi, ma darti gli strumenti per mantenerli per sempre.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Redesigned */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-muted/30">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Come Posso Aiutarti
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Scegli il programma più adatto ai tuoi obiettivi. Tutti includono
              supporto completo e coaching online.
            </p>
          </div>

          {/* Services Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Service 1 - Ipertrofia */}
            <div className="relative bg-white rounded-3xl p-8 shadow-lg border-2 border-primary/10 hover:border-primary/30 transition-all hover:shadow-xl group">
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                  <Target className="h-7 w-7 text-white" />
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-3">Ipertrofia Muscolare</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Massimizza la crescita muscolare con programmazione scientifica
                e periodizzazione avanzata
              </p>

              {/* What's Included */}
              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    Schede personalizzate 8-12 settimane
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Progressione programmata</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Check-in settimanali</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Supporto WhatsApp continuo</span>
                </div>
              </div>

              {/* Ideal For */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-primary mb-2">
                  IDEALE PER:
                </p>
                <p className="text-sm text-muted-foreground">
                  Chi vuole aumentare massa muscolare e forza in modo
                  sostenibile
                </p>
              </div>

              <Link href="/contatti" className="block">
                <Button className="w-full group-hover:scale-105 transition-transform">
                  Inizia Ora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Service 2 - Ricomposizione (MOST POPULAR) */}
            <div className="relative bg-white rounded-3xl p-8 shadow-xl border-2 border-primary hover:border-primary transition-all hover:shadow-2xl group lg:scale-105">
              {/* Popular Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-primary/80 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                PIÙ POPOLARE
              </div>

              <div className="flex items-start justify-between mb-6 mt-2">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                  <TrendingUp className="h-7 w-7 text-white" />
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-3">
                Ricomposizione Corporea
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Perdi grasso e costruisci muscolo simultaneamente con strategie
                integrate
              </p>

              {/* What's Included */}
              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Analisi composizione corporea</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    Linee guida nutrizionali personalizzate
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Check-in con foto progressi</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Aggiustamenti in tempo reale</span>
                </div>
              </div>

              {/* Ideal For */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-primary mb-2">
                  IDEALE PER:
                </p>
                <p className="text-sm text-muted-foreground">
                  Chi vuole migliorare estetica e composizione corporea completa
                </p>
              </div>

              <Link href="/contatti" className="block">
                <Button className="w-full bg-primary hover:bg-primary/90 group-hover:scale-105 transition-transform">
                  Inizia Ora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Service 3 - Forza & Performance */}
            <div className="relative bg-white rounded-3xl p-8 shadow-lg border-2 border-primary/10 hover:border-primary/30 transition-all hover:shadow-xl group">
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                  <Award className="h-7 w-7 text-white" />
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-3">Forza & Performance</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Migliora forza, potenza e performance atletica con
                programmazione specifica
              </p>

              {/* What's Included */}
              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    Programmazione forza specifica
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Test di valutazione periodici</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Analisi tecnica esercizi</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Supporto continuo</span>
                </div>
              </div>

              {/* Ideal For */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-primary mb-2">
                  IDEALE PER:
                </p>
                <p className="text-sm text-muted-foreground">
                  Atleti e chi vuole massimizzare forza e prestazioni
                </p>
              </div>

              <Link href="/contatti" className="block">
                <Button className="w-full group-hover:scale-105 transition-transform">
                  Inizia Ora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-primary/10 mb-16">
            <h3 className="text-3xl font-bold text-center mb-8">
              Confronta i Programmi
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-primary/20">
                    <th className="text-left py-4 px-4 font-bold">
                      Caratteristica
                    </th>
                    <th className="text-center py-4 px-4 font-bold">
                      Ipertrofia
                    </th>
                    <th className="text-center py-4 px-4 font-bold bg-primary/5">
                      Ricomposizione
                    </th>
                    <th className="text-center py-4 px-4 font-bold">Forza</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-border">
                    <td className="py-4 px-4">Schede personalizzate</td>
                    <td className="text-center py-4 px-4">
                      <CheckCircle2 className="h-5 w-5 text-primary mx-auto" />
                    </td>
                    <td className="text-center py-4 px-4 bg-primary/5">
                      <CheckCircle2 className="h-5 w-5 text-primary mx-auto" />
                    </td>
                    <td className="text-center py-4 px-4">
                      <CheckCircle2 className="h-5 w-5 text-primary mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-4 px-4">Linee guida nutrizionali</td>
                    <td className="text-center py-4 px-4 text-muted-foreground">
                      Base
                    </td>
                    <td className="text-center py-4 px-4 bg-primary/5">
                      <CheckCircle2 className="h-5 w-5 text-primary mx-auto" />
                    </td>
                    <td className="text-center py-4 px-4 text-muted-foreground">
                      Base
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-4 px-4">Check-in settimanali</td>
                    <td className="text-center py-4 px-4">
                      <CheckCircle2 className="h-5 w-5 text-primary mx-auto" />
                    </td>
                    <td className="text-center py-4 px-4 bg-primary/5">
                      <CheckCircle2 className="h-5 w-5 text-primary mx-auto" />
                    </td>
                    <td className="text-center py-4 px-4">
                      <CheckCircle2 className="h-5 w-5 text-primary mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-4 px-4">Analisi composizione corporea</td>
                    <td className="text-center py-4 px-4 text-muted-foreground">
                      -
                    </td>
                    <td className="text-center py-4 px-4 bg-primary/5">
                      <CheckCircle2 className="h-5 w-5 text-primary mx-auto" />
                    </td>
                    <td className="text-center py-4 px-4 text-muted-foreground">
                      -
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-4 px-4">Supporto WhatsApp</td>
                    <td className="text-center py-4 px-4">
                      <CheckCircle2 className="h-5 w-5 text-primary mx-auto" />
                    </td>
                    <td className="text-center py-4 px-4 bg-primary/5">
                      <CheckCircle2 className="h-5 w-5 text-primary mx-auto" />
                    </td>
                    <td className="text-center py-4 px-4">
                      <CheckCircle2 className="h-5 w-5 text-primary mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4">Durata minima</td>
                    <td className="text-center py-4 px-4 text-muted-foreground">
                      8 settimane
                    </td>
                    <td className="text-center py-4 px-4 bg-primary/5 text-muted-foreground">
                      12 settimane
                    </td>
                    <td className="text-center py-4 px-4 text-muted-foreground">
                      8 settimane
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-center mb-8">
              Domande Frequenti
            </h3>
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-md border border-primary/10">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary">?</span>
                  </div>
                  Come funziona il coaching online?
                </h4>
                <p className="text-muted-foreground text-sm pl-8">
                  Ricevi le tue schede tramite app, comunichiamo via WhatsApp
                  per check-in settimanali, e ti seguo costantemente per
                  aggiustamenti in tempo reale.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md border border-primary/10">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary">?</span>
                  </div>
                  Posso cambiare programma durante il percorso?
                </h4>
                <p className="text-muted-foreground text-sm pl-8">
                  Assolutamente sì. Il programma si adatta ai tuoi progressi e
                  obiettivi che possono evolvere nel tempo.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md border border-primary/10">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary">?</span>
                  </div>
                  Quanto tempo ci vuole per vedere risultati?
                </h4>
                <p className="text-muted-foreground text-sm pl-8">
                  I primi cambiamenti sono visibili dopo 4-6 settimane.
                  Risultati significativi richiedono 12-16 settimane di
                  costanza.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Pronto a Trasformare il Tuo Corpo?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Prenota ora la tua consulenza gratuita. Analizzeremo insieme i tuoi
            obiettivi e creeremo il piano perfetto per te.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contatti">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-6 w-full sm:w-auto"
              >
                Richiedi Consulenza Gratuita
              </Button>
            </Link>
            <Link href="/chi-sono">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 w-full sm:w-auto bg-white/10 hover:bg-white/20 border-white/30"
              >
                Scopri di Più
              </Button>
            </Link>
          </div>

          <div className="mt-12 text-sm opacity-75">
            <p>
              ✓ Nessun impegno richiesto • ✓ Consulenza 100% gratuita • ✓
              Risposta entro 24 ore
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
