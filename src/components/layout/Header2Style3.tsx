"use client"
import React, { useEffect, useReducer } from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

// Define the shape of the state
interface State {
  activeMenu: string;
  activeSubMenu: string;
  isSidebarOpen: boolean;
  isLeftSidebarOpen: boolean;
  isSearchbar: boolean;
  isLang: boolean;
  isContact: boolean;
  scrollY: number; // Initialize scrollY as it's used in a template literal
}

// Define the types for all possible actions
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
  scrollY: 0, // Initial value for scrollY
};

// Type the reducer function
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
      // This default case should ideally not be reached if all action types are covered.
      // For strict type checking, you might use `const exhaustiveCheck: never = action;` here.
      return state;
  }
}


const Header2Style3 = () => {
  // Type the useReducer hook
  const [state, dispatch] = useReducer(reducer, initialState);
  // Type the useRef hook for an HTMLElement (specifically a <header> element)
  // usePathname can return string | null, asserting as string for common use case
  const pathname = usePathname() as string;

  const handleScroll = () => {
    // Ensure window is defined for client-side operations
    if (typeof window !== 'undefined') {
      const { scrollY } = window;
      dispatch({ type: "setScrollY", payload: scrollY });
    }
  };

  useEffect(() => {
    // Add event listener only on the client side
    if (typeof window !== 'undefined') {
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  // Type function parameters
  const toggleMenu = (menu: string) => {
    dispatch({ type: "TOGGLE_MENU", menu });
  };

  const toggleSearchbar = () => {
    dispatch({ type: "TOGGLE_SEARCHBAR" });
  };


  const toggleSubMenu = (subMenu: string) => {
    dispatch({ type: "TOGGLE_SUB_MENU", subMenu });
  };

  const toggleSidebar = () => {
    dispatch({ type: "TOGGLE_MENU", menu: "" });
    dispatch({ type: "TOGGLE_SUB_MENU", subMenu: "" });
    dispatch({ type: "TOGGLE_SIDEBAR" });
  };
  const homePaths: string[] = [
    "/travel-agency-01",
    '/travel-agency-02',
    '/travel-agency-03',
    '/travel-agency-04',
    '/experience-01',
    '/experience-02',
    '/visa-agency',
    '/',
  ];
  const visaPaths: string[] = [
    "/visa",
    '/vis/details',
  ];
  const travelpath: string[] = [
    "/travel-package",
    '/travel-package/details',
    '/travel-package/style2',
  ];
  const innerPagePaths = [
    "/shop",
    "/checkout",
    "/product-details",
    "/guider",
    "/guider-details",
    "/travel-inspiration",
    "/travel-inspiration/style2",
    "/travel-inspiration/style3",
    "/travel-inspiration/details",
    "/hotel",
    "/hotel/details",
    "/experience-grid",
    "/experience-details",
    "/career",
    "/career-details",
    "/cart",
    "/checkout",
    "/faq",
    "our-clients",
    "/our-process",
    "/our-team",
    "/product",
    "/product/details",
    "/shop",
    "/shop-details",
    "/checkout",
    "/contact",
    "/error",
  ];
  const isInnerPagePaths = innerPagePaths.some((path) => pathname.startsWith(path));
  const istravelActive = travelpath.some((path) => pathname.startsWith(path));
  const isVisaPathsActive = visaPaths.some((path) => pathname.startsWith(path));
  const isHomeActive: boolean = homePaths.some((path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  });
  return (
    <header className={`header-area style-2 travel-agency3 ${state.scrollY > 20 ? "sticky" : ""}`}>
      <div className="container-fluid d-flex flex-nowrap align-items-center justify-content-between">
        <div className="logo-and-menu-area">
          <Link href="/" className="header-logo">
            <Image width={550} height={220} src="/assets/img/header-logo2.svg" alt="" />
          </Link>
          <div className={`main-menu ${state.isSidebarOpen ? "show-menu" : ""}`}>
            <div className="mobile-logo-area d-xl-none d-flex align-items-center justify-content-between">
              <Link href="/" className="mobile-logo-wrap">
                <Image width={550} height={220} src="/assets/img/header-logo2.svg" alt="" />
              </Link>
              <div className="menu-close-btn" onClick={toggleSidebar}>
                <i className="bi bi-x" />
              </div>
            </div>
            <ul className="menu-list">
              <li className={`menu-item-has-children  ${isHomeActive ? "active" : ""}`}>
                <Link href="/" className="drop-down">
                  Home
                  <i className="bi bi-caret-down-fill" />
                </Link>
                <i onClick={() => toggleMenu("HOME")} className={`bi bi-${state.activeMenu === "HOME" ? "dash" : "plus"} dropdown-icon`} />
                <ul className={`sub-menu ${state.activeMenu === "HOME" ? "d-block" : "none"}`}>
                  <li ><Link href="/">Main Home</Link></li>
                  <li className={`${pathname === "/travel-agency-01" ? "active" : ""}`}><Link href="/travel-agency-01">Travel Agency-01</Link></li>
                  <li className={`${pathname === "/travel-agency-02" ? "active" : ""}`}><Link href="/travel-agency-02">Travel Agency-02</Link></li>
                  <li className={`${pathname === "/travel-agency-03" ? "active" : ""}`}><Link href="/travel-agency-03">Travel Agency-03</Link></li>
                  <li className={`${pathname === "/travel-agency-04" ? "active" : ""}`}><Link href="/travel-agency-04">Travel Agency-04</Link></li>
                  <li className={`${pathname === "/experience-01" ? "active" : ""}`}><Link href="/experience-01">Experience-01</Link></li>
                  <li className={`${pathname === "/experience-02" ? "active" : ""}`}><Link href="/experience-02">Experience-02</Link></li>
                  <li className={`${pathname === "/visa-agency" ? "active" : ""}`}><Link href="/visa-agency">Visa Agency</Link></li>
                </ul>
              </li>
              <li className="menu-item-has-children position-inherit">
                <Link href="/destination" className="drop-down">
                  Destination
                  <i className="bi bi-caret-down-fill" />
                </Link>
                <i onClick={() => toggleMenu("destination")} className={`bi bi-${state.activeMenu === "destination" ? "dash" : "plus"} dropdown-icon`} />
                <div className={`mega-menu ${state.activeMenu === "destination" ? "d-block" : "none"}`}>
                  <div className="container">
                    <div className="menu-row">
                      <div className="menu-single-item">
                        <div className="menu-title">
                          <h5>Europe</h5>
                        </div>
                        <i onClick={() => toggleSubMenu("europe")} className={`bi bi-${state.activeSubMenu === "europe" ? "dash" : "plus"} dropdown-icon`} />
                        <ul className={`${state.activeSubMenu === "europe" ? "d-block" : "none"}`}>
                          <li>
                            <Link href="/destination/details">
                              <Image width={18} height={18} src="/assets/img/home1/france-flag.png" alt="" />
                              Paris, France
                            </Link>
                          </li>
                          <li>
                            <Link href="/destination/details">
                              <Image width={18} height={18} src="/assets/img/home1/uk-flag.png" alt="" />
                              United Kingdom
                            </Link>
                          </li>
                          <li>
                            <Link href="/destination/details">
                              <Image width={18} height={18} src="/assets/img/home1/netherland-flag.png" alt="" />
                              Netherlands
                            </Link>
                          </li>
                          <li>
                            <Link href="/destination/details">
                              <Image width={18} height={18} src="/assets/img/home1/italy-flag.png" alt="" />
                              Italy
                            </Link>
                          </li>
                          <li>
                            <Link href="/destination/details">
                              <Image width={18} height={18} src="/assets/img/home1/greece-flag.png" alt="" />
                              Greece
                            </Link>
                          </li>
                          <li>
                            <Link href="/destination/details">
                              <Image width={18} height={18} src="/assets/img/home1/romania-flag.png" alt="" />
                              Romania
                            </Link>
                          </li>
                        </ul>
                      </div>
                      <div className="menu-single-item">
                        <div className="menu-title">
                          <h5>Asia</h5>
                        </div>
                        <i onClick={() => toggleSubMenu("asia")} className={`bi bi-${state.activeSubMenu === "asia" ? "dash" : "plus"} dropdown-icon`} />
                        <ul className={`${state.activeSubMenu === "asia" ? "d-block" : "none"}`}>
                          <li>
                            <Link href="/destination/details">
                              <Image width={18} height={18} src="/assets/img/home1/japan-flag2.png" alt="" />
                              Tokyo, Japan
                            </Link>
                          </li>
                          <li>
                            <Link href="/destination/details">
                              <Image width={18} height={18} src="/assets/img/home1/indonesia-flag.png" alt="" />
                              Indonesia
                            </Link>
                          </li>
                          <li>
                            <Link href="/destination/details">
                              <Image width={18} height={18} src="/assets/img/home1/thailand-flag.png" alt="" />
                              Thailand
                            </Link>
                          </li>
                          <li>
                            <Link href="/destination/details">
                              <Image width={18} height={18} src="/assets/img/home1/malaysia-flag.png" alt="" />
                              Malaysia
                            </Link>
                          </li>
                          <li>
                            <Link href="/destination/details">
                              <Image width={18} height={18} src="/assets/img/home1/vietnam-flag.png" alt="" />
                              Hanoi, Vietnam
                            </Link>
                          </li>
                          <li>
                            <Link href="/destination/details">
                              <Image width={18} height={18} src="/assets/img/home1/india-flag.png" alt="" />
                              India
                            </Link>
                          </li>
                        </ul>
                      </div>
                      <div className="menu-single-item">
                        <div className="menu-title">
                          <h5>Africa</h5>
                        </div>
                        <i className="bi bi-plus dropdown-icon" />
                        <ul>
                          <li>
                            <Link href="/destination/details">
                              <Image width={18} height={18} src="/assets/img/home1/egypt-flag.png" alt="" />
                              Egypt
                            </Link>
                          </li>
                          <li>
                            <Link href="/destination/details">
                              <Image width={18} height={18} src="/assets/img/home1/south-africa-flag.png" alt="" />
                              South Africa
                            </Link>
                          </li>
                          <li>
                            <Link href="/destination/details">
                              <Image width={18} height={18} src="/assets/img/home1/zimbabwe-flag.png" alt="" />
                              Zimbabwe
                            </Link>
                          </li>
                          <li>
                            <Link href="/destination/details">
                              <Image width={18} height={18} src="/assets/img/home1/kenya-flag.png" alt="" />
                              Kenya
                            </Link>
                          </li>
                          <li>
                            <Link href="/destination/details">
                              <Image width={18} height={18} src="/assets/img/home1/morocco-flag.png" alt="" />
                              Morocco
                            </Link>
                          </li>
                          <li>
                            <Link href="/destination/details">
                              <Image width={18} height={18} src="/assets/img/home1/senegal-flag.png" alt="" />
                              Senegal
                            </Link>
                          </li>
                        </ul>
                      </div>
                      <div className="menu-single-item">
                        <div className="menu-title">
                          <h5>Oceania</h5>
                        </div>
                        <i onClick={() => toggleSubMenu("oceania")} className={`bi bi-${state.activeSubMenu === "oceania" ? "dash" : "plus"} dropdown-icon`} />
                        <ul className={`${state.activeSubMenu === "oceania" ? "d-block" : "none"}`}>
                          <li>
                            <Link href="/destination/details">
                              <Image width={18} height={18} src="/assets/img/home1/australia-flag.png" alt="" />
                              Australia
                            </Link>
                          </li>
                          <li>
                            <Link href="/destination/details">
                              <Image width={18} height={18} src="/assets/img/home1/south-africa-flag.png" alt="" />
                              New Zealand
                            </Link>
                          </li>
                          <li>
                            <Link href="/destination/details">
                              <Image width={18} height={18} src="/assets/img/home1/papua-new-guinea-flag.png" alt="" />
                              Papua New Guinea
                            </Link>
                          </li>
                        </ul>
                      </div>
                      <div className="menu-single-item">
                        <div className="menu-title">
                          <h5>Middle East</h5>
                        </div>
                        <i onClick={() => toggleSubMenu("middel-east")} className={`bi bi-${state.activeSubMenu === "middel-east" ? "dash" : "plus"} dropdown-icon`} />
                        <ul className={`${state.activeSubMenu === "middel-east" ? "d-block" : "none"}`}>
                          <li>
                            <Link href="/destination/details">
                              <Image width={18} height={18} src="/assets/img/home1/uae-flag.png" alt="" />
                              United Arab Emirates
                            </Link>
                          </li>
                          <li>
                            <Link href="/destination/details">
                              <Image width={18} height={18} src="/assets/img/home1/qatar-flag.png" alt="" />
                              Qatar
                            </Link>
                          </li>
                          <li>
                            <Link href="/destination/details">
                              <Image width={18} height={18} src="/assets/img/home1/bahrain-flag.png" alt="" />
                              Bahrain
                            </Link>
                          </li>
                          <li>
                            <Link href="/destination/details">
                              <Image width={18} height={18} src="/assets/img/home1/saudi-arabia-flag.png" alt="" />
                              Saudi Arabia
                            </Link>
                          </li>
                          <li>
                            <Link href="/destination/details">
                              <Image width={18} height={18} src="/assets/img/home1/jordan-flag.png" alt="" />
                              Jordan
                            </Link>
                          </li>
                          <li>
                            <Link href="/destination/details">
                              <Image width={18} height={18} src="/assets/img/home1/palestine-flag.png" alt="" />
                              Palestine
                            </Link>
                          </li>
                        </ul>
                      </div>
                      <div className="menu-single-item">
                        <div className="menu-title">
                          <h5>North America</h5>
                        </div>
                        <i onClick={() => toggleSubMenu("north-america")} className={`bi bi-${state.activeSubMenu === "north-america" ? "dash" : "plus"} dropdown-icon`} />
                        <ul className={`${state.activeSubMenu === "north-america" ? "d-block" : "none"}`}>
                          <li>
                            <Link href="/destination/details">
                              <Image width={18} height={18} src="/assets/img/home1/us-flag.png" alt="" />
                              United States
                            </Link>
                          </li>
                          <li>
                            <Link href="/destination/details">
                              <Image width={18} height={18} src="/assets/img/home1/canada-flag.png" alt="" />
                              Canada
                            </Link>
                          </li>
                          <li>
                            <Link href="/destination/details">
                              <Image width={18} height={18} src="/assets/img/home1/mexico-flag.png" alt="" />
                              Mexico
                            </Link>
                          </li>
                          <li>
                            <Link href="/destination/details">
                              <Image width={18} height={18} src="/assets/img/home1/jamaica-flag.png" alt="" />
                              Jamaica
                            </Link>
                          </li>
                          <li>
                            <Link href="/destination/details">
                              <Image width={18} height={18} src="/assets/img/home1/costa-rica-flag.png" alt="" />
                              Costa Rica
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <Image width={275} height={365} src="/assets/img/home1/mega-menu-vector1.svg" alt="" className="vector1" />
                  <Image width={275} height={365} src="/assets/img/home1/mega-menu-vector2.svg" alt="" className="vector2" />
                </div>
              </li>
              <li className={`menu-item-has-children ${istravelActive ? "active" : ""}`}>
                <Link href="/travel-package" className="drop-down">
                  Travel Package
                  <i className="bi bi-caret-down-fill" />
                </Link>
                <i onClick={() => toggleMenu("travel-package")} className={`bi bi-${state.activeMenu === "travel-package" ? "dash" : "plus"} dropdown-icon`} />
                <ul className={`sub-menu ${state.activeMenu === "travel-package" ? "d-block" : "none"}`}>
                  <li className={pathname === "/travel-package" ? "active" : ""}><Link href="/travel-package">Travel Package Style 01</Link></li>
                  <li className={pathname === "/travel-package/style2" ? "active" : ""}><Link href="/travel-package/style2">Travel Package Style 02</Link></li>
                  <li className={pathname === "/travel-package/details" ? "active" : ""}><Link href="/travel-package/details">Travel Package Details</Link></li>
                </ul>
              </li>
              <li className={`menu-item-has-children ${isVisaPathsActive ? "active" : ""}`}>
                <Link href="/visa" className="drop-down">
                  Visa
                  <i className="bi bi-caret-down-fill" />
                </Link>
                <i onClick={() => toggleMenu("visa")} className={`bi bi-${state.activeMenu === "visa" ? "dash" : "plus"} dropdown-icon`} />
                <ul className={`sub-menu ${state.activeMenu === "visa" ? "d-block" : "none"}`}>
                  <li className={pathname === "/visa" ? "active" : ""}><Link href="/visa">Visa Package</Link></li>
                  <li className={pathname === "/visa/details" ? "active" : ""}><Link href="/visa/details">Visa Package Details</Link></li>
                </ul>
              </li>
              <li className={`menu-item-has-children ${isInnerPagePaths ? "active" : ""}`}>
                <a href="#" className="drop-down">
                  Pages
                  <i className="bi bi-caret-down-fill" />
                </a>
                <i onClick={() => toggleMenu("pages")} className={`bi bi-${state.activeMenu === "pages" ? "dash" : "plus"} dropdown-icon`} />
                <ul className={`sub-menu ${state.activeMenu === "pages" ? "d-block" : "none"}`}>
                  <li className={pathname === "/about" ? "active" : ""}><Link href="/about">About GoFly</Link></li>
                  <li>
                    <Link href="/destination">Destination</Link>
                    <i className="d-lg-flex d-none bi-caret-right-fill dropdown-icon" />

                    <i onClick={() => toggleSubMenu("destinations")} className={`d-lg-none d-flex bi bi-${state.activeSubMenu === "destinations" ? "dash" : "plus"} dropdown-icon`} />
                    <ul className={`sub-menu ${state.activeSubMenu === "destinations" ? "d-block" : "none"}`}>
                      <li className={pathname === "/destination" ? "active" : ""}><Link href="/destination">Destination Style 01</Link></li>
                      <li className={pathname === "/destination/style2" ? "active" : ""}><Link href="/destination/style2">Destination Style 02</Link></li>
                      <li className={pathname === "/destination/style3" ? "active" : ""}><Link href="/destination/style3">Destination Style 03</Link></li>
                      <li className={pathname === "/destination/style4" ? "active" : ""}><Link href="/destination/style4">Destination Style 04</Link></li>
                      <li className={pathname === "/destination/style5" ? "active" : ""}><Link href="/destination/style5">Destination Style 05</Link></li>
                      <li className={pathname === "/destination/style6" ? "active" : ""}><Link href="/destination/style6">Destination Style 06</Link></li>
                      <li className={pathname === "/destination/details" ? "active" : ""}><Link href="/destination/details">Destination Details</Link></li>
                    </ul>
                  </li>
                  <li>
                    <Link href="/experience-grid">Experience</Link>
                    <i className="d-lg-flex d-none bi-caret-right-fill dropdown-icon" />
                    <i onClick={() => toggleSubMenu("expriences")} className={`d-lg-none d-flex bi bi-${state.activeSubMenu === "expriences" ? "dash" : "plus"} dropdown-icon`} />
                    <ul className={`sub-menu ${state.activeSubMenu === "expriences" ? "d-block" : "none"}`}>
                      <li className={pathname === "/experience-grid" ? "active" : ""}><Link href="/experience-grid">Experience Grid</Link></li>
                      <li className={pathname === "/experience-details" ? "active" : ""}><Link href="/experience-details">Experience Details</Link></li>
                    </ul>
                  </li>
                  <li>
                    <Link href="/hotel">Hotel</Link>
                    <i className="d-lg-flex d-none bi-caret-right-fill dropdown-icon" />
                    <i onClick={() => toggleSubMenu("hotel")} className={`d-lg-none d-flex bi bi-${state.activeSubMenu === "hotel" ? "dash" : "plus"} dropdown-icon`} />
                    <ul className={`sub-menu ${state.activeSubMenu === "hotel" ? "d-block" : "none"}`}>
                      <li className={pathname === "/hotel" ? "active" : ""}><Link href="/hotel">Hotel</Link></li>
                      <li className={pathname === "/hotel/details" ? "active" : ""}><Link href="/hotel/details">Hotel Details</Link></li>
                    </ul>
                  </li>
                  <li>
                    <Link href="/travel-inspiration">Travel Inspiration</Link>
                    <i className="d-lg-flex d-none bi-caret-right-fill dropdown-icon" />
                    <i onClick={() => toggleSubMenu("travel-inspiration")} className={`d-lg-none d-flex bi bi-${state.activeSubMenu === "travel-inspiration" ? "dash" : "plus"} dropdown-icon`} />
                    <ul className={`sub-menu ${state.activeSubMenu === "travel-inspiration" ? "d-block" : "none"}`}>
                      <li className={pathname === "/travel-inspiration" ? "active" : ""}><Link href="/travel-inspiration">Travel Inspiration Style 01</Link></li>
                      <li className={pathname === "/travel-inspiration/style2" ? "active" : ""}><Link href="/travel-inspiration/style2">Travel Inspiration Style 02</Link></li>
                      <li className={pathname === "/travel-inspiration/style3" ? "active" : ""}><Link href="/travel-inspiration/style3">Travel Inspiration Style 03</Link></li>
                      <li className={pathname === "/travel-inspiration/details" ? "active" : ""}><Link href="/travel-inspiration/details">Travel Inspiration Details</Link></li>
                    </ul>
                  </li>
                  <li>
                    <Link href="/guider">Guider</Link>
                    <i className="d-lg-flex d-none bi-caret-right-fill dropdown-icon" />
                    <i onClick={() => toggleSubMenu("guider")} className={`d-lg-none d-flex bi bi-${state.activeSubMenu === "guider" ? "dash" : "plus"} dropdown-icon`} />
                    <ul className={`sub-menu ${state.activeSubMenu === "guider" ? "d-block" : "none"}`}>
                      <li className={pathname === "/guider" ? "active" : ""}><Link href="/guider">Guider</Link></li>
                      <li className={pathname === "/guider-details" ? "active" : ""}><Link href="/guider-details">Guider Details</Link></li>
                    </ul>
                  </li>
                  <li>
                    <Link href="/shop">Shop</Link>
                    <i className="d-lg-flex d-none bi-caret-right-fill dropdown-icon" />
                    <i onClick={() => toggleSubMenu("shop")} className={`d-lg-none d-flex bi bi-${state.activeSubMenu === "shop" ? "dash" : "plus"} dropdown-icon`} />
                    <ul className={`sub-menu ${state.activeSubMenu === "shop" ? "d-block" : "none"}`}>
                      <li className={pathname === "/shop" ? "active" : ""}><Link href="/shop">Shop</Link></li>
                      <li className={pathname === "/cart" ? "active" : ""}><Link href="/cart">Cart</Link></li>
                      <li className={pathname === "/checkout" ? "active" : ""}><Link href="/checkout">Checkout</Link></li>
                      <li className={pathname === "/product-details" ? "active" : ""}><Link href="/product-details">Product Details</Link></li>
                    </ul>
                  </li>
                  <li className={pathname === "/faq" ? "active" : ""}><Link href="/faq">Faq</Link></li>
                  <li className={pathname === "/error" ? "active" : ""}><Link href="/error">404</Link></li>
                </ul>
              </li>
              <li className={pathname === "/contact" ? "active" : ""}><Link href="/contact">Contact</Link></li>
            </ul>
            <div className="contact-area d-xl-none d-flex">
              <div className="icon">
                <svg width={16} height={16} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <g>
                    <path d="M15.5646 11.7424L13.3317 9.50954C12.5343 8.7121 11.1786 9.03111 10.8596 10.0678C10.6204 10.7855 9.82296 11.1842 9.10526 11.0247C7.51037 10.626 5.35726 8.55261 4.95854 6.87797C4.71931 6.16024 5.19778 5.36279 5.91548 5.12359C6.95216 4.80461 7.27113 3.44895 6.47369 2.65151L4.24084 0.418659C3.60288 -0.139553 2.64595 -0.139553 2.08774 0.418659L0.572591 1.93381C-0.942555 3.5287 0.73208 7.75516 4.48007 11.5032C8.22807 15.2512 12.4545 17.0056 14.0494 15.4106L15.5646 13.8955C16.1228 13.2575 16.1228 12.3006 15.5646 11.7424Z" />
                  </g>
                </svg>
              </div>
              <div className="content">
                <span>Need Help?</span>
                <a href="tel:91345533865">+91 345 533 865</a>
              </div>
            </div>
            <a href="#" className="primary-btn1 black-bg d-xl-none d-flex">
              <span>
                <svg width={15} height={15} viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
                  <g>
                    <path d="M7.50105 7.78913C9.64392 7.78913 11.3956 6.03744 11.3956 3.89456C11.3956 1.75169 9.64392 0 7.50105 0C5.35818 0 3.60652 1.75169 3.60652 3.89456C3.60652 6.03744 5.35821 7.78913 7.50105 7.78913ZM14.1847 10.9014C14.0827 10.6463 13.9467 10.4082 13.7936 10.1871C13.0113 9.0306 11.8038 8.2653 10.4433 8.07822C10.2732 8.06123 10.0861 8.09522 9.95007 8.19727C9.23578 8.72448 8.38546 8.99658 7.50108 8.99658C6.61671 8.99658 5.76638 8.72448 5.05209 8.19727C4.91603 8.09522 4.72895 8.04421 4.5589 8.07822C3.19835 8.2653 1.97387 9.0306 1.20857 10.1871C1.05551 10.4082 0.919443 10.6633 0.817424 10.9014C0.766415 11.0034 0.783407 11.1225 0.834416 11.2245C0.970484 11.4626 1.14054 11.7007 1.2936 11.9048C1.53168 12.2279 1.78679 12.517 2.07592 12.7891C2.31401 13.0272 2.58611 13.2483 2.85824 13.4694C4.20177 14.4728 5.81742 15 7.48409 15C9.15076 15 10.7664 14.4728 12.1099 13.4694C12.382 13.2653 12.6541 13.0272 12.8923 12.7891C13.1644 12.517 13.4365 12.2279 13.6746 11.9048C13.8446 11.6837 13.9977 11.4626 14.1338 11.2245C14.2188 11.1225 14.2358 11.0034 14.1847 10.9014Z" />
                  </g>
                </svg>
                Login
              </span>
              <span>
                <svg width={15} height={15} viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
                  <g>
                    <path d="M7.50105 7.78913C9.64392 7.78913 11.3956 6.03744 11.3956 3.89456C11.3956 1.75169 9.64392 0 7.50105 0C5.35818 0 3.60652 1.75169 3.60652 3.89456C3.60652 6.03744 5.35821 7.78913 7.50105 7.78913ZM14.1847 10.9014C14.0827 10.6463 13.9467 10.4082 13.7936 10.1871C13.0113 9.0306 11.8038 8.2653 10.4433 8.07822C10.2732 8.06123 10.0861 8.09522 9.95007 8.19727C9.23578 8.72448 8.38546 8.99658 7.50108 8.99658C6.61671 8.99658 5.76638 8.72448 5.05209 8.19727C4.91603 8.09522 4.72895 8.04421 4.5589 8.07822C3.19835 8.2653 1.97387 9.0306 1.20857 10.1871C1.05551 10.4082 0.919443 10.6633 0.817424 10.9014C0.766415 11.0034 0.783407 11.1225 0.834416 11.2245C0.970484 11.4626 1.14054 11.7007 1.2936 11.9048C1.53168 12.2279 1.78679 12.517 2.07592 12.7891C2.31401 13.0272 2.58611 13.2483 2.85824 13.4694C4.20177 14.4728 5.81742 15 7.48409 15C9.15076 15 10.7664 14.4728 12.1099 13.4694C12.382 13.2653 12.6541 13.0272 12.8923 12.7891C13.1644 12.517 13.4365 12.2279 13.6746 11.9048C13.8446 11.6837 13.9977 11.4626 14.1338 11.2245C14.2188 11.1225 14.2358 11.0034 14.1847 10.9014Z" />
                  </g>
                </svg>
                Login
              </span>
            </a>
          </div>
        </div>
        <div className="nav-right">
          <div className="contact-and-search-area">
            <div className="contact-area d-xl-flex d-none">
              <div className="icon">
                <svg width={16} height={16} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <g>
                    <path d="M15.5646 11.7424L13.3317 9.50954C12.5343 8.7121 11.1786 9.03111 10.8596 10.0678C10.6204 10.7855 9.82296 11.1842 9.10526 11.0247C7.51037 10.626 5.35726 8.55261 4.95854 6.87797C4.71931 6.16024 5.19778 5.36279 5.91548 5.12359C6.95216 4.80461 7.27113 3.44895 6.47369 2.65151L4.24084 0.418659C3.60288 -0.139553 2.64595 -0.139553 2.08774 0.418659L0.572591 1.93381C-0.942555 3.5287 0.73208 7.75516 4.48007 11.5032C8.22807 15.2512 12.4545 17.0056 14.0494 15.4106L15.5646 13.8955C16.1228 13.2575 16.1228 12.3006 15.5646 11.7424Z" />
                  </g>
                </svg>
              </div>
              <div className="content">
                <span>Need Help?</span>
                <a href="tel:91345533865">+91 345 533 865</a>
              </div>
            </div>
            <div className="search-bar">
              <div className="search-btn" onClick={toggleSearchbar}>
                <svg width={16} height={16} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <g>
                    <path d="M15.7417 14.6098L13.486 12.3621C14.7088 10.8514 15.3054 8.9291 15.1526 6.99153C14.9998 5.05396 14.1093 3.24888 12.6648 1.94851C11.2203 0.648146 9.33193 -0.0483622 7.38901 0.00261294C5.44609 0.0535881 3.59681 0.84816 2.22248 2.22248C0.84816 3.59681 0.0535881 5.44609 0.00261294 7.38901C-0.0483622 9.33193 0.648146 11.2203 1.94851 12.6648C3.24888 14.1093 5.05396 14.9998 6.99153 15.1526C8.9291 15.3054 10.8514 14.7088 12.3621 13.486L14.6098 15.7417C14.6839 15.8164 14.7721 15.8757 14.8692 15.9161C14.9664 15.9566 15.0705 15.9774 15.1758 15.9774C15.281 15.9774 15.3852 15.9566 15.4823 15.9161C15.5794 15.8757 15.6676 15.8164 15.7417 15.7417C15.8164 15.6676 15.8757 15.5794 15.9161 15.4823C15.9566 15.3852 15.9774 15.281 15.9774 15.1758C15.9774 15.0705 15.9566 14.9664 15.9161 14.8692C15.8757 14.7721 15.8164 14.6839 15.7417 14.6098ZM1.62572 7.60368C1.62572 6.42135 1.97632 5.26557 2.63319 4.2825C3.29005 3.29943 4.22368 2.53322 5.31601 2.08076C6.40834 1.62831 7.61031 1.50992 8.76992 1.74058C9.92953 1.97124 10.9947 2.54059 11.8307 3.37662C12.6668 4.21266 13.2361 5.27783 13.4668 6.43744C13.6974 7.59705 13.579 8.79902 13.1266 9.89134C12.6741 10.9837 11.9079 11.9173 10.9249 12.5742C9.94178 13.231 8.78601 13.5816 7.60368 13.5816C6.01822 13.5816 4.49771 12.9518 3.37662 11.8307C2.25554 10.7096 1.62572 9.18913 1.62572 7.60368Z" />
                  </g>
                </svg>
              </div>
              <div className={`search-input ${state.isSearchbar ? "active" : ""}`}>
                <div className="search-close" onClick={toggleSearchbar} />
                <form>
                  <div className="search-group">
                    <div className="form-inner2">
                      <input type="text" placeholder="Find Your Perfect Tour Package" />
                      <button type="submit"><i className="bi bi-search" /></button>
                    </div>
                  </div>
                  <div className="quick-search">
                    <ul>
                      <li>Quick Search :</li>
                      <li><Link href="/travel-package">Thailand Tour,</Link></li>
                      <li><Link href="/travel-package">Philippines Tour,</Link></li>
                      <li><Link href="/travel-package">Bali Tour,</Link></li>
                      <li><Link href="/travel-package">Hawaii, USA Tour,</Link></li>
                      <li><Link href="/travel-package">Switzerland Tour,</Link></li>
                      <li><Link href="/travel-package">Maldives Tour,</Link></li>
                      <li><Link href="/travel-package">Paris Tour,</Link></li>
                    </ul>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <a href="#" className="primary-btn1 black-bg d-xl-flex d-none">
            <span>
              <svg width={15} height={15} viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
                <g>
                  <path d="M7.50105 7.78913C9.64392 7.78913 11.3956 6.03744 11.3956 3.89456C11.3956 1.75169 9.64392 0 7.50105 0C5.35818 0 3.60652 1.75169 3.60652 3.89456C3.60652 6.03744 5.35821 7.78913 7.50105 7.78913ZM14.1847 10.9014C14.0827 10.6463 13.9467 10.4082 13.7936 10.1871C13.0113 9.0306 11.8038 8.2653 10.4433 8.07822C10.2732 8.06123 10.0861 8.09522 9.95007 8.19727C9.23578 8.72448 8.38546 8.99658 7.50108 8.99658C6.61671 8.99658 5.76638 8.72448 5.05209 8.19727C4.91603 8.09522 4.72895 8.04421 4.5589 8.07822C3.19835 8.2653 1.97387 9.0306 1.20857 10.1871C1.05551 10.4082 0.919443 10.6633 0.817424 10.9014C0.766415 11.0034 0.783407 11.1225 0.834416 11.2245C0.970484 11.4626 1.14054 11.7007 1.2936 11.9048C1.53168 12.2279 1.78679 12.517 2.07592 12.7891C2.31401 13.0272 2.58611 13.2483 2.85824 13.4694C4.20177 14.4728 5.81742 15 7.48409 15C9.15076 15 10.7664 14.4728 12.1099 13.4694C12.382 13.2653 12.6541 13.0272 12.8923 12.7891C13.1644 12.517 13.4365 12.2279 13.6746 11.9048C13.8446 11.6837 13.9977 11.4626 14.1338 11.2245C14.2188 11.1225 14.2358 11.0034 14.1847 10.9014Z" />
                </g>
              </svg>
              Login
            </span>
            <span>
              <svg width={15} height={15} viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
                <g>
                  <path d="M7.50105 7.78913C9.64392 7.78913 11.3956 6.03744 11.3956 3.89456C11.3956 1.75169 9.64392 0 7.50105 0C5.35818 0 3.60652 1.75169 3.60652 3.89456C3.60652 6.03744 5.35821 7.78913 7.50105 7.78913ZM14.1847 10.9014C14.0827 10.6463 13.9467 10.4082 13.7936 10.1871C13.0113 9.0306 11.8038 8.2653 10.4433 8.07822C10.2732 8.06123 10.0861 8.09522 9.95007 8.19727C9.23578 8.72448 8.38546 8.99658 7.50108 8.99658C6.61671 8.99658 5.76638 8.72448 5.05209 8.19727C4.91603 8.09522 4.72895 8.04421 4.5589 8.07822C3.19835 8.2653 1.97387 9.0306 1.20857 10.1871C1.05551 10.4082 0.919443 10.6633 0.817424 10.9014C0.766415 11.0034 0.783407 11.1225 0.834416 11.2245C0.970484 11.4626 1.14054 11.7007 1.2936 11.9048C1.53168 12.2279 1.78679 12.517 2.07592 12.7891C2.31401 13.0272 2.58611 13.2483 2.85824 13.4694C4.20177 14.4728 5.81742 15 7.48409 15C9.15076 15 10.7664 14.4728 12.1099 13.4694C12.382 13.2653 12.6541 13.0272 12.8923 12.7891C13.1644 12.517 13.4365 12.2279 13.6746 11.9048C13.8446 11.6837 13.9977 11.4626 14.1338 11.2245C14.2188 11.1225 14.2358 11.0034 14.1847 10.9014Z" />
                </g>
              </svg>
              Login
            </span>
          </a>
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
  )
}

export default Header2Style3
