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

                  var isPublic = !hasToken && !isAppRoute && (
                                 p.startsWith('/travel-agency-03') ||
                                 p.startsWith('/properties') ||
                                 p.startsWith('/landing') ||
                                 p === '/'
                  );

                  if (isPublic) {
                    document.documentElement.classList.remove('dark');
                    return;
                  }
                  var saved = localStorage.getItem('santun_theme') || localStorage.getItem('santun_dark_theme');
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
