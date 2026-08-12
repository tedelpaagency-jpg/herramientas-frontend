'use client';

import React, { useEffect, useState } from 'react';
import { TravelReport } from '../types';
import travelReportService from '../services/travelReportService';
import { Plane, Plus } from 'lucide-react';
import { TableSkeleton } from '@/components/Skeleton';

export const TravelReportsPage: React.FC = () => {
  const [reports, setReports] = useState<TravelReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    seller_name: '',
    destination: '',
    sale_amount: 1000,
    commission_amount: 100,
    status: 'approved',
  });

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const data = await travelReportService.getTravelReports();
      setReports(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await travelReportService.createTravelReport(formData);
      setShowModal(false);
      fetchReports();
    } catch (err) {
      console.error('Error creating travel report:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-3">
            <Plane className="w-7 h-7 text-sky-500" />
            <span>Reportes de Ventas de Viajes</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Conectado a `/v1/travel-reports`</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-sky-600 text-white font-bold rounded-2xl text-sm"
        >
          Nuevo Reporte
        </button>
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/60 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-6 py-4">Vendedor</th>
                <th className="px-6 py-4">Destino</th>
                <th className="px-6 py-4">Monto Venta</th>
                <th className="px-6 py-4">Comisión</th>
                <th className="px-6 py-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {reports.map((r) => (
                <tr key={r.id}>
                  <td className="px-6 py-4 font-bold text-white">{r.seller_name}</td>
                  <td className="px-6 py-4">{r.destination}</td>
                  <td className="px-6 py-4 text-emerald-400 font-bold">${Number(r.sale_amount).toFixed(2)}</td>
                  <td className="px-6 py-4 text-sky-400 font-bold">${Number(r.commission_amount).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400">
                      {r.status || 'Aprobado'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-white mb-4">Nuevo Reporte de Viaje</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300">Vendedor</label>
                <input
                  type="text"
                  required
                  value={formData.seller_name}
                  onChange={(e) => setFormData({ ...formData, seller_name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300">Destino</label>
                <input
                  type="text"
                  required
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-300">Monto ($)</label>
                  <input
                    type="number"
                    value={formData.sale_amount}
                    onChange={(e) => setFormData({ ...formData, sale_amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300">Comisión ($)</label>
                  <input
                    type="number"
                    value={formData.commission_amount}
                    onChange={(e) => setFormData({ ...formData, commission_amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs text-slate-400">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelReportsPage;
