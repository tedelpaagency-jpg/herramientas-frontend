import type { Metadata } from 'next';

const BACKEND_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://santun.tedelpa.com/api').replace(/\/api$/, '');

/**
 * Clean incoming host string to isolate the domain name
 */
export function normalizeHost(hostHeader?: string | null): string {
  if (!hostHeader) return '';
  let host = hostHeader.toLowerCase().trim();
  host = host.replace(/^https?:\/\//, '');
  host = host.split('/')[0];
  host = host.split(':')[0];
  host = host.replace(/^www\./, '');
  return host;
}

/**
 * Ensure image / favicon URL is absolute with full https:// protocol
 */
export function toAbsoluteMediaUrl(url?: string | null, host?: string): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;

  // Crawlers (WhatsApp, Facebook, Twitter) cannot preview data: or blob: URIs
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return undefined;
  }

  // Already absolute HTTP/HTTPS URL
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // Storage paths
  if (trimmed.startsWith('/storage/')) {
    return `${BACKEND_BASE}${trimmed}`;
  }
  if (trimmed.startsWith('storage/')) {
    return `${BACKEND_BASE}/${trimmed}`;
  }
  if (trimmed.includes('/storage/')) {
    const after = trimmed.substring(trimmed.indexOf('/storage/'));
    return `${BACKEND_BASE}${after}`;
  }

  // Uploads paths
  if (trimmed.startsWith('/uploads/')) {
    return `${BACKEND_BASE}${trimmed}`;
  }
  if (trimmed.startsWith('uploads/')) {
    return `${BACKEND_BASE}/${trimmed}`;
  }
  if (trimmed.includes('/uploads/')) {
    const after = trimmed.substring(trimmed.indexOf('/uploads/'));
    return `${BACKEND_BASE}${after}`;
  }

  // Relative path with leading slash
  if (trimmed.startsWith('/')) {
    const domain = host ? `https://${host}` : BACKEND_BASE;
    return `${domain}${trimmed}`;
  }

  return `${BACKEND_BASE}/${trimmed}`;
}

/**
 * Resolve domain metadata for WhiteLabel branding or Real Estate agency
 */
export async function getDomainMetadata(hostHeader?: string | null): Promise<Metadata> {
  const host = normalizeHost(hostHeader);

  const defaultMetadata: Metadata = {
    title: 'Inmobiliaria - Inicio',
    description: 'Portal Inmobiliario - Explora las mejores propiedades en venta y alquiler.',
    openGraph: {
      title: 'Inmobiliaria - Inicio',
      description: 'Portal Inmobiliario - Explora las mejores propiedades en venta y alquiler.',
      url: host ? `https://${host}` : 'https://santun.tedelpa.com',
      siteName: 'Inmobiliaria',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Inmobiliaria - Inicio',
      description: 'Portal Inmobiliario - Explora las mejores propiedades en venta y alquiler.',
    },
  };

  try {
    // 1. Check White Label configuration
    const ctrl1 = new AbortController();
    const timeout1 = setTimeout(() => ctrl1.abort(), 2500);

    const loginRes = await fetch(
      `${BACKEND_BASE}/api/v1/login/configuration?domain=${encodeURIComponent(host || 'localhost')}`,
      {
        signal: ctrl1.signal,
        headers: {
          'X-Domain': host || 'localhost',
          'X-Forwarded-Host': host || 'localhost',
          Accept: 'application/json',
        },
        next: { revalidate: 300 },
      }
    ).catch(() => null);

    clearTimeout(timeout1);

    if (loginRes && loginRes.ok) {
      const loginData = await loginRes.json().catch(() => null);
      const wl = loginData?.white_label;
      const texts = loginData?.texts;

      if (wl && wl.name) {
        const brandName = wl.name;
        const title = `${brandName} - Inicio`;
        const description =
          wl.seo_description ||
          texts?.main_subtitle ||
          `Plataforma de gestión empresarial ${brandName}.`;
        const rawImg = wl.logo_2 || wl.logo || wl.login_background;
        const imageUrl = toAbsoluteMediaUrl(rawImg, host);
        const faviconRaw = wl.favicon || wl.logo_icon || wl.logo;
        const faviconUrl = toAbsoluteMediaUrl(faviconRaw, host);

        return {
          title,
          description,
          icons: faviconUrl ? { icon: faviconUrl, apple: faviconUrl } : undefined,
          openGraph: {
            title,
            description,
            url: `https://${host}`,
            siteName: brandName,
            type: 'website',
            images: imageUrl ? [{ url: imageUrl, alt: brandName }] : [],
          },
          twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: imageUrl ? [imageUrl] : [],
          },
        };
      }
    }

    // 2. Check Agency configuration (e.g. Inmobiliaria portal)
    const ctrl2 = new AbortController();
    const timeout2 = setTimeout(() => ctrl2.abort(), 2500);

    const agencyRes = await fetch(
      `${BACKEND_BASE}/api/v1/public/inmobiliaria/config?domain=${encodeURIComponent(host || 'localhost')}`,
      {
        signal: ctrl2.signal,
        headers: {
          'X-Domain': host || 'localhost',
          'X-Forwarded-Host': host || 'localhost',
          Accept: 'application/json',
        },
        next: { revalidate: 300 },
      }
    ).catch(() => null);

    clearTimeout(timeout2);

    if (agencyRes && agencyRes.ok) {
      const estateJson = await agencyRes.json().catch(() => null);
      const agency = estateJson?.data;

      if (agency && (agency.agency_name || agency.name || agency.commercial_name)) {
        const agencyName = agency.agency_name || agency.name || agency.commercial_name;
        const title = `${agencyName} - Inicio`;
        const description =
          agency.seo_description ||
          `Explora las mejores propiedades en venta y alquiler con ${agencyName}.`;
        const rawImg = agency.banner_image || agency.agency_logo || agency.logo;
        const imageUrl = toAbsoluteMediaUrl(rawImg, host);
        const faviconUrl = toAbsoluteMediaUrl(agency.favicon || agency.agency_logo || agency.logo, host);

        return {
          title,
          description,
          icons: faviconUrl ? { icon: faviconUrl, apple: faviconUrl } : undefined,
          openGraph: {
            title,
            description,
            url: `https://${host}`,
            siteName: agencyName,
            type: 'website',
            images: imageUrl ? [{ url: imageUrl, alt: agencyName }] : [],
          },
          twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: imageUrl ? [imageUrl] : [],
          },
        };
      }
    }
  } catch {
    // Graceful fallback to default metadata on error
  }

  return defaultMetadata;
}

