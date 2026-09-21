'use client';

import React, { useState } from 'react';
import MediaLibraryModal from '../components/media/MediaLibraryModal';
import { ImageIcon, FolderPlus, Sparkles } from 'lucide-react';

export const MediaLibraryPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Gestión Centralizada</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Biblioteca de Medios (Media Library)
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs transition-all shadow-lg shadow-blue-600/30 active:scale-95"
        >
          Abrir Biblioteca
        </button>
      </div>

      <MediaLibraryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default MediaLibraryPage;
