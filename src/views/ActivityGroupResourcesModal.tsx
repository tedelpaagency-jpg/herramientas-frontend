'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, Video, FileText, Plus, Trash2, Upload, Loader2, Save, Link as LinkIcon, Image as ImageIcon, FileCheck
} from 'lucide-react';
import activityService from '../services/activityService';
import { ActivityItem, ActivityItemResource } from '../types/activity';
import toast from 'react-hot-toast';

interface ActivityGroupResourcesModalProps {
  activity: ActivityItem;
  onClose: () => void;
  onUpdated?: () => void;
}

export const ActivityGroupResourcesModal: React.FC<ActivityGroupResourcesModalProps> = ({ activity, onClose, onUpdated }) => {
  const [resources, setResources] = useState<ActivityItemResource[]>(activity.resources || []);
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'pdf' | 'image' | 'video' | 'file'>('pdf');
  const [sourceType, setSourceType] = useState<'local' | 'url'>('local');
  const [videoProvider, setVideoProvider] = useState<'local' | 'youtube' | 'drive'>('local');
  const [externalUrl, setExternalUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    setResources(activity.resources || []);
  }, [activity]);

  const resetForm = () => {
    setIsAdding(false);
    setTitle('');
    setType('pdf');
    setSourceType('local');
    setVideoProvider('local');
    setExternalUrl('');
    setFile(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('El título del recurso es requerido');
      return;
    }

    if (sourceType === 'local' && !file) {
      toast.error('Debes seleccionar un archivo local');
      return;
    }

    if (sourceType === 'url' && !externalUrl.trim()) {
      toast.error('Debes ingresar la URL externa del recurso');
      return;
    }

    setSaving(true);
    try {
      const res = await activityService.uploadResource(activity.id, {
        title,
        type,
        source_type: sourceType,
        video_provider: type === 'video' ? videoProvider : undefined,
        external_url: sourceType === 'url' ? externalUrl : undefined,
        file: sourceType === 'local' ? file : null,
      });

      toast.success('Recurso agregado exitosamente');
      setResources((prev) => [...prev, res.data]);
      resetForm();
      if (onUpdated) onUpdated();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al guardar el recurso');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (resourceId: number) => {
    if (!confirm('¿Estás seguro de eliminar este recurso?')) return;
    setDeletingId(resourceId);
    try {
      await activityService.deleteResource(resourceId);
      toast.success('Recurso eliminado');
      setResources((prev) => prev.filter((r) => r.id !== resourceId));
      if (onUpdated) onUpdated();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al eliminar recurso');
    } finally {
      setDeletingId(null);
    }
  };

  const getResourceIcon = (resType: string) => {
    switch (resType) {
      case 'video':
        return <Video className="w-5 h-5 text-purple-600" />;
      case 'pdf':
        return <FileText className="w-5 h-5 text-rose-600" />;
      case 'image':
        return <ImageIcon className="w-5 h-5 text-amber-600" />;
      default:
        return <FileCheck className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 rounded-2xl">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Recursos de la Actividad
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                {activity.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300">
              Archivos y Enlaces Adjuntos ({resources.length})
            </h4>
            {!isAdding && (
              <button
                onClick={() => setIsAdding(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/20 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Agregar Recurso
              </button>
            )}
          </div>

          {/* Add Form */}
          {isAdding && (
            <form onSubmit={handleSave} className="p-4 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/50 space-y-4 animate-in slide-in-from-top-2">
              <div className="flex items-center justify-between">
                <h5 className="font-extrabold text-xs text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">
                  Nuevo Recurso
                </h5>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400"
                >
                  Cancelar
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Título del Recurso *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej: Manual de Lectura.pdf, Video explicativo..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Tipo de Recurso
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as any)}
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="pdf">Documento PDF</option>
                      <option value="image">Imagen</option>
                      <option value="video">Video</option>
                      <option value="file">Otro Archivo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Origen del Recurso
                    </label>
                    <select
                      value={sourceType}
                      onChange={(e) => setSourceType(e.target.value as any)}
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="local">Subida Local (Archivo)</option>
                      <option value="url">Enlace URL Externo</option>
                    </select>
                  </div>
                </div>

                {type === 'video' && sourceType === 'url' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Proveedor de Video
                    </label>
                    <select
                      value={videoProvider}
                      onChange={(e) => setVideoProvider(e.target.value as any)}
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="youtube">YouTube</option>
                      <option value="drive">Google Drive</option>
                      <option value="local">Enlace Directo</option>
                    </select>
                  </div>
                )}

                {sourceType === 'local' ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Adjuntar Archivo Local *
                    </label>
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      URL del Recurso *
                    </label>
                    <div className="relative">
                      <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="url"
                        value={externalUrl}
                        onChange={(e) => setExternalUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-indigo-200/60 dark:border-indigo-900/40">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-500 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Guardar Recurso
                </button>
              </div>
            </form>
          )}

          {/* Resources List */}
          {resources.length === 0 ? (
            <div className="py-10 text-center bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
              <FileCheck className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                Esta actividad no tiene recursos adicionales.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
              {resources.map((res) => (
                <div
                  key={res.id}
                  className="p-3.5 flex items-center justify-between bg-white dark:bg-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                      {getResourceIcon(res.type)}
                    </div>
                    <div>
                      <p className="font-extrabold text-xs text-slate-900 dark:text-white">
                        {res.title}
                      </p>
                      <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                        {res.source_type === 'url' ? 'Enlace URL' : 'Archivo Local'} • {res.type}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDelete(res.id)}
                      disabled={deletingId === res.id}
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Eliminar recurso"
                    >
                      {deletingId === res.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-extrabold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityGroupResourcesModal;
