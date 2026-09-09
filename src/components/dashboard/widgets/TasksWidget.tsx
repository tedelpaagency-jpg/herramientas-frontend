'use client';

import React from 'react';
import Link from 'next/link';
import { CheckSquare, Clock, ArrowRight, Calendar } from 'lucide-react';

interface TasksWidgetProps {
  pending?: number;
  recentTasks?: any[];
  title?: string;
  link?: string;
}

export const TasksWidget: React.FC<TasksWidgetProps> = ({
  pending = 0,
  recentTasks = [],
  title = 'Tareas Pendientes',
  link = '/tasks',
}) => {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              {title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {pending} actividades por completar
            </p>
          </div>
        </div>

        <Link
          href={link}
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <span>Ver tablero</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {recentTasks.length > 0 ? (
        <div className="space-y-2">
          {recentTasks.map((task) => (
            <div
              key={task.id}
              className="py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {task.title}
                </p>
                {task.due_at && (
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>Vence: {new Date(task.due_at).toLocaleDateString()}</span>
                  </p>
                )}
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
                Pendiente
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-slate-400">
          No hay tareas pendientes en este momento.
        </div>
      )}
    </div>
  );
};

export default TasksWidget;
