"use client";
import React, { useEffect, useReducer, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { getCachedAgencyConfig } from "@/services/publicInmobiliariaService";
import { useAuth } from "@/context/AuthContext";
import LoginModal from "@/components/auth/LoginModal";
import MobileBottomNavigation from "./MobileBottomNavigation";
import {
  Home,
  Building2,
  Briefcase,
  Users,
  Phone,
  ShieldCheck,
  ChevronDown,
  X,
} from 'lucide-react';

const NAVIGATION_PROPERTY_TYPES = [
  { id: '2', label: 'Casas & Residencias' },
  { id: '4', label: 'Departamentos & Lofts' },
  { id: '22', label: 'Terrenos & Lotes' },
  { id: '21', label: 'Suites' },
  { id: '15', label: 'Oficinas' },
  { id: '16', label: 'Oficinas amobladas' },
  { id: '12', label: 'Locales comerciales' },
  { id: '18', label: 'Propiedades Comerciales' },
  { id: '5', label: 'Edificios' },
  { id: '1', label: 'Bodegas & Almacenes' },
  { id: '8', label: 'Galpones' },
  { id: '7', label: 'Fincas' },
  { id: '10', label: 'Haciendas' },
  { id: '19', label: 'Quintas' },
  { id: '11', label: 'Hoteles' },
  { id: '3', label: 'Complejos turísticos' },
  { id: '6', label: 'Empresas' },
  { id: '9', label: 'Gasolineras' },
  { id: '13', label: 'Lotes' },
  { id: '14', label: 'Lotizaciones' },
  { id: '17', label: 'Plantas industriales' },
  { id: '20', label: 'Solares' },
];

interface State {
  activeMenu: string;
  activeSubMenu: string;
  isSidebarOpen: boolean;
  isLeftSidebarOpen: boolean;
  isSearchbar: boolean;
  isLang: boolean;
  isContact: boolean;
  scrollY: number;
}

type Action =
  | { type: "TOGGLE_MENU"; menu: string }
  | { type: "TOGGLE_SUB_MENU"; subMenu: string }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "setScrollY"; payload: number }
  | { type: "TOGGLE_LEFT_SIDEBAR" }
  | { type: "TOGGLE_LANG" }
  | { type: "TOGGLE_SEARCHBAR" }
  | { type: "TOGGLE_CONTACT" };

const initialState: State = {
  activeMenu: "",
  activeSubMenu: "",
  isSidebarOpen: false,
  isLeftSidebarOpen: false,
  isSearchbar: false,
  isLang: false,
  isContact: false,
  scrollY: 0,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "TOGGLE_MENU":
      return {
        ...state,
        activeMenu: state.activeMenu === action.menu ? "" : action.menu,
        activeSubMenu:
          state.activeMenu === action.menu ? state.activeSubMenu : "",
      };
    case "TOGGLE_SUB_MENU":
      return {
        ...state,
        activeSubMenu:
          state.activeSubMenu === action.subMenu ? "" : action.subMenu,
      };
    case "TOGGLE_SIDEBAR":
      return {
        ...state,
        isSidebarOpen: !state.isSidebarOpen,
      };
    case "setScrollY":
      return { ...state, scrollY: action.payload };
    case "TOGGLE_LEFT_SIDEBAR":
      return {
        ...state,
        isLeftSidebarOpen: !state.isLeftSidebarOpen,
      };
    case "TOGGLE_LANG":
      return {
        ...state,
        isLang: !state.isLang,
      };
    case "TOGGLE_CONTACT":
      return {
        ...state,
        isContact: !state.isContact,
      };
    case "TOGGLE_SEARCHBAR":
      return {
        ...state,
        isSearchbar: !state.isSearchbar,
      };
    default:
      return state;
  }
}


interface Header2Style3Props {
  agency?: any;
}

