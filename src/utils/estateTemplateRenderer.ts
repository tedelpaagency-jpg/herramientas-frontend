import html2canvas from 'html2canvas';

/**
 * Utilidades para sustitución de atajos (shortcuts) y renderizado de plantillas HTML
 * para flyers e imágenes inmobiliarias con soporte de proxy y fallback multi-tenant.
 */

export interface TemplateDataPayload {
  logo?: string;
  property_image?: string;
  property_image_1?: string;
  property_image_2?: string;
  property_image_3?: string;
  property_image_4?: string;
  agent_name?: string;
  agent_phone?: string;
  property_price?: string;
  amenities?: string;
  plain_amenities?: string;
  property_title?: string;
  location?: string;
  operation_type?: string;
  property_type?: string;
  qr_code?: string;
}

/**
 * Convierte una propiedad y agencia en un payload de datos listo para los atajos.
 */
export function buildEstatePayload(
  estate: any,
  agency?: any,
  selectedImageIndex?: number,
  customSlotImages?: Record<number, string>,
  whiteLabel?: any
): TemplateDataPayload {
  const effectiveAgency = estate?.agency || estate?.user?.agency || agency;

  // 1. Extraer el logotipo de la agencia o marca blanca
  let agencyLogo = 
    effectiveAgency?.logo ||
    effectiveAgency?.logo_2 ||
    effectiveAgency?.logo_icon ||
    effectiveAgency?.details?.logo ||
    effectiveAgency?.card_logo ||
    estate?.agency?.logo ||
    estate?.agency?.logo_2 ||
    estate?.agency?.logo_icon ||
    estate?.user?.agency?.logo ||
    agency?.logo ||
    agency?.logo_2 ||
    agency?.logo_icon ||
    agency?.details?.logo ||
    agency?.card_logo ||
    whiteLabel?.logo ||
    whiteLabel?.logo_2 ||
    whiteLabel?.logo_icon ||
    '';

  // Si no se encuentra en memoria, recuperar del almacenamiento local
  if (!agencyLogo && typeof window !== 'undefined') {
    agencyLogo = 
      localStorage.getItem('santun_sidebar_logo') ||
      localStorage.getItem('santun_sidebar_logo_dark') ||
      localStorage.getItem('santun_sidebar_logo_icon') ||
      '';
    if (!agencyLogo) {
      try {
        const storedWl = JSON.parse(localStorage.getItem('santun_white_label') || '{}');
        if (storedWl?.logo) agencyLogo = storedWl.logo;
      } catch {}
    }
  }

  // Normalizar rutas relativas a URLs absolutas seguras
  if (agencyLogo && !agencyLogo.startsWith('http://') && !agencyLogo.startsWith('https://') && !agencyLogo.startsWith('data:')) {
    if (agencyLogo.startsWith('/')) {
      agencyLogo = `https://santun.tedelpa.com${agencyLogo}`;
    } else {
      agencyLogo = `https://santun.tedelpa.com/uploads/${agencyLogo}`;
    }
  }

  // Fallback elegante SVG vectorial con el nombre comercial si no existe logo cargado
  if (!agencyLogo) {
    const brandName = effectiveAgency?.commercial_name || effectiveAgency?.name || whiteLabel?.name || 'INMOBILIARIA';
    agencyLogo = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="360" height="90" viewBox="0 0 360 90"><rect width="360" height="90" rx="14" fill="%230f172a"/><text x="50%" y="54%" font-family="Arial,Helvetica,sans-serif" font-weight="900" font-size="24" fill="%23ffffff" text-anchor="middle" dominant-baseline="middle" letter-spacing="2">${encodeURIComponent(brandName.toUpperCase())}</text></svg>`;
  }
  
  // Extraer todas las imágenes disponibles de la propiedad
  const allImages: string[] = [];
  if (estate?.images && Array.isArray(estate.images)) {
    estate.images.forEach((img: any) => {
      const url = typeof img === 'string' ? img : (img.image_path || img.url || '');
      if (url && !allImages.includes(url)) allImages.push(url);
    });
  }
  if (estate?.image && !allImages.includes(estate.image)) {
    allImages.unshift(estate.image);
  }
  const fallbackImg = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';
  
  const baseImg1 = (typeof selectedImageIndex === 'number' && allImages[selectedImageIndex]) ? allImages[selectedImageIndex] : (allImages[0] || fallbackImg);
  const baseImg2 = allImages[1] || allImages[0] || fallbackImg;
  const baseImg3 = allImages[2] || allImages[1] || allImages[0] || fallbackImg;
  const baseImg4 = allImages[3] || allImages[2] || allImages[0] || fallbackImg;

  const img1 = customSlotImages?.[1] || baseImg1;
  const img2 = customSlotImages?.[2] || baseImg2;
  const img3 = customSlotImages?.[3] || baseImg3;
  const img4 = customSlotImages?.[4] || baseImg4;

  const propertyImg = img1;

  // Asesor / Agente
  const agentName = estate?.user?.name || effectiveAgency?.commercial_name || effectiveAgency?.name || 'Asesor Inmobiliario';
  const agentPhone = estate?.user?.phone || estate?.contact_phone || effectiveAgency?.phone || effectiveAgency?.whatsapp || '+593 99 999 9999';

  // Precio Formateado
  const rawPrice = estate?.price || estate?.valoration || 0;
  const formattedPrice = typeof rawPrice === 'number' 
    ? `$${Number(rawPrice).toLocaleString()} USD`
    : String(rawPrice).includes('$') ? String(rawPrice) : `$${rawPrice} USD`;

  // Ubicación
  const locParts: string[] = [];
  if (estate?.city) locParts.push(estate.city);
  if (estate?.province) locParts.push(estate.province);
  if (estate?.address && locParts.length === 0) locParts.push(estate.address);
  const location = locParts.length > 0 ? locParts.join(', ') : 'Ubicación Privilegiada';

  // Generar amenidades
  const specs = estate?.specs || {};
  const bedrooms = estate?.bedrooms ?? specs.bedrooms;
  const bathrooms = estate?.bathrooms ?? specs.bathrooms;
  const garage = estate?.garage ?? specs.garage ?? estate?.parking;
  const size = estate?.surface_total || estate?.size_meters || specs.size || estate?.covered_surface;

  const amenityItems: string[] = [];
  if (bedrooms) amenityItems.push(`${bedrooms} Hab.`);
  if (bathrooms) amenityItems.push(`${bathrooms} Baños`);
  if (garage) amenityItems.push(`${garage} Estac.`);
  if (size) amenityItems.push(`${size} m²`);
  const plainAmenities = amenityItems.length > 0 ? amenityItems.join(' • ') : '3 Hab • 2 Baños • 220 m²';

  const amenityPills: string[] = [];
  if (bedrooms) {
    amenityPills.push(`
      <span style="display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.18); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.3); padding: 8px 18px; border-radius: 9999px; color: #ffffff; font-weight: 700; font-size: 16px;">
        🛏️ ${bedrooms} Hab.
      </span>
    `);
  }
  if (bathrooms) {
    amenityPills.push(`
      <span style="display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.18); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.3); padding: 8px 18px; border-radius: 9999px; color: #ffffff; font-weight: 700; font-size: 16px;">
        🚿 ${bathrooms} Baños
      </span>
    `);
  }
  if (garage) {
    amenityPills.push(`
      <span style="display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.18); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.3); padding: 8px 18px; border-radius: 9999px; color: #ffffff; font-weight: 700; font-size: 16px;">
        🚗 ${garage} Estac.
      </span>
    `);
  }
  if (size) {
    amenityPills.push(`
      <span style="display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.18); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.3); padding: 8px 18px; border-radius: 9999px; color: #ffffff; font-weight: 700; font-size: 16px;">
        📐 ${size} m²
      </span>
    `);
  }
  if (amenityPills.length === 0) {
    amenityPills.push(`
      <span style="display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.18); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.3); padding: 8px 18px; border-radius: 9999px; color: #ffffff; font-weight: 700; font-size: 16px;">
        ✨ Acabados de Primera
      </span>
    `);
  }

  return {
    logo: agencyLogo,
    property_image: propertyImg,
    property_image_1: img1,
    property_image_2: img2,
    property_image_3: img3,
    property_image_4: img4,
    agent_name: agentName,
    agent_phone: agentPhone,
    property_price: formattedPrice,
    amenities: amenityPills.join(' '),
    plain_amenities: plainAmenities,
    property_title: estate?.title || 'Propiedad Exclusiva',
    location,
    operation_type: estate?.status_name || (estate?.property_status === 1 ? 'En Alquiler' : 'En Venta'),
    property_type: estate?.type || estate?.category_name || 'Inmueble Residencial',
    qr_code: estate?.qr_code_url || '',
  };
}

/**
 * Sustituye los atajos en el HTML por los valores reales.
 */
export function substituteTemplateShortcuts(rawHtml: string, payload: TemplateDataPayload): string {
  if (!rawHtml) return '';

  // Determinar si el template usa un bloque compacto de features (como en plantillas 4:5)
  const isCompactFeatures = /class=["'][^"']*features[^"']*["'][\s\S]*?\{\{\s*amenities\s*\}\}/i.test(rawHtml);
  const amenitiesStr = isCompactFeatures 
    ? (payload.plain_amenities || payload.amenities || '')
    : (payload.amenities || payload.plain_amenities || '');

  let result = rawHtml;

  // Si hay un bloque .gallery con múltiples {{property_image}}, distribuir fotos disponibles secuencialmente
  const galleryRegex = /(<div[^>]*class=["'][^"']*gallery[^"']*["'][^>]*>)([\s\S]*?)(<\/div>)/i;
  const galleryMatch = result.match(galleryRegex);
  if (galleryMatch) {
    let galleryInner = galleryMatch[2];
    const galleryImages = [
      payload.property_image_2 || payload.property_image_1 || payload.property_image,
      payload.property_image_3 || payload.property_image_2 || payload.property_image_1 || payload.property_image,
      payload.property_image_4 || payload.property_image_3 || payload.property_image_1 || payload.property_image,
      payload.property_image_1 || payload.property_image,
    ].filter(Boolean) as string[];

    let imgIdx = 0;
    galleryInner = galleryInner.replace(/\{\{\s*property_image\s*\}\}/gi, () => {
      const img = galleryImages[imgIdx % galleryImages.length] || payload.property_image || '';
      imgIdx++;
      return img;
    });
    result = result.replace(galleryRegex, `$1${galleryInner}$3`);
  }

  return result
    // Logo
    .replace(/\{\{\s*logo\s*\}\}/gi, payload.logo || '')
    .replace(/\{\{\s*agency_logo\s*\}\}/gi, payload.logo || '')
    .replace(/\{\{\s*brand_logo\s*\}\}/gi, payload.logo || '')
    .replace(/\{\{\s*logo_url\s*\}\}/gi, payload.logo || '')
    // Imágenes individuales
    .replace(/\{\{\s*property_image_1\s*\}\}/gi, payload.property_image_1 || payload.property_image || '')
    .replace(/\{\{\s*image_1\s*\}\}/gi, payload.property_image_1 || payload.property_image || '')
    .replace(/\{\{\s*property_image_2\s*\}\}/gi, payload.property_image_2 || payload.property_image_1 || payload.property_image || '')
    .replace(/\{\{\s*image_2\s*\}\}/gi, payload.property_image_2 || payload.property_image_1 || payload.property_image || '')
    .replace(/\{\{\s*property_image_3\s*\}\}/gi, payload.property_image_3 || payload.property_image_2 || payload.property_image || '')
    .replace(/\{\{\s*image_3\s*\}\}/gi, payload.property_image_3 || payload.property_image_2 || payload.property_image || '')
    .replace(/\{\{\s*property_image_4\s*\}\}/gi, payload.property_image_4 || payload.property_image_3 || payload.property_image || '')
    .replace(/\{\{\s*image_4\s*\}\}/gi, payload.property_image_4 || payload.property_image_3 || payload.property_image || '')
    // Imagen de la propiedad general (Hero)
    .replace(/\{\{\s*property_image\s*\}\}/gi, payload.property_image_1 || payload.property_image || '')
    .replace(/\{\{\s*image\s*\}\}/gi, payload.property_image_1 || payload.property_image || '')
    .replace(/\{\{\s*imagen\s*\}\}/gi, payload.property_image_1 || payload.property_image || '')
    // Nombre y apellido
    .replace(/\{\{\s*agent_name\s*\}\}/gi, payload.agent_name || '')
    .replace(/\{\{\s*nombre_apellido\s*\}\}/gi, payload.agent_name || '')
    .replace(/\{\{\s*name\s*\}\}/gi, payload.agent_name || '')
    // Teléfono
    .replace(/\{\{\s*agent_phone\s*\}\}/gi, payload.agent_phone || '')
    .replace(/\{\{\s*phone\s*\}\}/gi, payload.agent_phone || '')
    .replace(/\{\{\s*telefono\s*\}\}/gi, payload.agent_phone || '')
    .replace(/\{\{\s*numero_de_telefono\s*\}\}/gi, payload.agent_phone || '')
    // Precio
    .replace(/\{\{\s*property_price\s*\}\}/gi, payload.property_price || '')
    .replace(/\{\{\s*price\s*\}\}/gi, payload.property_price || '')
    .replace(/\{\{\s*precio\s*\}\}/gi, payload.property_price || '')
    // Amenidades
    .replace(/\{\{\s*amenities\s*\}\}/gi, amenitiesStr)
    .replace(/\{\{\s*aminidades\s*\}\}/gi, amenitiesStr)
    .replace(/\{\{\s*features\s*\}\}/gi, amenitiesStr)
    // Título y otros
    .replace(/\{\{\s*property_title\s*\}\}/gi, payload.property_title || '')
    .replace(/\{\{\s*title\s*\}\}/gi, payload.property_title || '')
    .replace(/\{\{\s*location\s*\}\}/gi, payload.location || '')
    .replace(/\{\{\s*ubicacion\s*\}\}/gi, payload.location || '')
    .replace(/\{\{\s*operation_type\s*\}\}/gi, payload.operation_type || '')
    .replace(/\{\{\s*property_type\s*\}\}/gi, payload.property_type || '')
    .replace(/\{\{\s*qr_code\s*\}\}/gi, payload.qr_code || '');
}

/**
 * Prepara el documento HTML completo para iframe y canvas:
 * 1. Inyecta las variables CSS de la agencia (--brand-primary, --brand-secondary, etc.)
 * 2. Define las dimensiones exactas de viewport para que las container queries (cqw) funcionen al 100%.
 */
export function prepareHtmlForRendering(
  html: string,
  width: number,
  height: number,
  agency?: any,
  whiteLabel?: any
): string {
  let primary = 
    agency?.primary_color || 
    agency?.details?.primary_color || 
    whiteLabel?.primary_color || 
    '';
  let secondary = 
    agency?.secondary_color || 
    agency?.details?.secondary_color || 
    whiteLabel?.secondary_color || 
    '';

  if (typeof window !== 'undefined') {
    if (!primary) primary = localStorage.getItem('santun_primary_color') || '';
    if (!secondary) secondary = localStorage.getItem('santun_secondary_color') || '';
  }

  if (!primary) primary = '#a46920';
  if (!secondary) secondary = '#4a321e';

  const brandStyles = `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style id="saas-runtime-brand-vars">
      :root, html, body, .property-card {
        --brand-primary: ${primary} !important;
        --brand-secondary: ${secondary} !important;
        --brand-contrast: #ffffff !important;
        --brand-surface: #ffffff !important;
        --brand-ink: #15202b !important;
        --brand-muted: #69727a !important;
      }
      * { box-sizing: border-box; }
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        width: ${width}px !important;
        height: ${height}px !important;
        overflow: hidden !important;
        background: transparent !important;
      }
      .property-card {
        width: ${width}px !important;
        height: ${height}px !important;
        max-width: none !important;
        margin: 0 auto !important;
      }
      /* Corrección crítica de html2canvas para cálculo de baseline de fuentes */
      img {
        display: inline-block !important;
      }
      /* Prevenir recorte o truncado vertical de títulos y textos */
      .copy {
        overflow: visible !important;
      }
      h1, h2, h3 {
        line-height: 1.08 !important;
        overflow: visible !important;
        -webkit-line-clamp: unset !important;
      }
      .features .item {
        max-height: none !important;
        overflow: visible !important;
      }
      .badge {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        height: 4.4cqw !important;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
        line-height: 1 !important;
        box-sizing: border-box !important;
      }
      .cta {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        height: 5.4cqw !important;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
        line-height: 1 !important;
        box-sizing: border-box !important;
      }
      .footer, .agent, .agent strong, .agent span {
        overflow: visible !important;
      }
      .agent strong {
        display: block !important;
        overflow: visible !important;
        text-overflow: unset !important;
        line-height: 1.4 !important;
        padding-bottom: 6px !important;
      }
    </style>
  `;

  if (html.includes('</head>')) {
    return html.replace('</head>', `${brandStyles}</head>`);
  } else if (html.includes('<html')) {
    return html.replace('<html', `<head>${brandStyles}</head><html`);
  } else {
    return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  ${brandStyles}
</head>
<body style="margin:0;padding:0;background:transparent;">
  ${html}
</body>
</html>`;
  }
}

