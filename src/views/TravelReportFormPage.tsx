'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Plane, Plus, Trash2, Save, Calculator, Users, Shield, Loader2, Sparkles, Calendar, CreditCard, Tag, FileText, UserCheck
} from 'lucide-react';
import travelReportService from '../services/travelReportService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface PassengerForm {
  name: string;
  last_name: string;
  ruc: string;
  type: string;
}

export const TravelReportFormPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState('');
  const [productType, setProductType] = useState('paquete');
  const [travelDate, setTravelDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('transferencia');
  const [notes, setNotes] = useState('');
  const [totalClient, setTotalClient] = useState<string>('');
  const [totalSupplier, setTotalSupplier] = useState<string>('');
  const [totalAdditional, setTotalAdditional] = useState<string>('');
  const [totalFee, setTotalFee] = useState<string>('');

  const [passengers, setPassengers] = useState<PassengerForm[]>([
    { name: '', last_name: '', ruc: '', type: 'natural' }
  ]);

  const handleAddPassenger = () => {
    setPassengers([...passengers, { name: '', last_name: '', ruc: '', type: 'natural' }]);
  };

  const handleRemovePassenger = (index: number) => {
    if (passengers.length === 1) {
      toast.error('Debe haber al menos un pasajero en el reporte');
      return;
    }
    setPassengers(passengers.filter((_, i) => i !== index));
  };

  const handlePassengerChange = (index: number, field: keyof PassengerForm, value: string) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  // Cálculos dinámicos en tiempo real
  const valClient = parseFloat(totalClient) || 0;
  const valSupplier = parseFloat(totalSupplier) || 0;
  const valAdd = parseFloat(totalAdditional) || 0;
  const valFee = parseFloat(totalFee) || 0;

  const mgt = valClient - valSupplier;
  const taxes = mgt * 0.12; // Estimado 12% para previsualización
  const gnt = mgt - taxes;
  const estCommAgent = gnt * 0.70; // Estimado 70% para el agente

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Por favor ingrese el nombre del reporte o paquete de viaje');
      return;
    }

    const invalidPass = passengers.some(p => !p.name.trim());
    if (invalidPass) {
      toast.error('Todos los pasajeros deben tener un nombre ingresado');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name,
        product_type: productType,
        travel_date: travelDate || undefined,
        payment_method: paymentMethod,
        notes: notes || undefined,
        total_client: valClient > 0 ? valClient : undefined,
        total_supplier: valSupplier > 0 ? valSupplier : undefined,
        total_additional: valAdd > 0 ? valAdd : undefined,
        total_fee: valFee > 0 ? valFee : undefined,
        passengers,
      };

      const res = await travelReportService.createReport(payload);
      toast.success(res.message || 'Reporte de viaje registrado exitosamente');
      router.push(`/travel-reports/${res.data.id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al guardar el reporte de viaje');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 w-full">
      {/* Navigation Header */}
      <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <Link
          href="/travel-reports"
          className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
            <Plane className="w-4 h-4" />
            <span>Nuevo Expediente de Viaje</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Registrar Reporte de Venta de Viajes
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Main Details Section */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <Plane className="w-5 h-5 text-indigo-600" />
            <span>Información General de la Venta y Producto</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Nombre de la Venta / Expediente *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Familia Zambrano - Tour Cancún 7D"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Agente / Vendedor (Generador)
              </label>
              <div className="px-4 py-3 bg-indigo-50/70 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 rounded-2xl text-xs font-black text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-indigo-600" />
                <span>{user?.name || 'Agente en Sesión'} {user?.email ? `(${user.email})` : ''}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Tipo de Producto / Servicio *
              </label>
              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="paquete">Paquete Turístico Completo</option>
                <option value="boletos">Boletos Aéreos / Vuelos</option>
                <option value="hotel">Hotel / Hospedaje</option>
                <option value="seguro">Seguro de Viaje</option>
                <option value="chip">Chip de Viaje / Roaming</option>
                <option value="visa">Asesoría Consular / Visado</option>
                <option value="otro">Otro Servicio</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Fecha de Salida / Viaje
              </label>
              <input
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Método de Pago
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="transferencia">Transferencia Bancaria</option>
                <option value="tarjeta">Tarjeta de Crédito / Débito</option>
                <option value="efectivo">Efectivo</option>
                <option value="deposito">Depósito Bancario</option>
                <option value="otro">Otro Método</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Detalles de la Venta / Observaciones
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Descripción adicional de la venta, itinerario o notas internas..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold h-24 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Passengers Section */}
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <span>Listado de Pasajeros / Clientes</span>
            </h3>
            <button
              type="button"
              onClick={handleAddPassenger}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs hover:bg-indigo-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Pasajero</span>
            </button>
          </div>

          <div className="space-y-4">
            {passengers.map((pass, idx) => (
              <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase">Nombres *</label>
                  <input
                    type="text"
                    required
                    value={pass.name}
                    onChange={(e) => handlePassengerChange(idx, 'name', e.target.value)}
                    placeholder="Nombre completo"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase">Apellidos</label>
                  <input
                    type="text"
                    value={pass.last_name}
                    onChange={(e) => handlePassengerChange(idx, 'last_name', e.target.value)}
                    placeholder="Apellidos"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase">RUC / Cédula / DNI</label>
                  <input
                    type="text"
                    value={pass.ruc}
                    onChange={(e) => handlePassengerChange(idx, 'ruc', e.target.value)}
                    placeholder="Doc. Identificación"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase">Tipo Persona / Categoría</label>
                    <select
                      value={pass.type}
                      onChange={(e) => handlePassengerChange(idx, 'type', e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                    >
                      <option value="natural">Adulto / Principal</option>
                      <option value="ninos">Niños (2-11 años)</option>
                      <option value="bebes">Bebés (0-23 meses)</option>
                      <option value="tercera_edad">Tercera Edad</option>
                      <option value="discapacidad">Persona con discapacidad</option>
                      <option value="juridica">Jurídica / Empresa</option>
                    </select>
                  </div>
                  {passengers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePassenger(idx)}
                      className="mt-4 p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Eliminar pasajero"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Section & Pre-calculation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <Calculator className="w-5 h-5 text-indigo-600" />
              <span>Valores Financieros y Tarifas</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Valor Cliente ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={totalClient}
                  onChange={(e) => setTotalClient(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-extrabold text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Costo Proveedor ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={totalSupplier}
                  onChange={(e) => setTotalSupplier(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-extrabold text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Valor Adicional ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={totalAdditional}
                  onChange={(e) => setTotalAdditional(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Gastos de Gestión / Fees ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={totalFee}
                  onChange={(e) => setTotalFee(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="bg-slate-950 text-white p-6 rounded-3xl border border-slate-800 shadow-xl space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-xs uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Previsualización de Margen</span>
              </div>
              <h4 className="text-lg font-black text-white">Liquidación Estimada</h4>
              <p className="text-slate-400 text-xs mt-1">Cálculo basado en reglas de agencia/equipo.</p>

              <div className="mt-6 space-y-3 divide-y divide-slate-800 text-xs">
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Margen Bruto (MGT):</span>
                  <span className="font-mono font-bold text-white">${mgt.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Impuestos / Retención:</span>
                  <span className="font-mono font-bold text-rose-400">-${taxes.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400 font-bold">Margen Neto (GNT):</span>
                  <span className="font-mono font-black text-emerald-400">${gnt.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Est. Comisión Agente (70%):</span>
                  <span className="font-mono font-bold text-indigo-300">${estCommAgent.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm transition-all shadow-lg shadow-indigo-600/40 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              <span>Guardar y Generar Reporte</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TravelReportFormPage;
