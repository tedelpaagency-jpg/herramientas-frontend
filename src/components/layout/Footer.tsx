'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Send,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
} from 'lucide-react';

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
  const footerLogo =
    agency?.details?.footer_logo ||
    agency?.footer_logo ||
    agency?.logo ||
    agency?.logo_2;
  const footerAbout =
    agency?.details?.footer_about_text ||
    agency?.about_text ||
    agency?.description ||
    'Tu portal inmobiliario de confianza para comprar, vender y alquilar propiedades exclusivas.';

  const playStoreUrl =
    agency?.details?.play_store_url ||
    agency?.play_store_url ||
    (agency?.id === 394 || agency?.name?.toLowerCase()?.includes('immobillis')
      ? 'https://play.google.com/store/apps/details?id=com.sims.immobillis'
      : null);

  const facebookUrl = agency?.details?.facebook || agency?.facebook || '';
  const instagramUrl = agency?.details?.instagram || agency?.instagram || '';
  const tiktokUrl = agency?.details?.tiktok || agency?.tiktok || '';
  const youtubeUrl = agency?.details?.youtube || agency?.youtube || '';
  const linkedinUrl = agency?.details?.linkedin || agency?.linkedin || '';
  const twitterUrl = agency?.details?.x_twitter || agency?.details?.twitter || agency?.twitter || '';
  const rawWhatsapp = agency?.details?.whatsapp || agency?.whatsapp || agency?.phone;
  const whatsappUrl =
    agency?.details?.whatsapp_url ||
    (rawWhatsapp ? `https://wa.me/${String(rawWhatsapp).replace(/[^0-9]/g, '')}` : null);

  const socialItems = [
    {
      name: 'Facebook',
      url: facebookUrl,
      icon: <Facebook className="w-4 h-4" />,
      hoverClass: 'hover:text-[#1877F2] hover:border-[#1877F2]/50 hover:bg-[#1877F2]/10',
    },
    {
      name: 'Instagram',
      url: instagramUrl,
      icon: <Instagram className="w-4 h-4" />,
      hoverClass: 'hover:text-[#E4405F] hover:border-[#E4405F]/50 hover:bg-[#E4405F]/10',
    },
    {
      name: 'TikTok',
      url: tiktokUrl,
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      ),
      hoverClass: 'hover:text-[#EE1D52] hover:border-[#EE1D52]/50 hover:bg-[#EE1D52]/10',
    },
    {
      name: 'YouTube',
      url: youtubeUrl,
      icon: <Youtube className="w-4 h-4" />,
      hoverClass: 'hover:text-[#FF0000] hover:border-[#FF0000]/50 hover:bg-[#FF0000]/10',
    },
    {
      name: 'WhatsApp',
      url: whatsappUrl,
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      ),
      hoverClass: 'hover:text-[#25D366] hover:border-[#25D366]/50 hover:bg-[#25D366]/10',
    },
    {
      name: 'LinkedIn',
      url: linkedinUrl,
      icon: <Linkedin className="w-4 h-4" />,
      hoverClass: 'hover:text-[#0A66C2] hover:border-[#0A66C2]/50 hover:bg-[#0A66C2]/10',
    },
    {
      name: 'X (Twitter)',
      url: twitterUrl,
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      hoverClass: 'hover:text-white hover:border-white/50 hover:bg-white/10',
    },
  ].filter((item) => Boolean(item.url));

  const hasConfiguredSocials = socialItems.length > 0;
  const activeSocials = hasConfiguredSocials
    ? socialItems
    : [
        {
          name: 'Facebook',
          url: `https://facebook.com/${agencyName.toLowerCase().replace(/\s+/g, '')}`,
          icon: <Facebook className="w-4 h-4" />,
          hoverClass: 'hover:text-[#1877F2] hover:border-[#1877F2]/50 hover:bg-[#1877F2]/10',
        },
        {
          name: 'Instagram',
          url: `https://instagram.com/${agencyName.toLowerCase().replace(/\s+/g, '')}`,
          icon: <Instagram className="w-4 h-4" />,
          hoverClass: 'hover:text-[#E4405F] hover:border-[#E4405F]/50 hover:bg-[#E4405F]/10',
        },
        {
          name: 'TikTok',
          url: `https://tiktok.com/@${agencyName.toLowerCase().replace(/\s+/g, '')}`,
          icon: (
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
            </svg>
          ),
          hoverClass: 'hover:text-[#EE1D52] hover:border-[#EE1D52]/50 hover:bg-[#EE1D52]/10',
        },
        ...(whatsappUrl
          ? [
              {
                name: 'WhatsApp',
                url: whatsappUrl,
                icon: (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                ),
                hoverClass: 'hover:text-[#25D366] hover:border-[#25D366]/50 hover:bg-[#25D366]/10',
              },
            ]
          : []),
      ];

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 pb-12 border-b border-slate-800/80">
            {/* Columna 1: Logo de la Agencia & Redes Sociales */}
            <div className="lg:col-span-4 space-y-4">
              <Link href="/" className="inline-block no-underline">
                {footerLogo ? (
                  <img
                    src={footerLogo}
                    alt={agencyName}
                    className="h-10 sm:h-12 w-auto max-w-[220px] object-contain object-left drop-shadow-md"
                  />
                ) : (
                  <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {agencyName}
                  </span>
                )}
              </Link>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm m-0">
                {footerAbout}
              </p>
              {/* Redes Sociales */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
                  Síguenos en Redes Sociales
                </span>
                <div className="flex items-center flex-wrap gap-2.5">
                  {activeSocials.map((soc) => (
                    <a
                      key={soc.name}
                      href={soc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={soc.name}
                      title={soc.name}
                      className={`w-9 h-9 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-300 flex items-center justify-center transition-all duration-200 no-underline shadow-xs hover:scale-105 active:scale-95 ${soc.hoverClass}`}
                    >
                      {soc.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Columna 2: Información */}
            <div className="lg:col-span-2">
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

            {/* Columna 3: Menu */}
            <div className="lg:col-span-2">
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

            {/* Columna 4: Horario de atencion & App Móvil */}
            <div className="lg:col-span-2">
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

            {/* Columna 5: Boletines */}
            <div className="lg:col-span-2">
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
