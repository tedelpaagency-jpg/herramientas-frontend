'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, CheckSquare, Save, Upload, Trash2, Loader2, Plus, Video, Image as ImageIcon,
  CheckCircle2, Clock, XCircle, AlertCircle, Edit2, FileCheck, X, FileText
} from 'lucide-react';
import activityService from '../services/activityService';
import { ActivityGroup, ActivityItem } from '../types/activity';
import ActivityGroupResourcesModal from './ActivityGroupResourcesModal';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export const ActivityGroupFormPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const groupId = params?.id ? Number(params.id) : null;
  const isEditing = Boolean(groupId);

  // Datos del Grupo
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive' | 'draft'>('active');

  // Imagen de Portada Principal del Grupo
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // Lista de Actividades
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  // Modal para Crear / Editar Actividad
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<ActivityItem | null>(null);
  const [actTitle, setActTitle] = useState('');
  const [actPrimaryType, setActPrimaryType] = useState<'image' | 'video' | 'none'>('none');
  const [actMediaProvider, setActMediaProvider] = useState<'local' | 'youtube' | 'drive'>('local');
  const [actMediaUrl, setActMediaUrl] = useState('');
  const [actContent, setActContent] = useState('');
  const [actSubmissionType, setActSubmissionType] = useState<'none' | 'text' | 'pdf' | 'video' | 'image'>('none');

  // Archivos de la Actividad
  const [actCoverFile, setActCoverFile] = useState<File | null>(null);
  const [actCoverPreview, setActCoverPreview] = useState<string | null>(null);
  const [actMediaFile, setActMediaFile] = useState<File | null>(null);
  const [savingActivity, setSavingActivity] = useState(false);
  const [deletingActId, setDeletingActId] = useState<number | null>(null);

  // Modal de Recursos de Actividad
  const [resourceActivity, setResourceActivity] = useState<ActivityItem | null>(null);

  // Cargar datos si se está editando
  const fetchGroup = async () => {
    if (!groupId) return;
    setLoading(true);
    try {
      const res = await activityService.getActivityGroup(groupId);
      if (res.status === 'success' && res.data) {
        const grp = res.data;
        setTitle(grp.title);
        setDescription(grp.description || '');
        setContent(grp.content || '');
        setStatus(grp.status);
        setMainImage(grp.main_image || null);
        setActivities(grp.activities || []);
      }
    } catch (err: any) {
      toast.error('Error al cargar la información del grupo');
      router.push('/activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroup();
  }, [groupId]);

  // Manejo de carga de imagen de portada del grupo
  const handleGroupCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeGroupCover = () => {
    setCoverFile(null);
    setCoverPreview(null);
    setMainImage(null);
  };

  // Guardar Grupo de Actividades
  const handleSubmitGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('El título del grupo es obligatorio');
      return;
    }

    setSaving(true);
    try {
      let finalImageUrl = mainImage;

      // Si se seleccionó una nueva portada para el grupo
      if (coverFile) {
        const uploadRes = await activityService.uploadGroupImage(coverFile, groupId || undefined);
        finalImageUrl = uploadRes.url;
      }

      if (isEditing && groupId) {
        await activityService.updateActivityGroup(groupId, {
          title,
          description,
          content,
          status,
          main_image: finalImageUrl,
        });
        toast.success('Grupo de actividades actualizado exitosamente');
      } else {
        const res = await activityService.createActivityGroup({
          title,
          description,
          content,
          status,
          main_image: finalImageUrl,
        });
        toast.success('Grupo creado exitosamente. Ahora puedes agregar actividades.');
        router.push(`/activities/${res.data.id}/edit`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al guardar el grupo');
    } finally {
      setSaving(false);
    }
  };

  // Abrir Modal de Formulario de Actividad
  const openActivityModal = (activity?: ActivityItem) => {
    if (activity) {
      setEditingActivity(activity);
      setActTitle(activity.title);
      setActPrimaryType(activity.primary_type);
      setActMediaProvider(activity.media_provider || 'local');
      setActMediaUrl(activity.media_url || '');
      setActContent(activity.content || '');
      setActSubmissionType(activity.submission_type);
      setActCoverPreview(activity.cover_image || null);
    } else {
      setEditingActivity(null);
      setActTitle('');
      setActPrimaryType('none');
      setActMediaProvider('local');
      setActMediaUrl('');
      setActContent('');
      setActSubmissionType('none');
      setActCoverPreview(null);
    }
    setActCoverFile(null);
    setActMediaFile(null);
    setActivityModalOpen(true);
  };

  // Guardar Actividad dentro del Grupo
  const handleSaveActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupId) {
      toast.error('Primero debes guardar el grupo de actividades');
      return;
    }

    if (!actTitle.trim()) {
      toast.error('El título de la actividad es requerido');
      return;
    }

    setSavingActivity(true);
    try {
      if (editingActivity) {
        await activityService.updateActivity(editingActivity.id, {
          title: actTitle,
          primary_type: actPrimaryType,
          submission_type: actSubmissionType,
          media_provider: actPrimaryType === 'video' ? actMediaProvider : undefined,
          media_url: actMediaUrl,
          content: actContent,
          cover_image_file: actCoverFile,
          media_file: actMediaFile,
        });
        toast.success('Actividad actualizada');
      } else {
        await activityService.createActivity(groupId, {
          title: actTitle,
          primary_type: actPrimaryType,
          submission_type: actSubmissionType,
          media_provider: actPrimaryType === 'video' ? actMediaProvider : undefined,
          media_url: actMediaUrl,
          content: actContent,
          cover_image_file: actCoverFile,
          media_file: actMediaFile,
        });
        toast.success('Actividad agregada al grupo');
      }

      setActivityModalOpen(false);
      fetchGroup();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al guardar la actividad');
    } finally {
      setSavingActivity(false);
    }
  };

  // Eliminar Actividad
  const handleDeleteActivity = async (actId: number) => {
    if (!confirm('¿Deseas eliminar esta actividad?')) return;
    setDeletingActId(actId);
    try {
      await activityService.deleteActivity(actId);
      toast.success('Actividad eliminada');
      fetchGroup();
    } catch (err: any) {
      toast.error('Error al eliminar actividad');
    } finally {
      setDeletingActId(null);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-9 h-9 animate-spin text-blue-600" />
        <p className="text-xs font-extrabold">Cargando información del grupo...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/activities"
            className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {isEditing ? 'Editar Grupo de Actividades' : 'Crear Nuevo Grupo de Actividades'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEditing ? 'Modifica los datos del grupo y gestiona sus actividades' : 'Ingresa la información inicial para crear el grupo'}
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmitGroup}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-600/25 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{isEditing ? 'Guardar Cambios' : 'Crear Grupo'}</span>
        </button>
      </div>

      {/* Main Grid: Form Left / Activities Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario de Información del Grupo */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-5">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-blue-600" />
              Información General
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Título del Grupo *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Inducción Comercial 2026..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Estado
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Activo</option>
                  <option value="draft">Borrador</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Descripción Corta
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Breve resumen del objetivo de este grupo de actividades..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Imagen de Portada Principal */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Imagen de Portada
                </label>

                {coverPreview || mainImage ? (
                  <div className="relative w-full h-36 rounded-2xl overflow-hidden group border border-slate-200 dark:border-slate-800">
                    <img
                      src={coverPreview || mainImage!}
                      alt="Portada"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={removeGroupCover}
                        className="p-2 bg-rose-600 text-white rounded-xl hover:bg-rose-500 transition-colors"
                        title="Eliminar imagen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl cursor-pointer bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <Upload className="w-6 h-6 text-slate-400 mb-1" />
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      Subir Imagen de Portada
                    </span>
                    <span className="text-[10px] text-slate-400">PNG, JPG, WEBP hasta 10MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleGroupCoverChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Contenido Teórico Global (ReactQuill) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Contenido Introductorio / Teórico Enriquecido
                </label>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    placeholder="Escribe el texto enriquecido de introducción al grupo..."
                    className="quill-container"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Actividades Asociadas (Timeline / Acordeón) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-indigo-600" />
                  Actividades del Grupo ({activities.length})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Agrega y edita las actividades individuales requeridas para los estudiantes.
                </p>
              </div>

              {isEditing ? (
                <button
                  type="button"
                  onClick={() => openActivityModal()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-extrabold text-xs hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/20 active:scale-95 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Actividad</span>
                </button>
              ) : (
                <span className="text-xs text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800">
                  Guarda el grupo primero para agregar actividades
                </span>
              )}
            </div>

            {/* Listado de Actividades */}
            {activities.length === 0 ? (
              <div className="py-16 text-center bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
                <CheckSquare className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-extrabold text-slate-700 dark:text-slate-300">
                  Aún no hay actividades en este grupo
                </p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Haz clic en "Agregar Actividad" para registrar la primera actividad.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((act, index) => (
                  <div
                    key={act.id}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 font-black text-xs flex items-center justify-center shrink-0">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                            {act.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                              Medio: {act.primary_type}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                              Entrega: {act.submission_type === 'none' ? 'Sin entrega' : act.submission_type}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setResourceActivity(act)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
                        >
                          <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Recursos ({act.resources?.length || 0})</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => openActivityModal(act)}
                          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                          title="Editar actividad"
                        >
                          <Edit2 className="w-4 h-4 text-blue-600" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteActivity(act.id)}
                          disabled={deletingActId === act.id}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Eliminar actividad"
                        >
                          {deletingActId === act.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Crear / Editar Actividad */}
      {activityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {editingActivity ? 'Editar Actividad' : 'Agregar Nueva Actividad'}
              </h3>
              <button
                onClick={() => setActivityModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveActivity} className="p-6 overflow-y-auto flex-1 space-y-4 custom-scrollbar">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Título de la Actividad *
                </label>
                <input
                  type="text"
                  value={actTitle}
                  onChange={(e) => setActTitle(e.target.value)}
                  placeholder="Ej: Actividad 1: Lectura y Análisis..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Imagen Portada de Actividad */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Imagen de Portada de la Actividad
                </label>
                {actCoverPreview ? (
                  <div className="relative w-full h-28 rounded-xl overflow-hidden group border border-slate-200 dark:border-slate-800">
                    <img src={actCoverPreview} alt="Portada" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setActCoverFile(null);
                        setActCoverPreview(null);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        setActCoverFile(f);
                        const r = new FileReader();
                        r.onloadend = () => setActCoverPreview(r.result as string);
                        r.readAsDataURL(f);
                      }
                    }}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white"
                  />
                )}
              </div>

              {/* Selector de Contenido Principal (Video / Imagen / Ninguno) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Contenido Principal
                  </label>
                  <select
                    value={actPrimaryType}
                    onChange={(e) => setActPrimaryType(e.target.value as any)}
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="none">Ninguno (Solo Texto / Recursos)</option>
                    <option value="video">Video</option>
                    <option value="image">Imagen</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Requerimiento / Tipo de Entrega
                  </label>
                  <select
                    value={actSubmissionType}
                    onChange={(e) => setActSubmissionType(e.target.value as any)}
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="none">Sin Entrega (Boton Marcar Completada)</option>
                    <option value="text">Texto Enriquecido / Respuesta Escrita</option>
                    <option value="pdf">Documento PDF</option>
                    <option value="video">Video de Respuesta</option>
                    <option value="image">Imagen</option>
                  </select>
                </div>
              </div>

              {/* Si es Video */}
              {actPrimaryType === 'video' && (
                <div className="space-y-3 p-3.5 rounded-2xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Origen del Video
                    </label>
                    <select
                      value={actMediaProvider}
                      onChange={(e) => setActMediaProvider(e.target.value as any)}
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                    >
                      <option value="local">Archivo Local (MP4)</option>
                      <option value="youtube">YouTube URL</option>
                      <option value="drive">Google Drive URL</option>
                    </select>
                  </div>

                  {actMediaProvider === 'local' ? (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Subir Archivo de Video *
                      </label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setActMediaFile(e.target.files?.[0] || null)}
                        className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        URL del Video ({actMediaProvider}) *
                      </label>
                      <input
                        type="url"
                        value={actMediaUrl}
                        onChange={(e) => setActMediaUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Si es Imagen Principal */}
              {actPrimaryType === 'image' && (
                <div className="p-3.5 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Subir Imagen Principal
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setActMediaFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-600 file:text-white"
                  />
                </div>
              )}

              {/* Texto Enriquecido de la Actividad */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Contenido Teórico / Texto Enriquecido
                </label>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <ReactQuill
                    theme="snow"
                    value={actContent}
                    onChange={setActContent}
                    placeholder="Contenido explicativo de la actividad..."
                    className="quill-container"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActivityModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingActivity}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 disabled:opacity-50 flex items-center gap-2"
                >
                  {savingActivity && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Guardar Actividad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Recursos */}
      {resourceActivity && (
        <ActivityGroupResourcesModal
          activity={resourceActivity}
          onClose={() => setResourceActivity(null)}
          onUpdated={() => fetchGroup()}
        />
      )}
    </div>
  );
};

export default ActivityGroupFormPage;
