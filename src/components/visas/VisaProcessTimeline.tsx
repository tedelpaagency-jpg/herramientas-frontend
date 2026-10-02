'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, Circle, Clock, ArrowRight, ShieldCheck, 
  MessageSquare, UserCheck, AlertCircle, Sparkles, Loader2,
  Calendar, Check, ChevronDown, ChevronUp, FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import visaWholesaleService, { 
  VisaPhase, 
  VisaProcessPhaseHistory 
} from '@/services/visaWholesaleService';

interface VisaProcessTimelineProps {
  dossierId: number;
  dossierCode?: string;
  currentPhaseId?: number | null;
  phases?: VisaPhase[];
  histories?: VisaProcessPhaseHistory[];
  isOperator?: boolean;
  readOnly?: boolean;
  onPhaseAdvanced?: (result: any) => void;
  className?: string;
}

export const VisaProcessTimeline: React.FC<VisaProcessTimelineProps> = ({
  dossierId,
  dossierCode,
  currentPhaseId,
  phases = [],
  histories = [],
  isOperator = false,
  readOnly = false,
  onPhaseAdvanced,
  className = '',
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdvanceModalOpen, setIsAdvanceModalOpen] = useState(false);
  const [validationNotes, setValidationNotes] = useState('');
  const [expandedPhaseIds, setExpandedPhaseIds] = useState<Set<number>>(new Set());

  // Sort phases by order
  const sortedPhases = [...phases].sort((a, b) => a.order - b.order);
  const totalPhases = sortedPhases.length;

  // Determine current phase
  const currentPhase = sortedPhases.find((p) => p.id === currentPhaseId) || 
    (totalPhases > 0 && !currentPhaseId ? sortedPhases[0] : null);

  const currentPhaseOrder = currentPhase ? currentPhase.order : (totalPhases > 0 ? 1 : 0);

  // Map histories by phase_id
  const historyByPhaseId = new Map<number, VisaProcessPhaseHistory>();
  histories.forEach((h) => {
    historyByPhaseId.set(h.phase_id, h);
  });

  // Determine if all completed
  const isProcessCompleted = Boolean(
    totalPhases > 0 &&
    currentPhase &&
    currentPhase.order === totalPhases &&
    historyByPhaseId.get(currentPhase.id)?.status === 'completada'
  );

  // Compute progress percentage based on completed phases
  const completedCount = sortedPhases.filter((p) => {
    const h = historyByPhaseId.get(p.id);
    return h?.status === 'completada';
  }).length;

  const progressPercent = totalPhases > 0 ? Math.round((completedCount / totalPhases) * 100) : 0;

  const toggleExpand = (phaseId: number) => {
    setExpandedPhaseIds((prev) => {
      const next = new Set(prev);
      if (next.has(phaseId)) {
        next.delete(phaseId);
      } else {
        next.add(phaseId);
      }
      return next;
    });
  };

  const handleOpenAdvanceModal = () => {
    setValidationNotes('');
    setIsAdvanceModalOpen(true);
  };

  const handleConfirmAdvance = async () => {
    if (!dossierId) return;
    setIsSubmitting(true);
    try {
      const res = await visaWholesaleService.advancePhase(dossierId, validationNotes.trim() || undefined);
      toast.success(res.message || 'Fase validada exitosamente');
      setIsAdvanceModalOpen(false);
      setValidationNotes('');
      if (onPhaseAdvanced) {
        onPhaseAdvanced(res);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error al validar la fase';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (totalPhases === 0) {
    return (
      <div className={`p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 text-center ${className}`}>
        <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-60" />
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          No hay fases configuradas para este trámite migratorio.
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Las fases se configuran automáticamente según el tipo de visado seleccionado.
        </p>
      </div>
    );
  }

  // Next phase name preview
  const nextPhase = sortedPhases.find((p) => p.order === (currentPhase ? currentPhase.order + 1 : 1));

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 1. Header Banner: Estado General y Barra de Progreso */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-slate-700/60 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-sky-500/20 text-sky-400 rounded-lg backdrop-blur-xs">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <span className="text-xs uppercase tracking-wider font-extrabold text-sky-300">
                {isProcessCompleted ? 'Proceso Migratorio Concluido' : 'Timeline del Trámite'}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
              <span>
                {isProcessCompleted
                  ? `COMPLETADO • ${totalPhases} DE ${totalPhases} FASES`
                  : `EN PROCESO • FASE ${currentPhaseOrder} DE ${totalPhases}`}
              </span>
            </h3>
            <p className="text-xs text-slate-300">
              {isProcessCompleted
                ? 'Todas las fases consulares y operativas han sido validadas exitosamente.'
                : `Fase actual activa: ${currentPhase?.name || 'Iniciando trámite'}`}
            </p>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Avance General</span>
            <div className="text-2xl font-black text-sky-400">
              {progressPercent}%
            </div>
            <span className="text-[11px] text-slate-300">
              {completedCount} de {totalPhases} completadas
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5 pt-1">
          <div className="w-full bg-slate-700/70 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                isProcessCompleted
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : 'bg-gradient-to-r from-sky-500 to-indigo-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Vertical Timeline */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Fases del Proceso ({sortedPhases.length})
            </h4>
          </div>

          {/* Quick collapse/expand all */}
          <button
            type="button"
            onClick={() => {
              if (expandedPhaseIds.size === sortedPhases.length) {
                setExpandedPhaseIds(new Set());
              } else {
                setExpandedPhaseIds(new Set(sortedPhases.map((p) => p.id)));
              }
            }}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold"
          >
            {expandedPhaseIds.size === sortedPhases.length ? 'Contraer detalles' : 'Expandir detalles'}
          </button>
        </div>

        <div className="relative pl-3 sm:pl-6 space-y-8">
          {sortedPhases.map((phase, index) => {
            const history = historyByPhaseId.get(phase.id);
            const isCompleted = history?.status === 'completada';
            const isCurrent = !isProcessCompleted && (currentPhase?.id === phase.id);
            const isPending = !isCompleted && !isCurrent;
            const isExpanded = expandedPhaseIds.has(phase.id) || isCurrent;
            const isLast = index === sortedPhases.length - 1;

            return (
              <div key={phase.id} className="relative flex items-start group">
                {/* Connecting Line */}
                {!isLast && (
                  <div
                    className={`absolute left-[15px] top-[32px] bottom-[-32px] w-[2px] transition-colors ${
                      isCompleted
                        ? 'bg-emerald-500'
                        : isCurrent
                        ? 'bg-gradient-to-b from-sky-500 to-slate-200 dark:to-slate-800'
                        : 'bg-slate-200 dark:bg-slate-800'
                    }`}
                  />
                )}

                {/* Node Circle Icon */}
                <div className="relative z-10 mr-4 shrink-0">
                  {isCompleted ? (
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm shadow-emerald-500/30">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center ring-4 ring-sky-100 dark:ring-sky-950/60 shadow-md shadow-sky-500/20 animate-pulse">
                      <span className="font-mono text-xs font-black">{phase.order}</span>
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center border-2 border-slate-300 dark:border-slate-700">
                      <span className="font-mono text-xs font-bold">{phase.order}</span>
                    </div>
                  )}
                </div>

                {/* Phase Content Box */}
                <div
                  className={`flex-1 rounded-2xl p-4 sm:p-5 border transition-all ${
                    isCurrent
                      ? 'bg-sky-50/50 dark:bg-sky-950/20 border-sky-200 dark:border-sky-800/80 shadow-xs'
                      : isCompleted
                      ? 'bg-slate-50/70 dark:bg-slate-800/30 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                      : 'bg-slate-50/30 dark:bg-slate-900/30 border-dashed border-slate-200 dark:border-slate-800/60 opacity-80'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-extrabold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                          Fase {phase.order}
                        </span>
                        {isCurrent && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-sky-500 text-white shadow-xs">
                            <Sparkles className="w-3 h-3" /> Fase Actual
                          </span>
                        )}
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            <Check className="w-3 h-3" /> Completada
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500">
                            Pendiente
                          </span>
                        )}
                      </div>

                      <h5 className="font-extrabold text-slate-900 dark:text-white text-base">
                        {phase.name}
                      </h5>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <button
                        type="button"
                        onClick={() => toggleExpand(phase.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800"
                        title={isExpanded ? 'Ocultar descripción' : 'Ver descripción'}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Phase Description */}
                  {phase.description && isExpanded && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed bg-white/70 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      {phase.description}
                    </p>
                  )}

                  {/* History Details: Completed At / Validator / Notes */}
                  {isCompleted && history && (
                    <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>Completada el: </span>
                        <strong className="text-slate-800 dark:text-slate-200 font-semibold">
                          {history.completed_at ? new Date(history.completed_at).toLocaleString() : 'Fecha no registrada'}
                        </strong>
                      </div>

                      {(history.completedByUser || history.completed_by_user) && (
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <UserCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                          <span>Validada por: </span>
                          <strong className="text-slate-800 dark:text-slate-200 font-semibold">
                            {(history.completedByUser || history.completed_by_user)?.name}
                          </strong>
                        </div>
                      )}

                      {history.notes && (
                        <div className="sm:col-span-2 mt-1 p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-300">
                          <div className="flex items-center gap-1.5 font-bold text-[11px] uppercase tracking-wide text-emerald-800 dark:text-emerald-400 mb-1">
                            <MessageSquare className="w-3 h-3" /> Observaciones de Validación:
                          </div>
                          <p className="text-xs whitespace-pre-wrap">{history.notes}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Current Phase Operator Action */}
                  {isCurrent && (
                    <div className="mt-4 pt-3 border-t border-sky-200/60 dark:border-sky-800/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="text-xs text-sky-800 dark:text-sky-300 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                        <span>Iniciada el: </span>
                        <strong>
                          {history?.started_at ? new Date(history.started_at).toLocaleString() : 'En curso'}
                        </strong>
                      </div>

                      {/* Operator Advance Button */}
                      {isOperator && !readOnly && (
                        <button
                          type="button"
                          onClick={handleOpenAdvanceModal}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-xl shadow-md shadow-sky-600/20 transition-all active:scale-95"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Validar y avanzar fase</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Modal de Confirmación y Validación de Fase (Operador Mayorista) */}
      {isAdvanceModalOpen && currentPhase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="p-2.5 bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 rounded-2xl">
                  <ShieldCheck className="w-6 h-6" />
                </span>
                <div>
                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Validación y Cierre de Fase
                  </h4>
                  <p className="text-xs text-slate-500 font-mono">
                    Expediente {dossierCode || `#${dossierId}`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAdvanceModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Fase a Completar (Fase {currentPhase.order} de {totalPhases})
                </span>
                <p className="font-extrabold text-slate-900 dark:text-white text-sm">
                  {currentPhase.name}
                </p>
                {nextPhase ? (
                  <p className="text-xs text-sky-600 dark:text-sky-400 font-medium pt-1">
                    ↳ Siguiente fase: <strong>Fase {nextPhase.order}: {nextPhase.name}</strong>
                  </p>
                ) : (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold pt-1">
                    ✓ Esta es la última fase. Al confirmar, el expediente pasará automáticamente a estado <strong>COMPLETADO</strong>.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Notas u Observaciones de Validación (Opcional)
                </label>
                <textarea
                  rows={3}
                  value={validationNotes}
                  onChange={(e) => setValidationNotes(e.target.value)}
                  placeholder="Ej: Todos los documentos revisados y cotejados con el consulado. Cita agendada para el 15 de Noviembre..."
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500 dark:text-slate-100 placeholder:text-slate-400 resize-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Estas observaciones quedarán registradas en la auditoría del expediente y serán visibles en la línea de tiempo.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setIsAdvanceModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold transition-all disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmAdvance}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs shadow-md shadow-sky-600/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Validando fase...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirmar avance de fase</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisaProcessTimeline;
