'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, BookOpen, Video, FileText, CheckCircle2, PlayCircle, Download, ExternalLink, Loader2, Sparkles, AlertCircle
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
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Cargando contenido del curso...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-8 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Curso no encontrado o sin acceso</h2>
        <Link href="/my-courses" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs">
          Volver a Mis Cursos
        </Link>
      </div>
    );
  }

  const resources = course.resources || [];
  const isCompleted = assignment?.status === 'completed';

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/my-courses"
            className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Capacitación en Línea</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {course.title}
            </h1>
          </div>
        </div>

        {/* Complete Action Button */}
        <div className="flex items-center gap-3">
          {isCompleted ? (
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold text-xs border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Curso Completado</span>
            </div>
          ) : (
            <button
              onClick={handleComplete}
              disabled={completing}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-600/30 active:scale-95 disabled:opacity-50"
            >
              {completing ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
              <span>Marcar como Completado</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Media Player / Viewer & Rich Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Media Player Container */}
          <div className="bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col">
            {activeResource ? (
              <div className="relative">
                {activeResource.type === 'video' ? (
                  <video
                    controls
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
                    {/* Embedded PDF iframe */}
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

          {/* Description & Rich Text Content */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            {course.description && (
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Descripción del Curso</h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-medium">
                  {course.description}
                </p>
              </div>
            )}

            {course.content && (
              <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Contenido Teórico & Material</h3>
                <div
                  className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: course.content }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Playlist of Resources */}
        <div className="space-y-6">
          {/* Main Image Header Card */}
          {course.main_image && (
            <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 h-48 bg-slate-100 dark:bg-slate-800 shadow-sm">
              <img src={course.main_image} alt={course.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Resources Playlist */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Recursos del Curso</h3>
              <span className="text-xs font-bold text-slate-400">{resources.length} tema(s)</span>
            </div>

            {resources.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">Este curso no tiene videos ni archivos adjuntos.</p>
            ) : (
              <div className="space-y-2">
                {resources.map((resource, idx) => {
                  const isActive = activeResource?.id === resource.id;
                  return (
                    <button
                      key={resource.id}
                      onClick={() => setActiveResource(resource)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left transition-all ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-300 font-extrabold shadow-2xs'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-bold border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${
                          resource.type === 'video' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400' : 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400'
                        }`}>
                          {resource.type === 'video' ? <Video className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-xs line-clamp-1">{idx + 1}. {resource.title}</p>
                          <span className="text-[10px] text-slate-400 uppercase">{resource.type}</span>
                        </div>
                      </div>

                      {isActive && <PlayCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCourseDetailPage;
