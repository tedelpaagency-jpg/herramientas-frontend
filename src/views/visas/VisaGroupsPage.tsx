'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import visaWholesaleService, { VisaGroup } from '@/services/visaWholesaleService';
import { 
  Users, Plus, Search, Trash2, Edit3, ArrowLeft, RefreshCw, 
  FolderPlus, Phone, Mail, FileText, CheckCircle2 
} from 'lucide-react';
import toast from 'react-hot-toast';

export const VisaGroupsPage: React.FC = () => {
  const [groups, setGroups] = useState<VisaGroup[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingGroup, setEditingGroup] = useState<VisaGroup | null>(null);

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
      toast.error('Error al cargar grupos');
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
        toast.success('Grupo actualizado correctamente.');
      } else {
        await visaWholesaleService.createGroup(formData);
        toast.success('Grupo creado correctamente.');
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
    if (!confirm('¿Está seguro de eliminar este grupo?')) return;
    try {
      await visaWholesaleService.deleteGroup(id);
      toast.success('Grupo eliminado correctamente.');
      fetchGroups();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al eliminar grupo.');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Users className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Grupos de Solicitantes</h1>
          </div>
          <p className="text-sm text-slate-500">
            Administre familias, parejas o grupos corporativos. Cada integrante mantiene su expediente individual.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-md shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          Crear Grupo
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-16 text-center text-slate-400">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
              Cargando grupos...
            </div>
          ) : groups.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-30 text-indigo-500" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">No hay grupos registrados</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Grupo / Solicitantes</th>
                  <th className="py-3.5 px-4">Tipo</th>
                  <th className="py-3.5 px-4">Contacto Principal</th>
                  <th className="py-3.5 px-4 text-center">Expedientes Vinculados</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {groups.map((group) => (
                  <tr key={group.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900 dark:text-white text-xs">{group.name}</div>
                      <div className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400">{group.code}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase">
                        {group.group_type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="text-slate-800 dark:text-slate-200 font-semibold">{group.contact_name || 'Sin contacto'}</div>
                      <div className="text-[11px] text-slate-500">{group.contact_email || group.contact_phone || '—'}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-900/60">
                        {group.dossiers_count || 0} integrantes
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          href={`/visas?group_id=${group.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs shadow-xs transition-all"
                        >
                          <span>Ver expedientes</span>
                        </Link>
                        <button
                          onClick={() => handleOpenModal(group)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Editar Grupo"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
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
                ))}
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
              {editingGroup ? 'Editar Grupo' : 'Nuevo Grupo de Solicitantes'}
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
