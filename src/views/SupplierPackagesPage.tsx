'use client';

import React, { useEffect, useState } from 'react';
import { 
  Plus, Edit2, Trash2, CheckCircle2, XCircle, Loader2, Sparkles, MapPin, Clock, DollarSign, Upload, Image as ImageIcon
} from 'lucide-react';
import travelPackageService from '../services/travelPackageService';
import { SupplierPackage } from '../types/travelPackage';
import toast from 'react-hot-toast';

export const SupplierPackagesPage: React.FC = () => {
  const [packages, setPackages] = useState<SupplierPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<SupplierPackage | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('');
  const [supplierPrice, setSupplierPrice] = useState('');
  const [datesStart, setDatesStart] = useState('');
  const [datesEnd, setDatesEnd] = useState('');
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await travelPackageService.getSupplierPackages();
      if (res.status === 'success' && res.data) {
        setPackages(res.data.data || []);
      }
    } catch (err) {
      toast.error('Error al cargar mis paquetes');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingPackage(null);
    setTitle('');
    setDescription('');
    setDestination('');
    setDuration('');
    setSupplierPrice('');
    setDatesStart('');
    setDatesEnd('');
    setMainImage(null);
    setStatus('active');
  };

  const startEdit = (pkg: SupplierPackage) => {
    setEditingPackage(pkg);
    setTitle(pkg.title);
    setDescription(pkg.description || '');
    setDestination(pkg.destination);
    setDuration(pkg.duration);
    setSupplierPrice(pkg.supplier_price.toString());
    setDatesStart(pkg.available_dates_start || '');
    setDatesEnd(pkg.available_dates_end || '');
    setStatus(pkg.status);
    setMainImage(null);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !destination.trim() || !duration.trim() || !supplierPrice) {
      toast.error('Completa los campos obligatorios (*)');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim() || undefined,
        destination: destination.trim(),
        duration: duration.trim(),
        available_dates_start: datesStart || undefined,
        available_dates_end: datesEnd || undefined,
        supplier_price: parseFloat(supplierPrice),
        main_image: mainImage,
        status,
      };

      if (editingPackage) {
        await travelPackageService.updateSupplierPackage(editingPackage.id, payload);
        toast.success('Paquete actualizado exitosamente');
      } else {
        await travelPackageService.createSupplierPackage(payload);
        toast.success('Paquete creado exitosamente');
      }

      resetForm();
      setShowModal(false);
      fetchPackages();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al guardar el paquete');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await travelPackageService.togglePackageStatus(id);
      toast.success('Estado del paquete actualizado');
      fetchPackages();
    } catch (err) {
      toast.error('Error al cambiar el estado del paquete');
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
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Mis Paquetes de Viajes</h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Publica y administra tus paquetes turísticos con el precio base que establezcas.
          </p>
        </div>

        <button
          type="button"
          onClick={() => { resetForm(); setShowModal(true); }}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs transition-all shadow-lg shadow-purple-600/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nuevo Paquete</span>
        </button>
      </div>

      {/* Package List Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
          <p className="text-slate-500 text-sm font-medium">Cargando tus paquetes...</p>
        </div>
      ) : packages.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <MapPin className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-lg font-black text-slate-900 dark:text-white">No has publicado ningún paquete</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">Haz clic en "+ Nuevo Paquete" para empezar a registrar tus viajes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  {pkg.main_image ? (
                    <img src={pkg.main_image} alt={pkg.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <ImageIcon className="w-10 h-10" />
                    </div>
                  )}
                  <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-black shadow-md ${
                    pkg.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'
                  }`}>
                    {pkg.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                  <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-purple-600 text-white font-extrabold text-xs shadow-md">
                    Mi Precio: ${pkg.supplier_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <span className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {pkg.destination}
                  </span>
                  <h3 className="text-base font-black text-slate-900 dark:text-white line-clamp-1">{pkg.title}</h3>
                  {pkg.description && <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{pkg.description}</p>}
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-300 pt-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" /> {pkg.duration}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 mt-2">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(pkg.id)}
                  className={`text-xs font-extrabold ${pkg.status === 'active' ? 'text-amber-600' : 'text-emerald-600'}`}
                >
                  {pkg.status === 'active' ? 'Desactivar' : 'Activar'}
                </button>

                <button
                  type="button"
                  onClick={() => startEdit(pkg)}
                  className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 hover:bg-purple-100 font-bold text-xs flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Editar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Crear / Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {editingPackage ? 'Editar Paquete Turístico' : 'Nuevo Paquete Turístico'}
              </h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-xs font-bold text-slate-400 hover:text-slate-600">
                Cancelar
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">Título del Paquete *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Tour Cancún & Riviera Maya 5 Días"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">Destino *</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Ej. Cancún, México"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">Duración *</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="Ej. 5 días / 4 noches"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">Precio Establecido por Proveedor (USD) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={supplierPrice}
                  onChange={(e) => setSupplierPrice(e.target.value)}
                  placeholder="Ej. 500.00"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">Disponible Desde</label>
                  <input
                    type="date"
                    value={datesStart}
                    onChange={(e) => setDatesStart(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">Disponible Hasta</label>
                  <input
                    type="date"
                    value={datesEnd}
                    onChange={(e) => setDatesEnd(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">Descripción del Paquete</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Incluye detalles de itinerario, hospedaje o servicios..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">Imagen Principal</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setMainImage(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-purple-100 file:text-purple-700"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold">Cancelar</button>
                <button type="submit" disabled={saving} className="px-6 py-2 rounded-xl bg-purple-600 text-white font-extrabold text-xs flex items-center gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>{editingPackage ? 'Guardar Cambios' : 'Publicar Paquete'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierPackagesPage;
