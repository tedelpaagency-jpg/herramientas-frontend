"use client";
import React, { useRef, useState } from 'react';
import Link from 'next/link';

interface HeroV4Props {
  agency?: any;
}

const HeroV4: React.FC<HeroV4Props> = ({ agency }) => {
  const [activeTab, setActiveTab] = useState<'sale' | 'rent' | 'land' | 'commercial'>('sale');

  const heroTitle = agency?.hero_title || 'Encuentra la Propiedad de tus Sueños';
  const heroSubtitle = agency?.hero_subtitle || 'Las mejores opciones en venta y renta con asesoría jurídica, notarial y crediticia garantizada.';
  const bannerImage = agency?.banner_image;

  return (
    <div className="home4-banner-section mb-100">
      <div className="banner-video-area" style={bannerImage ? {
        backgroundImage: `linear-gradient(rgba(10, 15, 29, 0.55), rgba(10, 15, 29, 0.7)), url(${bannerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : {}}>
        {!bannerImage && (
          <video autoPlay loop muted playsInline src="/assets/video/home4-banner-video.mp4" />
        )}
      </div>

      <div className="banner-content-wrap">
        <div className="container">
          <div className="banner-content">
            <h1>{heroTitle}</h1>
            <p>{heroSubtitle}</p>

            <div className="filter-wrapper">
              <ul className="filter-item-list">
                <li
                  className={`single-item ${activeTab === 'sale' ? 'active' : ''}`}
                  onClick={() => setActiveTab('sale')}
                >
                  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <span>En Venta</span>
                </li>

                <li
                  className={`single-item ${activeTab === 'rent' ? 'active' : ''}`}
                  onClick={() => setActiveTab('rent')}
                >
                  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                  </svg>
                  <span>En Renta</span>
                </li>

                <li
                  className={`single-item ${activeTab === 'land' ? 'active' : ''}`}
                  onClick={() => setActiveTab('land')}
                >
                  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                    <line x1="8" y1="2" x2="8" y2="18" />
                    <line x1="16" y1="6" x2="16" y2="22" />
                  </svg>
                  <span>Terrenos &amp; Lotes</span>
                </li>

                <li
                  className={`single-item ${activeTab === 'commercial' ? 'active' : ''}`}
                  onClick={() => setActiveTab('commercial')}
                >
                  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                    <line x1="9" y1="6" x2="9.01" y2="6" />
                    <line x1="15" y1="6" x2="15.01" y2="6" />
                    <line x1="9" y1="10" x2="9.01" y2="10" />
                    <line x1="15" y1="10" x2="15.01" y2="10" />
                    <line x1="9" y1="14" x2="9.01" y2="14" />
                    <line x1="15" y1="14" x2="15.01" y2="14" />
                    <line x1="9" y1="18" x2="15" y2="18" />
                  </svg>
                  <span>Comercial</span>
                </li>
              </ul>

              <div className="filter-input-wrap">
                {/* Formulario En Venta */}
                <form action="/properties" method="GET" className={`filter-input ${activeTab === 'sale' ? 'show' : ''}`}>
                  <input type="hidden" name="property_status" value="1" />
                  <div className="single-search-box">
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <div className="search-box-content" style={{ width: '100%' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#7e7e7e', display: 'block' }}>Ubicación</span>
                      <input
                        type="text"
                        name="search"
                        placeholder="Ciudad, colonia o zona..."
                        style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontWeight: 600, color: '#161a1b', fontSize: '15px' }}
                      />
                    </div>
                  </div>

                  <div className="single-search-box">
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    </svg>
                    <div className="search-box-content" style={{ width: '100%' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#7e7e7e', display: 'block' }}>Tipo de Inmueble</span>
                      <select
                        name="property_type"
                        style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontWeight: 600, color: '#161a1b', fontSize: '15px', cursor: 'pointer' }}
                        defaultValue=""
                      >
                        <option value="">Todas las propiedades</option>
                        <option value="1">Casas &amp; Residencias</option>
                        <option value="2">Departamentos &amp; Lofts</option>
                        <option value="3">Terrenos &amp; Lotes</option>
                        <option value="4">Oficinas &amp; Locales</option>
                        <option value="5">Villas &amp; Quintas</option>
                      </select>
                    </div>
                  </div>

                  <div className="single-search-box">
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                    <div className="search-box-content" style={{ width: '100%' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#7e7e7e', display: 'block' }}>Presupuesto Máximo</span>
                      <select
                        name="price_max"
                        style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontWeight: 600, color: '#161a1b', fontSize: '15px', cursor: 'pointer' }}
                        defaultValue=""
                      >
                        <option value="">Cualquier precio</option>
                        <option value="150000">Hasta $150,000 USD</option>
                        <option value="300000">Hasta $300,000 USD</option>
                        <option value="500000">Hasta $500,000 USD</option>
                        <option value="1000000">Hasta $1,000,000 USD</option>
                        <option value="2000000">Más de $1,000,000 USD</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="primary-btn1">
                    <span>
                      <svg width={18} height={18} viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.7799 16.746L14.6861 13.7226L14.6137 13.6126C14.4774 13.4781 14.2936 13.4028 14.1022 13.4028C13.9107 13.4028 13.7269 13.4781 13.5906 13.6126C10.9613 16.0246 6.91095 16.1554 4.12376 13.9188C1.33658 11.6821 0.680209 7.7696 2.58814 4.77921C4.49607 1.78882 8.37732 0.64519 11.6585 2.10734C14.9396 3.56949 16.5993 7.18566 15.539 10.555C15.5016 10.675 15.4972 10.8029 15.5262 10.9251C15.5552 11.0474 15.6166 11.1597 15.7039 11.2501C15.7921 11.3421 15.9027 11.4097 16.0248 11.4463C16.1469 11.4829 16.2764 11.4872 16.4007 11.4589C16.5243 11.4317 16.6387 11.3725 16.7323 11.2872C16.8258 11.202 16.8954 11.0936 16.934 10.973C18.1996 6.97472 16.2878 2.6716 12.434 0.848041C8.58017 -0.975514 3.94271 0.225775 1.52009 3.67706C-0.902526 7.12835 -0.382565 11.7918 2.74388 14.6518C5.87033 17.5118 10.6646 17.7083 14.0273 15.1173L16.7667 17.7955C16.9042 17.9276 17.0875 18.0014 17.2782 18.0014C17.4689 18.0014 17.6522 17.9276 17.7897 17.7955C17.8568 17.7298 17.9101 17.6513 17.9465 17.5648C17.9829 17.4782 18.0016 17.3852 18.0016 17.2913C18.0016 17.1974 17.9829 17.1045 17.9465 17.0179C17.9101 16.9313 17.8568 16.8529 17.7897 16.7872L17.7799 16.746Z" fill="currentColor" />
                      </svg>
                      BUSCAR
                    </span>
                    <span>
                      BUSCAR
                    </span>
                  </button>
                </form>

                {/* Formulario En Renta */}
                <form action="/properties" method="GET" className={`filter-input ${activeTab === 'rent' ? 'show' : ''}`}>
                  <input type="hidden" name="property_status" value="2" />
                  <div className="single-search-box">
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <div className="search-box-content" style={{ width: '100%' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#7e7e7e', display: 'block' }}>Ubicación para Renta</span>
                      <input
                        type="text"
                        name="search"
                        placeholder="Ciudad o zona de interés..."
                        style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontWeight: 600, color: '#161a1b', fontSize: '15px' }}
                      />
                    </div>
                  </div>

                  <div className="single-search-box">
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    </svg>
                    <div className="search-box-content" style={{ width: '100%' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#7e7e7e', display: 'block' }}>Inmueble en Renta</span>
                      <select
                        name="property_type"
                        style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontWeight: 600, color: '#161a1b', fontSize: '15px', cursor: 'pointer' }}
                        defaultValue=""
                      >
                        <option value="">Departamentos y Casas</option>
                        <option value="2">Departamentos Amueblados</option>
                        <option value="1">Casas en Privada</option>
                        <option value="4">Oficinas / Locales Comerciales</option>
                      </select>
                    </div>
                  </div>

                  <div className="single-search-box">
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 4v16" />
                      <path d="M2 8h18a2 2 0 0 1 2 2v10" />
                      <path d="M2 17h20" />
                      <path d="M6 8v9" />
                    </svg>
                    <div className="search-box-content" style={{ width: '100%' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#7e7e7e', display: 'block' }}>Recámaras</span>
                      <select
                        name="bedrooms"
                        style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontWeight: 600, color: '#161a1b', fontSize: '15px', cursor: 'pointer' }}
                        defaultValue=""
                      >
                        <option value="">Cualquier número</option>
                        <option value="1">1+ Recámara</option>
                        <option value="2">2+ Recámaras</option>
                        <option value="3">3+ Recámaras</option>
                        <option value="4">4+ Recámaras</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="primary-btn1">
                    <span>BUSCAR RENTAS</span>
                    <span>BUSCAR RENTAS</span>
                  </button>
                </form>

                {/* Formulario Terrenos */}
                <form action="/properties" method="GET" className={`filter-input ${activeTab === 'land' ? 'show' : ''}`}>
                  <input type="hidden" name="property_type" value="3" />
                  <div className="single-search-box">
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                    </svg>
                    <div className="search-box-content" style={{ width: '100%' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#7e7e7e', display: 'block' }}>Zona o Municipio</span>
                      <input
                        type="text"
                        name="search"
                        placeholder="Ubicación del terreno..."
                        style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontWeight: 600, color: '#161a1b', fontSize: '15px' }}
                      />
                    </div>
                  </div>

                  <div className="single-search-box">
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    </svg>
                    <div className="search-box-content" style={{ width: '100%' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#7e7e7e', display: 'block' }}>Superficie Mínima</span>
                      <select
                        name="size_min"
                        style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontWeight: 600, color: '#161a1b', fontSize: '15px', cursor: 'pointer' }}
                        defaultValue=""
                      >
                        <option value="">Cualquier superficie</option>
                        <option value="200">Desde 200 m²</option>
                        <option value="500">Desde 500 m²</option>
                        <option value="1000">Desde 1,000 m² (1 Hectárea)</option>
                        <option value="5000">Macro lotes (5,000+ m²)</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="primary-btn1">
                    <span>BUSCAR TERRENOS</span>
                    <span>BUSCAR TERRENOS</span>
                  </button>
                </form>

                {/* Formulario Comercial */}
                <form action="/properties" method="GET" className={`filter-input ${activeTab === 'commercial' ? 'show' : ''}`}>
                  <input type="hidden" name="property_type" value="4" />
                  <div className="single-search-box">
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                    </svg>
                    <div className="search-box-content" style={{ width: '100%' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#7e7e7e', display: 'block' }}>Zona Comercial</span>
                      <input
                        type="text"
                        name="search"
                        placeholder="Corredor o plaza comercial..."
                        style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontWeight: 600, color: '#161a1b', fontSize: '15px' }}
                      />
                    </div>
                  </div>

                  <div className="single-search-box">
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <line x1="20" y1="8" x2="20" y2="14" />
                      <line x1="23" y1="11" x2="17" y2="11" />
                    </svg>
                    <div className="search-box-content" style={{ width: '100%' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#7e7e7e', display: 'block' }}>Modalidad</span>
                      <select
                        name="property_status"
                        style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontWeight: 600, color: '#161a1b', fontSize: '15px', cursor: 'pointer' }}
                        defaultValue=""
                      >
                        <option value="">En Venta o Renta</option>
                        <option value="1">En Venta</option>
                        <option value="2">En Renta</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="primary-btn1">
                    <span>BUSCAR LOCALES</span>
                    <span>BUSCAR LOCALES</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroV4;
