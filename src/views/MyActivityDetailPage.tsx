'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, CheckSquare, CheckCircle2, Clock, Download, ExternalLink, FileText, 
  Video, Upload, Loader2, Sparkles, AlertCircle, Send, FileCheck, Image as ImageIcon, Lock
} from 'lucide-react';
import activityService from '../services/activityService';
import { ActivityGroup, ActivityItem, ActivityItemSubmission } from '../types/activity';
import SectionVideo from '../components/SectionVideo';
import toast from 'react-hot-toast';

export const MyActivityDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const groupId = params?.id ? Number(params.id) : null;

  const [group, setGroup] = useState<ActivityGroup | null>(null);
  const [completedActivityIds, setCompletedActivityIds] = useState<number[]>([]);
  const [submissions, setSubmissions] = useState<Record<number, ActivityItemSubmission>>({});
  const [activeActivityIndex, setActiveActivityIndex] = useState(0);
  const [loading, setLoading] = useState(true);

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

  const activeActivity: ActivityItem | null = group?.activities?.[activeActivityIndex] || null;
  const isCompleted = activeActivity ? completedActivityIds.includes(activeActivity.id) : false;
  const currentSubmission = activeActivity ? submissions[activeActivity.id] : null;

  // Verificación de Bloqueo Secuencial
  const isActivityLocked = (index: number) => {
    if (index === 0) return false;
    if (!group?.activities) return false;
    for (let j = 0; j < index; j++) {
      const prevAct = group.activities[j];
      if (prevAct && !completedActivityIds.includes(prevAct.id)) {
        return true;
      }
    }
    return false;
  };

  const handleSelectActivity = (index: number) => {
    if (isActivityLocked(index)) {
      const prevTitle = group?.activities?.[index - 1]?.title || 'anterior';
      toast.error(`Actividad Bloqueada: Debes completar la actividad "${prevTitle}" antes de avanzar.`, {
        icon: '🔒',
      });
      return;
    }
    setActiveActivityIndex(index);
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
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-xs font-extrabold">Cargando grupo de actividades...</p>
      </div>
    );
  }

  if (!group || !group.activities || group.activities.length === 0) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Este grupo no contiene actividades publicadas</h2>
        <Link href="/my-activities" className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Volver a mis actividades
        </Link>
      </div>
    );
  }

  const totalActivities = group.activities.length;
  const completedCount = completedActivityIds.length;
  const progressPercentage = Math.round((completedCount / totalActivities) * 100);

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto pb-20">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/my-activities"
            className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {group.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
              {group.description || 'Sigue las actividades paso a paso para completar este grupo.'}
            </p>
          </div>
        </div>

        {/* Progress Bar Widget */}
        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          <div className="text-right">
            <p className="text-xs font-black text-slate-900 dark:text-white">
              {completedCount} de {totalActivities} completadas
            </p>
            <p className="text-[10px] font-bold text-slate-400">{progressPercentage}% del total</p>
          </div>
          <div className="w-24 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Activity Sidebar Navigation (Left) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-3">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-400 px-2">
              Actividades del Grupo
            </h3>

            <div className="space-y-2">
              {group.activities.map((act, index) => {
                const actIsCompleted = completedActivityIds.includes(act.id);
                const actIsLocked = isActivityLocked(index);
                const isActive = index === activeActivityIndex;

                return (
                  <button
                    key={act.id}
                    onClick={() => handleSelectActivity(index)}
                    className={`w-full text-left p-3 rounded-2xl flex items-center gap-3 transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white font-extrabold shadow-md shadow-blue-600/20'
                        : actIsCompleted
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300 font-bold border border-emerald-200/60 dark:border-emerald-900/40'
                        : actIsLocked
                        ? 'bg-slate-100/50 dark:bg-slate-900/30 text-slate-400 dark:text-slate-600 font-medium cursor-not-allowed border border-dashed border-slate-200 dark:border-slate-800'
                        : 'bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 ${
                        isActive
                          ? 'bg-white/20 text-white font-black'
                          : actIsCompleted
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-black'
                          : actIsLocked
                          ? 'bg-slate-200/50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 font-bold'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold'
                      }`}
                    >
                      {actIsCompleted ? <CheckCircle2 className="w-4 h-4" /> : actIsLocked ? <Lock className="w-3.5 h-3.5" /> : index + 1}
                    </div>
                    <span className="text-xs line-clamp-1 flex-1">{act.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Activity Main Viewer (Right) */}
        {activeActivity && (
          <div className="lg:col-span-3 space-y-6">
            {isActivityLocked(activeActivityIndex) ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6 text-center">
                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                  <Lock className="w-8 h-8" />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    Actividad Bloqueada 🔒
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    No puedes acceder ni realizar esta actividad aún. Debes completar y entregar la actividad anterior (<strong>{group.activities[activeActivityIndex - 1]?.title}</strong>) para desbloquearla.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectActivity(activeActivityIndex - 1)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 transition-all shadow-md shadow-blue-600/20 active:scale-95 inline-flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Ir a la Actividad Anterior</span>
                </button>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-8">
              {/* Activity Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-6">
                <div>
                  <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                    Actividad {activeActivityIndex + 1} de {totalActivities}
                  </span>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white mt-2">
                    {activeActivity.title}
                  </h2>
                </div>

                <div className="shrink-0">
                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-4 h-4" />
                      Actividad Completada
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                      <Clock className="w-4 h-4" />
                      Pendiente de Entrega
                    </span>
                  )}
                </div>
              </div>

              {/* Portada de la Actividad (si aplica) */}
              {activeActivity.cover_image && (
                <div className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden shadow-md">
                  <img
                    src={activeActivity.cover_image}
                    alt={activeActivity.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* 5. Contenido Principal: Imagen / Video / Ninguno */}
              {activeActivity.primary_type === 'video' && activeActivity.media_url && (
                <div className="space-y-2">
                  <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">
                    Video Principal de la Actividad
                  </h4>
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
                </div>
              )}

              {activeActivity.primary_type === 'image' && activeActivity.media_url && (
                <div className="space-y-2">
                  <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">
                    Imagen Principal de la Actividad
                  </h4>
                  <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
                    <img
                      src={activeActivity.media_url}
                      alt={activeActivity.title}
                      className="w-full max-h-[500px] object-contain bg-black"
                    />
                  </div>
                </div>
              )}

              {/* 6. Contenido Teórico / Texto Enriquecido */}
              {activeActivity.content && (
                <div className="space-y-3 pt-2">
                  <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">
                    Contenido Teórico
                  </h4>
                  <div
                    dangerouslySetInnerHTML={{ __html: activeActivity.content }}
                    className="prose dark:prose-invert max-w-none text-xs leading-relaxed text-slate-700 dark:text-slate-300"
                  />
                </div>
              )}

              {/* 7 & 8. Recursos de la Actividad (Separados del medio principal) */}
              {activeActivity.resources && activeActivity.resources.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">
                    Recursos de la Actividad
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeActivity.resources.map((res) => (
                      <div
                        key={res.id}
                        className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
                            {res.type === 'pdf' && <FileText className="w-4 h-4" />}
                            {res.type === 'video' && <Video className="w-4 h-4" />}
                            {res.type === 'image' && <ImageIcon className="w-4 h-4" />}
                            {res.type === 'file' && <FileCheck className="w-4 h-4" />}
                          </div>
                          <div className="min-w-0">
                            <p className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                              {res.title}
                            </p>
                            <p className="text-[10px] text-slate-400 uppercase font-bold">
                              {res.type}
                            </p>
                          </div>
                        </div>

                        <a
                          href={res.source_type === 'url' ? res.external_url! : activityService.getResourceStreamUrl(res.id, true)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-blue-600 border border-slate-200 dark:border-slate-700 text-xs font-bold shrink-0 transition-colors"
                          title="Descargar / Abrir"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 9 & 10. Mi Actividad / Mi Entrega */}
              <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="p-6 rounded-3xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
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
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        Esta actividad es únicamente de consulta de contenido. Pulsa el botón para marcarla como completada.
                      </p>
                    )}

                    {/* Caso 2: Entrega de Texto */}
                    {activeActivity.submission_type === 'text' && (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Escribe tu respuesta *
                        </label>
                        <textarea
                          rows={4}
                          value={submissionText}
                          onChange={(e) => setSubmissionText(e.target.value)}
                          placeholder="Ingresa la respuesta o desarrollo solicitado..."
                          className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}

                    {/* Caso 3, 4, 5: Entrega de Archivo PDF, Video o Imagen */}
                    {['pdf', 'video', 'image'].includes(activeActivity.submission_type) && (
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
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
                          : 'Enviar Actividad'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
  );
};

export default MyActivityDetailPage;
