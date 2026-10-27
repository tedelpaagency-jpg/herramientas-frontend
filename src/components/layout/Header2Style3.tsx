"use client";
import React, { useEffect, useReducer } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

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

  const agencyPhone = agency?.phone || agency?.whatsapp || '+52 55 1234 5678';
  const rawLogo = agency?.logo || agency?.logo_2;
  const hasCustomLogo = Boolean(
    rawLogo &&
      typeof rawLogo === 'string' &&
      rawLogo.trim() !== '' &&
      !rawLogo.includes('header-logo2.svg') &&
      !rawLogo.includes('header-logo.svg')
  );
  const logoUrl = hasCustomLogo ? rawLogo : null;
  const primaryColor = agency?.primary_color || '#00a884';
  const agencyName = agency?.name || 'Inmobiliaria';

  return (
    <header className={`header-area style-2 travel-agency3 ${state.scrollY > 20 ? "sticky" : ""}`}>
      <div className="container-fluid d-flex flex-nowrap align-items-center justify-content-between">
        <div className="logo-and-menu-area">
          <Link href="/" className="header-logo" style={{ display: 'flex', alignItems: 'center', minHeight: '50px', textDecoration: 'none' }}>
            {logoUrl ? (
              <img src={logoUrl} alt={agencyName} style={{ maxHeight: '46px', maxWidth: '210px', width: 'auto', objectFit: 'contain' }} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
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
            )}
          </Link>
          <div className={`main-menu ${state.isSidebarOpen ? "show-menu" : ""}`}>
            <div className="mobile-logo-area d-xl-none d-flex align-items-center justify-content-between">
              <Link href="/" className="mobile-logo-wrap" style={{ textDecoration: 'none' }}>
                {logoUrl ? (
                  <img src={logoUrl} alt={agencyName} style={{ maxHeight: '42px', maxWidth: '180px', width: 'auto', objectFit: 'contain' }} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '10px',
                        backgroundColor: primaryColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontWeight: 900,
                        fontSize: '16px',
                      }}
                    >
                      {agencyName.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a' }}>
                      {agencyName}
                    </span>
                  </div>
                )}
              </Link>
              <div className="menu-close-btn" onClick={toggleSidebar}>
                <i className="bi bi-x" />
              </div>
            </div>
            <ul className="menu-list">
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
                <ul className={`sub-menu ${state.activeMenu === "PROPERTIES" ? "d-block" : "none"}`}>
                  <li><Link href="/properties">Todas las Propiedades</Link></li>
                  <li><Link href="/properties?property_status=1">En Venta</Link></li>
                  <li><Link href="/properties?property_status=2">En Alquiler / Renta</Link></li>
                  <li><Link href="/properties?property_type=1">Casas &amp; Residencias</Link></li>
                  <li><Link href="/properties?property_type=2">Departamentos &amp; Lofts</Link></li>
                  <li><Link href="/properties?property_type=3">Terrenos &amp; Lotes</Link></li>
                  <li><Link href="/properties?property_type=4">Oficinas &amp; Locales</Link></li>
                </ul>
              </li>

              <li>
                <Link href={pathname === '/' || pathname === '/travel-agency-03' ? '#categorias' : '/#categorias'}>
                  Categorías
                </Link>
              </li>

              <li>
                <Link href={pathname === '/' || pathname === '/travel-agency-03' ? '#nosotros' : '/#nosotros'}>
                  Conócenos
                </Link>
              </li>

              <li>
                <Link href={pathname === '/' || pathname === '/travel-agency-03' ? '#destacadas' : '/#destacadas'}>
                  Destacadas
                </Link>
              </li>

              <li>
                <Link href={pathname === '/' || pathname === '/travel-agency-03' ? '#contacto' : '/#contacto'}>
                  Contacto
                </Link>
              </li>
            </ul>

            <div className="contact-area d-xl-none d-flex">
              <div className="icon">
                <svg width={16} height={16} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.5646 11.7424L13.3317 9.50954C12.5343 8.7121 11.1786 9.03111 10.8596 10.0678C10.6204 10.7855 9.82296 11.1842 9.10526 11.0247C7.51037 10.626 5.35726 8.55261 4.95854 6.87797C4.71931 6.16024 5.19778 5.36279 5.91548 5.12359C6.95216 4.80461 7.27113 3.44895 6.47369 2.65151L4.24084 0.418659C3.60288 -0.139553 2.64595 -0.139553 2.08774 0.418659L0.572591 1.93381C-0.942555 3.5287 0.73208 7.75516 4.48007 11.5032C8.22807 15.2512 12.4545 17.0056 14.0494 15.4106L15.5646 13.8955C16.1228 13.2575 16.1228 12.3006 15.5646 11.7424Z" />
                </svg>
              </div>
              <div className="content">
                <span>¿Dudas o Citas?</span>
                <a href={`tel:${agencyPhone.replace(/\s+/g, '')}`}>{agencyPhone}</a>
              </div>
            </div>

            <Link href="/login" className="primary-btn1 black-bg d-xl-none d-flex">
              <span>Acceso Agentes</span>
              <span>Acceso Agentes</span>
            </Link>
          </div>
        </div>

        <div className="nav-right">
          <div className="contact-and-search-area">
            <div className="contact-area d-xl-flex d-none">
              <div className="icon">
                <svg width={16} height={16} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.5646 11.7424L13.3317 9.50954C12.5343 8.7121 11.1786 9.03111 10.8596 10.0678C10.6204 10.7855 9.82296 11.1842 9.10526 11.0247C7.51037 10.626 5.35726 8.55261 4.95854 6.87797C4.71931 6.16024 5.19778 5.36279 5.91548 5.12359C6.95216 4.80461 7.27113 3.44895 6.47369 2.65151L4.24084 0.418659C3.60288 -0.139553 2.64595 -0.139553 2.08774 0.418659L0.572591 1.93381C-0.942555 3.5287 0.73208 7.75516 4.48007 11.5032C8.22807 15.2512 12.4545 17.0056 14.0494 15.4106L15.5646 13.8955C16.1228 13.2575 16.1228 12.3006 15.5646 11.7424Z" />
                </svg>
              </div>
              <div className="content">
                <span>Atención Telefónica</span>
                <a href={`tel:${agencyPhone.replace(/\s+/g, '')}`}>{agencyPhone}</a>
              </div>
            </div>

            <div className="search-bar">
              <div className="search-btn" onClick={toggleSearchbar} title="Buscar Propiedad">
                <svg width={16} height={16} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.7417 14.6098L13.486 12.3621C14.7088 10.8514 15.3054 8.9291 15.1526 6.99153C14.9998 5.05396 14.1093 3.24888 12.6648 1.94851C11.2203 0.648146 9.33193 -0.0483622 7.38901 0.00261294C5.44609 0.0535881 3.59681 0.84816 2.22248 2.22248C0.84816 3.59681 0.0535881 5.44609 0.00261294 7.38901C-0.0483622 9.33193 0.648146 11.2203 1.94851 12.6648C3.24888 14.1093 5.05396 14.9998 6.99153 15.1526C8.9291 15.3054 10.8514 14.7088 12.3621 13.486L14.6098 15.7417C14.7721 15.904 15.0379 15.904 15.2002 15.7417C15.3625 15.5794 15.3625 15.3136 15.2002 15.1513L15.7417 14.6098ZM1.62572 7.60368C1.62572 4.30752 4.30752 1.62572 7.60368 1.62572C10.8998 1.62572 13.5816 4.30752 13.5816 7.60368C13.5816 10.8998 10.8998 13.5816 7.60368 13.5816C4.30752 13.5816 1.62572 10.8998 1.62572 7.60368Z" />
                </svg>
              </div>
              <div className={`search-input ${state.isSearchbar ? "active" : ""}`}>
                <div className="search-close" onClick={toggleSearchbar} />
                <form action="/properties" method="GET">
                  <div className="search-group">
                    <div className="form-inner2">
                      <input type="text" name="search" placeholder="Buscar por ciudad, colonia o código..." />
                      <button type="submit"><i className="bi bi-search" /></button>
                    </div>
                  </div>
                  <div className="quick-search">
                    <ul>
                      <li>Búsquedas Rápidas :</li>
                      <li><Link href="/properties?property_status=1">En Venta,</Link></li>
                      <li><Link href="/properties?property_status=2">En Renta,</Link></li>
                      <li><Link href="/properties?property_type=1">Casas,</Link></li>
                      <li><Link href="/properties?property_type=2">Departamentos,</Link></li>
                      <li><Link href="/properties?property_type=3">Terrenos</Link></li>
                    </ul>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <Link href="/login" className="primary-btn1 black-bg d-xl-flex d-none">
            <span>
              <svg width={15} height={15} viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.50105 7.78913C9.64392 7.78913 11.3956 6.03744 11.3956 3.89456C11.3956 1.75169 9.64392 0 7.50105 0C5.35818 0 3.60652 1.75169 3.60652 3.89456C3.60652 6.03744 5.35821 7.78913 7.50105 7.78913ZM14.1847 10.9014C14.0827 10.6463 13.9467 10.4082 13.7936 10.1871C13.0113 9.0306 11.8038 8.2653 10.4433 8.07822C10.2732 8.06123 10.0861 8.09522 9.95007 8.19727C9.23578 8.72448 8.38546 8.99658 7.50108 8.99658C6.61671 8.99658 5.76638 8.72448 5.05209 8.19727C4.91603 8.09522 4.72895 8.04421 4.5589 8.07822C3.19835 8.2653 1.97387 9.0306 1.20857 10.1871C1.05551 10.4082 0.919443 10.6633 0.817424 10.9014C0.766415 11.0034 0.783407 11.1225 0.834416 11.2245C0.970484 11.4626 1.14054 11.7007 1.2936 11.9048C1.53168 12.2279 1.78679 12.517 2.07592 12.7891C2.31401 13.0272 2.58611 13.2483 2.85824 13.4694C4.20177 14.4728 5.81742 15 7.48409 15C9.15076 15 10.7664 14.4728 12.1099 13.4694C12.382 13.2653 12.6541 13.0272 12.8923 12.7891C13.1644 12.517 13.4365 12.2279 13.6746 11.9048C13.8446 11.6837 13.9977 11.4626 14.1338 11.2245C14.2188 11.1225 14.2358 11.0034 14.1847 10.9014Z" />
              </svg>
              Acceso Agentes
            </span>
            <span>
              <svg width={15} height={15} viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.50105 7.78913C9.64392 7.78913 11.3956 6.03744 11.3956 3.89456C11.3956 1.75169 9.64392 0 7.50105 0C5.35818 0 3.60652 1.75169 3.60652 3.89456C3.60652 6.03744 5.35821 7.78913 7.50105 7.78913ZM14.1847 10.9014C14.0827 10.6463 13.9467 10.4082 13.7936 10.1871C13.0113 9.0306 11.8038 8.2653 10.4433 8.07822C10.2732 8.06123 10.0861 8.09522 9.95007 8.19727C9.23578 8.72448 8.38546 8.99658 7.50108 8.99658C6.61671 8.99658 5.76638 8.72448 5.05209 8.19727C4.91603 8.09522 4.72895 8.04421 4.5589 8.07822C3.19835 8.2653 1.97387 9.0306 1.20857 10.1871C1.05551 10.4082 0.919443 10.6633 0.817424 10.9014C0.766415 11.0034 0.783407 11.1225 0.834416 11.2245C0.970484 11.4626 1.14054 11.7007 1.2936 11.9048C1.53168 12.2279 1.78679 12.517 2.07592 12.7891C2.31401 13.0272 2.58611 13.2483 2.85824 13.4694C4.20177 14.4728 5.81742 15 7.48409 15C9.15076 15 10.7664 14.4728 12.1099 13.4694C12.382 13.2653 12.6541 13.0272 12.8923 12.7891C13.1644 12.517 13.4365 12.2279 13.6746 11.9048C13.8446 11.6837 13.9977 11.4626 14.1338 11.2245C14.2188 11.1225 14.2358 11.0034 14.1847 10.9014Z" />
              </svg>
              Acceso Agentes
            </span>
          </Link>

          <div className="sidebar-button mobile-menu-btn" onClick={toggleSidebar}>
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
