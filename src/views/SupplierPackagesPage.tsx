'use client';

import React, { useEffect, useState } from 'react';
import { 
  Plus, Edit2, CheckCircle2, Loader2, Sparkles, MapPin, Clock, 
  DollarSign, Upload, Image as ImageIcon, Home, Building2, Car, Compass
} from 'lucide-react';
import travelPackageService from '../services/travelPackageService';
import { wholesaleService } from '../services/wholesaleService';
import { SupplierPackage } from '../types/travelPackage';
import toast from 'react-hot-toast';

export const SupplierPackagesPage: React.FC = () => {
  const [packages, setPackages] = useState<SupplierPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<SupplierPackage | null>(null);

  // Resource Category selector in Modal
  const [resourceType, setResourceType] = useState<'package' | 'rental' | 'hotel' | 'transfer'>('package');

  // Form State General & Tour
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('');
  const [supplierPrice, setSupplierPrice] = useState('');
  const [datesStart, setDatesStart] = useState('');
  const [datesEnd, setDatesEnd] = useState('');
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  // Specific Rental Fields
  const [cleaningFee, setCleaningFee] = useState('');
  const [maxGuests, setMaxGuests] = useState('4');
  const [address, setAddress] = useState('');

  // Specific Hotel Fields
  const [hotelName, setHotelName] = useState('');
  const [roomType, setRoomType] = useState('Suite Standard');

  // Specific Transfer Fields
  const [origin, setOrigin] = useState('');
  const [vehicleType, setVehicleType] = useState('Van Ejecutiva');

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
    setResourceType('package');
    setTitle('');
    setDescription('');
    setDestination('');
    setDuration('');
    setSupplierPrice('');
    setDatesStart('');
    setDatesEnd('');
    setMainImage(null);
    setStatus('active');
    setCleaningFee('');
    setMaxGuests('4');
    setAddress('');
    setHotelName('');
    setRoomType('Suite Standard');
    setOrigin('');
    setVehicleType('Van Ejecutiva');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (resourceType === 'package') {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('destination', destination);
        formData.append('duration', duration || 'Full Day');
        formData.append('supplier_price', supplierPrice);
        if (description) formData.append('description', description);
        if (datesStart) formData.append('available_dates_start', datesStart);
        if (datesEnd) formData.append('available_dates_end', datesEnd);
        if (mainImage) formData.append('main_image', mainImage);
        formData.append('status', status);

        if (editingPackage) {
          await travelPackageService.updateSupplierPackage(editingPackage.id, {
            title,
            destination,
            duration: duration || 'Full Day',
            supplier_price: parseFloat(supplierPrice),
            description,
            available_dates_start: datesStart,
            available_dates_end: datesEnd,
            main_image: mainImage,
            status,
          });
          toast.success('Paquete actualizado exitosamente');
        } else {
          await travelPackageService.createSupplierPackage({
            title,
            destination,
            duration: duration || 'Full Day',
            supplier_price: parseFloat(supplierPrice),
            description,
            available_dates_start: datesStart,
            available_dates_end: datesEnd,
            main_image: mainImage,
            status,
          });
          toast.success('Paquete publicado exitosamente');
        }
      } else if (resourceType === 'rental') {
        await wholesaleService.createRental({
          title,
          destination,
          price_per_night: parseFloat(supplierPrice),
          cleaning_fee: parseFloat(cleaningFee) || 0,
          max_guests: parseInt(maxGuests) || 4,
          description,
          address,
        });
        toast.success('Renta Corta publicada exitosamente');
      } else if (resourceType === 'hotel') {
        await wholesaleService.createHotel({
          hotel_name: hotelName || title,
          room_type: roomType,
          destination,
          price_per_night: parseFloat(supplierPrice),
          description,
        });
        toast.success('Habitación de Hotel publicada exitosamente');
      } else if (resourceType === 'transfer') {
        await wholesaleService.createTransfer({
          title,
          origin: origin || 'Aeropuerto / Hotel',
          destination,
          price: parseFloat(supplierPrice),
          vehicle_type: vehicleType,
        });
        toast.success('Servicio de Transfer publicado exitosamente');
      }

      resetForm();
      setShowModal(false);
      fetchPackages();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al guardar el recurso');
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
            <span>Módulo de Proveedor & SuperAdmin</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Gestión de Paquetes e Inventarios</h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Publica y administra Paquetes Turísticos, Rentas Cortas, Hoteles y Transfers VIP en la plataforma.
          </p>
        </div>

        <button
          type="button"
          onClick={() => { resetForm(); setShowModal(true); }}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs transition-all shadow-lg shadow-purple-600/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Publicar Recurso / Paquete</span>
        </button>
      </div>

      {/* Package List Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
          <p className="text-slate-500 text-sm font-medium">Cargando tus paquetes e inventario...</p>
        </div>
      ) : packages.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <Compass className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-lg font-black text-slate-900 dark:text-white">No has publicado ningún recurso</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Haz clic en "+ Publicar Recurso / Paquete" para registrar Paquetes, Rentas Cortas, Hoteles o Transfers.
          </p>
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
                    Precio Base: ${pkg.supplier_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Crear / Publicar Recurso */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Publicar Recurso en la Plataforma
              </h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-xs font-bold text-slate-400 hover:text-slate-600">
                Cancelar
              </button>
            </div>

            {/* Selector de Tipo de Recurso */}
            <div className="grid grid-cols-4 gap-2 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => setResourceType('package')}
                className={`py-2 px-2 rounded-xl text-xs font-extrabold flex flex-col items-center gap-1 transition-all ${
                  resourceType === 'package' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Tour</span>
              </button>

              <button
                type="button"
                onClick={() => setResourceType('rental')}
                className={`py-2 px-2 rounded-xl text-xs font-extrabold flex flex-col items-center gap-1 transition-all ${
                  resourceType === 'rental' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Renta Corta</span>
              </button>

              <button
                type="button"
                onClick={() => setResourceType('hotel')}
                className={`py-2 px-2 rounded-xl text-xs font-extrabold flex flex-col items-center gap-1 transition-all ${
                  resourceType === 'hotel' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Hotel</span>
              </button>

              <button
                type="button"
                onClick={() => setResourceType('transfer')}
                className={`py-2 px-2 rounded-xl text-xs font-extrabold flex flex-col items-center gap-1 transition-all ${
                  resourceType === 'transfer' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Car className="w-4 h-4" />
                <span>Transfer</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Formulario para Paquete / Tour */}
              {resourceType === 'package' && (
                <>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">Título del Tour / Paquete *</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ej. Tour Snorkel León Dormido - San Cristóbal"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">Destino *</label>
                      <input
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="Ej. Galápagos, Cancún..."
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
                        placeholder="Ej. Full Day (8 Horas)"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">Precio Proveedor ($ USD) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={supplierPrice}
                      onChange={(e) => setSupplierPrice(e.target.value)}
                      placeholder="180.00"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold"
                      required
                    />
                  </div>
                </>
              )}

              {/* Formulario para Renta Corta */}
              {resourceType === 'rental' && (
                <>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">Nombre de la Renta Corta / Villa *</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ej. Penthouse Vista al Mar Villa Pelícano"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">Destino *</label>
                      <input
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="Ej. Santa Cruz, Galápagos"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">Precio por Noche ($ USD) *</label>
                      <input
                        type="number"
                        step="0.01"
                        value={supplierPrice}
                        onChange={(e) => setSupplierPrice(e.target.value)}
                        placeholder="220.00"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">Tarifa de Limpieza ($ USD)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={cleaningFee}
                        onChange={(e) => setCleaningFee(e.target.value)}
                        placeholder="45.00"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">Máx Huéspedes</label>
                      <input
                        type="number"
                        value={maxGuests}
                        onChange={(e) => setMaxGuests(e.target.value)}
                        placeholder="4"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Formulario para Hotel */}
              {resourceType === 'hotel' && (
                <>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">Nombre del Hotel *</label>
                    <input
                      type="text"
                      value={hotelName}
                      onChange={(e) => setHotelName(e.target.value)}
                      placeholder="Ej. Hotel Finch Bay Galápagos"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">Tipo de Habitación *</label>
                      <input
                        type="text"
                        value={roomType}
                        onChange={(e) => setRoomType(e.target.value)}
                        placeholder="Ej. Suite Ocean View"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">Precio por Noche ($ USD) *</label>
                      <input
                        type="number"
                        step="0.01"
                        value={supplierPrice}
                        onChange={(e) => setSupplierPrice(e.target.value)}
                        placeholder="350.00"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">Destino *</label>
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="Ej. Puerto Ayora, Galápagos"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold"
                      required
                    />
                  </div>
                </>
              )}

              {/* Formulario para Transfer */}
              {resourceType === 'transfer' && (
                <>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">Título del Transfer *</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ej. Transfer Aeropuerto Baltra -> Puerto Ayora"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">Origen *</label>
                      <input
                        type="text"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        placeholder="Ej. Aeropuerto Baltra (GPS)"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">Destino *</label>
                      <input
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="Ej. Puerto Ayora / Hotel"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">Precio del Servicio ($ USD) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={supplierPrice}
                      onChange={(e) => setSupplierPrice(e.target.value)}
                      placeholder="60.00"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold"
                      required
                    />
                  </div>
                </>
              )}

              {/* Descripción común */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">Descripción / Detalles Adicionales</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Incluye lo que incluye el servicio, políticas o requerimientos de reserva..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold h-20"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/20 disabled:opacity-50"
                >
                  {saving ? 'Publicando...' : 'Publicar Recurso'}
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
