'use client';

import React from 'react';
import MediaLibraryModal from '../components/media/MediaLibraryModal';
import { ImageIcon } from 'lucide-react';

export const MediaLibraryPage: React.FC = () => {
  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
            <ImageIcon className="w-4 h-4" />
            <span>Academia & Recursos</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Biblioteca de Medios (Media Library)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gestión centralizada multi-tenant de imágenes, videos y documentos con aislamiento estricto por Marca Blanca y Agencia.
          </p>
        </div>
      </div>

      {/* Embedded Media Library */}
      <MediaLibraryModal
        isOpen={true}
        embedded={true}
      />
    </div>
  );
};

export default MediaLibraryPage;
