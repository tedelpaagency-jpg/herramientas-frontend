import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import PublicInmobiliariaAboutView from '@/views/inmobiliaria/PublicInmobiliariaAboutView';
import { getDomainMetadata } from '@/utils/seoHelper';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const host = headersList.get('x-forwarded-host') || headersList.get('host') || '';
  const domainMeta = await getDomainMetadata(host);
  return {
    ...domainMeta,
    title: `Conócenos | ${domainMeta.title || 'Inmobiliaria'}`,
    description: 'Conoce nuestra historia, misión, visión y equipo de profesionales inmobiliarios.',
  };
}

export default function PublicAboutRoutePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PublicInmobiliariaAboutView />
    </Suspense>
  );
}

