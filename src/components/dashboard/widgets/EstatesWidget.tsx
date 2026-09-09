'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, ArrowRight, MapPin, Tag, ChevronRight } from 'lucide-react';

interface EstatesWidgetProps {
  total?: number;
  active?: number;
  recentEstates?: any[];
}

export const EstatesWidget: React.FC<EstatesWidgetProps> = ({
  total = 0,
  active = 0,
  recentEstates = [],
}) => {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Catálogo Inmobiliario
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {active > 0 ? `${active} propiedades activas (${total} total)` : `${total} inmuebles registrados`}
            </p>
          </div>
        </div>

        <Link
          href="/estates"
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <span>Ver catálogo</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {recentEstates.length > 0 ? (
        <div className="space-y-2">
          {recentEstates.map((estate) => (
            <Link
              key={estate.id}
              href={`/estates`}
              className="py-2.5 px-3 -mx-3 rounded-xl flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {estate.title}
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                  {estate.city && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {estate.city}
                    </span>
                  )}
                  {estate.price && (
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      ${Number(estate.price).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                  estate.status === 'active'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}>
                  {estate.status || 'Activa'}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-slate-400">
          No hay propiedades registradas aún.
        </div>
      )}
    </div>
  );
};

export default EstatesWidget;
