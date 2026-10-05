'use client';

import React from 'react';
import { CheckCircle2, Clock, Save, RefreshCw, Sparkles } from 'lucide-react';

export interface SectionProgressBarProps {
  sectionId: string;
  sectionTitle?: string;
  totalFields: number;
  filledFields: number;
  isSaving?: boolean;
  isSaved?: boolean;
  onSaveSection?: (sectionId: string) => void;
  readOnly?: boolean;
  className?: string;
}

export const SectionProgressBar: React.FC<SectionProgressBarProps> = ({
  sectionId,
  sectionTitle,
  totalFields,
  filledFields,
  isSaving = false,
  isSaved = false,
  onSaveSection,
  readOnly = false,
  className = '',
}) => {
  const safeTotal = Math.max(1, totalFields);
  const safeFilled = Math.min(safeTotal, Math.max(0, filledFields));
  const missingCount = Math.max(0, safeTotal - safeFilled);
  const percentage = Math.round((safeFilled / safeTotal) * 100);
  const isComplete = safeFilled >= safeTotal;

  return (
    <div className={`p-4 rounded-xl border transition-all duration-300 ${
      isComplete
        ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60'
        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
    } ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Metric info */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {isComplete ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/60 animate-pulse">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>¡Sección Completada!</span>
                <Sparkles className="w-3 h-3 text-amber-500" />
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60">
                <Clock className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>En progreso</span>
              </span>
            )}

            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {safeFilled} de {safeTotal} campos ({percentage}%)
            </span>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {isComplete ? (
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                Todos los campos de esta sección han sido diligenciados.
              </span>
            ) : (
              <span>
                Faltan <strong className="text-slate-700 dark:text-slate-200">{missingCount}</strong> {missingCount === 1 ? 'campo' : 'campos'} por completar en esta sección.
              </span>
            )}
          </p>
        </div>

        {/* Action Button */}
        {!readOnly && onSaveSection && (
          <div className="flex items-center gap-2 shrink-0">
            {isSaved && !isSaving && (
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Sección guardada
              </span>
            )}

            <button
              type="button"
              onClick={() => onSaveSection(sectionId)}
              disabled={isSaving}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs ${
                isComplete
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-sky-600 hover:bg-sky-500 text-white'
              } disabled:opacity-50 active:scale-95`}
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Sección</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Progress Track */}
      <div className="mt-2.5 w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            isComplete
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
              : 'bg-gradient-to-r from-sky-500 to-indigo-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default SectionProgressBar;
