'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Download, Eye, RefreshCw, Clock, CheckCircle2, 
  AlertCircle, Film, Image as ImageIcon, Sparkles, TrendingUp,
  ExternalLink, Layers, ArrowDownToLine, Calendar
} from 'lucide-react';
import { MarketingGeneration } from '../../types/marketingB2B';
import marketingB2BService from '../../services/marketingB2BService';
import { normalizeFileUrl } from '../../services/apiClient';
import toast from 'react-hot-toast';

interface GenerationHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeGenerationUuid?: string | null;
}

export const GenerationHistoryModal: React.FC<GenerationHistoryModalProps> = ({
  isOpen,
  onClose,
  activeGenerationUuid,
}) => {
  const [generations, setGenerations] = useState<MarketingGeneration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingUuid, setDownloadingUuid] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [previewMedia, setPreviewMedia] = useState<{ url: string; type: string; title: string } | null>(null);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const fetchHistory = async (showLoadingState = true) => {
    if (showLoadingState) setIsLoading(true);
    try {
      const res = await marketingB2BService.getGenerationHistory({
        status: statusFilter === 'all' ? undefined : statusFilter,
        per_page: 25,
      });
      setGenerations(res.data);
    } catch (err) {
      console.error('Error fetching generation history:', err);
      if (showLoadingState) toast.error('Error al cargar historial de creativos');
    } finally {
      if (showLoadingState) setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory(true);
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [isOpen, statusFilter]);

  // Dynamic polling effect: if any item is pending or processing, poll every 2.5s
  useEffect(() => {
    if (!isOpen) return;

    const hasActiveJobs = generations.some(
      (g) => g.status === 'pending' || g.status === 'processing'
    );

    if (hasActiveJobs) {
      pollingRef.current = setInterval(() => {
        fetchHistory(false);
      }, 2500);
    } else {
      if (pollingRef.current) clearInterval(pollingRef.current);
    }

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [isOpen, generations]);

  const handleDownload = async (gen: MarketingGeneration) => {
    setDownloadingUuid(gen.uuid);
    const toastId = toast.loading('Descargando creativo...');
    try {
      const ext = gen.format || (gen.type === 'video' ? 'mp4' : 'jpg');
      const filename = `${gen.template?.name ? gen.template.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'creativo'}-${gen.uuid}.${ext}`;
      await marketingB2BService.downloadGeneration(gen.uuid, filename);
      toast.success('Descarga completada', { id: toastId });
    } catch (err: any) {
      console.error('Error in blob download, falling back to direct URL:', err);
      const directUrl = marketingB2BService.getDownloadUrl(gen.uuid);
      window.open(directUrl, '_blank');
      toast.dismiss(toastId);
    } finally {
      setDownloadingUuid(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900 dark:text-white">Cola de Renderizado & Descargas</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase">
                  Procesamiento Asíncrono
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Consulta el estado de generación de tus creativos y descarga los archivos listos para pauta
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchHistory(true)}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Actualizar lista"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-purple-500 dark:text-purple-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-center justify-between">
          <div className="flex bg-slate-100 dark:bg-slate-950 rounded-xl p-1 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${statusFilter === 'all' ? 'bg-purple-600 text-white shadow-sm' : 'hover:text-slate-900 dark:hover:text-slate-200'}`}
            >
              Todos ({generations.length})
            </button>
            <button
              onClick={() => setStatusFilter('processing')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${statusFilter === 'processing' ? 'bg-purple-600 text-white shadow-sm' : 'hover:text-slate-900 dark:hover:text-slate-200'}`}
            >
              En Proceso
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${statusFilter === 'completed' ? 'bg-purple-600 text-white shadow-sm' : 'hover:text-slate-900 dark:hover:text-slate-200'}`}
            >
              Completados
            </button>
          </div>

          <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
            Actualización en vivo cada 2.5s
          </span>
        </div>

        {/* List of Generations */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isLoading && generations.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-purple-500 animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Cargando creativos...</p>
            </div>
          ) : generations.length === 0 ? (
            <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-600 dark:text-purple-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">No tienes creativos generados aún</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Selecciona una plantilla del catálogo y haz clic en "Generar Creativo" para producir imágenes o videos de alta calidad.
              </p>
            </div>
          ) : (
            generations.map((gen) => {
              const isVideo = gen.type === 'video';
              const isCompleted = gen.status === 'completed';
              const isProcessing = gen.status === 'processing' || gen.status === 'pending';
              const isFailed = gen.status === 'failed';

              return (
                <div
                  key={gen.id}
                  className={`bg-slate-50 dark:bg-slate-950/80 border ${gen.uuid === activeGenerationUuid ? 'border-purple-500 ring-1 ring-purple-500/50' : 'border-slate-200 dark:border-slate-800'} hover:border-slate-300 dark:hover:border-slate-700 rounded-2xl p-4 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs`}
                >
                  {/* Left: Thumbnail & Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden flex-shrink-0 relative flex items-center justify-center">
                      {gen.output_url ? (
                        isVideo ? (
                          <video
                            src={normalizeFileUrl(gen.output_url)}
                            className="w-full h-full object-cover"
                            preload="metadata"
                            muted
                            playsInline
                          />
                        ) : (
                          <img
                            src={normalizeFileUrl(gen.output_url)}
                            alt="Output"
                            className="w-full h-full object-cover"
                          />
                        )
                      ) : (
                        <div className="text-slate-400 dark:text-slate-600">
                          {isVideo ? <Film className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
                        </div>
                      )}

                      {/* Small Type Icon */}
                      <span className="absolute bottom-1 right-1 p-1 bg-slate-950/80 rounded-md text-[9px] text-white">
                        {isVideo ? <Film className="w-2.5 h-2.5 text-amber-400" /> : <ImageIcon className="w-2.5 h-2.5 text-emerald-400" />}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                          {gen.template?.name || `Creativo #${gen.id}`}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                          {gen.format}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                          {new Date(gen.created_at).toLocaleString()}
                        </span>
                        <span>•</span>
                        <span>
                          Venta: <strong className="text-slate-900 dark:text-white">${Number(gen.sale_price).toFixed(2)}</strong>
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-0.5">
                          <TrendingUp className="w-3 h-3" />
                          +${Number(gen.projected_profit).toFixed(2)} {gen.currency}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Progress Bar (if processing) */}
                  {isProcessing && (
                    <div className="flex-1 max-w-xs space-y-1.5 px-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Renderizando ({gen.progress || 25}%)
                        </span>
                        <span className="text-slate-400 dark:text-slate-500 font-mono">En Cola</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-amber-500 to-purple-500 h-full transition-all duration-300 rounded-full"
                          style={{ width: `${Math.max(15, gen.progress || 35)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Right: Status & Actions */}
                  <div className="flex items-center justify-end gap-3">
                    {isCompleted && (
                      <div className="flex items-center gap-2">
                        {gen.output_url && (
                          <button
                            onClick={() => setPreviewMedia({
                              url: gen.output_url!,
                              type: gen.type,
                              title: gen.template?.name || 'Creativo Publicitario',
                            })}
                            className="p-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                            title="Ver Creativo"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          type="button"
                          disabled={downloadingUuid === gen.uuid}
                          onClick={() => handleDownload(gen)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/20 transition-transform active:scale-95 cursor-pointer"
                        >
                          {downloadingUuid === gen.uuid ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <ArrowDownToLine className="w-3.5 h-3.5" />
                          )}
                          <span>{downloadingUuid === gen.uuid ? 'Descargando...' : 'Descargar'}</span>
                        </button>
                      </div>
                    )}

                    {isProcessing && (
                      <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-extrabold text-xs flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Procesando
                      </span>
                    )}

                    {isFailed && (
                      <div className="text-right">
                        <span className="px-3 py-1 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 font-extrabold text-xs flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5" /> Fallido
                        </span>
                        {gen.error_message && (
                          <p className="text-[10px] text-rose-500 dark:text-rose-400/80 mt-1 max-w-[200px] truncate" title={gen.error_message}>
                            {gen.error_message}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Los archivos generados se almacenan de forma segura para tu agencia.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>

      {/* Media Preview Modal if user clicks 'Eye' */}
      {previewMedia && (
        <div className="fixed inset-0 z-60 bg-black/80 dark:bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{previewMedia.title}</h4>
              <button
                onClick={() => setPreviewMedia(null)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-center bg-black max-h-[70vh]">
              {previewMedia.type === 'video' ? (
                <video
                  src={normalizeFileUrl(previewMedia.url)}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[65vh] w-auto rounded-xl"
                />
              ) : (
                <img
                  src={normalizeFileUrl(previewMedia.url)}
                  alt={previewMedia.title}
                  className="max-h-[65vh] w-auto rounded-xl object-contain"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerationHistoryModal;
