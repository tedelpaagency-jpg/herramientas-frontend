import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import PublicInmobiliariaDetailView from '@/views/inmobiliaria/PublicInmobiliariaDetailView';
import { getPropertyMetadata } from '@/utils/seoHelper';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const headersList = headers();
  const host = headersList.get('x-forwarded-host') || headersList.get('host') || '';
  return await getPropertyMetadata(params.slug, host);
}

export default function PublicPropertyDetailRoutePage({
  params,
}: {
  params: { slug: string };
}) {
  const decodedSlug = decodeURIComponent(params.slug);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PublicInmobiliariaDetailView slug={decodedSlug} />
    </Suspense>
  );
}
