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

            {/* Columna 3: Horario de atencion */}
            <div>
              <h4 className="text-sm font-bold text-white mb-5">Horario de atencion</h4>
              <p className="text-xs text-slate-300 m-0">08:00 am a 06:00 pm</p>
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

      {/* Botones Flotantes (WhatsApp + Subir arriba) */}
      <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-center gap-3 pointer-events-none">
        {/* Boton WhatsApp */}
        <a
          href={`https://wa.me/${cleanPhone}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactar por WhatsApp"
          className="pointer-events-auto w-13 h-13 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 no-underline border-2 border-white/30"
          title="Contactar por WhatsApp"
        >
          <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
        </a>

        {/* Boton Subir arriba */}
        {showScrollTop && (
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Subir arriba"
            className="pointer-events-auto w-11 h-11 rounded-full bg-[#EAB308] hover:bg-[#ca8a04] text-slate-900 shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 font-black border-none cursor-pointer animate-in fade-in zoom-in-75 duration-200"
            title="Volver al inicio"
          >
            <ArrowUp className="w-5 h-5 stroke-[2.5]" />
          </button>
        )}
      </div>
    </>
  );
};

export default Footer;
