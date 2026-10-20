'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  Car,
  Heart,
  ArrowUpRight,
  Menu,
  X,
  LogIn,
  LayoutDashboard,
  MessageCircle,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { PublicAgencyConfig, PublicEstateItem } from '@/services/publicInmobiliariaService';
import { useAuth } from '@/context/AuthContext';

export const PROPERTY_TYPE_LABELS: Record<number, string> = {
  1: 'Casa Residencial',
  2: 'Departamento',
  3: 'Terreno / Lote',
  4: 'Local Comercial',
  5: 'Oficina Corporativa',
};

export const getEstatePrimaryImage = (estate: PublicEstateItem): string => {
  if (estate.image && typeof estate.image === 'string') {
    return estate.image;
  }
  if (Array.isArray(estate.images) && estate.images.length > 0) {
    const first = estate.images[0];
    if (typeof first === 'string') return first;
    if (first?.image_path) return first.image_path;
    if (first?.url) return first.url;
  }
  return 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80';
};

export const PublicPropertyCard: React.FC<{
  estate: PublicEstateItem;
  currency?: string;
  primaryColor?: string;
  domainParam?: string | null;
}> = ({ estate, currency = 'USD', primaryColor = '#00a884', domainParam }) => {
  const isRent = Number(estate.property_status) === 1;
  const statusLabel = isRent ? 'En Alquiler' : 'En Venta';
  const typeLabel = PROPERTY_TYPE_LABELS[Number(estate.property_type)] || 'Propiedad';
  const imageUrl = getEstatePrimaryImage(estate);
  const priceFormatted = Number(estate.price || 0).toLocaleString('en-US');
  const detailHref = `/properties/${encodeURIComponent(estate.slug || String(estate.id))}${
    domainParam ? `?domain=${encodeURIComponent(domainParam)}` : ''
  }`;

  const locationText =
    [estate.city, estate.province].filter(Boolean).join(', ') ||
    estate.address ||
    estate.full_address ||
    'Ubicación verificada';

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="relative h-60 w-full overflow-hidden bg-slate-100">
        <Link href={detailHref} className="block w-full h-full">
          <img
            src={imageUrl}
            alt={estate.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80';
            }}
          />
        </Link>
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
          <span
            className="px-3 py-1 rounded-full text-xs font-extrabold text-white shadow-md"
            style={{ backgroundColor: isRent ? '#2563eb' : primaryColor }}
          >
            {statusLabel}
          </span>
          {Boolean(estate.featured) && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-md">
              ★ Destacada
            </span>
          )}
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-semibold">
            {typeLabel}
          </span>
          {Array.isArray(estate.images) && estate.images.length > 1 && (
            <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold">
              📷 {estate.images.length} fotos
            </span>
          )}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1.5">
            <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor }} />
            <span className="truncate">{locationText}</span>
          </div>
          <Link href={detailHref}>
            <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 mb-3">
              {estate.title}
            </h3>
          </Link>

          <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-xs text-slate-600 font-semibold">
            <div className="flex items-center gap-1.5">
              <BedDouble className="w-4 h-4 text-slate-400" />
              <span>{estate.bedrooms ?? 0} Hab.</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4 text-slate-400" />
              <span>{estate.bathrooms ?? 0} Baños</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Maximize2 className="w-4 h-4 text-slate-400" />
              <span>{estate.size ? `${estate.size} m²` : 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 mt-2 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
              {isRent ? 'Canon Mensual' : 'Precio de Venta'}
            </span>
            <span className="text-lg font-extrabold text-slate-900">
              {currency === 'USD' ? '$' : currency} {priceFormatted}
              {isRent && <small className="text-xs font-medium text-slate-500"> /mes</small>}
            </span>
          </div>
          <Link
            href={detailHref}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm hover:opacity-90 transition-opacity"
            style={{ backgroundColor: primaryColor }}
          >
            <span>Ver Detalles</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export const PublicInmobiliariaHeader: React.FC<{
  agency: PublicAgencyConfig;
  domainParam?: string | null;
}> = ({ agency, domainParam }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const primaryColor = agency.primary_color || '#00a884';
  const whatsappClean = (agency.whatsapp || agency.phone || '').replace(/[^0-9]/g, '');
  const logoUrl = agency.logo || agency.logo_2;

  const withDomain = (path: string) => {
    if (!domainParam) return path;
    const sep = path.includes('?') ? '&' : '?';
    return `${path}${sep}domain=${encodeURIComponent(domainParam)}`;
  };

  return (
    <>
      {/* Topbar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-4">
            {agency.phone && (
              <a href={`tel:${agency.phone}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                <span>{agency.phone}</span>
              </a>
            )}
            {agency.email && (
              <a href={`mailto:${agency.email}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                <span>{agency.email}</span>
              </a>
            )}
            {(agency.address || agency.city) && (
              <span className="hidden md:flex items-center gap-1.5 text-slate-400">
                <MapPin className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                <span>{agency.address || [agency.city, agency.province].filter(Boolean).join(', ')}</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <span className="hidden sm:inline-flex items-center gap-1 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Portal Inmobiliario Verificado
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <Link href={withDomain('/')} className="flex items-center gap-3 shrink-0">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={agency.name}
                className="h-11 w-auto max-w-[180px] object-contain"
              />
            ) : (
              <div className="flex items-center gap-2.5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold shadow-md"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-lg font-extrabold text-slate-900 tracking-tight block leading-none">
                    {agency.name || 'Inmobiliaria'}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Bienes Raíces
                  </span>
                </div>
              </div>
            )}
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-bold text-slate-700">
            <Link href={withDomain('/')} className="hover:text-slate-950 transition-colors">
              Inicio
            </Link>
            <Link href={withDomain('/properties')} className="hover:text-slate-950 transition-colors">
              Catálogo de Propiedades
            </Link>
            <Link href={withDomain('/properties?property_status=2')} className="hover:text-slate-950 transition-colors">
              En Venta
            </Link>
            <Link href={withDomain('/properties?property_status=1')} className="hover:text-slate-950 transition-colors">
              En Alquiler
            </Link>
            <a href="#conocenos" className="hover:text-slate-950 transition-colors">
              Conócenos
            </a>
            <a href="#contacto" className="hover:text-slate-950 transition-colors">
              Contacto
            </a>
          </nav>

          <div className="hidden sm:flex items-center gap-2.5">
            {whatsappClean && (
              <a
                href={`https://wa.me/${whatsappClean}?text=${encodeURIComponent(
                  `Hola ${agency.name}, deseo recibir asesoría inmobiliaria.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold text-white shadow-sm hover:opacity-90 transition-opacity"
                style={{ backgroundColor: primaryColor }}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contactar Asesor</span>
              </a>
            )}
            <Link
              href={isAuthenticated ? '/dashboard' : '/login'}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {isAuthenticated ? (
                <>
                  <LayoutDashboard className="w-4 h-4 text-slate-600" />
                  <span>Panel CRM</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 text-slate-600" />
                  <span>Acceso Agentes</span>
                </>
              )}
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-3">
            <div className="flex flex-col space-y-2 text-sm font-bold text-slate-700">
              <Link href={withDomain('/')} onClick={() => setMobileMenuOpen(false)} className="py-1.5">
                Inicio
              </Link>
              <Link href={withDomain('/properties')} onClick={() => setMobileMenuOpen(false)} className="py-1.5">
                Catálogo de Propiedades
              </Link>
              <Link
                href={withDomain('/properties?property_status=2')}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5"
              >
                Propiedades en Venta
              </Link>
              <Link
                href={withDomain('/properties?property_status=1')}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5"
              >
                Propiedades en Alquiler
              </Link>
            </div>
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {whatsappClean && (
                <a
                  href={`https://wa.me/${whatsappClean}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white text-center flex items-center justify-center gap-2"
                  style={{ backgroundColor: primaryColor }}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Directo</span>
                </a>
              )}
              <Link
                href={isAuthenticated ? '/dashboard' : '/login'}
                className="w-full py-2.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 text-center flex items-center justify-center gap-2"
              >
                {isAuthenticated ? (
                  <>
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Ir al Panel CRM</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Acceso Agentes</span>
                  </>
                )}
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export const PublicInmobiliariaFooter: React.FC<{
  agency: PublicAgencyConfig;
  domainParam?: string | null;
}> = ({ agency, domainParam }) => {
  const primaryColor = agency.primary_color || '#00a884';
  const withDomain = (path: string) => {
    if (!domainParam) return path;
    const sep = path.includes('?') ? '&' : '?';
    return `${path}${sep}domain=${encodeURIComponent(domainParam)}`;
  };

  return (
    <footer id="contacto" className="bg-slate-950 text-slate-300 pt-16 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {agency.logo_2 || agency.logo ? (
                <img
                  src={agency.logo_2 || agency.logo || ''}
                  alt={agency.name}
                  className="h-10 w-auto object-contain bg-white/95 px-2.5 py-1 rounded-lg"
                />
              ) : (
                <span className="text-xl font-extrabold text-white">{agency.name}</span>
              )}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {agency.description ||
                'Agencia inmobiliaria líder especializada en asesoría, compra, venta y alquiler de bienes raíces con respaldo profesional.'}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider mb-4">Navegación</h4>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-400">
              <li>
                <Link href={withDomain('/')} className="hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href={withDomain('/properties')} className="hover:text-white transition-colors">
                  Todas las Propiedades
                </Link>
              </li>
              <li>
                <Link href={withDomain('/properties?property_status=2')} className="hover:text-white transition-colors">
                  Inmuebles en Venta
                </Link>
              </li>
              <li>
                <Link href={withDomain('/properties?property_status=1')} className="hover:text-white transition-colors">
                  Inmuebles en Alquiler
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider mb-4">Tipos de Inmuebles</h4>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-400">
              <li>
                <Link href={withDomain('/properties?property_type=1')} className="hover:text-white transition-colors">
                  Casas Residenciales
                </Link>
              </li>
              <li>
                <Link href={withDomain('/properties?property_type=2')} className="hover:text-white transition-colors">
                  Departamentos
                </Link>
              </li>
              <li>
                <Link href={withDomain('/properties?property_type=3')} className="hover:text-white transition-colors">
                  Terrenos y Lotes
                </Link>
              </li>
              <li>
                <Link href={withDomain('/properties?property_type=4')} className="hover:text-white transition-colors">
                  Locales Comerciales
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider mb-4">Contacto Directo</h4>
            <ul className="space-y-3 text-xs text-slate-400">
              {(agency.address || agency.city) && (
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: primaryColor }} />
                  <span>{agency.address || [agency.city, agency.province].filter(Boolean).join(', ')}</span>
                </li>
              )}
              {agency.phone && (
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
                  <a href={`tel:${agency.phone}`} className="hover:text-white transition-colors">
                    {agency.phone}
                  </a>
                </li>
              )}
              {agency.email && (
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
                  <a href={`mailto:${agency.email}`} className="hover:text-white transition-colors">
                    {agency.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} <strong className="text-slate-300">{agency.commercial_name || agency.name}</strong>. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-slate-300 transition-colors">
              Portal de Agentes
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