/**
 * Dynamic SEO for public property detail route (/properties/[slug])
 */
export async function getPropertyMetadata(
  slugOrId: string,
  hostHeader?: string | null
): Promise<Metadata> {
  const host = normalizeHost(hostHeader);
  try {
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 3000);

    const res = await fetch(
      `${BACKEND_BASE}/api/v1/public/estates/${encodeURIComponent(slugOrId)}?domain=${encodeURIComponent(host)}`,
      {
        signal: ctrl.signal,
        headers: {
          'X-Domain': host,
          'X-Forwarded-Host': host,
          Accept: 'application/json',
        },
        next: { revalidate: 180 },
      }
    ).catch(() => null);

    clearTimeout(timeout);

    if (res && res.ok) {
      const json = await res.json().catch(() => null);
      const estate = json?.data?.estate || json?.data;
      if (estate && estate.title) {
        const agencyName = estate.agency?.name || 'Inmobiliaria';
        const formattedPrice = estate.price
          ? `$${Number(estate.price).toLocaleString('en-US')}`
          : '';
        const title = formattedPrice
          ? `${estate.title} - ${formattedPrice} | ${agencyName}`
          : `${estate.title} | ${agencyName}`;

        const cleanDesc = estate.description
          ? estate.description.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim().slice(0, 200)
          : `${estate.property_type || 'Inmueble'} en ${estate.city || estate.location || ''}. Consulta detalles y agenda tu visita.`;

        const firstArrImg = Array.isArray(estate.images) && estate.images.length > 0
          ? (typeof estate.images[0] === 'string' ? estate.images[0] : (estate.images[0]?.image_path || estate.images[0]?.url))
          : null;

        const rawImg =
          estate.image ||
          firstArrImg ||
          estate.primary_photo ||
          (Array.isArray(estate.photos) && estate.photos[0]) ||
          estate.agency?.banner_image ||
          estate.agency?.logo;

        const imageUrl = toAbsoluteMediaUrl(rawImg, host);
        const faviconUrl = toAbsoluteMediaUrl(estate.agency?.logo, host);

        const imageMimeType = imageUrl?.toLowerCase().endsWith('.png') 
          ? 'image/png' 
          : (imageUrl?.toLowerCase().endsWith('.webp') ? 'image/webp' : 'image/jpeg');

        const ogImages = imageUrl ? [
          {
            url: imageUrl,
            secureUrl: imageUrl,
            width: 1200,
            height: 630,
            type: imageMimeType,
            alt: estate.title,
          }
        ] : [];

        return {
          title,
          description: cleanDesc,
          icons: faviconUrl ? { icon: faviconUrl } : undefined,
          openGraph: {
            title,
            description: cleanDesc,
            url: `https://${host}/properties/${encodeURIComponent(slugOrId)}`,
            siteName: agencyName,
            type: 'article',
            images: ogImages,
          },
          twitter: {
            card: 'summary_large_image',
            title,
            description: cleanDesc,
            images: imageUrl ? [imageUrl] : [],
          },
        };
      }
    }
  } catch {
    // Fallback to domain metadata
  }

  return await getDomainMetadata(hostHeader);
}

