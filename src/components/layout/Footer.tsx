'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Send, ArrowUp } from 'lucide-react';

interface FooterProps {
  agency?: any;
}

const Footer: React.FC<FooterProps> = ({ agency }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSent, setNewsletterSent] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(typeof window !== 'undefined' && window.scrollY > 220);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const agencyName = agency?.commercial_name || agency?.name || 'Immobillis';
  const phoneDisplay = agency?.phone || agency?.whatsapp || '+593 0984113967';
  const cleanPhone = phoneDisplay.replace(/[^0-9]/g, '') || '593984113967';
  const emailDisplay = agency?.email || 'informacion@immobillis.com';
  const locationDisplay = [agency?.city || 'Quevedo', agency?.country || 'Ecuador'].filter(Boolean).join(' - ');
  const playStoreUrl =
    agency?.details?.play_store_url ||
    agency?.play_store_url ||
    (agency?.id === 394 || agency?.name?.toLowerCase()?.includes('immobillis')
      ? 'https://play.google.com/store/apps/details?id=com.sims.immobillis'
      : null);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSent(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setNewsletterSent(false);
    }, 3000);
  };

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <footer id="contacto" className="bg-[#0b1120] text-slate-300 pt-14 pb-8 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-12 border-b border-slate-800/80">
            {/* Columna 1: Información */}
            <div>
              <h4 className="text-sm font-bold text-white mb-5">Información</h4>
              <ul className="space-y-3.5 text-xs text-slate-300 p-0 m-0 list-none">
                <li className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 shrink-0 text-slate-400" />
                  <span>{locationDisplay}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 shrink-0 text-slate-400" />
                  <a href={`tel:${phoneDisplay}`} className="hover:text-white transition-colors text-slate-300 no-underline">
                    {phoneDisplay}
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 shrink-0 text-slate-400" />
                  <a href={`mailto:${emailDisplay}`} className="hover:text-white transition-colors text-slate-300 no-underline">
                    {emailDisplay}
                  </a>
                </li>
              </ul>
            </div>

            {/* Columna 2: Menu */}
            <div>
              <h4 className="text-sm font-bold text-white mb-5">Menu</h4>
              <ul className="space-y-2.5 text-xs text-slate-300 p-0 m-0 list-none">
                <li>
                  <Link href="/" className="hover:text-white transition-colors text-slate-300 no-underline">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link href="/properties" className="hover:text-white transition-colors text-slate-300 no-underline">
                    Propiedades
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition-colors text-slate-300 no-underline">
                    Nosotros
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-white transition-colors text-slate-300 no-underline">
                    Servicios
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors text-slate-300 no-underline">
                    Contactanos
                  </Link>
                </li>
                <li>
                  <a
                    href="#unsubscribe"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Tu solicitud para cancelar la suscripción ha sido procesada.');
                    }}
                    className="hover:text-white transition-colors text-slate-400 no-underline"
                  >
                    Cancelar suscripción
                  </a>
                </li>
              </ul>
            </div>

            {/* Columna 3: Horario de atencion & App Móvil */}
            <div>
              <h4 className="text-sm font-bold text-white mb-5">Horario de atencion</h4>
              <p className="text-xs text-slate-300 m-0 mb-4">08:00 am a 06:00 pm</p>

              {playStoreUrl && (
                <div className="pt-3 border-t border-slate-800/80">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Nuestra App
                  </div>
                  <a
                    href={playStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-white transition-all no-underline shadow-xs hover:border-slate-500 group"
                  >
                    <svg className="w-5 h-5 fill-current shrink-0 text-white" viewBox="0 0 24 24">
                      <path d="M3.609 1.814L13.793 12 3.61 22.186a2.38 2.38 0 0 1-.61-.786 2.36 2.36 0 0 1-.22-.979V3.579c0-.353.076-.69.22-.98.143-.29.356-.563.609-.785zm11.256 11.258l2.25 2.25-11.442 6.608 9.192-8.858zm0-2.144L5.673 2.07l11.442 6.608-2.25 2.25zm1.536 1.072l3.414 1.972a1.44 1.44 0 0 1 0 2.496l-3.414 1.972-2.183-2.183 2.183-2.257z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-[8.5px] uppercase tracking-wider text-slate-400 font-semibold leading-none">
                        Disponible en
                      </div>
                      <div className="text-xs font-bold text-white leading-tight">
                        Google Play
                      </div>
                    </div>
                  </a>
                </div>
              )}
            </div>

            {/* Columna 4: Boletines */}
            <div>
              <h4 className="text-sm font-bold text-white mb-5">Boletines</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Se parte de {agencyName} , ingresa tu correo electronico para obtener oferta de propiedades
              </p>
              <form onSubmit={handleNewsletterSubmit} className="relative flex items-center">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Tu correo electronico"
                  className="w-full bg-[#131b2e] border border-slate-700/80 rounded-full py-2.5 pl-4 pr-11 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  type="submit"
                  aria-label="Enviar correo"
                  className="absolute right-3 text-[#2563eb] hover:text-[#3b82f6] transition-colors border-none bg-transparent cursor-pointer p-0"
                >
                  <Send className="w-4 h-4 -rotate-45" />
                </button>
              </form>
              {newsletterSent && (
                <span className="text-[11px] text-emerald-400 mt-2 block font-semibold">
                  ¡Gracias por suscribirte!
                </span>
              )}
            </div>
          </div>

          {/* Sub-footer */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p className="m-0">
              ©{new Date().getFullYear()} {agencyName}. Todos los derechos reservados.
            </p>
            <div>
              <Link href="/privacy" className="hover:text-white transition-colors text-slate-400 no-underline">
                Política de privacidad
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
