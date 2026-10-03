'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import visaWholesaleService, { VisaDossier, VisaGroup, formatPublicDossierLink } from '@/services/visaWholesaleService';
import { useAuth } from '@/context/AuthContext';
import { 
  Building2, Users, Search, RefreshCw, Eye, ArrowRight, ArrowLeft,
  ShieldCheck, FileText, CheckCircle2, Clock, Phone, Mail, MapPin, ExternalLink,
  UserCheck, AlertCircle, ChevronLeft, ChevronRight, Check, UserPlus, Filter,
  FolderKanban, LayoutDashboard, Globe, AlertTriangle, User, Copy, CheckCheck, 
  Sparkles, X
} from 'lucide-react';
import toast from 'react-hot-toast';

export const MayoristaAgenciesPage: React.FC = () => {
  const { user } = useAuth();
  const [agencies, setAgencies] = useState<any[]>([]);
  const [operators, setOperators] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [operatorFilter, setOperatorFilter] = useState<'all' | 'assigned' | 'unassigned'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [updatingAgencyId, setUpdatingAgencyId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAgenciesCount, setTotalAgenciesCount] = useState(0);

  // Agency Detail Context Modal
  const [selectedAgency, setSelectedAgency] = useState<any | null>(null);

  // ================= AGENCY DASHBOARD STATE =================
  const [selectedAgencyForDashboard, setSelectedAgencyForDashboard] = useState<any | null>(null);
  const [agencyDashboardTab, setAgencyDashboardTab] = useState<'dossiers' | 'groups'>('dossiers');

  // Dossiers Tab State
  const [agencyDossiers, setAgencyDossiers] = useState<VisaDossier[]>([]);
  const [dossiersLoading, setDossiersLoading] = useState(false);
  const [dossiersSearch, setDossiersSearch] = useState('');
  const [dossiersStatusFilter, setDossiersStatusFilter] = useState('all');
  const [dossiersPriorityFilter, setDossiersPriorityFilter] = useState('all');
  const [dossiersGroupFilter, setDossiersGroupFilter] = useState('all');
  const [dossiersPage, setDossiersPage] = useState(1);
  const [dossiersTotalPages, setDossiersTotalPages] = useState(1);
  const [dossiersTotalCount, setDossiersTotalCount] = useState(0);

  // Groups Tab State
  const [agencyGroups, setAgencyGroups] = useState<VisaGroup[]>([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [groupsSearch, setGroupsSearch] = useState('');
  const [groupsTypeFilter, setGroupsTypeFilter] = useState('all');
  const [groupsPage, setGroupsPage] = useState(1);
  const [groupsTotalPages, setGroupsTotalPages] = useState(1);
  const [groupsTotalCount, setGroupsTotalCount] = useState(0);

  // All groups of agency (for dropdown filter in dossiers)
  const [allAgencyGroups, setAllAgencyGroups] = useState<VisaGroup[]>([]);
  const [copiedTokenDossierId, setCopiedTokenDossierId] = useState<number | null>(null);

  const isWhiteLabelAdmin = user?.role === 'super_admin' || 
    user?.role === 'white_label_admin' || 
    user?.roles?.some((r: any) => ['super_admin', 'white_label_admin'].includes(r.name));

  const updateUrlAgencyParam = (agencyId?: number | null) => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (agencyId) {
      url.searchParams.set('agency_id', String(agencyId));
    } else {
      url.searchParams.delete('agency_id');
    }
    window.history.replaceState({}, '', url.toString());
  };

  const fetchAgencies = async () => {
    setIsLoading(true);
    try {
      const res = await visaWholesaleService.getMayoristaAgencies({
        page,
        search: search || undefined,
      });
      if (res?.data) {
        setAgencies(res.data || []);
        setTotalPages(res.last_page || 1);
        setTotalAgenciesCount(res.total || res.data.length || 0);
      }
    } catch (err) {
      console.error('Error al cargar agencias:', err);
      toast.error('Error al cargar agencias');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOperators = async () => {
    try {
      const list = await visaWholesaleService.getMayoristaOperators();
      setOperators(list || []);
    } catch (err) {
      console.error('Error al cargar operadores:', err);
    }
  };

  useEffect(() => {
    fetchAgencies();
    fetchOperators();
  }, [page]);

  // Handle URL query parameter ?agency_id=... on initial mount or when agencies load
  useEffect(() => {
    if (typeof window !== 'undefined' && agencies.length > 0 && !selectedAgencyForDashboard) {
      const params = new URLSearchParams(window.location.search);
      const paramAgencyId = params.get('agency_id');
      if (paramAgencyId) {
        const found = agencies.find((a) => a.id === Number(paramAgencyId));
        if (found) {
          handleSelectAgencyForDashboard(found);
        }
      }
    }
  }, [agencies]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchAgencies();
  };

  const handleAssignOperator = async (agencyId: number, operatorId: number | null) => {
    setUpdatingAgencyId(agencyId);
    try {
      const res = await visaWholesaleService.assignAgencyOperator(agencyId, operatorId);
      toast.success(res?.message || 'Operador asignado correctamente');
      
      const matchedOp = operators.find((op) => op.id === operatorId) || null;
      setAgencies((prev) =>
        prev.map((a) => {
          if (a.id === agencyId) {
            return {
              ...a,
              assigned_operator_id: operatorId,
              assigned_operator: matchedOp,
              assignedOperator: matchedOp,
            };
          }
          return a;
        })
      );

      if (selectedAgency && selectedAgency.id === agencyId) {
        setSelectedAgency((prev: any) => ({
          ...prev,
          assigned_operator_id: operatorId,
          assigned_operator: matchedOp,
          assignedOperator: matchedOp,
        }));
      }

      if (selectedAgencyForDashboard && selectedAgencyForDashboard.id === agencyId) {
        setSelectedAgencyForDashboard((prev: any) => ({
          ...prev,
          assigned_operator_id: operatorId,
          assigned_operator: matchedOp,
          assignedOperator: matchedOp,
        }));
      }
    } catch (err: any) {
      console.error('Error al asignar operador:', err);
      toast.error(err.response?.data?.message || 'Error al asignar operador');
    } finally {
      setUpdatingAgencyId(null);
    }
  };

  // ================= DOSSIERS & GROUPS FETCHERS FOR SELECTED AGENCY =================

  const fetchAgencyDossiers = async (agencyId: number, targetPage = dossiersPage) => {
    setDossiersLoading(true);
    try {
      const res = await visaWholesaleService.getDossiers({
        agency_id: agencyId,
        page: targetPage,
        per_page: 15,
        search: dossiersSearch || undefined,
        status: dossiersStatusFilter !== 'all' ? dossiersStatusFilter : undefined,
        priority: dossiersPriorityFilter !== 'all' ? dossiersPriorityFilter : undefined,
        group_id: dossiersGroupFilter !== 'all' ? dossiersGroupFilter : undefined,
      });

      const list = res?.data?.data || res?.data || [];
      setAgencyDossiers(Array.isArray(list) ? list : []);
      setDossiersTotalPages(res?.data?.last_page || res?.last_page || 1);
      setDossiersTotalCount(res?.data?.total ?? res?.total ?? (Array.isArray(list) ? list.length : 0));
    } catch (err) {
      console.error('Error al cargar expedientes de la agencia:', err);
      toast.error('Error al cargar expedientes de la agencia');
    } finally {
      setDossiersLoading(false);
    }
  };

  const fetchAgencyGroups = async (agencyId: number, targetPage = groupsPage) => {
    setGroupsLoading(true);
    try {
      const res = await visaWholesaleService.getGroups({
        agency_id: agencyId,
        page: targetPage,
        per_page: 15,
        search: groupsSearch || undefined,
        group_type: groupsTypeFilter !== 'all' ? groupsTypeFilter : undefined,
      });

      const raw = res?.data?.data || res?.data || [];
      const list = Array.isArray(raw) ? raw : [];
      setAgencyGroups(list);
      setGroupsTotalPages(res?.data?.last_page || res?.last_page || 1);
      setGroupsTotalCount(res?.data?.total ?? res?.total ?? list.length);
    } catch (err) {
      console.error('Error al cargar grupos de la agencia:', err);
      toast.error('Error al cargar grupos de la agencia');
    } finally {
      setGroupsLoading(false);
    }
  };

  const fetchAllAgencyGroups = async (agencyId: number) => {
    try {
      const res = await visaWholesaleService.getGroups({
        agency_id: agencyId,
        per_page: 100,
      });
      const raw = res?.data?.data || res?.data || [];
      setAllAgencyGroups(Array.isArray(raw) ? raw : []);
    } catch (err) {
      console.error('Error al obtener lista de grupos:', err);
    }
  };

  const handleSelectAgencyForDashboard = (agency: any) => {
    setSelectedAgencyForDashboard(agency);
    setAgencyDashboardTab('dossiers');
    setDossiersSearch('');
    setDossiersStatusFilter('all');
    setDossiersPriorityFilter('all');
    setDossiersGroupFilter('all');
    setDossiersPage(1);

    setGroupsSearch('');
    setGroupsTypeFilter('all');
    setGroupsPage(1);

    updateUrlAgencyParam(agency.id);
    fetchAgencyDossiers(agency.id, 1);
    fetchAgencyGroups(agency.id, 1);
    fetchAllAgencyGroups(agency.id);
  };

  const handleBackToAgenciesList = () => {
    setSelectedAgencyForDashboard(null);
    updateUrlAgencyParam(null);
  };

  // Trigger dossier search / filter changes
  useEffect(() => {
    if (selectedAgencyForDashboard) {
      fetchAgencyDossiers(selectedAgencyForDashboard.id, dossiersPage);
    }
  }, [dossiersPage, dossiersStatusFilter, dossiersPriorityFilter, dossiersGroupFilter]);

  // Trigger group search / filter changes
  useEffect(() => {
    if (selectedAgencyForDashboard) {
      fetchAgencyGroups(selectedAgencyForDashboard.id, groupsPage);
    }
  }, [groupsPage, groupsTypeFilter]);

  const handleDossiersSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDossiersPage(1);
    if (selectedAgencyForDashboard) {
      fetchAgencyDossiers(selectedAgencyForDashboard.id, 1);
    }
  };

  const handleGroupsSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGroupsPage(1);
    if (selectedAgencyForDashboard) {
      fetchAgencyGroups(selectedAgencyForDashboard.id, 1);
    }
  };

  const handleCopyClientLink = (dossier: VisaDossier) => {
    const url = formatPublicDossierLink(dossier.access_token);
    navigator.clipboard.writeText(url);
    setCopiedTokenDossierId(dossier.id);
    toast.success('Enlace del portal de cliente copiado');
    setTimeout(() => setCopiedTokenDossierId(null), 2500);
  };

  // Helper formatting badges
  const getDossierStatusBadge = (status: string) => {
    switch (status) {
      case 'en_gestion':
      case 'en_proceso':
        return { label: 'En Gestión', bg: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800' };
      case 'en_revision':
        return { label: 'En Revisión', bg: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800' };
      case 'informacion_pendiente':
        return { label: 'Info. Pendiente', bg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800' };
      case 'informacion_recibida':
        return { label: 'Info. Recibida', bg: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' };
      case 'correccion_solicitada':
        return { label: 'Corrección Requerida', bg: 'bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200 dark:border-orange-800' };
      case 'completado':
        return { label: 'Completado', bg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' };
      case 'cancelado':
      case 'cerrado':
        return { label: 'Cerrado', bg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700' };
      default:
        return { label: (status || 'Pendiente').replace(/_/g, ' '), bg: 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700' };
    }
  };

  const getResponsibleBadge = (resp?: string) => {
    switch (resp) {
      case 'cliente':
        return { label: 'Cliente', bg: 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800' };
      case 'agencia':
        return { label: 'Agencia', bg: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' };
      case 'mayorista':
        return { label: 'Operador Mayorista', bg: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800' };
      default:
        return { label: resp || 'General', bg: 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700' };
    }
  };

  const getGroupTypeBadge = (type?: string) => {
    switch (type) {
      case 'familia':
        return { label: 'Familia', color: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800' };
      case 'pareja':
        return { label: 'Pareja', color: 'text-pink-700 bg-pink-50 border-pink-200 dark:bg-pink-950/50 dark:text-pink-300 dark:border-pink-800' };
      case 'corporativo':
        return { label: 'Corporativo', color: 'text-indigo-700 bg-indigo-50 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800' };
      case 'viaje':
        return { label: 'Grupo de Viaje', color: 'text-sky-700 bg-sky-50 border-sky-200 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800' };
      default:
        return { label: type || 'Grupo', color: 'text-slate-700 bg-slate-50 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' };
    }
  };

  // Filter local agencies if operatorFilter is applied
  const filteredAgencies = agencies.filter((agency) => {
    const hasOp = !!(agency.assigned_operator_id || agency.assigned_operator || agency.assignedOperator);
    if (operatorFilter === 'assigned') return hasOp;
    if (operatorFilter === 'unassigned') return !hasOp;
    return true;
  });

  // Calculate high level metrics
  const assignedCount = agencies.filter((a) => !!(a.assigned_operator_id || a.assigned_operator || a.assignedOperator)).length;
  const unassignedCount = agencies.length - assignedCount;
  const activosProcesosSum = agencies.reduce((acc, a) => acc + (Number(a.procesos_activos) || 0), 0);

  // =========================================================================
  // VIEW 1: DEDICATED AGENCY DASHBOARD (GROUPS & EXPEDIENTES TABLE FORMAT)
  // =========================================================================
  if (selectedAgencyForDashboard) {
    const currentOp = selectedAgencyForDashboard.assigned_operator || selectedAgencyForDashboard.assignedOperator ||
      operators.find(op => op.id === selectedAgencyForDashboard.assigned_operator_id);
    const isUpdatingOp = updatingAgencyId === selectedAgencyForDashboard.id;

    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
        {/* Back and Agency Context Header */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs space-y-5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBackToAgenciesList}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold"
                title="Volver al Directorio de Agencias"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Directorio de Agencias</span>
              </button>

              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-600 text-white font-extrabold flex items-center justify-center text-lg shadow-xs shrink-0">
                {selectedAgencyForDashboard.name ? selectedAgencyForDashboard.name.charAt(0).toUpperCase() : 'A'}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                    {selectedAgencyForDashboard.name}
                  </h1>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      selectedAgencyForDashboard.status == 1
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                    }`}
                  >
                    {selectedAgencyForDashboard.status == 1 ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {selectedAgencyForDashboard.business_name || 'Agencia de Viajes Afiliada'}
                  {selectedAgencyForDashboard.ruc && <span className="ml-2 font-mono text-slate-400">• RUC: {selectedAgencyForDashboard.ruc}</span>}
                  {selectedAgencyForDashboard.city && <span className="ml-2">• {selectedAgencyForDashboard.city}, {selectedAgencyForDashboard.country || 'Ecuador'}</span>}
                </p>
              </div>
            </div>

            {/* Quick Switcher & Actions */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
              {/* Quick Agency Switcher */}
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                <Building2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span className="text-slate-400 font-medium hidden sm:inline">Cambiar agencia:</span>
                <select
                  value={selectedAgencyForDashboard.id}
                  onChange={(e) => {
                    const matched = agencies.find(a => a.id === Number(e.target.value));
                    if (matched) handleSelectAgencyForDashboard(matched);
                  }}
                  className="bg-transparent font-bold text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer"
                >
                  {agencies.map(a => (
                    <option key={a.id} value={a.id} className="dark:bg-slate-900 text-slate-900 dark:text-white">
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  fetchAgencyDossiers(selectedAgencyForDashboard.id, dossiersPage);
                  fetchAgencyGroups(selectedAgencyForDashboard.id, groupsPage);
                }}
                disabled={dossiersLoading || groupsLoading}
                className="inline-flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-all"
                title="Actualizar datos de esta agencia"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${dossiersLoading || groupsLoading ? 'animate-spin text-indigo-500' : ''}`} />
                <span className="hidden sm:inline">Actualizar</span>
              </button>
            </div>
          </div>

          {/* Operator Management Banner for this Agency */}
          <div className="p-3.5 bg-slate-50/70 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-300 rounded-lg">
                <UserCheck className="w-4 h-4" />
              </span>
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Operador Mayorista Asignado:
                </span>
                <span className="text-[11px] text-slate-500">
                  {currentOp ? `${currentOp.name} (${currentOp.email})` : 'Esta agencia no tiene un operador asignado'}
                </span>
              </div>
            </div>

            {isWhiteLabelAdmin && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={selectedAgencyForDashboard.assigned_operator_id || ''}
                  onChange={(e) => {
                    const val = e.target.value ? Number(e.target.value) : null;
                    handleAssignOperator(selectedAgencyForDashboard.id, val);
                  }}
                  disabled={isUpdatingOp}
                  className="w-full sm:w-64 py-1.5 px-2.5 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Sin Operador Asignado --</option>
                  {operators.map((op) => (
                    <option key={op.id} value={op.id}>
                      {op.name} ({op.role === 'white_label_admin' ? 'Admin' : 'Operador'})
                    </option>
                  ))}
                </select>
                {isUpdatingOp && <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-600" />}
              </div>
            )}
          </div>
        </div>

        {/* Agency KPI Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs flex items-center gap-3.5">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Expedientes</p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{dossiersTotalCount}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs flex items-center gap-3.5">
            <div className="p-3 bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">En Gestión / Activos</p>
              <p className="text-xl font-bold text-sky-600 dark:text-sky-400">
                {selectedAgencyForDashboard.procesos_activos ?? agencyDossiers.filter(d => ['en_gestion', 'en_proceso', 'en_revision'].includes(d.status)).length}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs flex items-center gap-3.5">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Completados / Listos</p>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {selectedAgencyForDashboard.procesos_completados ?? agencyDossiers.filter(d => d.status === 'completado').length}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs flex items-center gap-3.5">
            <div className="p-3 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Grupos y Familias</p>
              <p className="text-xl font-bold text-purple-600 dark:text-purple-400">{groupsTotalCount}</p>
            </div>
          </div>
        </div>

        {/* Agency Navigation Tabs: Expedientes vs Grupos */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 text-xs">
          <button
            onClick={() => setAgencyDashboardTab('dossiers')}
            className={`px-4 py-3 font-extrabold rounded-t-xl transition-all border-b-2 flex items-center gap-2 ${
              agencyDashboardTab === 'dossiers'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border-indigo-600 shadow-2xs'
                : 'text-slate-500 border-transparent hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Expedientes Migratorios</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              {dossiersTotalCount}
            </span>
          </button>

          <button
            onClick={() => setAgencyDashboardTab('groups')}
            className={`px-4 py-3 font-extrabold rounded-t-xl transition-all border-b-2 flex items-center gap-2 ${
              agencyDashboardTab === 'groups'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border-indigo-600 shadow-2xs'
                : 'text-slate-500 border-transparent hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Grupos y Familias</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
              {groupsTotalCount}
            </span>
          </button>
        </div>

        {/* ================= TAB 1: EXPEDIENTES (FORMATO TABLA) ================= */}
        {agencyDashboardTab === 'dossiers' && (
          <div className="space-y-4">
            {/* Filters bar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs space-y-3">
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                <form onSubmit={handleDossiersSearchSubmit} className="flex gap-2 flex-1 max-w-md">
                  <div className="relative w-full">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Buscar por solicitante, código EXP, pasaporte..."
                      value={dossiersSearch}
                      onChange={(e) => setDossiersSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-slate-100"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shrink-0 transition-all"
                  >
                    Buscar
                  </button>
                </form>

                <div className="flex flex-wrap items-center gap-2 justify-end">
                  {/* Status filter */}
                  <select
                    value={dossiersStatusFilter}
                    onChange={(e) => {
                      setDossiersStatusFilter(e.target.value);
                      setDossiersPage(1);
                    }}
                    className="px-2.5 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">Todos los Estados</option>
                    <option value="en_gestion">En Gestión</option>
                    <option value="en_revision">En Revisión</option>
                    <option value="informacion_pendiente">Info. Pendiente</option>
                    <option value="informacion_recibida">Info. Recibida</option>
                    <option value="correccion_solicitada">Corrección Requerida</option>
                    <option value="completado">Completados</option>
                    <option value="cancelado">Cancelados</option>
                  </select>

                  {/* Priority filter */}
                  <select
                    value={dossiersPriorityFilter}
                    onChange={(e) => {
                      setDossiersPriorityFilter(e.target.value);
                      setDossiersPage(1);
                    }}
                    className="px-2.5 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">Toda Prioridad</option>
                    <option value="urgente">Urgente</option>
                    <option value="requiere_atencion">Requiere Atención</option>
                    <option value="pendiente">Normal</option>
                    <option value="completado">Listo</option>
                  </select>

                  {/* Group filter */}
                  <select
                    value={dossiersGroupFilter}
                    onChange={(e) => {
                      setDossiersGroupFilter(e.target.value);
                      setDossiersPage(1);
                    }}
                    className="px-2.5 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">Todos los Grupos</option>
                    <option value="none">Sin Grupo (Individuales)</option>
                    {allAgencyGroups.map((grp) => (
                      <option key={grp.id} value={grp.id}>
                        {grp.name} ({grp.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active group filter pill */}
              {dossiersGroupFilter !== 'all' && (
                <div className="flex items-center gap-2 pt-1 text-xs">
                  <span className="text-slate-400 font-medium">Filtro de grupo activo:</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800">
                    <Users className="w-3.5 h-3.5" />
                    <span>
                      {dossiersGroupFilter === 'none' 
                        ? 'Expedientes Individuales' 
                        : allAgencyGroups.find(g => String(g.id) === dossiersGroupFilter)?.name || `Grupo #${dossiersGroupFilter}`}
                    </span>
                    <button
                      onClick={() => setDossiersGroupFilter('all')}
                      className="ml-1 hover:text-rose-500"
                      title="Quitar filtro de grupo"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                </div>
              )}
            </div>

            {/* Expedientes Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      <th className="py-3.5 px-4">Código & Fecha</th>
                      <th className="py-3.5 px-4">Solicitante (Cliente)</th>
                      <th className="py-3.5 px-4">Proceso & Destino</th>
                      <th className="py-3.5 px-4">Grupo / Familia</th>
                      <th className="py-3.5 px-4">Fase & Progreso</th>
                      <th className="py-3.5 px-4">Responsable</th>
                      <th className="py-3.5 px-4 text-center">Estado</th>
                      <th className="py-3.5 px-4 text-right">Acceso Directo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {dossiersLoading ? (
                      <tr>
                        <td colSpan={8} className="py-16 text-center text-slate-400">
                          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
                          Cargando expedientes de {selectedAgencyForDashboard.name}...
                        </td>
                      </tr>
                    ) : agencyDossiers.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-16 text-center text-slate-400">
                          <FileText className="w-10 h-10 mx-auto mb-2 opacity-30 text-indigo-500" />
                          <p className="font-semibold text-slate-700 dark:text-slate-300">
                            No se encontraron expedientes en esta agencia
                          </p>
                          <p className="text-[11px] text-slate-400 mt-1">
                            {dossiersGroupFilter !== 'all' || dossiersStatusFilter !== 'all'
                              ? 'Pruebe relajando los filtros de búsqueda o grupo.'
                              : 'Esta agencia aún no ha registrado expedientes migratorios.'}
                          </p>
                        </td>
                      </tr>
                    ) : (
                      agencyDossiers.map((dossier) => {
                        const statusBadge = getDossierStatusBadge(dossier.status);
                        const respBadge = getResponsibleBadge(dossier.current_responsible);
                        const clientName = dossier.applicant_name || (dossier.client 
                          ? `${dossier.client.first_name || ''} ${dossier.client.last_name || ''}`.trim() || dossier.client.name
                          : 'Solicitante Principal');

                        return (
                          <tr
                            key={dossier.id}
                            className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                          >
                            {/* Código & Fecha */}
                            <td className="py-3.5 px-4 align-middle">
                              <span className="font-mono font-bold text-slate-900 dark:text-slate-100 block">
                                {dossier.code}
                              </span>
                              <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3" />
                                {dossier.created_at ? new Date(dossier.created_at).toLocaleDateString() : 'N/A'}
                              </span>
                            </td>

                            {/* Solicitante */}
                            <td className="py-3.5 px-4 align-middle">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-xs shrink-0 border border-indigo-100 dark:border-indigo-900/40">
                                  {clientName.charAt(0).toUpperCase()}
                                </div>
                                <div className="space-y-0.5">
                                  <span className="font-bold text-slate-800 dark:text-slate-100 block">
                                    {clientName}
                                  </span>
                                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                                    {(dossier.passport_number || dossier.client?.document_number) && (
                                      <span>Doc: {dossier.passport_number || dossier.client?.document_number}</span>
                                    )}
                                    {(dossier.applicant_email || dossier.client?.email) && (
                                      <span className="truncate max-w-[150px]">{dossier.applicant_email || dossier.client?.email}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Proceso & Destino */}
                            <td className="py-3.5 px-4 align-middle">
                              <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                                {dossier.processType?.name || 'Visa Consular'}
                              </span>
                              <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                <Globe className="w-3 h-3 text-slate-400" />
                                {dossier.processType?.country || dossier.country_destination || 'Destino no especificado'}
                              </span>
                            </td>

                            {/* Grupo / Familia */}
                            <td className="py-3.5 px-4 align-middle">
                              {dossier.group ? (
                                <button
                                  onClick={() => setDossiersGroupFilter(String(dossier.group!.id))}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition-colors"
                                  title="Filtrar por este grupo"
                                >
                                  <Users className="w-3 h-3" />
                                  <span className="truncate max-w-[140px]">{dossier.group.name}</span>
                                </button>
                              ) : (
                                <span className="text-slate-400 text-[11px] italic">Individual</span>
                              )}
                            </td>

                            {/* Fase & Progreso */}
                            <td className="py-3.5 px-4 align-middle min-w-[160px]">
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[120px]">
                                    {dossier.currentPhase?.name || dossier.current_stage_key || 'En Proceso'}
                                  </span>
                                  <span className="font-mono text-slate-400 font-bold">{dossier.progress || 0}%</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                  <div
                                    className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all"
                                    style={{ width: `${Math.min(100, Math.max(0, dossier.progress || 0))}%` }}
                                  />
                                </div>
                              </div>
                            </td>

                            {/* Responsable & Operador */}
                            <td className="py-3.5 px-4 align-middle">
                              <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-md uppercase border ${respBadge.bg}`}>
                                {respBadge.label}
                              </span>
                              {dossier.assignedOperator && (
                                <span className="text-[11px] text-slate-400 block mt-0.5 truncate max-w-[140px]">
                                  Op: {dossier.assignedOperator.name}
                                </span>
                              )}
                            </td>

                            {/* Estado */}
                            <td className="py-3.5 px-4 align-middle text-center">
                              <span className={`inline-block px-2.5 py-1 text-[11px] font-bold rounded-full border ${statusBadge.bg}`}>
                                {statusBadge.label}
                              </span>
                            </td>

                            {/* Acceso Directo */}
                            <td className="py-3.5 px-4 align-middle text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Botón principal directo al expediente 360 */}
                                <Link
                                  href={`/visas/expedientes/${dossier.id}`}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
                                  title="Acceder a la vista 360 del expediente"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Acceder</span>
                                </Link>

                                {/* Enlace portal cliente */}
                                {dossier.access_token && (
                                  <button
                                    onClick={() => handleCopyClientLink(dossier)}
                                    className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg transition-all"
                                    title="Copiar enlace de acceso del cliente"
                                  >
                                    {copiedTokenDossierId === dossier.id ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Dossiers Pagination */}
              {dossiersTotalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Página <strong className="text-slate-700 dark:text-slate-200">{dossiersPage}</strong> de{' '}
                    <strong className="text-slate-700 dark:text-slate-200">{dossiersTotalPages}</strong>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDossiersPage((p) => Math.max(1, p - 1))}
                      disabled={dossiersPage <= 1 || dossiersLoading}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 transition-all"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Anterior
                    </button>
                    <button
                      onClick={() => setDossiersPage((p) => Math.min(dossiersTotalPages, p + 1))}
                      disabled={dossiersPage >= dossiersTotalPages || dossiersLoading}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 transition-all"
                    >
                      Siguiente <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: GRUPOS Y FAMILIAS (FORMATO TABLA) ================= */}
        {agencyDashboardTab === 'groups' && (
          <div className="space-y-4">
            {/* Filter bar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
              <form onSubmit={handleGroupsSearchSubmit} className="flex gap-2 w-full md:w-auto flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar grupo por nombre, código o contacto..."
                    value={groupsSearch}
                    onChange={(e) => setGroupsSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-slate-100"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shrink-0 transition-all"
                >
                  Buscar
                </button>
              </form>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <span className="text-xs text-slate-400 font-medium">Tipo:</span>
                <select
                  value={groupsTypeFilter}
                  onChange={(e) => {
                    setGroupsTypeFilter(e.target.value);
                    setGroupsPage(1);
                  }}
                  className="px-2.5 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">Todos los Tipos</option>
                  <option value="familia">Familias</option>
                  <option value="pareja">Parejas</option>
                  <option value="corporativo">Corporativos</option>
                  <option value="viaje">Grupos de Viaje</option>
                  <option value="otro">Otros</option>
                </select>
              </div>
            </div>

            {/* Groups Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      <th className="py-3.5 px-4">Código</th>
                      <th className="py-3.5 px-4">Nombre del Grupo / Familia</th>
                      <th className="py-3.5 px-4">Tipo</th>
                      <th className="py-3.5 px-4">Contacto Principal</th>
                      <th className="py-3.5 px-4 text-center">Expedientes Vinculados</th>
                      <th className="py-3.5 px-4 text-center">Estado</th>
                      <th className="py-3.5 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {groupsLoading ? (
                      <tr>
                        <td colSpan={7} className="py-16 text-center text-slate-400">
                          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
                          Cargando grupos de {selectedAgencyForDashboard.name}...
                        </td>
                      </tr>
                    ) : agencyGroups.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-16 text-center text-slate-400">
                          <Users className="w-10 h-10 mx-auto mb-2 opacity-30 text-indigo-500" />
                          <p className="font-semibold text-slate-700 dark:text-slate-300">
                            No se encontraron grupos en esta agencia
                          </p>
                          <p className="text-[11px] text-slate-400 mt-1">
                            Esta agencia aún no tiene grupos o familias registradas.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      agencyGroups.map((group) => {
                        const typeBadge = getGroupTypeBadge(group.group_type);
                        const dossiersInGroup = group.dossiers_count ?? (group.dossiers ? group.dossiers.length : 0);

                        return (
                          <tr
                            key={group.id}
                            className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                          >
                            {/* Código */}
                            <td className="py-3.5 px-4 align-middle">
                              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                                {group.code || `GRP-${group.id}`}
                              </span>
                            </td>

                            {/* Nombre del Grupo */}
                            <td className="py-3.5 px-4 align-middle">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 font-bold flex items-center justify-center text-xs shrink-0 border border-purple-100 dark:border-purple-900/40">
                                  <Users className="w-4 h-4" />
                                </div>
                                <div>
                                  <span className="font-bold text-slate-800 dark:text-slate-100 block">
                                    {group.name}
                                  </span>
                                  {group.notes && (
                                    <span className="text-[11px] text-slate-400 line-clamp-1">
                                      {group.notes}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Tipo */}
                            <td className="py-3.5 px-4 align-middle">
                              <span className={`inline-block px-2.5 py-0.5 text-[11px] font-bold rounded-lg border ${typeBadge.color}`}>
                                {typeBadge.label}
                              </span>
                            </td>

                            {/* Contacto Principal */}
                            <td className="py-3.5 px-4 align-middle">
                              <span className="font-medium text-slate-700 dark:text-slate-300 block">
                                {group.contact_name || 'Sin contacto especificado'}
                              </span>
                              <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                                {group.contact_email && <span>{group.contact_email}</span>}
                                {group.contact_phone && <span>{group.contact_phone}</span>}
                              </div>
                            </td>

                            {/* Expedientes Vinculados */}
                            <td className="py-3.5 px-4 align-middle text-center">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-200 dark:border-indigo-800">
                                <FileText className="w-3.5 h-3.5" />
                                <span>{dossiersInGroup} {dossiersInGroup === 1 ? 'Expediente' : 'Expedientes'}</span>
                              </span>
                            </td>

                            {/* Estado */}
                            <td className="py-3.5 px-4 align-middle text-center">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                {group.status || 'Activo'}
                              </span>
                            </td>

                            {/* Acciones */}
                            <td className="py-3.5 px-4 align-middle text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Botón para ver y filtrar expedientes de este grupo */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setDossiersGroupFilter(String(group.id));
                                    setAgencyDashboardTab('dossiers');
                                  }}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs rounded-xl border border-indigo-200 dark:border-indigo-800 transition-all"
                                  title="Ver todos los expedientes de este grupo en formato tabla"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  <span>Ver Expedientes</span>
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

              {/* Groups Pagination */}
              {groupsTotalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Página <strong className="text-slate-700 dark:text-slate-200">{groupsPage}</strong> de{' '}
                    <strong className="text-slate-700 dark:text-slate-200">{groupsTotalPages}</strong>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setGroupsPage((p) => Math.max(1, p - 1))}
                      disabled={groupsPage <= 1 || groupsLoading}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 transition-all"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Anterior
                    </button>
                    <button
                      onClick={() => setGroupsPage((p) => Math.min(groupsTotalPages, p + 1))}
                      disabled={groupsPage >= groupsTotalPages || groupsLoading}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 transition-all"
                    >
                      Siguiente <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: DIRECTORIO DE AGENCIAS AFILIADAS (MAIN TABLE LIST VIEW)
  // =========================================================================
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Building2 className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Agencias Afiliadas</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Gestión centralizada de agencias de viajes, asignación de operadores y acceso directo al dashboard de grupos y expedientes.
              </p>
            </div>
          </div>
        </div>

        {/* Global Action / Reload */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              fetchAgencies();
              fetchOperators();
            }}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-all"
            title="Recargar datos"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-500' : ''}`} />
            Actualizar
          </button>
        </div>
      </div>

      {/* KPI Overview Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs flex items-center gap-3.5">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Agencias</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{totalAgenciesCount || agencies.length}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs flex items-center gap-3.5">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Con Operador Asignado</p>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{assignedCount}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs flex items-center gap-3.5">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-xl">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Sin Operador Asignado</p>
            <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{unassignedCount}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs flex items-center gap-3.5">
          <div className="p-3 bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 rounded-xl">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Expedientes Activos</p>
            <p className="text-xl font-bold text-sky-600 dark:text-sky-400">{activosProcesosSum}</p>
          </div>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-auto flex-1 max-w-lg">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por agencia, RUC, email o ciudad..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-slate-100"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all shrink-0"
          >
            Buscar
          </button>
        </form>

        {/* Status / Operator Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
            <Filter className="w-3.5 h-3.5" /> Filtrar:
          </span>
          <select
            value={operatorFilter}
            onChange={(e) => setOperatorFilter(e.target.value as any)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Todas las agencias ({agencies.length})</option>
            <option value="assigned">Con Operador ({assignedCount})</option>
            <option value="unassigned">Sin Operador Asignado ({unassignedCount})</option>
          </select>
        </div>
      </div>

      {/* TABLE VIEW OF AGENCIES */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3.5 px-4">Agencia Afiliada</th>
                <th className="py-3.5 px-4">Contacto & Ubicación</th>
                <th className="py-3.5 px-4 min-w-[220px]">Operador Mayorista Asignado</th>
                <th className="py-3.5 px-4 text-center">Expedientes Migratorios</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
                    Cargando listado de agencias...
                  </td>
                </tr>
              ) : filteredAgencies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-400">
                    <Building2 className="w-10 h-10 mx-auto mb-2 opacity-30 text-indigo-500" />
                    <p className="font-semibold text-slate-700 dark:text-slate-300">No se encontraron agencias</p>
                    <p className="text-[11px] text-slate-400 mt-1">Pruebe ajustando los filtros de búsqueda o el estado de asignación.</p>
                  </td>
                </tr>
              ) : (
                filteredAgencies.map((agency) => {
                  const currentOperator = agency.assigned_operator || agency.assignedOperator || 
                    operators.find(op => op.id === agency.assigned_operator_id);
                  const isUpdating = updatingAgencyId === agency.id;

                  return (
                    <tr
                      key={agency.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Agencia Info */}
                      <td className="py-4 px-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-600 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                            {agency.name ? agency.name.charAt(0).toUpperCase() : 'A'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                {agency.name}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                  agency.status == 1
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                    : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                                }`}
                              >
                                {agency.status == 1 ? 'Activa' : 'Inactiva'}
                              </span>
                            </div>
                            <div className="text-slate-400 text-[11px] mt-0.5">
                              {agency.business_name || 'Agencia de Viajes'}
                              {agency.ruc && <span className="ml-2 font-mono text-slate-500">RUC: {agency.ruc}</span>}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contacto & Ubicación */}
                      <td className="py-4 px-4 align-middle text-slate-600 dark:text-slate-300">
                        <div className="space-y-1">
                          {agency.email ? (
                            <div className="flex items-center gap-1.5 truncate max-w-[200px]" title={agency.email}>
                              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{agency.email}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Sin correo</span>
                          )}

                          {agency.phone && (
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{agency.phone}</span>
                            </div>
                          )}

                          {(agency.city || agency.country) && (
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{[agency.city, agency.country].filter(Boolean).join(', ')}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Operador Mayorista Asignado */}
                      <td className="py-4 px-4 align-middle">
                        {isWhiteLabelAdmin ? (
                          <div className="space-y-1.5">
                            <div className="relative">
                              <select
                                value={agency.assigned_operator_id || ''}
                                onChange={(e) => {
                                  const val = e.target.value ? Number(e.target.value) : null;
                                  handleAssignOperator(agency.id, val);
                                }}
                                disabled={isUpdating}
                                className={`w-full py-1.5 pl-2.5 pr-8 text-xs font-semibold rounded-xl border transition-all ${
                                  currentOperator
                                    ? 'bg-sky-50/60 dark:bg-sky-950/40 border-sky-300 dark:border-sky-800 text-sky-900 dark:text-sky-200'
                                    : 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                                } focus:ring-2 focus:ring-indigo-500 disabled:opacity-50`}
                              >
                                <option value="">-- Sin Operador Asignado --</option>
                                {operators.map((op) => (
                                  <option key={op.id} value={op.id}>
                                    {op.name} ({op.role === 'white_label_admin' ? 'Admin' : op.role === 'mayorista_supervisor' ? 'Supervisor' : 'Operador'})
                                  </option>
                                ))}
                              </select>
                              {isUpdating && (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin absolute right-2.5 top-1/2 -translate-y-1/2 text-sky-600" />
                              )}
                            </div>

                            {currentOperator && (
                              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                                <span>{currentOperator.email}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>
                            {currentOperator ? (
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 rounded-lg text-sky-800 dark:text-sky-200 font-semibold text-xs">
                                <UserCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                                <span>{currentOperator.name}</span>
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md font-medium border border-amber-200 dark:border-amber-800">
                                <AlertCircle className="w-3 h-3" /> Sin asignar
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Métricas de Expedientes */}
                      <td className="py-4 px-4 align-middle text-center">
                        <div className="inline-flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 p-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                          <span
                            className="px-2 py-1 bg-white dark:bg-slate-900 rounded-lg font-bold text-slate-800 dark:text-slate-200 text-xs shadow-xs"
                            title="Total Expedientes"
                          >
                            {agency.total_procesos || 0} Total
                          </span>
                          <span
                            className="px-2 py-1 bg-sky-100 dark:bg-sky-950/80 rounded-lg font-bold text-sky-700 dark:text-sky-300 text-xs"
                            title="Expedientes Activos"
                          >
                            {agency.procesos_activos || 0} Activos
                          </span>
                          <span
                            className="px-2 py-1 bg-amber-100 dark:bg-amber-950/80 rounded-lg font-bold text-amber-700 dark:text-amber-300 text-xs"
                            title="Expedientes Pendientes"
                          >
                            {agency.procesos_pendientes || 0} Pend.
                          </span>
                          <span
                            className="px-2 py-1 bg-emerald-100 dark:bg-emerald-950/80 rounded-lg font-bold text-emerald-700 dark:text-emerald-300 text-xs"
                            title="Expedientes Completados"
                          >
                            {agency.procesos_completados || 0} Listos
                          </span>
                        </div>
                      </td>

                      {/* Acciones */}
                      <td className="py-4 px-4 align-middle text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* BOTÓN DIRECTO AL DASHBOARD COMPLETO DE LA AGENCIA */}
                          <button
                            type="button"
                            onClick={() => handleSelectAgencyForDashboard(agency)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
                            title="Ver Dashboard completo de grupos y expedientes de esta agencia"
                          >
                            <LayoutDashboard className="w-3.5 h-3.5" />
                            <span>Ver Dashboard</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedAgency(agency)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl transition-all"
                            title="Ver contexto operativo de la agencia"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Contexto</span>
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

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Página <strong className="text-slate-700 dark:text-slate-200">{page}</strong> de{' '}
              <strong className="text-slate-700 dark:text-slate-200">{totalPages}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || isLoading}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 transition-all"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Anterior
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || isLoading}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 transition-all"
              >
                Siguiente <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Vista Contextual de Agencia */}
      {selectedAgency && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl p-6 space-y-5">
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-600 text-white font-bold flex items-center justify-center text-lg shadow-sm">
                  {selectedAgency.name ? selectedAgency.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{selectedAgency.name}</h3>
                  <p className="text-xs text-slate-500">{selectedAgency.business_name || 'Agencia de Viajes Afiliada'}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAgency(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Operator Assignment inside Modal */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-sky-600" />
                Operador Mayorista Asignado para esta Agencia
              </span>
              {isWhiteLabelAdmin ? (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                  <select
                    value={selectedAgency.assigned_operator_id || ''}
                    onChange={(e) => {
                      const val = e.target.value ? Number(e.target.value) : null;
                      handleAssignOperator(selectedAgency.id, val);
                    }}
                    disabled={updatingAgencyId === selectedAgency.id}
                    className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">-- Sin Operador Asignado --</option>
                    {operators.map((op) => (
                      <option key={op.id} value={op.id}>
                        {op.name} ({op.email})
                      </option>
                    ))}
                  </select>
                  {updatingAgencyId === selectedAgency.id && (
                    <span className="text-xs text-indigo-500 flex items-center gap-1">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Guardando...
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {selectedAgency.assigned_operator?.name || selectedAgency.assignedOperator?.name || 'Sin operador asignado'}
                </p>
              )}
            </div>

            {/* Estadísticas de Expedientes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <span className="text-xs text-slate-500 block">Total Procesos</span>
                <strong className="text-lg text-slate-800 dark:text-slate-100">{selectedAgency.total_procesos || 0}</strong>
              </div>
              <div className="p-3 bg-sky-50 dark:bg-sky-950/50 rounded-xl">
                <span className="text-xs text-sky-600 dark:text-sky-400 block">En Proceso</span>
                <strong className="text-lg text-sky-600 dark:text-sky-400">{selectedAgency.procesos_activos || 0}</strong>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/50 rounded-xl">
                <span className="text-xs text-amber-600 dark:text-amber-400 block">Pendientes</span>
                <strong className="text-lg text-amber-600 dark:text-amber-400">{selectedAgency.procesos_pendientes || 0}</strong>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl">
                <span className="text-xs text-emerald-600 dark:text-emerald-400 block">Completados</span>
                <strong className="text-lg text-emerald-600 dark:text-emerald-400">{selectedAgency.procesos_completados || 0}</strong>
              </div>
            </div>

            {/* Navegación al Dashboard de la Agencia */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Acceso al Dashboard</h4>
              <button
                type="button"
                onClick={() => {
                  const ag = selectedAgency;
                  setSelectedAgency(null);
                  handleSelectAgencyForDashboard(ag);
                }}
                className="w-full p-4 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/60 dark:bg-indigo-950/30 hover:border-indigo-500 flex items-center justify-between group transition-all text-left shadow-2xs"
              >
                <div>
                  <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300 block">
                    Abrir Dashboard de Grupos y Expedientes
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Visualiza y gestiona las tablas completas de familias y solicitantes de {selectedAgency.name}
                  </span>
                </div>
                <ArrowRight className="w-5 h-5 text-indigo-600 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setSelectedAgency(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-xl"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
