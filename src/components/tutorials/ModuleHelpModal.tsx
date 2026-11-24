'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, Video, BookOpen, ExternalLink, HelpCircle, Edit3, Save, 
  CheckCircle2, AlertCircle, Play, Info, Sparkles, RefreshCw, Eye
} from 'lucide-react';
import { Portal } from '@/components/Portal';
import { parseVideoUrl } from '@/utils/videoEmbedHelper';
import moduleTutorialService from '@/services/moduleTutorialService';
import { CurrentModuleTutorialData, ModuleTutorial } from '@/types';
import toast from 'react-hot-toast';

interface ModuleHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleKey?: string;
  path?: string;
  onUpdated?: () => void;
}

export const ModuleHelpModal: React.FC<ModuleHelpModalProps> = ({
  isOpen,
  onClose,
  moduleKey,
  path,
  onUpdated,
}) => {
  const [data, setData] = useState<CurrentModuleTutorialData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'video' | 'manual'>('video');

  // Admin edit mode inside modal
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formManualUrl, setFormManualUrl] = useState('');
  const [formManualContent, setFormManualContent] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);

  const fetchCurrentTutorial = async () => {
    setLoading(true);
    try {
      const res = await moduleTutorialService.getCurrentTutorial({
        module_key: moduleKey,
        path: path || (typeof window !== 'undefined' ? window.location.pathname : undefined),
      });
      setData(res);

      if (res?.tutorial) {
        setFormTitle(res.tutorial.title || '');
        setFormDescription(res.tutorial.description || '');
        setFormVideoUrl(res.tutorial.video_url || '');
        setFormManualUrl(res.tutorial.manual_url || '');
        setFormManualContent(res.tutorial.manual_content || '');
        setFormIsActive(res.tutorial.is_active ?? true);

        // Pick initial active tab based on what is available
        if (res.tutorial.video_url) {
          setActiveTab('video');
        } else if (res.tutorial.manual_url || res.tutorial.manual_content) {
          setActiveTab('manual');
        }
      } else {
        setFormTitle(res?.module_meta?.name ? `Tutorial de ${res.module_meta.name}` : '');
        setFormDescription(res?.module_meta?.description || '');
        setFormVideoUrl('');
        setFormManualUrl('');
        setFormManualContent('');
        setFormIsActive(true);
      }
    } catch (err) {
      console.error('Error al cargar tutorial del módulo:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setIsEditing(false);
      fetchCurrentTutorial();
    }
  }, [isOpen, moduleKey, path]);

  const handleSaveTutorial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data?.module_key) return;

    setIsSaving(true);
    try {
      const saved = await moduleTutorialService.saveTutorial({
        module_key: data.module_key,
        title: formTitle,
        description: formDescription,
        video_url: formVideoUrl,
        manual_url: formManualUrl,
        manual_content: formManualContent,
        is_active: formIsActive,
        white_label_id: data.white_label_id,
      });

      toast.success('¡Tutorial guardado exitosamente!');
      setIsEditing(false);
      
      // Update local state
      setData(prev => prev ? {
        ...prev,
        tutorial: saved,
        has_tutorial: Boolean(saved.video_url || saved.manual_url || saved.manual_content),
        is_fallback: false,
      } : null);

      if (saved.video_url) {
        setActiveTab('video');
      } else if (saved.manual_url || saved.manual_content) {
        setActiveTab('manual');
      }

      if (onUpdated) {
        onUpdated();
      }
    } catch (err: any) {
      console.error('Error al guardar tutorial:', err);
      toast.error(err?.response?.data?.message || 'Error al guardar el tutorial');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const tutorial = data?.tutorial;
  const moduleMeta = data?.module_meta;
  const videoInfo = parseVideoUrl(tutorial?.video_url);
  const previewVideoInfo = parseVideoUrl(formVideoUrl);

  const moduleName = moduleMeta?.name || tutorial?.title || 'Módulo';
  const category = moduleMeta?.category || 'SISTEMA';

  return (
    <Portal>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity" 
          onClick={onClose} 
        />

        {/* Modal Container */}
        <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh] animate-slide-up-fade">
          
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                    {category}
                  </span>
                  {data?.is_fallback && (
                    <span className="text-[10px] font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                      Tutorial Genérico
                    </span>
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                  {tutorial?.title || moduleName}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              {/* WhiteLabel Admin edit button toggle */}
              {data?.can_manage && (
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all active:scale-95 cursor-pointer ${
                    isEditing 
                      ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900' 
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                  title={isEditing ? 'Volver a la vista previa' : 'Configurar tutorial como Marca Blanca'}
                >
                  {isEditing ? (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Ver Tutorial</span>
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
                      <span className="hidden sm:inline">Administrar</span>
                    </>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Cerrar modal de ayuda"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-6 overflow-y-auto flex-1">
            {loading ? (
              <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
                <RefreshCw className="w-7 h-7 animate-spin text-sky-500" />
                <p className="text-xs font-semibold">Cargando material de ayuda...</p>
              </div>
            ) : isEditing ? (
              /* ================= MODE: ADMIN EDIT FORM ================= */
              <form onSubmit={handleSaveTutorial} className="space-y-4">
                <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-xl flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-indigo-900 dark:text-indigo-200">
                    <p className="font-bold">Administración de Tutorial para tu Marca Blanca</p>
                    <p className="text-[11px] opacity-80 mt-0.5">
                      Los asesores, agentes y usuarios de tus agencias verán este video y manual al presionar el botón de ayuda en este módulo.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Título del Tutorial
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder={`Ej: Guía completa de ${moduleName}`}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Descripción / Resumen del Módulo
                  </label>
                  <textarea
                    rows={2}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Breve explicación de qué se hace en este módulo y mejores prácticas..."
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Enlace de Video (YouTube, Vimeo, Loom o MP4)
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={formVideoUrl}
                        onChange={(e) => setFormVideoUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=... o Loom"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white"
                      />
                      <Video className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                    {formVideoUrl && (
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                        Formato detectado: <strong className="uppercase text-sky-600 dark:text-sky-400">{previewVideoInfo.type}</strong>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Enlace a Manual Online (Google Docs, Notion, PDF)
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={formManualUrl}
                        onChange={(e) => setFormManualUrl(e.target.value)}
                        placeholder="https://docs.google.com/... o enlace de tu manual"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white"
                      />
                      <ExternalLink className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Se abrirá en una nueva pestaña al hacer clic.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Guía Rápida / Pasos Clave en Texto (Opcional)
                  </label>
                  <textarea
                    rows={4}
                    value={formManualContent}
                    onChange={(e) => setFormManualContent(e.target.value)}
                    placeholder="Paso 1: Haz clic en Crear...&#10;Paso 2: Llena los datos requeridos...&#10;Paso 3: Presiona Guardar."
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={formIsActive}
                      onChange={(e) => setFormIsActive(e.target.checked)}
                      className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-4 h-4"
                    />
                    <span>Tutorial Activo y Visible para los usuarios</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Guardando...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          <span>Guardar Tutorial</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            ) : !data?.has_tutorial ? (
              /* ================= MODE: EMPTY STATE ================= */
              <div className="py-12 px-4 text-center max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
                  <Video className="w-8 h-8 opacity-60" />
                </div>
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
                  Tutorial en Preparación
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                  {moduleMeta?.description || 'Este módulo te permite gestionar las operaciones de tu agencia de forma rápida e intuitiva.'}
                </p>

                {data?.can_manage ? (
                  <div className="p-4 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 rounded-xl">
                    <p className="text-xs font-semibold text-sky-800 dark:text-sky-300 mb-3">
                      Como administrador de Marca Blanca, puedes subir el video y el enlace al manual de este módulo:
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm transition-all active:scale-95 cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Configurar Video y Manual</span>
                    </button>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    <Info className="w-3.5 h-3.5" />
                    <span>Tu Marca Blanca publicará el material instructivo próximamente.</span>
                  </div>
                )}
              </div>
            ) : (
              /* ================= MODE: VIEW TUTORIAL ================= */
              <div className="space-y-4">
                {/* Description Banner if exists */}
                {tutorial?.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    {tutorial.description}
                  </p>
                )}

                {/* Tabs selection if both video & manual are available */}
                {(tutorial?.video_url && (tutorial?.manual_url || tutorial?.manual_content)) && (
                  <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4">
                    <button
                      type="button"
                      onClick={() => setActiveTab('video')}
                      className={`flex items-center gap-2 pb-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                        activeTab === 'video'
                          ? 'border-sky-600 text-sky-600 dark:text-sky-400 dark:border-sky-400'
                          : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                      }`}
                    >
                      <Video className="w-4 h-4" />
                      <span>Video Tutorial</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('manual')}
                      className={`flex items-center gap-2 pb-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                        activeTab === 'manual'
                          ? 'border-sky-600 text-sky-600 dark:text-sky-400 dark:border-sky-400'
                          : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Manual de Usuario</span>
                    </button>
                  </div>
                )}

                {/* TAB CONTENT: VIDEO */}
                {activeTab === 'video' && tutorial?.video_url && (
                  <div className="space-y-3">
                    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
                      {videoInfo.type === 'youtube' || videoInfo.type === 'vimeo' || videoInfo.type === 'loom' ? (
                        <iframe
                          src={videoInfo.embedUrl || undefined}
                          title={tutorial.title || 'Video Tutorial'}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : videoInfo.type === 'direct' ? (
                        <video
                          src={videoInfo.embedUrl || undefined}
                          controls
                          playsInline
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white bg-slate-900">
                          <Play className="w-12 h-12 text-sky-400 mb-2 opacity-80" />
                          <p className="text-sm font-bold mb-2">Video disponible en enlace externo</p>
                          <a
                            href={tutorial.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-md"
                          >
                            <span>Abrir Video en Nueva Pestaña</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}
                    </div>

                    {tutorial.manual_url && (
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                          <span className="text-xs text-slate-700 dark:text-slate-200 font-medium">
                            ¿Prefieres leer la documentación paso a paso?
                          </span>
                        </div>
                        <a
                          href={tutorial.manual_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex-shrink-0"
                        >
                          <span>Ver Manual</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB CONTENT: MANUAL */}
                {(activeTab === 'manual' || !tutorial?.video_url) && (
                  <div className="space-y-4">
                    {tutorial?.manual_url && (
                      <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-sky-500/10 to-transparent border border-indigo-200 dark:border-indigo-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md flex-shrink-0">
                            <BookOpen className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                              Manual de Usuario Oficial
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              Consulta la guía en línea con capturas de pantalla, procedimientos y preguntas frecuentes.
                            </p>
                          </div>
                        </div>

                        <a
                          href={tutorial.manual_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all active:scale-95 flex-shrink-0 cursor-pointer"
                        >
                          <span>Abrir Manual Online</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}

                    {tutorial?.manual_content && (
                      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-800/30">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                          Instrucciones y Procedimiento Rápido
                        </h5>
                        <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                          {tutorial.manual_content}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex justify-between items-center text-[11px] text-slate-400">
            <span>Soporte y Asistencia • Marca Blanca</span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default ModuleHelpModal;
