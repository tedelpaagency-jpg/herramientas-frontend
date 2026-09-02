'use client';

import { useSearchParams } from 'next/navigation';
import PublicHunterStorePage from '@/views/PublicHunterStorePage';
import { Suspense } from 'react';

function GenericFormContent() {
  const searchParams = useSearchParams();
  const campaignToken = searchParams.get('campaign') || searchParams.get('store') || searchParams.get('id') || '';

  return <PublicHunterStorePage idOrToken={campaignToken} />;
}

export default function GenericFormPublicPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Cargando...</div>}>
      <GenericFormContent />
    </Suspense>
  );
}
