import { ContactForm } from "@/components/contact-form";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock, MessageCircle, Shield } from "lucide-react";

export default function ContattiPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold mb-6">Inizia il Tuo Percorso</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Richiedi una consulenza gratuita e scopri come posso aiutarti a
            raggiungere i tuoi obiettivi
          </p>

          {/* Trust Indicators */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <p className="font-semibold">Risposta in 24h</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <p className="font-semibold">100% Gratuita</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <p className="font-semibold">Nessun Impegno</p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Left Column - Form */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Richiedi Consulenza</h2>
              <ContactForm />
            </div>

            {/* Right Column - Info & Benefits */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">Cosa Aspettarti</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold mb-1">Analisi Obiettivi</p>
                      <p className="text-muted-foreground text-sm">
                        Discuteremo i tuoi obiettivi, il tuo livello attuale e
                        le tue aspettative
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold mb-1">
                        Valutazione Personalizzata
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Analizzerò la tua situazione e ti consiglierò il
                        percorso più adatto
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold mb-1">Piano d&apos;Azione</p>
                      <p className="text-muted-foreground text-sm">
                        Ti presenterò il programma personalizzato e risponderò a
                        tutte le tue domande
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold mb-1">Zero Pressione</p>
                      <p className="text-muted-foreground text-sm">
                        Nessun impegno richiesto. Deciderai tu se iniziare il
                        percorso insieme
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="border-2 border-primary/20 bg-primary/5">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-4">Contatti Diretti</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Email
                      </p>
                      <a
                        href="mailto:info@costanzaspinelli.com"
                        className="text-primary hover:underline font-semibold"
                      >
                        info@costanzaspinelli.com
                      </a>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        WhatsApp
                      </p>
                      <a
                        href="https://wa.me/393123456789"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-semibold"
                      >
                        +39 312 345 6789
                      </a>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Instagram
                      </p>
                      <a
                        href="https://instagram.com/costanzaspinelli_pt"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-semibold"
                      >
                        @costanzaspinelli_pt
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-6">
                <h4 className="font-bold mb-3">Garanzia di Qualità</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>Certificazione EREPs riconosciuta in Europa</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>Background in Fisioterapia</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>Approccio scientifico evidence-based</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>Monitoraggio progressi costante</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Domande Frequenti
          </h2>
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg mb-2">
                  La consulenza è davvero gratuita?
                </h3>
                <p className="text-muted-foreground">
                  Sì, assolutamente! La prima consulenza è completamente
                  gratuita e senza impegno. È un&apos;opportunità per conoscerci
                  e capire se possiamo lavorare insieme.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg mb-2">
                  Quanto tempo ci vuole per vedere risultati?
                </h3>
                <p className="text-muted-foreground">
                  I primi risultati visibili arrivano generalmente dopo 4-6
                  settimane di allenamento costante. Trasformazioni
                  significative richiedono 8-12 settimane, ma dipende dal punto
                  di partenza e dagli obiettivi.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg mb-2">Lavori anche online?</h3>
                <p className="text-muted-foreground">
                  Sì! Offro programmi di coaching online completi con videocall,
                  schede personalizzate, supporto WhatsApp e check-in regolari.
                  Puoi allenarti da qualsiasi parte del mondo.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg mb-2">
                  Serve esperienza in palestra?
                </h3>
                <p className="text-muted-foreground">
                  No, lavoro con persone di tutti i livelli, dai principianti
                  assoluti agli atleti avanzati. Ogni programma è personalizzato
                  sul tuo livello attuale.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
