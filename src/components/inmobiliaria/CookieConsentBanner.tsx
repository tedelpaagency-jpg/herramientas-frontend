"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cookie, X, Check } from 'lucide-react';
import { PublicAgencyConfig } from '@/services/publicInmobiliariaService';

interface CookieConsentBannerProps {
  agency?: PublicAgencyConfig | null;
  domainParam?: string | null;
}

const STORAGE_KEY = 'immobillis_cookie_consent_accepted';

const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ agency, domainParam }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isAccepted = localStorage.getItem(STORAGE_KEY);
    const cookiesEnabled = agency?.details?.cookies_enabled !== false;

    if (!isAccepted && cookiesEnabled) {
      // Small timeout so it doesn't flash abruptly on initial render
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [agency]);

  const handleAccept = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, 'true');
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const defaultMsg =
    'Utilizamos cookies propias y de terceros para brindarte la mejor experiencia de navegación, personalizar tus búsquedas de inmuebles y analizar el tráfico de nuestro portal inmobiliario. Al continuar navegando, aceptas nuestra política de cookies y privacidad.';
  const message = agency?.details?.cookies_message || defaultMsg;
  const primaryColor = agency?.primary_color || agency?.details?.primary_color || '#e2b728';

  const privacyHref = domainParam
    ? `/privacy?domain=${encodeURIComponent(domainParam)}`
    : '/privacy';

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Aviso de cookies"
      className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-[9999] animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-4 sm:p-5 rounded-2xl shadow-2xl border border-slate-700/80 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm">
            <Cookie className="w-5 h-5 text-amber-400 shrink-0" />
            <span>Aviso de Cookies y Privacidad</span>
          </div>
          <button
            type="button"
            onClick={handleAccept}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            aria-label="Cerrar aviso de cookies"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed m-0 font-normal">
          {message}
        </p>

        <div className="flex items-center justify-between gap-3 pt-1">
          <Link
            href={privacyHref}
            className="text-[11px] font-bold text-slate-400 hover:text-white underline underline-offset-2 transition-colors"
          >
            Ver políticas
          </Link>

          <button
            type="button"
            onClick={handleAccept}
            style={{
              backgroundColor: primaryColor,
              color: '#0f172a',
            }}
            className="px-4 py-2 rounded-xl text-xs font-black shadow-md hover:brightness-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>Aceptar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
