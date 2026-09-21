'use client';

import React, { useState, useRef } from 'react';
import {
  ImagePlus, Upload, Trash2, Loader2, Video, FileText, File, ExternalLink, CheckCircle2
} from 'lucide-react';
import MediaLibraryModal from './MediaLibraryModal';
import mediaService from '../../services/mediaService';
import { Media } from '../../types/media';
import toast from 'react-hot-toast';

export interface MediaPickerProps {
  value?: string | number | null;
  onChange: (selected: { id?: number; url: string; media?: Media | null; file?: File }) => void;
  onClear?: () => void;
  type?: 'image' | 'video' | 'pdf' | 'document' | 'all';
  allowedTypes?: string[];
  label?: string;
  buttonLabel?: string;
  placeholder?: string;
  className?: string;
  previewHeight?: string;
  compact?: boolean;
}

export const MediaPicker: React.FC<MediaPickerProps> = ({
  value,
  onChange,
  onClear,
  type = 'all',
  allowedTypes,
  label,
  buttonLabel,
  placeholder = 'Ningún archivo seleccionado',
  className = '',
  previewHeight,
  compact = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadingDirect, setUploadingDirect] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filterType = type !== 'all' ? type : (allowedTypes && allowedTypes.length > 0 ? (allowedTypes[0] as any) : 'all');
  const displayLabel = label || buttonLabel;

  const displayUrl = typeof value === 'string' ? value : null;

  const handleSelectFromLibrary = (media: Media) => {
    onChange({
      id: media.id,
      url: media.full_url || media.url,
      media,
    });
  };

  const handleDirectFileUpload = async (file: File) => {
    setUploadingDirect(true);
    try {
      const res = await mediaService.uploadMedia(file);
      if (res.data) {
        toast.success('Archivo subido a Biblioteca de Medios');
        onChange({
          id: res.data.id,
          url: res.data.full_url || res.data.url,
          media: res.data,
          file,
        });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al subir el archivo');
    } finally {
      setUploadingDirect(false);
    }
  };

  const isImage = type === 'image' || (displayUrl && /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(displayUrl));

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          {label}
        </label>
      )}

      {displayUrl ? (
        <div className="space-y-3">
          <div className="relative rounded-2xl overflow-hidden group border border-slate-200 dark:border-slate-800 bg-slate-950 max-h-48 flex items-center justify-center p-2">
            {isImage ? (
              <img
                src={displayUrl}
                alt="Vista previa"
                className="max-h-40 max-w-full object-contain rounded-xl"
              />
            ) : (
              <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center gap-3 w-full min-w-0">
                {type === 'video' ? <Video className="w-6 h-6 text-blue-400 shrink-0" /> :
                 type === 'pdf' ? <FileText className="w-6 h-6 text-rose-400 shrink-0" /> :
                 <File className="w-6 h-6 text-slate-400 shrink-0" />}
                <span className="text-xs font-mono truncate flex-1">{displayUrl}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex-1 py-2.5 px-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-extrabold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <ImagePlus className="w-4 h-4" />
              <span>Cambiar (Biblioteca)</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingDirect}
              className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5"
              title="Subir nuevo archivo directo"
            >
              {uploadingDirect ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => {
                if (onClear) onClear();
                else onChange({ url: '' });
              }}
              className="py-2.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-xs transition-colors flex items-center justify-center gap-2"
              title="Quitar selección"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex flex-col items-center justify-center h-28 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-blue-500 bg-slate-50/50 dark:bg-slate-950 cursor-pointer transition-all p-3 text-center group"
          >
            <ImagePlus className="w-6 h-6 text-blue-600 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
              Seleccionar de Biblioteca
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">Explorar recursos existentes</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingDirect}
            className="flex flex-col items-center justify-center h-28 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-950 cursor-pointer transition-all p-3 text-center group"
          >
            {uploadingDirect ? (
              <Loader2 className="w-6 h-6 text-indigo-600 animate-spin mb-1" />
            ) : (
              <Upload className="w-6 h-6 text-indigo-600 mb-1 group-hover:scale-110 transition-transform" />
            )}
            <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
              Subir Nuevo Archivo
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">Sube directo a Media Library</span>
          </button>
        </div>
      )}

      {/* Hidden file input for direct upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept={filterType === 'image' ? 'image/*' : filterType === 'video' ? 'video/*' : filterType === 'pdf' ? 'application/pdf,.pdf' : '*/*'}
        onChange={(e) => e.target.files?.[0] && handleDirectFileUpload(e.target.files[0])}
        className="hidden"
      />

      {/* Media Library Modal */}
      <MediaLibraryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelectFromLibrary}
        filterType={filterType}
        title={displayLabel ? `Biblioteca de Medios: ${displayLabel}` : undefined}
      />
    </div>
  );
};

export default MediaPicker;
