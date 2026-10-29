import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface FooterProps {
  agency?: any;
}

const Footer: React.FC<FooterProps> = ({ agency }) => {
  const agencyName = agency?.name || 'Inmobiliaria';
  const agencyPhone = agency?.phone || agency?.whatsapp || '+52 55 1234 5678';
  const agencyEmail = agency?.email || 'contacto@inmobiliaria.com';
  const agencyAddress = [agency?.address, agency?.city, agency?.province].filter(Boolean).join(', ') || 'Av. Insurgentes Sur 1200, Ciudad de México';
  const primaryColor = agency?.primary_color || '#00a884';
  const footerLogo =
    agency?.details?.footer_logo ||
    agency?.footer_logo ||
    agency?.logo ||
    agency?.logo_2;
  const logoUrl = footerLogo || '';
  const rawPhone = agencyPhone.replace(/\s+/g, '').replace(/[^0-9+]/g, '');

  return (
    <footer className="footer-section" id="contacto">
      <div className="container">
        <div className="footer-contact-wrap">
          <div className="inquiry-area">
            <svg width={36} height={36} viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
              <path d="M35.8703 28.2548L33.7795 22.1697C34.7873 20.1094 35.3199 17.8181 35.3235 15.5126C35.3297 11.5039 33.7788 7.71355 30.9563 4.83988C28.1332 1.96565 24.3714 0.347686 20.3636 0.284193C16.2077 0.218522 12.3015 1.79929 9.36472 4.73596C6.53295 7.56766 4.96231 11.3008 4.9126 15.29C2.12162 17.3914 0.474267 20.6676 0.479681 24.167C0.482282 25.8045 0.850861 27.4323 1.54927 28.9043L0.109064 33.0955C-0.138507 33.816 0.0423371 34.5983 0.581071 35.1371C0.960196 35.5162 1.46005 35.7181 1.9741 35.7181C2.19038 35.7181 2.4092 35.6824 2.62259 35.6091L6.81385 34.1688C8.28584 34.8673 9.91365 35.2358 11.5512 35.2384H11.5687C15.1201 35.2383 18.4213 33.5485 20.515 30.6891C22.6938 30.6317 24.8495 30.1043 26.7983 29.1509L32.8835 31.2419C33.1314 31.3274 33.3918 31.3712 33.654 31.3715C34.2649 31.3715 34.8589 31.1316 35.3095 30.6809C35.9497 30.0407 36.1645 29.1111 35.8703 28.2548Z" fill={primaryColor} />
            </svg>
            <div className="content">
              <h6>¿Tienes alguna duda o consulta?</h6>
              <span>Comunícate directamente con nuestros asesores inmobiliarios</span>
            </div>
          </div>

          <ul className="contact-area">
            <li className="single-contact">
              <div
                className="icon"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  minWidth: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  flexShrink: 0,
                }}
              >
                <svg width={22} height={22} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.0027 0H10.9973C4.93213 0 0 4.9335 0 11C0 13.4062 0.7755 15.6365 2.09413 17.4474L0.72325 21.5339L4.95138 20.1823C6.69075 21.3345 8.76562 22 11.0027 22C17.0679 22 22 17.0651 22 11C22 4.93488 17.0679 0 11.0027 0Z" fill="#25D366" />
                  <path d="M17.4034 15.5335C17.138 16.2829 16.0848 16.9044 15.2446 17.0859C14.6699 17.2083 13.9191 17.3059 11.3919 16.2581C8.15926 14.9189 6.07751 11.634 5.91526 11.4209C5.75988 11.2077 4.60901 9.6815 4.60901 8.103C4.60901 6.5245 5.41063 5.75588 5.73376 5.42588C5.99913 5.155 6.43776 5.03125 6.85851 5.03125C6.99463 5.03125 7.11701 5.03813 7.22701 5.04363C7.55013 5.05738 7.71238 5.07663 7.92551 5.58675C8.19088 6.22613 8.83713 7.80463 8.91413 7.96688C8.99251 8.12913 9.07088 8.34913 8.96088 8.56225C8.85776 8.78225 8.76701 8.87987 8.60476 9.06687C8.44251 9.25387 8.28851 9.39687 8.12626 9.59763C7.97776 9.77225 7.81001 9.95925 7.99701 10.2824C8.18401 10.5986 8.83026 11.6532 9.78176 12.5002C11.0096 13.5934 12.0051 13.9426 12.3613 14.0911C12.6266 14.2011 12.9429 14.175 13.1368 13.9688C13.3829 13.7034 13.6868 13.2634 13.9961 12.8303C14.2161 12.5195 14.4939 12.481 14.7854 12.591C15.0824 12.6941 16.654 13.471 16.9771 13.6319C17.3003 13.7941 17.5134 13.8711 17.5918 14.0073C17.6688 14.1434 17.6688 14.7828 17.4034 15.5335Z" fill="#FFFFFF" />
                </svg>
              </div>
              <div className="content">
                <span>WhatsApp</span>
                <a href={`https://wa.me/${rawPhone.replace('+', '')}`} target="_blank" rel="noopener noreferrer">
                  {agencyPhone}
                </a>
              </div>
            </li>

            <li className="single-contact">
              <div
                className="icon"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  minWidth: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  flexShrink: 0,
                }}
              >
                <svg width={22} height={22} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M2.70024 4.22694L8.64367 10.173C9.93995 11.4667 12.0589 11.4679 13.3563 10.173L19.2997 4.22694C19.3138 4.21297 19.3246 4.19607 19.3314 4.17746C19.3382 4.15884 19.3408 4.13896 19.339 4.11922C19.3373 4.09948 19.3312 4.08037 19.3213 4.06324C19.3113 4.0461 19.2977 4.03137 19.2814 4.02009C18.6752 3.59732 17.9376 3.34668 17.1432 3.34668H4.85684C4.0623 3.34668 3.32474 3.59736 2.71854 4.02009C2.70225 4.03137 2.68865 4.0461 2.67869 4.06324C2.66873 4.08037 2.66266 4.09948 2.66091 4.11922C2.65917 4.13896 2.66178 4.15884 2.66858 4.17746C2.67537 4.19607 2.68618 4.21297 2.70024 4.22694ZM1.11194 7.09154C1.11146 6.48738 1.25828 5.89223 1.53969 5.35762C1.54952 5.33877 1.56365 5.32251 1.58094 5.31015C1.59823 5.29779 1.6182 5.28969 1.63921 5.2865C1.66022 5.28331 1.68169 5.28512 1.70187 5.29179C1.72206 5.29846 1.74038 5.30979 1.75535 5.32488L7.62355 11.1931C9.48182 13.0541 12.517 13.0551 14.3764 11.1931L20.2446 5.32488C20.2596 5.30979 20.2779 5.29846 20.2981 5.29179C20.3183 5.28512 20.3398 5.28331 20.3608 5.2865C20.3818 5.28969 20.4018 5.29779 20.419 5.31015C20.4363 5.32251 20.4505 5.33877 20.4603 5.35762C20.7417 5.89223 20.8885 6.48739 20.888 7.09154V14.9091C20.888 16.9756 19.2071 18.654 17.1432 18.654H4.85684C2.79296 18.654 1.11194 16.9756 1.11194 14.9091V7.09154Z" fill="#1781FE" />
                </svg>
              </div>
              <div className="content">
                <span>Escríbenos</span>
                <a href={`mailto:${agencyEmail}`}>{agencyEmail}</a>
              </div>
            </li>

            <li className="single-contact">
              <div
                className="icon"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  minWidth: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  flexShrink: 0,
                }}
              >
                <svg width={22} height={22} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#footer-phone-clip)">
                    <path d="M21.4012 16.1458L18.331 13.0756C17.2345 11.9791 15.3705 12.4178 14.9319 13.8432C14.603 14.83 13.5065 15.3783 12.5196 15.1589C10.3267 14.6107 7.36615 11.7598 6.8179 9.45721C6.48896 8.47032 7.14685 7.37384 8.13369 7.04493C9.55912 6.60634 9.99772 4.74231 8.90123 3.64582L5.83107 0.575656C4.95387 -0.191885 3.63809 -0.191885 2.87055 0.575656L0.787221 2.65898C-1.29611 4.85196 1.00652 10.6633 6.16001 15.8168C11.3135 20.9703 17.1249 23.3826 19.3179 21.1896L21.4012 19.1063C22.1688 18.2291 22.1688 16.9133 21.4012 16.1458Z" fill={primaryColor || "#1781FE"} />
                  </g>
                  <defs>
                    <clipPath id="footer-phone-clip">
                      <rect width="22" height="22" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <div className="content">
                <span>Llámanos</span>
                <a href={`tel:${rawPhone}`}>{agencyPhone}</a>
              </div>
            </li>
          </ul>
        </div>

        <svg className="divider" width={1320} height={6} viewBox="0 0 1320 6" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 2.5L0 0.113249V5.88675L5 3.5V2.5ZM1315 3.5L1320 5.88675V0.113249L1315 2.5V3.5ZM4.5 3.5H1315.5V2.5H4.5V3.5Z" />
        </svg>

        <div className="footer-menu-wrap">
          <div className="row gy-md-4 gy-5">
            <div className="col-lg-4 col-md-5 col-sm-6">
              <div className="footer-logo-and-addition-info">
                <Link href="/" className="footer-logo" style={{ display: 'inline-block', marginBottom: '16px', textDecoration: 'none' }}>
                  {logoUrl ? (
                    <img src={logoUrl} alt={agencyName} style={{ maxHeight: '48px', maxWidth: '210px', width: 'auto', objectFit: 'contain' }} />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 900, fontSize: '18px', flexShrink: 0 }}>{agencyName.charAt(0).toUpperCase()}</div><span style={{ fontSize: '20px', fontWeight: 900, color: '#ffffff', lineHeight: 1.15, letterSpacing: '-0.02em' }}>{agencyName}</span></div>
                  )}
                </Link>
                <div className="address-area">
                  <span style={{ fontWeight: 700, color: 'white', display: 'block', marginBottom: '4px' }}>{agencyName}</span>
                  <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.6 }}>{agencyAddress}</p>
                </div>

                <ul className="social-list" style={{ marginTop: '16px' }}>
                  {agency?.facebook && (
                    <li><a href={agency.facebook} target="_blank" rel="noopener noreferrer"><i className="bx bxl-facebook" /></a></li>
                  )}
                  {agency?.instagram && (
                    <li><a href={agency.instagram} target="_blank" rel="noopener noreferrer"><i className="bx bxl-instagram-alt" /></a></li>
                  )}
                  {agency?.tiktok && (
                    <li><a href={agency.tiktok} target="_blank" rel="noopener noreferrer"><i className="bx bxl-tiktok" /></a></li>
                  )}
                  <li><a href={`https://wa.me/${rawPhone.replace('+', '')}`} target="_blank" rel="noopener noreferrer"><i className="bx bxl-whatsapp" /></a></li>
                </ul>
              </div>
            </div>

            <div className="col-lg-4 col-md-3 col-sm-6 d-flex justify-content-md-center">
              <div className="footer-widget">
                <div className="widget-title">
                  <h5>Propiedades</h5>
                </div>
                <ul className="widget-list">
                  <li><Link href="/properties">Catálogo Completo</Link></li>
                  <li><Link href="/properties?property_status=1">Casas en Venta</Link></li>
                  <li><Link href="/properties?property_status=2">Departamentos en Renta</Link></li>
                  <li><Link href="/properties?property_type=1">Residencias de Lujo</Link></li>
                  <li><Link href="/properties?property_type=3">Terrenos &amp; Lotes</Link></li>
                  <li><Link href="/properties?property_type=4">Oficinas y Locales</Link></li>
                </ul>
              </div>
            </div>

            <div className="col-lg-4 col-md-4 col-sm-6 d-flex justify-content-md-end">
              <div className="footer-widget">
                <div className="widget-title">
                  <h5>Enlaces de Interés</h5>
                </div>
                <ul className="widget-list">
                  <li><Link href="/">Inicio</Link></li>
                  <li><a href="#categorias">Categorías Principales</a></li>
                  <li><a href="#nosotros">Conócenos</a></li>
                  <li><a href="#destacadas">Propiedades Destacadas</a></li>
                  <li><Link href="/contact">Consignar Inmueble</Link></li>
                  <li><Link href="/login">Acceso Agentes / CRM</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 d-flex flex-wrap justify-content-between align-items-center gap-2">
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '13px' }}>
                © {new Date().getFullYear()} {agencyName}. Todos los derechos reservados.
              </p>
              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#64748b' }}>
                <Link href="/privacy" style={{ color: '#94a3b8' }}>Aviso de Privacidad</Link>
                <Link href="/terms" style={{ color: '#94a3b8' }}>Términos y Condiciones</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
