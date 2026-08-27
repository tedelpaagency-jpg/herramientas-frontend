'use client';

import React, { useEffect, useState } from 'react';
import { 
  FileText, Clock, CheckCircle2, XCircle, Loader2, Sparkles, Download, Upload, Eye, UserCheck, ShieldCheck
} from 'lucide-react';
import travelPackageService from '../services/travelPackageService';
import { AdminTravelRequest } from '../types/travelPackage';
import toast from 'react-hot-toast';

export const AdminTravelRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<AdminTravelRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<AdminTravelRequest | null>(null);
  const [supplierProofFile, setSupplierProofFile] = useState<File | null>(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await travelPackageService.getAdminRequests();
      if (res.status === 'success' && res.data) {
        setRequests(res.data.data || []);
      }
    } catch (err) {
      toast.error('Error al cargar las solicitudes');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSupplierProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest || !supplierProofFile) {
      toast.error('Selecciona el comprobante de pago para el proveedor');
      return;
    }

    setSubmitting(true);
    try {
      await travelPackageService.uploadSupplierPaymentProof(selectedRequest.id, supplierProofFile, comment);
      toast.success('Comprobante cargado exitosamente. Solicitud enviada al proveedor.');
      setSelectedRequest(null);
      setSupplierProofFile(null);
      setComment('');
      fetchRequests();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al cargar comprobante');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-extrabold text-xs flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Aprobada por Proveedor</span>;
      case 'rejected':
        return <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 font-extrabold text-xs flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Rechazada por Proveedor</span>;
      case 'pending_supplier':
        return <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-extrabold text-xs flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Pendiente de Proveedor</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 font-extrabold text-xs flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Pendiente Pago Agente</span>;
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto pb-20">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 p-6 md:p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-400/20">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Módulo Super Admin</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Gestión Global de Solicitudes de Viajes</h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Revisa el comprobante del agente, evalúa el margen financiero y carga el pago para derivar al proveedor.
          </p>
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-10 h-10 text-rose-600 animate-spin" />
          <p className="text-slate-500 text-sm font-medium">Cargando solicitudes de la agencia...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <FileText className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-lg font-black text-slate-900 dark:text-white">No hay solicitudes registradas</h3>
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
                <p className="text-xs text-slate-500 font-semibold">
                  Agente: <span className="font-extrabold text-slate-800 dark:text-slate-200">{req.agent?.name} ({req.agent?.email})</span>
                </p>

                {/* Desglose Financiero Super Admin */}
                <div className="flex flex-wrap gap-4 text-xs font-bold pt-1">
                  <span className="text-slate-600">Prov: ${req.total_supplier_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  <span className="text-amber-600">Margen: +${req.total_additional_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  <span className="text-emerald-600 dark:text-[#00e699] font-black">Total Cobrado: ${req.total_final_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => { setSelectedRequest(req); setSupplierProofFile(null); setComment(''); }}
                  className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 hover:bg-rose-100 font-extrabold text-xs flex items-center gap-1.5"
                >
                  <Eye className="w-4 h-4" />
                  <span>Gestionar & Desglose</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Admin Gestionar Solicitud */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">{selectedRequest.request_number}</h3>
                <span className="text-xs font-bold text-slate-400">Agente: {selectedRequest.agent?.name}</span>
              </div>
              <button type="button" onClick={() => setSelectedRequest(null)} className="text-xs font-bold text-slate-400 hover:text-slate-600">
                Cerrar
              </button>
            </div>

            {/* Desglose Financiero Destacado */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white">Desglose Financiero Completo</h4>
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <p className="text-[10px] text-slate-400 font-bold">Monto Proveedor</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white">${selectedRequest.total_supplier_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200">
                  <p className="text-[10px] text-amber-600 font-bold">Margen Admin</p>
                  <p className="text-sm font-black text-amber-600">+${selectedRequest.total_additional_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200">
                  <p className="text-[10px] text-emerald-600 font-bold">Total Cobrado Agente</p>
                  <p className="text-sm font-black text-emerald-600">${selectedRequest.total_final_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white">Paquetes en la Solicitud</h4>
              {selectedRequest.items.map((it) => (
                <div key={it.id} className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-extrabold text-slate-900 dark:text-white">{it.package_title}</p>
                    <p className="text-[11px] text-slate-400">
                      Proveedor: <span className="font-bold text-slate-600 dark:text-slate-300">{it.supplier?.name || 'Proveedor'}</span> • {it.travelers_count} viajero(s)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-emerald-600">${it.subtotal_final_snapshot.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                    <p className="text-[10px] text-slate-400">(Prov: ${it.subtotal_supplier_snapshot.toLocaleString('en-US', { minimumFractionDigits: 2 })})</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Comprobante Enviado por el Agente */}
            {selectedRequest.agent_payment_proof && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-200 space-y-2">
                <h4 className="text-xs font-black text-blue-900 dark:text-blue-200">Comprobante de Pago del Agente</h4>
                <a
                  href={selectedRequest.agent_payment_proof}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 text-white font-extrabold text-xs hover:bg-blue-500 shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Ver Comprobante del Agente</span>
                </a>
              </div>
            )}

            {/* Formulario Cargar Comprobante al Proveedor */}
            {selectedRequest.status === 'pending_super_admin' && (
              <form onSubmit={handleUploadSupplierProof} className="p-4 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-200 space-y-4">
                <h4 className="text-xs font-black text-purple-900 dark:text-purple-200">Cargar Comprobante de Pago para el Proveedor</h4>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">Archivo de Comprobante *</label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => setSupplierProofFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-purple-100 file:text-purple-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">Comentario para el Proveedor (Opcional)</label>
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Ej. Pago realizado vía transferencia bancaria..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-extrabold text-xs hover:bg-purple-500 flex items-center gap-2 shadow-md shadow-purple-600/20"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    <span>Cargar Comprobante y Enviar al Proveedor</span>
                  </button>
                </div>
              </form>
            )}

            {selectedRequest.supplier_payment_proof && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 space-y-2">
                <h4 className="text-xs font-black text-emerald-900 dark:text-emerald-200">Comprobante para el Proveedor Ya Cargado</h4>
                <a
                  href={selectedRequest.supplier_payment_proof}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-extrabold text-xs hover:bg-emerald-500 shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Ver Comprobante del Proveedor</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTravelRequestsPage;
