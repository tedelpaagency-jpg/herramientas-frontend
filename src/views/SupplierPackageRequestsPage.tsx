'use client';

import React, { useEffect, useState } from 'react';
import { 
  FileText, Clock, CheckCircle2, XCircle, Loader2, Sparkles, Download, Eye, AlertCircle
} from 'lucide-react';
import travelPackageService from '../services/travelPackageService';
import { SupplierTravelRequest } from '../types/travelPackage';
import toast from 'react-hot-toast';

export const SupplierPackageRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<SupplierTravelRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<SupplierTravelRequest | null>(null);
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
      const res = await travelPackageService.getSupplierRequests();
      if (res.status === 'success' && res.data) {
        setRequests(res.data.data || []);
      }
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
      await travelPackageService.approveSupplierRequest(selectedRequest.id, comment);
      toast.success('Solicitud aprobada exitosamente');
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
      await travelPackageService.rejectSupplierRequest(selectedRequest.id, rejectionReason.trim());
      toast.success('Solicitud rechazada');
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
        return <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-extrabold text-xs flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Aprobada</span>;
      case 'rejected':
        return <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 font-extrabold text-xs flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Rechazada</span>;
      case 'pending_supplier':
        return <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-extrabold text-xs flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Pendiente de Tu Aprobación</span>;
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
            <span>Módulo de Proveedor</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Solicitudes de Ventas Recibidas</h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Revisa los datos de servicio, el comprobante cargado por el super admin y aprueba o rechaza la venta.
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
          <p className="text-xs text-slate-400">Cuando el super admin valide el pago de un paquete tuyo, aparecerá aquí.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2 min-w-0">
                <div className="flex items-center gap-3">
                  <span className="text-base font-black text-slate-900 dark:text-white">{req.request_number}</span>
                  {getStatusBadge(req.status)}
                </div>
                <p className="text-xs text-slate-500 font-bold">
                  Tu Pago a Recibir: <span className="text-purple-600 dark:text-purple-400 font-black">${req.supplier_total_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </p>
                <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {req.items.map((it) => (
                    <span key={it.id} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      {it.package_title} ({it.travelers_count} viajero/s)
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => { setSelectedRequest(req); setActionType(null); }}
                  className="px-4 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 hover:bg-purple-100 font-extrabold text-xs flex items-center gap-1.5"
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
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
                <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white">Tus Paquetes en la Solicitud</h4>
                {selectedRequest.items.map((it) => (
                  <div key={it.id} className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-extrabold text-slate-900 dark:text-white">{it.package_title}</p>
                      <p className="text-[11px] text-slate-400">{it.travelers_count} viajero(s) • Destino: {it.destination}</p>
                    </div>
                    <span className="font-extrabold text-purple-600">${it.subtotal_supplier_snapshot.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
              </div>

              {/* Comprobante Cargado por Super Admin */}
              {selectedRequest.supplier_payment_proof && (
                <div className="p-4 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-200 dark:border-purple-800 space-y-2">
                  <h4 className="text-xs font-black text-purple-900 dark:text-purple-200">Comprobante de Pago Enviado por el Super Admin</h4>
                  <a
                    href={selectedRequest.supplier_payment_proof}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-600 text-white font-extrabold text-xs hover:bg-purple-500 shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>Ver Comprobante de Pago del Admin</span>
                  </a>
                </div>
              )}

              {/* Botones de Aprobación o Formulario */}
              {selectedRequest.status === 'pending_supplier' && !actionType && (
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

              {actionType === 'approve' && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 space-y-3">
                  <h4 className="text-xs font-black text-emerald-900 dark:text-emerald-200">Aprobar Solicitud de Venta</h4>
                  <textarea
                    rows={2}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Observaciones o notas de confirmación (Opcional)..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setActionType(null)} className="px-3 py-1.5 rounded-xl text-xs font-bold">Volver</button>
                    <button type="button" onClick={handleApproveSubmit} disabled={submitting} className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs">
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirmar Aprobación'}
                    </button>
                  </div>
                </div>
              )}

              {actionType === 'reject' && (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 space-y-3">
                  <h4 className="text-xs font-black text-rose-900 dark:text-rose-200">Rechazar Solicitud de Venta</h4>
                  <textarea
                    rows={3}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Indica el motivo por el cual no se puede prestar el servicio..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                    required
                  />
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setActionType(null)} className="px-3 py-1.5 rounded-xl text-xs font-bold">Volver</button>
                    <button type="button" onClick={handleRejectSubmit} disabled={submitting} className="px-4 py-1.5 rounded-xl bg-rose-600 text-white font-extrabold text-xs">
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirmar Rechazo'}
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
