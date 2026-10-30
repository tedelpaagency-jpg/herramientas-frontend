/**
 * Utilidades para sustitución de atajos (shortcuts) y renderizado de plantillas HTML
 * para flyers e imágenes inmobiliarias.
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
  customSlotImages?: Record<number, string>
): TemplateDataPayload {
  const agencyLogo = agency?.logo || agency?.logo_2 || agency?.details?.logo || '';
  
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
  const agentName = estate?.user?.name || agency?.commercial_name || agency?.name || 'Asesor Inmobiliario';
  const agentPhone = estate?.user?.phone || estate?.contact_phone || agency?.phone || agency?.whatsapp || '+593 99 999 9999';

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
    logo: agencyLogo || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=200&q=80',
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
  agency?: any
): string {
  const primary = agency?.primary_color || agency?.details?.primary_color || '#a46920';
  const secondary = agency?.secondary_color || agency?.details?.secondary_color || '#4a321e';

  const brandStyles = `
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
 * Convierte imágenes remotas a data: URLs para evitar problemas de CORS/taint en SVG Canvas.
 */
async function inlineImagesInHtml(html: string): Promise<string> {
  const imgRegex = /src=["'](https?:\/\/[^"']+)["']/gi;
  const matches = Array.from(html.matchAll(imgRegex));
  if (matches.length === 0) return html;

  let processedHtml = html;
  for (const match of matches) {
    const originalUrl = match[1];
    try {
      const res = await fetch(originalUrl, { mode: 'cors' });
      if (res.ok) {
        const blob = await res.blob();
        const base64: string = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
        if (base64 && base64.startsWith('data:')) {
          processedHtml = processedHtml.replaceAll(originalUrl, base64);
        }
      }
    } catch {
      // Ignorar y mantener URL original si hay restricción de origen
    }
  }
  return processedHtml;
}

/**
 * Extrae contenido para encapsular dentro del foreignObject de SVG sin tags de documento exterior.
 */
function extractForForeignObject(fullHtml: string): string {
  const styleMatches = fullHtml.match(/<style[\s\S]*?<\/style>/gi) || [];
  const styles = styleMatches.join('\n');
  const bodyMatch = fullHtml.match(/<body[\s\S]*?>([\s\S]*?)<\/body>/i);
  const content = bodyMatch ? bodyMatch[1] : fullHtml.replace(/<!doctype[\s\S]*?>/i, '').replace(/<\/?html[\s\S]*?>/gi, '').replace(/<\/?head[\s\S]*?>/gi, '');
  return `${styles}\n${content}`;
}

/**
 * Convierte el contenido HTML renderizado a un archivo PNG y lo descarga automáticamente.
 */
export async function downloadHtmlAsPng(
  htmlContent: string,
  width: number,
  height: number,
  filename: string = 'flyer-inmueble.png',
  agency?: any
): Promise<void> {
  const renderedHtml = prepareHtmlForRendering(htmlContent, width, height, agency);
  const readyHtml = await inlineImagesInHtml(renderedHtml);
  const foreignObjectContent = extractForForeignObject(readyHtml);

  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('No se pudo inicializar el contexto 2D de canvas');
      }

      // Encapsular en SVG ForeignObject
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
          <foreignObject width="100%" height="100%">
            <div xmlns="http://www.w3.org/1999/xhtml" style="width: ${width}px; height: ${height}px; margin: 0; padding: 0; overflow: hidden;">
              ${foreignObjectContent}
            </div>
          </foreignObject>
        </svg>
      `;

      const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new Image();

      img.onload = () => {
        try {
          ctx.drawImage(img, 0, 0, width, height);
          URL.revokeObjectURL(url);

          canvas.toBlob((pngBlob) => {
            if (!pngBlob) {
              // Fallback con toDataURL
              const dataUrl = canvas.toDataURL('image/png', 1.0);
              const a = document.createElement('a');
              a.href = dataUrl;
              a.download = filename;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              resolve();
              return;
            }

            const downloadUrl = URL.createObjectURL(pngBlob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
            resolve();
          }, 'image/png', 1.0);
        } catch (drawErr) {
          URL.revokeObjectURL(url);
          reject(drawErr);
        }
      };

      img.onerror = (e) => {
        URL.revokeObjectURL(url);
        reject(new Error('Error al cargar la imagen SVG de la plantilla en el Canvas'));
      };

      img.src = url;
    } catch (err) {
      reject(err);
    }
  });
}
