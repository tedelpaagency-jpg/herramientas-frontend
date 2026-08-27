'use client';

import React, { useEffect, useState } from 'react';
import { 
  Package, Search, Edit2, DollarSign, Loader2, Sparkles, MapPin, Clock, CheckCircle2, UserCheck
} from 'lucide-react';
import travelPackageService from '../services/travelPackageService';
import { AdminPackage } from '../types/travelPackage';
import toast from 'react-hot-toast';

export const AdminTravelPackagesPage: React.FC = () => {
  const [packages, setPackages] = useState<AdminPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingPricingPkg, setEditingPricingPkg] = useState<AdminPackage | null>(null);
  const [additionalPrice, setAdditionalPrice] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, [search]);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await travelPackageService.getAdminPackages({ search: search.trim() });
      if (res.status === 'success' && res.data) {
        setPackages(res.data.data || []);
      }
    } catch (err) {
      toast.error('Error al cargar la gestión de paquetes');
    } finally {
      setLoading(false);
    }
  };

  const handlePricingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPricingPkg) return;

    setSaving(true);
    try {
      await travelPackageService.setAdminPackagePricing(editingPricingPkg.id, parseFloat(additionalPrice || '0'));
      toast.success('Precio adicional / Margen actualizado exitosamente');
      setEditingPricingPkg(null);
      fetchPackages();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al actualizar el precio adicional');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto pb-20">
      {/* Header Banner Super Admin */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 p-6 md:p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-400/20">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Módulo Super Admin</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Gestión Global de Paquetes & Margen</h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Visualiza el desglose financiero completo y establece el precio adicional (`additional_price`) para los agentes.
          </p>
        </div>
      </div>

      {/* Toolbar Search */}
      <div className="flex gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título o destino..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-medium"
          />
        </div>
      </div>

      {/* Admin Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-10 h-10 text-rose-600 animate-spin" />
          <p className="text-slate-500 text-sm font-medium">Cargando desglose de paquetes...</p>
        </div>
      ) : packages.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <Package className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-lg font-black text-slate-900 dark:text-white">No hay paquetes de viajes registrados</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div className="p-5 space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-rose-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {pkg.destination}
                  </span>
                  <h3 className="text-base font-black text-slate-900 dark:text-white line-clamp-1">{pkg.title}</h3>
                  <p className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-blue-500" /> Proveedor: {pkg.supplier?.name || 'Desconocido'}
                  </p>
                </div>

                {/* Desglose Financiero Completo Super Admin */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 font-bold">
                    <span>Precio Proveedor:</span>
                    <span className="text-slate-900 dark:text-white">${pkg.supplier_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center text-amber-600 font-extrabold">
                    <span>Adicional / Margen Admin:</span>
                    <span>+ ${pkg.additional_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center text-emerald-600 dark:text-[#00e699] font-black text-sm pt-1 border-t border-slate-200 dark:border-slate-800">
                    <span>Precio Final Agente:</span>
                    <span>${pkg.final_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={() => {
                    setEditingPricingPkg(pkg);
                    setAdditionalPrice(pkg.additional_price.toString());
                  }}
                  className="w-full py-2.5 rounded-2xl bg-rose-600 text-white hover:bg-rose-500 font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Modificar Adicional / Margen</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Editar Precio Adicional */}
      {editingPricingPkg && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Ajustar Adicional del Admin</h3>
              <button type="button" onClick={() => setEditingPricingPkg(null)} className="text-xs font-bold text-slate-400">
                Cancelar
              </button>
            </div>

            <form onSubmit={handlePricingSubmit} className="space-y-4">
              <p className="text-xs text-slate-500 font-semibold">
                Paquete: <span className="font-extrabold text-slate-900 dark:text-white">{editingPricingPkg.title}</span>
              </p>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 flex justify-between">
                <span>Precio Proveedor:</span>
                <span>${editingPricingPkg.supplier_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                  Precio Adicional / Margen (USD) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={additionalPrice}
                  onChange={(e) => setAdditionalPrice(e.target.value)}
                  placeholder="Ej. 150.00"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold"
                  required
                />
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 text-xs font-black text-emerald-900 dark:text-emerald-200 flex justify-between">
                <span>Nuevo Precio Final Agente:</span>
                <span>
                  ${(editingPricingPkg.supplier_price + (parseFloat(additionalPrice) || 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setEditingPricingPkg(null)} className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold">Cancelar</button>
                <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl bg-rose-600 text-white font-extrabold text-xs flex items-center gap-1.5">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>Guardar Precio</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTravelPackagesPage;
