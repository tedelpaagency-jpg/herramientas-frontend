'use client';

import React, { useEffect, useState } from 'react';
import { Visa, VisaRef } from '../types';
import visaService from '../services/visaService';
import { VisaFormModal } from '../components/VisaFormModal';
import { 
  FileCheck, Plus, Search, Trash2, Edit3, Link as LinkIcon, Eye, EyeOff, FolderPlus, Folder, Filter, CheckCircle2, XCircle, Clock, ArrowLeft, ChevronRight, FileText, ExternalLink
} from 'lucide-react';
import { TableSkeleton } from '@/components/Skeleton';
import toast from 'react-hot-toast';

export const VisasPage: React.FC = () => {
  const [visas, setVisas] = useState<Visa[]>([]);
  const [visaRefs, setVisaRefs] = useState<VisaRef[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Group-First State: activeGroup = null means showing Groups table; activeGroup = VisaRef | { id: number | string, name: string } means inside group detail
  const [activeGroup, setActiveGroup] = useState<VisaRef | { id: number | string; name: string } | null>(null);

  const [search, setSearch] = useState('');
  const [selectedVisaType, setSelectedVisaType] = useState<string>('all');

  // Modals
  const [isVisaModalOpen, setIsVisaModalOpen] = useState(false);
  const [editingVisa, setEditingVisa] = useState<Visa | null>(null);

  const [isRefModalOpen, setIsRefModalOpen] = useState(false);
  const [editingRef, setEditingRef] = useState<VisaRef | null>(null);
  const [refName, setRefName] = useState('');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [visasData, refsData] = await Promise.all([
        visaService.getVisas(),
        visaService.getVisaRefs(),
      ]);
      setVisas(visasData);
      setVisaRefs(refsData);
    } catch (err) {
      console.error('Error loading visas:', err);
      toast.error('Error al cargar la lista de visados');
    } finally {
      setIsLoading(false);
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

  const handleToggleStatus = async (v: Visa) => {
    const nextStatus = v.status === '1' || v.status === 'pending' ? '2' : '1';
    try {
      await visaService.updateVisaStatus(v.id, nextStatus);
      toast.success(`Estado actualizado a ${nextStatus === '2' ? 'Confirmada' : 'Pendiente'}`);
      fetchData();
    } catch (err) {
      console.error('Error toggling visa status:', err);
      toast.error('Error al cambiar estado de la visa');
    }
  };

  const handleCopyPublicLink = (v: Visa) => {
    const publicUrl = `${window.location.origin}/visa/show/${btoa(String(v.id))}`;
    navigator.clipboard.writeText(publicUrl);
    toast.success('Enlace público copiado al portapapeles');
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

      if (savedVisa) {
        if (savedVisa.visa_ref_id) {
          const foundRef = refsData.find((r) => String(r.id) === String(savedVisa.visa_ref_id));
          if (foundRef) {
            setActiveGroup(foundRef);
          }
        } else {
          setActiveGroup({ id: 'general', name: 'General / Sin Grupo' });
        }
      }
    } catch (err) {
      console.error('Error refreshing after visa save:', err);
    }
  };

  // Visas without a group
  const unassignedVisas = visas.filter((v) => !v.visa_ref_id || String(v.visa_ref_id) === '0');

  // Visas for current active group
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

  const renderStatusBadge = (status: string) => {
    if (status === '1' || status === 'pending') {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
          <Clock className="w-3 h-3" />
          <span>Pendiente</span>
        </span>
      );
    }
    if (status === '2' || status === 'confirmed' || status === 'approved') {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" />
          <span>Confirmada</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
        <XCircle className="w-3 h-3" />
        <span>Rechazado</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          {activeGroup ? (
            <div className="flex items-center space-x-2 text-xs font-bold text-sky-600 dark:text-sky-400 mb-1">
              <button onClick={() => setActiveGroup(null)} className="hover:underline flex items-center space-x-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Listado de Grupos</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-900 dark:text-white font-extrabold">{activeGroup.name}</span>
            </div>
          ) : null}

          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-600 flex items-center justify-center text-white shadow-md shadow-sky-600/20">
              <FileCheck className="w-5 h-5" />
            </div>
            <span>{activeGroup ? `Expedientes: ${activeGroup.name}` : 'Visas - Listado de Grupos'}</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {activeGroup 
              ? `Listado de solicitudes individuales de visas asociadas a ${activeGroup.name}`
              : 'Gestión de grupos de visados (Replicado de CI3). Haz clic en ver expedientes para consultar las solicitudes individuales.'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {activeGroup && (
            <button
              onClick={() => setActiveGroup(null)}
              className="flex items-center space-x-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a Grupos</span>
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
            className="flex items-center space-x-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Solicitud</span>
          </button>
        </div>
      </div>

      {/* LEVEL 1: GROUPS DATA TABLE (Matching CI3 visas_ref.php) */}
      {!activeGroup ? (
        isLoading ? (
          <TableSkeleton rows={5} />
        ) : (
          <div className="space-y-4">
            {/* Search Filter for Groups */}
            <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center shadow-xs">
              <Search className="w-4 h-4 text-slate-400 mr-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar grupo por nombre..."
                className="w-full bg-transparent text-slate-900 dark:text-white text-xs font-medium focus:outline-none placeholder-slate-400"
              />
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <h4 className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider flex items-center space-x-2">
                  <Folder className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span>Listado de grupos de visas</span>
                </h4>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs text-slate-700 dark:text-slate-300">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="px-6 py-4 w-20">No.</th>
                      <th className="px-6 py-4">Nombre del Grupo</th>
                      <th className="px-6 py-4 text-center">Solicitudes</th>
                      <th className="px-6 py-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {/* General / Unassigned Group */}
                    {unassignedVisas.length > 0 && (
                      <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-slate-400">—</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 flex items-center justify-center font-bold">
                              <Folder className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-extrabold text-slate-900 dark:text-white text-sm">General / Sin Grupo</p>
                              <p className="text-[11px] text-slate-500 font-medium">Solicitudes registradas sin asignación específica</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            {unassignedVisas.length} {unassignedVisas.length === 1 ? 'solicitud' : 'solicitudes'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
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
                          <td className="px-6 py-4 font-mono font-bold text-slate-500">{ref.id}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400 flex items-center justify-center font-bold">
                                <Folder className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="font-extrabold text-slate-900 dark:text-white text-sm">{ref.name}</p>
                                <p className="text-[11px] text-slate-500 font-medium">Expediente de visados grupales</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                              {count} {count === 1 ? 'solicitud' : 'solicitudes'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                            {/* Botón Ver detalles (CI3 fa-file-lines) */}
                            <button
                              onClick={() => setActiveGroup(ref)}
                              className="inline-flex items-center space-x-1 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold text-xs shadow-xs transition-all"
                              title="Ver expedientes de este grupo"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Ver expedientes</span>
                            </button>

                            {/* Botón Editar (CI3 fa-pencil) */}
                            <button
                              onClick={(e) => handleOpenEditRef(ref, e)}
                              className="p-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-xl transition-colors border border-slate-200 dark:border-slate-800"
                              title="Editar nombre del grupo"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            {/* Botón Eliminar (CI3 fa-trash) */}
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
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400">No se encontraron grupos de visas.</p>
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
      ) : (
        /* LEVEL 2: INDIVIDUAL VISAS TABLE INSIDE SELECTED GROUP (Matching CI3 visa.php) */
        <div className="space-y-4">
          {/* Filters Bar Inside Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center shadow-xs">
              <Search className="w-4 h-4 text-slate-400 mr-3" />
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

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs text-slate-700 dark:text-slate-300">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="px-6 py-4">Nombre / Solicitante</th>
                      <th className="px-6 py-4">Fecha</th>
                      <th className="px-6 py-4">Visa</th>
                      <th className="px-6 py-4">Estado</th>
                      <th className="px-6 py-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredGroupVisas.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                        {/* Applicant Name */}
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm">{v.applicant_name}</p>
                            {v.description && (
                              <p className="text-[11px] text-slate-500 font-medium line-clamp-1">{v.description}</p>
                            )}
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 text-slate-500 font-medium whitespace-nowrap">
                          {v.created_at ? new Date(v.created_at).toLocaleDateString() : 'Hoy'}
                        </td>

                        {/* Visa Type (Visa americana / Visa canadiense) */}
                        <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">
                          {v.visa_type === 'USA' ? 'Visa americana' : v.visa_type === 'CANADA' ? 'Visa canadiense' : v.visa_type}
                        </td>

                        {/* Status Badge */}
                        <td className="px-6 py-4">
                          {renderStatusBadge(v.status)}
                        </td>

                        {/* Actions matching CI3 visa.php botones */}
                        <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                          {/* Copiar enlace público */}
                          <button
                            onClick={() => handleCopyPublicLink(v)}
                            className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-xl transition-colors border border-slate-200 dark:border-slate-800"
                            title="Copiar enlace público"
                          >
                            <LinkIcon className="w-4 h-4" />
                          </button>

                          {/* Ver detalles / Formulario público (CI3 fa-file-lines) */}
                          <a
                            href={`/visa/show/${btoa(String(v.id))}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-xl transition-colors border border-slate-200 dark:border-slate-800"
                            title="Ver detalles / Abrir formulario consular completo"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>

                          {/* Alternar estado rápido (CI3 enableVisa) */}
                          <button
                            onClick={() => handleToggleStatus(v)}
                            className="p-2 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40 rounded-xl transition-colors border border-slate-200 dark:border-slate-800"
                            title={v.status === '1' || v.status === 'pending' ? 'Marcar como Confirmada' : 'Marcar como Pendiente'}
                          >
                            {v.status === '1' || v.status === 'pending' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>

                          {/* Editar (CI3 fa-edit) */}
                          <button
                            onClick={() => handleOpenEditVisa(v)}
                            className="p-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-xl transition-colors border border-slate-200 dark:border-slate-800"
                            title="Editar"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Eliminar (CI3 fa-trash) */}
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
