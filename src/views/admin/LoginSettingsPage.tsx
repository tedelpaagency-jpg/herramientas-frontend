'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  Image as ImageIcon, 
  Upload, 
  Trash2, 
  RefreshCw, 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  X, 
  AlertCircle, 
  Loader2, 
  Play, 
  Eye, 
  Film,
  Sparkles,
  Layers,
  Edit2,
  Type,
  Save,
  RotateCcw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { loginMediaService } from '../../services/loginMediaService';
import { LoginVideo, LoginLogo, LoginTexts } from '../../types/loginMedia';
import { normalizeFileUrl } from '../../services/apiClient';

export const LoginSettingsPage: React.FC = () => {
  // === NAVEGACIÓN POR PESTAÑAS ===
  const [activeTab, setActiveTab] = useState<'videos' | 'logos' | 'texts'>('videos');

  // === ESTADOS DE VIDEOS ===
  const [videos, setVideos] = useState<LoginVideo[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [uploadVideoProgress, setUploadVideoProgress] = useState<string | null>(null);

  // Modal para Agregar Video
  const [isAddVideoModalOpen, setIsAddVideoModalOpen] = useState(false);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoSubtitle, setVideoSubtitle] = useState('');
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [videoLocalPreview, setVideoLocalPreview] = useState<string | null>(null);

  // Reemplazar Video
  const replaceVideoInputRef = useRef<HTMLInputElement | null>(null);
  const [replacingVideoId, setReplacingVideoId] = useState<number | null>(null);

  // === ESTADOS DE LOGOS ===
  const [logos, setLogos] = useState<LoginLogo[]>([]);
  const [isLoadingLogos, setIsLoadingLogos] = useState(true);
  const [isSavingLogo, setIsSavingLogo] = useState(false);

  // Modal para Agregar / Editar Logo
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [editingLogo, setEditingLogo] = useState<LoginLogo | null>(null);
  const [logoName, setLogoName] = useState('');
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);
  const [logoLocalPreview, setLogoLocalPreview] = useState<string | null>(null);

  // === ESTADOS DE TEXTOS DEL LOGIN ===
  const [loginTexts, setLoginTexts] = useState<LoginTexts>({
    portal_badge: 'Provider Portal',
    main_title: 'Plataforma de gestión empresarial conectada a Laravel.',
    main_subtitle: 'Accede a tu panel centralizado para inmuebles, CRM, POS y documentos legales.',
    form_title: 'Bienvenido',
    form_subtitle: 'Ingresa tus credenciales para acceder al panel de control.',
    footer_text: 'Con el respaldo de la arquitectura Laravel 12 & Next.js',
    card_badge: 'Premium',
    card_button_text: 'Explorar módulo',
  });
  const [isLoadingTexts, setIsLoadingTexts] = useState(true);
  const [isSavingTexts, setIsSavingTexts] = useState(false);

  // Carga inicial de datos
  useEffect(() => {
    fetchVideos();
    fetchLogos();
    fetchTexts();
  }, []);

  // Cleanup de URLs locales de preview
  useEffect(() => {
    return () => {
      if (videoLocalPreview) URL.revokeObjectURL(videoLocalPreview);
      if (logoLocalPreview) URL.revokeObjectURL(logoLocalPreview);
    };
  }, [videoLocalPreview, logoLocalPreview]);

  // =========================================================================
  // GESTIÓN DE VIDEOS
  // =========================================================================

  const fetchVideos = async () => {
    setIsLoadingVideos(true);
    try {
      const data = await loginMediaService.getVideos();
      setVideos(data);
    } catch (err: any) {
      toast.error('No se pudieron cargar los videos configurados.');
    } finally {
      setIsLoadingVideos(false);
    }
  };

  const handleVideoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isMp4 = file.name.toLowerCase().endsWith('.mp4') || file.type.includes('mp4') || file.type.includes('video');
    if (!isMp4) {
      toast.error('El archivo debe ser en formato MP4 (.mp4).');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast.error('El video supera el tamaño máximo permitido (100MB).');
      return;
    }

    setSelectedVideoFile(file);
    if (!videoTitle) {
      const defaultName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setVideoTitle(defaultName.charAt(0).toUpperCase() + defaultName.slice(1));
    }
    const previewUrl = URL.createObjectURL(file);
    setVideoLocalPreview(previewUrl);
  };

  const handleCreateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVideoFile) {
      toast.error('Debes seleccionar un archivo de video MP4.');
      return;
    }
    if (!videoTitle.trim()) {
      toast.error('Ingresa un título para el video.');
      return;
    }

    setIsUploadingVideo(true);
    setUploadVideoProgress('Preparando subida...');

    try {
      const formData = new FormData();
      formData.append('title', videoTitle.trim());
      if (videoSubtitle.trim()) {
        formData.append('subtitle', videoSubtitle.trim());
      }
      formData.append('video', selectedVideoFile);
      formData.append('is_active', '1');

      await loginMediaService.createVideo(formData, (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadVideoProgress(`Subiendo video (${percent}%)...`);
        }
      });

      toast.success('Video subido y configurado exitosamente.');
      setIsAddVideoModalOpen(false);
      setVideoTitle('');
      setVideoSubtitle('');
      setSelectedVideoFile(null);
      setVideoLocalPreview(null);
      await fetchVideos();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.video?.[0] || 'No se pudo subir el video. Verifica tu conexión o intenta nuevamente.';
      toast.error(msg);
    } finally {
      setIsUploadingVideo(false);
      setUploadVideoProgress(null);
    }
  };

  const handleToggleVideoStatus = async (video: LoginVideo) => {
    const targetState = !video.is_active;

    try {
      const formData = new FormData();
      formData.append('is_active', targetState ? '1' : '0');
      await loginMediaService.updateVideo(video.id, formData);
      setVideos(prev => prev.map(v => v.id === video.id ? { ...v, is_active: targetState } : v));
      toast.success(targetState ? 'Video activado.' : 'Video desactivado.');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'No se pudo actualizar el estado.');
    }
  };

  const triggerReplaceVideo = (videoId: number) => {
    setReplacingVideoId(videoId);
    if (replaceVideoInputRef.current) {
      replaceVideoInputRef.current.value = '';
      replaceVideoInputRef.current.click();
    }
  };

  const handleReplaceVideoSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !replacingVideoId) return;

    const isMp4 = file.name.toLowerCase().endsWith('.mp4') || file.type.includes('mp4') || file.type.includes('video');
    if (!isMp4) {
      toast.error('El archivo debe ser en formato MP4 (.mp4).');
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      toast.error('El video supera el tamaño máximo permitido (100MB).');
      return;
    }

    setIsUploadingVideo(true);
    setUploadVideoProgress('Preparando reemplazo...');

    try {
      const formData = new FormData();
      formData.append('video', file);
      await loginMediaService.updateVideo(replacingVideoId, formData, (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadVideoProgress(`Reemplazando video (${percent}%)...`);
        }
      });
      toast.success('Video reemplazado exitosamente.');
      await fetchVideos();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'No se pudo reemplazar el archivo. Intenta de nuevo.');
    } finally {
      setIsUploadingVideo(false);
      setUploadVideoProgress(null);
      setReplacingVideoId(null);
    }
  };

  const handleDeleteVideo = async (video: LoginVideo) => {
    if (!window.confirm(`¿Estás seguro de eliminar el video "${video.title}"?`)) {
      return;
    }

    try {
      await loginMediaService.deleteVideo(video.id);
      setVideos(prev => prev.filter(v => v.id !== video.id));
      toast.success('Video eliminado correctamente.');
    } catch (err: any) {
      toast.error('No se pudo eliminar el video.');
    }
  };

  const handleMoveVideo = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= videos.length) return;

    const newVideos = [...videos];
    const [moved] = newVideos.splice(index, 1);
    newVideos.splice(targetIndex, 0, moved);
    setVideos(newVideos);

    try {
      await loginMediaService.reorderVideos(newVideos.map(v => v.id));
      toast.success('Orden de videos actualizado.');
    } catch {
      toast.error('Error al guardar el nuevo orden.');
      await fetchVideos();
    }
  };

  // =========================================================================
  // GESTIÓN DE LOGOS
  // =========================================================================

  const fetchLogos = async () => {
    setIsLoadingLogos(true);
    try {
      const data = await loginMediaService.getLogos();
      setLogos(data);
    } catch (err: any) {
      toast.error('No se pudieron cargar los logos del login.');
    } finally {
      setIsLoadingLogos(false);
    }
  };

  const openAddLogoModal = () => {
    setEditingLogo(null);
    setLogoName('');
    setSelectedLogoFile(null);
    setLogoLocalPreview(null);
    setIsLogoModalOpen(true);
  };

  const openEditLogoModal = (logo: LoginLogo) => {
    setEditingLogo(logo);
    setLogoName(logo.name);
    setSelectedLogoFile(null);
    setLogoLocalPreview(null);
    setIsLogoModalOpen(true);
  };

  const handleLogoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validExtensions = ['png', 'jpg', 'jpeg', 'webp', 'svg'];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!validExtensions.includes(ext) && !file.type.startsWith('image/')) {
      toast.error('Formato no soportado. Usa PNG, JPG, WEBP o SVG.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('La imagen supera los 10MB.');
      return;
    }

    setSelectedLogoFile(file);
    if (!logoName) {
      const defaultName = file.name.replace(/\.[^/.]+$/, '').toUpperCase();
      setLogoName(defaultName);
    }
    const previewUrl = URL.createObjectURL(file);
    setLogoLocalPreview(previewUrl);
  };

  const handleSaveLogo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logoName.trim()) {
      toast.error('El nombre del logo es obligatorio.');
      return;
    }

    setIsSavingLogo(true);
    try {
      const formData = new FormData();
      formData.append('name', logoName.trim());
      if (selectedLogoFile) {
        formData.append('logo', selectedLogoFile);
      }

      if (editingLogo) {
        await loginMediaService.updateLogo(editingLogo.id, formData);
        toast.success('Logo actualizado exitosamente.');
      } else {
        formData.append('is_active', '1');
        await loginMediaService.createLogo(formData);
        toast.success('Logo agregado exitosamente.');
      }

      setIsLogoModalOpen(false);
      await fetchLogos();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'No se pudo guardar el logo.');
    } finally {
      setIsSavingLogo(false);
    }
  };

  const handleToggleLogoStatus = async (logo: LoginLogo) => {
    const targetState = !logo.is_active;
    try {
      const formData = new FormData();
      formData.append('is_active', targetState ? '1' : '0');
      await loginMediaService.updateLogo(logo.id, formData);
      setLogos(prev => prev.map(l => l.id === logo.id ? { ...l, is_active: targetState } : l));
      toast.success(targetState ? 'Logo activado.' : 'Logo desactivado.');
    } catch (err: any) {
      toast.error('No se pudo actualizar el estado del logo.');
    }
  };

  const handleDeleteLogo = async (logo: LoginLogo) => {
    if (!window.confirm(`¿Eliminar el logo "${logo.name}"?`)) {
      return;
    }

    try {
      await loginMediaService.deleteLogo(logo.id);
      setLogos(prev => prev.filter(l => l.id !== logo.id));
      toast.success('Logo eliminado correctamente.');
    } catch {
      toast.error('No se pudo eliminar el logo.');
    }
  };

  const handleMoveLogo = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= logos.length) return;

    const newLogos = [...logos];
    const [moved] = newLogos.splice(index, 1);
    newLogos.splice(targetIndex, 0, moved);
    setLogos(newLogos);

    try {
      await loginMediaService.reorderLogos(newLogos.map(l => l.id));
      toast.success('Orden de logos actualizado.');
    } catch {
      toast.error('Error al guardar el nuevo orden.');
      await fetchLogos();
    }
  };

  // =========================================================================
  // GESTIÓN DE TEXTOS DEL LOGIN
  // =========================================================================

  const fetchTexts = async () => {
    setIsLoadingTexts(true);
    try {
      const data = await loginMediaService.getLoginTexts();
      if (data) {
        setLoginTexts(data);
      }
    } catch {
      // Usar valores por defecto ya cargados
    } finally {
      setIsLoadingTexts(false);
    }
  };

  const handleSaveTexts = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingTexts(true);
    try {
      await loginMediaService.updateLoginTexts(loginTexts);
      toast.success('Textos del login guardados exitosamente.');
    } catch {
      toast.error('Error al guardar los textos del login.');
    } finally {
      setIsSavingTexts(false);
    }
  };

  const handleResetDefaultTexts = () => {
    setLoginTexts({
      portal_badge: 'Provider Portal',
      main_title: 'Plataforma de gestión empresarial conectada a Laravel.',
      main_subtitle: 'Accede a tu panel centralizado para inmuebles, CRM, POS y documentos legales.',
      form_title: 'Bienvenido',
      form_subtitle: 'Ingresa tus credenciales para acceder al panel de control.',
      footer_text: 'Con el respaldo de la arquitectura Laravel 12 & Next.js',
      card_badge: 'Premium',
      card_button_text: 'Explorar módulo',
    });
    toast('Valores por defecto restablecidos. Haz clic en "Guardar Textos" para aplicar los cambios.', {
      icon: 'ℹ️',
    });
  };

  // Contadores y restricciones
  const activeVideosCount = videos.filter(v => v.is_active).length;
  const canAddMoreVideos = true;

  return (
    <div className="space-y-10 pb-16 animate-fade-in text-slate-800 dark:text-slate-100">
      
      {/* Input oculto para reemplazo directo de archivo de video */}
      <input 
        type="file" 
        ref={replaceVideoInputRef} 
        onChange={handleReplaceVideoSelected} 
        accept="video/mp4" 
        className="hidden" 
      />

      {/* ========================================================================= */}
      {/* ENCABEZADO DE PÁGINA */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <Film className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Configuración del Login
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Administra los videos MP4 dinámicos del carrusel y la cinta inferior de logos que se visualizan en la pantalla de inicio de sesión.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/login"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-xs font-bold flex items-center gap-2 border border-slate-200 dark:border-slate-700"
          >
            <Eye className="w-4 h-4" />
            <span>Ver Login en Vivo</span>
          </a>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TABS DE NAVEGACIÓN */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab('videos')}
          className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'videos'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/40 dark:bg-blue-950/20 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Videos del Carrusel</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-extrabold">
            {videos.length}/3
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('logos')}
          className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'logos'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/40 dark:bg-indigo-950/20 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Aliados y Logos</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-extrabold">
            {logos.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('texts')}
          className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'texts'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Type className="w-4 h-4" />
          <span>Textos del Login</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECCIÓN 1: VIDEOS DEL CARRUSEL (MÁXIMO 3 VIDEOS) */}
      {/* ========================================================================= */}
      {activeTab === 'videos' && (
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-blue-600" />
                <span>Videos del Carrusel</span>
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                {videos.length} configurados ({activeVideosCount} activos)
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Puedes configurar múltiples videos MP4 para el carrusel interactivo en perspectiva.
            </p>
          </div>

          <button
            onClick={() => setIsAddVideoModalOpen(true)}
            disabled={!canAddMoreVideos || isUploadingVideo}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm ${
              canAddMoreVideos && !isUploadingVideo
                ? 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95 shadow-blue-600/20'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-300 dark:border-slate-700'
            }`}
            title="Agregar nuevo video"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Video</span>
          </button>
        </div>

        {/* Estado de subida en progreso */}
        {isUploadingVideo && (
          <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center gap-3 text-blue-700 dark:text-blue-300 text-xs font-bold animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            <span>{uploadVideoProgress || 'Subiendo archivo de video al almacenamiento de Laravel...'}</span>
          </div>
        )}

        {/* Grid de Cards de Videos */}
        {isLoadingVideos ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse border border-slate-300 dark:border-slate-700" />
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="p-8 sm:p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 mx-auto flex items-center justify-center mb-3">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-1">
              Aún no hay videos personalizados configurados
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-5">
              El login actualmente está utilizando los videos de demostración por defecto. Agrega hasta 3 videos MP4 para personalizar tu pantalla de acceso.
            </p>
            <button
              onClick={() => setIsAddVideoModalOpen(true)}
              className="px-4 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-colors shadow-sm inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Configurar Video 1</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videos.map((video, index) => {
              const videoUrl = normalizeFileUrl(video.url);

              return (
                <div
                  key={video.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md"
                >
                  {/* Header de la Card del Video */}
                  <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate max-w-[140px]">
                        {video.title}
                      </span>
                    </div>

                    {/* Controles de orden ↑ / ↓ */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveVideo(index, 'up')}
                        disabled={index === 0}
                        title="Subir orden"
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveVideo(index, 'down')}
                        disabled={index === videos.length - 1}
                        title="Bajar orden"
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Vista Previa del Video HTML5 */}
                  <div className="relative aspect-[9/12] max-h-[300px] bg-black flex items-center justify-center overflow-hidden group">
                    <video
                      key={videoUrl}
                      src={videoUrl}
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Badge de estado sobre el video */}
                    <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shadow-xs flex items-center gap-1 ${
                        video.is_active
                          ? 'bg-emerald-500/90 text-white'
                          : 'bg-slate-800/90 text-slate-300'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${video.is_active ? 'bg-white' : 'bg-slate-400'}`} />
                        {video.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>

                  {/* Acciones del Video */}
                  <div className="p-3.5 flex items-center justify-between gap-2 mt-auto bg-slate-50/30 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleToggleVideoStatus(video)}
                      className={`text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                        video.is_active
                          ? 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Check className={`w-3.5 h-3.5 ${video.is_active ? 'opacity-100' : 'opacity-40'}`} />
                      <span>{video.is_active ? 'Activo' : 'Desactivado'}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => triggerReplaceVideo(video.id)}
                        disabled={isUploadingVideo}
                        title="Reemplazar archivo MP4"
                        className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors flex items-center gap-1 text-xs font-semibold"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Reemplazar</span>
                      </button>

                      <button
                        onClick={() => handleDeleteVideo(video)}
                        disabled={isUploadingVideo}
                        title="Eliminar video"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
      )}

      {/* ========================================================================= */}
      {/* SECCIÓN 2: CINTA DE LOGOS DEL LOGIN */}
      {/* ========================================================================= */}
      {activeTab === 'logos' && (
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              <span>Logos del Login (Cinta Inferior)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Administra los logos y aliados comerciales que aparecen en la cinta inferior de la pantalla de inicio de sesión.
            </p>
          </div>

          <button
            onClick={openAddLogoModal}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 transition-all shadow-sm shadow-indigo-600/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Logo</span>
          </button>
        </div>

        {/* Vista previa simulada de la cinta inferior */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] uppercase tracking-widest font-extrabold text-slate-400 block mb-2 text-center">
            Vista Previa de la Cinta Inferior
          </span>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 py-3">
            {logos.filter(l => l.is_active).length === 0 ? (
              <span className="italic text-slate-400 text-xs">
                Usando fallback actual: SANTUN ECOSYSTEM • LEXVAULT • POS SALES • CRM PIPELINE
              </span>
            ) : (
              logos.filter(l => l.is_active).map((logo) => (
                <div key={logo.id} className="flex items-center justify-center transition-all opacity-100">
                  {logo.url ? (
                    <img
                      src={normalizeFileUrl(logo.url)}
                      alt={logo.name}
                      className="h-8 max-h-8 max-w-[120px] object-contain"
                    />
                  ) : (
                    <span className="text-slate-800 dark:text-slate-200 font-bold text-xs">{logo.name}</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Listado de Logos */}
        {isLoadingLogos ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse border border-slate-300 dark:border-slate-700" />
            ))}
          </div>
        ) : logos.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              No hay logos personalizados registrados. Se está mostrando la cinta estática por defecto.
            </p>
            <button
              onClick={openAddLogoModal}
              className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 transition-colors shadow-sm inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Primer Logo</span>
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {logos.map((logo, index) => (
                <div
                  key={logo.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Thumbnail */}
                    <div className="w-14 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                      {logo.url ? (
                        <img
                          src={normalizeFileUrl(logo.url)}
                          alt={logo.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-slate-400" />
                      )}
                    </div>

                    {/* Nombre y datos */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900 dark:text-slate-100 truncate">
                          {logo.name}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          logo.is_active
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {logo.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Posición: #{logo.sort_order || index + 1}
                      </p>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {/* Orden */}
                    <div className="flex items-center gap-1 border-r border-slate-200 dark:border-slate-700 pr-2">
                      <button
                        onClick={() => handleMoveLogo(index, 'up')}
                        disabled={index === 0}
                        title="Subir"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMoveLogo(index, 'down')}
                        disabled={index === logos.length - 1}
                        title="Bajar"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Activar/Desactivar */}
                    <button
                      onClick={() => handleToggleLogoStatus(logo)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                        logo.is_active
                          ? 'text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                          : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {logo.is_active ? 'Desactivar' : 'Activar'}
                    </button>

                    {/* Editar */}
                    <button
                      onClick={() => openEditLogoModal(logo)}
                      className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                      title="Editar nombre o imagen"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Eliminar */}
                    <button
                      onClick={() => handleDeleteLogo(logo)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="Eliminar logo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
      )}

      {/* ========================================================================= */}
      {/* SECCIÓN 3: CONFIGURACIÓN DE TEXTOS DEL LOGIN */}
      {/* ========================================================================= */}
      {activeTab === 'texts' && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Type className="w-5 h-5 text-emerald-600" />
                  <span>Textos y Mensajes de la Pantalla de Login</span>
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Personaliza todos los títulos, insignias y descripciones que se muestran en el portal de acceso.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetDefaultTexts}
                disabled={isSavingTexts}
                className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Restablecer a valores por defecto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restablecer</span>
              </button>

              <button
                type="button"
                onClick={handleSaveTexts}
                disabled={isSavingTexts}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 transition-all shadow-sm shadow-emerald-600/20 active:scale-95 cursor-pointer"
              >
                {isSavingTexts ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{isSavingTexts ? 'Guardando...' : 'Guardar Textos'}</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSaveTexts} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tarjeta 1: Mensaje Principal y Branding (Lado Izquierdo) */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Sección Principal (Izquierda)
                </h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Insignia Superior / Badge
                </label>
                <input
                  type="text"
                  value={loginTexts.portal_badge}
                  onChange={(e) => setLoginTexts({ ...loginTexts, portal_badge: e.target.value })}
                  placeholder="Ej. SANTUN Provider Portal"
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-800 dark:text-slate-100 font-medium"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Aparece en la pastilla azul superior del portal.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Título Principal
                </label>
                <textarea
                  rows={2}
                  value={loginTexts.main_title}
                  onChange={(e) => setLoginTexts({ ...loginTexts, main_title: e.target.value })}
                  placeholder="Ej. Plataforma de gestión empresarial conectada a Laravel."
                  className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-800 dark:text-slate-100 resize-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Subtítulo / Descripción Principal
                </label>
                <textarea
                  rows={3}
                  value={loginTexts.main_subtitle}
                  onChange={(e) => setLoginTexts({ ...loginTexts, main_subtitle: e.target.value })}
                  placeholder="Ej. Accede a tu panel centralizado para inmuebles, CRM, POS y documentos legales."
                  className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-800 dark:text-slate-100 resize-none text-xs"
                />
              </div>
            </div>

            {/* Tarjeta 2: Formulario y Tarjetas (Lado Derecho e Interactivo) */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Formulario de Acceso y Tarjetas
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Título del Formulario
                  </label>
                  <input
                    type="text"
                    value={loginTexts.form_title}
                    onChange={(e) => setLoginTexts({ ...loginTexts, form_title: e.target.value })}
                    placeholder="Ej. Bienvenido a SANTUN"
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 text-slate-800 dark:text-slate-100 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Insignia de Tarjeta
                  </label>
                  <input
                    type="text"
                    value={loginTexts.card_badge}
                    onChange={(e) => setLoginTexts({ ...loginTexts, card_badge: e.target.value })}
                    placeholder="Ej. SANTUN Premium"
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 text-slate-800 dark:text-slate-100 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Subtítulo del Formulario
                </label>
                <input
                  type="text"
                  value={loginTexts.form_subtitle}
                  onChange={(e) => setLoginTexts({ ...loginTexts, form_subtitle: e.target.value })}
                  placeholder="Ej. Ingresa tus credenciales para acceder al panel de control."
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Botón de Tarjeta
                  </label>
                  <input
                    type="text"
                    value={loginTexts.card_button_text}
                    onChange={(e) => setLoginTexts({ ...loginTexts, card_button_text: e.target.value })}
                    placeholder="Ej. Explorar módulo"
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 text-slate-800 dark:text-slate-100 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Texto de Pie de Página (Footer)
                  </label>
                  <input
                    type="text"
                    value={loginTexts.footer_text}
                    onChange={(e) => setLoginTexts({ ...loginTexts, footer_text: e.target.value })}
                    placeholder="Ej. Con el respaldo de la arquitectura Laravel 12 & Next.js"
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingTexts}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 transition-all shadow-sm shadow-emerald-600/20 active:scale-95 cursor-pointer"
                >
                  {isSavingTexts && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isSavingTexts ? 'Guardando...' : 'Guardar Cambios'}</span>
                </button>
              </div>
            </div>
          </form>
        </section>
      )}

      {/* ========================================================================= */}
      {/* MODAL: AGREGAR VIDEO */}
      {/* ========================================================================= */}
      {isAddVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-slide-up-fade">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600">
                  <Video className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Agregar Video para el Login
                </h3>
              </div>
              <button
                onClick={() => setIsAddVideoModalOpen(false)}
                disabled={isUploadingVideo}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVideo} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Nombre Identificativo *
                </label>
                <input
                  type="text"
                  required
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="Ej. Propiedades Exclusivas"
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Subtítulo de la Tarjeta (Opcional)
                </label>
                <input
                  type="text"
                  value={videoSubtitle}
                  onChange={(e) => setVideoSubtitle(e.target.value)}
                  placeholder="Ej. Gestión inmobiliaria premium"
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Archivo de Video (MP4) *
                </label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-blue-500 transition-colors">
                  {videoLocalPreview ? (
                    <div className="space-y-3">
                      <div className="aspect-[9/12] max-h-[220px] bg-black rounded-xl overflow-hidden mx-auto">
                        <video src={videoLocalPreview} controls className="w-full h-full object-cover" />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {selectedVideoFile?.name} ({(Number(selectedVideoFile?.size || 0) / (1024 * 1024)).toFixed(1)} MB)
                      </p>
                      <label className="text-xs font-bold text-blue-600 hover:underline cursor-pointer inline-block">
                        Cambiar archivo
                        <input type="file" accept="video/mp4" onChange={handleVideoFileSelect} className="hidden" />
                      </label>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center mb-2">
                        <Upload className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                        Seleccionar video MP4
                      </span>
                      <span className="text-xs text-slate-400 mt-1">
                        Formato MP4, máximo 50MB
                      </span>
                      <input type="file" accept="video/mp4" onChange={handleVideoFileSelect} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddVideoModalOpen(false)}
                  disabled={isUploadingVideo}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isUploadingVideo || !selectedVideoFile}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 ${
                    isUploadingVideo || !selectedVideoFile
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20'
                  }`}
                >
                  {isUploadingVideo && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isUploadingVideo ? 'Subiendo...' : 'Guardar Video'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: AGREGAR / EDITAR LOGO */}
      {/* ========================================================================= */}
      {isLogoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-slide-up-fade">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600">
                  <ImageIcon className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {editingLogo ? 'Editar Logo' : 'Agregar Logo'}
                </h3>
              </div>
              <button
                onClick={() => setIsLogoModalOpen(false)}
                disabled={isSavingLogo}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLogo} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Nombre del Logo / Aliado *
                </label>
                <input
                  type="text"
                  required
                  value={logoName}
                  onChange={(e) => setLogoName(e.target.value)}
                  placeholder="Ej. LEXVAULT"
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Archivo de Imagen (Opcional si es texto)
                </label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-5 text-center hover:border-indigo-500 transition-colors">
                  {logoLocalPreview || (editingLogo && editingLogo.url) ? (
                    <div className="space-y-3">
                      <div className="h-16 max-w-[200px] bg-slate-100 dark:bg-slate-800 rounded-xl p-2 flex items-center justify-center mx-auto border border-slate-200 dark:border-slate-700">
                        <img
                          src={logoLocalPreview || normalizeFileUrl(editingLogo?.url)}
                          alt="Preview"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <label className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer inline-block">
                        Cambiar imagen
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/svg+xml"
                          onChange={handleLogoFileSelect}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center mb-1.5">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        Subir imagen (PNG, SVG, WEBP)
                      </span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                        onChange={handleLogoFileSelect}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsLogoModalOpen(false)}
                  disabled={isSavingLogo}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSavingLogo || !logoName.trim()}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 ${
                    isSavingLogo || !logoName.trim()
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20'
                  }`}
                >
                  {isSavingLogo && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isSavingLogo ? 'Guardando...' : 'Guardar Logo'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default LoginSettingsPage;
