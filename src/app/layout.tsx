import React from 'react';
import type { Metadata } from 'next';
import { AuthProvider } from '@/context/AuthContext';
import '@/index.css';

export const metadata: Metadata = {
  title: 'SANTUN Provider Portal',
  description: 'Plataforma de gestión empresarial conectada a Laravel.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
