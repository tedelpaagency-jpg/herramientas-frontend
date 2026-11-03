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
            {/* Columna 1: InformaciÃ³n */}
            <div>
              <h4 className="text-sm font-bold text-white mb-5">InformaciÃ³n</h4>
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
                      alert('Tu solicitud para cancelar la suscripciÃ³n ha sido procesada.');
                    }}
                    className="hover:text-white transition-colors text-slate-400 no-underline"
                  >
                    Cancelar subscripciÃ³n
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
                  Â¡Gracias por suscribirte!
                </span>
              )}
            </div>
          </div>

          {/* Sub-footer */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p className="m-0">
              Â©{new Date().getFullYear()} {agencyName}. Todos los derechos reservados.
            </p>
            <div>
              <Link href="/privacy" className="hover:text-white transition-colors text-slate-400 no-underline">
                Politica de privacidad
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Botones Flotantes (WhatsApp + Subir arriba) */}
      <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-center gap-2.5 pointer-events-none">
        {/* Boton WhatsApp */}
        <a
          href={`https://wa.me/${cleanPhone}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactar por WhatsApp"
          className="pointer-events-auto w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 no-underline"
          title="Contactar por WhatsApp"
        >
          <svg width={26} height={26} viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.507 14.307l-.009.075c-2.799-1.396-3.14-1.564-3.473-1.077-.286.417-.674.887-.827 1.058-.153.17-.306.192-.58.057-.272-.136-1.15-.424-2.19-1.353-.811-.723-1.358-1.616-1.517-1.89-.16-.272-.017-.419.12-.555.123-.122.272-.317.408-.476.136-.16.182-.272.272-.454.091-.182.046-.34-.023-.476-.068-.136-.613-1.477-.84-2.023-.222-.533-.448-.46-.614-.469-.16-.008-.341-.01-.522-.01-.181 0-.476.068-.726.34-.249.272-.952.93-.952 2.27s.974 2.632 1.11 2.813c.136.182 1.916 2.927 4.643 4.103 2.727 1.176 2.727.784 3.226.737.499-.047 1.61-.658 1.837-1.293.227-.635.227-1.179.159-1.293-.069-.113-.25-.181-.522-.317zM12.004 21.75c-1.748 0-3.415-.463-4.887-1.34l-.35-.208-3.635.953.97-3.543-.228-.363c-.96-1.528-1.47-3.3-1.47-5.129 0-5.376 4.374-9.75 9.75-9.75 5.376 0 9.75 4.374 9.75 9.75 0 5.376-4.374 9.75-9.75 9.75zm0-21.25c-6.351 0-11.5 5.149-11.5 11.5 0 2.03.528 3.94 1.451 5.602l-1.542 5.632 5.766-1.512c1.603.874 3.442 1.378 5.405 1.378 6.351 0 11.5-5.149 11.5-11.5 0-6.351-5.149-11.5-11.5-11.5z"/>
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
