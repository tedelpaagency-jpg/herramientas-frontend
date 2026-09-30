'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Visa, VisaRef } from '../types';
import visaService from '../services/visaService';
import { VisaFormModal } from '../components/VisaFormModal';
import { 
  FileCheck, Plus, Search, Trash2, Edit3, Link as LinkIcon, 
  FolderPlus, Folder, Filter, CheckCircle2, XCircle, Clock, ArrowLeft, 
  ChevronRight, FileText, ExternalLink, Building2, RefreshCw, Users, ArrowUpRight
} from 'lucide-react';
import { TableSkeleton } from '@/components/Skeleton';
import toast from 'react-hot-toast';

export const VisasPage: React.FC = () => {
  const [visas, setVisas] = useState<Visa[]>([]);
  const [visaRefs, setVisaRefs] = useState<VisaRef[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Tab state when activeGroup is null: 'grupos' (group folder view) or 'todos' (flat master table of all visas)
  const [activeTab, setActiveTab] = useState<'grupos' | 'todos'>('grupos');

  // Group detail view state: null = showing main tabs; object = inside specific group
  const [activeGroup, setActiveGroup] = useState<VisaRef | { id: number | string; name: string } | null>(null);

  const [search, setSearch] = useState('');
  const [selectedVisaType, setSelectedVisaType] = useState<string>('all');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('all');

  // Modals
  const [isVisaModalOpen, setIsVisaModalOpen] = useState(false);
  const [editingVisa, setEditingVisa] = useState<Visa | null>(null);

  const [isRefModalOpen, setIsRefModalOpen] = useState(false);
  const [editingRef, setEditingRef] = useState<VisaRef | null>(null);
  const [refName, setRefName] = useState('');

  const fetchData = async (showRefreshToast = false) => {
    if (showRefreshToast) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const [visasData, refsData] = await Promise.all([
        visaService.getVisas(),
        visaService.getVisaRefs(),
      ]);
      setVisas(visasData);
      setVisaRefs(refsData);
      if (showRefreshToast) {
        toast.success('Datos actualizados');
      }
    } catch (err) {
      console.error('Error loading visas:', err);
      toast.error('Error al cargar la lista de visados');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreateVisa = (defaultGroup?: VisaRef | { id: number | string; name: string } | null) => {
    setEditingVisa(null);
    setIsVisaModalOpen(true);
  };

  const handleOpenEditVisa = (v: Visa) => {
    setEditingVisa(v);
    setIsVisaModalOpen(true);
  };

  const handleDeleteVisa = async (v: Visa) => {
    if (!confirm(`¿Estás seguro de eliminar la solicitud de visa para "${v.applicant_name}"?`)) {
      return;
    }
    try {
      await visaService.deleteVisa(v.id);
      toast.success('Solicitud de visa eliminada');
      fetchData();
    } catch (err) {
      console.error('Error deleting visa:', err);
      toast.error('Error al eliminar la visa');
    }
  };

  const handleCopyPublicLink = (v: Visa) => {
    const publicUrl = `${window.location.origin}/visa/show/${btoa(String(v.id))}`;
    navigator.clipboard.writeText(publicUrl);
    toast.success('¡Enlace para el cliente copiado! Envíalo para que lo llene.');
  };

  const handleOpenCreateRef = () => {
    setEditingRef(null);
    setRefName('');
    setIsRefModalOpen(true);
  };

  const handleOpenEditRef = (ref: VisaRef, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingRef(ref);
    setRefName(ref.name);
    setIsRefModalOpen(true);
  };

  const handleDeleteRef = async (ref: VisaRef, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`¿Estás seguro de eliminar el grupo "${ref.name}"?`)) return;
    try {
      await visaService.deleteVisaRef(ref.id);
      toast.success('Grupo de visados eliminado');
      if (activeGroup && 'id' in activeGroup && activeGroup.id === ref.id) {
        setActiveGroup(null);
      }
      fetchData();
    } catch (err) {
      console.error('Error deleting ref:', err);
      toast.error('Error al eliminar el grupo');
    }
  };

  const handleSaveRef = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refName.trim()) return;
    try {
      if (editingRef) {
        await visaService.updateVisaRef(editingRef.id, { name: refName });
        toast.success('Grupo de visados actualizado');
      } else {
        await visaService.createVisaRef({ name: refName });
        toast.success('Grupo de visados creado exitosamente');
      }
      setRefName('');
      setIsRefModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Error saving visa ref:', err);
      toast.error('Error al guardar el grupo');
    }
  };

  const handleVisaSaved = async (savedVisa?: Visa) => {
    try {
      const [visasData, refsData] = await Promise.all([
        visaService.getVisas(),
        visaService.getVisaRefs(),
      ]);
      setVisas(visasData);
      setVisaRefs(refsData);

      if (activeGroup && savedVisa && savedVisa.visa_ref_id) {
        const foundRef = refsData.find((r) => String(r.id) === String(savedVisa.visa_ref_id));
        if (foundRef) {
          setActiveGroup(foundRef);
        }
      }
    } catch (err) {
      console.error('Error refreshing after visa save:', err);
    }
  };

  const getGroupName = (refId?: number | string | null) => {
    if (!refId || String(refId) === '0' || refId === 'general') {
      return 'General / Sin Grupo';
    }
    const found = visaRefs.find((r) => String(r.id) === String(refId));
    return found ? found.name : `Grupo #${refId}`;
  };

  // Visas without a group
  const unassignedVisas = visas.filter((v) => !v.visa_ref_id || String(v.visa_ref_id) === '0');

  // Visas for current active group detail view
  const groupVisas = activeGroup ? visas.filter((v) => {
    if (activeGroup.id === 'general') return !v.visa_ref_id || String(v.visa_ref_id) === '0';
    return String(v.visa_ref_id) === String(activeGroup.id);
  }) : [];

  const filteredGroupVisas = groupVisas.filter((v) => {
    const matchesType = selectedVisaType === 'all' || v.visa_type === selectedVisaType;
    const matchesSearch = 
      v.applicant_name.toLowerCase().includes(search.toLowerCase()) ||
      (v.passport_number && v.passport_number.toLowerCase().includes(search.toLowerCase())) ||
      (v.description && v.description.toLowerCase().includes(search.toLowerCase()));

    return matchesType && matchesSearch;
  });

  const filteredRefs = visaRefs.filter((r) => 
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  // Filtered visas for master table (Tab "Todos los Expedientes")
  const allFilteredVisas = visas.filter((v) => {
    const matchesType = selectedVisaType === 'all' || v.visa_type === selectedVisaType;
    const matchesGroup = 
      selectedGroupFilter === 'all' ||
      (selectedGroupFilter === 'general' && (!v.visa_ref_id || String(v.visa_ref_id) === '0')) ||
      String(v.visa_ref_id) === selectedGroupFilter;
    const groupName = getGroupName(v.visa_ref_id);
    const matchesSearch = 
      v.applicant_name.toLowerCase().includes(search.toLowerCase()) ||
      (v.passport_number && v.passport_number.toLowerCase().includes(search.toLowerCase())) ||
      (v.description && v.description.toLowerCase().includes(search.toLowerCase())) ||
      groupName.toLowerCase().includes(search.toLowerCase());

    return matchesType && matchesGroup && matchesSearch;
  });

  // KPI Metrics (Minoristas: Enfoque ágil sin control de estados)
  const totalGrupos = visaRefs.length + (unassignedVisas.length > 0 ? 1 : 0);
  const totalExpedientes = visas.length;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          {activeGroup ? (
            <div className="flex items-center space-x-2 text-xs font-bold text-sky-600 dark:text-sky-400 mb-1">
              <button onClick={() => setActiveGroup(null)} className="hover:underline flex items-center space-x-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver a Grupos</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-900 dark:text-white font-extrabold">{activeGroup.name}</span>
            </div>
          ) : null}

          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-600 flex items-center justify-center text-white shadow-md shadow-sky-600/20">
              <FileCheck className="w-5 h-5" />
            </div>
            <span>{activeGroup ? `Expedientes: ${activeGroup.name}` : 'Gestión de Visados: Grupos y Expedientes'}</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {activeGroup 
              ? `Listado de solicitudes individuales asociadas al grupo ${activeGroup.name}.`
              : 'Módulo independiente de gestión de grupos y expedientes migratorios. Consulta todos los expedientes históricos y grupos generados.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Direct Link to Separate Wholesale Module */}
          <Link
            href="/visas/mayorista"
            className="flex items-center space-x-1.5 px-3.5 py-2.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs rounded-xl border border-indigo-200 dark:border-indigo-800 transition-all"
            title="Ir al módulo independiente de Operaciones Mayoristas B2B"
          >
            <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Módulo Mayorista B2B</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
          </Link>

          <button
            onClick={() => fetchData(true)}
            disabled={isRefreshing}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 transition-all"
            title="Refrescar lista"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-sky-600' : ''}`} />
          </button>

          {activeGroup && (
            <button
              onClick={() => setActiveGroup(null)}
              className="flex items-center space-x-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </button>
          )}

          <button
            onClick={handleOpenCreateRef}
            className="flex items-center space-x-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 transition-all"
          >
            <FolderPlus className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>Nuevo Grupo</span>
          </button>

          <button
            onClick={() => handleOpenCreateVisa(activeGroup)}
            className="flex items-center space-x-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-md shadow-sky-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Solicitud</span>
          </button>
        </div>
      </div>

      {/* Banner Informativo de Independencia Minorista */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/70 dark:border-sky-800/50 text-slate-700 dark:text-slate-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-sky-600 text-white shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase text-sky-900 dark:text-sky-300">
              Visas Minoristas (Gestión Directa con Clientes)
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Flujo simplificado e independiente: genera el grupo o solicitud, copia el enlace y envíaselo al cliente para que lo llene. Sin control de estados ni etapas de aprobación intermedias.
            </p>
          </div>
        </div>
        <Link
          href="/visas/mayorista"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-white font-bold text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0 shadow-xs"
        >
          <Building2 className="w-3.5 h-3.5 text-indigo-500" />
          <span>Ir a Portal Mayorista B2B</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
        </Link>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center font-black">
            <Folder className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Grupos</p>
            <p className="text-xl font-black text-slate-900 dark:text-white">{totalGrupos}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Solicitudes</p>
            <p className="text-xl font-black text-slate-900 dark:text-white">{totalExpedientes}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black">
            <LinkIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Listos para Llenar</p>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{totalExpedientes}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Expedientes Mayoristas</p>
            <Link href="/visas/mayorista" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 mt-0.5">
              <span>Portal B2B</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {!activeGroup ? (
        <div className="space-y-4">
          {/* View Switcher Tabs: "Vista por Grupos" vs "Todos los Expedientes" */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('grupos')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'grupos'
                    ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Folder className="w-4 h-4" />
                <span>Gestión por Grupos ({totalGrupos})</span>
              </button>
              <button
                onClick={() => setActiveTab('todos')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'todos'
                    ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Todos los Expedientes ({totalExpedientes})</span>
              </button>
            </div>

            <p className="text-xs text-slate-400 font-medium">
              {activeTab === 'grupos' 
                ? 'Carpetas y grupos de solicitantes para organizar visas.' 
                : 'Listado completo de todas las solicitudes históricas y activas.'}
            </p>
          </div>

          {/* TAB 1: GROUPS VIEW (Replicating CI3 visas_ref.php) */}
          {activeTab === 'grupos' && (
            isLoading ? (
              <TableSkeleton rows={5} />
            ) : (
              <div className="space-y-4">
                {/* Search Filter for Groups */}
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center shadow-xs">
                  <Search className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar grupo por nombre..."
                    className="w-full bg-transparent text-slate-900 dark:text-white text-xs font-medium focus:outline-none placeholder-slate-400"
                  />
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
                  <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider flex items-center space-x-2">
                      <Folder className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                      <span>Listado de grupos de visas</span>
                    </h4>
                    <span className="text-[11px] font-bold text-slate-500">
                      {filteredRefs.length + (unassignedVisas.length > 0 ? 1 : 0)} grupos encontrados
                    </span>
                  </div>

                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse text-xs text-slate-700 dark:text-slate-300">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 w-20 whitespace-nowrap">No.</th>
                          <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">Nombre del Grupo</th>
                          <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center whitespace-nowrap">Expedientes Asociados</th>
                          <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-right whitespace-nowrap">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {/* General / Unassigned Group */}
                        {unassignedVisas.length > 0 && (
                          <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-mono font-bold text-slate-400 whitespace-nowrap">—</td>
                            <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 flex items-center justify-center font-bold shrink-0">
                                  <Folder className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="font-extrabold text-slate-900 dark:text-white text-sm whitespace-nowrap">General / Sin Grupo</p>
                                  <p className="text-[11px] text-slate-500 font-medium whitespace-nowrap">Solicitudes registradas sin asignación específica de grupo</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                {unassignedVisas.length} {unassignedVisas.length === 1 ? 'expediente' : 'expedientes'}
                              </span>
                            </td>
                            <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-right whitespace-nowrap">
                              <button
                                onClick={() => setActiveGroup({ id: 'general', name: 'General / Sin Grupo' })}
                                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold text-xs shadow-xs transition-all"
                                title="Ver solicitudes de este grupo"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>Ver expedientes</span>
                              </button>
                            </td>
                          </tr>
                        )}

                        {/* Visa Reference Groups */}
                        {filteredRefs.map((ref) => {
                          const count = visas.filter((v) => String(v.visa_ref_id) === String(ref.id)).length;
                          return (
                            <tr key={ref.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                              <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-mono font-bold text-slate-500 whitespace-nowrap">#{ref.id}</td>
                              <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400 flex items-center justify-center font-bold shrink-0">
                                    <Folder className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <p className="font-extrabold text-slate-900 dark:text-white text-sm whitespace-nowrap">{ref.name}</p>
                                    <p className="text-[11px] text-slate-500 font-medium whitespace-nowrap">Expediente de visados grupales / familiares</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center whitespace-nowrap">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                                  {count} {count === 1 ? 'expediente' : 'expedientes'}
                                </span>
                              </td>
                              <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-right space-x-1.5 whitespace-nowrap">
                                {/* Botón Ver expedientes */}
                                <button
                                  onClick={() => setActiveGroup(ref)}
                                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold text-xs shadow-xs transition-all"
                                  title="Ver expedientes de este grupo"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  <span>Ver expedientes</span>
                                </button>

                                {/* Botón Editar */}
                                <button
                                  onClick={(e) => handleOpenEditRef(ref, e)}
                                  className="p-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-xl transition-colors border border-slate-200 dark:border-slate-800"
                                  title="Editar nombre del grupo"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>

                                {/* Botón Eliminar */}
                                <button
                                  onClick={(e) => handleDeleteRef(ref, e)}
                                  className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors border border-slate-200 dark:border-slate-800"
                                  title="Eliminar grupo"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {filteredRefs.length === 0 && unassignedVisas.length === 0 && (
                    <div className="p-12 text-center space-y-3">
                      <Folder className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400">No se encontraron grupos de visas registrados.</p>
                      <button
                        onClick={handleOpenCreateRef}
                        className="px-4 py-2 bg-sky-600 text-white font-bold text-xs rounded-xl hover:bg-sky-500 shadow-xs"
                      >
                        + Crear Primer Grupo
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          )}

          {/* TAB 2: ALL EXPEDIENTES MASTER TABLE (Master table of all historical & current visas) */}
          {activeTab === 'todos' && (
            isLoading ? (
              <TableSkeleton rows={5} />
            ) : (
              <div className="space-y-4">
                {/* Filters Strip for Master Table */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Search */}
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center shadow-xs">
                    <Search className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Buscar por solicitante, pasaporte..."
                      className="w-full bg-transparent text-slate-900 dark:text-white text-xs font-medium focus:outline-none placeholder-slate-400"
                    />
                  </div>

                  {/* Filter by Group */}
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center space-x-2 shadow-xs">
                    <Folder className="w-4 h-4 text-slate-400 shrink-0" />
                    <select
                      value={selectedGroupFilter}
                      onChange={(e) => setSelectedGroupFilter(e.target.value)}
                      className="w-full bg-transparent text-slate-900 dark:text-white text-xs font-medium focus:outline-none"
                    >
                      <option value="all">Todos los Grupos</option>
                      <option value="general">General / Sin Grupo</option>
                      {visaRefs.map((r) => (
                        <option key={r.id} value={String(r.id)}>{r.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Filter by Visa Type */}
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center space-x-2 shadow-xs">
                    <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                    <select
                      value={selectedVisaType}
                      onChange={(e) => setSelectedVisaType(e.target.value)}
                      className="w-full bg-transparent text-slate-900 dark:text-white text-xs font-medium focus:outline-none"
                    >
                      <option value="all">Todos los Tipos de Visa</option>
                      <option value="USA">Visa Americana (EEUU)</option>
                      <option value="CANADA">Visa Canadiense</option>
                      <option value="SCHENGEN">Visa Schengen (Europa)</option>
                    </select>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
                  <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider flex items-center space-x-2">
                      <FileCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                      <span>Listado maestro de expedientes migratorios</span>
                    </h4>
                    <span className="text-[11px] font-bold text-slate-500">
                      {allFilteredVisas.length} expedientes encontrados
                    </span>
                  </div>

                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse text-xs text-slate-700 dark:text-slate-300">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 w-16 whitespace-nowrap">ID</th>
                          <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">Nombre / Solicitante</th>
                          <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">Grupo Asignado</th>
                          <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">Tipo de Visa</th>
                          <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">Fecha Registro</th>
                          <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">Formulario para Llenar</th>
                          <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-right whitespace-nowrap">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {allFilteredVisas.map((v) => {
                          const groupName = getGroupName(v.visa_ref_id);
                          return (
                            <tr key={v.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                              <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-mono font-bold text-slate-400 whitespace-nowrap">
                                #{v.id}
                              </td>

                              {/* Solicitante */}
                              <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                                <div>
                                  <p className="font-extrabold text-slate-900 dark:text-white text-sm whitespace-nowrap">{v.applicant_name}</p>
                                  {v.passport_number && (
                                    <p className="text-[11px] font-mono text-slate-500 font-medium">Pasaporte: {v.passport_number}</p>
                                  )}
                                  {v.description && (
                                    <p className="text-[11px] text-slate-500 font-medium line-clamp-1">{v.description}</p>
                                  )}
                                </div>
                              </td>

                              {/* Grupo */}
                              <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                  v.visa_ref_id && String(v.visa_ref_id) !== '0'
                                    ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                }`}>
                                  <Folder className="w-3 h-3" />
                                  <span>{groupName}</span>
                                </span>
                              </td>

                              {/* Tipo de Visa */}
                              <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                                {v.visa_type === 'USA' ? 'Visa americana' : v.visa_type === 'CANADA' ? 'Visa canadiense' : v.visa_type}
                              </td>

                              {/* Fecha */}
                              <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-slate-500 font-medium whitespace-nowrap">
                                {v.created_at ? new Date(v.created_at).toLocaleDateString() : '—'}
                              </td>

                              {/* Formulario para Llenar */}
                              <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
                                <button
                                  onClick={() => handleCopyPublicLink(v)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 transition-all shadow-xs active:scale-95"
                                  title="Copiar enlace para enviar al cliente por WhatsApp o correo"
                                >
                                  <LinkIcon className="w-3.5 h-3.5" />
                                  <span>Mandar para llenar</span>
                                </button>
                              </td>

                              {/* Acciones */}
                              <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-right space-x-1.5 whitespace-nowrap">
                                {/* Copiar enlace público */}
                                <button
                                  onClick={() => handleCopyPublicLink(v)}
                                  className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-xl transition-colors border border-slate-200 dark:border-slate-800"
                                  title="Copiar enlace del formulario"
                                >
                                  <LinkIcon className="w-4 h-4" />
                                </button>

                                {/* Ver formulario consular público */}
                                <a
                                  href={`/visa/show/${btoa(String(v.id))}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-xl transition-colors border border-slate-200 dark:border-slate-800"
                                  title="Abrir formulario del cliente para ver respuestas"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>

                                {/* Editar */}
                                <button
                                  onClick={() => handleOpenEditVisa(v)}
                                  className="p-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-xl transition-colors border border-slate-200 dark:border-slate-800"
                                  title="Editar solicitud"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>

                                {/* Eliminar */}
                                <button
                                  onClick={() => handleDeleteVisa(v)}
                                  className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors border border-slate-200 dark:border-slate-800"
                                  title="Eliminar solicitud"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {allFilteredVisas.length === 0 && (
                    <div className="p-12 text-center space-y-3">
                      <FileCheck className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400">No se encontraron expedientes con los filtros aplicados.</p>
                      <button
                        onClick={() => handleOpenCreateVisa(null)}
                        className="px-4 py-2 bg-sky-600 text-white font-bold text-xs rounded-xl hover:bg-sky-500 shadow-xs"
                      >
                        + Crear Solicitud de Visa
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        /* LEVEL 2: INDIVIDUAL VISAS TABLE INSIDE SELECTED GROUP (Matching CI3 visa.php) */
        <div className="space-y-4">
          {/* Header Inside Selected Group */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setActiveGroup(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
                title="Volver al listado de grupos"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Folder className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span>Expedientes en {activeGroup.name}</span>
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  {filteredGroupVisas.length} {filteredGroupVisas.length === 1 ? 'solicitud individual' : 'solicitudes individuales'} asociadas a este grupo
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleOpenCreateVisa(activeGroup)}
                className="flex items-center space-x-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Solicitud al Grupo</span>
              </button>
            </div>
          </div>

          {/* Filters Bar Inside Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center shadow-xs">
              <Search className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Buscar en ${activeGroup.name}...`}
                className="w-full bg-transparent text-slate-900 dark:text-white text-xs font-medium focus:outline-none placeholder-slate-400"
              />
            </div>

            {/* Visa Type Filter */}
            <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center space-x-2 shadow-xs">
              <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <select
                value={selectedVisaType}
                onChange={(e) => setSelectedVisaType(e.target.value)}
                className="w-full bg-transparent text-slate-900 dark:text-white text-xs font-medium focus:outline-none"
              >
                <option value="all">Todos los Tipos de Visa</option>
                <option value="USA">Visa Americana (EEUU)</option>
                <option value="CANADA">Visa Canadiense</option>
                <option value="SCHENGEN">Visa Schengen (Europa)</option>
              </select>
            </div>
          </div>

          {/* Visas Data Table */}
          {isLoading ? (
            <TableSkeleton rows={5} />
          ) : filteredGroupVisas.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
              <FileCheck className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                No hay solicitudes de visa registradas en este grupo ({activeGroup.name}).
              </p>
              <button
                onClick={() => handleOpenCreateVisa(activeGroup)}
                className="px-4 py-2 bg-sky-600 text-white font-bold text-xs rounded-xl hover:bg-sky-500 shadow-xs"
              >
                + Crear Solicitud en este Grupo
              </button>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <h4 className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider flex items-center space-x-2">
                  <FileCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span>Listado de visas en {activeGroup.name}</span>
                </h4>
              </div>

              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse text-xs text-slate-700 dark:text-slate-300">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">Nombre / Solicitante</th>
                      <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">Fecha</th>
                      <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">Visa</th>
                      <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">Formulario para Llenar</th>
                      <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-right whitespace-nowrap">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredGroupVisas.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                        {/* Applicant Name */}
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm whitespace-nowrap">{v.applicant_name}</p>
                            {v.passport_number && (
                              <p className="text-[11px] font-mono text-slate-500 font-medium">Pasaporte: {v.passport_number}</p>
                            )}
                            {v.description && (
                              <p className="text-[11px] text-slate-500 font-medium line-clamp-1">{v.description}</p>
                            )}
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-slate-500 font-medium whitespace-nowrap">
                          {v.created_at ? new Date(v.created_at).toLocaleDateString() : 'Hoy'}
                        </td>

                        {/* Visa Type */}
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                          {v.visa_type === 'USA' ? 'Visa americana' : v.visa_type === 'CANADA' ? 'Visa canadiense' : v.visa_type}
                        </td>

                        {/* Formulario para Llenar */}
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleCopyPublicLink(v)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 transition-all shadow-xs active:scale-95"
                            title="Copiar enlace para enviar al cliente por WhatsApp o correo"
                          >
                            <LinkIcon className="w-3.5 h-3.5" />
                            <span>Mandar para llenar</span>
                          </button>
                        </td>

                        {/* Actions matching CI3 visa.php botones */}
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-right space-x-1.5 whitespace-nowrap">
                          {/* Copiar enlace público */}
                          <button
                            onClick={() => handleCopyPublicLink(v)}
                            className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-xl transition-colors border border-slate-200 dark:border-slate-800"
                            title="Copiar enlace público"
                          >
                            <LinkIcon className="w-4 h-4" />
                          </button>

                          {/* Ver detalles / Formulario público */}
                          <a
                            href={`/visa/show/${btoa(String(v.id))}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-xl transition-colors border border-slate-200 dark:border-slate-800"
                            title="Ver detalles / Abrir formulario consular completo"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>

                          {/* Editar */}
                          <button
                            onClick={() => handleOpenEditVisa(v)}
                            className="p-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-xl transition-colors border border-slate-200 dark:border-slate-800"
                            title="Editar"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Eliminar */}
                          <button
                            onClick={() => handleDeleteVisa(v)}
                            className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors border border-slate-200 dark:border-slate-800"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Visa Application Modal */}
      <VisaFormModal
        visa={editingVisa}
        visaRefs={visaRefs}
        defaultRefId={activeGroup ? activeGroup.id : null}
        isOpen={isVisaModalOpen}
        onClose={() => setIsVisaModalOpen(false)}
        onSaved={handleVisaSaved}
      />

      {/* Group Reference Modal */}
      {isRefModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <FolderPlus className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <span>{editingRef ? 'Editar Grupo de Visados' : 'Nuevo Grupo / Referencia de Visados'}</span>
            </h3>

            <form onSubmit={handleSaveRef} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre del Grupo *</label>
                <input
                  type="text"
                  required
                  value={refName}
                  onChange={(e) => setRefName(e.target.value)}
                  placeholder="Ej. Familia Rodríguez - EEUU 2026"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRefModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  {editingRef ? 'Guardar Cambios' : 'Crear Grupo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisasPage;
