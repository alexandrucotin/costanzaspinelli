import Link from "next/link";
import { Instagram, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#161612] text-[#f6f5f4]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div>
            <h3 className="text-[#f6f5f4] text-xl font-bold mb-4">
              Costanza Spinelli
            </h3>
            <p className="text-sm mb-4 text-[#f6f5f4]/80">
              Personal Trainer certificata specializzata in ipertrofia muscolare
              e ricomposizione corporea.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/costanzaspinelli.pt"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="mailto:costanzaspinelli.pt@gmail.com"
                className="hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#f6f5f4] font-semibold mb-4">Link Rapidi</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/chi-sono"
                  className="hover:text-primary transition-colors"
                >
                  Chi Sono
                </Link>
              </li>
              <li>
                <Link
                  href="/servizi"
                  className="hover:text-primary transition-colors"
                >
                  Servizi
                </Link>
              </li>
              <li>
                <Link
                  href="/contatti"
                  className="hover:text-primary transition-colors"
                >
                  Contatti
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[#f6f5f4] font-semibold mb-4">Servizi</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/servizi"
                  className="hover:text-primary transition-colors"
                >
                  Ipertrofia Muscolare
                </Link>
              </li>
              <li>
                <Link
                  href="/servizi"
                  className="hover:text-primary transition-colors"
                >
                  Ricomposizione Corporea
                </Link>
              </li>
              <li>
                <Link
                  href="/servizi"
                  className="hover:text-primary transition-colors"
                >
                  Coaching Online
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/schede"
                  className="hover:text-primary transition-colors"
                >
                  Area Admin
                </Link>
              </li>
              <li>
                <Link
                  href="/cliente/login"
                  className="hover:text-primary transition-colors"
                >
                  Area Clienti
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-[#f6f5f4] font-semibold mb-4">Contatti</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-1 flex-shrink-0" />
                <a
                  href="mailto:costanzaspinelli.pt@gmail.com"
                  className="hover:text-primary transition-colors"
                >
                  costanzaspinelli.pt@gmail.com
                </a>
              </li>

              <li className="flex items-start gap-2">
                <Instagram className="h-4 w-4 mt-1 flex-shrink-0" />
                <a
                  href="https://instagram.com/costanzaspinelli.pt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  @costanzaspinelli.pt
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#f6f5f4]/20 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>
              &copy; {new Date().getFullYear()} Costanza Spinelli Personal
              Trainer. Tutti i diritti riservati.
            </p>
            <div className="flex gap-6">
              <span className="text-gray-500">Certificazione EREPs</span>
              <span className="text-gray-500">Laurea in Fisioterapia</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
