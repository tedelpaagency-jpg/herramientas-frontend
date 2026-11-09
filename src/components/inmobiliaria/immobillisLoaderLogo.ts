/**
 * Constante del logotipo corporativo de Immobillis / Santum SaaS
 * Utilizado por PublicPortalLoader y componentes de carga en el portal inmobiliario.
 */

export const IMMOBILLIS_LOGO_URL = '/immobillis-logo.png';

export const IMMOBILLIS_REMOTE_LOGO_URL =
  'https://santun.tedelpa.com/uploads/media/white-label-10/agencies/agency-394/images/med_6aee78e54c501_LogotipoInmobiliarioAmarilloyGris.png';

export const IMMOBILLIS_FALLBACK_LOGO_URL =
  'https://santun.tedelpa.com/uploads/media/white-label-10/agencies/agency-394/images/med_6ae13f16a1dcc_logo1.jpeg';

/**
 * Logotipo Vectorial SVG de Immobillis con geometría arquitectónica e isotipo dorado
 */
export const IMMOBILLIS_SVG_MARK = `
<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="64" height="64" rx="18" fill="#0f172a"/>
  <path d="M32 12L16 25V50H26V36H38V50H48V25L32 12Z" fill="#e2b728"/>
  <path d="M32 20L22 28.5V46H28V34H36V46H42V28.5L32 20Z" fill="#ffffff" fill-opacity="0.95"/>
  <circle cx="32" cy="27" r="3" fill="#e2b728"/>
</svg>
`.trim();

export default IMMOBILLIS_LOGO_URL;
