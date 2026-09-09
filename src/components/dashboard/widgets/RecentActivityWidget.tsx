'use client';

import React from 'react';
import { Activity, Clock, ShieldCheck, UserCheck, Building2, Zap } from 'lucide-react';

interface RecentActivityWidgetProps {
  activities?: any[];
  title?: string;
}

export const RecentActivityWidget: React.FC<RecentActivityWidgetProps> = ({
  activities = [],
  title = 'Registro de Actividad Reciente',
}) => {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            {title}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Últimas acciones y eventos del sistema
          </p>
        </div>
      </div>

      {activities.length > 0 ? (
        <div className="space-y-3">
          {activities.map((act) => (
            <div
              key={act.id}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
            >
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {act.action || 'Acción del sistema'}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                  {act.user?.name && <span>Por: {act.user.name}</span>}
                  {act.created_at && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(act.created_at).toLocaleDateString()} {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-slate-400">
          No hay actividad registrada recientemente.
        </div>
      )}
    </div>
  );
};

export default RecentActivityWidget;
