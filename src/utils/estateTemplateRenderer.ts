/**
 * Utilidades para sustitución de atajos (shortcuts) y renderizado de plantillas HTML
 * para flyers e imágenes inmobiliarias.
 */

export interface TemplateDataPayload {
  logo?: string;
  property_image?: string;
  agent_name?: string;
  agent_phone?: string;
  property_price?: string;
  amenities?: string;
  property_title?: string;
  location?: string;
  operation_type?: string;
  property_type?: string;
  qr_code?: string;
}

/**
 * Convierte una propiedad y agencia en un payload de datos listo para los atajos.
 */
export function buildEstatePayload(estate: any, agency?: any, selectedImageIndex?: number): TemplateDataPayload {
  const agencyLogo = agency?.logo || agency?.logo_2 || agency?.details?.logo || '';
  
  // Extraer imagen principal de la propiedad
  let propertyImg = '';
  if (estate?.images && estate.images.length > 0) {
    const idx = (typeof selectedImageIndex === 'number' && selectedImageIndex >= 0 && selectedImageIndex < estate.images.length)
      ? selectedImageIndex
      : 0;
    const selected = estate.images[idx];
    propertyImg = typeof selected === 'string' ? selected : (selected.image_path || selected.url || '');
  }
  if (!propertyImg && estate?.image) {
    propertyImg = estate.image;
  }
  if (!propertyImg) {
    propertyImg = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';
  }

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

  // Generar HTML estilizado de amenidades (Pills)
  const amenityPills: string[] = [];
  const specs = estate?.specs || {};

  const bedrooms = estate?.bedrooms ?? specs.bedrooms;
  if (bedrooms) {
    amenityPills.push(`
      <span style="display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.18); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.3); padding: 8px 18px; border-radius: 9999px; color: #ffffff; font-weight: 700; font-size: 16px;">
        🛏️ ${bedrooms} Hab.
      </span>
    `);
  }

  const bathrooms = estate?.bathrooms ?? specs.bathrooms;
  if (bathrooms) {
    amenityPills.push(`
      <span style="display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.18); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.3); padding: 8px 18px; border-radius: 9999px; color: #ffffff; font-weight: 700; font-size: 16px;">
        🚿 ${bathrooms} Baños
      </span>
    `);
  }

  const garage = estate?.garage ?? specs.garage ?? estate?.parking;
  if (garage) {
    amenityPills.push(`
      <span style="display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.18); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.3); padding: 8px 18px; border-radius: 9999px; color: #ffffff; font-weight: 700; font-size: 16px;">
        🚗 ${garage} Estac.
      </span>
    `);
  }

  const size = estate?.surface_total || estate?.size_meters || specs.size || estate?.covered_surface;
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
    agent_name: agentName,
    agent_phone: agentPhone,
    property_price: formattedPrice,
    amenities: amenityPills.join(' '),
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

  return rawHtml
    // Logo
    .replace(/\{\{\s*logo\s*\}\}/gi, payload.logo || '')
    .replace(/\{\{\s*agency_logo\s*\}\}/gi, payload.logo || '')
    // Imagen de la propiedad
    .replace(/\{\{\s*property_image\s*\}\}/gi, payload.property_image || '')
    .replace(/\{\{\s*image\s*\}\}/gi, payload.property_image || '')
    .replace(/\{\{\s*imagen\s*\}\}/gi, payload.property_image || '')
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
    .replace(/\{\{\s*amenities\s*\}\}/gi, payload.amenities || '')
    .replace(/\{\{\s*aminidades\s*\}\}/gi, payload.amenities || '')
    .replace(/\{\{\s*features\s*\}\}/gi, payload.amenities || '')
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
 * Convierte el contenido HTML renderizado a un archivo PNG y lo descarga automáticamente.
 */
export async function downloadHtmlAsPng(
  htmlContent: string,
  width: number,
  height: number,
  filename: string = 'flyer-inmueble.png'
): Promise<void> {
  const readyHtml = await inlineImagesInHtml(htmlContent);

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
            <div xmlns="http://www.w3.org/1999/xhtml" style="width: 100%; height: 100%; margin: 0; padding: 0;">
              ${readyHtml}
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
