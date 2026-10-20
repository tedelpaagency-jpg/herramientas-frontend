'use client';

import React, { Suspense } from 'react';
import PublicInmobiliariaPropertiesView from '@/views/inmobiliaria/PublicInmobiliariaPropertiesView';

export default function PublicPropertiesRoutePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PublicInmobiliariaPropertiesView />
    </Suspense>
  );
}

