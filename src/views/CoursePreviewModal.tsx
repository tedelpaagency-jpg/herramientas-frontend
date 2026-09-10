'use client';

import React, { useEffect, useState } from 'react';
import { 
  X, Eye, BookOpen, Video, FileText, Download, Loader2, Sparkles, AlertCircle, 
  Clock, FolderOpen, File, PlayCircle, Layers, CheckCircle2, ArrowLeft 
} from 'lucide-react';
import courseService from '../services/courseService';
import { Course, CourseSection, CourseSectionMaterial } from '../types/course';
import toast from 'react-hot-toast';
import { sanitizeHtml } from '../utils/sanitize';
import SectionVideo from '../components/SectionVideo';

const formatImageUrl = (url?: string | null) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  return `${baseUrl}/${url.replace(/^\//, '')}`;
};

interface CoursePreviewModalProps {
  courseId: number | string;
  onClose: () => void;
}

export const CoursePreviewModal: React.FC<CoursePreviewModalProps> = ({ courseId, onClose }) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  // Estado de Sección y Material Activos
  const [activeSectionId, setActiveSectionId] = useState<number | null>(null);
  const [activeMaterialId, setActiveMaterialId] = useState<number | null>(null);

  // 'overview' = Vista de Resumen, 'player' = Visualizador de Lección/Video
  const [viewMode, setViewMode] = useState<'overview' | 'player'>('overview');

  useEffect(() => {
    const fetchPreview = async () => {
      setLoading(true);
      try {
        const res = await courseService.getCoursePreview(courseId);
        if (res.status === 'success' && res.data) {
          setCourse(res.data);
          const secs = res.data.sections || [];
          if (secs.length > 0) {
            setActiveSectionId(secs[0].id);
            const firstMat = secs[0].materials?.[0];
            if (firstMat) {
              setActiveMaterialId(firstMat.id);
            }
          }
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Error al cargar la vista previa del curso');
        onClose();
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [courseId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl">
          <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 animate-pulse">
            Cargando vista previa del curso...
          </p>
        </div>
      </div>
    );
  }

  if (!course) return null;

  const sections = course.sections || [];
  const activeSection = sections.find(s => s.id === activeSectionId) || sections[0];
  const sectionMaterials = activeSection?.materials || [];

  const sectionVideoMaterial = sectionMaterials.find(m => m.type === 'video');
  const sectionResources = sectionMaterials.filter(m => m.id !== sectionVideoMaterial?.id);
  const activeResource = sectionResources.find(m => m.id === activeMaterialId) || sectionResources[0];

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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl my-auto">
        
        {/* BANNER DISTINTIVO DE MODO SIMULACIÓN VISTA PREVIA */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-600 to-amber-600 px-4 py-2.5 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-wider">
            <Eye className="w-4 h-4 animate-pulse" />
            <span>VISTA PREVIA DEL CURSO — Modo Simulación Administrador</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors"
            title="Cerrar vista previa"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENIDO PRINCIPAL MODAL */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          
          {/* Header Bar del Curso */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-[#00e699] text-xs font-extrabold border border-emerald-200 dark:border-emerald-800 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Experiencia de Estudiante</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {course.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {viewMode === 'player' && (
                <button
                  onClick={() => setViewMode('overview')}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-extrabold text-slate-800 dark:text-white transition-colors border border-slate-300 dark:border-slate-700"
                >
                  Ver Resumen del Curso
                </button>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-opacity"
              >
                Cerrar Preview
              </button>
            </div>
          </div>

          {/* VISTA 1: OVERVIEW / RESUMEN DEL CURSO */}
          {viewMode === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Columna Izquierda: Portada + Descripción + Secciones */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Portada Principal */}
                <div className="relative h-64 sm:h-80 rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl group">
                  {course.main_image ? (
                    <img
                      src={formatImageUrl(course.main_image)!}
                      alt={course.title}
                      className="w-full h-full object-cover opacity-90"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-600 to-slate-900 flex flex-col items-center justify-center text-white">
                      <BookOpen className="w-16 h-16 opacity-40 mb-2" />
                      <span className="text-sm font-bold opacity-60">Vista previa de portada</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-6">
                    <div className="space-y-2 text-white">
                      <h3 className="text-xl sm:text-2xl font-black drop-shadow-md">{course.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-200">
                        <span className="flex items-center gap-1.5"><Layers className="w-4 h-4 text-emerald-400" /> {sections.length} Lección(es)</span>
                        <span className="flex items-center gap-1.5"><FolderOpen className="w-4 h-4 text-blue-400" /> {course.resources?.length || 0} Recurso(s) adjunto(s)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Descripción del Curso */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
                  <h4 className="text-sm font-black uppercase text-slate-900 dark:text-white tracking-wider">Acerca de este Curso</h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {course.description || 'Sin descripción ingresada.'}
                  </p>
                  {course.content && (
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300 prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: course.content }} />
                  )}
                </div>

                {/* Temario / Secciones en Acordeón o Lista */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black uppercase text-slate-900 dark:text-white tracking-wider">Programa de Estudio</h4>
                    <span className="text-xs font-bold text-slate-400">{sections.length} secciones en total</span>
                  </div>

                  {sections.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-4 text-center">Este curso aún no tiene secciones cargadas.</p>
                  ) : (
                    <div className="space-y-3">
                      {sections.map((sec, idx) => {
                        const secMats = sec.materials || [];
                        return (
                          <div
                            key={sec.id}
                            onClick={() => {
                              setActiveSectionId(sec.id);
                              if (secMats.length > 0) setActiveMaterialId(secMats[0].id);
                              setViewMode('player');
                            }}
                            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 bg-slate-50 dark:bg-slate-950/50 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-all cursor-pointer flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-[#00e699] font-black text-xs flex items-center justify-center shrink-0">
                                {idx + 1}
                              </div>
                              <div className="min-w-0 space-y-0.5">
                                <h5 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-[#00e699] transition-colors truncate">
                                  {sec.title}
                                </h5>
                                <p className="text-[11px] text-slate-400 font-semibold flex items-center gap-2">
                                  {sec.duration && <span>⏱️ {sec.duration}</span>}
                                  <span>• {secMats.length} material(es)</span>
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-emerald-600 dark:text-[#00e699] opacity-0 group-hover:opacity-100 transition-opacity">Ver Lección →</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Columna Derecha: Tarjeta Lateral de Acceso a la Lección */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-5 shadow-sm sticky top-4">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Acceso a la Aula Virtual</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Haz clic a continuación para reproducir los videos y recursos como lo experimentará un colaborador.
                  </p>
                  
                  <button
                    onClick={() => setViewMode('player')}
                    disabled={sections.length === 0}
                    className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold text-xs transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 active:scale-95"
                  >
                    <PlayCircle className="w-5 h-5" />
                    <span>Iniciar Simulación de Lección</span>
                  </button>

                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-[11px] font-medium leading-relaxed">
                    ℹ️ <strong>Modo Vista Previa:</strong> Las acciones realizadas en este reproductor no alteran las estadísticas ni registran avance real en la base de datos.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VISTA 2: PLAYER / REPRODUCTOR PRINCIPAL DE LECCIONES */}
          {viewMode === 'player' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Visualizador Principal de la Sección Activa */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* 1. VIDEO PRINCIPAL DE LA SECCIÓN */}
                <div className="bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col min-h-[340px]">
                  {sectionVideoMaterial ? (
                    <div className="relative flex-1 flex flex-col">
                      <SectionVideo material={sectionVideoMaterial} />
                      <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                        <span className="font-bold flex items-center gap-2">
                          <Video className="w-4 h-4 text-emerald-400" />
                          <span>Video de la Sección: {sectionVideoMaterial.title}</span>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video bg-slate-900 flex flex-col items-center justify-center text-slate-500 space-y-2 p-8 text-center rounded-3xl">
                      <BookOpen className="w-12 h-12 text-slate-700" />
                      <p className="text-xs font-bold text-slate-300">Esta sección no contiene video propio.</p>
                    </div>
                  )}
                </div>

                {/* 2. CONTENIDO TEÓRICO / EXPLICACIÓN DE LA SECCIÓN */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
                  <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-[#00e699] tracking-widest">
                    Contenido Teórico / Explicación
                  </span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {activeSection?.title || 'Sección Seleccionada'}
                  </h3>
                  {(activeSection?.content || activeSection?.description) ? (
                    <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed prose dark:prose-invert max-w-none pt-1" dangerouslySetInnerHTML={{ __html: sanitizeHtml(activeSection.content || activeSection.description || '') }} />
                  ) : (
                    <p className="text-xs text-slate-400 italic">Sin notas teóricas para esta sección.</p>
                  )}
                </div>

                {/* 3. RECURSOS ADICIONALES DE LA SECCIÓN (PDFS, ARCHIVOS) */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <FolderOpen className="w-4 h-4 text-emerald-500" />
                    <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider">
                      Recursos de la Sección ({sectionResources.length})
                    </h4>
                  </div>

                  {sectionResources.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-2">Esta sección no posee recursos o documentos adicionales.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {sectionResources.map((mat) => (
                        <div
                          key={mat.id}
                          onClick={() => setActiveMaterialId(mat.id)}
                          className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between gap-2 text-xs font-bold"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {getMaterialIcon(mat.type, 'w-4 h-4 text-slate-500 shrink-0')}
                            <span className="truncate text-slate-800 dark:text-slate-200">{mat.title}</span>
                          </div>
                          <a
                            href={courseService.getMaterialStreamUrl(mat.id, true)}
                            download
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Columna Derecha: Lista de Secciones y Materiales */}
              <div className="space-y-4">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                  <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider">
                    Contenido del Curso
                  </h4>

                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                    {sections.map((sec, secIdx) => {
                      const secMats = sec.materials || [];
                      const isSecActive = sec.id === activeSectionId;

                      return (
                        <div key={sec.id} className="space-y-2">
                          <button
                            onClick={() => {
                              setActiveSectionId(sec.id);
                              if (secMats.length > 0) setActiveMaterialId(secMats[0].id);
                            }}
                            className={`w-full p-3 rounded-2xl text-left transition-all flex items-center justify-between text-xs font-extrabold ${
                              isSecActive
                                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                                : 'bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <span className="truncate pr-2">{secIdx + 1}. {sec.title}</span>
                            <span className="text-[10px] opacity-80 shrink-0">{secMats.length} mat.</span>
                          </button>

                          {/* Lista de Materiales de la Sección */}
                          {isSecActive && secMats.length > 0 && (
                            <div className="pl-3 space-y-1.5 border-l-2 border-emerald-500/30">
                              {secMats.map((mat) => {
                                const isMatActive = mat.id === activeMaterialId;
                                return (
                                  <button
                                    key={mat.id}
                                    onClick={() => setActiveMaterialId(mat.id)}
                                    className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center gap-2 text-xs font-semibold ${
                                      isMatActive
                                        ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-[#00e699] font-bold border border-emerald-300 dark:border-emerald-800'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                  >
                                    {getMaterialIcon(mat.type, 'w-3.5 h-3.5 shrink-0')}
                                    <span className="truncate">{mat.title}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CoursePreviewModal;
