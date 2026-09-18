'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, BookOpen, Video, FileText, CheckCircle2, PlayCircle, Download, 
  ExternalLink, Loader2, Sparkles, AlertCircle, Clock, Layers, Lock, Play, Plus, Award, GraduationCap,
  AlignLeft, Check, FolderOpen, File, Folder, ChevronDown, ChevronUp, Eye, Send, FileCheck, Image as ImageIcon,
  CheckSquare
} from 'lucide-react';
import activityService from '../services/activityService';
import { ActivityGroup, ActivityItem, ActivityItemSubmission } from '../types/activity';
import SectionVideo from '../components/SectionVideo';
import toast from 'react-hot-toast';
import { sanitizeHtml } from '../utils/sanitize';

const formatImageUrl = (url?: string | null) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  return `${baseUrl}/${url.replace(/^\//, '')}`;
};

export const MyActivityDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const groupId = params?.id ? Number(params.id) : null;

  const [group, setGroup] = useState<ActivityGroup | null>(null);
  const [completedActivityIds, setCompletedActivityIds] = useState<number[]>([]);
  const [submissions, setSubmissions] = useState<Record<number, ActivityItemSubmission>>({});
  const [activeActivityIndex, setActiveActivityIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isTheoreticalOpen, setIsTheoreticalOpen] = useState(true);
  
  // 'overview' = Vista de Resumen del Grupo (Default), 'player' = Visualizador y Entregas
  const [viewMode, setViewMode] = useState<'overview' | 'player'>('overview');

  // Form State para Entrega de la Actividad
  const [submissionText, setSubmissionText] = useState('');
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchGroupDetail = async () => {
    if (!groupId) return;
    setLoading(true);
    try {
      const res = await activityService.getMyActivityDetail(groupId);
      if (res.status === 'success' && res.data) {
        setGroup(res.data.group);
        setCompletedActivityIds(res.data.completed_activity_ids || []);
        setSubmissions(res.data.submissions || {});
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al acceder a la actividad.');
      router.push('/my-activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupDetail();
  }, [groupId]);

  const activities = group?.activities || [];
  const activeActivity: ActivityItem | null = activities[activeActivityIndex] || null;
  const isCompleted = activeActivity ? completedActivityIds.includes(activeActivity.id) : false;
  const currentSubmission = activeActivity ? submissions[activeActivity.id] : null;

  // Verificación de Bloqueo Secuencial
  const isActivityLocked = (index: number) => {
    if (index === 0) return false;
    for (let j = 0; j < index; j++) {
      const prevAct = activities[j];
      if (prevAct && !completedActivityIds.includes(prevAct.id)) {
        return true;
      }
    }
    return false;
  };

  const handleSelectActivity = (index: number, changeViewMode = true) => {
    if (isActivityLocked(index)) {
      const prevTitle = activities[index - 1]?.title || 'anterior';
      toast.error(`Actividad Bloqueada: Debes completar la actividad "${prevTitle}" antes de avanzar 🔒`);
      return;
    }
    setActiveActivityIndex(index);
    if (changeViewMode) setViewMode('player');
  };

  const handleContinueGroup = () => {
    for (let i = 0; i < activities.length; i++) {
      const act = activities[i];
      if (isActivityLocked(i)) break;
      if (!completedActivityIds.includes(act.id)) {
        setActiveActivityIndex(i);
        setViewMode('player');
        return;
      }
    }
    if (activities.length > 0) {
      setActiveActivityIndex(0);
      setViewMode('player');
    }
  };

  // Reset local submission form when changing activity
  useEffect(() => {
    setSubmissionText(currentSubmission?.content || '');
    setSubmissionFile(null);
  }, [activeActivityIndex, currentSubmission]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeActivity) return;

    const subType = activeActivity.submission_type;

    if (subType === 'text' && !submissionText.trim()) {
      toast.error('Ingresa la respuesta en texto antes de enviar');
      return;
    }

    if (['pdf', 'video', 'image'].includes(subType) && !submissionFile && !currentSubmission) {
      toast.error(`Selecciona un archivo ${subType.toUpperCase()} para enviar`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await activityService.submitActivity(activeActivity.id, {
        content: subType === 'text' ? submissionText : undefined,
        file: submissionFile,
      });

      toast.success(res.message || 'Actividad completada y enviada exitosamente');

      // Actualizar estado local de progreso de inmediato
      if (!completedActivityIds.includes(activeActivity.id)) {
        setCompletedActivityIds((prev) => [...prev, activeActivity.id]);
      }
      if (res.data?.submission) {
        setSubmissions((prev) => ({ ...prev, [activeActivity.id]: res.data.submission }));
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al enviar la actividad');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">Cargando actividades y materiales...</p>
      </div>
    );
  }

  if (!group || activities.length === 0) {
    return (
      <div className="p-8 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Grupo de actividades no encontrado o sin acceso</h2>
        <Link href="/my-activities" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs">
          Volver a Mis Actividades
        </Link>
      </div>
    );
  }

  const totalActivities = activities.length;
  const completedCount = completedActivityIds.length;
  const isGroupCompleted = completedCount === totalActivities && totalActivities > 0;
  const progressPercentage = Math.round((completedCount / totalActivities) * 100);

  const getResourceIcon = (resType: 'video' | 'pdf' | 'image' | 'file', className = "w-4 h-4") => {
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

  const getSubmissionLabel = (type: string) => {
    switch (type) {
      case 'text': return 'Entrega de Texto';
      case 'pdf': return 'Entrega en PDF';
      case 'video': return 'Entrega de Video';
      case 'image': return 'Entrega de Imagen';
      default: return 'Sin Entrega Requerida';
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 text-slate-900 dark:text-slate-100">
      
      {/* BARRA SUPERIOR DE NAVEGACIÓN */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800/80 pb-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Link
            href="/my-activities"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-xs font-bold shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Mis Actividades</span>
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-start sm:justify-end">
          {viewMode === 'player' && (
            <button
              onClick={() => setViewMode('overview')}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-extrabold text-slate-800 dark:text-white transition-colors border border-slate-200 dark:border-slate-700"
            >
              Ver Resumen del Grupo
            </button>
          )}

          {isGroupCompleted ? (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs border border-emerald-200 dark:border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
              <span>Grupo Completado</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 font-extrabold text-xs border border-blue-200 dark:border-blue-500/30">
              <Clock className="w-4 h-4" />
              <span>{completedCount} / {totalActivities} Completadas</span>
            </div>
          )}
        </div>
      </div>

      {/* MODO 1: PLANTILLA DE RESUMEN DEL GRUPO (OVERVIEW / SYLLABUS) */}
      {viewMode === 'overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMNA IZQUIERDA (CABECERA, METADATOS, DESCRIPCIÓN Y SYLLABUS TIMELINE DE ACTIVIDADES) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. COMPONENTE: CABECERA Y METADATOS */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                  Ruta Práctica de Actividades
                </span>
              </div>

              {/* Título del Grupo */}
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                {group.title}
              </h1>

              {/* Atributo de Publicación */}
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Publicado el {group.created_at ? new Date(group.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Recientemente'}
              </p>

              {/* Píldoras de Especificación (Tags) */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold shadow-2xs">
                  <Layers className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{totalActivities} Actividades</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold shadow-2xs">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Entregas Digitales</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  <span>Práctica y Recursos</span>
                </span>
              </div>
            </div>

            {/* 2. COMPONENTE COLLAPSE: CONTENIDO TEÓRICO DETALLADO DE INSTRUCCIONES */}
            <div className="pt-2">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm transition-all duration-300">
                <button
                  type="button"
                  onClick={() => setIsTheoreticalOpen(!isTheoreticalOpen)}
                  className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20 shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight truncate">
                        Guía e Instrucciones del Grupo
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold truncate">
                        Haz clic para {isTheoreticalOpen ? 'contraer' : 'expandir'} la guía general del grupo de actividades
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
                    {group.description ? (
                      <div
                        className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed font-medium prose dark:prose-invert max-w-none pt-2"
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(group.description) }}
                      />
                    ) : (
                      <p className="text-slate-500 dark:text-slate-400 text-sm italic font-medium pt-2">
                        Sin instrucciones teóricas adicionales cargadas para este grupo.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 3. TIMELINE DE ACTIVIDADES DEL GRUPO */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Ruta de Actividades (Timeline)</h2>
              </div>

              <div className="relative pl-3 space-y-6 pt-1 overflow-x-hidden">
                {/* Línea Vertical Continua (Pasando por el CENTRO EXACTO de las insignias en x = 24px) */}
                <div className="absolute left-[24px] top-3 bottom-3 w-0.5 bg-blue-500/30 dark:bg-blue-500/20 z-0 pointer-events-none" />

                <div className="space-y-1 pt-0.5">
                  {activities.map((act, idx) => {
                    const currentSecNumber = idx + 1;
                    const actIsCompleted = completedActivityIds.includes(act.id);
                    const locked = isActivityLocked(idx);

                    return (
                      <div 
                        key={act.id}
                        onClick={() => handleSelectActivity(idx, true)}
                        className={`relative flex items-center justify-between gap-3 py-2 pl-9 pr-3 rounded-2xl transition-all duration-200 cursor-pointer group/sec ${
                          locked
                            ? 'opacity-60 cursor-not-allowed hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                            : 'hover:bg-blue-500/10 dark:hover:bg-blue-500/15 hover:translate-x-1.5 hover:shadow-2xs'
                        }`}
                      >
                        {/* Número Correlativo en la Línea del Timeline */}
                        <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full aspect-square text-xs font-black flex items-center justify-center shrink-0 z-10 shadow-xs transition-all duration-200 ${
                          locked
                            ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 border-2 border-slate-300 dark:border-slate-700'
                            : actIsCompleted
                              ? 'bg-emerald-500 text-white border-2 border-emerald-400'
                              : 'bg-white dark:bg-slate-950 border-2 border-blue-500 text-blue-600 dark:text-blue-400 group-hover/sec:bg-blue-600 group-hover/sec:text-white'
                        }`}>
                          {locked ? <Lock className="w-3 h-3 text-slate-400" /> : actIsCompleted ? '✓' : currentSecNumber}
                        </div>

                        <div className="flex items-center gap-3 min-w-0">
                          {act.cover_image ? (
                            <img
                              src={formatImageUrl(act.cover_image)!}
                              alt={act.title}
                              className="w-16 h-11 sm:w-20 sm:h-12 rounded-xl object-cover shrink-0 border border-slate-200/60 dark:border-slate-800 shadow-xs transition-transform duration-200 group-hover/sec:scale-105 group-hover/sec:shadow-md"
                            />
                          ) : (
                            <div className="w-16 h-11 sm:w-20 sm:h-12 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900 text-white flex items-center justify-center shrink-0 font-black text-xs shadow-xs transition-transform duration-200 group-hover/sec:scale-105 group-hover/sec:shadow-md">
                              {act.title.charAt(0).toUpperCase()}
                            </div>
                          )}

                          <div className="space-y-0.5 min-w-0">
                            <h4 className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200 group-hover/sec:text-blue-600 dark:group-hover/sec:text-blue-400 transition-colors truncate flex items-center gap-1.5">
                              <span>{act.title}</span>
                              {locked && <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                            </h4>
                            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                              <span>{getSubmissionLabel(act.submission_type)}</span>
                              {act.primary_type !== 'none' && <span>• {act.primary_type.toUpperCase()}</span>}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          {/* COLUMNA LATERAL DERECHA (PANEL DE ACCIÓN Y MULTIMEDIA STICKY) */}
          <div className="space-y-6">
            <div className="sticky top-6 space-y-6">
              
              {/* Tarjeta de Avance del Estudiante */}
              <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-3 border border-slate-800 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                    Avance del Grupo
                  </span>
                  <span className="text-sm font-black text-blue-400">
                    {progressPercentage}%
                  </span>
                </div>

                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 font-bold pt-1">
                  <span>
                    {completedCount} / {totalActivities} Actividades completadas
                  </span>
                  <span className="capitalize px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[11px]">
                    {isGroupCompleted ? 'Completado' : completedCount > 0 ? 'En Progreso' : 'No Iniciado'}
                  </span>
                </div>
              </div>

              {/* Contenedor de Foto/Media del Grupo */}
              <div 
                onClick={handleContinueGroup}
                className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 h-48 bg-slate-950 cursor-pointer group shadow-xl"
              >
                {group.main_image ? (
                  <img
                    src={formatImageUrl(group.main_image)!}
                    alt={group.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 text-blue-400">
                    <CheckSquare className="w-10 h-10 opacity-60 mb-1" />
                    <span className="text-xs font-bold text-slate-300">Actividades de Aprendizaje</span>
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
                  onClick={handleContinueGroup}
                  className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 active:scale-95"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>
                    {completedCount > 0 ? (isGroupCompleted ? 'Repasar Actividades' : 'Continuar Actividades') : 'Iniciar Actividades'}
                  </span>
                </button>
              </div>

            </div>
          </div>

        </div>
      ) : (
        /* MODO 2: REPRODUCTOR PRINCIPAL DE LA ACTIVIDAD Y FORMULARIO DE ENTREGAS */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Visualizador Principal de la Actividad Activa */}
          <div className="lg:col-span-2 space-y-6">
            
            {activeActivity && isActivityLocked(activeActivityIndex) ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto border border-amber-500/20">
                  <Lock className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Actividad Bloqueada 🔒</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold max-w-md mx-auto">
                    Para visualizar y realizar la actividad "{activeActivity.title}", primero debes completar todas las actividades anteriores.
                  </p>
                </div>
              </div>
            ) : activeActivity ? (
              <>
                {/* 1. MEDIA PRINCIPAL DE LA ACTIVIDAD (VIDEO O IMAGEN) */}
                {activeActivity.primary_type === 'video' && activeActivity.media_url && (
                  <div className="bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col">
                    <div className="relative flex-1 flex flex-col">
                      <SectionVideo
                        material={{
                          id: activeActivity.id,
                          title: activeActivity.title,
                          type: 'video',
                          video_provider: activeActivity.media_provider || 'local',
                          external_url: activeActivity.media_url,
                          file_path: activeActivity.media_url,
                          sort_order: 1,
                        }}
                        isCompleted={isCompleted}
                      />
                      <div className="p-3.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                        <span className="font-bold flex items-center gap-2">
                          <Video className="w-4 h-4 text-blue-400" />
                          <span>Video de la Actividad: {activeActivity.title}</span>
                        </span>
                        {isCompleted && (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-[11px]">
                            ✓ Completado
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeActivity.primary_type === 'image' && activeActivity.media_url && (
                  <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 p-4 space-y-2">
                    <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">
                      Imagen de la Actividad
                    </h4>
                    <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-black flex items-center justify-center">
                      <img
                        src={formatImageUrl(activeActivity.media_url)!}
                        alt={activeActivity.title}
                        className="max-w-full h-auto max-h-[500px] object-contain"
                      />
                    </div>
                  </div>
                )}

                {/* 2. CONTENIDO TEÓRICO / EXPLICACIÓN DE LA ACTIVIDAD */}
                <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-widest">
                        Actividad {activeActivityIndex + 1} de {totalActivities}
                      </span>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">
                        {activeActivity.title}
                      </h3>
                    </div>

                    {isCompleted && (
                      <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs border border-emerald-200 dark:border-emerald-500/30 shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Actividad Completada</span>
                      </div>
                    )}
                  </div>

                  {activeActivity.content ? (
                    <div 
                      className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed font-medium prose dark:prose-invert max-w-none pt-1 whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(activeActivity.content) }}
                    />
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium italic">
                      Sin contenido teórico ni descripción adicional cargada.
                    </p>
                  )}
                </div>

                {/* 3. CARPETA DE RECURSOS DE LA ACTIVIDAD */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 relative shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20 shadow-xs">
                        <Folder className="w-5 h-5 fill-current" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                          <span>Recursos de la Actividad: {activeActivity.title}</span>
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {activeActivity.resources?.length || 0} recurso(s) adicional(es)
                        </p>
                      </div>
                    </div>
                  </div>

                  {!activeActivity.resources || activeActivity.resources.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-400 font-medium italic">
                      Esta actividad no posee recursos adicionales.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {activeActivity.resources.map((res) => (
                        <div
                          key={res.id}
                          className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                              res.type === 'pdf' ? 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400' :
                              res.type === 'image' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' :
                              'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
                            }`}>
                              {getResourceIcon(res.type, "w-5 h-5")}
                            </div>

                            <div className="min-w-0">
                              <p className="text-xs font-black truncate text-slate-900 dark:text-white">
                                {res.title}
                              </p>
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider truncate">
                                {res.file_name || res.type}
                              </p>
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center gap-1.5">
                            <a
                              href={res.source_type === 'url' ? res.external_url! : activityService.getResourceStreamUrl(res.id, true)}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-xs transition-colors inline-flex items-center gap-1.5"
                            >
                              <Download className="w-4 h-4" />
                              <span>Descargar</span>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. SECCIÓN DE ENTREGA DEL ESTUDIANTE */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <Send className="w-4 h-4 text-blue-600" />
                      Mi Actividad / Mi Entrega
                    </h3>
                    <span className="text-xs font-bold text-slate-500">
                      Requerimiento: {activeActivity.submission_type === 'none' ? 'Sin entrega' : activeActivity.submission_type.toUpperCase()}
                    </span>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Caso 1: Sin Entrega */}
                    {activeActivity.submission_type === 'none' && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                        Esta actividad es únicamente de consulta de contenido. Haz clic en el botón a continuación para marcarla como completada.
                      </p>
                    )}

                    {/* Caso 2: Entrega de Texto */}
                    {activeActivity.submission_type === 'text' && (
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          Escribe tu respuesta o resolución *
                        </label>
                        <textarea
                          rows={4}
                          value={submissionText}
                          onChange={(e) => setSubmissionText(e.target.value)}
                          placeholder="Ingresa la respuesta o desarrollo solicitado..."
                          className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}

                    {/* Caso 3, 4, 5: Entrega de Archivo PDF, Video o Imagen */}
                    {['pdf', 'video', 'image'].includes(activeActivity.submission_type) && (
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          Adjuntar Archivo ({activeActivity.submission_type.toUpperCase()}) *
                        </label>
                        <input
                          type="file"
                          accept={
                            activeActivity.submission_type === 'pdf' ? '.pdf' : activeActivity.submission_type === 'video' ? 'video/*' : 'image/*'
                          }
                          onChange={(e) => setSubmissionFile(e.target.files?.[0] || null)}
                          className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white"
                        />
                        {currentSubmission?.file_name && (
                          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            ✓ Archivo entregado previamente: {currentSubmission.file_name}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-end pt-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className={`px-6 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 shadow-md active:scale-95 ${
                          isCompleted
                            ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-600/20'
                            : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-600/20'
                        }`}
                      >
                        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {activeActivity.submission_type === 'none'
                          ? isCompleted
                            ? '✓ Actividad Completada'
                            : 'Marcar como Completada'
                          : isCompleted
                            ? '✓ Actualizar Entrega'
                            : 'Enviar Actividad'}
                      </button>
                    </div>
                  </form>
                </div>
              </>
            ) : null}
          </div>

          {/* Timeline Lateral de Actividades en Modo Player */}
          <div className="space-y-4">
            <div className="relative pl-3 space-y-5 pt-1 max-h-[500px] overflow-y-auto overflow-x-hidden pr-1 custom-scrollbar">
              {/* Línea Vertical Continua (Pasando por el CENTRO EXACTO de las insignias en x = 24px) */}
              <div className="absolute left-[24px] top-3 bottom-3 w-0.5 bg-blue-500/30 dark:bg-blue-500/20 z-0 pointer-events-none" />

              <div className="space-y-0.5 pt-0.5">
                {activities.map((act, idx) => {
                  const currentSecNumber = idx + 1;
                  const isSecActive = activeActivityIndex === idx;
                  const actIsCompleted = completedActivityIds.includes(act.id);
                  const locked = isActivityLocked(idx);

                  return (
                    <div 
                      key={act.id}
                      onClick={() => handleSelectActivity(idx, false)}
                      className={`relative flex items-center justify-between gap-3 py-1.5 pl-9 pr-2.5 rounded-xl transition-all duration-200 cursor-pointer group/sec ${
                        locked
                          ? 'opacity-60 cursor-not-allowed hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                          : isSecActive
                            ? 'bg-blue-500/15 dark:bg-blue-500/20 shadow-2xs font-bold'
                            : 'hover:bg-blue-500/10 dark:hover:bg-blue-500/15 hover:translate-x-1.5'
                      }`}
                    >
                      {/* Número Correlativo en la Línea del Timeline */}
                      <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full aspect-square font-black text-xs flex items-center justify-center shrink-0 z-10 transition-all duration-200 ${
                        locked
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 border-2 border-slate-300 dark:border-slate-700'
                          : isSecActive
                            ? 'bg-blue-600 text-white border-2 border-blue-400 scale-110 shadow-md shadow-blue-500/40'
                            : actIsCompleted
                              ? 'bg-emerald-500 text-white border-2 border-emerald-400'
                              : 'bg-white dark:bg-slate-950 border-2 border-blue-500 text-blue-600 dark:text-blue-400 shadow-xs group-hover/sec:bg-blue-600 group-hover/sec:text-white'
                      }`}>
                        {locked ? <Lock className="w-3 h-3 text-slate-400" /> : actIsCompleted ? '✓' : currentSecNumber}
                      </div>

                      <div className="flex items-center gap-3 min-w-0">
                        {act.cover_image ? (
                          <img
                            src={formatImageUrl(act.cover_image)!}
                            alt={act.title}
                            className="w-14 h-10 rounded-xl object-cover shrink-0 border border-slate-200/60 dark:border-slate-800 shadow-xs transition-transform duration-200 group-hover/sec:scale-105"
                          />
                        ) : (
                          <div className="w-14 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900 text-white flex items-center justify-center shrink-0 font-black text-xs shadow-xs transition-transform duration-200 group-hover/sec:scale-105">
                            {act.title.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div className="space-y-0.5 min-w-0">
                          <h4 className={`text-xs font-black truncate transition-colors flex items-center gap-1.5 ${
                            isSecActive
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-slate-800 dark:text-slate-200 group-hover/sec:text-blue-600 dark:group-hover/sec:text-blue-400'
                          }`}>
                            <span>{act.title}</span>
                            {locked && <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                          </h4>
                          <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                            <span>{getSubmissionLabel(act.submission_type)}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyActivityDetailPage;
