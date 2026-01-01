import type { Metadata } from "next";
import { Montaga, Jost } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";

const montaga = Montaga({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montaga",
});

const jost = Jost({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jost",
});

export const metadata: Metadata = {
  title: "Costanza Spinelli - Personal Trainer",
  description:
    "Schede di allenamento personalizzate per raggiungere i tuoi obiettivi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body
        className={`${jost.variable} ${montaga.variable} font-sans antialiased`}
      >
        <Navigation />
        {children}
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
