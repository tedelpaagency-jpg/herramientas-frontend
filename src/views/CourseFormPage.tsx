'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, BookOpen, Save, ImagePlus, Upload, Trash2, Loader2, Sparkles, CheckCircle2,
  GripVertical, Plus, Video, FileText, AlignLeft, Bold, Italic, Underline, List, ListOrdered,
  Quote, Code, Eye, Edit2, MoveUp, MoveDown, Layers, Check, LayoutGrid, AlertCircle, File, FolderPlus, Folder, FolderOpen, Clock
} from 'lucide-react';
import courseService from '../services/courseService';
import { Course, CourseModule, CourseSection, CourseSectionMaterial } from '../types/course';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export const CourseFormPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id ? Number(params.id) : null;
  const isEditing = Boolean(courseId);

  // Información del Curso
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive' | 'draft'>('active');

  // Las 3 Imágenes de Portada
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [imageFile1, setImageFile1] = useState<File | null>(null);
  const [imagePreview1, setImagePreview1] = useState<string | null>(null);

  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [imageFile2, setImageFile2] = useState<File | null>(null);
  const [imagePreview2, setImagePreview2] = useState<string | null>(null);

  const [thumbImage, setThumbImage] = useState<string | null>(null);
  const [imageFile3, setImageFile3] = useState<File | null>(null);
  const [imagePreview3, setImagePreview3] = useState<string | null>(null);

  // Secciones del Curso (Timeline)
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [sections, setSections] = useState<CourseSection[]>([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  // Formulario Inline para Crear/Editar Módulo
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [editingModule, setEditingModule] = useState<CourseModule | null>(null);
  const [modTitle, setModTitle] = useState('');
  const [savingModule, setSavingModule] = useState(false);
  const [deletingModId, setDeletingModId] = useState<number | null>(null);

  // Drag & Drop State para Secciones
  const [draggedSecIndex, setDraggedSecIndex] = useState<number | null>(null);
  const [dragOverSecIndex, setDragOverSecIndex] = useState<number | null>(null);

  // Formulario Inline para Crear/Editar Sección
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [targetModuleId, setTargetModuleId] = useState<number | null>(null);
  const [editingSection, setEditingSection] = useState<CourseSection | null>(null);
  const [secTitle, setSecTitle] = useState('');
  const [secGroupName, setSecGroupName] = useState('');
  const [secDuration, setSecDuration] = useState('');
  const [secContent, setSecContent] = useState('');
  const [secPrimaryType, setSecPrimaryType] = useState<'video' | 'pdf' | 'file'>('video');
  const [secPrimaryFile, setSecPrimaryFile] = useState<File | null>(null);
  const [secCoverFile, setSecCoverFile] = useState<File | null>(null);
  const [secCoverPreview, setSecCoverPreview] = useState<string | null>(null);
  const [showSecPreview, setShowSecPreview] = useState(false);
  const [savingSection, setSavingSection] = useState(false);
  const [deletingSecId, setDeletingSecId] = useState<number | null>(null);

  // Formulario Inline para Material de Sección
  const [activeMaterialSecId, setActiveMaterialSecId] = useState<number | null>(null);
  const [editingMaterial, setEditingMaterial] = useState<CourseSectionMaterial | null>(null);
  const [matTitle, setMatTitle] = useState('');
  const [matType, setMatType] = useState<'video' | 'pdf' | 'file'>('video');
  const [matFile, setMatFile] = useState<File | null>(null);
  const [savingMaterial, setSavingMaterial] = useState(false);
  const [deletingMatId, setDeletingMatId] = useState<number | null>(null);

  useEffect(() => {
    if (isEditing && courseId) {
      fetchCourseDetail();
    }
  }, [courseId]);

  const fetchCourseDetail = async () => {
    setLoading(true);
    try {
      const res = await courseService.getCourse(courseId!);
      if (res.status === 'success' && res.data) {
        const c = res.data;
        setTitle(c.title);
        setDescription(c.description || '');
        setContent(c.content || '');
        setStatus(c.status || 'active');
        
        setMainImage(c.main_image || null);
        setImagePreview1(c.main_image || null);

        setBannerImage(c.banner_image || null);
        setImagePreview2(c.banner_image || null);

        setThumbImage(c.thumb_image || null);
        setImagePreview3(c.thumb_image || null);
        
        // Cargar módulos y secciones
        setModules(c.modules || []);
        setSections(c.sections || []);
      }
    } catch (err: any) {
      toast.error('Error al cargar la información del curso');
      router.push('/courses');
    } finally {
      setLoading(false);
    }
  };

  // Manejadores para las 3 imágenes de portada
  const handleImageChange = (slot: 1 | 2 | 3, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (slot === 1) {
        setImageFile1(file);
        setImagePreview1(reader.result as string);
      } else if (slot === 2) {
        setImageFile2(file);
        setImagePreview2(reader.result as string);
      } else {
        setImageFile3(file);
        setImagePreview3(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (slot: 1 | 2 | 3) => {
    if (slot === 1) {
      setImageFile1(null);
      setImagePreview1(null);
      setMainImage(null);
    } else if (slot === 2) {
      setImageFile2(null);
      setImagePreview2(null);
      setBannerImage(null);
    } else {
      setImageFile3(null);
      setImagePreview3(null);
      setThumbImage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('El título del curso es requerido');
      return;
    }

    setSaving(true);
    try {
      let uploadedMainImageUrl = mainImage;
      let uploadedBannerImageUrl = bannerImage;
      let uploadedThumbImageUrl = thumbImage;

      if (imageFile1) {
        const imgRes = await courseService.uploadMainImage(imageFile1, courseId || undefined);
        if (imgRes.url) {
          uploadedMainImageUrl = imgRes.url;
        }
      }

      if (imageFile2) {
        const imgRes = await courseService.uploadMainImage(imageFile2, courseId || undefined);
        if (imgRes.url) {
          uploadedBannerImageUrl = imgRes.url;
        }
      }

      if (imageFile3) {
        const imgRes = await courseService.uploadMainImage(imageFile3, courseId || undefined);
        if (imgRes.url) {
          uploadedThumbImageUrl = imgRes.url;
        }
      }

      const payload = {
        title: title.trim(),
        description: description.trim() || null,
        content: content || null,
        main_image: uploadedMainImageUrl,
        banner_image: uploadedBannerImageUrl,
        thumb_image: uploadedThumbImageUrl,
        status,
      };

      if (isEditing && courseId) {
        await courseService.updateCourse(courseId, payload);
        toast.success('Curso actualizado exitosamente');
      } else {
        await courseService.createCourse(payload);
        toast.success('Curso creado exitosamente');
      }

      router.push('/courses');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al guardar el curso');
    } finally {
      setSaving(false);
    }
  };

  // --- MÓDULOS & SECCIONES ---
  const resetModuleForm = () => {
    setIsAddingModule(false);
    setEditingModule(null);
    setModTitle('');
  };

  const startEditModule = (mod: CourseModule) => {
    setEditingModule(mod);
    setModTitle(mod.title);
    setIsAddingModule(true);
  };

  const handleSaveModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modTitle.trim()) {
      toast.error('El título del módulo es requerido');
      return;
    }
    if (!courseId) {
      toast.error('Guarda primero la información básica del curso para agregar módulos.');
      return;
    }

    setSavingModule(true);
    try {
      if (editingModule) {
        await courseService.updateModule(editingModule.id, { title: modTitle.trim() });
        toast.success('Módulo actualizado');
      } else {
        await courseService.createModule(courseId, { title: modTitle.trim() });
        toast.success('Módulo creado exitosamente');
      }
      resetModuleForm();
      fetchCourseDetail();
    } catch (err: any) {
      toast.error('Error al guardar el módulo');
    } finally {
      setSavingModule(false);
    }
  };

  const handleDeleteModule = async (moduleId: number) => {
    if (!confirm('¿Estás seguro de eliminar este módulo?')) return;
    setDeletingModId(moduleId);
    try {
      await courseService.deleteModule(moduleId);
      toast.success('Módulo eliminado');
      fetchCourseDetail();
    } catch (err: any) {
      toast.error('Error al eliminar el módulo');
    } finally {
      setDeletingModId(null);
    }
  };

  const resetSectionForm = () => {
    setIsAddingSection(false);
    setTargetModuleId(null);
    setEditingSection(null);
    setSecTitle('');
    setSecGroupName('');
    setSecDuration('');
    setSecContent('');
    setSecPrimaryType('video');
    setSecPrimaryFile(null);
    setSecCoverFile(null);
    setSecCoverPreview(null);
    setShowSecPreview(false);
  };

  const startAddSectionToModule = (moduleId?: number) => {
    resetSectionForm();
    if (moduleId) setTargetModuleId(moduleId);
    setIsAddingSection(true);
  };

  const formatImageUrl = (url?: string | null) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    return `${baseUrl}/${url.replace(/^\//, '')}`;
  };

  const startEditSection = (sec: CourseSection) => {
    setEditingSection(sec);
    setTargetModuleId(sec.course_module_id || null);
    setSecTitle(sec.title);
    setSecGroupName(sec.group_name || '');
    setSecDuration(sec.duration || '');
    setSecContent(sec.content || '');
    setSecCoverPreview(formatImageUrl(sec.cover_image));
    setSecCoverFile(null);
    const firstMat = sec.materials?.[0];
    if (firstMat) {
      setSecPrimaryType(firstMat.type);
    }
    setSecPrimaryFile(null);
    setShowSecPreview(false);
    setIsAddingSection(true);
  };

  const handleSecCoverChange = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setSecCoverFile(file);
      setSecCoverPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const insertFormatTag = (openTag: string, closeTag: string = '') => {
    if (!closeTag) {
      setSecContent(prev => prev + openTag);
    } else {
      setSecContent(prev => prev + `${openTag}Texto formateado${closeTag}`);
    }
  };

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secTitle.trim()) {
      toast.error('El título de la sección es requerido');
      return;
    }

    if (!courseId) {
      toast.error('Guarda primero la información básica del curso para agregar secciones.');
      return;
    }

    setSavingSection(true);
    try {
      const payload = {
        title: secTitle.trim(),
        course_module_id: targetModuleId || undefined,
        group_name: secGroupName.trim() || undefined,
        duration: secDuration.trim() || undefined,
        content: secContent.trim(),
        primary_type: secPrimaryType,
        file: secPrimaryFile || undefined,
        cover_image_file: secCoverFile || undefined,
      };

      if (editingSection) {
        await courseService.updateSection(editingSection.id, payload);
        toast.success('Sección actualizada');
      } else {
        await courseService.createSection(courseId, payload);
        toast.success('Sección agregada al módulo');
      }
      resetSectionForm();
      fetchCourseDetail();
    } catch (err: any) {
      toast.error('Error al guardar la sección');
    } finally {
      setSavingSection(false);
    }
  };

  const handleDeleteSection = async (id: number) => {
    setDeletingSecId(id);
    try {
      await courseService.deleteSection(id);
      toast.success('Sección eliminada');
      fetchCourseDetail();
    } catch (err) {
      toast.error('Error al eliminar la sección');
    } finally {
      setDeletingSecId(null);
    }
  };

  // Drag & Drop Handlers para Secciones
  const handleDragStartSec = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
    setDraggedSecIndex(index);
  };

  const handleDragOverSec = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverSecIndex !== index) {
      setDragOverSecIndex(index);
    }
  };

  const handleDropSec = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndexStr = e.dataTransfer.getData('text/plain');
    const dragIndex = dragIndexStr ? parseInt(dragIndexStr, 10) : draggedSecIndex;

    if (dragIndex === null || dragIndex === undefined || dragIndex === dropIndex) {
      setDraggedSecIndex(null);
      setDragOverSecIndex(null);
      return;
    }

    const updated = [...sections];
    const [removed] = updated.splice(dragIndex, 1);
    updated.splice(dropIndex, 0, removed);

    const reorderedPayload = updated.map((item, idx) => ({
      id: item.id,
      sort_order: idx + 1,
    }));

    setSections(updated);
    setDraggedSecIndex(null);
    setDragOverSecIndex(null);

    if (courseId) {
      try {
        await courseService.reorderSections(courseId, reorderedPayload);
        toast.success('Orden de secciones actualizado');
      } catch (err) {
        toast.error('Error al reordenar');
        fetchCourseDetail();
      }
    }
  };

  // --- MATERIALES DE SECCIÓN ---
  const resetMaterialForm = () => {
    setActiveMaterialSecId(null);
    setEditingMaterial(null);
    setMatTitle('');
    setMatType('video');
    setMatFile(null);
  };

  const startEditMaterial = (secId: number, mat: CourseSectionMaterial) => {
    setActiveMaterialSecId(secId);
    setEditingMaterial(mat);
    setMatTitle(mat.title);
    setMatType(mat.type);
    setMatFile(null);
  };

  const handleSaveMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matTitle.trim() || !activeMaterialSecId) {
      toast.error('El título del material es requerido');
      return;
    }

    if (!editingMaterial && !matFile) {
      toast.error('Debes seleccionar un archivo (video o PDF)');
      return;
    }

    setSavingMaterial(true);
    try {
      if (editingMaterial) {
        await courseService.updateMaterial(editingMaterial.id, {
          title: matTitle.trim(),
          type: matType,
          file: matFile || undefined,
        });
        toast.success('Material actualizado');
      } else {
        await courseService.uploadMaterial(activeMaterialSecId, {
          title: matTitle.trim(),
          type: matType,
          file: matFile!,
        });
        toast.success('Material adjuntado a la sección');
      }
      resetMaterialForm();
      fetchCourseDetail();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al guardar el material');
    } finally {
      setSavingMaterial(false);
    }
  };

  const handleDeleteMaterial = async (id: number) => {
    setDeletingMatId(id);
    try {
      await courseService.deleteMaterial(id);
      toast.success('Material eliminado');
      fetchCourseDetail();
    } catch (err) {
      toast.error('Error al eliminar el material');
    } finally {
      setDeletingMatId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Cargando datos del curso y secciones...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/courses"
            className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Edición de Curso & Secciones' : 'Nuevo Curso'}</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {isEditing ? `Editar: ${title || 'Curso'}` : 'Crear Nuevo Curso'}
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/30 active:scale-95 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          <span>{isEditing ? 'Guardar Cambios' : 'Publicar Curso'}</span>
        </button>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECCIÓN 1: DATOS PRINCIPALES Y PORTADAS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Izquierda (Título, Descripción, Editor Teórico) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Título del Curso *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Capacitación en Atención al Cliente y Políticas Internas"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                required
              />
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Descripción Corta / Resumen
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Resumen ejecutivo o descripción general de lo que aprenderá el colaborador..."
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
            </div>

            {/* Content (Rich Text Editor with ReactQuill) */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Contenido Teórico Detallado (Texto Enriquecido General)
              </label>
              <div className="bg-white dark:bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  placeholder="Escribe el contenido teórico, instrucciones o temario del curso..."
                  className="min-h-[200px] text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Columna Derecha (Estado y Portadas) */}
          <div className="space-y-6">
            {/* Status Selection */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Estado del Curso
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              >
                <option value="active">Activo (Disponible para asignación)</option>
                <option value="draft">Borrador (Solo visible para admin)</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>

            {/* SECCIÓN: 3 IMÁGENES DE PORTADA DEL CURSO */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                    Galería de Portadas (3 Imágenes)
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-slate-400">3 Formatos</span>
              </div>

              {/* Slot 1: Portada Principal (16:9) */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>1. Portada Principal (Hero 16:9) *</span>
                  {imagePreview1 && <span className="text-emerald-500 font-extrabold text-[10px]">Cargada</span>}
                </span>
                {imagePreview1 ? (
                  <div className="relative rounded-2xl overflow-hidden group border border-slate-200 dark:border-slate-800 h-36 bg-slate-100 dark:bg-slate-950">
                    <img src={imagePreview1} alt="Portada Principal" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <label className="p-2 rounded-xl bg-white/20 hover:bg-white/40 text-white cursor-pointer transition-colors backdrop-blur-xs">
                        <Upload className="w-4 h-4" />
                        <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageChange(1, e.target.files[0])} className="hidden" />
                      </label>
                      <button type="button" onClick={() => removeImage(1)} className="p-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white backdrop-blur-xs">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-28 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-blue-500 bg-slate-50 dark:bg-slate-950 cursor-pointer transition-all p-3 text-center group">
                    <ImagePlus className="w-5 h-5 text-blue-600 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300">Portada Principal (16:9)</span>
                    <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageChange(1, e.target.files[0])} className="hidden" />
                  </label>
                )}
              </div>

              {/* Slot 2: Banner Horizontal */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>2. Banner Horizontal (Wide / Promo)</span>
                  {imagePreview2 && <span className="text-emerald-500 font-extrabold text-[10px]">Cargado</span>}
                </span>
                {imagePreview2 ? (
                  <div className="relative rounded-2xl overflow-hidden group border border-slate-200 dark:border-slate-800 h-28 bg-slate-100 dark:bg-slate-950">
                    <img src={imagePreview2} alt="Banner Horizontal" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <label className="p-2 rounded-xl bg-white/20 hover:bg-white/40 text-white cursor-pointer backdrop-blur-xs">
                        <Upload className="w-4 h-4" />
                        <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageChange(2, e.target.files[0])} className="hidden" />
                      </label>
                      <button type="button" onClick={() => removeImage(2)} className="p-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white backdrop-blur-xs">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-24 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-blue-500 bg-slate-50 dark:bg-slate-950 cursor-pointer transition-all p-3 text-center group">
                    <ImagePlus className="w-5 h-5 text-indigo-600 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300">Banner Horizontal</span>
                    <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageChange(2, e.target.files[0])} className="hidden" />
                  </label>
                )}
              </div>

              {/* Slot 3: Miniatura / Móvil */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>3. Miniatura Promocional (Square/Mobile)</span>
                  {imagePreview3 && <span className="text-emerald-500 font-extrabold text-[10px]">Cargada</span>}
                </span>
                {imagePreview3 ? (
                  <div className="relative rounded-2xl overflow-hidden group border border-slate-200 dark:border-slate-800 h-28 bg-slate-100 dark:bg-slate-950">
                    <img src={imagePreview3} alt="Miniatura" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <label className="p-2 rounded-xl bg-white/20 hover:bg-white/40 text-white cursor-pointer backdrop-blur-xs">
                        <Upload className="w-4 h-4" />
                        <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageChange(3, e.target.files[0])} className="hidden" />
                      </label>
                      <button type="button" onClick={() => removeImage(3)} className="p-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white backdrop-blur-xs">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-24 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-blue-500 bg-slate-50 dark:bg-slate-950 cursor-pointer transition-all p-3 text-center group">
                    <ImagePlus className="w-5 h-5 text-cyan-600 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300">Miniatura Móvil (Card)</span>
                    <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageChange(3, e.target.files[0])} className="hidden" />
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN 2: MÓDULOS Y SECCIONES DEL CURSO */}
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase text-emerald-600 dark:text-[#00e699] tracking-widest">
                <Layers className="w-4 h-4" />
                <span>Ruta del Curso (Módulos & Secciones)</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Módulos ({modules.length}) & Secciones del Programa
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Crea Módulos principales y agrega dentro sus Secciones con portada propia, video/documento principal y carpeta de recursos adjuntos.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {!isAddingModule && !isAddingSection && (
                <>
                  <button
                    type="button"
                    onClick={() => { resetModuleForm(); setIsAddingModule(true); }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md shadow-indigo-600/20 active:scale-95"
                  >
                    <FolderPlus className="w-4 h-4" />
                    <span>+ Nuevo Módulo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => startAddSectionToModule()}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/20 active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Nueva Sección</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Formulario Inline de Crear/Editar Módulo */}
          {isAddingModule && (
            <div className="bg-indigo-50/50 dark:bg-indigo-950/30 p-6 rounded-3xl border border-indigo-200 dark:border-indigo-800/50 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-indigo-200 dark:border-indigo-800/50 pb-3">
                <h3 className="text-sm font-black text-indigo-900 dark:text-indigo-200">
                  {editingModule ? 'Editar Módulo Principal' : 'Agregar Nuevo Módulo al Curso'}
                </h3>
                <button
                  type="button"
                  onClick={resetModuleForm}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Cancelar
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nombre del Módulo Principal *
                  </label>
                  <input
                    type="text"
                    value={modTitle}
                    onChange={(e) => setModTitle(e.target.value)}
                    placeholder="Ej. Módulo 1: Introducción a la Plataforma"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={resetModuleForm}
                    className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveModule}
                    disabled={savingModule}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition-all shadow-md"
                  >
                    {savingModule ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>{editingModule ? 'Guardar Módulo' : 'Crear Módulo'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Formulario Inline de Creación / Edición de Sección */}
          {isAddingSection && (
            <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  {editingSection ? 'Editar Sección' : 'Agregar Nueva Sección'}
                </h3>
                <button
                  type="button"
                  onClick={resetSectionForm}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Cancelar
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Módulo Principal (Seleccionar)
                    </label>
                    <select
                      value={targetModuleId || ''}
                      onChange={(e) => {
                        const val = e.target.value ? Number(e.target.value) : null;
                        setTargetModuleId(val);
                        const selectedMod = modules.find(m => m.id === val);
                        if (selectedMod) setSecGroupName(selectedMod.title);
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    >
                      <option value="">-- Sin Módulo / Sección General --</option>
                      {modules.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Título de la Sección *</label>
                    <input
                      type="text"
                      value={secTitle}
                      onChange={(e) => setSecTitle(e.target.value)}
                      placeholder="Ej. Lección 1.1: Políticas de Uso y Bienvenida"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Portada e Imagen de la Sección + Duración */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Portada de la Sección (Miniatura)
                    </label>
                    <div className="flex items-center gap-3">
                      {secCoverPreview ? (
                        <img src={secCoverPreview} alt="Portada" className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                          <ImagePlus className="w-5 h-5" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleSecCoverChange(e.target.files[0])}
                        className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-blue-100 file:text-blue-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Formato Principal *</label>
                    <select
                      value={secPrimaryType}
                      onChange={(e) => setSecPrimaryType(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white"
                    >
                      <option value="video">Video (MP4, WebM, MOV)</option>
                      <option value="pdf">Documento PDF</option>
                      <option value="file">Archivo General</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Duración del Video (ej. 12:45 min)
                    </label>
                    <input
                      type="text"
                      value={secDuration}
                      onChange={(e) => setSecDuration(e.target.value)}
                      placeholder="Ej. 12:45 min o 08:30"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Subida del Archivo Principal */}
                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <label className="block text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                    {editingSection ? 'Reemplazar Archivo Principal de la Sección (Opcional)' : 'Subir Archivo Principal de la Sección (Opcional)'}
                  </label>
                  <input
                    type="file"
                    accept={secPrimaryType === 'video' ? 'video/*' : secPrimaryType === 'pdf' ? 'application/pdf' : '*/*'}
                    onChange={(e) => setSecPrimaryFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-100 file:text-emerald-700 dark:file:bg-emerald-950 dark:file:text-emerald-300"
                  />
                </div>

                {/* Editor de Texto Enriquecido para la Sección */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Contenido de Texto Enriquecido de la Sección
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowSecPreview(!showSecPreview)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-[#00e699] hover:underline"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{showSecPreview ? 'Editar HTML' : 'Ver Vista Previa'}</span>
                    </button>
                  </div>

                  {/* Toolbar de Formato */}
                  {!showSecPreview && (
                    <div className="flex flex-wrap items-center gap-1.5 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                      <button type="button" onClick={() => insertFormatTag('<b>', '</b>')} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" title="Negrita"><Bold className="w-4 h-4" /></button>
                      <button type="button" onClick={() => insertFormatTag('<i>', '</i>')} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" title="Cursiva"><Italic className="w-4 h-4" /></button>
                      <button type="button" onClick={() => insertFormatTag('<u>', '</u>')} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" title="Subrayado"><Underline className="w-4 h-4" /></button>
                      <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1" />
                      <button type="button" onClick={() => insertFormatTag('<h2>', '</h2>')} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-xs">H2</button>
                      <button type="button" onClick={() => insertFormatTag('<h3>', '</h3>')} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs">H3</button>
                      <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1" />
                      <button type="button" onClick={() => insertFormatTag('<ul className="list-disc pl-5 space-y-1">\n  <li>', '</li>\n</ul>')} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" title="Lista con viñetas"><List className="w-4 h-4" /></button>
                      <button type="button" onClick={() => insertFormatTag('<ol className="list-decimal pl-5 space-y-1">\n  <li>', '</li>\n</ol>')} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" title="Lista numerada"><ListOrdered className="w-4 h-4" /></button>
                      <button type="button" onClick={() => insertFormatTag('<blockquote className="border-l-4 border-emerald-500 pl-4 py-1 italic text-slate-600 dark:text-slate-400">\n  ', '\n</blockquote>')} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" title="Cita"><Quote className="w-4 h-4" /></button>
                      <button type="button" onClick={() => insertFormatTag('<pre className="bg-slate-900 text-emerald-400 p-3 rounded-xl overflow-x-auto text-xs font-mono">\n  <code>', '</code>\n</pre>')} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" title="Código"><Code className="w-4 h-4" /></button>
                    </div>
                  )}

                  {showSecPreview ? (
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-[140px] text-sm text-slate-800 dark:text-slate-200 prose dark:prose-invert max-w-none">
                      {secContent.trim() ? (
                        <div dangerouslySetInnerHTML={{ __html: secContent }} />
                      ) : (
                        <p className="text-xs text-slate-400 italic">Sin contenido enriquecido cargado para la sección.</p>
                      )}
                    </div>
                  ) : (
                    <textarea
                      rows={5}
                      value={secContent}
                      onChange={(e) => setSecContent(e.target.value)}
                      placeholder="Escribe la explicación teórica, lección o contenido HTML de esta sección..."
                      className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 outline-none leading-relaxed"
                    />
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetSectionForm}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveSection}
                  disabled={savingSection}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-all shadow-md shadow-emerald-600/20"
                >
                  {savingSection ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{editingSection ? 'Guardar Sección' : 'Agregar Sección'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Timeline de Módulos & Secciones */}
          {modules.length === 0 && sections.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
              <FolderPlus className="w-10 h-10 text-slate-400 mx-auto" />
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Esta ruta no posee módulos ni secciones registradas aún.</p>
                <p className="text-xs text-slate-400 mt-1">Haz clic en "+ Nuevo Módulo" para estructurar tu programa y agregarle secciones dentro.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {modules.map((mod, mIdx) => {
                const modSections = sections.filter(s => s.course_module_id === mod.id);

                return (
                  <div key={mod.id} className="bg-slate-50/70 dark:bg-slate-950/60 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-5">
                    {/* Header del Módulo Principal */}
                    <div className="flex items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-xs">
                          M{mIdx + 1}
                        </span>
                        <div>
                          <h3 className="text-base font-black text-slate-900 dark:text-white">
                            {mod.title}
                          </h3>
                          <p className="text-[11px] text-slate-400 font-semibold">
                            {modSections.length} sección(es) dentro de este módulo
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => startAddSectionToModule(mod.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-[#00e699] font-bold text-xs hover:bg-emerald-500/20 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Sección</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => startEditModule(mod)}
                          className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteModule(mod.id)}
                          disabled={deletingModId === mod.id}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                        >
                          {deletingModId === mod.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Timeline de Secciones dentro de este Módulo */}
                    {modSections.length === 0 ? (
                      <div className="py-4 text-center text-xs font-medium text-slate-400 italic">
                        Este módulo no tiene secciones aún. Haz clic en "+ Sección" para agregar una.
                      </div>
                    ) : (
                      <div className="relative pl-6 space-y-4 border-l-2 border-emerald-500/30 dark:border-emerald-500/20 ml-2">
                        {modSections.map((section, secIdx) => {
                          const materials = section.materials || [];
                          return (
                            <div key={section.id} className="relative group bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
                              <div className="absolute -left-[31px] top-4 w-5 h-5 rounded-full bg-white dark:bg-slate-900 border-2 border-emerald-500 text-emerald-600 dark:text-[#00e699] flex items-center justify-center text-[9px] font-black">
                                {secIdx + 1}
                              </div>

                              <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-2">
                                <div className="flex items-center gap-3 min-w-0">
                                  {section.cover_image ? (
                                    <img
                                      src={formatImageUrl(section.cover_image)!}
                                      alt={section.title}
                                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shrink-0 shadow-2xs"
                                    />
                                  ) : (
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 font-extrabold text-xs shadow-2xs">
                                      {section.title.charAt(0).toUpperCase()}
                                    </div>
                                  )}

                                  <div className="min-w-0">
                                    <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">
                                      {section.title}
                                    </h4>
                                    {(section.duration || materials[0]?.duration) && (
                                      <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        <span>{section.duration || materials[0]?.duration}</span>
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => startEditSection(section)}
                                    className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteSection(section.id)}
                                    disabled={deletingSecId === section.id}
                                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                                  >
                                    {deletingSecId === section.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default CourseFormPage;
