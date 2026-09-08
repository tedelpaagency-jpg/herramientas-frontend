'use client';

import React, { useEffect, useState } from 'react';
import { 
  FileText, Clock, CheckCircle2, XCircle, Loader2, Sparkles, Download, Eye, AlertCircle, ShoppingCart
} from 'lucide-react';
import travelPackageService from '../services/travelPackageService';
import { wholesaleService } from '../services/wholesaleService';
import { SupplierTravelRequest } from '../types/travelPackage';
import toast from 'react-hot-toast';

export const SupplierPackageRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [comment, setComment] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      // 1. Solicitudes de Paquetes Estándar
      let legacyRequests: any[] = [];
      try {
        const resLegacy = await travelPackageService.getSupplierRequests();
        if (resLegacy.status === 'success' && resLegacy.data) {
          legacyRequests = (resLegacy.data.data || []).map((r: any) => ({
            ...r,
            source: 'legacy',
          }));
        }
      } catch (err) {
        console.warn('No legacy requests found');
      }

      // 2. Solicitudes del Nuevo B2B Trip Builder (Bookings)
      let b2bBookings: any[] = [];
      try {
        const resB2b = await wholesaleService.getBookings();
        if (resB2b.status === 'success' && resB2b.data) {
          const rawBookings = resB2b.data.data || resB2b.data || [];
          b2bBookings = rawBookings.map((b: any) => ({
            id: b.id,
            request_number: b.booking_number,
            status: b.status,
            total_supplier_amount: b.total_net_price + b.total_cleaning_fee,
            created_at: b.created_at,
            source: 'b2b',
            items: (b.items || []).map((it: any) => ({
              id: it.id,
              package_title: it.itemable?.title || it.itemable?.hotel_name || 'Recurso B2B',
              travelers_count: b.adults + b.children,
              destination: b.destination,
              subtotal_supplier_snapshot: (it.net_price || 0) + (it.cleaning_fee || 0),
              status: it.status,
              raw_item: it,
            })),
            raw_booking: b,
          }));
        }
      } catch (err) {
        console.warn('No B2B bookings found');
      }

      // Combinar ambas listas ordenadas por fecha más reciente
      const combined = [...b2bBookings, ...legacyRequests].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setRequests(combined);
    } catch (err) {
      toast.error('Error al cargar las solicitudes recibidas');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveSubmit = async () => {
    if (!selectedRequest) return;
    setSubmitting(true);
    try {
      if (selectedRequest.source === 'b2b') {
        // Aprobar todos los ítems de la reserva B2B
        for (const item of selectedRequest.items) {
          if (item.status !== 'approved') {
            await wholesaleService.approveBookingItem(item.id);
          }
        }
        toast.success('Reserva B2B aprobada exitosamente');
      } else {
        await travelPackageService.approveSupplierRequest(selectedRequest.id, comment);
        toast.success('Solicitud aprobada exitosamente');
      }
      setSelectedRequest(null);
      setActionType(null);
      fetchRequests();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al aprobar la solicitud');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (!selectedRequest || !rejectionReason.trim()) {
      toast.error('Indica el motivo de rechazo');
      return;
    }
    setSubmitting(true);
    try {
      if (selectedRequest.source === 'b2b') {
        // Rechazar ítems de la reserva B2B
        for (const item of selectedRequest.items) {
          if (item.status !== 'rejected') {
            await wholesaleService.rejectBookingItem(item.id, rejectionReason.trim());
          }
        }
        toast.success('Reserva B2B rechazada');
      } else {
        await travelPackageService.rejectSupplierRequest(selectedRequest.id, rejectionReason.trim());
        toast.success('Solicitud rechazada');
      }
      setSelectedRequest(null);
      setActionType(null);
      fetchRequests();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al rechazar la solicitud');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
      case 'confirmed_hold':
      case 'ticketed':
        return <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-extrabold text-xs flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Aprobada / Bloqueada</span>;
      case 'rejected':
      case 'requires_modification':
        return <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 font-extrabold text-xs flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Rechazada</span>;
      case 'pending_supplier':
      case 'pending_manual_providers':
      case 'draft':
      case 'pending_super_admin':
        return <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-extrabold text-xs flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Pendiente de Aprobación</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-extrabold text-xs">{status}</span>;
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto pb-20">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 p-6 md:p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-400/20">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Módulo de Proveedor & SuperAdmin</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Solicitudes de Ventas Recibidas</h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Revisa las solicitudes de paquetes y reservas del Trip Builder B2B recibidas para aprobar o rechazar el bloqueo.
          </p>
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
          <p className="text-slate-500 text-sm font-medium">Cargando solicitudes recibidas...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <FileText className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-lg font-black text-slate-900 dark:text-white">No tienes solicitudes pendientes</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Las nuevas solicitudes enviadas por agentes desde el Trip Builder o el Catálogo aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id + '_' + req.source}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-slate-900 dark:text-white">{req.request_number}</span>
                  {getStatusBadge(req.status)}
                  {req.source === 'b2b' && (
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-extrabold text-[10px] uppercase border border-cyan-400/30 flex items-center gap-1">
                      <ShoppingCart className="w-3 h-3" /> Trip Builder B2B
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 font-medium">
                  Fecha Solicitud: {new Date(req.created_at).toLocaleDateString()} • {req.items.length} ítem(s)
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {req.items.map((it: any) => (
                    <span key={it.id} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold px-3 py-1 rounded-xl">
                      {it.package_title} ({it.destination}) — ${(it.subtotal_supplier_snapshot || 0).toFixed(2)}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => { setSelectedRequest(req); setActionType(null); }}
                  className="px-4 py-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 hover:bg-purple-100 font-extrabold text-xs flex items-center gap-1.5"
                >
                  <Eye className="w-4 h-4" />
                  <span>Revisar & Responder</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Responder / Detalle */}
      {selectedRequest && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-xl w-full p-4 sm:p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">{selectedRequest.request_number}</h3>
                <span className="text-xs font-bold text-slate-400">Fecha: {new Date(selectedRequest.created_at).toLocaleDateString()}</span>
              </div>
              <button type="button" onClick={() => setSelectedRequest(null)} className="text-xs font-bold text-slate-400 hover:text-slate-600">
                Cerrar
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-600">Estado de la Solicitud:</span>
                {getStatusBadge(selectedRequest.status)}
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white">Recursos Solicitados</h4>
                {selectedRequest.items.map((it: any) => (
                  <div key={it.id} className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-extrabold text-slate-900 dark:text-white">{it.package_title}</p>
                      <p className="text-[11px] text-slate-400">{it.travelers_count} viajero(s) • Destino: {it.destination}</p>
                    </div>
                    <span className="font-extrabold text-purple-600">${(it.subtotal_supplier_snapshot || 0).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Botones de Aprobación o Formulario (para Proveedor o SuperAdmin) */}
              {!actionType && (
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActionType('reject')}
                    className="px-4 py-2.5 rounded-xl bg-rose-100 text-rose-700 font-extrabold text-xs hover:bg-rose-200 flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Rechazar Venta</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActionType('approve')}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs hover:bg-emerald-500 flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Aprobar Venta</span>
                  </button>
                </div>
              )}

              {/* Formulario Aprobar */}
              {actionType === 'approve' && (
                <div className="space-y-3 p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                  <h4 className="text-xs font-black text-emerald-900 dark:text-emerald-200">Confirmar Aprobación de Venta</h4>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Nota o instrucciones para el broker (opcional)..."
                    className="w-full p-3 rounded-xl border border-emerald-300 dark:border-emerald-800 text-xs bg-white dark:bg-slate-900"
                  />
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setActionType(null)} className="px-3 py-2 rounded-xl text-xs font-bold text-slate-500">
                      Cancelar
                    </button>
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={handleApproveSubmit}
                      className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 disabled:opacity-50"
                    >
                      {submitting ? 'Procesando...' : 'Confirmar Aprobación'}
                    </button>
                  </div>
                </div>
              )}

              {/* Formulario Rechazar */}
              {actionType === 'reject' && (
                <div className="space-y-3 p-4 bg-rose-50 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-800">
                  <h4 className="text-xs font-black text-rose-900 dark:text-rose-200">Indicar Motivo de Rechazo</h4>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Ej. No hay disponibilidad para las fechas seleccionadas..."
                    className="w-full p-3 rounded-xl border border-rose-300 dark:border-rose-800 text-xs bg-white dark:bg-slate-900"
                    required
                  />
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setActionType(null)} className="px-3 py-2 rounded-xl text-xs font-bold text-slate-500">
                      Cancelar
                    </button>
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={handleRejectSubmit}
                      className="px-4 py-2 rounded-xl bg-rose-600 text-white font-extrabold text-xs shadow-md shadow-rose-600/20 disabled:opacity-50"
                    >
                      {submitting ? 'Procesando...' : 'Confirmar Rechazo'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierPackageRequestsPage;
