'use client';

import React from 'react';
import Link from 'next/link';
import { LucideIcon, ArrowUpRight } from 'lucide-react';

interface DashboardMetricCardProps {
  title: string;
  value: number | string | null | undefined;
  label?: string;
  icon: LucideIcon;
  gradient: string;
  link?: string;
  badge?: string;
  badgeType?: 'success' | 'info' | 'warning' | 'neutral';
  isLoading?: boolean;
}

export const DashboardMetricCard: React.FC<DashboardMetricCardProps> = ({
  title,
  value,
  label,
  icon: Icon,
  gradient,
  link,
  badge,
  badgeType = 'info',
  isLoading = false,
}) => {
  const badgeStyles = {
    success: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60',
    info: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/60',
    warning: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/60',
    neutral: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  };

  const content = (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          {isLoading ? (
            <div className="h-9 w-24 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg mt-1" />
          ) : (
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {value ?? 0}
            </h3>
          )}
          {label && (
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {label}
            </p>
          )}
          {badge && (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${badgeStyles[badgeType]} mt-1`}>
              {badge}
            </span>
          )}
        </div>

        <div className={`p-3 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg shrink-0 transition-transform duration-200 group-hover:scale-105`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {link && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
          <span>Ver detalles</span>
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      )}
    </div>
  );

  if (link) {
    return (
      <Link href={link} className="block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-2xl">
        {content}
      </Link>
    );
  }

  return content;
};

export default DashboardMetricCard;
