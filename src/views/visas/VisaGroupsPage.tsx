'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import visaWholesaleService, { VisaGroup, VisaDossier } from '@/services/visaWholesaleService';
import { 
  Users, Plus, Search, Trash2, Edit3, ArrowLeft, RefreshCw, 
  FolderPlus, Phone, Mail, FileText, CheckCircle2, ChevronDown, 
  ChevronUp, ExternalLink, Eye, ArrowRight, Building2, AlertCircle, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

export const VisaGroupsPage: React.FC = () => {
  const [groups, setGroups] = useState<VisaGroup[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingGroup, setEditingGroup] = useState<VisaGroup | null>(null);
  const [expandedGroupId, setExpandedGroupId] = useState<number | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    group_type: 'familia' | 'pareja' | 'corporativo' | 'viaje' | 'otro';
    contact_name: string;
    contact_email: string;
    contact_phone: string;
    notes: string;
  }>({
    name: '',
    group_type: 'familia',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    notes: '',
  });

  const fetchGroups = async () => {
    setIsLoading(true);
    try {
      const res = await visaWholesaleService.getGroups({ search: search || undefined });
      setGroups(res?.data?.data || res?.data || []);
    } catch (err) {
      toast.error('Error al cargar grupos B2B');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleOpenModal = (group?: VisaGroup) => {
    if (group) {
      setEditingGroup(group);
      setFormData({
        name: group.name,
        group_type: group.group_type,
        contact_name: group.contact_name || '',
        contact_email: group.contact_email || '',
        contact_phone: group.contact_phone || '',
        notes: group.notes || '',
      });
    } else {
      setEditingGroup(null);
      setFormData({
        name: '',
        group_type: 'familia',
        contact_name: '',
        contact_email: '',
        contact_phone: '',
        notes: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingGroup) {
        await visaWholesaleService.updateGroup(editingGroup.id, formData);
        toast.success('Grupo B2B actualizado correctamente.');
      } else {
        await visaWholesaleService.createGroup(formData);
        toast.success('Grupo B2B creado correctamente.');
      }
      setIsModalOpen(false);
      fetchGroups();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al guardar grupo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de eliminar este grupo B2B?')) return;
    try {
      await visaWholesaleService.deleteGroup(id);
      toast.success('Grupo B2B eliminado correctamente.');
      fetchGroups();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al eliminar grupo.');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Users className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Grupos / Familias B2B (Mayorista)</h1>
          </div>
          <p className="text-sm text-slate-500 max-w-3xl">
            Gestión de familias, parejas y grupos corporativos B2B. Cada integrante cuenta con su propio expediente individual con trazabilidad completa y aprobación por el operador mayorista.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/visas/mayorista"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-all border border-slate-200 dark:border-slate-700"
          >
            <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Portal Mayorista B2B</span>
          </Link>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-md shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Grupo B2B</span>
          </button>
        </div>
      </div>

      {/* Distinction Notice Banner */}
      <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-indigo-900 dark:text-indigo-200">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <p className="font-extrabold text-slate-900 dark:text-white">
              Expedientes B2B Sujetos a Aprobación Mayorista
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Los expedientes vinculados a estos grupos avanzan por etapas (revisión documental, pago de derechos consulares, cita y resolución). Las solicitudes minoristas rápidas (solo formulario) son independientes y se gestionan en Visas Minoristas.
            </p>
          </div>
        </div>

        <Link
          href="/visas"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 font-bold whitespace-nowrap shadow-xs hover:bg-slate-50 transition-all shrink-0"
        >
          <span>Ir a Visas Minoristas</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
        </Link>
      </div>

      {/* Main Groups Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-16 text-center text-slate-400">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
              Cargando grupos B2B...
            </div>
          ) : groups.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-30 text-indigo-500" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">No hay grupos B2B registrados</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-3 w-10 text-center">Exp.</th>
                  <th className="py-3.5 px-4">Grupo / Solicitantes</th>
                  <th className="py-3.5 px-4">Tipo</th>
                  <th className="py-3.5 px-4">Contacto Principal</th>
                  <th className="py-3.5 px-4 text-center">Expedientes B2B</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {groups.map((group) => {
                  const isExpanded = expandedGroupId === group.id;
                  const dossiersList: VisaDossier[] = group.dossiers || [];

                  return (
                    <React.Fragment key={group.id}>
                      <tr 
                        className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
                          isExpanded ? 'bg-indigo-50/30 dark:bg-indigo-950/20' : ''
                        }`}
                      >
                        {/* Toggle Chevron */}
                        <td className="py-3.5 px-3 text-center">
                          <button
                            onClick={() => setExpandedGroupId(isExpanded ? null : group.id)}
                            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                            title={isExpanded ? 'Ocultar expedientes' : 'Desplegar expedientes'}
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-indigo-600" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </td>

                        {/* Group Name & Code */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-bold text-slate-900 dark:text-white text-xs">{group.name}</div>
                          <div className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400">{group.code}</div>
                        </td>

                        {/* Group Type */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase">
                            {group.group_type}
                          </span>
                        </td>

                        {/* Primary Contact */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="text-slate-800 dark:text-slate-200 font-semibold">{group.contact_name || 'Sin contacto'}</div>
                          <div className="text-[11px] text-slate-500">{group.contact_email || group.contact_phone || '—'}</div>
                        </td>

                        {/* Dossiers Count Badge */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-900/60">
                            {group.dossiers_count ?? dossiersList.length} expedientes
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            {/* Toggle Inline Expedientes */}
                            <button
                              onClick={() => setExpandedGroupId(isExpanded ? null : group.id)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs shadow-xs transition-all ${
                                isExpanded
                                  ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100'
                                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                              }`}
                              title="Ver expedientes B2B vinculados a este grupo"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>{isExpanded ? 'Ocultar expedientes' : 'Ver expedientes B2B'}</span>
                            </button>

                            {/* Shortcut to Wholesale B2B Portal */}
                            <Link
                              href={`/visas/mayorista?group_id=${group.id}`}
                              className="p-1.5 text-indigo-600 hover:text-indigo-800 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors border border-slate-200 dark:border-slate-800"
                              title="Abrir en Portal Mayorista B2B"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>

                            {/* Edit */}
                            <button
                              onClick={() => handleOpenModal(group)}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Editar Grupo"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(group.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              title="Eliminar Grupo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Accordion Expanded B2B Dossiers Sub-Table */}
                      {isExpanded && (
                        <tr className="bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
                          <td colSpan={6} className="p-4 sm:p-5">
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
                              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5">
                                  <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                                    <Users className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                                      Expedientes B2B Vinculados a {group.name}
                                    </h4>
                                    <p className="text-[11px] text-slate-500">
                                      {dossiersList.length} integrantes con expediente individual en trámite consular mayorista
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <Link
                                    href={`/visas/mayorista?group_id=${group.id}`}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs transition-all"
                                  >
                                    <Building2 className="w-3.5 h-3.5" />
                                    <span>Abrir en Portal Mayorista B2B</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </Link>
                                </div>
                              </div>

                              {dossiersList.length === 0 ? (
                                <div className="p-8 text-center space-y-2">
                                  <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                                    Este grupo B2B aún no tiene expedientes registrados.
                                  </p>
                                  <p className="text-[11px] text-slate-400">
                                    Puedes registrar nuevos expedientes migratorios para este grupo desde el Portal Mayorista.
                                  </p>
                                  <Link
                                    href={`/visas/mayorista?group_id=${group.id}`}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 mt-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Crear Expediente B2B para este Grupo</span>
                                  </Link>
                                </div>
                              ) : (
                                <div className="overflow-x-auto">
                                  <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-50/80 dark:bg-slate-800/40 text-slate-500 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                                      <tr>
                                        <th className="py-2.5 px-4">Código B2B</th>
                                        <th className="py-2.5 px-4">Solicitante</th>
                                        <th className="py-2.5 px-4">Trámite Migratorio</th>
                                        <th className="py-2.5 px-4 text-center">Progreso</th>
                                        <th className="py-2.5 px-4">Estado Consular</th>
                                        <th className="py-2.5 px-4 text-right">Acción</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                                      {dossiersList.map((d) => (
                                        <tr key={d.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                                          <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                            {d.code}
                                          </td>
                                          <td className="py-3 px-4">
                                            <p className="font-bold text-slate-900 dark:text-white">{d.client?.name || 'Cliente'}</p>
                                            <p className="text-[10px] text-slate-400">{d.client?.email || d.client?.phone || '—'}</p>
                                          </td>
                                          <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                                            <span className="mr-1">{d.processType?.flag_icon || '🌐'}</span>
                                            <span>{d.processType?.name || 'Visa Consular'}</span>
                                          </td>
                                          <td className="py-3 px-4 text-center">
                                            <div className="inline-flex items-center gap-1.5">
                                              <div className="w-14 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                                <div 
                                                  className="h-full bg-indigo-600 rounded-full" 
                                                  style={{ width: `${Math.min(100, Math.max(0, d.progress || 0))}%` }} 
                                                />
                                              </div>
                                              <span className="font-bold text-[10px] text-slate-600 dark:text-slate-300">
                                                {d.progress}%
                                              </span>
                                            </div>
                                          </td>
                                          <td className="py-3 px-4">
                                            <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                              {d.status?.replace('_', ' ')}
                                            </span>
                                            {d.action_required && (
                                              <p className="text-[10px] text-rose-600 dark:text-rose-400 truncate max-w-[180px] mt-0.5">
                                                {d.action_required}
                                              </p>
                                            )}
                                          </td>
                                          <td className="py-3 px-4 text-right">
                                            <Link
                                              href={`/visas/expedientes/${d.id}`}
                                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs transition-all"
                                              title="Revisar expediente, documentos y etapas de aprobación consular"
                                            >
                                              <Eye className="w-3.5 h-3.5" />
                                              <span>Revisar 360°</span>
                                            </Link>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
              {editingGroup ? 'Editar Grupo B2B' : 'Nuevo Grupo de Solicitantes B2B'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Nombre del Grupo / Familia *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Familia Pérez o Grupo Corporativo Tech"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Tipo de Grupo *
                </label>
                <select
                  value={formData.group_type}
                  onChange={(e) => setFormData({ ...formData, group_type: e.target.value as any })}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-slate-100"
                >
                  <option value="familia">Familia</option>
                  <option value="pareja">Pareja</option>
                  <option value="corporativo">Corporativo / Empresa</option>
                  <option value="viaje">Grupo de Viaje</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Persona de Contacto Principal
                </label>
                <input
                  type="text"
                  value={formData.contact_name}
                  onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                  placeholder="Juan Pérez"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-500 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/20 disabled:opacity-50"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar Grupo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisaGroupsPage;
