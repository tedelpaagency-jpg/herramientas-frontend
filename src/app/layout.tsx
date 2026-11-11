import React from 'react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import { getDomainMetadata } from '@/utils/seoHelper';
import '@/index.css';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const host = headersList.get('x-forwarded-host') || headersList.get('host') || '';
  return await getDomainMetadata(host);
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Anti-FOUC theme script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var p = window.location.pathname;
                  var hasToken = !!localStorage.getItem('santun_auth_token');
                  var isAppRoute = p.startsWith('/estates') ||
                                 p.startsWith('/my-estates') ||
                                 p.startsWith('/admin') ||
                                 p.startsWith('/crm') ||
                                 p.startsWith('/tasks') ||
                                 p.startsWith('/profile') ||
                                 p.startsWith('/roles') ||
                                 p.startsWith('/agencies') ||
                                 p.startsWith('/white-label') ||
                                 p.startsWith('/visas') ||
                                 p.startsWith('/products') ||
                                 p.startsWith('/settings');

                  var isPublic = !isAppRoute && (
                                 p.startsWith('/travel-agency-03') ||
                                 p.startsWith('/properties') ||
                                 p.startsWith('/services') ||
                                 p.startsWith('/servicios') ||
                                 p.startsWith('/about') ||
                                 p.startsWith('/conocenos') ||
                                 p.startsWith('/contact') ||
                                 p.startsWith('/contacto') ||
                                 p.startsWith('/privacy') ||
                                 p.startsWith('/privacidad') ||
                                 p.startsWith('/politica-de-privacidad') ||
                                 p.startsWith('/landing') ||
                                 p === '/'
                  );

                  if (isPublic) {
                    document.documentElement.classList.remove('dark');
                    return;
                  }
                  var saved = localStorage.getItem('santun_theme');
                  var isDark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        {/* PWA Manifest & App Links */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Immobillis" />
        <link rel="apple-touch-icon" href="/android-icon-512x512.png" />

        {/* PWA Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/pwabuilder-sw.js').catch(function() {
                    navigator.serviceWorker.register('/sw.js').catch(function() {});
                  });
                });
              }
            `,
          }}
        />

        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body suppressHydrationWarning className="bg-background text-on-background min-h-screen antialiased transition-colors duration-200">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-right" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
