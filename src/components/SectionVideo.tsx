'use client';

import React from 'react';
import { Video, AlertCircle, ExternalLink } from 'lucide-react';
import { CourseSectionMaterial, CourseResource } from '../types/course';
import courseService from '../services/courseService';

export interface SectionVideoProps {
  material: CourseSectionMaterial | CourseResource;
  autoPlay?: boolean;
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

export const SectionVideo: React.FC<SectionVideoProps> = ({ material, autoPlay = true }) => {
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
      <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=${autoPlay ? 1 : 0}&rel=0`}
          title={material.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-0 select-none"
        />
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
        
        {/* Banner informativo sobre permisos de visibilidad */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
          <span>
            Si el video no se reproduce, verifica que el archivo en Google Drive tenga permisos públicos (<strong>"Cualquier persona con el enlace"</strong>).
          </span>
        </div>
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