/**
 * Convierte imágenes remotas a data: URLs para acelerar el renderizado,
 * garantizar que html2canvas no sufra bloqueos de CORS y evitar imágenes en blanco.
 */
async function inlineImagesInHtml(html: string): Promise<string> {
  // Capturar src="..." y src='...' tanto absolutas como relativas
  const srcRegex = /src=["']((?:https?:\/\/[^"']+|\/[^"']+|uploads\/[^"']+))["']/gi;
  const matches = Array.from(html.matchAll(srcRegex));
  if (matches.length === 0) return html;

  let processedHtml = html;
  const uniqueUrls = Array.from(new Set(matches.map((m) => m[1])));

  for (const rawUrl of uniqueUrls) {
    if (rawUrl.startsWith('data:') || rawUrl.startsWith('blob:')) continue;

    let fullUrl = rawUrl;
    if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
      fullUrl = `https://santun.tedelpa.com/${rawUrl.replace(/^\/+/, '')}`;
    }

    let base64Result: string | null = null;

    // 1. Intento directo con fetch CORS
    try {
      const res = await fetch(fullUrl, { mode: 'cors' });
      if (res.ok) {
        const blob = await res.blob();
        base64Result = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      }
    } catch {
      // Si falla CORS directo (típico en Hostinger / S3 sin cabeceras), pasar al proxy interno
    }

    // 2. Si falló directo, usar el proxy interno de Next.js (bypassea CORS 100%)
    if (!base64Result || !base64Result.startsWith('data:')) {
      try {
        const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(fullUrl)}`;
        const res = await fetch(proxyUrl);
        if (res.ok) {
          const blob = await res.blob();
          base64Result = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
        }
      } catch {
        // Fallback a canvas en memoria
      }
    }

    // 3. Fallback con Image y Canvas en memoria
    if (!base64Result || !base64Result.startsWith('data:')) {
      try {
        base64Result = await new Promise<string | null>((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            try {
              const c = document.createElement('canvas');
              c.width = img.naturalWidth || 800;
              c.height = img.naturalHeight || 600;
              const ctx = c.getContext('2d');
              if (ctx) {
                ctx.drawImage(img, 0, 0);
                resolve(c.toDataURL('image/png'));
                return;
              }
            } catch {}
            resolve(null);
          };
          img.onerror = () => resolve(null);
          setTimeout(() => resolve(null), 2500);
          img.src = fullUrl;
        });
      } catch {}
    }

    // Si obtuvimos la imagen en Base64, reemplazarla en el HTML
    if (base64Result && base64Result.startsWith('data:')) {
      processedHtml = processedHtml.replaceAll(rawUrl, base64Result);
    }
  }

  return processedHtml;
}

/**
 * Convierte el contenido HTML renderizado a un archivo PNG y lo descarga automáticamente.
 * Utiliza html2canvas dentro de un iframe aislado para soportar CSS moderno,
 * container queries, flexbox/grid y pre-inlinea todas las imágenes en base64 para 0 bloqueos.
 */
export async function downloadHtmlAsPng(
  htmlContent: string,
  width: number,
  height: number,
  filename: string = 'flyer-inmueble.png',
  agency?: any,
  whiteLabel?: any
): Promise<void> {
  const renderedHtml = prepareHtmlForRendering(htmlContent, width, height, agency, whiteLabel);
  const readyHtml = await inlineImagesInHtml(renderedHtml);

  // Crear contenedor offscreen fijado en (0,0) detrás de la pantalla para evitar bugs de coordenadas
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '0';
  container.style.top = '0';
  container.style.width = `${width}px`;
  container.style.height = `${height}px`;
  container.style.overflow = 'hidden';
  container.style.zIndex = '-99999';
  container.style.opacity = '0.01';
  container.style.pointerEvents = 'none';

  // Usar iframe aislado para renderizar fielmente reglas de layout y fuentes
  const iframe = document.createElement('iframe');
  iframe.style.width = `${width}px`;
  iframe.style.height = `${height}px`;
  iframe.style.border = 'none';
  iframe.style.margin = '0';
  iframe.style.padding = '0';
  iframe.style.overflow = 'hidden';

  container.appendChild(iframe);
  document.body.appendChild(container);

  try {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
      throw new Error('No se pudo inicializar el entorno de renderizado de la plantilla.');
    }

    iframeDoc.open();
    iframeDoc.write(readyHtml);
    iframeDoc.close();

    // Esperar renderizado y composición inicial del layout
    await new Promise((resolve) => setTimeout(resolve, 350));

    // Esperar a que terminen de cargar todas las imágenes del iframe
    const images = Array.from(iframeDoc.images);
    if (images.length > 0) {
      await Promise.all(
        images.map((img) => {
          if (img.complete && img.naturalWidth > 0) return Promise.resolve();
          return new Promise<void>((res) => {
            img.onload = () => res();
            img.onerror = () => res();
            setTimeout(() => res(), 3500);
          });
        })
      );
    }

    // Esperar fuentes del documento
    if (iframeDoc.fonts) {
      try {
        await iframeDoc.fonts.ready;
      } catch (e) {}
    }

    const targetElement = (iframeDoc.body.firstElementChild as HTMLElement) || iframeDoc.body;

    const canvas = await html2canvas(targetElement, {
      width,
      height,
      windowWidth: width,
      windowHeight: height,
      scale: 1,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
      onclone: (clonedDoc) => {
        // Inyectar correcciones directamente en el DOM clonado antes de que html2canvas mida fuentes:
        // 1. Evita que FontMetrics mida la línea con img en display: block (causa del desplazamiento hacia abajo)
        // 2. Previene el recorte de cajas de texto (line-height, overflow)
        const fixStyle = clonedDoc.createElement('style');
        fixStyle.textContent = `
          img {
            display: inline-block !important;
          }
          .copy {
            overflow: visible !important;
          }
          h1, h2, h3 {
            line-height: 1.08 !important;
            overflow: visible !important;
            -webkit-line-clamp: unset !important;
          }
          .features .item {
            max-height: none !important;
            overflow: visible !important;
          }
          .badge {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            height: 4.4cqw !important;
            padding-top: 0px !important;
            padding-bottom: 0px !important;
            line-height: 1 !important;
            box-sizing: border-box !important;
          }
          .cta {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            height: 5.4cqw !important;
            padding-top: 0px !important;
            padding-bottom: 0px !important;
            line-height: 1 !important;
            box-sizing: border-box !important;
          }
          .footer, .agent, .agent strong, .agent span {
            overflow: visible !important;
          }
          .agent strong {
            display: block !important;
            overflow: visible !important;
            text-overflow: unset !important;
            line-height: 1.4 !important;
            padding-bottom: 6px !important;
          }
        `;
        clonedDoc.head.appendChild(fixStyle);

        // Compensación milimétrica para centrado vertical de badges y botones en html2canvas
        const badges = clonedDoc.querySelectorAll('.badge');
        badges.forEach((el) => {
          const badgeEl = el as HTMLElement;
          badgeEl.style.display = 'inline-flex';
          badgeEl.style.alignItems = 'center';
          badgeEl.style.justifyContent = 'center';
          badgeEl.style.height = '4.4cqw';
          badgeEl.style.paddingTop = '0px';
          badgeEl.style.paddingBottom = '0px';
          badgeEl.style.boxSizing = 'border-box';
          badgeEl.style.lineHeight = '1';
          const text = badgeEl.textContent?.trim() || '';
          if (text) {
            badgeEl.innerHTML = `<span style="display:inline-block; transform:translateY(-0.35cqw); line-height:1; font-weight:inherit; letter-spacing:inherit;">${text}</span>`;
          }
        });

        const ctas = clonedDoc.querySelectorAll('.cta');
        ctas.forEach((el) => {
          const ctaEl = el as HTMLElement;
          ctaEl.style.display = 'inline-flex';
          ctaEl.style.alignItems = 'center';
          ctaEl.style.justifyContent = 'center';
          ctaEl.style.height = '5.4cqw';
          ctaEl.style.paddingTop = '0px';
          ctaEl.style.paddingBottom = '0px';
          ctaEl.style.boxSizing = 'border-box';
          ctaEl.style.lineHeight = '1';
          const text = ctaEl.textContent?.trim() || '';
          if (text) {
            ctaEl.innerHTML = `<span style="display:inline-block; transform:translateY(-0.35cqw); line-height:1; font-weight:inherit; letter-spacing:inherit;">${text}</span>`;
          }
        });
      },
    });

    await new Promise<void>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          try {
            const dataUrl = canvas.toDataURL('image/png', 1.0);
            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            resolve();
          } catch (err) {
            reject(err);
          }
          return;
        }

        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
        resolve();
      }, 'image/png', 1.0);
    });
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}
