import React, { useEffect, useState } from 'react';
import adminService from '../../services/adminService';
import { Plan, PlanPermission, Permission } from '../../types';
import { 
  Layers, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Shield, 
  Search, 
  X,
  AlertCircle
} from 'lucide-react';

export const AdminPlansPage: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [systemPermissions, setSystemPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    featuresStr: '',
    allowedAgencyTypesStr: '',
    status: true,
  });

  // Permission Modal State
  const [permissionModalPlan, setPermissionModalPlan] = useState<Plan | null>(null);
  const [newPermission, setNewPermission] = useState<string>('');

  const loadPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const [plansData, permsData] = await Promise.all([
        adminService.getPlans(),
        adminService.getPermissions(),
      ]);
      setPlans(plansData);
      setSystemPermissions(permsData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar los planes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const openCreateModal = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      featuresStr: '',
      allowedAgencyTypesStr: 'real_estate, travel',
      status: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description || '',
      price: plan.price,
      featuresStr: Array.isArray(plan.features) ? plan.features.join(', ') : '',
      allowedAgencyTypesStr: Array.isArray(plan.allowed_agency_types)
        ? plan.allowed_agency_types.join(', ')
        : '',
      status: plan.status ?? true,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const payload = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      features: formData.featuresStr
        ? formData.featuresStr.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      allowed_agency_types: formData.allowedAgencyTypesStr
        ? formData.allowedAgencyTypesStr.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      status: formData.status,
    };

    try {
      if (editingPlan) {
        await adminService.updatePlan(editingPlan.id, payload);
        setSuccess('Plan actualizado con éxito.');
      } else {
        await adminService.createPlan(payload);
        setSuccess('Plan creado con éxito.');
      }
      setIsModalOpen(false);
      loadPlans();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar el plan.');
    }
  };

  const handleToggleStatus = async (plan: Plan) => {
    try {
      await adminService.togglePlanStatus(plan.id);
      loadPlans();
    } catch (err: any) {
      setError('Error al cambiar estado del plan.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este plan?')) return;
    try {
      await adminService.deletePlan(id);
      setSuccess('Plan eliminado correctamente.');
      loadPlans();
    } catch (err: any) {
      setError('No se pudo eliminar el plan. Verifique si tiene agencias asociadas.');
    }
  };

  const handleAddPlanPermission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!permissionModalPlan || !newPermission.trim()) return;
    try {
      await adminService.addPlanPermission(permissionModalPlan.id, newPermission.trim());
      setNewPermission('');
      const updatedPermissions = await adminService.getPlanPermissions(permissionModalPlan.id);
      setPermissionModalPlan({
        ...permissionModalPlan,
        plan_permissions: updatedPermissions,
      });
      loadPlans();
    } catch (err: any) {
      setError('Error al agregar permiso al plan.');
    }
  };

  const handleDeletePlanPermission = async (planId: number, permissionId: number) => {
    try {
      await adminService.deletePlanPermission(planId, permissionId);
      if (permissionModalPlan) {
        const updatedPermissions = await adminService.getPlanPermissions(planId);
        setPermissionModalPlan({
          ...permissionModalPlan,
          plan_permissions: updatedPermissions,
        });
      }
      loadPlans();
    } catch (err: any) {
      setError('Error al eliminar permiso del plan.');
    }
  };

  const filteredPlans = plans.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Gestión de Planes
              </h1>
              <p className="text-xs text-slate-500 font-semibold">
                Administra los planes de suscripción globales del sistema
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shadow-md shadow-amber-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Plan</span>
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

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3 max-w-md">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar planes por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent text-xs font-medium outline-none text-slate-800 placeholder-slate-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs animate-pulse">
            Cargando lista de planes...
          </div>
        ) : filteredPlans.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No se encontraron planes configurados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Plan</th>
                  <th className="py-3.5 px-4">Precio</th>
                  <th className="py-3.5 px-4">Tipos de Agencia</th>
                  <th className="py-3.5 px-4">Permisos Asignados</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{plan.name}</p>
                      {plan.description && (
                        <p className="text-[11px] text-slate-500 line-clamp-1">{plan.description}</p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      ${Number(plan.price).toFixed(2)} <span className="text-[10px] text-slate-400 font-normal">/mes</span>
                    </td>
                    <td className="py-3.5 px-4">
                      {plan.allowed_agency_types && plan.allowed_agency_types.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {plan.allowed_agency_types.map((type, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[10px]">Todos</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => setPermissionModalPlan(plan)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-[11px] transition-colors"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        <span>{plan.plan_permissions?.length || 0} permisos</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleStatus(plan)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                          plan.status ?? true
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {plan.status ?? true ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Activo</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-slate-400" />
                            <span>Inactivo</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(plan)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Editar"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(plan.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Eliminar"
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

      {/* Create / Edit Plan Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-slide-up-fade">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {editingPlan ? 'Editar Plan' : 'Crear Nuevo Plan'}
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
                <label className="block font-bold text-slate-700 mb-1">Nombre del Plan *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="ej. Plan Premium Inmobiliario"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalles sobre los beneficios de este plan..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Precio Mensual ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estado</label>
                  <select
                    value={formData.status ? '1' : '0'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value === '1' })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-amber-500 text-xs bg-white"
                  >
                    <option value="1">Activo</option>
                    <option value="0">Inactivo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Características (separadas por comas)
                </label>
                <input
                  type="text"
                  value={formData.featuresStr}
                  onChange={(e) => setFormData({ ...formData, featuresStr: e.target.value })}
                  placeholder="CRM Ilimitado, 50 Propiedades, Soporte 24/7"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tipos de Agencia Permitidos (separados por comas)
                </label>
                <input
                  type="text"
                  value={formData.allowedAgencyTypesStr}
                  onChange={(e) => setFormData({ ...formData, allowedAgencyTypesStr: e.target.value })}
                  placeholder="real_estate, travel"
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
                  {editingPlan ? 'Guardar Cambios' : 'Crear Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Plan Permissions Modal */}
      {permissionModalPlan && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-slide-up-fade max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Seleccionar Permisos para el Plan: <span className="text-amber-600">{permissionModalPlan.name}</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Marca los permisos y módulos que tendrán habilitados las agencias suscritas a este plan.
                </p>
              </div>
              <button
                onClick={() => setPermissionModalPlan(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick custom permission input */}
            <form onSubmit={handleAddPlanPermission} className="flex gap-2 mb-4">
              <input
                type="text"
                required
                placeholder="Añadir permiso personalizado (ej. view_custom_module)"
                value={newPermission}
                onChange={(e) => setNewPermission(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 outline-none text-xs font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
              >
                Agregar
              </button>
            </form>

            {/* Checkbox List of Available System Permissions */}
            <div className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider text-[10px]">
              Permisos del Sistema Disponibles ({systemPermissions.length}):
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1 min-h-[200px] max-h-[300px]">
              {systemPermissions.map((sysPerm) => {
                const assigned = permissionModalPlan.plan_permissions?.find(
                  (p) => p.permission.toLowerCase() === sysPerm.name.toLowerCase()
                );
                return (
                  <div
                    key={sysPerm.id}
                    onClick={async () => {
                      if (assigned) {
                        await handleDeletePlanPermission(permissionModalPlan.id, assigned.id);
                      } else {
                        try {
                          await adminService.addPlanPermission(permissionModalPlan.id, sysPerm.name);
                          const updated = await adminService.getPlanPermissions(permissionModalPlan.id);
                          setPermissionModalPlan({
                            ...permissionModalPlan,
                            plan_permissions: updated,
                          });
                          loadPlans();
                        } catch (err) {
                          setError('Error al asignar permiso.');
                        }
                      }
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      assigned
                        ? 'bg-amber-50/80 border-amber-300 text-amber-900 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={!!assigned}
                        onChange={() => {}}
                        className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                      />
                      <div>
                        <p className="font-mono font-bold text-xs">{sysPerm.name}</p>
                        <p className="text-[10px] text-slate-400">Guard: {sysPerm.guard_name || 'web'}</p>
                      </div>
                    </div>
                    {assigned && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                        Asignado
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 text-right">
              <button
                onClick={() => setPermissionModalPlan(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
              >
                Listo / Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPlansPage;
