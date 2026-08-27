'use client';

import React, { useState, useEffect } from 'react';
import { wholesaleService, CatalogItem } from '../../services/wholesaleService';
import { RefreshCw, CheckCircle2, AlertTriangle, X, Search } from 'lucide-react';
import toast from 'react-hot-toast';

interface SwapAlternativeModalProps {
  isOpen: boolean;
  onClose: () => void;
  rejectedItem: {
    id: number; // DB booking_item_id
    resource_title: string;
    itemable_type: string;
    start_date: string;
    end_date: string;
  } | null;
  destination: string;
  onSwapSuccess: () => void;
}

export const SwapAlternativeModal: React.FC<SwapAlternativeModalProps> = ({
  isOpen,
  onClose,
  rejectedItem,
  destination,
  onSwapSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [alternatives, setAlternatives] = useState<CatalogItem[]>([]);
  const [selectedAlt, setSelectedAlt] = useState<CatalogItem | null>(null);
  const [swapping, setSwapping] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen && rejectedItem) {
      loadAlternatives();
    }
  }, [isOpen, rejectedItem]);

  const loadAlternatives = async () => {
    if (!rejectedItem) return;
    setLoading(true);
    try {
      let items: CatalogItem[] = [];
      const type = rejectedItem.itemable_type.toLowerCase();

      if (type.includes('shorttermrental')) {
        const res = await wholesaleService.getRentals(destination, searchTerm);
        items = res.data?.data || res.data || [];
      } else if (type.includes('hotelroom')) {
        const res = await wholesaleService.getHotels(destination, searchTerm);
        items = res.data?.data || res.data || [];
      } else if (type.includes('activity')) {
        const res = await wholesaleService.getActivities(destination, searchTerm);
        items = res.data?.data || res.data || [];
      } else {
        const res = await wholesaleService.getTransfers(destination, searchTerm);
        items = res.data?.data || res.data || [];
      }

      // Filtrar excluyendo el recurso rechazado si fuera necesario
      setAlternatives(items);
    } catch (err: any) {
      toast.error('Error al cargar alternativas de inventario.');
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteSwap = async () => {
    if (!rejectedItem || !selectedAlt) return;
    setSwapping(true);

    try {
      await wholesaleService.replaceRejectedItem(rejectedItem.id, {
        new_itemable_type: selectedAlt.itemable_type,
        new_itemable_id: selectedAlt.id,
        start_date: rejectedItem.start_date,
        end_date: rejectedItem.end_date,
        quantity: 1,
      });

      toast.success('Swap silencioso ejecutado. Magic Link enviado al nuevo proveedor.');
      onSwapSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al ejecutar el swap de alternativa.');
    } finally {
      setSwapping(false);
    }
  };

  if (!isOpen || !rejectedItem) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <RefreshCw className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Rescate de Venta — Swap Silencioso
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Selecciona una alternativa compatible para reemplazar <span className="font-bold text-rose-500">{rejectedItem.resource_title}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Item Rechazado Banner */}
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0" />
              <div>
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
                  ÍTEM RECHAZADO EN LIENZO
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {rejectedItem.resource_title} ({rejectedItem.start_date} al {rejectedItem.end_date})
                </span>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">
              Rechazado por Proveedor
            </span>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Buscar alternativas por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyUp={(e) => e.key === 'Enter' && loadAlternatives()}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* List of alternatives */}
          {loading ? (
            <div className="py-12 text-center text-slate-400 font-medium animate-pulse">
              Buscando alternativas disponibles en {destination}...
            </div>
          ) : alternatives.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No se encontraron inventarios alternativos disponibles para este destino.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {alternatives.map((alt) => {
                const isSelected = selectedAlt?.id === alt.id;
                const title = alt.title || alt.hotel_name || 'Recurso';

                return (
                  <div
                    key={alt.id}
                    onClick={() => setSelectedAlt(alt)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/20 shadow-md ring-2 ring-cyan-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                          {title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {alt.destination}
                        </p>
                      </div>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-cyan-500 flex-shrink-0" />}
                    </div>

                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <span className="text-slate-400 font-medium">Costo Base Broker</span>
                      <span className="font-black text-cyan-600 dark:text-cyan-400 text-sm">
                        ${alt.broker_base_cost.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Los ítems previamente aprobados permanecerán intactos en verde.
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              disabled={!selectedAlt || swapping}
              onClick={handleExecuteSwap}
              className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-500/25 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {swapping ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Ejecutando Swap...
                </>
              ) : (
                'Ejecutar Swap Silencioso'
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
