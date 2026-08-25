'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, BookOpen, Save, ImagePlus, Upload, Trash2, Loader2, Sparkles, CheckCircle2
} from 'lucide-react';
import courseService from '../services/courseService';
import { Course } from '../types/course';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export const CourseFormPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id ? Number(params.id) : null;
  const isEditing = Boolean(courseId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive' | 'draft'>('active');
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

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
        setImagePreview(c.main_image || null);
      }
    } catch (err: any) {
      toast.error('Error al cargar la información del curso');
      router.push('/courses');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setMainImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('El título del curso es requerido');
      return;
    }

    setSaving(true);
    try {
      let uploadedImageUrl = mainImage;

      // Si se seleccionó una nueva imagen, subirla primero
      if (imageFile) {
        const imgRes = await courseService.uploadMainImage(imageFile, courseId || undefined);
        if (imgRes.url) {
          uploadedImageUrl = imgRes.url;
        }
      }

      const payload = {
        title: title.trim(),
        description: description.trim() || null,
        content: content || null,
        main_image: uploadedImageUrl,
        status,
      };

      if (isEditing && courseId) {
        // Actualizar mediante POST
        await courseService.updateCourse(courseId, payload);
        toast.success('Curso actualizado exitosamente');
      } else {
        // Crear mediante POST
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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Cargando formulario de curso...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
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
              <span>{isEditing ? 'Edición de Curso' : 'Nuevo Curso'}</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left / Primary Column (Title, Description, Rich Text Content) */}
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
                Descripción Corta
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
                Contenido Detallado del Curso (Texto Enriquecido)
              </label>
              <div className="bg-white dark:bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  placeholder="Escribe el contenido teórico, instrucciones o temario del curso..."
                  className="min-h-[250px] text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Right Column (Main Image, Status, Meta) */}
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

            {/* Main Image Upload */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Imagen Principal de Portada
              </label>

              {imagePreview ? (
                <div className="relative rounded-2xl overflow-hidden group border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 h-52">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <label className="p-3 rounded-2xl bg-white/20 hover:bg-white/40 text-white cursor-pointer transition-colors backdrop-blur-xs">
                      <Upload className="w-5 h-5" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="p-3 rounded-2xl bg-rose-600/80 hover:bg-rose-600 text-white transition-colors backdrop-blur-xs"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-52 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-blue-500 bg-slate-50 dark:bg-slate-950 cursor-pointer transition-all p-4 text-center group">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <ImagePlus className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">Subir imagen principal</span>
                  <span className="text-[11px] text-slate-400 mt-1">PNG, JPG, WEBP hasta 10MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CourseFormPage;
