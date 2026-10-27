'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Phone,
  MessageCircle,
  Menu,
  X,
  User,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { PublicAgencyConfig } from '@/services/publicInmobiliariaService';

interface AirbnbHeaderProps {
  agency: PublicAgencyConfig;
  domainParam?: string | null;
}

export const AirbnbHeader: React.FC<AirbnbHeaderProps> = ({ agency, domainParam }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const primaryColor = agency?.primary_color || '#00a884';
  const logoUrl = agency?.logo_2 || agency?.logo;
  const agencyName = agency?.name || 'Inmobiliaria';
  const phoneDisplay = agency?.phone || agency?.whatsapp || '+593 99 999 9999';
  const cleanPhone = (agency?.whatsapp || agency?.phone || '').replace(/[^0-9]/g, '');
  const portalUrl = agency?.portal_url || '/login';

  const withDomain = (path: string) => {
    if (!domainParam) return path;
    const sep = path.includes('?') ? '&' : '?';
    return `${path}${sep}domain=${encodeURIComponent(domainParam)}`;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs font-sans">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo / Marca a la izquierda */}
        <Link
          href={withDomain('/')}
          className="flex items-center gap-3 shrink-0 active:scale-98 transition-transform cursor-pointer"
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={agencyName}
              className="h-10 sm:h-11 w-auto max-w-[180px] sm:max-w-[210px] object-contain"
            />
          ) : (
            <div className="flex items-center gap-2.5">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black shadow-md shrink-0"
                style={{ backgroundColor: primaryColor }}
              >
                <Building2 className="w-5 h-5" />
              </div>
              <div className="hidden sm:block">
                <span className="text-base font-black text-slate-900 tracking-tight block leading-none">
                  {agencyName}
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  Portal Inmobiliario
                </span>
              </div>
            </div>
          )}
        </Link>

        {/* Menú Central estilo Airbnb / Segmented Pills (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1.5 bg-slate-100/80 rounded-full border border-slate-200/60 shadow-2xs text-xs font-bold text-slate-700">
          <Link
            href={withDomain('/')}
            className="px-4 py-2 rounded-full hover:bg-white hover:text-slate-900 hover:shadow-2xs active:scale-95 transition-all duration-150"
          >
            Inicio
          </Link>
          <Link
            href={withDomain('/properties')}
            className="px-4 py-2 rounded-full bg-white text-slate-900 shadow-2xs font-extrabold"
          >
            Catálogo
          </Link>
          <Link
            href={withDomain('/properties?property_status=2')}
            className="px-4 py-2 rounded-full hover:bg-white hover:text-slate-900 hover:shadow-2xs active:scale-95 transition-all duration-150"
          >
            En Venta
          </Link>
          <Link
            href={withDomain('/properties?property_status=1')}
            className="px-4 py-2 rounded-full hover:bg-white hover:text-slate-900 hover:shadow-2xs active:scale-95 transition-all duration-150"
          >
            En Alquiler
          </Link>
          <Link
            href={withDomain('/properties?property_type=2')}
            className="px-4 py-2 rounded-full hover:bg-white hover:text-slate-900 hover:shadow-2xs active:scale-95 transition-all duration-150"
          >
            Departamentos
          </Link>
          <Link
            href={withDomain('/properties?property_type=1')}
            className="px-4 py-2 rounded-full hover:bg-white hover:text-slate-900 hover:shadow-2xs active:scale-95 transition-all duration-150"
          >
            Casas
          </Link>
        </nav>

        {/* Acciones de la derecha: Contacto WhatsApp + Acceso Agentes */}
        <div className="flex items-center gap-2.5">
          {cleanPhone && (
            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                `Hola ${agencyName}, me gustaría recibir información sobre propiedades disponibles.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 min-h-[40px] rounded-full bg-emerald-50 hover:bg-emerald-100/90 text-emerald-800 text-xs font-black border border-emerald-200/90 shadow-2xs active:scale-95 transition-all duration-150 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-emerald-600 text-white" />
              <span>{phoneDisplay}</span>
            </a>
          )}

          <a
            href={portalUrl}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[40px] rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-md hover:shadow-lg active:scale-95 transition-all duration-150 cursor-pointer"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Acceso Agentes</span>
            <span className="sm:hidden">Ingresar</span>
          </a>

          {/* Botón Hamburger Móvil */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2.5 min-w-[44px] min-h-[44px] rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100 active:scale-90 transition-all flex items-center justify-center cursor-pointer"
            aria-label="Abrir menú de navegación"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Menú Drawer Móvil con Emil Kowalski Physics */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-md border-t border-slate-200 px-6 py-5 space-y-4 shadow-xl animate-in fade-in-0 slide-in-from-top-3 duration-200">
          <div className="flex flex-col space-y-2 text-sm font-extrabold text-slate-800">
            <Link
              href={withDomain('/')}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Inicio
            </Link>
            <Link
              href={withDomain('/properties')}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-xl bg-slate-100 text-slate-900"
            >
              Catálogo de Propiedades
            </Link>
            <Link
              href={withDomain('/properties?property_status=2')}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Propiedades en Venta
            </Link>
            <Link
              href={withDomain('/properties?property_status=1')}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Propiedades en Alquiler
            </Link>
            <Link
              href={withDomain('/properties?property_type=2')}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Departamentos
            </Link>
            <Link
              href={withDomain('/properties?property_type=1')}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Casas Residenciales
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            {cleanPhone && (
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 min-h-[44px] rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-black text-center flex items-center justify-center gap-2 border border-emerald-200"
              >
                <MessageCircle className="w-4 h-4 fill-emerald-600 text-white" />
                <span>WhatsApp: {phoneDisplay}</span>
              </a>
            )}

            <a
              href={portalUrl}
              className="w-full py-3 min-h-[44px] rounded-2xl bg-slate-900 text-white text-xs font-black text-center flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
            >
              <User className="w-4 h-4" />
              <span>Acceso al Portal de Agentes</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default AirbnbHeader;

