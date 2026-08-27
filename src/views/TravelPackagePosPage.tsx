'use client';

import React, { useEffect, useState } from 'react';
import { 
  Search, Filter, ShoppingCart, Plus, Minus, Trash2, Calendar, MapPin, Clock, 
  Upload, CheckCircle2, Loader2, Sparkles, AlertCircle, ArrowRight, UserCheck, Image as ImageIcon
} from 'lucide-react';
import travelPackageService from '../services/travelPackageService';
import { AgentPackage } from '../types/travelPackage';
import { useTravelPackageCart } from '../context/TravelPackageCartContext';
import toast from 'react-hot-toast';

export const TravelPackagePosPage: React.FC = () => {
  const [packages, setPackages] = useState<AgentPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [destinationFilter, setDestinationFilter] = useState('');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { cart, addToCart, updateQuantity, removeFromCart, clearCart, totalAmount, totalItems } = useTravelPackageCart();

  useEffect(() => {
    fetchCatalog();
  }, [search, destinationFilter]);

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const res = await travelPackageService.getCatalog({
        search: search.trim(),
        destination: destinationFilter,
      });
      if (res.status === 'success' && res.data) {
        setPackages(res.data.data || []);
      }
    } catch (err: any) {
      toast.error('Error al cargar el catálogo de paquetes');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }
    if (!paymentProof) {
      toast.error('Debes adjuntar el comprobante de pago');
      return;
    }

    setSubmitting(true);
    try {
      const itemsPayload = cart.map((item) => ({
        travel_package_id: item.package.id,
        travelers_count: item.travelers_count,
        travel_date_start: item.travel_date_start,
        travel_date_end: item.travel_date_end,
      }));

      await travelPackageService.submitCheckoutRequest({
        items: itemsPayload,
        payment_proof: paymentProof,
      });

      toast.success('¡Solicitud de viaje enviada exitosamente!');
      clearCart();
      setPaymentProof(null);
      setShowCheckoutModal(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al enviar la solicitud');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto pb-20">
      {/* Header Banner POS */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/20">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Módulo POS Agentes</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Catálogo de Paquetes Turísticos</h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Selecciona paquetes, ajusta viajeros y realiza la solicitud de venta de forma inmediata.
          </p>
        </div>
      </div>

      {/* Main Grid: Catalog + Cart Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 8 Cols: Catalog Grid */}
        <div className="lg:col-span-8 space-y-6">
          {/* Search & Filters Toolbar */}
          <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre, destino o palabras clave..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          {/* Catalog Grid */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
              <p className="text-slate-500 text-sm font-medium">Cargando catálogo de paquetes disponibles...</p>
            </div>
          ) : packages.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
              <MapPin className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-lg font-black text-slate-900 dark:text-white">No hay paquetes disponibles</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">No se encontraron paquetes de viaje que coincidan con la búsqueda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {packages.map((pkg) => {
                const inCartItem = cart.find((item) => item.package.id === pkg.id);
                return (
                  <div key={pkg.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
                    <div>
                      {/* Image Container */}
                      <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        {pkg.main_image ? (
                          <img src={pkg.main_image} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <ImageIcon className="w-10 h-10" />
                          </div>
                        )}
                        <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-emerald-500 text-white font-extrabold text-xs shadow-md">
                          ${pkg.final_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-[#00e699] flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {pkg.destination}
                          </span>
                          <h3 className="text-base font-black text-slate-900 dark:text-white line-clamp-1">{pkg.title}</h3>
                        </div>

                        {pkg.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{pkg.description}</p>
                        )}

                        <div className="flex items-center gap-4 text-xs font-bold text-slate-600 dark:text-slate-300 pt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-amber-500" /> {pkg.duration}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button / Quantity Controls */}
                    <div className="p-5 pt-0">
                      {inCartItem ? (
                        <div className="flex items-center justify-between p-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
                          <span className="text-xs font-black text-emerald-900 dark:text-emerald-200 pl-2">
                            {inCartItem.travelers_count} viajero(s)
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => updateQuantity(pkg.id, inCartItem.travelers_count - 1)}
                              className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 shadow-xs"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => updateQuantity(pkg.id, inCartItem.travelers_count + 1)}
                              className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-500 shadow-xs"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => addToCart(pkg, 1)}
                          className="w-full py-2.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-emerald-600 dark:hover:bg-emerald-400 font-extrabold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>Agregar a Solicitud</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 4 Cols: Cart / Request Drawer */}
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-sm sticky top-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-emerald-600 dark:text-[#00e699]" />
                <h2 className="text-base font-black text-slate-900 dark:text-white">Resumen de Solicitud</h2>
              </div>
              {cart.length > 0 && (
                <button type="button" onClick={clearCart} className="text-xs font-bold text-rose-600 hover:underline">
                  Vaciar
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <ShoppingCart className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-400">Tu carrito de selección está vacío.</p>
                <p className="text-[11px] text-slate-400">Selecciona paquetes del catálogo para preparar la solicitud.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                  {cart.map((item) => (
                    <div key={item.package.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-black text-slate-900 dark:text-white">{item.package.title}</h4>
                          <span className="text-[10px] font-bold text-slate-400">{item.package.destination}</span>
                        </div>
                        <button type="button" onClick={() => removeFromCart(item.package.id)} className="text-rose-500 hover:text-rose-700">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-800 text-xs">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.package.id, item.travelers_count - 1)}
                            className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold"
                          >
                            -
                          </button>
                          <span className="font-bold text-xs">{item.travelers_count} viajero(s)</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.package.id, item.travelers_count + 1)}
                            className="w-5 h-5 rounded bg-emerald-600 text-white flex items-center justify-center text-xs font-bold"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-extrabold text-slate-900 dark:text-white">
                          ${(item.package.final_price * item.travelers_count).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                    <span>Total de viajeros:</span>
                    <span>{totalItems}</span>
                  </div>
                  <div className="flex items-center justify-between text-base font-black text-slate-900 dark:text-white">
                    <span>TOTAL FINAL:</span>
                    <span className="text-emerald-600 dark:text-[#00e699]">
                      ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCheckoutModal(true)}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 text-white font-extrabold text-xs hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  <span>Proceder a Confirmación</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Checkout / Adjuntar Comprobante */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-6 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Confirmación y Pago de Solicitud</h3>
              <button type="button" onClick={() => setShowCheckoutModal(false)} className="text-xs font-bold text-slate-400 hover:text-slate-600">
                Cerrar
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-5">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Paquetes seleccionados:</span>
                  <span>{cart.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm font-black text-slate-900 dark:text-white">
                  <span>Monto Total a Pagar:</span>
                  <span className="text-emerald-600 dark:text-[#00e699]">
                    ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Comprobante de Pago *
                </label>
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
                  <Upload className="w-8 h-8 text-emerald-500 mx-auto" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {paymentProof ? paymentProof.name : 'Selecciona o arrastra el archivo de comprobante'}
                  </p>
                  <p className="text-[10px] text-slate-400">JPG, PNG o PDF (Máx. 15MB)</p>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-100 file:text-emerald-700"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCheckoutModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs hover:bg-emerald-500 transition-all flex items-center gap-2 shadow-md shadow-emerald-600/20"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>Enviar Solicitud al Admin</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelPackagePosPage;
