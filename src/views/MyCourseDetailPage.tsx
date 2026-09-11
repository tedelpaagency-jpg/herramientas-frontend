'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, BookOpen, Video, FileText, CheckCircle2, PlayCircle, Download, 
  ExternalLink, Loader2, Sparkles, AlertCircle, Clock, Layers, Lock, Play, Plus, Award, GraduationCap,
  AlignLeft, Check, FolderOpen, File, Folder, ChevronDown, ChevronUp, Eye
} from 'lucide-react';
import courseService from '../services/courseService';
import { Course, CourseUserAssignment, CourseSection, CourseSectionMaterial } from '../types/course';
import toast from 'react-hot-toast';
import { sanitizeHtml } from '../utils/sanitize';
import SectionVideo from '../components/SectionVideo';

const formatImageUrl = (url?: string | null) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  return `${baseUrl}/${url.replace(/^\//, '')}`;
};

export interface MyCourseDetailPageProps {
  isPreview?: boolean;
}

export const MyCourseDetailPage: React.FC<MyCourseDetailPageProps> = ({ isPreview = false }) => {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id ? Number(params.id) : null;

  const [course, setCourse] = useState<Course | null>(null);
  const [assignment, setAssignment] = useState<CourseUserAssignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [isTheoreticalOpen, setIsTheoreticalOpen] = useState(true);
  
  // Estado de Sección y Material Activos
  const [activeSectionId, setActiveSectionId] = useState<number | null>(null);
  const [activeMaterialId, setActiveMaterialId] = useState<number | null>(null);

  // 'overview' = Vista de Resumen (Default), 'player' = Visualizador de Secciones y Materiales
  const [viewMode, setViewMode] = useState<'overview' | 'player'>('overview');

  const fetchDetail = async () => {
    if (!courseId) return;
    setLoading(true);
    try {
      if (isPreview) {
        const res = await courseService.getCoursePreview(courseId);
        if (res.status === 'success' && res.data) {
          setCourse(res.data);
          setAssignment(null);
          const secs = res.data.sections || [];
          if (secs.length > 0) {
            setActiveSectionId(secs[0].id);
            const firstMat = secs[0].materials?.[0];
            if (firstMat) setActiveMaterialId(firstMat.id);
          }
        }
      } else {
        const res = await courseService.getMyCourseDetail(courseId);
        if (res.status === 'success' && res.data) {
          setCourse(res.data.course);
          setAssignment(res.data.assignment);
          
          const secs = res.data.course.sections || [];
          if (secs.length > 0) {
            setActiveSectionId(secs[0].id);
            const firstMat = secs[0].materials?.[0];
            if (firstMat) {
              setActiveMaterialId(firstMat.id);
            }
          }
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'No tienes acceso a este curso o no existe');
      router.push(isPreview ? '/courses' : '/my-courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [courseId]);

  const handleComplete = async () => {
    if (!courseId) return;
    setCompleting(true);
    try {
      const res = await courseService.completeCourse(courseId);
      toast.success('¡Felicidades! Has completado el curso exitosamente 🎉');
      setAssignment(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al completar el curso');
    } finally {
      setCompleting(false);
    }
  };

  const completedMaterialIds = new Set<number>(
    assignment?.completed_materials
      ? assignment.completed_materials.map((m: any) => typeof m === 'number' ? m : (m.material_id ?? m.id))
      : (assignment?.completed_material_ids ?? [])
  );

  const handleCompleteMaterial = async (materialId: number) => {
    if (isPreview || !courseId) return;
    try {
      const res = await courseService.completeMaterial(courseId, materialId);
      if (res.status === 'success' && res.data) {
        if (res.data.assignment) {
          setAssignment(res.data.assignment);
        }
        toast.success('¡Avance guardado exitosamente!');
      } else if (res.message) {
        toast.error(res.message);
      }
    } catch (err: any) {
      console.error('Error al guardar avance:', err);
      toast.error(err.response?.data?.message || 'Error al marcar como completado');
    }
  };

  const handleCompleteSection = async (sectionToComplete = activeSection) => {
    if (isPreview || !courseId || !sectionToComplete) return;
    const mats = sectionToComplete.materials || [];
    try {
      if (mats.length > 0) {
        let latestAssignment = assignment;
        for (const m of mats) {
          if (!completedMaterialIds.has(m.id)) {
            const res = await courseService.completeMaterial(courseId, m.id);
            if (res.status === 'success' && res.data?.assignment) {
              latestAssignment = res.data.assignment;
            }
          }
        }
        if (latestAssignment) setAssignment(latestAssignment);
      } else {
        const res = await courseService.completeMaterial(courseId);
        if (res.status === 'success' && res.data?.assignment) {
          setAssignment(res.data.assignment);
        }
      }
      toast.success(`Sección "${sectionToComplete.title}" marcada como completada 🎉`);
    } catch (err: any) {
      console.error('Error al marcar sección:', err);
      toast.error(err.response?.data?.message || 'Error al marcar la sección como completada');
    }
  };

  const handleContinueCourse = () => {
    const secs = course?.sections || [];
    for (const sec of secs) {
      const uncompleted = (sec.materials || []).find(m => !completedMaterialIds.has(m.id));
      if (uncompleted) {
        setActiveSectionId(sec.id);
        setActiveMaterialId(uncompleted.id);
        setViewMode('player');
        return;
      }
    }
    if (secs.length > 0) {
      setActiveSectionId(secs[0].id);
      if (secs[0].materials?.[0]) setActiveMaterialId(secs[0].materials[0].id);
      setViewMode('player');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
        <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">Cargando secciones y carpeta de materiales...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-8 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Curso no encontrado o sin acceso</h2>
        <Link href="/my-courses" className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs">
          Volver a Mis Cursos
        </Link>
      </div>
    );
  }

  const sections = course.sections || [];
  const isCompleted = assignment?.status === 'completed';

  const activeSection = sections.find(s => s.id === activeSectionId) || sections[0];
  const sectionMaterials = activeSection?.materials || [];

  const isActiveSectionCompleted = Boolean(
    activeSection &&
    (sectionMaterials.length === 0 || sectionMaterials.every(m => completedMaterialIds.has(m.id)))
  );

  const completedSectionsCount = isCompleted
    ? sections.length
    : sections.filter(sec => {
        const mats = sec.materials || [];
        return mats.length > 0 ? mats.every(m => completedMaterialIds.has(m.id)) : false;
      }).length;

  const sectionProgressPercentage = isCompleted
    ? 100
    : sections.length > 0
      ? Math.round((completedSectionsCount / sections.length) * 100)
      : (assignment?.progress_percentage ?? 0);

  // Contenido principal de la lección (Video o Documento principal de la sección)
  const sectionVideoMaterial = sectionMaterials.find(m => m.title?.includes('(Principal)')) || sectionMaterials.find(m => m.type === 'video');

  // Recursos y materiales adicionales de la sección (excluyendo el contenido principal de la lección)
  const sectionResources = sectionMaterials.filter(m => m.id !== sectionVideoMaterial?.id);

  // Recurso activo seleccionado dentro de los recursos de la sección
  const activeResource = sectionResources.find(m => m.id === activeMaterialId) || sectionResources[0];

  const getMaterialIcon = (resType: 'video' | 'pdf' | 'image' | 'file', className = "w-4 h-4") => {
    switch (resType) {
      case 'video':
        return <Video className={className} />;
      case 'pdf':
        return <FileText className={className} />;
      case 'image':
        return <Eye className={className} />;
      default:
        return <File className={className} />;
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 text-slate-900 dark:text-slate-100">
      
      {/* BARRA SUPERIOR DE NAVEGACIÓN */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800/80 pb-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Link
            href={isPreview ? '/courses' : '/my-courses'}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-xs font-bold shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isPreview ? 'Volver a Administrar Cursos' : 'Volver a Mis Cursos'}</span>
          </Link>

          {isPreview && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-extrabold shadow-2xs">
              <Eye className="w-3.5 h-3.5" />
              <span>Vista Previa</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-start sm:justify-end">
          {viewMode === 'player' && (
            <button
              onClick={() => setViewMode('overview')}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-extrabold text-slate-800 dark:text-white transition-colors border border-slate-200 dark:border-slate-700"
            >
              Ver Resumen del Curso
            </button>
          )}

          {isPreview ? (
            <button
              disabled
              title="Modo Vista previa - No modifica avance"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-extrabold text-xs cursor-not-allowed border border-slate-200 dark:border-slate-700 opacity-80"
            >
              <CheckCircle2 className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">Marcar como Completado (Vista previa)</span>
              <span className="sm:hidden">Completado (Vista previa)</span>
            </button>
          ) : isCompleted ? (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs border border-emerald-200 dark:border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
              <span>Curso Completado</span>
            </div>
          ) : (
            <button
              onClick={handleComplete}
              disabled={completing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-md shadow-emerald-600/20 active:scale-95 disabled:opacity-50"
            >
              {completing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>Marcar como Completado</span>
            </button>
          )}
        </div>
      </div>

      {/* MODO 1: PLANTILLA DE RESUMEN DEL CURSO (OVERVIEW / SYLLABUS) */}
      {viewMode === 'overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMNA IZQUIERDA (CABECERA, METADATOS, DESCRIPCIÓN Y SYLLABUS TIMELINE DE SECCIONES) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. COMPONENTE: CABECERA Y METADATOS */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl text-emerald-600 dark:text-[#00e699] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-[#00e699]">
                  Ruta Profesional de Aprendizaje
                </span>
              </div>

              {/* Título del Programa */}
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                {course.title}
              </h1>

              {/* Atributo de Publicación */}
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Publicado el {course.created_at ? new Date(course.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }) : '08 de julio de 2025'}
              </p>

              {/* Píldoras de Especificación (Tags) */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold shadow-2xs">
                  <Layers className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{sections.length} Sección(es)</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold shadow-2xs">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Contenido Dinámico</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Práctica y Carpetas de Recursos</span>
                </span>
              </div>
            </div>

            {/* 2. COMPONENTE COLLAPSE: CONTENIDO TEÓRICO DETALLADO */}
            <div className="pt-2">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm transition-all duration-300">
                <button
                  type="button"
                  onClick={() => setIsTheoreticalOpen(!isTheoreticalOpen)}
                  className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20 shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight truncate">
                        Contenido Teórico Detallado
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold truncate">
                        Haz clic para {isTheoreticalOpen ? 'contraer' : 'expandir'} las instrucciones y guía teórica general
                      </p>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                    {isTheoreticalOpen ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </button>

                {isTheoreticalOpen && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    {(course.content || course.description) ? (
                      <div
                        className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed font-medium prose dark:prose-invert max-w-none pt-2"
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(course.content || course.description) }}
                      />
                    ) : (
                      <p className="text-slate-500 dark:text-slate-400 text-sm italic font-medium pt-2">
                        Sin notas teóricas adicionales cargadas para este curso.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 3. TIMELINE DE SECCIONES DEL CURSO */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Ruta de Secciones (Timeline)</h2>
              </div>

              {course.modules && course.modules.length > 0 ? (
                (() => {
                  let globalSectionCounter = 0;
                  return (
                    <div className="relative pl-3 space-y-6 pt-1 overflow-x-hidden">
                      {/* Línea Vertical Continua (Pasando por el CENTRO EXACTO de las insignias en x = 24px) */}
                      <div className="absolute left-[24px] top-3 bottom-3 w-0.5 bg-emerald-500/30 dark:bg-emerald-500/20 z-0 pointer-events-none" />

                      {course.modules.map((mod) => {
                        const modSections = mod.sections || sections.filter(s => s.course_module_id === mod.id);

                        return (
                          <div key={mod.id} className="space-y-3 relative">
                            {/* Nodo del Módulo en la Línea de Tiempo (Centrado exacto en x = 24px) */}
                            <div className="flex items-center gap-3 relative pl-9">
                              <div className="absolute left-[4px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-slate-950 shrink-0 z-10 shadow-xs" />
                              <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                                {mod.title}
                              </h3>
                            </div>

                            {/* Secciones del Módulo */}
                            <div className="space-y-0.5 pt-0.5">
                              {modSections.map((sec) => {
                                globalSectionCounter++;
                                const currentSecNumber = globalSectionCounter;
                                const mats = sec.materials || [];
                                const isSecCompleted = mats.length > 0 && mats.every(m => completedMaterialIds.has(m.id));

                                return (
                                  <div 
                                    key={sec.id}
                                    onClick={() => {
                                      setActiveSectionId(sec.id);
                                      if (mats.length > 0) setActiveMaterialId(mats[0].id);
                                      setViewMode('player');
                                    }}
                                    className="relative flex items-center justify-between gap-3 py-1.5 pl-9 pr-2.5 rounded-xl transition-all duration-200 cursor-pointer group/sec hover:bg-emerald-500/10 dark:hover:bg-emerald-500/15 hover:translate-x-1.5 hover:shadow-2xs"
                                  >
                                    {/* Número Correlativo en la Línea del Timeline */}
                                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full aspect-square text-xs font-black flex items-center justify-center shrink-0 z-10 shadow-xs transition-all duration-200 ${
                                      isSecCompleted
                                        ? 'bg-emerald-500 text-white border-2 border-emerald-400'
                                        : 'bg-white dark:bg-slate-950 border-2 border-emerald-500 text-emerald-600 dark:text-[#00e699] group-hover/sec:bg-emerald-500 group-hover/sec:text-white'
                                    }`}>
                                      {isSecCompleted ? '✓' : currentSecNumber}
                                    </div>

                                    <div className="flex items-center gap-3 min-w-0">
                                      {sec.cover_image ? (
                                        <img
                                          src={formatImageUrl(sec.cover_image)!}
                                          alt={sec.title}
                                          className="w-16 h-11 sm:w-20 sm:h-12 rounded-xl object-cover shrink-0 border border-slate-200/60 dark:border-slate-800 shadow-xs transition-transform duration-200 group-hover/sec:scale-105 group-hover/sec:shadow-md"
                                        />
                                      ) : (
                                        <div className="w-16 h-11 sm:w-20 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-slate-900 text-white flex items-center justify-center shrink-0 font-black text-xs shadow-xs transition-transform duration-200 group-hover/sec:scale-105 group-hover/sec:shadow-md">
                                          {sec.title.charAt(0).toUpperCase()}
                                        </div>
                                      )}

                                      <div className="space-y-0.5 min-w-0">
                                        <h4 className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200 group-hover/sec:text-emerald-600 dark:group-hover/sec:text-[#00e699] transition-colors truncate">
                                          {sec.title}
                                        </h4>
                                        {(sec.duration || mats[0]?.duration) && (
                                          <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            <span>{sec.duration || mats[0]?.duration}</span>
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()
              ) : sections.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl space-y-2">
                  <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-500">Este curso aún no tiene secciones cargadas.</p>
                </div>
              ) : (
                /* Timeline Fallback sin modulos */
                <div className="relative pl-6 space-y-3 border-l-2 border-emerald-500/30 dark:border-emerald-500/20 ml-3">
                  {sections.map((sec, secIdx) => {
                    const mats = sec.materials || [];
                    return (
                      <div 
                        key={sec.id}
                        onClick={() => {
                          setActiveSectionId(sec.id);
                          if (mats.length > 0) setActiveMaterialId(mats[0].id);
                          setViewMode('player');
                        }}
                        className="flex items-center justify-between gap-4 py-2 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 rounded-xl px-2 transition-all cursor-pointer group/sec"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          {sec.cover_image ? (
                            <img
                              src={formatImageUrl(sec.cover_image)!}
                              alt={sec.title}
                              className="w-10 h-10 rounded-xl object-cover shrink-0 shadow-2xs"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 font-black text-xs shadow-2xs">
                              {sec.title.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="space-y-0.5 min-w-0">
                            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                              <span className="font-extrabold text-emerald-600 dark:text-[#00e699] mr-1.5">{secIdx + 1}.</span>
                              {sec.title}
                            </h3>
                            {(sec.duration || mats[0]?.duration) && (
                              <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{sec.duration || mats[0]?.duration}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* 3. COLUMNA LATERAL DERECHA (PANEL DE ACCIÓN Y MULTIMEDIA STICKY) */}
          <div className="space-y-6">
            <div className="sticky top-6 space-y-6">
              
              {/* Tarjeta de Avance del Estudiante */}
              {assignment && (
                <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-3 border border-slate-800 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                      Avance del Curso
                    </span>
                    <span className="text-sm font-black text-emerald-400">
                      {sectionProgressPercentage}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${sectionProgressPercentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold pt-1">
                    <span>
                      {completedSectionsCount} / {sections.length || 1} {sections.length === 1 ? 'Sección completada' : 'Secciones completadas'}
                    </span>
                    <span className="capitalize px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px]">
                      {assignment.status === 'completed' ? 'Completado' : assignment.status === 'in_progress' ? 'En Progreso' : 'No Iniciado'}
                    </span>
                  </div>
                </div>
              )}

              {/* Contenedor de Video/Foto de Bienvenida de Detalle (Directamente arriba del Botón de Iniciar Aprendizaje) */}
              <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-xl">
                {course.detail_media_url ? (
                  course.detail_media_type === 'image' ? (
                    <div 
                      onClick={handleContinueCourse}
                      className="relative h-52 w-full cursor-pointer group overflow-hidden"
                    >
                      <img
                        src={formatImageUrl(course.detail_media_url)!}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md border border-white/40 flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-2xl">
                          <Play className="w-6 h-6 fill-white translate-x-0.5" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <SectionVideo
                      material={{
                        id: 0,
                        course_section_id: 0,
                        title: course.title,
                        type: 'video',
                        video_provider: course.detail_media_provider || 'local',
                        external_url: course.detail_media_url,
                        sort_order: 1,
                        created_at: '',
                        updated_at: '',
                      }}
                      autoPlay={false}
                    />
                  )
                ) : (
                  <div 
                    onClick={handleContinueCourse}
                    className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700/80 h-48 bg-slate-100 dark:bg-slate-950 cursor-pointer group shadow-md"
                  >
                    {course.main_image ? (
                      <img src={course.main_image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-indigo-950 to-slate-900 text-indigo-500">
                        <Video className="w-10 h-10 opacity-60 mb-1" />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Vista Previa del Curso</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                      <div className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-md border border-white/40 flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-2xl">
                        <Play className="w-7 h-7 fill-white translate-x-0.5" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Botones de Acción CTA */}
              <div className="space-y-3">
                <button
                  onClick={handleContinueCourse}
                  className="w-full py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 dark:bg-[#00e699] dark:hover:bg-[#00c985] text-white dark:text-slate-950 font-black text-sm transition-all shadow-lg shadow-emerald-500/20 dark:shadow-[#00e699]/20 flex items-center justify-center gap-2 active:scale-95"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>
                    {assignment?.status === 'in_progress' ? 'Continuar Curso' : assignment?.status === 'completed' ? 'Repasar Curso' : 'Iniciar Aprendizaje'}
                  </span>
                </button>
              </div>

            </div>
          </div>

        </div>
      ) : (
        /* MODO 2: REPRODUCTOR PRINCIPAL DE LA SECCIÓN + CONTENEDOR ESTILO CARPETA DE RECURSOS */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Visualizador Principal de la Sección Activa */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. VIDEO PRINCIPAL DE LA SECCIÓN (CONTENIDO DIRECTO DE LA SECCIÓN) */}
            <div className="bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col min-h-[360px]">
              {sectionVideoMaterial ? (
                <div className="relative flex-1 flex flex-col">
                  <SectionVideo
                    material={sectionVideoMaterial}
                    onEnded={() => handleCompleteMaterial(sectionVideoMaterial.id)}
                    isCompleted={completedMaterialIds.has(sectionVideoMaterial.id)}
                  />
                  <div className="p-3.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                    <span className="font-bold flex items-center gap-2">
                      <Video className="w-4 h-4 text-emerald-400" />
                      <span>Video de la Sección: {sectionVideoMaterial.title}</span>
                    </span>
                    {completedMaterialIds.has(sectionVideoMaterial.id) ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-[11px]">
                        ✓ Completado
                      </span>
                    ) : (
                      <button
                        onClick={() => handleCompleteMaterial(sectionVideoMaterial.id)}
                        className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors"
                      >
                        Marcar como completado
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-slate-900 flex flex-col items-center justify-center text-slate-500 space-y-2 p-8 text-center rounded-3xl">
                  <BookOpen className="w-12 h-12 text-slate-700" />
                  <p className="text-sm font-bold text-slate-300">Esta sección no contiene video propio.</p>
                  <p className="text-xs text-slate-500">Revisa la lección escrita o consulta los recursos adjuntos abajo.</p>
                </div>
              )}
            </div>

            {/* 1.5 IMAGEN DE CERTIFICADO DEL CURSO (DEBAJO DEL VIDEO - OCULTO SI ES NULL) */}
            {course?.certificate_image && (
              <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-amber-200 dark:border-amber-900/50 shadow-sm space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                      Certificado Acreditativo del Curso
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Certificado oficial emitido al completar el programa
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 flex items-center justify-center p-2">
                  <img
                    src={formatImageUrl(course.certificate_image)!}
                    alt={`Certificado del Curso ${course.title}`}
                    className="max-w-full h-auto max-h-[500px] object-contain rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* 2. CONTENIDO TEÓRICO / EXPLICACIÓN DE LA SECCIÓN */}
            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-[#00e699] tracking-widest">
                    Contenido Teórico / Explicación de la Sección
                  </span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    {activeSection?.title || course.title}
                  </h3>
                </div>

                {isActiveSectionCompleted ? (
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs border border-emerald-200 dark:border-emerald-500/30 shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Sección Completada</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleCompleteSection(activeSection)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-md shadow-emerald-600/20 active:scale-95 shrink-0"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Marcar Sección como Completada</span>
                  </button>
                )}
              </div>

              {(activeSection?.content || activeSection?.description) ? (
                <div 
                  className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed font-medium prose dark:prose-invert max-w-none pt-1"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(activeSection.content || activeSection.description || '') }}
                />
              ) : (
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium italic">
                  Sin notas teóricas ni descripción adicional para esta sección.
                </p>
              )}
            </div>

            {/* 3. CARPETA DE RECURSOS DE LA SECCIÓN (ARCHIVOS ADICIONALES EXCLUYENDO EL VIDEO PROPIO) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 relative shadow-sm">
              {/* Tab/Solapa de la Carpeta */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-[#00e699] flex items-center justify-center border border-emerald-500/20 shadow-xs">
                    <Folder className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Recursos de la Sección: {activeSection?.title}</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {sectionResources.length} recurso(s) adicional(es) en esta sección
                    </p>
                  </div>
                </div>
              </div>

              {/* Grilla de Recursos */}
              {sectionResources.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 font-medium italic">
                  Esta sección no posee recursos ni documentos adicionales en su carpeta.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {sectionResources.map((mat) => {
                      const isSelected = activeResource?.id === mat.id;

                      return (
                        <div
                          key={mat.id}
                          onClick={() => setActiveMaterialId(mat.id)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                            isSelected
                              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-900 dark:text-emerald-100 shadow-sm ring-2 ring-emerald-500/20'
                              : 'bg-slate-50 dark:bg-slate-900/90 border-slate-200/80 dark:border-slate-800 hover:border-emerald-400/60'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                              mat.type === 'pdf' ? 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400' :
                              'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
                            }`}>
                              {getMaterialIcon(mat.type, "w-5 h-5")}
                            </div>

                            <div className="min-w-0">
                              <p className="text-xs font-black truncate text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                {mat.title}
                              </p>
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider truncate">
                                {mat.file_name || mat.type}
                              </p>
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center gap-1.5">
                            <a
                              href={courseService.getMaterialStreamUrl(mat.id, true)}
                              download
                              onClick={(e) => e.stopPropagation()}
                              title="Descargar documento"
                              className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white transition-colors"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Previsualizador de Recurso Seleccionado (PDF, Imagen o Archivo) */}
                  {activeResource && (
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          {activeResource.type === 'image' ? <Eye className="w-4 h-4 text-emerald-500" /> : <FileText className="w-4 h-4 text-rose-500" />}
                          <span>Vista Previa del Recurso: {activeResource.title}</span>
                        </span>
                        <a
                          href={courseService.getMaterialStreamUrl(activeResource.id, true)}
                          download
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Descargar Recurso</span>
                        </a>
                      </div>

                      {activeResource.type === 'pdf' ? (
                        <div className="w-full h-[500px] bg-white rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner">
                          <iframe
                            src={courseService.getMaterialStreamUrl(activeResource.id)}
                            className="w-full h-full"
                            title={activeResource.title}
                          />
                        </div>
                      ) : activeResource.type === 'image' || (activeResource.file_path && /\.(png|jpe?g|webp|gif|svg)$/i.test(activeResource.file_path)) ? (
                        <div className="w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex items-center justify-center p-4">
                          <img
                            src={courseService.getMaterialStreamUrl(activeResource.id)}
                            alt={activeResource.title}
                            className="max-w-full h-auto max-h-[500px] object-contain rounded-xl"
                          />
                        </div>
                      ) : (
                        <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
                          <File className="w-8 h-8 text-slate-400 mx-auto" />
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            {activeResource.file_name || activeResource.title}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Usa el botón de descarga para guardar o abrir este recurso en tu dispositivo.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Timeline Lateral de Secciones (Compacto, Armónico y Centrado) */}
          <div className="space-y-4">
            {course.modules && course.modules.length > 0 ? (
                (() => {
                  let globalSectionCounter = 0;
                  return (
                    <div className="relative pl-3 space-y-5 pt-1 max-h-[500px] overflow-y-auto overflow-x-hidden pr-1 custom-scrollbar">
                      {/* Línea Vertical Continua (Pasando por el CENTRO EXACTO de las insignias en x = 24px) */}
                      <div className="absolute left-[24px] top-3 bottom-3 w-0.5 bg-emerald-500/30 dark:bg-emerald-500/20 z-0 pointer-events-none" />

                      {course.modules.map((mod) => {
                        const modSections = mod.sections || sections.filter(s => s.course_module_id === mod.id);

                        return (
                          <div key={mod.id} className="space-y-2.5 relative">
                            {/* Nodo del Módulo en la Línea de Tiempo (Centrado exacto en x = 24px) */}
                            <div className="flex items-center gap-3 relative pl-9">
                              <div className="absolute left-[4px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-slate-950 shrink-0 z-10 shadow-xs" />
                              <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                                {mod.title}
                              </h3>
                            </div>

                            {/* Secciones compactas e higiénicas */}
                            <div className="space-y-0.5 pt-0.5">
                              {modSections.map((sec) => {
                                globalSectionCounter++;
                                const currentSecNumber = globalSectionCounter;
                                const isSecActive = activeSection?.id === sec.id;
                                const mats = sec.materials || [];
                                return (
                                  <div 
                                    key={sec.id}
                                    onClick={() => {
                                      setActiveSectionId(sec.id);
                                      if (mats.length > 0) setActiveMaterialId(mats[0].id);
                                    }}
                                    className={`relative flex items-center justify-between gap-3 py-1.5 pl-9 pr-2.5 rounded-xl transition-all duration-200 cursor-pointer group/sec ${
                                      isSecActive
                                        ? 'bg-emerald-500/15 dark:bg-emerald-500/20 shadow-2xs font-bold'
                                        : 'hover:bg-emerald-500/10 dark:hover:bg-emerald-500/15 hover:translate-x-1.5'
                                    }`}
                                  >
                                    {/* Número Correlativo en la Línea del Timeline (Centrado exacto en x = 24px, 12px de padding izquierdo) */}
                                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full aspect-square font-black text-xs flex items-center justify-center shrink-0 z-10 transition-all duration-200 ${
                                      isSecActive
                                        ? 'bg-emerald-500 text-white border-2 border-emerald-400 scale-110 shadow-md shadow-emerald-500/40'
                                        : 'bg-white dark:bg-slate-950 border-2 border-emerald-500 text-emerald-600 dark:text-[#00e699] shadow-xs group-hover/sec:bg-emerald-500 group-hover/sec:text-white group-hover/sec:border-emerald-400 group-hover/sec:scale-110'
                                    }`}>
                                      {currentSecNumber}
                                    </div>

                                    <div className="flex items-center gap-3 min-w-0">
                                      {sec.cover_image ? (
                                        <img
                                          src={formatImageUrl(sec.cover_image)!}
                                          alt={sec.title}
                                          className="w-14 h-10 rounded-xl object-cover shrink-0 border border-slate-200/60 dark:border-slate-800 shadow-xs transition-transform duration-200 group-hover/sec:scale-105"
                                        />
                                      ) : (
                                        <div className="w-14 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-slate-900 text-white flex items-center justify-center shrink-0 font-black text-xs shadow-xs transition-transform duration-200 group-hover/sec:scale-105">
                                          {sec.title.charAt(0).toUpperCase()}
                                        </div>
                                      )}

                                      <div className="space-y-0.5 min-w-0">
                                        <h4 className={`text-xs font-black truncate transition-colors ${
                                          isSecActive
                                            ? 'text-emerald-600 dark:text-[#00e699]'
                                            : 'text-slate-800 dark:text-slate-200 group-hover/sec:text-emerald-600 dark:group-hover/sec:text-[#00e699]'
                                        }`}>
                                          {sec.title}
                                        </h4>
                                        {(sec.duration || mats[0]?.duration) && (
                                          <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            <span>{sec.duration || mats[0]?.duration}</span>
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()
              ) : sections.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">Este curso no tiene secciones registradas.</p>
              ) : (
                /* Timeline Fallback sin modulos */
                <div className="relative pl-6 space-y-3 border-l-2 border-emerald-500/30 dark:border-emerald-500/20 ml-3 max-h-[550px] overflow-y-auto pr-1 custom-scrollbar">
                  {sections.map((sec, secIdx) => {
                    const isSecActive = activeSection?.id === sec.id;
                    const mats = sec.materials || [];

                    return (
                      <div 
                        key={sec.id}
                        onClick={() => {
                          setActiveSectionId(sec.id);
                          if (mats.length > 0) setActiveMaterialId(mats[0].id);
                        }}
                        className={`relative flex items-center justify-between gap-3 py-1.5 px-2.5 rounded-xl transition-all duration-200 cursor-pointer group/sec ${
                          isSecActive
                            ? 'bg-emerald-500/15 dark:bg-emerald-500/20 shadow-2xs font-bold'
                            : 'hover:bg-emerald-500/10 dark:hover:bg-emerald-500/15 hover:translate-x-1.5'
                        }`}
                      >
                        <div className={`absolute -left-[34px] top-3.5 w-5 h-5 rounded-full border text-[10px] font-black flex items-center justify-center shadow-xs z-10 transition-all duration-200 ${
                          isSecActive
                            ? 'bg-emerald-500 text-white border-emerald-400 scale-110 shadow-md shadow-emerald-500/30'
                            : 'bg-white dark:bg-slate-950 border-emerald-500 text-emerald-600 dark:text-[#00e699] group-hover/sec:bg-emerald-500 group-hover/sec:text-white group-hover/sec:scale-115'
                        }`}>
                          {secIdx + 1}
                        </div>

                        <div className="flex items-center gap-3 min-w-0">
                          {sec.cover_image ? (
                            <img
                              src={formatImageUrl(sec.cover_image)!}
                              alt={sec.title}
                              className="w-14 h-10 rounded-xl object-cover shrink-0 border border-slate-200/60 dark:border-slate-800 shadow-xs"
                            />
                          ) : (
                            <div className="w-14 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
                              {sec.title.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="space-y-0.5 min-w-0">
                            <h4 className={`text-xs font-black truncate ${
                              isSecActive ? 'text-emerald-600 dark:text-[#00e699]' : 'text-slate-800 dark:text-slate-200'
                            }`}>
                              {sec.title}
                            </h4>
                            {(sec.duration || mats[0]?.duration) && (
                              <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{sec.duration || mats[0]?.duration}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

    </div>
  );
};

export default MyCourseDetailPage;
