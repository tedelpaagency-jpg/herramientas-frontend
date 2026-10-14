'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, Film, Image as ImageIcon, Trash2, Filter, Search, Plus, 
  CheckCircle2, Clock, Play, AlertCircle, RefreshCw, Layers, X
} from 'lucide-react';
import { MarketingMediaResource, AspectRatioType, ResourceType } from '../../types/marketingB2B';
import marketingB2BService from '../../services/marketingB2BService';
import toast from 'react-hot-toast';

interface MasterMediaLibraryProps {
  onSelectResourceForTemplate?: (resource: MarketingMediaResource) => void;
}

export const MasterMediaLibrary: React.FC<MasterMediaLibraryProps> = ({
  onSelectResourceForTemplate,
}) => {
  const [resources, setResources] = useState<MarketingMediaResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [aspectRatioFilter, setAspectRatioFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ResourceType>('image');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('9:16');
  const [country, setCountry] = useState('');
  const [productType, setProductType] = useState('Inmobiliario');
  const [category, setCategory] = useState('Propiedades');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const res = await marketingB2BService.getResources({
        type: typeFilter === 'all' ? undefined : typeFilter,
        aspect_ratio: aspectRatioFilter === 'all' ? undefined : aspectRatioFilter,
        search: searchTerm || undefined,
      });
      setResources(res.data);
    } catch (err) {
      console.error('Error fetching master media resources:', err);
      toast.error('Error al cargar la biblioteca de recursos maestros');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [typeFilter, aspectRatioFilter]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const mime = file.type.toLowerCase();
    const isVideo = mime.startsWith('video/') || file.name.endsWith('.mp4') || file.name.endsWith('.mov');
    const isImg = mime.startsWith('image/');

    if (!isVideo && !isImg) {
      toast.error('Solo se admiten archivos de imagen (JPG, PNG) o video (MP4, MOV).');
      return;
    }

    if (file.size > 200 * 1024 * 1024) {
      toast.error('El tamaño máximo permitido es de 200MB.');
      return;
    }

    setSelectedFile(file);
    setType(isVideo ? 'video' : 'image');
    if (!name) {
      setName(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    }

    if (isImg) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFilePreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Seleccione un archivo para cargar.');
      return;
    }
    if (!name.trim()) {
      toast.error('Ingrese un nombre para el recurso maestro.');
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading('Subiendo y validando recurso multimedia...');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('name', name);
      formData.append('description', description);
      formData.append('type', type);
      formData.append('aspect_ratio', aspectRatio);
      formData.append('country', country);
      formData.append('product_type', productType);
      formData.append('category', category);

      const created = await marketingB2BService.uploadResource(formData);
      setResources((prev) => [created, ...prev]);
      toast.success('Recurso cargado exitosamente', { id: toastId });

      // Reset modal
      setIsUploadModalOpen(false);
      setSelectedFile(null);
      setFilePreview(null);
      setName('');
      setDescription('');
    } catch (err: any) {
      console.error('Error uploading resource:', err);
      const msg = err?.response?.data?.message || 'Error al procesar el archivo.';
      toast.error(msg, { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteResource = async (id: number) => {
    if (!confirm('¿Seguro que deseas eliminar este recurso maestro? Las plantillas vinculadas podrían verse afectadas.')) {
      return;
    }

    try {
      await marketingB2BService.deleteResource(id);
      setResources((prev) => prev.filter((r) => r.id !== id));
      toast.success('Recurso eliminado');
    } catch (err) {
      console.error('Error deleting resource:', err);
      toast.error('Error al eliminar el recurso');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (!bytes) return '0 B';
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) return `${mb.toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  return (
    <div className="space-y-6">
      {/* Barra de Filtros y Acción */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        <div className="flex flex-wrap items-center gap-3">
          {/* Filtro Tipo */}
          <div className="flex bg-slate-950 rounded-xl p-1 border border-slate-800 text-xs font-bold text-slate-400">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${typeFilter === 'all' ? 'bg-purple-600 text-white shadow-sm' : 'hover:text-slate-200'}`}
            >
              Todos
            </button>
            <button
              onClick={() => setTypeFilter('image')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${typeFilter === 'image' ? 'bg-purple-600 text-white shadow-sm' : 'hover:text-slate-200'}`}
            >
              <ImageIcon className="w-3.5 h-3.5" /> Imágenes
            </button>
            <button
              onClick={() => setTypeFilter('video')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${typeFilter === 'video' ? 'bg-purple-600 text-white shadow-sm' : 'hover:text-slate-200'}`}
            >
              <Film className="w-3.5 h-3.5" /> Videos
            </button>
          </div>

          {/* Filtro Aspect Ratio */}
          <select
            value={aspectRatioFilter}
            onChange={(e) => setAspectRatioFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs font-bold rounded-xl px-3 py-2 outline-none"
          >
            <option value="all">Formato: Todos</option>
            <option value="9:16">9:16 (Vertical / Stories)</option>
            <option value="1:1">1:1 (Cuadrado / Feed)</option>
            <option value="4:5">4:5 (Vertical / Retrato)</option>
            <option value="16:9">16:9 (Horizontal / Pantalla)</option>
          </select>

          {/* Búsqueda */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nombre o país..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchResources()}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs font-medium rounded-xl pl-9 pr-3 py-2 w-48 sm:w-60 outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 transition-all shrink-0 cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Subir Medio Maestro</span>
        </button>
      </div>

      {/* Grid de Medios */}
      {isLoading ? (
        <div className="py-24 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-purple-500 animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-400">Cargando biblioteca multimedia...</p>
        </div>
      ) : resources.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-400">
            <Film className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-white">No hay recursos multimedia</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Sube tus imágenes y videos maestros en alta resolución (mín. 1080p) para crear plantillas comerciales.
            </p>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-black inline-flex items-center gap-2 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Subir Primer Recurso
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {resources.map((res) => {
            const isVideo = res.type === 'video';
            return (
              <div
                key={res.id}
                className="group bg-slate-900 border border-slate-800 hover:border-purple-500/60 rounded-2xl overflow-hidden transition-all shadow-md flex flex-col justify-between"
              >
                {/* Media Preview Box */}
                <div className="relative aspect-video bg-slate-950 overflow-hidden">
                  {isVideo ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <video
                        src={res.file_url}
                        className="w-full h-full object-cover"
                        preload="metadata"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center group-hover:bg-slate-950/20 transition-all">
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                          <Play className="w-4 h-4 fill-white" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={res.file_url}
                      alt={res.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}

                  {/* Badges superiores */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase text-purple-400">
                      {res.aspect_ratio}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase text-slate-300 flex items-center gap-1">
                      {isVideo ? <Film className="w-2.5 h-2.5 text-amber-400" /> : <ImageIcon className="w-2.5 h-2.5 text-emerald-400" />}
                      {res.type}
                    </span>
                  </div>

                  {res.duration ? (
                    <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-white">
                      {res.duration}s
                    </span>
                  ) : null}
                </div>

                {/* Content Details */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-sm text-white line-clamp-1 group-hover:text-purple-300 transition-colors">
                      {res.name}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>{res.width}x{res.height} px</span>
                      <span>•</span>
                      <span>{formatFileSize(res.file_size)}</span>
                      {res.country && (
                        <>
                          <span>•</span>
                          <span className="text-slate-300 font-semibold">{res.country}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    {onSelectResourceForTemplate ? (
                      <button
                        onClick={() => onSelectResourceForTemplate(res)}
                        className="px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Crear Plantilla</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-mono">ID #{res.id}</span>
                    )}

                    <button
                      onClick={() => handleDeleteResource(res.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                      title="Eliminar recurso maestro"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal para Subir Recurso Maestro */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Subir Recurso Multimedia Maestro</h3>
                  <p className="text-xs text-slate-400">Archivos para base publicitaria de plantillas</p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Drop Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  selectedFile
                    ? 'border-purple-500 bg-purple-500/5'
                    : 'border-slate-700 hover:border-slate-500 bg-slate-950/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,video/mp4,video/quicktime"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {filePreview ? (
                  <div className="space-y-2">
                    <img src={filePreview} alt="Preview" className="max-h-40 mx-auto rounded-lg object-contain" />
                    <p className="text-xs font-bold text-purple-400">{selectedFile?.name}</p>
                  </div>
                ) : selectedFile ? (
                  <div className="space-y-1">
                    <Film className="w-10 h-10 text-purple-400 mx-auto" />
                    <p className="text-xs font-black text-white">{selectedFile.name}</p>
                    <p className="text-[11px] text-slate-400">{formatFileSize(selectedFile.size)}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                    <div className="text-xs text-slate-300 font-bold">
                      Haz clic para seleccionar una imagen o video maestro
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Formatos: MP4, MOV, PNG, JPG (Resolución mín. 1080p, máx. 200MB)
                    </p>
                  </div>
                )}
              </div>

              {/* Nombre */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Nombre del Recurso *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Casa de Playa Exclusiva - Cancún"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-purple-500"
                />
              </div>

              {/* Formato y Aspect Ratio */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Tipo de Medio</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as ResourceType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="image">Imagen (JPG, PNG)</option>
                    <option value="video">Video (MP4, H.264)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Relación de Aspecto</label>
                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value as AspectRatioType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="9:16">9:16 (Stories / Reels / TikTok)</option>
                    <option value="1:1">1:1 (Post Cuadrado)</option>
                    <option value="4:5">4:5 (Vertical Instagram)</option>
                    <option value="16:9">16:9 (Horizontal / YouTube)</option>
                    <option value="4:3">4:3 (Estándar)</option>
                  </select>
                </div>
              </div>

              {/* País y Categoría */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">País o Mercado</label>
                  <input
                    type="text"
                    placeholder="Ej. México, Colombia, España"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Categoría</label>
                  <input
                    type="text"
                    placeholder="Ej. Inmobiliaria, Visas, Tours"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              {/* Descripción */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Descripción o Notas</label>
                <textarea
                  rows={2}
                  placeholder="Instrucciones o descripción del video/imagen..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none resize-none"
                />
              </div>

              {/* Botón de Envío */}
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !selectedFile}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-black shadow-lg shadow-purple-600/20 cursor-pointer flex items-center gap-2"
                >
                  {isUploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  <span>{isUploading ? 'Procesando Medio...' : 'Cargar y Guardar'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterMediaLibrary;
