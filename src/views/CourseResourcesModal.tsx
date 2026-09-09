'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, Video, FileText, Plus, Trash2, Edit2, Upload, Loader2, Save, MoveUp, MoveDown, CheckCircle,
  Bold, Italic, Underline, List, ListOrdered, Heading, Quote, Code, Eye, AlignLeft, Sparkles
} from 'lucide-react';
import courseService from '../services/courseService';
import { Course, CourseResource } from '../types/course';
import toast from 'react-hot-toast';

interface CourseResourcesModalProps {
  course: Course;
  onClose: () => void;
}

export const CourseResourcesModal: React.FC<CourseResourcesModalProps> = ({ course, onClose }) => {
  const [resources, setResources] = useState<CourseResource[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State para Agregar/Editar Recurso
  const [isAdding, setIsAdding] = useState(false);
  const [editingResource, setEditingResource] = useState<CourseResource | null>(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'video' | 'pdf' | 'text'>('video');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await courseService.getCourse(course.id);
      if (res.status === 'success' && res.data) {
        setResources(res.data.resources || []);
      }
    } catch (err: any) {
      toast.error('Error al cargar los recursos del curso');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [course.id]);

  const resetForm = () => {
    setIsAdding(false);
    setEditingResource(null);
    setTitle('');
    setType('video');
    setContent('');
    setFile(null);
    setShowPreview(false);
  };

  const insertTag = (openTag: string, closeTag: string = '') => {
    if (!closeTag) {
      setContent(prev => prev + openTag);
    } else {
      setContent(prev => prev + `${openTag}Texto formateado${closeTag}`);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('El título del recurso es requerido');
      return;
    }

    if (type !== 'text' && !editingResource && !file) {
      toast.error('Debes seleccionar un archivo para el recurso de video/PDF');
      return;
    }

    if (type === 'text' && !content.trim()) {
      toast.error('El contenido de texto enriquecido es requerido');
      return;
    }

    setSaving(true);
    try {
      if (editingResource) {
        // Actualizar (POST)
        await courseService.updateResource(editingResource.id, {
          title: title.trim(),
          type,
          content: content.trim(),
          file: file || undefined,
        });
        toast.success('Recurso actualizado exitosamente');
      } else {
        // Crear (POST)
        await courseService.uploadResource(course.id, {
          title: title.trim(),
          type,
          content: content.trim(),
          file: file || undefined,
        });
        toast.success('Recurso guardado exitosamente');
      }
      resetForm();
      fetchResources();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al guardar el recurso');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await courseService.deleteResource(id);
      toast.success('Recurso eliminado');
      fetchResources();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al eliminar el recurso');
    } finally {
      setDeletingId(null);
    }
  };

  const startEdit = (resource: CourseResource) => {
    setEditingResource(resource);
    setTitle(resource.title);
    setType(resource.type);
    setContent(resource.content || '');
    setFile(null);
    setShowPreview(false);
    setIsAdding(true);
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === resources.length - 1)) return;

    const newResources = [...resources];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap
    const temp = newResources[index];
    newResources[index] = newResources[targetIndex];
    newResources[targetIndex] = temp;

    // Actualizar sort_order
    const updatedPayload = newResources.map((item, idx) => ({
      id: item.id,
      sort_order: idx + 1,
    }));

    setResources(newResources);

    try {
      await courseService.reorderResources(course.id, updatedPayload);
      toast.success('Orden de recursos actualizado');
    } catch (err) {
      toast.error('Error al reordenar recursos');
      fetchResources();
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return mb >= 1 ? `${mb.toFixed(2)} MB` : `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Recursos Educativos</span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white line-clamp-1">{course.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
          {/* Action Bar */}
          {!isAdding && (
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Lista de Recursos ({resources.length})
              </h3>
              <button
                onClick={() => { resetForm(); setIsAdding(true); }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 transition-all shadow-md shadow-blue-600/20"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Recurso</span>
              </button>
            </div>
          )}

          {/* Form Create/Edit Resource */}
          {isAdding && (
            <form onSubmit={handleSave} className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  {editingResource ? 'Editar Recurso' : 'Nuevo Recurso'}
                </h4>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Cancelar
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Título del Recurso *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej. Introducción al Módulo (Video), Guía PDF o Lectura Teórica"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tipo de Recurso *</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as 'video' | 'pdf' | 'text')}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 outline-none"
                    >
                      <option value="video">Video (MP4, WebM, MOV)</option>
                      <option value="pdf">Documento PDF</option>
                      <option value="text">Texto Enriquecido / Lectura</option>
                    </select>
                  </div>

                  {type !== 'text' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {editingResource ? 'Reemplazar Archivo (Opcional)' : 'Seleccionar Archivo *'}
                      </label>
                      <input
                        type="file"
                        accept={type === 'video' ? 'video/*,video/mp4,video/webm,video/quicktime,video/x-msvideo,video/x-matroska,.mp4,.webm,.mov,.avi,.mkv,.m4v' : 'application/pdf,.pdf'}
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-950 dark:file:text-blue-400 hover:file:bg-blue-100"
                      />
                    </div>
                  )}
                </div>

                {type !== 'text' && editingResource && editingResource.file_name && (
                  <p className="text-[11px] text-slate-400">
                    Archivo actual: <strong>{editingResource.file_name}</strong> ({formatFileSize(editingResource.file_size)})
                  </p>
                )}

                {/* Editor de Texto Enriquecido */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      {type === 'text' ? 'Contenido de Texto Enriquecido *' : 'Notas / Instrucciones Adicionales (Opcional)'}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPreview(!showPreview)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{showPreview ? 'Ver Editor HTML' : 'Ver Vista Previa'}</span>
                    </button>
                  </div>

                  {/* Toolbar de Formato */}
                  {!showPreview && (
                    <div className="flex flex-wrap items-center gap-1.5 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                      <button
                        type="button"
                        onClick={() => insertTag('<b>', '</b>')}
                        title="Negrita"
                        className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        <Bold className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertTag('<i>', '</i>')}
                        title="Cursiva"
                        className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        <Italic className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertTag('<u>', '</u>')}
                        title="Subrayado"
                        className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        <Underline className="w-4 h-4" />
                      </button>
                      <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1" />
                      <button
                        type="button"
                        onClick={() => insertTag('<h2>', '</h2>')}
                        title="Título Principal"
                        className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-xs"
                      >
                        H2
                      </button>
                      <button
                        type="button"
                        onClick={() => insertTag('<h3>', '</h3>')}
                        title="Subtítulo"
                        className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                      >
                        H3
                      </button>
                      <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1" />
                      <button
                        type="button"
                        onClick={() => insertTag('<ul className="list-disc pl-5 space-y-1">\n  <li>', '</li>\n</ul>')}
                        title="Lista con viñetas"
                        className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        <List className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertTag('<ol className="list-decimal pl-5 space-y-1">\n  <li>', '</li>\n</ol>')}
                        title="Lista numerada"
                        className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        <ListOrdered className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertTag('<blockquote className="border-l-4 border-emerald-500 pl-4 py-1 italic text-slate-600 dark:text-slate-400">\n  ', '\n</blockquote>')}
                        title="Cita destacada"
                        className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        <Quote className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertTag('<pre className="bg-slate-900 text-emerald-400 p-3 rounded-xl overflow-x-auto text-xs font-mono">\n  <code>', '</code>\n</pre>')}
                        title="Bloque de código"
                        className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        <Code className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Area de Edición / Vista Previa */}
                  {showPreview ? (
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-[160px] text-sm text-slate-800 dark:text-slate-200 prose dark:prose-invert max-w-none">
                      {content.trim() ? (
                        <div dangerouslySetInnerHTML={{ __html: content }} />
                      ) : (
                        <p className="text-xs text-slate-400 italic">Sin contenido cargado para previsualizar.</p>
                      )}
                    </div>
                  ) : (
                    <textarea
                      rows={6}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder={type === 'text' ? 'Escribe o pega aquí el contenido enriquecido HTML de la clase (puedes usar etiquetas HTML o los botones superiores)...' : 'Instrucciones o notas adicionales para los alumnos...'}
                      className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 outline-none leading-relaxed"
                    />
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 transition-all shadow-md shadow-blue-600/20"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{editingResource ? 'Guardar Cambios' : 'Guardar Recurso'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Resources List */}
          {loading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
              <Video className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-500">Este curso no posee ningún recurso adjunto.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {resources.map((resource, index) => (
                <div
                  key={resource.id}
                  className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xs hover:border-blue-300 dark:hover:border-blue-800 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 ${
                      resource.type === 'video' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400' :
                      resource.type === 'pdf' ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400' :
                      'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                    }`}>
                      {resource.type === 'video' ? <Video className="w-5 h-5" /> : resource.type === 'pdf' ? <FileText className="w-5 h-5" /> : <AlignLeft className="w-5 h-5" />}
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1">{resource.title}</h4>
                      <p className="text-[11px] text-slate-400 truncate">
                        {resource.type === 'text' ? 'Texto Enriquecido' : `${resource.file_name || 'Archivo'} • ${formatFileSize(resource.file_size)}`} • {resource.type.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    {/* Move Controls */}
                    <button
                      disabled={index === 0}
                      onClick={() => handleMove(index, 'up')}
                      title="Mover arriba"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-20 transition-colors"
                    >
                      <MoveUp className="w-4 h-4" />
                    </button>
                    <button
                      disabled={index === resources.length - 1}
                      onClick={() => handleMove(index, 'down')}
                      title="Mover abajo"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-20 transition-colors"
                    >
                      <MoveDown className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => startEdit(resource)}
                      title="Editar"
                      className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      disabled={deletingId === resource.id}
                      onClick={() => handleDelete(resource.id)}
                      title="Eliminar"
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                    >
                      {deletingId === resource.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseResourcesModal;
