'use client';

import React, { useEffect, useState } from 'react';
import { 
  HelpCircle, Video, BookOpen, ExternalLink, Edit3, Trash2, 
  Search, CheckCircle2, XCircle, Globe, RefreshCw, Layers, 
  Play, Sparkles, Filter, Eye, AlertCircle, Save, Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import moduleTutorialService from '../../services/moduleTutorialService';
import whiteLabelService from '../../services/whiteLabelService';
import { ModuleAdminTutorialItem, ModuleTutorialsAdminData, WhiteLabel } from '../../types';
import { parseVideoUrl } from '@/utils/videoEmbedHelper';
import { ModuleHelpModal } from '@/components/tutorials/ModuleHelpModal';

export const ModuleTutorialsAdminPage: React.FC = () => {
  const { user, currentWhiteLabel } = useAuth();
  const [data, setData] = useState<ModuleTutorialsAdminData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [whiteLabels, setWhiteLabels] = useState<WhiteLabel[]>([]);
  const [selectedWhiteLabelId, setSelectedWhiteLabelId] = useState<number | undefined>(undefined);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<ModuleAdminTutorialItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Edit Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formManualUrl, setFormManualUrl] = useState('');
  const [formManualContent, setFormManualContent] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);

  // Preview Modal State
  const [previewModuleKey, setPreviewModuleKey] = useState<string | null>(null);

  const isSuperAdmin = user?.role === 'super_admin' || user?.roles?.some((r: any) => r.name === 'super_admin');

  // Load WhiteLabels list if SuperAdmin
  useEffect(() => {
    if (isSuperAdmin) {
      whiteLabelService.getWhiteLabels()
        .then((res: any) => {
          const list = Array.isArray(res) ? res : res?.data || [];
          setWhiteLabels(list);
          if (list.length > 0 && !selectedWhiteLabelId) {
            setSelectedWhiteLabelId(list[0].id);
          }
        })
        .catch(err => console.error('Error fetching white labels:', err));
    }
  }, [isSuperAdmin]);

  const fetchTutorials = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const targetWlId = isSuperAdmin ? selectedWhiteLabelId : (selectedWhiteLabelId || currentWhiteLabel?.id);
      const res = await moduleTutorialService.getAllTutorials(targetWlId);
      setData(res);
    } catch (err: any) {
      console.error('Error fetching module tutorials:', err);
      const msg = err?.response?.data?.message || err?.message || 'Error al cargar la lista de tutoriales de módulos';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTutorials();
  }, [selectedWhiteLabelId, currentWhiteLabel?.id]);

  const handleOpenEdit = (mod: ModuleAdminTutorialItem) => {
    setEditingModule(mod);
    setFormTitle(mod.tutorial?.title || `Tutorial de ${mod.name}`);
    setFormDescription(mod.tutorial?.description || mod.description || '');
    setFormVideoUrl(mod.tutorial?.video_url || '');
    setFormManualUrl(mod.tutorial?.manual_url || '');
    setFormManualContent(mod.tutorial?.manual_content || '');
    setFormIsActive(mod.tutorial?.is_active ?? true);
    setIsEditModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModule) return;

    setIsSaving(true);
    try {
      await moduleTutorialService.saveTutorial({
        module_key: editingModule.key,
        title: formTitle,
        description: formDescription,
        video_url: formVideoUrl,
        manual_url: formManualUrl,
        manual_content: formManualContent,
        is_active: formIsActive,
        white_label_id: selectedWhiteLabelId || data?.white_label?.id,
      });

      toast.success(`Tutorial de "${editingModule.name}" guardado exitosamente`);
      setIsEditModalOpen(false);
      fetchTutorials();
    } catch (err: any) {
      console.error('Error saving tutorial:', err);
      toast.error(err?.response?.data?.message || 'Error al guardar el tutorial');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (mod: ModuleAdminTutorialItem) => {
    if (!mod.tutorial?.id) return;
    if (!confirm(`¿Estás seguro de eliminar el tutorial de "${mod.name}"?`)) return;

    try {
      await moduleTutorialService.deleteTutorial(mod.tutorial.id);
      toast.success('Tutorial eliminado correctamente');
      fetchTutorials();
    } catch (err: any) {
      console.error('Error deleting tutorial:', err);
      toast.error('Error al eliminar el tutorial');
    }
  };

  // Categories list
  const categories = ['ALL', 'PRINCIPAL', 'CRM', 'INMOBILIARIA', 'TURISMO', 'COMERCIO', 'LEGAL', 'MARKETING', 'ACADEMIA', 'ADMINISTRACIÓN'];

  // Filtered modules
  const filteredModules = (data?.modules || []).filter(mod => {
    const matchesCategory = selectedCategory === 'ALL' || mod.category === selectedCategory;
    const matchesSearch = 
      mod.name.toLowerCase().includes(search.toLowerCase()) ||
      mod.key.toLowerCase().includes(search.toLowerCase()) ||
      mod.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const previewVideoInfo = parseVideoUrl(formVideoUrl);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Page Title & SuperAdmin WhiteLabel Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>Centro de Aprendizaje & Soporte</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Tutoriales y Manuales de Módulos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Personaliza los videos explicativos y enlaces al manual de usuario online para cada módulo de tu Marca Blanca.
          </p>
        </div>

        {/* SuperAdmin WhiteLabel Picker */}
        {isSuperAdmin && whiteLabels.length > 0 && (
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
            <Globe className="w-4 h-4 text-slate-400 ml-1" />
            <select
              value={selectedWhiteLabelId || ''}
              onChange={(e) => setSelectedWhiteLabelId(Number(e.target.value))}
              className="bg-transparent text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer pr-4"
            >
              {whiteLabels.map(wl => (
                <option key={wl.id} value={wl.id} className="dark:bg-slate-900">
                  {wl.name} (ID #{wl.id})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      {data?.metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Módulos Totales</p>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">{data.metrics.total_modules}</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Con Video</p>
              <h3 className="text-xl font-black text-emerald-600 dark:text-emerald-400">{data.metrics.with_video}</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Con Manual Online</p>
              <h3 className="text-xl font-black text-indigo-600 dark:text-indigo-400">{data.metrics.with_manual}</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pendientes</p>
              <h3 className="text-xl font-black text-amber-600 dark:text-amber-400">{data.metrics.pending}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar módulo por nombre o descripción..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white"
            />
          </div>

          {/* Active WhiteLabel Tag */}
          {data?.white_label && (
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>Editando tutoriales para:</span>
              <strong className="text-slate-800 dark:text-slate-200 font-bold bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                {data.white_label.name}
              </strong>
            </div>
          )}
        </div>

        {/* Categories Tab Pill Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-sky-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat === 'ALL' ? 'Todos los Módulos' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Error Alert Banner */}
      {errorMsg && !isLoading && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 p-4 rounded-xl flex items-center justify-between gap-3 text-rose-800 dark:text-rose-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            <div>
              <p className="text-xs font-bold">Inconveniente al cargar los tutoriales</p>
              <p className="text-xs text-rose-600 dark:text-rose-300 mt-0.5">{errorMsg}</p>
            </div>
          </div>
          <button
            onClick={fetchTutorials}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reintentar</span>
          </button>
        </div>
      )}

      {/* Modules Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-400">
            <RefreshCw className="w-7 h-7 animate-spin text-sky-500" />
            <p className="text-xs font-semibold">Cargando módulos de la plataforma...</p>
          </div>
        ) : filteredModules.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <Layers className="w-10 h-10 mx-auto opacity-50 mb-2" />
            <p className="text-sm font-semibold">No se encontraron módulos con los filtros aplicados</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                  <th className="py-3.5 px-4">Módulo</th>
                  <th className="py-3.5 px-4">Categoría</th>
                  <th className="py-3.5 px-4 text-center">Video Tutorial</th>
                  <th className="py-3.5 px-4 text-center">Manual Online</th>
                  <th className="py-3.5 px-4 text-center">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filteredModules.map((mod) => (
                  <tr 
                    key={mod.key}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    {/* Module Name & Path */}
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{mod.name}</span>
                          {mod.tutorial?.title && (
                            <span className="text-[10px] font-normal text-slate-400 italic">
                              ("{mod.tutorial.title}")
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {mod.description}
                        </p>
                        <span className="text-[10px] font-mono text-slate-400">
                          {mod.path}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {mod.category}
                      </span>
                    </td>

                    {/* Video Status */}
                    <td className="py-3.5 px-4 text-center">
                      {mod.has_video ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800 text-[10px]">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Configurado</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">Sin video</span>
                      )}
                    </td>

                    {/* Manual Online Status */}
                    <td className="py-3.5 px-4 text-center">
                      {mod.has_manual ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800 text-[10px]">
                          <BookOpen className="w-3 h-3" />
                          <span>Configurado</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">Sin manual</span>
                      )}
                    </td>

                    {/* Active State */}
                    <td className="py-3.5 px-4 text-center">
                      {mod.is_configured ? (
                        mod.is_active ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300">
                            Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800">
                            Oculto
                          </span>
                        )
                      ) : (
                        <span className="text-slate-400 text-[10px]">Pendiente</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Vista Previa */}
                        <button
                          type="button"
                          onClick={() => setPreviewModuleKey(mod.key)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Probar vista como usuario"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Configurar */}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(mod)}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200 dark:border-sky-800 rounded-lg transition-colors cursor-pointer shadow-2xs"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{mod.is_configured ? 'Editar' : 'Configurar'}</span>
                        </button>

                        {/* Eliminar tutorial */}
                        {mod.tutorial?.id && (
                          <button
                            type="button"
                            onClick={() => handleDelete(mod)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                            title="Eliminar tutorial"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Tutorial Modal */}
      {isEditModalOpen && editingModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 animate-slide-up-fade">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold shadow-md">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Configurar Tutorial: {editingModule.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Ruta: <span className="font-mono text-sky-500">{editingModule.path}</span> • Clave: <span className="font-mono">{editingModule.key}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Título Personalizado del Tutorial
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder={`Ej: Guía completa de ${editingModule.name}`}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Descripción / Resumen de lo que aprenderá el usuario
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Explica brevemente para qué sirve este módulo..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    URL de Video (YouTube, Vimeo, Loom o MP4)
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={formVideoUrl}
                      onChange={(e) => setFormVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white"
                    />
                    <Video className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                  {formVideoUrl && (
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      Proveedor detectado: <strong className="uppercase text-sky-600 dark:text-sky-400">{previewVideoInfo.type}</strong>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    URL de Manual de Usuario Online
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={formManualUrl}
                      onChange={(e) => setFormManualUrl(e.target.value)}
                      placeholder="https://docs.google.com/... o enlace web"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white"
                    />
                    <ExternalLink className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    El usuario podrá abrirlo en una pestaña nueva con un clic.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Guía Rápida / Instrucciones en Texto (Opcional)
                </label>
                <textarea
                  rows={4}
                  value={formManualContent}
                  onChange={(e) => setFormManualContent(e.target.value)}
                  placeholder="Paso 1: Para comenzar haz clic en...&#10;Paso 2: Llena el formulario con...&#10;Paso 3: Guarda para publicar."
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-4 h-4"
                  />
                  <span>Tutorial Habilitado para los Usuarios</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Guardando...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Guardar Tutorial</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal for User Experience testing */}
      {previewModuleKey && (
        <ModuleHelpModal
          isOpen={Boolean(previewModuleKey)}
          onClose={() => setPreviewModuleKey(null)}
          moduleKey={previewModuleKey}
          onUpdated={fetchTutorials}
        />
      )}
    </div>
  );
};

export default ModuleTutorialsAdminPage;
