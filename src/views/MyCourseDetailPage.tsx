'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, BookOpen, Video, FileText, CheckCircle2, PlayCircle, Download, 
  ExternalLink, Loader2, Sparkles, AlertCircle, Star, Clock, Layers, Lock, Play, Plus, Award, GraduationCap
} from 'lucide-react';
import courseService from '../services/courseService';
import { Course, CourseUserAssignment, CourseResource } from '../types/course';
import toast from 'react-hot-toast';

export const MyCourseDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id ? Number(params.id) : null;

  const [course, setCourse] = useState<Course | null>(null);
  const [assignment, setAssignment] = useState<CourseUserAssignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [activeResource, setActiveResource] = useState<CourseResource | null>(null);
  
  // 'overview' = Vista de Resumen / Syllabus (Default), 'player' = Reproductor de Video/PDF
  const [viewMode, setViewMode] = useState<'overview' | 'player'>('overview');

  const fetchDetail = async () => {
    if (!courseId) return;
    setLoading(true);
    try {
      const res = await courseService.getMyCourseDetail(courseId);
      if (res.status === 'success' && res.data) {
        setCourse(res.data.course);
        setAssignment(res.data.assignment);
        const resources = res.data.course.resources || [];
        if (resources.length > 0) {
          setActiveResource(resources[0]);
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
        <Loader2 className="w-10 h-10 text-[#00e699] animate-spin" />
        <p className="text-slate-400 text-xs font-semibold">Cargando la ruta de aprendizaje...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-8 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Curso no encontrado o sin acceso</h2>
        <Link href="/my-courses" className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs">
          Volver a Mis Cursos
        </Link>
      </div>
    );
  }

  const resources = course.resources || [];
  const isCompleted = assignment?.status === 'completed';

  // Organizar recursos en módulos/secciones para la timeline del syllabus
  const modules = [
    {
      title: 'Introducción',
      lessons: resources.slice(0, Math.ceil(resources.length / 2) || 1),
    },
    {
      title: 'Bases & Práctica Avanzada',
      lessons: resources.slice(Math.ceil(resources.length / 2) || 1),
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 text-slate-100">
      
      {/* BARRA SUPERIOR DE NAVEGACIÓN */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <Link
          href="/my-courses"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Mis Cursos</span>
        </Link>

        <div className="flex items-center gap-3">
          {viewMode === 'player' && (
            <button
              onClick={() => setViewMode('overview')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-extrabold text-white transition-colors border border-slate-700"
            >
              Ver Resumen del Curso
            </button>
          )}

          {isCompleted ? (
            <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-950/80 text-emerald-400 font-extrabold text-xs border border-emerald-500/30">
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

      {/* MODO 1: PLANTILLA DE RESUMEN DEL CURSO (ESTADO: ACCESO TOTAL) */}
      {viewMode === 'overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMNA IZQUIERDA (CABECERA, METADATOS, DESCRIPCIÓN Y SYLLABUS / ROADMAP) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. COMPONENTE: CABECERA Y METADATOS */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-[#00e699] flex items-center justify-center border border-emerald-500/30">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-[#00e699]">
                  Ruta Profesional
                </span>
              </div>

              {/* Título del Programa */}
              <h1 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
                {course.title}
              </h1>

              {/* Módulo de Reputación */}
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="ml-1.5 font-black text-white">4.9</span>
                </div>
                <span className="text-slate-400 font-semibold cursor-pointer hover:underline">
                  34 opiniones ›
                </span>
              </div>

              {/* Atributo de Publicación */}
              <p className="text-xs font-semibold text-slate-400">
                Publicado el {course.created_at ? new Date(course.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }) : '08 de julio de 2025'}
              </p>

              {/* Píldoras de Especificación (Tags) */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Nivel {course.category || 'Avanzado'}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{resources.length || 33} clases</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>4 horas de contenido</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>14 horas de práctica</span>
                </span>
              </div>
            </div>

            {/* 2. COMPONENTE: DESCRIPCIÓN Y OBJETIVOS */}
            <div className="pt-2">
              <p className="text-slate-300 text-base leading-relaxed font-medium">
                {course.description || 'Domina esta tecnología más allá de los fundamentos. Construye proyectos reales aplicando principios profesionales de arquitectura moderna, optimización y desarrollo continuo.'}
              </p>
            </div>

            {/* 4. COMPONENTE: TEMARIO Y RUTA DE CLASES (SYLLABUS CON LÍNEA DE TIEMPO) */}
            <div className="space-y-6 pt-6 border-t border-slate-800/80">
              <h2 className="text-xl font-black text-white tracking-tight">Temario del Curso</h2>

              {/* Render de los módulos con nodos numerados */}
              <div className="relative pl-4 space-y-8 border-l-2 border-slate-800">
                {modules.map((module, mIdx) => {
                  let globalLessonOffset = mIdx === 0 ? 0 : modules[0].lessons.length;

                  return (
                    <div key={module.title} className="space-y-4">
                      {/* Título del Módulo */}
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-[#00e699] -ml-[23px] shadow-md shadow-[#00e699]/40" />
                        <h3 className="text-base font-extrabold text-white tracking-tight">
                          {module.title}
                        </h3>
                      </div>

                      {/* Lista de Clases del Módulo */}
                      <div className="space-y-3 pl-2">
                        {module.lessons.map((lesson, lIdx) => {
                          const lessonIndex = globalLessonOffset + lIdx + 1;
                          const isUnlocked = lIdx < 3 || lessonIndex <= 3; // Clases desbloqueadas

                          return (
                            <div
                              key={lesson.id || lIdx}
                              onClick={() => {
                                setActiveResource(lesson);
                                setViewMode('player');
                              }}
                              className="group flex items-center gap-4 p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer select-none"
                            >
                              {/* Nodo numerado */}
                              <div className="w-7 h-7 rounded-full bg-slate-800 group-hover:bg-[#00e699] text-slate-400 group-hover:text-slate-950 font-black text-xs flex items-center justify-center flex-shrink-0 transition-colors">
                                {lessonIndex}
                              </div>

                              {/* Miniatura de la clase */}
                              <div className="relative w-24 h-14 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex-shrink-0">
                                {course.main_image ? (
                                  <img src={course.main_image} alt={lesson.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-indigo-950/60 text-indigo-400">
                                    <Video className="w-6 h-6" />
                                  </div>
                                )}
                                
                                {/* Overlay con candado o reproducción */}
                                <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                                  {isUnlocked ? (
                                    <Play className="w-5 h-5 text-white fill-white opacity-90 group-hover:scale-110 transition-transform" />
                                  ) : (
                                    <Lock className="w-4 h-4 text-slate-400" />
                                  )}
                                </div>
                              </div>

                              {/* Información de la Clase */}
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-slate-200 group-hover:text-[#00e699] transition-colors truncate">
                                  {lesson.title}
                                </h4>
                                <span className="text-xs font-semibold text-slate-400">
                                  05:29 min
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* 3. COLUMNA LATERAL DERECHA (PANEL DE ACCIÓN Y MULTIMEDIA STICKY) */}
          <div className="space-y-6">
            <div className="sticky top-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
              
              {/* Banner de Beneficios */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-[#00e699] flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div className="text-xs font-medium text-slate-300">
                  <p className="font-bold text-white leading-snug">
                    Accede a este y a más de 2000 cursos profesionales adquiriendo un plan.
                  </p>
                  <span className="text-[#00e699] font-extrabold cursor-pointer hover:underline block pt-1">
                    Ver otros planes
                  </span>
                </div>
              </div>

              {/* Media Preview Card */}
              <div 
                onClick={() => setViewMode('player')}
                className="relative rounded-2xl overflow-hidden border border-slate-700/80 h-48 bg-slate-950 cursor-pointer group shadow-xl"
              >
                {course.main_image ? (
                  <img src={course.main_image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-950 to-slate-900 text-indigo-400">
                    <Video className="w-10 h-10 opacity-60 mb-1" />
                    <span className="text-xs font-bold text-slate-300">Vista Previa del Curso</span>
                  </div>
                )}

                {/* Overlay Play Button */}
                <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center group-hover:bg-slate-950/20 transition-colors">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-2xl">
                    <Play className="w-7 h-7 fill-white translate-x-0.5" />
                  </div>
                </div>
              </div>

              {/* Botones de Acción CTA */}
              <div className="space-y-3">
                <button
                  onClick={() => setViewMode('player')}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#00e699] hover:bg-[#00c985] text-slate-950 font-black text-sm transition-all shadow-lg shadow-[#00e699]/20 flex items-center justify-center gap-2 active:scale-95"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Empezar Curso sin costo</span>
                </button>

                <button
                  onClick={() => toast.success('Curso agregado a tu ruta de aprendizaje')}
                  className="w-full py-3 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-2 border border-slate-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar a mi ruta</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      ) : (
        /* MODO 2: REPRODUCTOR INTERACTIVO DE VIDEOS Y RECURSOS DEL CURSO */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reproductor Principal */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col">
              {activeResource ? (
                <div className="relative">
                  {activeResource.type === 'video' ? (
                    <video
                      controls
                      autoPlay
                      controlsList="nodownload"
                      className="w-full aspect-video bg-black rounded-t-3xl"
                      src={courseService.getResourceStreamUrl(activeResource.id)}
                    >
                      Tu navegador no soporta el reproductor de video HTML5.
                    </video>
                  ) : (
                    <div className="p-6 bg-slate-900 text-white space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-8 h-8 text-rose-500" />
                          <div>
                            <h4 className="font-extrabold text-base">{activeResource.title}</h4>
                            <p className="text-xs text-slate-400">{activeResource.file_name}</p>
                          </div>
                        </div>
                        <a
                          href={courseService.getResourceStreamUrl(activeResource.id, true)}
                          download
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-md shadow-blue-600/20"
                        >
                          <Download className="w-4 h-4" />
                          <span>Descargar PDF</span>
                        </a>
                      </div>
                      <div className="w-full h-[500px] bg-white rounded-2xl overflow-hidden border border-slate-800">
                        <iframe
                          src={courseService.getResourceStreamUrl(activeResource.id)}
                          className="w-full h-full"
                          title={activeResource.title}
                        />
                      </div>
                    </div>
                  )}
                  <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                    <span className="font-bold flex items-center gap-2">
                      {activeResource.type === 'video' ? <Video className="w-4 h-4 text-indigo-400" /> : <FileText className="w-4 h-4 text-rose-400" />}
                      {activeResource.title}
                    </span>
                    <a
                      href={courseService.getResourceStreamUrl(activeResource.id, true)}
                      download
                      className="hover:text-blue-400 font-semibold flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-slate-900 flex flex-col items-center justify-center text-slate-500 space-y-2 p-8 text-center">
                  <BookOpen className="w-12 h-12 text-slate-700" />
                  <p className="text-sm font-bold">Sin recursos interactivos adjuntos.</p>
                </div>
              )}
            </div>

            {/* Detalles & Descripción de la Clase */}
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm space-y-4">
              <h3 className="text-lg font-black text-white">{activeResource?.title || course.title}</h3>
              <p className="text-slate-300 text-xs leading-relaxed font-medium">
                {course.description}
              </p>
            </div>
          </div>

          {/* Lista Lateral de Reproducción (Playlist) */}
          <div className="space-y-4">
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-extrabold text-white">Contenido de la Ruta</h3>
                <span className="text-xs font-bold text-slate-400">{resources.length} clase(s)</span>
              </div>

              {resources.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">Este curso no tiene clases adjuntas.</p>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                  {resources.map((resource, idx) => {
                    const isActive = activeResource?.id === resource.id;
                    return (
                      <button
                        key={resource.id}
                        onClick={() => setActiveResource(resource)}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all ${
                          isActive
                            ? 'bg-[#00e699]/10 border border-[#00e699]/40 text-[#00e699] font-extrabold shadow-2xs'
                            : 'hover:bg-slate-800 text-slate-300 font-bold border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${
                            resource.type === 'video' ? 'bg-indigo-950 text-indigo-400' : 'bg-rose-950 text-rose-400'
                          }`}>
                            {resource.type === 'video' ? <Video className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                          </div>
                          <div>
                            <p className="text-xs line-clamp-1">{idx + 1}. {resource.title}</p>
                            <span className="text-[10px] text-slate-400 uppercase">{resource.type}</span>
                          </div>
                        </div>

                        {isActive && <PlayCircle className="w-4 h-4 text-[#00e699]" />}
                      </button>
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
