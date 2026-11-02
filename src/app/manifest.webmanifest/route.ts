import { NextResponse } from 'next/server';

export async function GET() {
  const manifest = {
    name: "Immobillis - Agencia Inmobiliaria",
    short_name: "Immobillis",
    start_url: "/",
    display: "fullscreen",
    orientation: "portrait",
    theme_color: "#FFFFFF",
    background_color: "#FFFFFF",
    icons: [
      {
        src: "/public/assets/frontend/images/logo/android-icon-512x512.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/public/assets/frontend/images/logo/android-icon-512x512.png",
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: "/android-icon-512x512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ],
    id: "0001",
    description: "Aplicación de Immobillis"
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
