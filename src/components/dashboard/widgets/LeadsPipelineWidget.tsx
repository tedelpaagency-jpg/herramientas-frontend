'use client';

import React from 'react';
import Link from 'next/link';
import { Users, ArrowRight, Kanban, Clock, ChevronRight } from 'lucide-react';

interface LeadsPipelineWidgetProps {
  total?: number;
  newThisMonth?: number;
  pipeline?: Record<string, number>;
  recentClients?: any[];
  title?: string;
  link?: string;
}

export const LeadsPipelineWidget: React.FC<LeadsPipelineWidgetProps> = ({
  total = 0,
  newThisMonth = 0,
  pipeline = {},
  recentClients = [],
  title = 'Embudo de Clientes & Prospectos',
  link = '/clients',
}) => {
  const statusColors: Record<string, string> = {
    nuevo: 'bg-blue-500',
    contactado: 'bg-amber-500',
    calificado: 'bg-purple-500',
    propuesta: 'bg-indigo-500',
    ganado: 'bg-emerald-500',
    perdido: 'bg-rose-500',
  };

  const statusLabels: Record<string, string> = {
    nuevo: 'Nuevo',
    contactado: 'Contactado',
    calificado: 'Calificado',
    propuesta: 'Propuesta',
    ganado: 'Ganado',
    perdido: 'Perdido',
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              {title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {newThisMonth > 0 ? `+${newThisMonth} registrados este mes` : `${total} prospectos en total`}
            </p>
          </div>
        </div>

        <Link
          href={link}
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <span>Ver todos</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Pipeline Status Badges */}
      {Object.keys(pipeline).length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-6">
          {Object.entries(pipeline).map(([status, count]) => {
            const key = status.toLowerCase();
            const dotColor = statusColors[key] || 'bg-slate-400';
            const label = statusLabels[key] || status;

            return (
              <div
                key={status}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex flex-col"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                    {label}
                  </span>
                </div>
                <span className="text-lg font-black text-slate-900 dark:text-white">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Recent Clients List */}
      {recentClients.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Prospectos Recientes
          </p>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentClients.map((client) => (
              <Link
                key={client.id}
                href={`/clients`}
                className="py-2.5 px-3 -mx-3 rounded-xl flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {client.name}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {client.email || client.phone || 'Sin datos de contacto'}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {client.status || 'Nuevo'}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-slate-400">
          No hay registros recientes de prospectos.
        </div>
      )}
    </div>
  );
};

export default LeadsPipelineWidget;
