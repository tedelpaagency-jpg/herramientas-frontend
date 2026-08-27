'use client';

import React, { useEffect, useState } from 'react';
import { 
  FileText, Clock, CheckCircle2, XCircle, AlertCircle, Loader2, Sparkles, Eye, Download, MapPin
} from 'lucide-react';
import travelPackageService from '../services/travelPackageService';
import { AgentTravelRequest } from '../types/travelPackage';
import toast from 'react-hot-toast';

export const AgentPackageRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<AgentTravelRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<AgentTravelRequest | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await travelPackageService.getAgentRequests();
      if (res.status === 'success' && res.data) {
        setRequests(res.data.data || []);
      }
    } catch (err) {
      toast.error('Error al cargar mis solicitudes de viajes');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Aprobada por Proveedor</span>;
      case 'rejected':
        return <span className="px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-extrabold text-xs flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Rechazada por Proveedor</span>;
      case 'pending_supplier':
        return <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-extrabold text-xs flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> En Revisión de Proveedor</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-extrabold text-xs flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Pendiente Super Admin</span>;
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto pb-20">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950 p-6 md:p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/20">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Módulo de Agente</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Mis Solicitudes de Paquetes</h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Sigue en tiempo real el avance de tus solicitudes de paquetes turísticos enviados.
          </p>
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
          <p className="text-slate-500 text-sm font-medium">Cargando solicitudes...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <FileText className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-lg font-black text-slate-900 dark:text-white">Aún no has registrado ninguna solicitud</h3>
          <p className="text-xs text-slate-400">Ingresa al Catálogo POS para seleccionar paquetes e iniciar una solicitud.</p>
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
                  Total Pagado: <span className="text-emerald-600 dark:text-[#00e699] font-black">${req.total_final_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
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
                  onClick={() => setSelectedRequest(req)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-extrabold text-xs flex items-center gap-1.5"
                >
                  <Eye className="w-4 h-4" />
                  <span>Ver Detalle</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Detalle */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
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
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Estado de la Solicitud:</span>
                {getStatusBadge(selectedRequest.status)}
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white">Paquetes Solicitados</h4>
                {selectedRequest.items.map((it) => (
                  <div key={it.id} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-extrabold text-slate-900 dark:text-white">{it.package_title}</p>
                      <p className="text-[11px] text-slate-400">{it.travelers_count} viajero(s) • Destino: {it.destination}</p>
                    </div>
                    <span className="font-extrabold text-emerald-600">${it.subtotal_final_snapshot.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
              </div>

              {selectedRequest.agent_payment_proof && (
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">Comprobante de Pago Cargado</h4>
                  <a
                    href={selectedRequest.agent_payment_proof}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Ver Comprobante</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentPackageRequestsPage;
