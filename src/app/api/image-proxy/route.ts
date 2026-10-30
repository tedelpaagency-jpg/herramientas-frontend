import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Proxy de imágenes para el generador de Canvas y PNGs inmobiliarios.
 * Permite descargar imágenes remotas (CDNs, Hostinger, AWS, etc.) sin bloqueos de CORS en el navegador.
 */
export async function GET(request: NextRequest) {
  const urlParam = request.nextUrl.searchParams.get('url');
  if (!urlParam) {
    return new NextResponse('Parámetro url es requerido', { status: 400 });
  }

  try {
    let targetUrl = decodeURIComponent(urlParam);

    // Si la URL es relativa, prepend el dominio base de la plataforma
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = `https://santun.tedelpa.com/${targetUrl.replace(/^\/+/, '')}`;
    }

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) InmosoftCanvasProxy/1.0',
        Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      return new NextResponse(`Error al descargar imagen: ${response.status} ${response.statusText}`, {
        status: response.status,
      });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400',
      },
    });
  } catch (error: any) {
    console.error('Error in image-proxy API:', error);
    return new NextResponse(error?.message || 'Error interno al procesar imagen proxy', { status: 500 });
  }
}

