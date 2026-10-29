"use client";
import React, { useEffect, useReducer, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { getCachedAgencyConfig } from "@/services/publicInmobiliariaService";

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
  const primaryColor = effectiveAgency?.primary_color || '#00a884';
  const buttonColor = effectiveAgency?.button_color || effectiveAgency?.primary_color || '#00a884';
  const rawName = effectiveAgency?.name || effectiveAgency?.commercial_name;
  const agencyName = rawName || '';

  return (
    <header className={`header-area style-2 travel-agency3 ${state.scrollY > 20 ? "sticky" : ""}`} suppressHydrationWarning>
      <div className="container-fluid d-flex flex-nowrap align-items-center justify-content-between px-3 px-sm-4 px-xl-5" suppressHydrationWarning>
        {/* 1. Lado Izquierdo: Logotipo */}
        <div className="header-logo-area d-flex align-items-center shrink-0" style={{ flex: '0 0 auto', minWidth: '180px' }} suppressHydrationWarning>
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

            <Link
              href="/login"
              className="d-xl-none d-flex align-items-center justify-content-center gap-2 mt-4"
              style={{
                backgroundColor: buttonColor,
                borderRadius: '10px',
                padding: '11px 20px',
                fontWeight: 800,
                fontSize: '13.5px',
                color: '#ffffff',
                border: 'none',
                textDecoration: 'none',
                boxShadow: `0 4px 12px ${buttonColor}40`,
              }}
            >
              <svg width={15} height={15} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              <span>Acceso Agentes</span>
            </Link>
          </div>
        </div>

        {/* 3. Lado Derecho: Botón Acceso Agentes (Verde Esmeralda con esquinas redondeadas) */}
        <div className="nav-right d-flex align-items-center justify-content-end gap-3 shrink-0" style={{ flex: '0 0 auto', minWidth: '180px' }}>
          <Link
            href="/login"
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
              textDecoration: 'none',
              transition: 'all 0.2s ease-in-out',
              whiteSpace: 'nowrap',
            }}
          >
            <svg width={15} height={15} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <span>Acceso Agentes</span>
          </Link>

          <div className="sidebar-button mobile-menu-btn d-xl-none" onClick={toggleSidebar}>
            <svg width={20} height={18} viewBox="0 0 20 18" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.29445 2.8421H10.5237C11.2389 2.8421 11.8182 2.2062 11.8182 1.42105C11.8182 0.635903 11.2389 0 10.5237 0H1.29445C0.579249 0 0 0.635903 0 1.42105C0 2.2062 0.579249 2.8421 1.29445 2.8421Z" />
              <path d="M1.23002 10.421H18.77C19.4496 10.421 20 9.78506 20 8.99991C20 8.21476 19.4496 7.57886 18.77 7.57886H1.23002C0.550421 7.57886 0 8.21476 0 8.99991C0 9.78506 0.550421 10.421 1.23002 10.421Z" />
              <path d="M18.8052 15.1579H10.2858C9.62563 15.1579 9.09094 15.7938 9.09094 16.5789C9.09094 17.3641 9.62563 18 10.2858 18H18.8052C19.4653 18 20 17.3641 20 16.5789C20 15.7938 19.4653 15.1579 18.8052 15.1579Z" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header2Style3;
