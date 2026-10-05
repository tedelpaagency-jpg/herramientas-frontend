'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import visaWholesaleService, { VisaProcessType } from '@/services/visaWholesaleService';
import { 
  ShieldCheck, Plus, ArrowLeft, RefreshCw, FileText, 
  Layers, CheckSquare, Clock, Globe, Sparkles,
  DollarSign, Pencil, X
} from 'lucide-react';
import toast from 'react-hot-toast';

export const VisaProcessTypesPage: React.FC = () => {
  const [processTypes, setProcessTypes] = useState<VisaProcessType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProcess, setSelectedProcess] = useState<VisaProcessType | null>(null);

  // Edición de precio / costo base
  const [editingProcessId, setEditingProcessId] = useState<number | null>(null);
  const [costInput, setCostInput] = useState<string>('150');
  const [isSavingCost, setIsSavingCost] = useState(false);

  const fetchProcessTypes = async () => {
    setIsLoading(true);
    try {
      const data = await visaWholesaleService.getProcessTypes({ all: true });
      setProcessTypes(data || []);
      if (data && data.length > 0 && !selectedProcess) {
        setSelectedProcess(data[0]);
      }
    } catch (err) {
      toast.error('Error al cargar tipos de procesos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProcessId || !selectedProcess) return;
    const numCost = parseFloat(costInput);
    if (isNaN(numCost) || numCost < 0) {
      toast.error('Ingrese un monto válido');
      return;
    }

    setIsSavingCost(true);
    try {
      await visaWholesaleService.updateProcessType(editingProcessId, { cost: numCost });
      toast.success(`¡Costo de ${selectedProcess.name} actualizado a $${numCost.toFixed(2)} USD!`);
      setSelectedProcess((prev) => prev ? { ...prev, cost: numCost } : null);
      setProcessTypes((prev) =>
        prev.map((pt) => (pt.id === editingProcessId ? { ...pt, cost: numCost } : pt))
      );
      setEditingProcessId(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al actualizar precio');
    } finally {
      setIsSavingCost(false);
    }
  };

  useEffect(() => {
    fetchProcessTypes();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Catálogo de Procesos Migratorios</h1>
          </div>
          <p className="text-sm text-slate-500">
            Configure etapas, motores de progreso, secciones del formulario dinámico y checklists de documentos requeridos sin modificar código.
          </p>
        </div>

        <Link
          href="/visas/mayorista"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Centro Operacional
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Process List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Procesos Disponibles</h3>
          {isLoading ? (
            <div className="p-8 text-center text-slate-400">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-500" />
              Cargando catálogo...
            </div>
          ) : (
            processTypes.map((pt) => (
              <div
                key={pt.id}
                onClick={() => setSelectedProcess(pt)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedProcess?.id === pt.id
                    ? 'bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-500 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{pt.flag_icon || '🌐'}</span>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{pt.name}</h4>
                      <p className="text-xs text-slate-500">{pt.country} • {pt.estimated_duration || 'Duración estándar'}</p>
                    </div>
                  </div>
                  <span className="font-black text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-lg shrink-0">
                    ${Number(pt.cost || 150).toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Selected Process Schema Details */}
        <div className="lg:col-span-2 space-y-6">
          {selectedProcess ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedProcess.flag_icon}</span>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{selectedProcess.name}</h2>
                    <p className="text-xs text-slate-500">{selectedProcess.description || 'Proceso consular migratorio'}</p>
                  </div>
                </div>

                {/* Precio / Costo Configurable B2B */}
                <div className="flex items-center gap-2.5 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3 rounded-2xl">
                  {editingProcessId === selectedProcess.id ? (
                    <form onSubmit={handleSaveCost} className="flex items-center gap-2">
                      <div className="relative">
                        <DollarSign className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          required
                          value={costInput}
                          onChange={(e) => setCostInput(e.target.value)}
                          className="w-24 pl-7 pr-2 py-1 text-xs font-bold bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:text-slate-100"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSavingCost}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold disabled:opacity-50 transition-colors"
                      >
                        {isSavingCost ? '...' : 'Guardar'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingProcessId(null)}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </form>
                  ) : (
                    <>
                      <div>
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                          Costo Base B2B
                        </span>
                        <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                          ${Number(selectedProcess.cost || 150).toFixed(2)} USD
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setEditingProcessId(selectedProcess.id);
                          setCostInput(String(selectedProcess.cost ?? 150));
                        }}
                        className="p-2 bg-white dark:bg-slate-900 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl transition-all shadow-xs"
                        title="Modificar precio de este trámite"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Etapas y Motor de Progreso */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-500" />
                  Motor de Etapas y Porcentajes de Progreso
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedProcess.stages_schema?.map((st) => (
                    <div key={st.key} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">{st.name}</span>
                        <span className="text-slate-400 font-mono text-[10px]">Clave: {st.key}</span>
                      </div>
                      <span className="font-black text-indigo-600 dark:text-indigo-400 text-sm bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-lg">
                        {st.weight}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Secciones del Formulario Dinámico */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-sky-500" />
                  Estructura del Formulario Consular Dinámico
                </h4>
                <div className="space-y-3">
                  {selectedProcess.form_schema?.sections?.map((sec, idx) => (
                    <div key={sec.id} className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                      <div className="flex justify-between items-center">
                        <strong className="text-xs font-bold text-slate-800 dark:text-slate-200">{sec.title}</strong>
                        <span className="text-[10px] text-slate-400 font-medium">{sec.fields?.length || 0} campos configurados</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {sec.fields?.map((f) => (
                          <span
                            key={f.name}
                            className={`text-[11px] px-2 py-0.5 rounded-md ${
                              f.required_for_review
                                ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 font-semibold border border-sky-200 dark:border-sky-800'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {f.label} ({f.type})
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documentos Requeridos Checklist */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  Checklist de Documentos Exigidos
                </h4>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
                  {selectedProcess.required_documents?.map((rd) => (
                    <div key={rd.type} className="p-3 bg-white dark:bg-slate-900 flex justify-between items-center">
                      <div>
                        <strong className="text-slate-800 dark:text-slate-200 block">{rd.name}</strong>
                        <span className="text-slate-400">{rd.description}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${rd.required ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300' : 'bg-slate-100 text-slate-600'}`}>
                        {rd.required ? 'Obligatorio' : 'Opcional'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              Seleccione un tipo de proceso del listado para inspeccionar su configuración.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
