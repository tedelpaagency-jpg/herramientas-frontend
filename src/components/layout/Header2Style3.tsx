"use client";
import React, { useEffect, useReducer, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { getCachedAgencyConfig } from "@/services/publicInmobiliariaService";
import { useAuth } from "@/context/AuthContext";
import LoginModal from "@/components/auth/LoginModal";

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
  const { user, isAuthenticated } = useAuth();
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

  return (
    <header className={`header-area style-2 travel-agency3 ${state.scrollY > 20 ? "sticky" : ""}`} suppressHydrationWarning>
      <div className="container-fluid d-flex flex-nowrap align-items-center justify-content-between px-3 px-sm-4 px-xl-5" suppressHydrationWarning>
        {/* 1. Lado Izquierdo: Logotipo */}
        <div className="header-logo-area d-flex align-items-center shrink-0" style={{ flex: '0 0 auto' }} suppressHydrationWarning>
          <Link href="/" className="header-logo" suppressHydrationWarning style={{ display: 'flex', alignItems: 'center', minHeight: '62px', textDecoration: 'none' }}>
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={agencyName || 'Logo Inmobiliaria'}
                loading="eager"
                decoding="sync"
                style={{ maxHeight: '64px', maxWidth: '280px', width: 'auto', height: 'auto', objectFit: 'contain', transition: 'all 0.2s ease-in-out' }}
              />
            ) : agencyName ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    backgroundColor: primaryColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '22px',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                    flexShrink: 0,
                  }}
                >
                  {agencyName.charAt(0).toUpperCase()}
                </div>
                <span
                  style={{
                    fontSize: '23px',
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
              <div style={{ width: '150px', height: '44px', borderRadius: '8px', backgroundColor: '#f1f5f9' }} />
            )}
          </Link>
        </div>

        {/* 2. Centro: Navegación Completamente Centrada */}
        <div className="header-nav-center d-flex align-items-center justify-content-center flex-grow-1" style={{ textAlign: 'center' }}>
          <div className={`main-menu ${state.isSidebarOpen ? "show-menu" : ""}`}>
            <div className="mobile-logo-area d-xl-none d-flex align-items-center justify-content-between">
              <Link href="/" className="mobile-logo-wrap" suppressHydrationWarning style={{ textDecoration: 'none' }}>
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={agencyName || 'Logo Inmobiliaria'}
                    loading="eager"
                    decoding="sync"
                    style={{ maxHeight: '52px', maxWidth: '220px', width: 'auto', height: 'auto', objectFit: 'contain' }}
                  />
                ) : agencyName ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        backgroundColor: primaryColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontWeight: 900,
                        fontSize: '18px',
                        flexShrink: 0,
                      }}
                    >
                      {agencyName.charAt(0).toUpperCase()}
                    </div>
                    <span
                      style={{
                        fontSize: '20px',
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
              <div className="menu-close-btn" onClick={toggleSidebar}>
                <i className="bi bi-x" />
              </div>
            </div>

            <ul className="menu-list d-flex align-items-center justify-content-center m-0 p-0" style={{ listStyle: 'none' }}>
              <li className={`${pathname === '/' || pathname === '/travel-agency-03' ? 'active' : ''}`}>
                <Link href="/" className="drop-down" onClick={() => state.isSidebarOpen && toggleSidebar()}>
                  Inicio
                </Link>
              </li>

              <li className={`menu-item-has-children ${pathname.startsWith('/properties') ? 'active' : ''}`}>
                <Link href="/properties" className="drop-down" onClick={() => state.isSidebarOpen && toggleSidebar()}>
                  Propiedades
                  <i className="bi bi-caret-down-fill" />
                </Link>
                <i onClick={() => toggleMenu("PROPERTIES")} className={`bi bi-${state.activeMenu === "PROPERTIES" ? "dash" : "plus"} dropdown-icon`} />
                <ul className={`sub-menu ${state.activeMenu === "PROPERTIES" ? "d-block" : "none"}`}>
                  <li><Link href="/properties" onClick={() => state.isSidebarOpen && toggleSidebar()}>Todas las Propiedades</Link></li>
                  <li><Link href="/properties?property_status=2" onClick={() => state.isSidebarOpen && toggleSidebar()}>En Venta</Link></li>
                  <li><Link href="/properties?property_status=1" onClick={() => state.isSidebarOpen && toggleSidebar()}>En Alquiler / Renta</Link></li>
                  <li><Link href="/properties?property_type=1" onClick={() => state.isSidebarOpen && toggleSidebar()}>Casas &amp; Residencias</Link></li>
                  <li><Link href="/properties?property_type=2" onClick={() => state.isSidebarOpen && toggleSidebar()}>Departamentos &amp; Lofts</Link></li>
                  <li><Link href="/properties?property_type=3" onClick={() => state.isSidebarOpen && toggleSidebar()}>Terrenos &amp; Lotes</Link></li>
                  <li><Link href="/properties?property_type=4" onClick={() => state.isSidebarOpen && toggleSidebar()}>Oficinas &amp; Locales</Link></li>
                </ul>
              </li>

              <li className={pathname === '/about' || pathname === '/conocenos' ? 'active' : ''}>
                <Link
                  href="/about"
                  onClick={() => state.isSidebarOpen && toggleSidebar()}
                >
                  Conócenos
                </Link>
              </li>

              <li className={pathname === '/contact' || pathname === '/contacto' ? 'active' : ''}>
                <Link
                  href="/contact"
                  onClick={() => state.isSidebarOpen && toggleSidebar()}
                >
                  Contacto
                </Link>
              </li>
            </ul>

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
              className="d-xl-none d-flex align-items-center justify-content-center gap-2 mt-4 w-100"
              style={{
                backgroundColor: buttonColor,
                borderRadius: '10px',
                padding: '11px 20px',
                fontWeight: 800,
                fontSize: '13.5px',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                boxShadow: `0 4px 12px ${buttonColor}40`,
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <svg width={15} height={15} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              <span>{isAuthenticated ? 'Mi Panel' : 'Acceso Agentes'}</span>
            </button>
          </div>
        </div>

        {/* 3. Lado Derecho: Botón Acceso Agentes + Botón Navegación Móvil */}
        <div className="nav-right d-flex align-items-center justify-content-end gap-2 shrink-0" style={{ flex: '0 0 auto' }}>
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
            className="d-xl-none d-inline-flex align-items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer border"
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
    </header>
  );
};

export default Header2Style3;
