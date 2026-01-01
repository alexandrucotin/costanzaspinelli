"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-xl">CS</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-lg leading-tight">
                Costanza Spinelli
              </div>
              <div className="text-xs text-muted-foreground">
                Personal Trainer
              </div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/chi-sono"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Chi Sono
            </Link>
            <Link
              href="/servizi"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Servizi
            </Link>
            <Link
              href="/contatti"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Contatti
            </Link>
            <Link href="/contatti">
              <Button size="sm" className="ml-4">
                Consulenza Gratuita
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              <Link
                href="/chi-sono"
                className="text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                Chi Sono
              </Link>
              <Link
                href="/servizi"
                className="text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                Servizi
              </Link>
              <Link
                href="/contatti"
                className="text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                Contatti
              </Link>
              <Link href="/contatti" onClick={() => setIsOpen(false)}>
                <Button size="sm" className="w-full">
                  Consulenza Gratuita
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
