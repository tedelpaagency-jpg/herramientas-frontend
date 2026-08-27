'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, BookOpen, Video, FileText, CheckCircle2, PlayCircle, Download, 
  ExternalLink, Loader2, Sparkles, AlertCircle, Clock, Layers, Lock, Play, Plus, Award, GraduationCap,
  AlignLeft, Check, FolderOpen, File, Folder
} from 'lucide-react';
import courseService from '../services/courseService';
import { Course, CourseUserAssignment, CourseSection, CourseSectionMaterial } from '../types/course';
import toast from 'react-hot-toast';

const formatImageUrl = (url?: string | null) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  return `${baseUrl}/${url.replace(/^\//, '')}`;
};

export const MyCourseDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id ? Number(params.id) : null;

  const [course, setCourse] = useState<Course | null>(null);
  const [assignment, setAssignment] = useState<CourseUserAssignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  
  // Estado de Sección y Material Activos
  const [activeSectionId, setActiveSectionId] = useState<number | null>(null);
  const [activeMaterialId, setActiveMaterialId] = useState<number | null>(null);

  // 'overview' = Vista de Resumen (Default), 'player' = Visualizador de Secciones y Materiales
  const [viewMode, setViewMode] = useState<'overview' | 'player'>('overview');

  const fetchDetail = async () => {
    if (!courseId) return;
    setLoading(true);
    try {
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
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'No tienes acceso a este curso o no existe');
      router.push('/my-courses');
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
  // Seleccionar automáticamente el material principal (Video por defecto si existe, o el primer archivo)
  const activeMaterial = sectionMaterials.find(m => m.id === activeMaterialId) || sectionMaterials.find(m => m.type === 'video') || sectionMaterials[0];

  const getMaterialIcon = (resType: 'video' | 'pdf' | 'file', className = "w-4 h-4") => {
    switch (resType) {
      case 'video':
        return <Video className={className} />;
      case 'pdf':
        return <FileText className={className} />;
      default:
        return <File className={className} />;
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 text-slate-900 dark:text-slate-100">
      
      {/* BARRA SUPERIOR DE NAVEGACIÓN */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-4">
        <Link
          href="/my-courses"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-xs font-bold shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Mis Cursos</span>
        </Link>

        <div className="flex items-center gap-3">
          {viewMode === 'player' && (
            <button
              onClick={() => setViewMode('overview')}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-extrabold text-slate-800 dark:text-white transition-colors border border-slate-200 dark:border-slate-700"
            >
              Ver Resumen del Curso
            </button>
          )}

          {isCompleted ? (
            <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs border border-emerald-200 dark:border-emerald-500/30">
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

            {/* 2. COMPONENTE: DESCRIPCIÓN Y OBJETIVOS */}
            <div className="pt-2">
              <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed font-medium">
                {course.description || 'Domina esta tecnología más allá de los fundamentos. Construye proyectos reales aplicando principios profesionales de arquitectura moderna, optimización y desarrollo continuo.'}
              </p>
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
                    <div className="relative pl-6 space-y-6 border-l-2 border-emerald-500/30 dark:border-emerald-500/20 ml-3 pt-1">
                      {course.modules.map((mod) => {
                        const modSections = mod.sections || sections.filter(s => s.course_module_id === mod.id);

                        return (
                          <div key={mod.id} className="space-y-3 relative">
                            {/* Nodo del Módulo en la Línea de Tiempo */}
                            <div className="flex items-center gap-3 relative">
                              <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-slate-950 shrink-0" />
                              <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                                {mod.title}
                              </h3>
                            </div>

                            {/* Secciones ultras compactas con espacio mínimo */}
                            <div className="space-y-0.5 pt-0.5">
                              {modSections.map((sec) => {
                                globalSectionCounter++;
                                const currentSecNumber = globalSectionCounter;
                                const mats = sec.materials || [];
                                return (
                                  <div 
                                    key={sec.id}
                                    onClick={() => {
                                      setActiveSectionId(sec.id);
                                      if (mats.length > 0) setActiveMaterialId(mats[0].id);
                                      setViewMode('player');
                                    }}
                                    className="relative flex items-center justify-between gap-3 py-1.5 px-2.5 rounded-xl transition-all duration-200 cursor-pointer group/sec hover:bg-emerald-500/10 dark:hover:bg-emerald-500/15 hover:translate-x-1.5 hover:shadow-2xs"
                                  >
                                    {/* Número Correlativo en la Línea del Timeline (Efecto Hover Resaltado) */}
                                    <div className="absolute -left-[34px] top-4 w-5 h-5 rounded-full bg-white dark:bg-slate-950 border border-emerald-500 text-emerald-600 dark:text-[#00e699] font-black text-[10px] flex items-center justify-center shadow-xs z-10 transition-all duration-200 group-hover/sec:bg-emerald-500 group-hover/sec:text-white group-hover/sec:scale-115 group-hover/sec:shadow-md group-hover/sec:shadow-emerald-500/30 group-hover/sec:border-emerald-400">
                                      {currentSecNumber}
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

          {/* 3. COLUMNA LATERAL DERECHA (PANEL DE ACCIÓN Y MULTIMEDIA STICKY SIN FONDO NI BORDE EN EL PADRE) */}
          <div className="space-y-6">
            <div className="sticky top-6 space-y-6">
              
              {/* Banner de Beneficios (Sin fondo y sin borde) */}
              <div className="flex items-center gap-3 py-1">
                <div className="w-9 h-9 rounded-xl text-emerald-600 dark:text-[#00e699] flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  <p className="font-bold text-slate-900 dark:text-white leading-snug">
                    Capacitación profesional por secciones con video principal y carpetas de recursos.
                  </p>
                </div>
              </div>

              {/* Media Preview Card */}
              <div 
                onClick={() => setViewMode('player')}
                className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/80 h-48 bg-slate-100 dark:bg-slate-950 cursor-pointer group shadow-md"
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

              {/* Botones de Acción CTA */}
              <div className="space-y-3">
                <button
                  onClick={() => setViewMode('player')}
                  className="w-full py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 dark:bg-[#00e699] dark:hover:bg-[#00c985] text-white dark:text-slate-950 font-black text-sm transition-all shadow-lg shadow-emerald-500/20 dark:shadow-[#00e699]/20 flex items-center justify-center gap-2 active:scale-95"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Iniciar Aprendizaje</span>
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
            
            {/* Reproductor / Visor Principal de la Sección */}
            <div className="bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col min-h-[400px]">
              {activeMaterial ? (
                <div className="relative flex-1 flex flex-col">
                  {activeMaterial.type === 'video' ? (
                    <video
                      controls
                      autoPlay
                      controlsList="nodownload noremoteplayback"
                      disablePictureInPicture
                      onContextMenu={(e) => e.preventDefault()}
                      className="w-full aspect-video bg-black rounded-t-3xl select-none"
                      src={courseService.getMaterialStreamUrl(activeMaterial.id)}
                    >
                      Tu navegador no soporta el reproductor de video HTML5.
                    </video>
                  ) : activeMaterial.type === 'pdf' ? (
                    <div className="p-6 bg-slate-900 text-white space-y-4 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-8 h-8 text-rose-500" />
                          <div>
                            <h4 className="font-extrabold text-base">{activeMaterial.title}</h4>
                            <p className="text-xs text-slate-400">{activeMaterial.file_name}</p>
                          </div>
                        </div>
                        <a
                          href={courseService.getMaterialStreamUrl(activeMaterial.id, true)}
                          download
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-md shadow-blue-600/20"
                        >
                          <Download className="w-4 h-4" />
                          <span>Descargar PDF</span>
                        </a>
                      </div>
                      <div className="w-full h-[550px] bg-white rounded-2xl overflow-hidden border border-slate-800">
                        <iframe
                          src={courseService.getMaterialStreamUrl(activeMaterial.id)}
                          className="w-full h-full"
                          title={activeMaterial.title}
                        />
                      </div>
                    </div>
                  ) : (
                    /* Tipo 'file' / Documento general */
                    <div className="p-8 bg-slate-900 text-white space-y-4 flex-1 flex flex-col items-center justify-center text-center">
                      <File className="w-12 h-12 text-blue-400" />
                      <div>
                        <h4 className="font-extrabold text-lg">{activeMaterial.title}</h4>
                        <p className="text-xs text-slate-400 mt-1">{activeMaterial.file_name}</p>
                      </div>
                      <a
                        href={courseService.getMaterialStreamUrl(activeMaterial.id, true)}
                        download
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md"
                      >
                        <Download className="w-4 h-4" />
                        <span>Descargar Archivo Adjunto</span>
                      </a>
                    </div>
                  )}

                  {/* Barra de Estado del Reproductor */}
                  <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                    <span className="font-bold flex items-center gap-2">
                      {getMaterialIcon(activeMaterial.type, "w-4 h-4 text-emerald-400")}
                      <span>Video / Material Principal: {activeMaterial.title}</span>
                    </span>
                    {activeMaterial.type !== 'video' && (
                      <a
                        href={courseService.getMaterialStreamUrl(activeMaterial.id, true)}
                        download
                        className="hover:text-blue-400 font-semibold flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Descargar</span>
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-slate-900 flex flex-col items-center justify-center text-slate-500 space-y-2 p-8 text-center">
                  <BookOpen className="w-12 h-12 text-slate-700" />
                  <p className="text-sm font-bold">Esta sección contiene solo lección escrita o no tiene video principal.</p>
                </div>
              )}
            </div>

            {/* CONTENEDOR ESTILO CARPETA: RECURSOS Y MATERIALES DE LA SECCIÓN */}
            <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-slate-900/40 dark:from-amber-950/40 dark:via-amber-950/20 dark:to-slate-950 border border-amber-500/30 rounded-3xl p-6 space-y-4 relative shadow-lg">
              {/* Tab/Solapa de la Carpeta */}
              <div className="flex items-center justify-between border-b border-amber-500/20 dark:border-amber-500/30 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/30 shadow-xs">
                    <Folder className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Carpeta de Recursos: {activeSection?.title}</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {sectionMaterials.length} archivo(s) almacenado(s) en esta carpeta
                    </p>
                  </div>
                </div>
              </div>

              {/* Grilla de Archivos con Iconos dentro de la Carpeta */}
              {sectionMaterials.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 font-medium italic">
                  Esta sección no posee archivos ni documentos adjuntos en su carpeta.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {sectionMaterials.map((mat) => {
                    const isSelected = activeMaterial?.id === mat.id;
                    const isVideo = mat.type === 'video';

                    return (
                      <div
                        key={mat.id}
                        onClick={() => setActiveMaterialId(mat.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-900 dark:text-amber-100 shadow-md ring-2 ring-amber-500/30'
                            : 'bg-white/80 dark:bg-slate-900/90 border-slate-200/80 dark:border-slate-800 hover:border-amber-400/60'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                            isVideo ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400' :
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
                          {!isVideo ? (
                            <a
                              href={courseService.getMaterialStreamUrl(mat.id, true)}
                              download
                              onClick={(e) => e.stopPropagation()}
                              title="Descargar documento"
                              className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white transition-colors"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          ) : (
                            <span title="Video Protegido" className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400">
                              <Play className="w-4 h-4" />
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Contenido Teórico (Texto Enriquecido) de la Sección Activa */}
            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-[#00e699] tracking-widest">
                    Explicación Teórica & Lectura de la Sección
                  </span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    {activeSection?.title || course.title}
                  </h3>
                </div>
              </div>

              {activeSection?.content ? (
                <div 
                  className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed font-medium prose dark:prose-invert max-w-none pt-1"
                  dangerouslySetInnerHTML={{ __html: activeSection.content }}
                />
              ) : (
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-medium">
                  {course.description || 'Sin notas teóricas adicionales para esta sección.'}
                </p>
              )}
            </div>
          </div>

          {/* Timeline Lateral de Secciones */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">Secciones de la Ruta</h3>
                  <p className="text-[11px] text-slate-400">Línea de tiempo del programa</p>
                </div>
                <span className="text-xs font-bold text-[#00e699] px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  {sections.length} sección(es)
                </span>
              </div>

              {sections.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">Este curso no tiene secciones registradas.</p>
              ) : (
                /* Timeline Vertical en Barra Lateral */
                <div className="relative pl-5 space-y-6 border-l-2 border-emerald-500/30 dark:border-emerald-500/20 ml-2 max-h-[550px] overflow-y-auto pr-1 custom-scrollbar">
                  {sections.map((sec, idx) => {
                    const isSecActive = activeSection?.id === sec.id;
                    const mats = sec.materials || [];

                    return (
                      <div key={sec.id} className="relative group">
                        {/* Nodo Conector */}
                        <div className={`absolute -left-[27px] top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[9px] font-black transition-all ${
                          isSecActive 
                            ? 'bg-emerald-500 text-slate-950 border-white dark:border-slate-900 ring-4 ring-emerald-500/20 shadow-md scale-110' 
                            : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-500 group-hover:border-emerald-500'
                        }`}>
                          {idx + 1}
                        </div>

                        {/* Botón de Sección en Timeline */}
                        <button
                          onClick={() => {
                            setActiveSectionId(sec.id);
                            if (mats.length > 0) setActiveMaterialId(mats[0].id);
                          }}
                          className={`w-full text-left p-3.5 rounded-2xl transition-all border ${
                            isSecActive
                              ? 'bg-emerald-50 dark:bg-[#00e699]/10 border-emerald-200 dark:border-[#00e699]/40 text-emerald-900 dark:text-emerald-100 font-bold shadow-xs'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-transparent hover:border-slate-200 dark:hover:border-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              {sec.cover_image ? (
                                <img
                                  src={formatImageUrl(sec.cover_image)!}
                                  alt={sec.title}
                                  className="w-9 h-9 rounded-lg object-cover border border-slate-200 dark:border-slate-800 shrink-0 shadow-2xs"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-2xs">
                                  {sec.title.charAt(0).toUpperCase()}
                                </div>
                              )}

                              <div className="min-w-0">
                                {sec.group_name && (
                                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 block w-max mb-0.5">
                                    {sec.group_name}
                                  </span>
                                )}
                                <p className="text-xs font-bold line-clamp-1">{idx + 1}. {sec.title}</p>
                                {(sec.duration || mats[0]?.duration) ? (
                                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{sec.duration || mats[0]?.duration}</span>
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                                    {mats.length} archivo(s) en carpeta
                                  </span>
                                )}
                              </div>
                            </div>

                            {isSecActive && (
                              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-[#00e699] animate-pulse shrink-0" />
                            )}
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyCourseDetailPage;
