'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import visaWholesaleService, { VisaDossier } from '@/services/visaWholesaleService';
import { 
  Building2, ShieldCheck, Clock, AlertTriangle, AlertCircle, 
  CheckCircle2, RefreshCw, Eye, ArrowRight, Filter, Users, 
  FileText, ExternalLink, Calendar, Search, Sparkles,
  DollarSign, Check, X, FileCheck, ChevronLeft, ChevronRight
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
    pendientes_aprobacion_pago: 0,
  });

  const [miTrabajo, setMiTrabajo] = useState<{
    requieren_atencion: VisaDossier[];
    pendientes_revision: VisaDossier[];
    pendientes_aprobacion_pago: VisaDossier[];
  }>({
    requieren_atencion: [],
    pendientes_revision: [],
    pendientes_aprobacion_pago: [],
  });

  const [agencies, setAgencies] = useState<any[]>([]);
  const [selectedAgencyId, setSelectedAgencyId] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'todos' | 'pagos' | 'atencion' | 'revision'>('todos');
  const [isLoading, setIsLoading] = useState(true);

  // Estado para la pestaña "Todas las Operaciones"
  const [allDossiers, setAllDossiers] = useState<VisaDossier[]>([]);
  const [allPage, setAllPage] = useState(1);
  const [allTotalPages, setAllTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoadingAll, setIsLoadingAll] = useState(false);

  // Modal para rechazar comprobante con motivo
  const [rejectionModalDossier, setRejectionModalDossier] = useState<VisaDossier | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessingApproval, setIsProcessingApproval] = useState(false);

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
          pendientes_aprobacion_pago: dashData.mi_trabajo.pendientes_aprobacion_pago || [],
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

  const fetchAllDossiers = async () => {
    setIsLoadingAll(true);
    try {
      const res = await visaWholesaleService.getDossiers({
        page: allPage,
        per_page: 25,
        agency_id: selectedAgencyId !== 'all' ? Number(selectedAgencyId) : undefined,
        search: searchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      const data = res?.data?.data || res?.data || [];
      setAllDossiers(Array.isArray(data) ? data : []);
      setAllTotalPages(res?.data?.last_page || res?.last_page || 1);
    } catch (err) {
      console.error('Error al cargar operaciones:', err);
    } finally {
      setIsLoadingAll(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAllPage(1);
    fetchAllDossiers();
  };

  const handleApprovePayment = async (dossier: VisaDossier) => {
    if (!confirm(`¿Aprobar solicitud y comprobante del expediente ${dossier.code}? Esto habilitará de inmediato el enlace público para el cliente final.`)) {
      return;
    }

    setIsProcessingApproval(true);
    try {
      await visaWholesaleService.approveDossierPayment(dossier.id);
      toast.success(`¡Solicitud ${dossier.code} aprobada! Enlace público habilitado.`);
      fetchDashboard();
      if (activeTab === 'todos') {
        fetchAllDossiers();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al aprobar solicitud');
    } finally {
      setIsProcessingApproval(false);
    }
  };

  const handleOpenRejectModal = (dossier: VisaDossier) => {
    setRejectionModalDossier(dossier);
    setRejectionReason('');
  };

  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionModalDossier) return;
    if (!rejectionReason.trim()) {
      toast.error('Debe indicar el motivo del rechazo del comprobante');
      return;
    }

    setIsProcessingApproval(true);
    try {
      await visaWholesaleService.rejectDossierPayment(rejectionModalDossier.id, rejectionReason.trim());
      toast.success(`Comprobante rechazado para ${rejectionModalDossier.code}. La agencia ha sido notificada para actualizarlo.`);
      setRejectionModalDossier(null);
      fetchDashboard();
      if (activeTab === 'todos') {
        fetchAllDossiers();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al rechazar comprobante');
    } finally {
      setIsProcessingApproval(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [selectedAgencyId]);

  useEffect(() => {
    if (activeTab === 'todos') {
      fetchAllDossiers();
    }
  }, [selectedAgencyId, activeTab, allPage, statusFilter]);

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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
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

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm text-center border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/20">
          <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase flex items-center justify-center gap-1">
            <DollarSign className="w-3 h-3" /> Aprob. Pago
          </p>
          <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{metrics.pendientes_aprobacion_pago || 0}</p>
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
            <p className="text-xs text-slate-500">Expedientes prioritarios, revisión de pagos y tareas que requieren la intervención del operador.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('todos')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'todos'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Todas las Operaciones ({metrics.total_expedientes})</span>
            </button>
            <button
              onClick={() => setActiveTab('pagos')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'pagos'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Aprobación de Pagos B2B ({miTrabajo.pendientes_aprobacion_pago.length})</span>
            </button>
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
          ) : activeTab === 'pagos' ? (
            /* TAB: BANDEJA DE APROBACIÓN DE PAGOS B2B */
            miTrabajo.pendientes_aprobacion_pago.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-500 opacity-60" />
                <p className="font-semibold text-slate-700 dark:text-slate-300">¡Bandeja de pagos al día!</p>
                <p className="text-xs text-slate-500 mt-1">
                  No hay comprobantes bancarios pendientes de revisión. Las agencias exoneradas acceden directamente sin pasar por esta bandeja.
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Código Expediente</th>
                    <th className="py-3.5 px-4">Solicitante</th>
                    <th className="py-3.5 px-4">Agencia Afiliada</th>
                    <th className="py-3.5 px-4">Trámite & Costo</th>
                    <th className="py-3.5 px-4">Comprobante Subido</th>
                    <th className="py-3.5 px-4">Fecha de Envío</th>
                    <th className="py-3.5 px-4 text-right">Decisión del Operador</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {miTrabajo.pendientes_aprobacion_pago.map((dossier) => (
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
                        <div>{dossier.applicant_name || dossier.client?.name || 'Solicitante'}</div>
                        <div className="text-[11px] font-normal text-slate-400">{dossier.applicant_email || dossier.client?.email || '—'}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold">
                          {dossier.agency?.name || 'Agencia'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                          <span>{dossier.processType?.flag_icon || '🌐'}</span>
                          <span>{dossier.processType?.name || 'Trámite'}</span>
                        </div>
                        <div className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                          ${Number(dossier.cost || 150).toFixed(2)} USD
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {dossier.payment_receipt_url ? (
                          <a
                            href={dossier.payment_receipt_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900 border border-sky-200 dark:border-sky-800 text-xs font-semibold transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5 text-sky-600" />
                            <span>Ver Comprobante</span>
                            <ExternalLink className="w-3 h-3 opacity-60" />
                          </a>
                        ) : (
                          <span className="text-slate-400 italic">No disponible</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 text-[11px]">
                        {dossier.payment_receipt_uploaded_at
                          ? new Date(dossier.payment_receipt_uploaded_at).toLocaleString()
                          : new Date(dossier.updated_at).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                        <button
                          disabled={isProcessingApproval}
                          onClick={() => handleApprovePayment(dossier)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-xs disabled:opacity-50"
                          title="Aprobar solicitud y habilitar enlace público"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Aprobar Solicitud</span>
                        </button>
                        <button
                          disabled={isProcessingApproval}
                          onClick={() => handleOpenRejectModal(dossier)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-bold text-xs transition-all disabled:opacity-50"
                          title="Rechazar comprobante indicando motivo"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Rechazar</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : activeTab === 'todos' ? (
            /* TAB: TODAS LAS OPERACIONES MAYORISTAS */
            <div>
              {/* Barra de Búsqueda y Filtros de la pestaña */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1 max-w-md">
                  <div className="relative w-full">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar por código, cliente, agencia..."
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-slate-100"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold whitespace-nowrap transition-colors"
                  >
                    Buscar
                  </button>
                </form>

                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-500 font-medium whitespace-nowrap">Filtrar Estado:</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setAllPage(1);
                    }}
                    className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium dark:text-slate-100"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="pendiente_pago">Pendiente Pago / Comprobante</option>
                    <option value="pendiente_aprobacion">Pendiente Aprobación Operador</option>
                    <option value="comprobante_rechazado">Comprobante Rechazado</option>
                    <option value="aprobado">Aprobado / Activo</option>
                    <option value="en_revision">En Revisión Operador</option>
                    <option value="observado">Documentos Observados</option>
                    <option value="completado">Completados</option>
                  </select>
                </div>
              </div>

              {isLoadingAll ? (
                <div className="p-12 text-center text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
                  Cargando operaciones mayoristas...
                </div>
              ) : allDossiers.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <FileText className="w-10 h-10 mx-auto mb-2 text-slate-400 opacity-60" />
                  <p className="font-semibold text-slate-700 dark:text-slate-300">No se encontraron expedientes</p>
                  <p className="text-xs text-slate-500 mt-1">Ajuste los criterios de búsqueda o el filtro de agencia.</p>
                </div>
              ) : (
                <>
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="py-3.5 px-4">Código Expediente</th>
                        <th className="py-3.5 px-4">Cliente / Solicitante</th>
                        <th className="py-3.5 px-4">Agencia Afiliada</th>
                        <th className="py-3.5 px-4">Trámite & Costo</th>
                        <th className="py-3.5 px-4 text-center">Progreso</th>
                        <th className="py-3.5 px-4">Pago & Aprobación</th>
                        <th className="py-3.5 px-4 text-right">Acciones Operativas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                      {allDossiers.map((dossier) => (
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
                            <div>{dossier.applicant_name || dossier.client?.name || 'Solicitante'}</div>
                            <div className="text-[11px] font-normal text-slate-400">{dossier.applicant_email || dossier.client?.email || '—'}</div>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold">
                              {dossier.agency?.name || 'Agencia'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200">
                              <span>{dossier.processType?.flag_icon || '🌐'}</span>
                              <span>{dossier.processType?.name || 'Trámite'}</span>
                            </div>
                            <div className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                              ${Number(dossier.cost || 150).toFixed(2)} USD
                            </div>
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
                                  {dossier.progress || 0}%
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-medium capitalize">
                                {dossier.status.replace('_', ' ')}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {dossier.is_exempt ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                <Sparkles className="w-3 h-3" /> Exonerado
                              </span>
                            ) : dossier.approval_status === 'aprobado' ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
                                <CheckCircle2 className="w-3 h-3" /> Aprobado
                              </span>
                            ) : dossier.payment_status === 'comprobante_rechazado' || dossier.approval_status === 'rechazado' ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300" title={dossier.rejection_reason || 'Rechazado'}>
                                <AlertCircle className="w-3 h-3" /> Rechazado
                              </span>
                            ) : dossier.payment_receipt_url ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300">
                                <Clock className="w-3 h-3" /> Pend. Aprobación
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                <AlertTriangle className="w-3 h-3" /> Pend. Comprobante
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                            {dossier.payment_receipt_url && (
                              <a
                                href={dossier.payment_receipt_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/60 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 font-bold text-xs transition-colors"
                                title="Ver Comprobante de Pago Subido"
                              >
                                <FileText className="w-3.5 h-3.5 text-sky-600" />
                                <span>Comprobante</span>
                                <ExternalLink className="w-3 h-3 opacity-60" />
                              </a>
                            )}
                            {!dossier.is_exempt && dossier.approval_status !== 'aprobado' && (
                              <>
                                <button
                                  disabled={isProcessingApproval}
                                  onClick={() => handleApprovePayment(dossier)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-xs disabled:opacity-50"
                                  title="Aprobar Solicitud y Pago (Habilita Link Público)"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Aprobar</span>
                                </button>
                                <button
                                  disabled={isProcessingApproval}
                                  onClick={() => handleOpenRejectModal(dossier)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-bold text-xs transition-all disabled:opacity-50"
                                  title="Rechazar comprobante indicando motivo"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>Rechazar</span>
                                </button>
                              </>
                            )}
                            <Link
                              href={`/visas/expedientes/${dossier.id}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-xs"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>360°</span>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Paginación */}
                  <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20 text-xs">
                    <span className="text-slate-500">
                      Página <strong>{allPage}</strong> de <strong>{allTotalPages}</strong>
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        disabled={allPage <= 1 || isLoadingAll}
                        onClick={() => setAllPage((p) => Math.max(1, p - 1))}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Anterior</span>
                      </button>
                      <button
                        disabled={allPage >= allTotalPages || isLoadingAll}
                        onClick={() => setAllPage((p) => p + 1)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
                      >
                        <span>Siguiente</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
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
                      <th className="py-3.5 px-4 text-right">Acciones Operativas</th>
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
                          {dossier.client?.name || dossier.applicant_name || 'Cliente'}
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
                        <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                          {dossier.payment_receipt_url && (
                            <a
                              href={dossier.payment_receipt_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/60 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 font-bold text-xs transition-colors"
                              title="Ver Comprobante de Pago Subido"
                            >
                              <FileText className="w-3.5 h-3.5 text-sky-600" />
                              <span>Comprobante</span>
                              <ExternalLink className="w-3 h-3 opacity-60" />
                            </a>
                          )}
                          {!dossier.is_exempt && dossier.approval_status !== 'aprobado' && (
                            <>
                              <button
                                disabled={isProcessingApproval}
                                onClick={() => handleApprovePayment(dossier)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-xs disabled:opacity-50"
                                title="Aprobar Solicitud y Pago"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Aprobar</span>
                              </button>
                              <button
                                disabled={isProcessingApproval}
                                onClick={() => handleOpenRejectModal(dossier)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-bold text-xs transition-all disabled:opacity-50"
                                title="Rechazar comprobante"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Rechazar</span>
                              </button>
                            </>
                          )}
                          <Link
                            href={`/visas/expedientes/${dossier.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-xs"
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

      {/* Modal: Motivo de Rechazo de Comprobante */}
      {rejectionModalDossier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <span className="p-2.5 bg-rose-50 dark:bg-rose-950/60 rounded-xl">
                <AlertCircle className="w-6 h-6" />
              </span>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">Rechazar Comprobante de Pago</h3>
                <p className="text-xs text-slate-500 font-mono">{rejectionModalDossier.code} — {rejectionModalDossier.agency?.name || 'Agencia'}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              Indique detalladamente el motivo del rechazo (ej. monto incorrecto, comprobante ilegible, cuenta errónea). La agencia afiliada podrá corregir y subir un nuevo comprobante dentro del mismo expediente.
            </p>

            <form onSubmit={handleConfirmReject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Motivo de Rechazo *
                </label>
                <textarea
                  rows={3}
                  required
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Ej. El monto depositado no coincide con el costo del trámite migratorio..."
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectionModalDossier(null)}
                  className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isProcessingApproval}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold rounded-xl shadow-md shadow-rose-600/20 disabled:opacity-50"
                >
                  {isProcessingApproval ? 'Procesando...' : 'Confirmar Rechazo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
