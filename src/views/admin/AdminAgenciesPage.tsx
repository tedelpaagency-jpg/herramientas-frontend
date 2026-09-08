'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import adminService from '../../services/adminService';
import { Agency, Plan } from '../../types';
import { 
  Building, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Search, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  CreditCard,
  Globe
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import whiteLabelService from '../../services/whiteLabelService';
import { WhiteLabel } from '../../types/whiteLabel';
import { TableSkeleton } from '@/components/Skeleton';

export const AdminAgenciesPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const isSuperAdmin = currentUser?.role === 'super_admin' || currentUser?.roles?.some(r => r.name === 'super_admin');
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [whiteLabels, setWhiteLabels] = useState<WhiteLabel[]>([]);
  const [whiteLabelFilter, setWhiteLabelFilter] = useState<number | ''>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingAgency, setEditingAgency] = useState<Agency | null>(null);
  const [viewingAgency, setViewingAgency] = useState<Agency | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    razon_social: '',
    ruc: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    domain: '',
    plan_id: '' as string | number,
    status: 1,
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const agencyList = await adminService.getAgencies({
        white_label_id: whiteLabelFilter ? Number(whiteLabelFilter) : undefined,
      });
      setAgencies(agencyList);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar las agencias.');
    }

    try {
      const planList = await adminService.getPlans();
      setPlans(planList);
    } catch (err) {
      // Ignorar
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [whiteLabelFilter]);

  useEffect(() => {
    if (isSuperAdmin) {
      whiteLabelService.getWhiteLabels()
        .then(res => setWhiteLabels(Array.isArray(res) ? res : res?.data || []))
        .catch(err => console.error('Error cargando Marcas Blancas:', err));
    }
  }, [isSuperAdmin]);

  const openCreateModal = () => {
    setEditingAgency(null);
    setFormData({
      name: '',
      razon_social: '',
      ruc: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      province: '',
      domain: '',
      plan_id: plans[0]?.id || '',
      status: 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (agency: Agency) => {
    setEditingAgency(agency);
    setFormData({
      name: agency.name,
      razon_social: agency.razon_social || '',
      ruc: agency.ruc || '',
      email: agency.email || '',
      phone: agency.phone || '',
      address: agency.address || '',
      city: agency.city || '',
      province: agency.province || '',
      domain: agency.domain || '',
      plan_id: agency.plan_id || '',
      status: agency.status ?? 1,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const payload = {
      ...formData,
      plan_id: formData.plan_id ? Number(formData.plan_id) : undefined,
    };

    try {
      if (editingAgency) {
        await adminService.updateAgency(editingAgency.id, payload);
        setSuccess('Agencia actualizada con éxito.');
      } else {
        await adminService.createAgency(payload);
        setSuccess('Agencia creada con éxito.');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar la agencia.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Está seguro de que desea eliminar esta agencia?')) return;
    try {
      await adminService.deleteAgency(id);
      setSuccess('Agencia eliminada correctamente.');
      loadData();
    } catch (err: any) {
      setError('No se pudo eliminar la agencia. Verifique dependencias vinculadas.');
    }
  };

  const filteredAgencies = agencies.filter((a) =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.email && a.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (a.ruc && a.ruc.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (a.domain && a.domain.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Gestión de Agencias
            </h1>
            <p className="text-xs text-slate-500 font-semibold">
              Administra las empresas y agencias multitenant registradas en la plataforma
            </p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shadow-md shadow-amber-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Agencia</span>
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Search Bar & Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3 flex-1 min-w-[280px] max-w-md">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar agencia por nombre, RUC, email o dominio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-xs font-medium outline-none text-slate-800 placeholder-slate-400"
          />
        </div>

        {isSuperAdmin && (
          <select
            value={whiteLabelFilter}
            onChange={(e) => setWhiteLabelFilter(e.target.value ? Number(e.target.value) : '')}
            className="px-4 py-3 bg-purple-50 border border-purple-200 rounded-xl text-xs font-bold text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-600/20 max-w-[220px] truncate"
          >
            <option value="">Todas las Marcas Blancas</option>
            {whiteLabels.map((wl) => (
              <option key={wl.id} value={wl.id}>{wl.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <TableSkeleton rows={5} />
        ) : filteredAgencies.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No se encontraron agencias registradas.
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-3 sm:px-4 whitespace-nowrap">Agencia</th>
                  <th className="py-3 px-3 sm:px-4 whitespace-nowrap">Contacto / Email</th>
                  <th className="py-3 px-3 sm:px-4 whitespace-nowrap">Dominio</th>
                  <th className="py-3 px-3 sm:px-4 whitespace-nowrap">Plan Actual</th>
                  <th className="py-3 px-3 sm:px-4 whitespace-nowrap">Estado</th>
                  <th className="py-3 px-3 sm:px-4 text-right whitespace-nowrap">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAgencies.map((agency) => {
                  const currentPlan = agency.current_subscription?.plan || agency.plan;
                  return (
                    <tr key={agency.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 sm:px-4">
                        <p className="font-bold text-slate-900 whitespace-nowrap">{agency.name}</p>
                        {agency.razon_social && (
                          <p className="text-[11px] text-slate-400 whitespace-nowrap">{agency.razon_social}</p>
                        )}
                        {agency.ruc && (
                          <p className="text-[10px] font-mono text-slate-500 whitespace-nowrap">RUC: {agency.ruc}</p>
                        )}
                      </td>
                      <td className="py-3 px-3 sm:px-4">
                        <p className="font-semibold text-slate-800 whitespace-nowrap">{agency.email || 'Sin email'}</p>
                        <p className="text-[11px] text-slate-400 whitespace-nowrap">{agency.phone || '-'}</p>
                      </td>
                      <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                        {agency.domain ? (
                          <span className="inline-flex items-center gap-1 font-mono text-[11px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                            <Globe className="w-3 h-3" />
                            <span>{agency.domain}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">-</span>
                        )}
                      </td>
                      <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                        {currentPlan ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <CreditCard className="w-3 h-3" />
                            <span>{currentPlan.name}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Sin plan activo</span>
                        )}
                      </td>
                      <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            agency.status === 1
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          {agency.status === 1 ? 'Activa' : 'Inactiva'}
                        </span>
                      </td>
                      <td className="py-3 px-3 sm:px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/agencies/${agency.id}`}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Ver Perfil Completo de Agencia"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => openEditModal(agency)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Editar"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(agency.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-2xl w-full p-4 sm:p-6 animate-slide-up-fade max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {editingAgency ? 'Editar Agencia' : 'Crear Nueva Agencia'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nombre Comercial *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="ej. Inmobiliaria Central"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Razón Social</label>
                  <input
                    type="text"
                    value={formData.razon_social}
                    onChange={(e) => setFormData({ ...formData, razon_social: e.target.value })}
                    placeholder="ej. Inmobiliaria Central S.A.C."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">RUC / NIT</label>
                  <input
                    type="text"
                    value={formData.ruc}
                    onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
                    placeholder="20123456789"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-amber-500 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contacto@agencia.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+51 987 654 321"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dominio Personalizado</label>
                  <input
                    type="text"
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    placeholder="miagencia.tedelpa.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-amber-500 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ciudad</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Lima"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Plan Inicial</label>
                  <select
                    value={formData.plan_id}
                    onChange={(e) => setFormData({ ...formData, plan_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-amber-500 text-xs bg-white"
                  >
                    <option value="">Seleccionar Plan...</option>
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} ({plan.billing_type === 'commission' ? `${plan.commission_percentage || 0}% Comisión` : `$${Number(plan.price).toFixed(2)}/mes`})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Dirección Física</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Av. Principal 123, Of. 401"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-colors shadow-md shadow-amber-600/20"
                >
                  {editingAgency ? 'Guardar Cambios' : 'Crear Agencia'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Agency Details Modal */}
      {viewingAgency && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-slide-up-fade">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">{viewingAgency.name}</h3>
                <p className="text-xs text-slate-400">{viewingAgency.razon_social || 'Información de Agencia'}</p>
              </div>
              <button
                onClick={() => setViewingAgency(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Plan & Suscripción Actual</p>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-sm">
                    {viewingAgency.current_subscription?.plan?.name || viewingAgency.plan?.name || 'Sin Plan Asignado'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    {viewingAgency.current_subscription?.status || 'Activa'}
                  </span>
                </div>
                {viewingAgency.current_subscription && (
                  <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" />
                    <span>Iniciado: {viewingAgency.current_subscription.started_at}</span>
                    {viewingAgency.current_subscription.expires_at && (
                      <span>| Expira: {viewingAgency.current_subscription.expires_at}</span>
                    )}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">RUC / Tax ID</span>
                  <p className="font-mono text-slate-800 font-semibold">{viewingAgency.ruc || '-'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Correo Electrónico</span>
                  <p className="text-slate-800 font-semibold">{viewingAgency.email || '-'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Teléfono</span>
                  <p className="text-slate-800 font-semibold">{viewingAgency.phone || '-'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Dominio</span>
                  <p className="font-mono text-slate-800 font-semibold">{viewingAgency.domain || '-'}</p>
                </div>
              </div>

              {viewingAgency.address && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Dirección</span>
                  <p className="text-slate-800">{viewingAgency.address}, {viewingAgency.city}</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-right">
              <button
                onClick={() => setViewingAgency(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAgenciesPage;
