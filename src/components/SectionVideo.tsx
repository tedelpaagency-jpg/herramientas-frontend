'use client';

import React from 'react';
import { Video, AlertCircle, ExternalLink } from 'lucide-react';
import { CourseSectionMaterial, CourseResource } from '../types/course';
import courseService from '../services/courseService';

export interface SectionVideoProps {
  material: CourseSectionMaterial | CourseResource;
  autoPlay?: boolean;
  onEnded?: () => void;
  isCompleted?: boolean;
}

/**
 * Extrae el ID de un video de YouTube a partir de cualquier formato común de URL.
 */
export function extractYouTubeId(url?: string | null): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

/**
 * Extrae el ID de un archivo de Google Drive a partir de URLs de visualización o descarga.
 */
export function extractGoogleDriveId(url?: string | null): string | null {
  if (!url) return null;

  // Formato: https://drive.google.com/file/d/FILE_ID/view
  const fileDMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) return fileDMatch[1];

  // Formato: https://drive.google.com/open?id=FILE_ID o uc?id=FILE_ID
  const idParamMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch && idParamMatch[1]) return idParamMatch[1];

  return null;
}

export const SectionVideo: React.FC<SectionVideoProps> = ({ material, autoPlay = true, onEnded, isCompleted = false }) => {
  const url = material.external_url || material.file_path || '';
  let provider = material.video_provider;

  // Detección automática si provider no viene definido explícitamente (compatibilidad)
  if (!provider) {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      provider = 'youtube';
    } else if (url.includes('drive.google.com')) {
      provider = 'drive';
    } else {
      provider = 'local';
    }
  }

  // Escuchar evento de finalización para YouTube iframe API via postMessage
  React.useEffect(() => {
    if (provider !== 'youtube' || !onEnded) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data && (data.event === 'onStateChange' || data.info === 0) && data.info === 0) {
          onEnded();
        }
      } catch (e) {
        // Ignorar mensajes no sintácticamente JSON
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [provider, onEnded]);

  // 1. REPRODUCTOR YOUTUBE
  if (provider === 'youtube') {
    const youtubeId = extractYouTubeId(url);

    if (!youtubeId) {
      return (
        <div className="p-8 bg-slate-900 text-white rounded-3xl space-y-3 flex flex-col items-center justify-center text-center border border-slate-800">
          <AlertCircle className="w-10 h-10 text-amber-400 mb-1" />
          <h4 className="font-extrabold text-base">URL de YouTube no válida</h4>
          <p className="text-xs text-slate-400 max-w-md">
            No pudimos extraer el ID del video. Por favor verifica que la URL ingresada sea de un video público de YouTube.
          </p>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/10 text-amber-400 font-bold text-xs hover:bg-amber-500/20 transition-colors border border-amber-500/20"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Abrir enlace directamente</span>
            </a>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=${autoPlay ? 1 : 0}&rel=0&enablejsapi=1`}
            title={material.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0 select-none"
          />
        </div>
      </div>
    );
  }

  // 2. REPRODUCTOR GOOGLE DRIVE
  if (provider === 'drive') {
    const driveId = extractGoogleDriveId(url);

    if (!driveId) {
      return (
        <div className="p-8 bg-slate-900 text-white rounded-3xl space-y-3 flex flex-col items-center justify-center text-center border border-slate-800">
          <AlertCircle className="w-10 h-10 text-amber-400 mb-1" />
          <h4 className="font-extrabold text-base">URL de Google Drive no válida</h4>
          <p className="text-xs text-slate-400 max-w-md">
            No pudimos identificar el archivo de Google Drive. Asegúrate de copiar el enlace generado por el botón "Compartir" de Google Drive.
          </p>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Abrir en Google Drive</span>
            </a>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
          <iframe
            src={`https://drive.google.com/file/d/${driveId}/preview`}
            title={material.title}
            allow="autoplay"
            className="w-full h-full border-0 select-none"
          />
        </div>

        {/* Botón de completado manual para Google Drive */}
        {onEnded && (
          <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80">
            <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              Al finalizar de ver el video en Google Drive, marca como visto:
            </span>
            <button
              type="button"
              onClick={onEnded}
              disabled={isCompleted}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                isCompleted
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 cursor-default'
                  : 'bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95'
              }`}
            >
              {isCompleted ? '✓ Material Completado' : 'Marcar como completado'}
            </button>
          </div>
        )}
      </div>
    );
  }

  // 3. REPRODUCTOR VIDEO LOCAL (HTML5)
  return (
    <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
      <video
        controls
        autoPlay={autoPlay}
        controlsList="nodownload noremoteplayback"
        disablePictureInPicture
        onEnded={onEnded}
        onContextMenu={(e) => e.preventDefault()}
        className="w-full h-full object-contain select-none"
        src={courseService.getMaterialStreamUrl(material.id)}
      >
        Tu navegador no soporta el reproductor de video HTML5.
      </video>
    </div>
  );
};

export default SectionVideo;
