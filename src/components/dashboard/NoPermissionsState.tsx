'use client';

import React from 'react';
import { ShieldAlert, Sparkles, Mail } from 'lucide-react';

interface NoPermissionsStateProps {
  planName?: string;
}

export const NoPermissionsState: React.FC<NoPermissionsStateProps> = ({ planName }) => {
  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 text-center shadow-sm max-w-2xl mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto mb-5">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
        No tienes módulos habilitados en tu plan
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
        {planName ? (
          <>
            Tu suscripción actual al plan <strong className="text-slate-800 dark:text-slate-200">{planName}</strong> aún no cuenta con permisos activos configurados.
          </>
        ) : (
          'Tu cuenta no tiene un plan activo con módulos asignados actualmente.'
        )}
      </p>

      <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300">
        <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
        <span>Ponte en contacto con el administrador de la plataforma para activar tus módulos.</span>
      </div>
    </div>
  );
};

export default NoPermissionsState;
