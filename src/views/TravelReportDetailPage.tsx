'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, FileText, CheckCircle2, XCircle, Clock, ShieldCheck, Download, Upload, Users, Calculator, RefreshCw, Edit3, Loader2, Sparkles, Tag, Calendar, CreditCard
} from 'lucide-react';
import travelReportService from '../services/travelReportService';
import { TravelReport } from '../types/travelReport';
import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';
import { confirmDialog } from '../utils/alerts';

const formatMoney = (val: any): string => {
  const num = typeof val === 'number' ? val : parseFloat(val);
  return isNaN(num) ? '0.00' : num.toFixed(2);
};

export const TravelReportDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { user: authUser } = useAuth();
  const id = params?.id ? parseInt(params.id as string) : 0;

  const [report, setReport] = useState<TravelReport | null>(null);
  const [loading, setLoading] = useState(true);

  // Upload states
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docType, setDocType] = useState<'excel' | 'pay_document' | 'pay_document_2'>('pay_document');

  // Financial Edit State
  const [editMode, setEditMode] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [totalClient, setTotalClient] = useState<string>('');
  const [totalSupplier, setTotalSupplier] = useState<string>('');
  const [totalAdditional, setTotalAdditional] = useState<string>('');
  const [totalFee, setTotalFee] = useState<string>('');

  const role = authUser?.role?.toLowerCase() || '';
  const canAuthorize = ['super_admin', 'admin', 'gerente_comercial', 'gerente', 'director'].includes(role) || report?.status !== 1;

  const fetchReport = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await travelReportService.getReportDetail(id);
      if (res.status === 'success') {
        setReport(res.data);
        setTotalClient(res.data.total_client?.toString() || '');
        setTotalSupplier(res.data.total_supplier?.toString() || '');
        setTotalAdditional(res.data.total_additional?.toString() || '');
        setTotalFee(res.data.total_fee?.toString() || '');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al cargar detalle del reporte');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [id]);

  const handleStatusChange = async (status: number, actionLabel: string) => {
    if (!report) return;

    const actionText = actionLabel === 'auth' ? 'Autorizar Venta' : actionLabel === 'preauth' ? 'Pre-autorizar Venta' : 'Rechazar Venta';
    const confirmed = await confirmDialog({
      title: `¿Confirmar: ${actionText}?`,
      text: `Se cambiará el estado de la venta ${report.code} - ${report.name}.`,
      confirmButtonText: `Sí, ${actionText}`,
      confirmButtonColor: status === 1 ? '#059669' : status === 2 ? '#ef4444' : '#2563eb',
      icon: status === 1 ? 'success' : status === 2 ? 'warning' : 'info',
    });

    if (!confirmed) return;

    try {
      const res = await travelReportService.updateStatus(report.id, status);
      toast.success(res.message || 'Estado actualizado correctamente');
      fetchReport();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al cambiar estado');
    }
  };

  const handleUpdateFinancials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!report) return;

    setUpdating(true);
    try {
      const payload = {
        total_client: parseFloat(totalClient) || 0,
        total_supplier: parseFloat(totalSupplier) || 0,
        total_additional: parseFloat(totalAdditional) || 0,
        total_fee: parseFloat(totalFee) || 0,
      };

      const res = await travelReportService.updateReport(report.id, payload);
      toast.success(res.message || 'Valores recalculados y actualizados correctamente');
      setEditMode(false);
      fetchReport();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al recalcular reporte');
    } finally {
      setUpdating(false);
    }
  };

  const handleUploadFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!report || !selectedFile) {
      toast.error('Por favor seleccione un archivo');
      return;
    }

    setUploadingDoc(true);
    try {
      const res = await travelReportService.uploadDocument(report.id, docType, selectedFile);
      toast.success(res.message || 'Comprobante subido correctamente');
      setSelectedFile(null);
      fetchReport();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al subir el comprobante');
    } finally {
      setUploadingDoc(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-600 mb-3" />
        <p className="text-sm font-semibold">Cargando reporte de viaje...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-12 text-center text-slate-500 space-y-4">
        <XCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold">Reporte no encontrado</h3>
        <Link href="/travel-reports" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">
          Volver al listado
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/travel-reports"
            className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-black">
                {report.code}
              </span>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {report.name}
              </h1>
            </div>
            <p className="text-slate-400 text-xs mt-1">
              Agencia: {report.agency?.name || 'N/A'} • Vendedor: {report.user?.name || 'N/A'} ({report.seller_code || 'Sin código'})
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {canAuthorize && (
            <>
              {report.status !== 4 && (
                <button
                  onClick={() => handleStatusChange(4, 'preauth')}
                  className="px-4 py-2.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-extrabold text-xs hover:bg-blue-200 transition-colors flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Pre-autorizar</span>
                </button>
              )}
              {report.status !== 1 && (
                <button
                  onClick={() => handleStatusChange(1, 'auth')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Autorizar Venta</span>
                </button>
              )}
              {report.status !== 2 && (
                <button
                  onClick={() => handleStatusChange(2, 'reject')}
                  className="px-4 py-2.5 rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-extrabold text-xs hover:bg-rose-200 transition-colors flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Rechazar</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Product & General Information Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 rounded-2xl">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-400 font-bold block uppercase text-[10px]">Producto / Servicio</span>
            <span className="font-extrabold text-slate-900 dark:text-white capitalize">
              {report.product_type || 'Paquete Turístico'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-50 dark:bg-purple-950 text-purple-600 rounded-2xl">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-400 font-bold block uppercase text-[10px]">Fecha de Salida / Viaje</span>
            <span className="font-extrabold text-slate-900 dark:text-white">
              {report.travel_date ? new Date(report.travel_date).toLocaleDateString() : 'Sin definir'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 rounded-2xl">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-400 font-bold block uppercase text-[10px]">Método de Pago</span>
            <span className="font-extrabold text-slate-900 dark:text-white capitalize">
              {report.payment_method || 'Transferencia'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-50 dark:bg-amber-950 text-amber-600 rounded-2xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-400 font-bold block uppercase text-[10px]">Estado de Venta</span>
            <span className="font-extrabold text-slate-900 dark:text-white">
              {report.status === 1 ? 'Autorizado' : report.status === 2 ? 'Rechazado' : report.status === 4 ? 'Pre-autorizado' : 'Pendiente'}
            </span>
          </div>
        </div>
      </div>

      {report.notes && (
        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-xs">
          <span className="font-extrabold text-slate-700 dark:text-slate-300 block mb-1">Notas / Observaciones del Servicio:</span>
          <p className="text-slate-600 dark:text-slate-400">{report.notes}</p>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Financial Breakdown & Passenger List */}
        <div className="lg:col-span-2 space-y-8">
          {/* Financial Breakdown Card */}
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-indigo-600" />
                <span>Liquidación Financiera & Comisiones</span>
              </h3>
              <button
                onClick={() => setEditMode(!editMode)}
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <Edit3 className="w-4 h-4" />
                <span>{editMode ? 'Cancelar Edición' : 'Editar Importes'}</span>
              </button>
            </div>

            {editMode ? (
              <form onSubmit={handleUpdateFinancials} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Valor Cliente ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={totalClient}
                      onChange={(e) => setTotalClient(e.target.value)}
                      className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Costo Proveedor ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={totalSupplier}
                      onChange={(e) => setTotalSupplier(e.target.value)}
                      className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Valor Adicional ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={totalAdditional}
                      onChange={(e) => setTotalAdditional(e.target.value)}
                      className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Gastos Gestión ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={totalFee}
                      onChange={(e) => setTotalFee(e.target.value)}
                      className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-semibold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-extrabold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-2"
                >
                  {updating && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Guardar y Recalcular Liquidación</span>
                </button>
              </form>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase">Valor Cliente</span>
                  <p className="text-lg font-black text-slate-900 dark:text-white">
                    ${formatMoney(report.total_client)}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase">Costo Proveedor</span>
                  <p className="text-lg font-black text-slate-900 dark:text-white">
                    ${formatMoney(report.total_supplier)}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 space-y-1">
                  <span className="text-[10px] font-extrabold text-emerald-600 uppercase">Margen Bruto (MGT)</span>
                  <p className="text-lg font-black text-emerald-700 dark:text-emerald-400">
                    ${formatMoney(report.mgt)}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase">Impuestos (Taxes)</span>
                  <p className="text-lg font-black text-rose-600">
                    -${formatMoney(report.taxes)}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 space-y-1">
                  <span className="text-[10px] font-extrabold text-purple-600 uppercase">Margen Neto (GNT)</span>
                  <p className="text-lg font-black text-purple-700 dark:text-purple-400">
                    ${formatMoney(report.gnt)}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 space-y-1">
                  <span className="text-[10px] font-extrabold text-indigo-600 uppercase">Comisión Agente</span>
                  <p className="text-lg font-black text-indigo-700 dark:text-indigo-400">
                    ${formatMoney(report.commition_percent)}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 space-y-1">
                  <span className="text-[10px] font-extrabold text-purple-600 uppercase">Comisión Gerente</span>
                  <p className="text-lg font-black text-purple-700 dark:text-purple-400">
                    ${formatMoney(report.commition_percent_gerente)}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 space-y-1">
                  <span className="text-[10px] font-extrabold text-amber-600 uppercase">Comisión Admin/Dir</span>
                  <p className="text-lg font-black text-amber-700 dark:text-amber-400">
                    ${formatMoney(report.commition_percent_director)}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 space-y-1">
                  <span className="text-[10px] font-extrabold text-emerald-600 uppercase">Comisión Empresa</span>
                  <p className="text-lg font-black text-emerald-700 dark:text-emerald-400">
                    ${formatMoney(report.commition_percent_empresa)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Passenger List */}
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <Users className="w-5 h-5 text-indigo-600" />
              <span>Pasajeros Registrados ({report.passengers?.length || 0})</span>
            </h3>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {report.passengers?.map((pass, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm block">
                      {pass.name} {pass.last_name || ''}
                    </span>
                    <span className="text-slate-400">Doc/RUC: {pass.ruc || 'Sin documento'}</span>
                  </div>
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold uppercase text-[10px]">
                    {pass.type || 'natural'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Upload Documents */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <Upload className="w-5 h-5 text-indigo-600" />
              <span>Adjuntar Comprobantes</span>
            </h3>

            <form onSubmit={handleUploadFile} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Tipo de Documento</label>
                <select
                  value={docType}
                  onChange={(e: any) => setDocType(e.target.value)}
                  className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold"
                >
                  <option value="pay_document">Comprobante de Pago 1</option>
                  <option value="pay_document_2">Comprobante de Pago 2</option>
                  <option value="excel">Excel de Reserva / Itinerario</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Archivo (PDF, Imagen, Excel)</label>
                <input
                  type="file"
                  required
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={uploadingDoc}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                {uploadingDoc && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Subir Documento</span>
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-slate-400 block uppercase text-[10px]">Archivos Adjuntos:</span>
              {report.pay_document && (
                <a
                  href={`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'}/${report.pay_document}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                >
                  <span>Comprobante 1</span>
                  <Download className="w-4 h-4" />
                </a>
              )}
              {report.pay_document_2 && (
                <a
                  href={`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'}/${report.pay_document_2}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                >
                  <span>Comprobante 2</span>
                  <Download className="w-4 h-4" />
                </a>
              )}
              {report.excel && (
                <a
                  href={`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'}/${report.excel}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                >
                  <span>Excel de Reserva</span>
                  <Download className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelReportDetailPage;
