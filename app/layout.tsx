import type { Metadata } from "next";
import { Montaga, Jost } from "next/font/google";
import "./globals.css";
import { ConditionalLayout } from "@/components/conditional-layout";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";

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
    <ClerkProvider>
      <html lang="it">
        <body
          className={`${jost.variable} ${montaga.variable} font-sans antialiased`}
        >
          <ConditionalLayout>{children}</ConditionalLayout>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
