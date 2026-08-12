import React, { useEffect, useState } from 'react';
import adminService from '../../services/adminService';
import { Subscription, Agency, Plan } from '../../types';
import { 
  CreditCard, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  Building, 
  Calendar,
  Layers
} from 'lucide-react';

export const AdminSubscriptionsPage: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);
  const [formData, setFormData] = useState({
    agency_id: '' as string | number,
    plan_id: '' as string | number,
    started_at: new Date().toISOString().split('T')[0],
    expires_at: '',
    status: 'active',
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [subList, agencyList, planList] = await Promise.all([
        adminService.getSubscriptions(),
        adminService.getAgencies(),
        adminService.getPlans(),
      ]);
      setSubscriptions(subList);
      setAgencies(agencyList);
      setPlans(planList);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar las suscripciones.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingSub(null);
    setFormData({
      agency_id: agencies[0]?.id || '',
      plan_id: plans[0]?.id || '',
      started_at: new Date().toISOString().split('T')[0],
      expires_at: '',
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (sub: Subscription) => {
    setEditingSub(sub);
    setFormData({
      agency_id: sub.agency_id,
      plan_id: sub.plan_id,
      started_at: sub.started_at ? sub.started_at.split('T')[0] : '',
      expires_at: sub.expires_at ? sub.expires_at.split('T')[0] : '',
      status: sub.status || 'active',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const payload = {
      agency_id: Number(formData.agency_id),
      plan_id: Number(formData.plan_id),
      started_at: formData.started_at,
      expires_at: formData.expires_at || null,
      status: formData.status,
    };

    try {
      if (editingSub) {
        await adminService.updateSubscription(editingSub.id, payload);
        setSuccess('Suscripción / Plan de agencia actualizado.');
      } else {
        await adminService.createSubscription(payload);
        setSuccess('Suscripción asignada con éxito.');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al procesar la suscripción.');
    }
  };

  const handleCancel = async (id: number) => {
    if (!window.confirm('¿Está seguro de que desea cancelar esta suscripción?')) return;
    try {
      await adminService.cancelSubscription(id);
      setSuccess('Suscripción cancelada correctamente.');
      loadData();
    } catch (err: any) {
      setError('No se pudo cancelar la suscripción.');
    }
  };

  const filteredSubscriptions = subscriptions.filter((s) =>
    (s.agency?.name && s.agency.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (s.plan?.name && s.plan.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Administración de Suscripciones
            </h1>
            <p className="text-xs text-slate-500 font-semibold">
              Control de suscripciones de agencias a los planes del sistema (Agencia → Suscripción → Plan)
            </p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shadow-md shadow-amber-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Suscripción</span>
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

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3 max-w-md">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar por agencia o nombre de plan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent text-xs font-medium outline-none text-slate-800 placeholder-slate-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs animate-pulse">
            Cargando lista de suscripciones...
          </div>
        ) : filteredSubscriptions.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No se encontraron suscripciones registradas.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Agencia</th>
                  <th className="py-3.5 px-4">Plan Suscrito</th>
                  <th className="py-3.5 px-4">Fecha Inicio</th>
                  <th className="py-3.5 px-4">Fecha Expiración</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="font-bold text-slate-900">{sub.agency?.name || `Agencia #${sub.agency_id}`}</p>
                          {sub.agency?.email && (
                            <p className="text-[10px] text-slate-400">{sub.agency.email}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/80 w-fit">
                        <Layers className="w-3.5 h-3.5 text-amber-600" />
                        <span>{sub.plan?.name || `Plan #${sub.plan_id}`}</span>
                        {sub.plan?.price && (
                          <span className="text-[10px] text-slate-500 font-normal ml-1">
                            (${Number(sub.plan.price).toFixed(2)})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      <div className="flex items-center gap-1 text-slate-600">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{sub.started_at ? String(sub.started_at).split('T')[0] : '-'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {sub.expires_at ? (
                        <span className="text-slate-700">{String(sub.expires_at).split('T')[0]}</span>
                      ) : (
                        <span className="text-emerald-600 font-bold text-[10px] uppercase">Indefinido / Vitalicio</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          sub.status === 'active' || !sub.status
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {sub.status === 'active' || !sub.status ? 'Activa' : 'Cancelada'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(sub)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Cambiar Plan / Editar"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleCancel(sub.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Cancelar Suscripción"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Subscription Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-up-fade">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingSub ? 'Editar Suscripción / Cambiar Plan' : 'Asignar Suscripción a Agencia'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Agencia *</label>
                <select
                  disabled={!!editingSub}
                  required
                  value={formData.agency_id}
                  onChange={(e) => setFormData({ ...formData, agency_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-amber-500 text-xs bg-white disabled:bg-slate-100"
                >
                  <option value="">Seleccionar Agencia...</option>
                  {agencies.map((agency) => (
                    <option key={agency.id} value={agency.id}>
                      {agency.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Plan de Suscripción *</label>
                <select
                  required
                  value={formData.plan_id}
                  onChange={(e) => setFormData({ ...formData, plan_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-amber-500 text-xs bg-white font-bold text-amber-700"
                >
                  <option value="">Seleccionar Plan...</option>
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} (${Number(plan.price).toFixed(2)}/mes)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fecha de Inicio *</label>
                  <input
                    type="date"
                    required
                    value={formData.started_at}
                    onChange={(e) => setFormData({ ...formData, started_at: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fecha Expiración</label>
                  <input
                    type="date"
                    value={formData.expires_at}
                    onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-amber-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Estado de la Suscripción</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-amber-500 text-xs bg-white"
                >
                  <option value="active">Activa</option>
                  <option value="canceled">Cancelada</option>
                  <option value="expired">Expirada</option>
                </select>
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
                  {editingSub ? 'Guardar Cambios' : 'Asignar Suscripción'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubscriptionsPage;
