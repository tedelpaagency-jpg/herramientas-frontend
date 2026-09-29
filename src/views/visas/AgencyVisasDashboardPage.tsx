'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import visaWholesaleService, { VisaDossier, VisaProcessType, VisaGroup } from '@/services/visaWholesaleService';
import clientService from '@/services/clientService';
import { useAuth } from '@/context/AuthContext';
import { 
  ShieldCheck, Plus, Search, Filter, RefreshCw, FileText, 
  ExternalLink, Copy, Check, AlertCircle, Clock, CheckCircle2, 
  AlertTriangle, Users, FolderPlus, Download, Trash2, Eye,
  ArrowRight, Sparkles, Send, FileSpreadsheet, Building2, Info
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AgencyVisasDashboardPage: React.FC = () => {
  const router = useRouter();
  const { user, hasPermission } = useAuth();

  const [dossiers, setDossiers] = useState<VisaDossier[]>([]);
  const [metrics, setMetrics] = useState<any>({
    total: 0,
    en_proceso: 0,
    pendientes_cliente: 0,
    pendientes_revision: 0,
    con_observaciones: 0,
    completados: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [processTypes, setProcessTypes] = useState<VisaProcessType[]>([]);
  const [groups, setGroups] = useState<VisaGroup[]>([]);
  const [clients, setClients] = useState<any[]>([]);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [processFilter, setProcessFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newDossierData, setNewDossierData] = useState({
    client_id: '',
    client_name: '',
    client_email: '',
    client_phone: '',
    client_document_number: '',
    group_id: '',
    visa_process_type_id: '',
    priority: 'pendiente',
    deadline: '',
    notes: '',
  });
  const [createNewClient, setCreateNewClient] = useState(false);

  // Deletion Request Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [targetDossier, setTargetDossier] = useState<VisaDossier | null>(null);
  const [deleteReason, setDeleteReason] = useState('');

  // Link Modal
  const [linkModalData, setLinkModalData] = useState<{ isOpen: boolean; link: string; code: string }>({
    isOpen: false,
    link: '',
    code: '',
  });
  const [copied, setCopied] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [dashRes, dossiersRes, processes, groupsRes, clientsRes] = await Promise.all([
        visaWholesaleService.getAgencyDashboard().catch(() => null),
        visaWholesaleService.getDossiers({
          page,
          search: search || undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          priority: priorityFilter !== 'all' ? priorityFilter : undefined,
          visa_process_type_id: processFilter !== 'all' ? processFilter : undefined,
        }).catch(() => null),
        visaWholesaleService.getProcessTypes().catch(() => []),
        visaWholesaleService.getGroups().catch(() => ({ data: [] })),
        clientService.getClients({ per_page: 100 }).catch(() => ({ data: [] })),
      ]);

      if (dashRes?.metrics) {
        setMetrics(dashRes.metrics);
      }
      if (dossiersRes?.data) {
        setDossiers(dossiersRes.data.data || []);
        setTotalPages(dossiersRes.data.last_page || 1);
      }
      setProcessTypes(processes || []);
      setGroups(groupsRes?.data?.data || groupsRes?.data || []);
      setClients(Array.isArray(clientsRes?.data) ? clientsRes.data : []);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      toast.error('Error al cargar la información del panel');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, statusFilter, priorityFilter, processFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };

  const handleCreateDossier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDossierData.visa_process_type_id) {
      toast.error('Seleccione el tipo de trámite migratorio');
      return;
    }
    if (!createNewClient && !newDossierData.client_id) {
      toast.error('Seleccione un cliente o marque crear uno nuevo');
      return;
    }
    if (createNewClient && (!newDossierData.client_name || !newDossierData.client_email)) {
      toast.error('Nombre y correo del cliente son requeridos');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        visa_process_type_id: Number(newDossierData.visa_process_type_id),
        priority: newDossierData.priority,
        deadline: newDossierData.deadline || undefined,
        notes: newDossierData.notes || undefined,
      };

      if (newDossierData.group_id) {
        payload.group_id = Number(newDossierData.group_id);
      }

      if (createNewClient) {
        payload.client_name = newDossierData.client_name;
        payload.client_email = newDossierData.client_email;
        payload.client_phone = newDossierData.client_phone;
        payload.client_document_number = newDossierData.client_document_number;
      } else {
        payload.client_id = Number(newDossierData.client_id);
      }

      const res = await visaWholesaleService.createDossier(payload);
      toast.success('¡Expediente creado correctamente con link generado!');
      setIsCreateModalOpen(false);
      setNewDossierData({
        client_id: '',
        client_name: '',
        client_email: '',
        client_phone: '',
        client_document_number: '',
        group_id: '',
        visa_process_type_id: '',
        priority: 'pendiente',
        deadline: '',
        notes: '',
      });

      // Show link modal directly
      const created = res.data;
      if (created?.access_token) {
        const publicUrl = `${window.location.origin}/visas/portal/${created.access_token}`;
        setLinkModalData({
          isOpen: true,
          link: publicUrl,
          code: created.code,
        });
      }

      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al crear expediente');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenLinkModal = async (dossier: VisaDossier) => {
    try {
      const res = await visaWholesaleService.getClientLink(dossier.id);
      const publicUrl = res?.public_link || `${window.location.origin}/visas/portal/${dossier.access_token}`;
      setLinkModalData({
        isOpen: true,
        link: publicUrl,
        code: dossier.code,
      });
      setCopied(false);
    } catch (err) {
      toast.error('Error al generar enlace seguro');
    }
  };

  const handleCopyLink = () => {
    if (linkModalData.link) {
      navigator.clipboard.writeText(linkModalData.link);
      setCopied(true);
      toast.success('¡Enlace único copiado al portapapeles!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadPdf = async (dossier: VisaDossier) => {
    toast.loading('Generando expediente en PDF...', { id: 'pdf-toast' });
    try {
      await visaWholesaleService.downloadDossierPdf(dossier.id, dossier.code);
      toast.success('Expediente descargado correctamente', { id: 'pdf-toast' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'No tiene permisos para descargar el expediente en PDF.', { id: 'pdf-toast' });
    }
  };

  const handleDeleteOrRequest = async (dossier: VisaDossier) => {
    setTargetDossier(dossier);
    setDeleteReason('');
    setIsDeleteModalOpen(true);
  };

  const submitDeleteAction = async () => {
    if (!targetDossier) return;
    setIsSubmitting(true);
    try {
      const res = await visaWholesaleService.deleteDossier(targetDossier.id);
      toast.success(res.message || 'Expediente eliminado correctamente');
      setIsDeleteModalOpen(false);
      fetchData();
    } catch (err: any) {
      if (err.response?.status === 403 && err.response?.data?.status === 'requires_request') {
        // Enviar solicitud
        if (!deleteReason.trim()) {
          toast.error('Debe ingresar el motivo de la solicitud de eliminación');
          setIsSubmitting(false);
          return;
        }
        await visaWholesaleService.requestDeleteDossier(targetDossier.id, deleteReason);
        toast.success('Solicitud de eliminación enviada al Administrador para aprobación.');
        setIsDeleteModalOpen(false);
        fetchData();
      } else {
        toast.error(err.response?.data?.message || 'Error al procesar eliminación');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-900 p-6 rounded-2xl text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-white/10 backdrop-blur-md rounded-lg">
              <ShieldCheck className="w-6 h-6 text-sky-300" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight">Mayorista de Visas & Migración</h1>
          </div>
          <p className="text-sky-200 text-sm max-w-2xl">
            Control integral de expedientes migratorios B2B2C. Gestión con mayorista, cliente final y trazabilidad en tiempo real.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Link
            href="/visas/grupos"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-all border border-white/10 backdrop-blur-md shadow-sm"
          >
            <Users className="w-4 h-4" />
            Grupos / Familias
          </Link>
          <Link
            href="/visas/politicas"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-all border border-white/10 backdrop-blur-md shadow-sm"
          >
            <FileText className="w-4 h-4" />
            Políticas de Agencia
          </Link>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm transition-all shadow-md shadow-sky-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Nuevo Expediente
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Procesos</p>
          <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">{metrics.total}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider">En Proceso</p>
          <p className="text-2xl font-black text-sky-600 dark:text-sky-400 mt-1">{metrics.en_proceso}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Pendiente Cliente</p>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{metrics.pendientes_cliente}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">En Revisión</p>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{metrics.pendientes_revision}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Con Observación</p>
          <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">{metrics.con_observaciones}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Completados</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{metrics.completados}</p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por código (EXP-000...), cliente o pasaporte..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none dark:text-slate-100"
            />
          </form>

          <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-3 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500 dark:text-slate-100"
            >
              <option value="all">Todos los Estados</option>
              <option value="link_enviado">Link Enviado</option>
              <option value="informacion_recibida">Información Recibida</option>
              <option value="en_revision">En Revisión</option>
              <option value="correccion_solicitada">Corrección Solicitada</option>
              <option value="en_gestion">En Gestión</option>
              <option value="revision_final">Revisión Final</option>
              <option value="completado">Completado</option>
              <option value="cerrado">Cerrado</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }}
              className="px-3 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500 dark:text-slate-100"
            >
              <option value="all">Todas las Prioridades</option>
              <option value="urgente">🔴 Urgente</option>
              <option value="requiere_atencion">🟠 Requiere Atención</option>
              <option value="pendiente">🟡 Pendiente</option>
              <option value="completado">🟢 Completado</option>
            </select>

            {/* Process Type Filter */}
            <select
              value={processFilter}
              onChange={(e) => { setProcessFilter(e.target.value); setPage(1); }}
              className="px-3 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500 dark:text-slate-100"
            >
              <option value="all">Todos los Procesos</option>
              {processTypes.map((pt) => (
                <option key={pt.id} value={pt.id}>
                  {pt.flag_icon} {pt.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('all');
                setPriorityFilter('all');
                setProcessFilter('all');
                setPage(1);
                fetchData();
              }}
              className="p-2.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl transition-all"
              title="Restablecer filtros"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Expedientes Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Expediente</th>
                <th className="py-3.5 px-4">Cliente / Solicitante</th>
                <th className="py-3.5 px-4">Trámite Migratorio</th>
                <th className="py-3.5 px-4">Grupo</th>
                <th className="py-3.5 px-4">Progreso / Etapa</th>
                <th className="py-3.5 px-4">Estado & Acción</th>
                <th className="py-3.5 px-4">Responsable</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-sky-500" />
                    Cargando expedientes...
                  </td>
                </tr>
              ) : dossiers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <ShieldCheck className="w-12 h-12 mx-auto mb-3 opacity-30 text-sky-500" />
                    <p className="font-semibold text-slate-700 dark:text-slate-300">No se encontraron expedientes</p>
                    <p className="text-xs text-slate-500 mt-1">Cree un nuevo proceso migratorio para generar un link de cliente.</p>
                  </td>
                </tr>
              ) : (
                dossiers.map((dossier) => {
                  const priorityColors = {
                    urgente: 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-900',
                    requiere_atencion: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-900',
                    pendiente: 'bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300 border-sky-200 dark:border-sky-900',
                    completado: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
                  };

                  return (
                    <tr key={dossier.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-sky-600 dark:text-sky-400">
                        <Link href={`/visas/expedientes/${dossier.id}`} className="hover:underline flex items-center gap-1.5">
                          {dossier.code}
                        </Link>
                        <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-sans font-medium border mt-1 ${priorityColors[dossier.priority] || priorityColors.pendiente}`}>
                          {dossier.priority.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-900 dark:text-slate-100">{dossier.client?.name || 'Sin nombre'}</div>
                        <div className="text-xs text-slate-500">{dossier.client?.email || dossier.client?.phone || 'Sin contacto'}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                          <span>{dossier.processType?.flag_icon || '🌐'}</span>
                          <span className="truncate max-w-[180px]">{dossier.processType?.name || 'Trámite'}</span>
                        </div>
                        <div className="text-xs text-slate-500">{dossier.processType?.country}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        {dossier.group ? (
                          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 font-medium">
                            <Users className="w-3 h-3" />
                            {dossier.group.name}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">Individual</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 min-w-[140px]">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="font-bold text-slate-700 dark:text-slate-300">{dossier.progress}%</span>
                          <span className="text-slate-400 truncate max-w-[90px]">{dossier.current_stage_key.replace('_', ' ')}</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              dossier.progress >= 90 ? 'bg-emerald-500' : dossier.progress >= 50 ? 'bg-sky-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${dossier.progress}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 capitalize">
                          {dossier.status.replace('_', ' ')}
                        </span>
                        {dossier.action_required && (
                          <div className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 font-medium mt-1">
                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate max-w-[140px]">{dossier.action_required}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-xs">
                        <span className="font-medium text-slate-700 dark:text-slate-300 capitalize block">
                          Rol: {dossier.current_responsible}
                        </span>
                        <span className="text-slate-400 text-[11px]">
                          {dossier.assignedUser?.name || 'Asignado'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/visas/expedientes/${dossier.id}`}
                            className="p-1.5 text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/50 rounded-lg transition-colors"
                            title="Ver Expediente 360°"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => handleOpenLinkModal(dossier)}
                            className="p-1.5 text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-lg transition-colors"
                            title="Obtener Enlace de Cliente"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDownloadPdf(dossier)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors"
                            title="Descargar Expediente PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteOrRequest(dossier)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                            title="Eliminar o Solicitar Eliminación"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
            <span>Página {page} de {totalPages}</span>
            <div className="flex gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40"
              >
                Anterior
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Crear Expediente */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden my-8">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">Nuevo Expediente Migratorio</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDossier} className="p-6 space-y-4">
              {/* Selección de Tipo de Proceso */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Tipo de Visa / Trámite Migratorio *
                </label>
                <select
                  required
                  value={newDossierData.visa_process_type_id}
                  onChange={(e) => setNewDossierData({ ...newDossierData, visa_process_type_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500 dark:text-slate-100"
                >
                  <option value="">Seleccione un proceso...</option>
                  {processTypes.map((pt) => (
                    <option key={pt.id} value={pt.id}>
                      {pt.flag_icon} {pt.name} — ({pt.country})
                    </option>
                  ))}
                </select>
              </div>

              {/* Grupo (Opcional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Grupo de Solicitantes (Familia / Corporativo)
                </label>
                <select
                  value={newDossierData.group_id}
                  onChange={(e) => setNewDossierData({ ...newDossierData, group_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500 dark:text-slate-100"
                >
                  <option value="">Ninguno (Solicitud individual)</option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Toggle Cliente Existente vs Nuevo */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Cliente Solicitante
                  </span>
                  <button
                    type="button"
                    onClick={() => setCreateNewClient(!createNewClient)}
                    className="text-xs font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400"
                  >
                    {createNewClient ? '← Seleccionar cliente existente' : '+ Crear nuevo cliente rápido'}
                  </button>
                </div>

                {!createNewClient ? (
                  <select
                    value={newDossierData.client_id}
                    onChange={(e) => setNewDossierData({ ...newDossierData, client_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500 dark:text-slate-100"
                  >
                    <option value="">Seleccione un cliente registrado...</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.document_number ? `(${c.document_number})` : ''} - {c.email}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Nombre Completo *</label>
                      <input
                        type="text"
                        required
                        value={newDossierData.client_name}
                        onChange={(e) => setNewDossierData({ ...newDossierData, client_name: e.target.value })}
                        placeholder="Juan Pérez"
                        className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Correo Electrónico *</label>
                      <input
                        type="email"
                        required
                        value={newDossierData.client_email}
                        onChange={(e) => setNewDossierData({ ...newDossierData, client_email: e.target.value })}
                        placeholder="juan@ejemplo.com"
                        className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Teléfono / WhatsApp</label>
                      <input
                        type="tel"
                        value={newDossierData.client_phone}
                        onChange={(e) => setNewDossierData({ ...newDossierData, client_phone: e.target.value })}
                        placeholder="+593 99 999 9999"
                        className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">Cédula / Identificación</label>
                      <input
                        type="text"
                        value={newDossierData.client_document_number}
                        onChange={(e) => setNewDossierData({ ...newDossierData, client_document_number: e.target.value })}
                        placeholder="1720000000"
                        className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-slate-100"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Prioridad y Fecha Límite */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Prioridad
                  </label>
                  <select
                    value={newDossierData.priority}
                    onChange={(e) => setNewDossierData({ ...newDossierData, priority: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500 dark:text-slate-100"
                  >
                    <option value="pendiente">🟡 Pendiente (Normal)</option>
                    <option value="requiere_atencion">🟠 Requiere Atención</option>
                    <option value="urgente">🔴 Urgente</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Fecha Límite Estimada
                  </label>
                  <input
                    type="date"
                    value={newDossierData.deadline}
                    onChange={(e) => setNewDossierData({ ...newDossierData, deadline: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Notas Iniciales */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Notas Internas
                </label>
                <textarea
                  rows={2}
                  value={newDossierData.notes}
                  onChange={(e) => setNewDossierData({ ...newDossierData, notes: e.target.value })}
                  placeholder="Información relevante del viaje o cliente..."
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500 dark:text-slate-100"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 dark:text-slate-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm transition-all shadow-md shadow-sky-600/20 disabled:opacity-50"
                >
                  {isSubmitting ? 'Creando expediente...' : 'Generar Expediente y Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Enlace Único de Cliente */}
      {linkModalData.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
              <span className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl">
                <CheckCircle2 className="w-6 h-6" />
              </span>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">Enlace Único del Cliente</h3>
                <p className="text-xs text-slate-500 font-mono">Expediente {linkModalData.code}</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400">
              Envíe este enlace seguro al cliente para que ingrese, acepte las políticas de privacidad, complete su formulario y adjunte sus documentos sin necesidad de iniciar sesión.
            </p>

            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <input
                type="text"
                readOnly
                value={linkModalData.link}
                className="w-full bg-transparent text-xs font-mono text-slate-700 dark:text-slate-300 focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg transition-all flex-shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copiado' : 'Copiar'}
              </button>
            </div>

            <div className="flex justify-between items-center pt-2">
              <a
                href={linkModalData.link}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Probar enlace en nueva pestaña
              </a>

              <button
                onClick={() => setLinkModalData({ isOpen: false, link: '', code: '' })}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-xl"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Solicitar Eliminación */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <span className="p-2.5 bg-rose-50 dark:bg-rose-950/60 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </span>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">Eliminación de Expediente</h3>
                <p className="text-xs text-slate-500 font-mono">{targetDossier?.code}</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400">
              Dependiendo de los permisos de su rol, el expediente podrá eliminarse directamente o requerirá enviar una solicitud formal de eliminación para aprobación del administrador de la Marca Blanca.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Motivo de la eliminación *
              </label>
              <textarea
                rows={3}
                required
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="Indique detalladamente la razón de la solicitud..."
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 dark:text-slate-100"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 font-medium"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={submitDeleteAction}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold rounded-xl shadow-md shadow-rose-600/20 disabled:opacity-50"
              >
                {isSubmitting ? 'Procesando...' : 'Confirmar Eliminación'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
