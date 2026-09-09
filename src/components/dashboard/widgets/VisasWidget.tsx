'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, FileCheck, Globe, ChevronRight } from 'lucide-react';

interface VisasWidgetProps {
  total?: number;
  recentVisas?: any[];
}

export const VisasWidget: React.FC<VisasWidgetProps> = ({
  total = 0,
  recentVisas = [],
}) => {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Trámites de Visados
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {total} expedientes en trámite
            </p>
          </div>
        </div>

        <Link
          href="/visas"
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <span>Ver trámites</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {recentVisas.length > 0 ? (
        <div className="space-y-2">
          {recentVisas.map((visa) => (
            <Link
              key={visa.id}
              href="/visas"
              className="py-2.5 px-3 -mx-3 rounded-xl flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {visa.applicant_name}
                </p>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <Globe className="w-3 h-3 text-slate-400" />
                  <span>Destino: {visa.country_destination || 'Por definir'}</span>
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
                  {visa.status || 'En Proceso'}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-slate-400">
          No hay solicitudes de visado activas.
        </div>
      )}
    </div>
  );
};

export default VisasWidget;
