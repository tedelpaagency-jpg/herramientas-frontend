'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  X, UploadCloud, Search, Image as ImageIcon, Video, FileText, File, Loader2,
  Trash2, Download, Copy, Check, Filter, Layers, Folder, Eye, Sparkles, RefreshCw, Calendar, User, Building2
} from 'lucide-react';
import mediaService from '../../services/mediaService';
import { Media, MediaTenantContext } from '../../types/media';
import toast from 'react-hot-toast';

export interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (media: Media) => void;
  filterType?: 'image' | 'video' | 'document' | 'other' | 'all' | 'pdf';
  title?: string;
}


export const MediaLibraryModal: React.FC<MediaLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  filterType = 'all',
  title = 'Biblioteca de Medios',
}) => {
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Filtros
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'image' | 'video' | 'document' | 'other'>(filterType === 'pdf' ? 'document' : filterType);

  const [selectedWlId, setSelectedWlId] = useState<number | undefined>(undefined);
  const [selectedAgencyId, setSelectedAgencyId] = useState<number | undefined>(undefined);

  // Contexto de Tenant y Selectores para Super Admin
  const [tenantContext, setTenantContext] = useState<MediaTenantContext | null>(null);
  const [whiteLabels, setWhiteLabels] = useState<Array<{ id: number; name: string }>>([]);
  const [agencies, setAgencies] = useState<Array<{ id: number; white_label_id?: number; name: string }>>([]);

  // Archivo Seleccionado para inspección
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);

  // Copia de URL
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Drag and drop zone
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchContext();
      fetchMedia();
    }
  }, [isOpen, selectedType, selectedWlId, selectedAgencyId]);

  const fetchContext = async () => {
    try {
      const res = await mediaService.getContext();
      if (res.data) {
        setTenantContext(res.data.tenant_context);
        setWhiteLabels(res.data.white_labels || []);
        setAgencies(res.data.agencies || []);
      }
    } catch (err) {
      console.error('Error al cargar contexto de medios:', err);
    }
  };

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await mediaService.getMedia({
        search: search.trim() || undefined,
        type: selectedType === 'all' ? undefined : selectedType,
        white_label_id: selectedWlId,
        agency_id: selectedAgencyId,
        per_page: 36,
      });
      if (res.data) {
        const items = res.data.data || [];
        setMediaList(items);
        if (items.length > 0 && !selectedMedia) {
          setSelectedMedia(items[0]);
        }
      }
    } catch (err) {
      toast.error('Error al cargar la biblioteca de medios');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMedia();
  };

  const handleFileUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    let lastUploaded: Media | null = null;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await mediaService.uploadMedia(file, {
          white_label_id: selectedWlId,
          agency_id: selectedAgencyId,
        });
        if (res.data) {
          lastUploaded = res.data;
        }
      }
      toast.success(`${files.length} archivo(s) subido(s) exitosamente`);
      setActiveTab('library');
      await fetchMedia();
      if (lastUploaded) {
        setSelectedMedia(lastUploaded);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al subir el archivo');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (!selectedMedia) return;
    if (!confirm(`¿Estás seguro de eliminar "${selectedMedia.original_name}"?`)) return;

    try {
      const res = await mediaService.deleteMedia(selectedMedia.id);
      toast.success('Archivo eliminado de la biblioteca');
      setSelectedMedia(null);
      await fetchMedia();
    } catch (err: any) {
      if (err.response?.data?.in_use) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Error al eliminar el archivo');
      }
    }
  };

  const handleCopyUrl = () => {
    if (!selectedMedia) return;
    const url = selectedMedia.full_url || selectedMedia.url;
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    toast.success('URL copiada al portapapeles');
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleConfirmSelect = () => {
    if (selectedMedia && onSelect) {
      onSelect(selectedMedia);
      onClose();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl h-[90vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                {title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Selecciona, sube y administra recursos multimedia multi-tenant.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tabs */}
            <div className="flex items-center p-1 rounded-2xl bg-slate-200/60 dark:bg-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('library')}
                className={`px-4 py-2 rounded-xl transition-all ${
                  activeTab === 'library'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Biblioteca
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`px-4 py-2 rounded-xl transition-all ${
                  activeTab === 'upload'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Subir Archivo
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-2xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {activeTab === 'upload' ? (
          <div className="flex-1 p-8 flex flex-col items-center justify-center space-y-6 overflow-y-auto">
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                if (e.dataTransfer.files) handleFileUpload(e.dataTransfer.files);
              }}
              className={`w-full max-w-2xl h-80 rounded-3xl border-3 border-dashed transition-all flex flex-col items-center justify-center p-8 text-center cursor-pointer ${
                isDragOver
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 scale-102'
                  : 'border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 hover:border-blue-400'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? (
                <div className="flex flex-col items-center space-y-3">
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Subiendo archivo a la Media Library...</p>
                </div>
              ) : (
                <>
                  <div className="p-4 rounded-3xl bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-3">
                    <UploadCloud className="w-10 h-10" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Arrastra y suelta tus archivos aquí
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                    Soporta Imágenes (JPG, PNG, WEBP, SVG), Videos (MP4, WEBM, MOV) y Documentos (PDF, Word). Máximo 500MB.
                  </p>
                  <button
                    type="button"
                    className="mt-4 px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md shadow-blue-600/20"
                  >
                    Seleccionar Archivos
                  </button>
                </>
              )}

              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="hidden"
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
            {/* Main Library Area */}
            <div className="flex-1 flex flex-col min-w-0 border-r border-slate-200 dark:border-slate-800">
              {/* Filter and Search Bar */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center gap-3 shrink-0">
                {/* Search */}
                <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[200px] relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por nombre, título o descripción..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </form>

                {/* Filter Type */}
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white outline-none"
                >
                  <option value="all">Todos los formatos</option>
                  <option value="image">Imágenes (PNG, JPG, WEBP)</option>
                  <option value="video">Videos (MP4, MOV)</option>
                  <option value="document">Documentos (PDF, Word)</option>
                  <option value="other">Otros archivos</option>
                </select>

                {/* Selector de Marca Blanca (Super Admin) */}
                {tenantContext?.is_global && whiteLabels.length > 0 && (
                  <select
                    value={selectedWlId || ''}
                    onChange={(e) => setSelectedWlId(e.target.value ? Number(e.target.value) : undefined)}
                    className="px-3 py-2 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/50 text-xs font-bold text-indigo-700 dark:text-indigo-300 outline-none"
                  >
                    <option value="">-- Marca Blanca: [ Todas ] --</option>
                    {whiteLabels.map((wl) => (
                      <option key={wl.id} value={wl.id}>{wl.name}</option>
                    ))}
                  </select>
                )}

                {/* Refresh */}
                <button
                  type="button"
                  onClick={fetchMedia}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                  title="Refrescar"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Grid de Archivos */}
              <div className="flex-1 p-4 overflow-y-auto min-h-0 bg-slate-50/40 dark:bg-slate-950/40">
                {loading ? (
                  <div className="h-64 flex flex-col items-center justify-center space-y-3">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    <p className="text-xs text-slate-400 font-medium">Cargando biblioteca de medios...</p>
                  </div>
                ) : mediaList.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-center space-y-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                    <Folder className="w-10 h-10 text-slate-300 dark:text-slate-700" />
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No se encontraron archivos en la biblioteca.</p>
                    <p className="text-xs text-slate-400">Prueba ajustando la búsqueda o haz clic en "Subir Archivo" para agregar recursos.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {mediaList.map((item) => {
                      const isSelected = selectedMedia?.id === item.id;
                      const isImg = item.mime_type?.startsWith('image/');
                      const isVid = item.mime_type?.startsWith('video/');
                      const isPdf = item.mime_type?.includes('pdf');

                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedMedia(item)}
                          className={`group relative rounded-2xl border aspect-square overflow-hidden cursor-pointer transition-all ${
                            isSelected
                              ? 'border-blue-600 ring-4 ring-blue-500/20 bg-blue-50/20 dark:bg-blue-950/40 scale-102 z-10'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-400 hover:shadow-md'
                          }`}
                        >
                          {isImg ? (
                            <img
                              src={item.full_url || item.url}
                              alt={item.title || item.original_name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-slate-100 dark:bg-slate-950">
                              {isVid ? <Video className="w-8 h-8 text-blue-500 mb-1" /> :
                               isPdf ? <FileText className="w-8 h-8 text-rose-500 mb-1" /> :
                               <File className="w-8 h-8 text-slate-400 mb-1" />}
                              <span className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 truncate w-full px-1">
                                {item.original_name}
                              </span>
                            </div>
                          )}

                          {/* Badge de tipo */}
                          <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[9px] font-black text-white uppercase">
                            {item.file_type || item.extension}
                          </div>

                          {/* Overlay Checkmark */}
                          {isSelected && (
                            <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg">
                                <Check className="w-4 h-4 stroke-[3]" />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Inspector Panel */}
            {selectedMedia ? (
              <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col overflow-y-auto shrink-0 space-y-5">
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
                  Detalles del Archivo
                </h3>

                {/* Preview Box */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-950 flex items-center justify-center min-h-[160px] max-h-48 relative">
                  {selectedMedia.mime_type?.startsWith('image/') ? (
                    <img
                      src={selectedMedia.full_url || selectedMedia.url}
                      alt={selectedMedia.original_name}
                      className="max-h-44 object-contain"
                    />
                  ) : selectedMedia.mime_type?.startsWith('video/') ? (
                    <video
                      src={selectedMedia.full_url || selectedMedia.url}
                      controls
                      className="max-h-44 w-full"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-white">
                      <FileText className="w-12 h-12 text-rose-500 mb-2" />
                      <span className="text-xs font-bold text-slate-300 text-center truncate max-w-[200px]">
                        {selectedMedia.original_name}
                      </span>
                    </div>
                  )}
                </div>

                {/* File Metadata Info */}
                <div className="space-y-2.5 text-xs">
                  <div>
                    <span className="block font-extrabold text-slate-900 dark:text-white truncate">
                      {selectedMedia.original_name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">
                      {selectedMedia.mime_type} • {formatFileSize(selectedMedia.size)}
                    </span>
                  </div>

                  {selectedMedia.width && selectedMedia.height && (
                    <div className="flex items-center gap-1.5 text-slate-500 font-medium text-[11px]">
                      <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                      <span>Dimensiones: {selectedMedia.width} × {selectedMedia.height} px</span>
                    </div>
                  )}

                  {selectedMedia.created_at && (
                    <div className="flex items-center gap-1.5 text-slate-500 font-medium text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Subido: {new Date(selectedMedia.created_at).toLocaleDateString()}</span>
                    </div>
                  )}

                  {selectedMedia.uploader && (
                    <div className="flex items-center gap-1.5 text-slate-500 font-medium text-[11px]">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Por: {selectedMedia.uploader.name}</span>
                    </div>
                  )}

                  {selectedMedia.white_label && (
                    <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-extrabold text-[11px]">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Marca Blanca: {selectedMedia.white_label.name}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 mt-auto">
                  {onSelect && (
                    <button
                      type="button"
                      onClick={handleConfirmSelect}
                      className="w-full py-2.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Check className="w-4 h-4" />
                      <span>Usar este archivo</span>
                    </button>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleCopyUrl}
                      className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11px] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
                    >
                      {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedUrl ? 'Copiado' : 'Copiar URL'}</span>
                    </button>

                    <a
                      href={mediaService.getDownloadUrl(selectedMedia.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11px] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar</span>
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={handleDeleteSelected}
                    className="w-full py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 font-bold text-[11px] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar de Biblioteca</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex-col items-center justify-center text-center text-slate-400 text-xs">
                <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                <span>Selecciona un archivo de la lista para ver su información y opciones.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaLibraryModal;
