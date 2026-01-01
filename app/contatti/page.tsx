import { ContactForm } from "@/components/contact-form";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  MessageCircle,
  Shield,
  Mail,
  Instagram,
  Calendar,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ContattiPage() {
  return (
    <div className="min-h-screen mt-[81px]">
      {/* Hero Section - Enhanced */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="/hero-bg.jpg"
            alt="Contact hero background"
            fill
            className="object-cover"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/90 to-primary/85" />
        </div>

        <div className="container mx-auto max-w-5xl relative z-10 text-white">
          <div className="text-center mb-12">
            {/* Urgency Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-6 py-3 mb-6 border border-white/30">
              <Zap className="h-5 w-5 text-yellow-300" />
              <span className="font-bold text-sm">
                Solo 3 posti disponibili questo mese
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Prenota la Tua Consulenza Gratuita
            </h1>
            <p className="text-xl md:text-2xl mb-8 leading-relaxed max-w-3xl mx-auto">
              Videocall di 30-45 minuti dove analizziamo i tuoi obiettivi e creo
              il piano perfetto per te.{" "}
              <span className="font-bold">Zero impegno, zero costi.</span>
            </p>

            {/* Trust Indicators - Enhanced */}
            <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <Clock className="h-7 w-7 text-white" />
                </div>
                <p className="font-bold text-sm">Risposta in 24h</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <p className="font-bold text-sm">100% Gratuita</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <MessageCircle className="h-7 w-7 text-white" />
                </div>
                <p className="font-bold text-sm">Nessun Impegno</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <Calendar className="h-7 w-7 text-white" />
                </div>
                <p className="font-bold text-sm">Flessibilità Orari</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Left Column - Form */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Compila il Form
                </h2>
                <p className="text-lg text-muted-foreground">
                  Ti risponderò entro 24 ore per fissare la tua consulenza
                  gratuita
                </p>
              </div>
              <ContactForm />

              {/* What Happens Next */}
              <div className="mt-8 bg-primary/5 rounded-2xl p-6 border border-primary/10">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Cosa Succede Dopo?
                </h3>
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span className="font-bold text-primary">1.</span>
                    <span>Ricevi conferma via email entro 24h</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-primary">2.</span>
                    <span>Fissiamo insieme data e ora per la videocall</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-primary">3.</span>
                    <span>
                      Analizziamo obiettivi e creo il tuo piano personalizzato
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-primary">4.</span>
                    <span>Decidi tu se iniziare - zero pressione!</span>
                  </li>
                </ol>
              </div>
            </div>

            {/* Right Column - Info & Benefits */}
            <div className="space-y-6">
              {/* Social Proof */}
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <span className="font-bold">5.0/5.0</span>
                </div>
                <p className="text-sm italic mb-4">
                  &ldquo;La consulenza gratuita mi ha convinto subito. Costanza
                  è professionale, preparata e ti fa sentire a tuo agio. Dopo 3
                  mesi ho già visto risultati incredibili!&rdquo;
                </p>
                <div className="font-bold text-sm">Sara T.</div>
                <div className="text-xs text-muted-foreground">
                  Cliente da 3 mesi
                </div>
              </div>

              {/* What to Expect */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-primary/10">
                <h3 className="text-xl font-bold mb-4">
                  Durante la Consulenza
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-bold text-primary">1</span>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Analisi Completa</p>
                      <p className="text-muted-foreground text-sm">
                        Obiettivi, storia clinica, esperienza, disponibilità e
                        stile di vita
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-bold text-primary">2</span>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">
                        Valutazione Professionale
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Ti consiglio il programma più adatto e spiego come
                        funziona
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-bold text-primary">3</span>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Q&A Aperto</p>
                      <p className="text-muted-foreground text-sm">
                        Rispondo a tutte le tue domande senza fretta
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alternative Contact Methods */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-primary/20">
                <h3 className="text-xl font-bold mb-4">
                  Preferisci Contattarmi Direttamente?
                </h3>
                <div className="space-y-3">
                  <a
                    href="mailto:costanzaspinelli.pt@gmail.com"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-semibold text-primary">
                        costanzaspinelli.pt@gmail.com
                      </p>
                    </div>
                  </a>
                  <a
                    href="https://instagram.com/costanzaspinelli.pt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Instagram className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Instagram</p>
                      <p className="font-semibold text-primary">
                        @costanzaspinelli.pt
                      </p>
                    </div>
                  </a>
                </div>
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  Rispondo a tutti i messaggi entro 24 ore
                </p>
              </div>

              {/* Availability */}
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/10">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="h-6 w-6 text-primary" />
                  <h4 className="font-bold">Disponibilità Consulenze</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lun - Ven:</span>
                    <span className="font-semibold">9:00 - 20:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sabato:</span>
                    <span className="font-semibold">10:00 - 16:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Domenica:</span>
                    <span className="font-semibold">Chiuso</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats & Social Proof */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Unisciti a Chi Ha Già Iniziato
            </h2>
            <p className="text-xl text-muted-foreground">
              Risultati reali da persone che hanno fatto il primo passo
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
              <div className="text-4xl font-bold text-primary mb-2">100+</div>
              <div className="text-sm text-muted-foreground">
                Clienti Trasformati
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
              <div className="text-4xl font-bold text-primary mb-2">5.0</div>
              <div className="text-sm text-muted-foreground">Rating Medio</div>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
              <div className="text-4xl font-bold text-primary mb-2">24h</div>
              <div className="text-sm text-muted-foreground">
                Tempo Risposta
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-sm text-muted-foreground">
                Clienti Soddisfatti
              </div>
            </div>
          </div>

          {/* Quick FAQ */}
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-center">
              Hai Ancora Dubbi?
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold mb-1">
                    La consulenza è davvero gratuita?
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Sì, al 100%. È il mio modo di conoscerti e capire se posso
                    aiutarti. Zero costi nascosti.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold mb-1">
                    Devo decidere subito dopo la consulenza?
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Assolutamente no. Prenditi tutto il tempo che ti serve. Zero
                    pressione commerciale.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold mb-1">
                    Come si svolge la consulenza?
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Videocall di 30-45 minuti su Zoom/Google Meet. Comoda, da
                    casa tua, quando vuoi tu.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Pronto a Fare il Primo Passo?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Compila il form sopra o contattami direttamente. Ti risponderò entro
            24 ore.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#form" className="block">
              <Button size="lg" className="text-lg px-8 py-7 w-full sm:w-auto">
                Torna al Form
              </Button>
            </a>
            <Link href="/servizi">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-7 w-full sm:w-auto"
              >
                Scopri i Programmi
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