const Header2Style3: React.FC<Header2Style3Props> = ({ agency }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const pathname = usePathname() as string;
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Escuchar evento personalizado o query param para abrir el modal desde cualquier enlace
  useEffect(() => {
    const handleOpenModal = () => setIsLoginModalOpen(true);
    const handleOpenMobileMenu = () => dispatch({ type: 'TOGGLE_SIDEBAR' });
    window.addEventListener('open-login-modal', handleOpenModal);
    window.addEventListener('open-mobile-menu', handleOpenMobileMenu);

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('login') === 'true' || window.location.hash === '#login') {
        setIsLoginModalOpen(true);
      }
    }

    return () => {
      window.removeEventListener('open-login-modal', handleOpenModal);
      window.removeEventListener('open-mobile-menu', handleOpenMobileMenu);
    };
  }, []);

  // Eliminate SSR hydration mismatch by only switching to client-cached agency after mount
  const [isMounted, setIsMounted] = useState(false);
  const [cached, setCached] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const c = getCachedAgencyConfig();
      if (c) setCached(c);
    }
  }, []);

  const effectiveAgency = isMounted ? (agency || cached) : agency;

  const handleScroll = () => {
    if (typeof window !== 'undefined') {
      dispatch({ type: "setScrollY", payload: window.scrollY });
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  const toggleMenu = (menu: string) => {
    dispatch({ type: "TOGGLE_MENU", menu });
  };

  const toggleSearchbar = () => {
    dispatch({ type: "TOGGLE_SEARCHBAR" });
  };

  const toggleSidebar = () => {
    dispatch({ type: "TOGGLE_MENU", menu: "" });
    dispatch({ type: "TOGGLE_SUB_MENU", subMenu: "" });
    dispatch({ type: "TOGGLE_SIDEBAR" });
  };

  const agencyPhone = effectiveAgency?.phone || effectiveAgency?.whatsapp || '+52 55 1234 5678';
  const rawLogo = effectiveAgency?.logo || effectiveAgency?.logo_2;
  const hasCustomLogo = Boolean(
    rawLogo &&
      typeof rawLogo === 'string' &&
      rawLogo.trim() !== '' &&
      !rawLogo.includes('header-logo2.svg') &&
      !rawLogo.includes('header-logo.svg')
  );
  const logoUrl = hasCustomLogo ? rawLogo : null;
  const rawColor = effectiveAgency?.primary_color || effectiveAgency?.details?.primary_color;
  const primaryColor = rawColor || '#00a884';
  const buttonColor = primaryColor;
  const rawName = effectiveAgency?.name || effectiveAgency?.commercial_name;
  const agencyName = rawName || '';
  const playStoreUrl =
    effectiveAgency?.details?.play_store_url ||
    effectiveAgency?.play_store_url ||
    (effectiveAgency?.id === 394 || effectiveAgency?.name?.toLowerCase()?.includes('immobillis')
      ? 'https://play.google.com/store/apps/details?id=com.sims.immobillis'
      : null);

  return (
    <header className={`header-area style-2 travel-agency3 ${state.scrollY > 20 ? "sticky" : ""}`} style={{ position: 'relative', zIndex: 1090, width: '100%', maxWidth: '100vw' }} suppressHydrationWarning>
      <div className="container-fluid d-flex flex-nowrap align-items-center justify-content-between px-3 px-sm-4 px-xl-5" style={{ width: '100%', maxWidth: '100%' }} suppressHydrationWarning>
        {/* 1. Lado Izquierdo: Logotipo */}
        <div className="header-logo-area d-flex align-items-center" style={{ flex: '0 1 auto', minWidth: 0, overflow: 'hidden' }} suppressHydrationWarning>
          <Link href="/" className="header-logo" suppressHydrationWarning style={{ display: 'flex', alignItems: 'center', minHeight: '62px', maxWidth: '100%', textDecoration: 'none' }}>
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={agencyName || 'Logo Inmobiliaria'}
                loading="eager"
                decoding="sync"
                className="max-h-[46px] sm:max-h-[64px] max-w-[170px] sm:max-w-[280px]"
                style={{ width: 'auto', height: 'auto', objectFit: 'contain', transition: 'all 0.2s ease-in-out' }}
              />
            ) : agencyName ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, overflow: 'hidden' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    backgroundColor: primaryColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '18px',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                    flexShrink: 0,
                  }}
                >
                  {agencyName.charAt(0).toUpperCase()}
                </div>
                <span
                  style={{
                    fontSize: '18px',
                    fontWeight: 900,
                    color: '#0f172a',
                    lineHeight: 1.15,
                    letterSpacing: '-0.02em',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '140px',
                  }}
                >
                  {agencyName}
                </span>
              </div>
            ) : (
              <div style={{ width: '150px', height: '44px', borderRadius: '8px', backgroundColor: '#f1f5f9' }} />
            )}
          </Link>
        </div>

        {/* 2. Centro: Navegación Completamente Centrada */}
        <div className="header-nav-center d-flex align-items-center justify-content-center flex-grow-1" style={{ textAlign: 'center' }}>
          {/* Backdrop para cerrar el menú móvil al tocar afuera */}
          {state.isSidebarOpen && (
            <div
              onClick={toggleSidebar}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(3px)',
                zIndex: 99998,
              }}
              className="d-xl-none"
            />
          )}

          <div className={`main-menu ${state.isSidebarOpen ? "show-menu" : ""}`} style={{ zIndex: 99999 }}>
            {/* Header del Drawer Móvil */}
            <div className="mobile-logo-area d-xl-none d-flex align-items-center justify-content-between pb-3 mb-3 border-b border-slate-100">
              <Link href="/" className="mobile-logo-wrap" onClick={() => state.isSidebarOpen && toggleSidebar()} suppressHydrationWarning style={{ textDecoration: 'none' }}>
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={agencyName || 'Logo Inmobiliaria'}
                    loading="eager"
                    decoding="sync"
                    style={{ maxHeight: '46px', maxWidth: '190px', width: 'auto', height: 'auto', objectFit: 'contain' }}
                  />
                ) : agencyName ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        backgroundColor: primaryColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontWeight: 900,
                        fontSize: '17px',
                        flexShrink: 0,
                      }}
                    >
                      {agencyName.charAt(0).toUpperCase()}
                    </div>
                    <span
                      style={{
                        fontSize: '18px',
                        fontWeight: 900,
                        color: '#0f172a',
                        lineHeight: 1.15,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {agencyName}
                    </span>
                  </div>
                ) : (
                  <div style={{ width: '110px', height: '30px', borderRadius: '8px', backgroundColor: '#f1f5f9' }} />
                )}
              </Link>
              <button
                type="button"
                onClick={toggleSidebar}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center p-0 border-none cursor-pointer"
                aria-label="Cerrar navegación"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2a. MENÚ DESKTOP (Horizontal, centrado clásico) */}
            <ul className="menu-list d-none d-xl-flex align-items-center justify-content-center m-0 p-0" style={{ listStyle: 'none' }}>
              <li className={`${pathname === '/' || pathname === '/travel-agency-03' ? 'active' : ''}`}>
                <Link href="/" className="drop-down">
                  Inicio
                </Link>
              </li>

              <li className={`menu-item-has-children ${pathname.startsWith('/properties') ? 'active' : ''}`}>
                <Link href="/properties" className="drop-down">
                  Propiedades
                  <i className="bi bi-caret-down-fill" />
                </Link>
                <i onClick={() => toggleMenu("PROPERTIES")} className={`bi bi-${state.activeMenu === "PROPERTIES" ? "dash" : "plus"} dropdown-icon`} />
                <ul
                  className={`sub-menu ${state.activeMenu === "PROPERTIES" ? "d-block" : ""}`}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    minWidth: '240px',
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.08)',
                    padding: '10px 8px',
                    zIndex: 9999999,
                    maxHeight: '68vh',
                    overflowY: 'auto'
                  }}
                >
                  <li style={{ padding: '6px 16px 2px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em' }}>
                    Operaciones
                  </li>
                  <li><Link href="/properties">Todas las Propiedades</Link></li>
                  <li><Link href="/properties?property_status=2">En Venta</Link></li>
                  <li><Link href="/properties?property_status=1">En Alquiler / Renta</Link></li>
                  <li><Link href="/properties?property_status=3">En Remate</Link></li>
                  {isAuthenticated && (
                    <li style={{ borderTop: '1px dashed #e2e8f0', marginTop: '4px', paddingTop: '4px' }}>
                      <Link href="/my-estates" className="text-blue-600 font-bold">
                        Mis Propiedades (Gestión)
                      </Link>
                    </li>
                  )}

                  <li style={{ padding: '10px 16px 2px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em', borderTop: '1px solid #f1f5f9', marginTop: '4px' }}>
                    Tipos de Inmueble
                  </li>
                  {NAVIGATION_PROPERTY_TYPES.map((item) => (
                    <li key={item.id}>
                      <Link href={`/properties?property_type=${item.id}`}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              <li className={pathname === '/services' || pathname === '/servicios' ? 'active' : ''}>
                <Link href="/services">
                  Servicios
                </Link>
              </li>

              <li className={pathname === '/about' || pathname === '/conocenos' ? 'active' : ''}>
                <Link href="/about">
                  Conócenos
                </Link>
              </li>

              <li className={pathname === '/contact' || pathname === '/contacto' ? 'active' : ''}>
                <Link href="/contact">
                  Contacto
                </Link>
              </li>

              <li className={pathname === '/privacy' ? 'active' : ''}>
                <Link href="/privacy">
                  Privacidad
                </Link>
              </li>
            </ul>

            {/* 2b. MENÚ MÓVIL EN FORMATO VERTICAL (d-xl-none) */}
            <div className="d-xl-none w-100 flex-column d-flex align-items-stretch text-start pt-1 pb-4" style={{ textAlign: 'left' }}>
              <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-3 mb-2">
                Navegación Principal
              </div>

              <div className="space-y-1 w-100">
                {/* 1. Inicio */}
                <Link
                  href="/"
                  onClick={() => state.isSidebarOpen && toggleSidebar()}
                  className={`w-100 d-flex align-items-center justify-content-between px-3 py-2.5 rounded-xl font-bold text-sm text-decoration-none transition-all ${
                    pathname === '/' || pathname === '/travel-agency-03' ? 'text-white shadow-xs' : 'text-slate-800 hover:bg-slate-100'
                  }`}
                  style={pathname === '/' || pathname === '/travel-agency-03' ? { backgroundColor: primaryColor } : {}}
                >
                  <span className="d-flex align-items-center gap-2.5">
                    <Home className="w-4 h-4 opacity-80" />
                    <span>Inicio</span>
                  </span>
                </Link>

                {/* 2. Propiedades con acordeón vertical */}
                <div className="w-100">
                  <div
                    onClick={() => toggleMenu("PROPERTIES")}
                    className={`w-100 d-flex align-items-center justify-content-between px-3 py-2.5 rounded-xl font-bold text-sm cursor-pointer select-none transition-all ${
                      pathname.startsWith('/properties') ? 'bg-slate-100 text-slate-900' : 'text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <span className="d-flex align-items-center gap-2.5">
                      <Building2 className="w-4 h-4 text-slate-500" />
                      <span>Propiedades</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${state.activeMenu === 'PROPERTIES' ? 'rotate-180' : ''}`} />
                  </div>

                  {state.activeMenu === 'PROPERTIES' && (
                    <div className="pl-3 pr-1 pt-2 pb-2 my-1 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-3 animate-in fade-in-0 duration-150">
                      <div>
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1 px-2">
                          Operaciones
                        </span>
                        <div className="space-y-0.5">
                          {[
                            { label: 'Todas las Propiedades', href: '/properties' },
                            { label: 'En Venta', href: '/properties?property_status=2' },
                            { label: 'En Alquiler / Renta', href: '/properties?property_status=1' },
                            { label: 'En Remate', href: '/properties?property_status=3' },
                            ...(isAuthenticated ? [{ label: 'Mis Propiedades (Gestión)', href: '/my-estates' }] : []),
                          ].map((op) => (
                            <Link
                              key={op.href}
                              href={op.href}
                              onClick={() => state.isSidebarOpen && toggleSidebar()}
                              className="d-flex align-items-center px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:bg-white hover:text-slate-900 text-decoration-none transition-colors"
                            >
                              <span>{op.label}</span>
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1 px-2">
                          Tipos de Inmueble ({NAVIGATION_PROPERTY_TYPES.length})
                        </span>
                        <div className="max-h-60 overflow-y-auto space-y-0.5 pr-1 scrollbar-thin">
                          {NAVIGATION_PROPERTY_TYPES.map((t) => (
                            <Link
                              key={t.id}
                              href={`/properties?property_type=${t.id}`}
                              onClick={() => state.isSidebarOpen && toggleSidebar()}
                              className="d-flex align-items-center px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-white hover:text-slate-900 text-decoration-none transition-colors"
                            >
                              <span>{t.label}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Servicios */}
                <Link
                  href="/services"
                  onClick={() => state.isSidebarOpen && toggleSidebar()}
                  className={`w-100 d-flex align-items-center justify-content-between px-3 py-2.5 rounded-xl font-bold text-sm text-decoration-none transition-all ${
                    pathname === '/services' || pathname === '/servicios' ? 'text-white shadow-xs' : 'text-slate-800 hover:bg-slate-100'
                  }`}
                  style={pathname === '/services' || pathname === '/servicios' ? { backgroundColor: primaryColor } : {}}
                >
                  <span className="d-flex align-items-center gap-2.5">
                    <Briefcase className="w-4 h-4 opacity-80" />
                    <span>Servicios</span>
                  </span>
                </Link>

                {/* 4. Conócenos */}
                <Link
                  href="/about"
                  onClick={() => state.isSidebarOpen && toggleSidebar()}
                  className={`w-100 d-flex align-items-center justify-content-between px-3 py-2.5 rounded-xl font-bold text-sm text-decoration-none transition-all ${
                    pathname === '/about' || pathname === '/conocenos' ? 'text-white shadow-xs' : 'text-slate-800 hover:bg-slate-100'
                  }`}
                  style={pathname === '/about' || pathname === '/conocenos' ? { backgroundColor: primaryColor } : {}}
                >
                  <span className="d-flex align-items-center gap-2.5">
                    <Users className="w-4 h-4 opacity-80" />
                    <span>Conócenos</span>
                  </span>
                </Link>

                {/* 5. Contacto */}
                <Link
                  href="/contact"
                  onClick={() => state.isSidebarOpen && toggleSidebar()}
                  className={`w-100 d-flex align-items-center justify-content-between px-3 py-2.5 rounded-xl font-bold text-sm text-decoration-none transition-all ${
                    pathname === '/contact' || pathname === '/contacto' ? 'text-white shadow-xs' : 'text-slate-800 hover:bg-slate-100'
                  }`}
                  style={pathname === '/contact' || pathname === '/contacto' ? { backgroundColor: primaryColor } : {}}
                >
                  <span className="d-flex align-items-center gap-2.5">
                    <Phone className="w-4 h-4 opacity-80" />
                    <span>Contacto</span>
                  </span>
                </Link>

                {/* 6. Privacidad */}
                <Link
                  href="/privacy"
                  onClick={() => state.isSidebarOpen && toggleSidebar()}
                  className={`w-100 d-flex align-items-center justify-content-between px-3 py-2.5 rounded-xl font-bold text-sm text-decoration-none transition-all ${
                    pathname === '/privacy' ? 'text-white shadow-xs' : 'text-slate-800 hover:bg-slate-100'
                  }`}
                  style={pathname === '/privacy' ? { backgroundColor: primaryColor } : {}}
                >
                  <span className="d-flex align-items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 opacity-80" />
                    <span>Privacidad</span>
                  </span>
                </Link>
              </div>

              {/* Botón Descargar App en Mobile si está disponible */}
              {playStoreUrl && (
                <div className="pt-2 w-100">
                  <a
                    href={playStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-100 d-flex align-items-center justify-content-between px-3 py-2.5 rounded-xl font-bold text-xs text-decoration-none transition-all text-slate-800 bg-emerald-50/80 hover:bg-emerald-100/80 border border-emerald-200/80"
                  >
                    <span className="d-flex align-items-center gap-2">
                      <svg className="w-4 h-4 fill-current shrink-0 text-emerald-600" viewBox="0 0 24 24">
                        <path d="M3.609 1.814L13.793 12 3.61 22.186a2.38 2.38 0 0 1-.61-.786 2.36 2.36 0 0 1-.22-.979V3.579c0-.353.076-.69.22-.98.143-.29.356-.563.609-.785zm11.256 11.258l2.25 2.25-11.442 6.608 9.192-8.858zm0-2.144L5.673 2.07l11.442 6.608-2.25 2.25zm1.536 1.072l3.414 1.972a1.44 1.44 0 0 1 0 2.496l-3.414 1.972-2.183-2.183 2.183-2.257z" />
                      </svg>
                      <span>Descargar en Google Play</span>
                    </span>
                    <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                      App
                    </span>
                  </a>
                </div>
              )}

              {/* Botón Acceso Agentes / Mi Panel en Mobile */}
              <div className="pt-3 mt-2 border-t border-slate-100 w-100">
                <button
                  type="button"
                  onClick={() => {
                    if (state.isSidebarOpen) toggleSidebar();
                    if (isAuthenticated) {
                      router.push('/dashboard');
                    } else {
                      setIsLoginModalOpen(true);
                    }
                  }}
                  className="w-100 d-flex align-items-center justify-content-center gap-2"
                  style={{
                    backgroundColor: buttonColor,
                    borderRadius: '12px',
                    padding: '12px 20px',
                    fontWeight: 800,
                    fontSize: '13.5px',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: `0 4px 14px ${buttonColor}40`,
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  <span>{isAuthenticated ? 'Mi Panel' : 'Acceso Agentes'}</span>
                </button>

                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => {
                      if (state.isSidebarOpen) toggleSidebar();
                      logout();
                    }}
                    className="w-100 d-flex align-items-center justify-content-center gap-2 mt-2"
                    style={{
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                      padding: '10px 16px',
                      fontWeight: 700,
                      fontSize: '12.5px',
                      color: '#e11d48',
                      border: '1px solid #e2e8f0',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span>Cerrar Sesión</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Lado Derecho: Botón Acceso Agentes + Botón Navegación Móvil */}
        <div className="nav-right d-flex align-items-center justify-content-end gap-2 shrink-0" style={{ flex: '0 0 auto' }}>
          {playStoreUrl && (
            <a
              href={playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="d-none d-lg-inline-flex align-items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all no-underline shadow-2xs"
              title="Descargar en Google Play"
            >
              <svg className="w-3.5 h-3.5 fill-current shrink-0 text-slate-700" viewBox="0 0 24 24">
                <path d="M3.609 1.814L13.793 12 3.61 22.186a2.38 2.38 0 0 1-.61-.786 2.36 2.36 0 0 1-.22-.979V3.579c0-.353.076-.69.22-.98.143-.29.356-.563.609-.785zm11.256 11.258l2.25 2.25-11.442 6.608 9.192-8.858zm0-2.144L5.673 2.07l11.442 6.608-2.25 2.25zm1.536 1.072l3.414 1.972a1.44 1.44 0 0 1 0 2.496l-3.414 1.972-2.183-2.183 2.183-2.257z" />
              </svg>
              <span>App</span>
            </a>
          )}

          <button
            type="button"
            onClick={() => {
              if (isAuthenticated) {
                router.push('/dashboard');
              } else {
                setIsLoginModalOpen(true);
              }
            }}
            className="d-xl-inline-flex d-none align-items-center gap-2"
            style={{
              backgroundColor: buttonColor,
              borderRadius: '10px',
              padding: '8px 18px',
              fontWeight: 800,
              fontSize: '13.5px',
              color: '#ffffff',
              border: 'none',
              boxShadow: `0 4px 12px ${buttonColor}40`,
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              whiteSpace: 'nowrap',
            }}
          >
            <svg width={15} height={15} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <span>{isAuthenticated ? 'Mi Panel' : 'Acceso Agentes'}</span>
          </button>

          <button
            type="button"
            onClick={toggleSidebar}
            className="d-xl-none d-inline-flex align-items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer border shrink-0"
            style={{
              backgroundColor: '#ffffff',
              borderColor: '#cbd5e1',
              color: '#0f172a',
            }}
            aria-label="Abrir navegación móvil"
          >
            <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            <span style={{ fontSize: '12px', fontWeight: 800 }}>Navegación</span>
          </button>
        </div>
      </div>

      {/* Modal de Inicio de Sesión para el Frontend */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        agency={effectiveAgency}
      />

      {/* Barra de Navegación Inferior para Móviles */}
      <MobileBottomNavigation agency={effectiveAgency} />
    </header>
  );
};

export default Header2Style3;
