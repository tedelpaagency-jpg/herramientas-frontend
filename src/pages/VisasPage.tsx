import React, { useEffect, useState } from 'react';
import { Visa } from '../types';
import visaService from '../services/visaService';
import { FileCheck, Plus, Search, Trash2, Edit3 } from 'lucide-react';

export const VisasPage: React.FC = () => {
  const [visas, setVisas] = useState<Visa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    applicant_name: '',
    passport_number: '',
    country_destination: 'Estados Unidos',
    visa_type: 'Turismo B1/B2',
    status: 'pending',
  });

  const fetchVisas = async () => {
    setIsLoading(true);
    try {
      const data = await visaService.getVisas();
      setVisas(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVisas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await visaService.createVisa(formData);
      setShowModal(false);
      fetchVisas();
    } catch (err) {
      console.error('Error creating visa:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-3">
            <FileCheck className="w-7 h-7 text-sky-500" />
            <span>Módulo de Visados SANTUN</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Conectado a `/v1/visas`</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-sky-600 text-white font-bold rounded-2xl text-sm"
        >
          Nueva Solicitud
        </button>
      </div>

      {isLoading ? (
        <div className="py-12 flex justify-center"><div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/60 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-6 py-4">Solicitante</th>
                <th className="px-6 py-4">Pasaporte</th>
                <th className="px-6 py-4">Destino</th>
                <th className="px-6 py-4">Tipo</th>
                <th className="px-6 py-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {visas.map((v) => (
                <tr key={v.id}>
                  <td className="px-6 py-4 font-bold text-white">{v.applicant_name}</td>
                  <td className="px-6 py-4 font-mono text-xs">{v.passport_number}</td>
                  <td className="px-6 py-4">{v.country_destination}</td>
                  <td className="px-6 py-4 text-xs">{v.visa_type}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-400">
                      {v.status}
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
            <h3 className="text-lg font-bold text-white mb-4">Nueva Solicitud de Visado</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300">Nombre Completo del Solicitante</label>
                <input
                  type="text"
                  required
                  value={formData.applicant_name}
                  onChange={(e) => setFormData({ ...formData, applicant_name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300">Número de Pasaporte</label>
                <input
                  type="text"
                  required
                  value={formData.passport_number}
                  onChange={(e) => setFormData({ ...formData, passport_number: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                />
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

export default VisasPage;
