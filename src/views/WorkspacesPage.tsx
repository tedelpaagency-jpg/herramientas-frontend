'use client';

import React, { useEffect, useState } from 'react';
import { Workspace } from '../types';
import workspaceMetaService from '../services/workspaceMetaService';
import crmService from '../services/crmService';
import { WorkspaceMetaModal } from '../components/WorkspaceMetaModal';
import { WorkspaceCustomFieldsModal } from '../components/WorkspaceCustomFieldsModal';
import { 
  Kanban, Plus, Search, Share2, Sliders, Edit3, Trash2, 
  ExternalLink, Layers, Users, Sparkles, Building2, X 
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export const WorkspacesPage: React.FC = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals state
  const [selectedMetaWorkspace, setSelectedMetaWorkspace] = useState<Workspace | null>(null);
  const [isMetaModalOpen, setIsMetaModalOpen] = useState(false);

  const [selectedFieldsWorkspace, setSelectedFieldsWorkspace] = useState<Workspace | null>(null);
  const [isFieldsModalOpen, setIsFieldsModalOpen] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
  });

  const fetchWorkspaces = async () => {
    setIsLoading(true);
    try {
      const data = await workspaceMetaService.getWorkspaces();
      setWorkspaces(data);
    } catch (err) {
      console.error('Error fetching workspaces:', err);
      toast.error('Error al cargar la lista de Workspaces');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const handleOpenCreate = () => {
    setEditingWorkspace(null);
    setFormData({ name: '', description: '', color: '#3B82F6' });
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (ws: Workspace) => {
    setEditingWorkspace(ws);
    setFormData({
      name: ws.name,
      description: ws.description || '',
      color: ws.color || '#3B82F6',
    });
    setIsCreateModalOpen(true);
  };

  const handleSubmitWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingWorkspace) {
        await workspaceMetaService.updateWorkspace(editingWorkspace.id, formData);
        toast.success('Workspace actualizado exitosamente');
      } else {
        await workspaceMetaService.createWorkspace(formData);
        toast.success('Workspace creado exitosamente');
      }
      setIsCreateModalOpen(false);
      fetchWorkspaces();
    } catch (err) {
      console.error('Error saving workspace:', err);
      toast.error('Error al guardar el Workspace');
    }
  };

  const handleDeleteWorkspace = async (ws: Workspace) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar el workspace "${ws.name}"?`)) {
      return;
    }
    try {
      await workspaceMetaService.deleteWorkspace(ws.id);
      toast.success('Workspace eliminado exitosamente');
      fetchWorkspaces();
    } catch (err) {
      console.error('Error deleting workspace:', err);
      toast.error('Error al eliminar el Workspace');
    }
  };

  const filteredWorkspaces = workspaces.filter(w => 
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    (w.description && w.description.toLowerCase().includes(search.toLowerCase())) ||
    (w.meta_campaign_name && w.meta_campaign_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20">
              <Kanban className="w-5 h-5" />
            </div>
            Workspaces por Agencia & CRM
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Selecciona un Workspace para ver su embudo Kanban o configurar la integración Meta Leads y Custom Fields.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Workspace</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-xs border border-slate-200/80 dark:border-slate-800 flex items-center">
        <Search className="w-4 h-4 text-slate-400 mr-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar Workspace por nombre, campaña Meta o descripción..."
          className="w-full bg-transparent text-slate-900 dark:text-white text-xs font-medium focus:outline-none placeholder-slate-400"
        />
      </div>

      {/* Workspaces Data Table */}
      {isLoading ? (
        <div className="py-20 flex flex-col justify-center items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold text-slate-400">Cargando Workspaces...</span>
        </div>
      ) : filteredWorkspaces.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
          <Kanban className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-xs font-bold text-slate-500">No se encontraron Workspaces para esta agencia.</p>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-blue-700"
          >
            + Crear Primer Workspace
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-4">Workspace</th>
                  <th className="px-5 py-4">Agencia</th>
                  <th className="px-5 py-4">Estado Integration</th>
                  <th className="px-5 py-4">Campaña Meta</th>
                  <th className="px-5 py-4">Formulario Meta</th>
                  <th className="px-5 py-4 text-center">Leads</th>
                  <th className="px-5 py-4">Fecha</th>
                  <th className="px-5 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredWorkspaces.map((ws) => {
                  const isMeta = !!ws.meta_enabled;

                  return (
                    <tr
                      key={ws.id}
                      className="group transition-all duration-200 hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                    >
                      {/* Workspace Name & Description */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3.5 h-10 rounded-full flex-shrink-0"
                            style={{ backgroundColor: ws.color || '#3B82F6' }}
                          />
                          <div>
                            <p className="font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors text-sm">
                              {ws.name}
                            </p>
                            <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
                              {ws.description || 'Sin descripción'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Agency */}
                      <td className="px-5 py-4 font-semibold text-slate-700 dark:text-slate-300">
                        {ws.agency?.name || 'Agencia Principal'}
                      </td>

                      {/* Meta Status Badge */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isMeta
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200/60'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200/60'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isMeta ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          {isMeta ? 'Meta Conectado' : 'Sin Meta'}
                        </span>
                      </td>

                      {/* Meta Campaign */}
                      <td className="px-5 py-4 font-medium text-slate-700 dark:text-slate-300">
                        {isMeta && ws.meta_campaign_name ? (
                          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold">
                            <Share2 className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{ws.meta_campaign_name}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">—</span>
                        )}
                      </td>

                      {/* Meta Form */}
                      <td className="px-5 py-4 font-medium text-slate-700 dark:text-slate-300">
                        {isMeta && ws.meta_form_name ? (
                          <span className="font-semibold text-slate-900 dark:text-white">{ws.meta_form_name}</span>
                        ) : (
                          <span className="text-slate-400 italic">—</span>
                        )}
                      </td>

                      {/* Leads Count */}
                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200/60">
                          {ws.clients_count ?? 0}
                        </span>
                      </td>

                      {/* Created At */}
                      <td className="px-5 py-4 text-slate-500 font-medium text-[11px] whitespace-nowrap">
                        {ws.created_at ? new Date(ws.created_at).toLocaleDateString() : 'N/A'}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right space-x-1.5 whitespace-nowrap">
                        <Link
                          href={`/crm?workspace_id=${ws.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-extrabold text-[11px] shadow-sm transition-all"
                          title="Ver Embudo Kanban"
                        >
                          <Kanban className="w-3.5 h-3.5" />
                          <span>Ver Embudo</span>
                        </Link>

                        <button
                          onClick={() => {
                            setSelectedMetaWorkspace(ws);
                            setIsMetaModalOpen(true);
                          }}
                          className="p-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl transition-colors border border-slate-200 dark:border-slate-700"
                          title="Configurar Meta"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedFieldsWorkspace(ws);
                            setIsFieldsModalOpen(true);
                          }}
                          className="p-2 text-slate-600 dark:text-slate-300 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-xl transition-colors border border-slate-200 dark:border-slate-700"
                          title="Gestionar Custom Fields"
                        >
                          <Sliders className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleOpenEdit(ws)}
                          className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                          title="Editar Workspace"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteWorkspace(ws)}
                          className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors border border-slate-200 dark:border-slate-700"
                          title="Eliminar Workspace"
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

          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 font-medium">
            <p>Mostrando <strong className="text-slate-800 dark:text-white">{filteredWorkspaces.length}</strong> Workspaces</p>
          </div>
        </div>
      )}


      {/* Modales Meta & Custom Fields */}
      <WorkspaceMetaModal
        workspace={selectedMetaWorkspace}
        isOpen={isMetaModalOpen}
        onClose={() => setIsMetaModalOpen(false)}
        onSaved={fetchWorkspaces}
      />

      <WorkspaceCustomFieldsModal
        workspace={selectedFieldsWorkspace}
        isOpen={isFieldsModalOpen}
        onClose={() => setIsFieldsModalOpen(false)}
        onUpdated={fetchWorkspaces}
      />

      {/* Create / Edit Workspace Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Kanban className="w-5 h-5 text-blue-600" />
                {editingWorkspace ? 'Editar Workspace' : 'Nuevo Workspace'}
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitWorkspace} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre del Workspace</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej. Campaña Inmobiliaria Guatemala"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descripción u objetivo comercial del workspace..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Color Identificador</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Guardar Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspacesPage;