/**
 * Dynamic SEO for public property catalog route (/properties)
 */
export async function getCatalogMetadata(hostHeader?: string | null): Promise<Metadata> {
  const host = normalizeHost(hostHeader);
  try {
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 2500);

    const agencyRes = await fetch(
      `${BACKEND_BASE}/api/v1/public/inmobiliaria/config?domain=${encodeURIComponent(host)}`,
      {
        signal: ctrl.signal,
        headers: {
          'X-Domain': host,
          'X-Forwarded-Host': host,
          Accept: 'application/json',
        },
        next: { revalidate: 300 },
      }
    ).catch(() => null);

    clearTimeout(timeout);

    if (agencyRes && agencyRes.ok) {
      const json = await agencyRes.json().catch(() => null);
      const agency = json?.data;
      if (agency && agency.agency_name) {
        const title = `Propiedades en Venta y Alquiler | ${agency.agency_name}`;
        const description = `Explora nuestro catálogo completo de inmuebles verificados con ${agency.agency_name}. Casas, departamentos, terrenos y locales comerciales.`;
        const rawImg = agency.banner_image || agency.agency_logo;
        const imageUrl = toAbsoluteMediaUrl(rawImg, host);
        const faviconUrl = toAbsoluteMediaUrl(agency.favicon || agency.agency_logo, host);

        return {
          title,
          description,
          icons: faviconUrl ? { icon: faviconUrl, apple: faviconUrl } : undefined,
          openGraph: {
            title,
            description,
            url: `https://${host}/properties`,
            siteName: agency.agency_name,
            type: 'website',
            images: imageUrl ? [{ url: imageUrl, alt: title }] : [],
          },
          twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: imageUrl ? [imageUrl] : [],
          },
        };
      }
    }
  } catch {
    // Fallback
  }

  return await getDomainMetadata(hostHeader);
}

/**
 * Dynamic SEO for public landing pages (/landing?id=... or custom landing domain)
 */
export async function getLandingMetadata(
  rawIdOrSlug?: string | null,
  hostHeader?: string | null
): Promise<Metadata> {
  const host = normalizeHost(hostHeader);
  try {
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 3000);

    let landingRes: Response | null = null;
    if (rawIdOrSlug) {
      landingRes = await fetch(
        `${BACKEND_BASE}/api/v1/public/landings/${encodeURIComponent(rawIdOrSlug)}`,
        {
          signal: ctrl.signal,
          headers: {
            'X-Domain': host,
            'X-Forwarded-Host': host,
            Accept: 'application/json',
          },
          next: { revalidate: 180 },
        }
      ).catch(() => null);
    } else if (host) {
      landingRes = await fetch(
        `${BACKEND_BASE}/api/v1/public/landing-domain-lookup?domain=${encodeURIComponent(host)}`,
        {
          signal: ctrl.signal,
          headers: {
            'X-Domain': host,
            'X-Forwarded-Host': host,
            Accept: 'application/json',
          },
          next: { revalidate: 180 },
        }
      ).catch(() => null);
    }

    clearTimeout(timeout);

    if (landingRes && landingRes.ok) {
      const json = await landingRes.json().catch(() => null);
      const data = json?.data;
      if (data && (data.title || data.name)) {
        const landingTitle = data.title || data.name;
        // Marca dueña de la landing (marca blanca o agencia que la creó), resuelta en backend
        const brand = data.brand_name || data.agency_name || data.white_label_name;
        const fullTitle = brand ? `${landingTitle} | ${brand}` : landingTitle;
        const description =
          data.builder_schema?.meta_description ||
          `${landingTitle}. Regístrate o conoce más información en línea.`;
        const rawImg = data.builder_schema?.hero_image || data.brand_logo || data.agency_logo;
        const imageUrl = toAbsoluteMediaUrl(rawImg, host);
        // Favicon de la marca blanca o agencia que creó la landing (resuelto en backend)
        const faviconUrl = toAbsoluteMediaUrl(data.favicon || data.agency_logo, host);

        return {
          title: fullTitle,
          description,
          icons: faviconUrl ? { icon: faviconUrl, apple: faviconUrl } : undefined,
          openGraph: {
            title: fullTitle,
            description,
            url: host ? `https://${host}/landing` : 'https://santun.tedelpa.com',
            siteName: brand || 'SANTUN',
            type: 'website',
            images: imageUrl ? [{ url: imageUrl, alt: fullTitle }] : [],
          },
          twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            images: imageUrl ? [imageUrl] : [],
          },
        };
      }
    }
  } catch {
    // Fallback
  }

  return await getDomainMetadata(hostHeader);
}

