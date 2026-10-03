'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import visaWholesaleService, { VisaDossier } from '@/services/visaWholesaleService';
import { 
  Building2, ShieldCheck, Clock, AlertTriangle, AlertCircle, 
  CheckCircle2, RefreshCw, Eye, ArrowRight, Filter, Users, 
  FileText, ExternalLink, Calendar, Search, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

export const MayoristaVisasDashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<any>({
    total_agencias: 0,
    total_expedientes: 0,
    nuevos_expedientes: 0,
    pendientes_revision: 0,
    pendientes_cliente: 0,
    pendientes_agencia: 0,
    documentos_observados: 0,
    procesos_urgentes: 0,
    procesos_completados: 0,
  });

  const [miTrabajo, setMiTrabajo] = useState<{
    requieren_atencion: VisaDossier[];
    pendientes_revision: VisaDossier[];
  }>({
    requieren_atencion: [],
    pendientes_revision: [],
  });

  const [agencies, setAgencies] = useState<any[]>([]);
  const [selectedAgencyId, setSelectedAgencyId] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'atencion' | 'revision'>('atencion');
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboard = async () => {
    setIsLoading(true);
    try {
      const [dashData, agenciesData] = await Promise.all([
        visaWholesaleService.getMayoristaDashboard(selectedAgencyId !== 'all' ? Number(selectedAgencyId) : undefined),
        visaWholesaleService.getMayoristaAgencies(),
      ]);

      if (dashData?.metrics) {
        setMetrics(dashData.metrics);
      }
      if (dashData?.mi_trabajo) {
        setMiTrabajo({
          requieren_atencion: dashData.mi_trabajo.requieren_atencion || [],
          pendientes_revision: dashData.mi_trabajo.pendientes_revision || [],
        });
      }
      setAgencies(agenciesData?.data || agenciesData || []);
    } catch (err) {
      console.error('Error al cargar dashboard de mayorista:', err);
      toast.error('Error al cargar información operativa');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [selectedAgencyId]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl text-white shadow-xl border border-indigo-900/50">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-500/20 backdrop-blur-md rounded-lg text-indigo-400">
              <Building2 className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight">Centro Operacional Mayorista</h1>
          </div>
          <p className="text-indigo-200 text-sm max-w-2xl">
            Supervisión, revisión documental y control de expedientes de todas las agencias afiliadas autorizadas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/visas/mayorista/agencias"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-all border border-white/10 backdrop-blur-md"
          >
            <Building2 className="w-4 h-4" />
            <span>Directorio de Agencias ({metrics.total_agencias})</span>
          </Link>
          <Link
            href="/visas/tipos"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-md shadow-indigo-600/30"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Configurar Tipos de Visas</span>
          </Link>
        </div>
      </div>

      {/* Selector de Agencia & Filtro Contextual */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
          <Filter className="w-4 h-4 text-indigo-500" />
          <span>Contexto Operativo:</span>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedAgencyId}
            onChange={(e) => setSelectedAgencyId(e.target.value)}
            className="w-full sm:w-80 px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-slate-100"
          >
            <option value="all">Todas las Agencias Autorizadas ({metrics.total_agencias})</option>
            {agencies.map((agency: any) => (
              <option key={agency.id} value={agency.id}>
                {agency.name} ({agency.city || agency.country || 'Agencia'})
              </option>
            ))}
          </select>
          <button
            onClick={fetchDashboard}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-xl"
            title="Actualizar"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Métricas Operativas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm text-center">
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Expedientes</p>
          <p className="text-xl font-black text-slate-800 dark:text-slate-100 mt-0.5">{metrics.total_expedientes}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm text-center">
          <p className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 uppercase">Nuevos</p>
          <p className="text-xl font-black text-sky-600 dark:text-sky-400 mt-0.5">{metrics.nuevos_expedientes}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm text-center">
          <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase">Pend. Revisión</p>
          <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">{metrics.pendientes_revision}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm text-center">
          <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase">Pend. Cliente</p>
          <p className="text-xl font-black text-amber-600 dark:text-amber-400 mt-0.5">{metrics.pendientes_cliente}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm text-center">
          <p className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 uppercase">Pend. Agencia</p>
          <p className="text-xl font-black text-purple-600 dark:text-purple-400 mt-0.5">{metrics.pendientes_agencia}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm text-center">
          <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 uppercase">Docs Observados</p>
          <p className="text-xl font-black text-rose-600 dark:text-rose-400 mt-0.5">{metrics.documentos_observados}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm text-center">
          <p className="text-[11px] font-semibold text-red-600 dark:text-red-400 uppercase">Urgentes</p>
          <p className="text-xl font-black text-red-600 dark:text-red-400 mt-0.5">{metrics.procesos_urgentes}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm text-center">
          <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase">Completados</p>
          <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{metrics.procesos_completados}</p>
        </div>
      </div>

      {/* Sección Operacional: MI TRABAJO */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50/50 dark:bg-slate-800/40">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" />
              Bandeja: Mi Trabajo Hoy
            </h2>
            <p className="text-xs text-slate-500">Expedientes prioritarios y pendientes que requieren la intervención del operador.</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('atencion')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'atencion'
                  ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              🔴 Requieren Atención ({miTrabajo.requieren_atencion.length})
            </button>
            <button
              onClick={() => setActiveTab('revision')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'revision'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              🟠 Pendientes de Revisión ({miTrabajo.pendientes_revision.length})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-12 text-center text-slate-400">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
              Cargando bandeja de trabajo...
            </div>
          ) : (
            (() => {
              const currentList = activeTab === 'atencion' ? miTrabajo.requieren_atencion : miTrabajo.pendientes_revision;
              if (currentList.length === 0) {
                return (
                  <div className="p-12 text-center text-slate-400">
                    <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-500 opacity-60" />
                    <p className="font-semibold text-slate-700 dark:text-slate-300">¡Bandeja al día!</p>
                    <p className="text-xs text-slate-500">No hay expedientes pendientes en esta categoría actualmente.</p>
                  </div>
                );
              }

              return (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">Código Expediente</th>
                      <th className="py-3.5 px-4">Cliente / Solicitante</th>
                      <th className="py-3.5 px-4">Agencia Afiliada</th>
                      <th className="py-3.5 px-4">Trámite Migratorio</th>
                      <th className="py-3.5 px-4 text-center">Progreso</th>
                      <th className="py-3.5 px-4">Estado & Acción</th>
                      <th className="py-3.5 px-4 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    {currentList.map((dossier) => (
                      <tr key={dossier.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <Link
                            href={`/visas/expedientes/${dossier.id}`}
                            className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-xs hover:underline"
                          >
                            {dossier.code}
                          </Link>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap font-bold text-slate-900 dark:text-white">
                          {dossier.client?.name || 'Cliente'}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold">
                            {dossier.agency?.name || 'Agencia'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-800 dark:text-slate-200">
                          <span className="mr-1.5">{dossier.processType?.flag_icon || '🌐'}</span>
                          <span>{dossier.processType?.name || 'Trámite'}</span>
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="inline-flex flex-col items-center gap-1">
                            <div className="inline-flex items-center gap-2">
                              <div className="w-16 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                <div
                                  className="h-full bg-indigo-600 rounded-full"
                                  style={{ width: `${Math.min(100, Math.max(0, dossier.progress || 0))}%` }}
                                />
                              </div>
                              <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">
                                {dossier.progress}%
                              </span>
                            </div>
                            {(dossier.currentPhase || dossier.current_phase) && (
                              <span className="text-[10px] text-slate-400 font-medium truncate max-w-[140px]" title={(dossier.currentPhase || dossier.current_phase)?.name}>
                                Fase {(dossier.currentPhase || dossier.current_phase)?.order}: {(dossier.currentPhase || dossier.current_phase)?.name}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <span className="inline-block capitalize font-bold text-[11px] text-slate-700 dark:text-slate-300">
                              {dossier.status.replace('_', ' ')}
                            </span>
                            {dossier.action_required && (
                              <div className="flex items-center gap-1 text-[10px] text-rose-600 dark:text-rose-400 font-semibold bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded">
                                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate max-w-[200px]">{dossier.action_required}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <Link
                            href={`/visas/expedientes/${dossier.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Revisar 360°</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              );
            })()
          )}
        </div>
      </div>
    </div>
  );
};
