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
  const logoUrl = agency?.logo || agency?.logo_2 || '/assets/img/footer-logo.svg';
  const rawPhone = agencyPhone.replace(/\s+/g, '').replace(/[^0-9+]/g, '');

  return (
    <footer className="footer-section" id="contacto">
      <div className="container">
        <div className="footer-contact-wrap">
          <div className="inquiry-area">
            <svg width={36} height={36} viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
              <path d="M35.8703 28.2548L33.7795 22.1697C34.7873 20.1094 35.3199 17.8181 35.3235 15.5126C35.3297 11.5039 33.7788 7.71355 30.9563 4.83988C28.1332 1.96565 24.3714 0.347686 20.3636 0.284193C16.2077 0.218522 12.3015 1.79929 9.36472 4.73596C6.53295 7.56766 4.96231 11.3008 4.9126 15.29C2.12162 17.3914 0.474267 20.6676 0.479681 24.167C0.482282 25.8045 0.850861 27.4323 1.54927 28.9043L0.109064 33.0955C-0.138507 33.816 0.0423371 34.5983 0.581071 35.1371C0.960196 35.5162 1.46005 35.7181 1.9741 35.7181C2.19038 35.7181 2.4092 35.6824 2.62259 35.6091L6.81385 34.1688C8.28584 34.8673 9.91365 35.2358 11.5512 35.2384H11.5687C15.1201 35.2383 18.4213 33.5485 20.515 30.6891C22.6938 30.6317 24.8495 30.1043 26.7983 29.1509L32.8835 31.2419C33.1314 31.3274 33.3918 31.3712 33.654 31.3715C34.2649 31.3715 34.8589 31.1316 35.3095 30.6809C35.9497 30.0407 36.1645 29.1111 35.8703 28.2548Z" fill="#00a884" />
            </svg>
            <div className="content">
              <h6>¿Tienes alguna duda o consulta?</h6>
              <span>Comunícate directamente con nuestros asesores inmobiliarios</span>
            </div>
          </div>

          <ul className="contact-area">
            <li className="single-contact">
              <div className="icon">
                <Image width={22} height={22} src="/assets/img/home1/icon/whatsapp-icon2.svg" alt="WhatsApp" />
              </div>
              <div className="content">
                <span>WhatsApp</span>
                <a href={`https://wa.me/${rawPhone.replace('+', '')}`} target="_blank" rel="noopener noreferrer">
                  {agencyPhone}
                </a>
              </div>
            </li>

            <li className="single-contact">
              <div className="icon">
                <Image width={22} height={22} src="/assets/img/home1/icon/mail-icon2.svg" alt="Email" />
              </div>
              <div className="content">
                <span>Escríbenos</span>
                <a href={`mailto:${agencyEmail}`}>{agencyEmail}</a>
              </div>
            </li>

            <li className="single-contact">
              <div className="icon">
                <Image width={22} height={22} src="/assets/img/home1/icon/call-icon.svg" alt="Teléfono" />
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
                <Link href="/" className="footer-logo" style={{ display: 'inline-block', marginBottom: '16px' }}>
                  {logoUrl.endsWith('.svg') || logoUrl.startsWith('/') ? (
                    <Image width={150} height={42} src={logoUrl} alt={agencyName} style={{ maxHeight: '45px', width: 'auto', objectFit: 'contain' }} />
                  ) : (
                    <img src={logoUrl} alt={agencyName} style={{ maxHeight: '45px', width: 'auto', objectFit: 'contain' }} />
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
