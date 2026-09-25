'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import adminService from '../../services/adminService';
import whiteLabelService from '../../services/whiteLabelService';
import { Plan, Permission } from '../../types';
import { WhiteLabel } from '../../types/whiteLabel';
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
  AlertCircle,
  Globe,
  Building2,
  Filter
} from 'lucide-react';
import { TableSkeleton } from '@/components/Skeleton';

export const AdminPlansPage: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [whiteLabels, setWhiteLabels] = useState<WhiteLabel[]>([]);
  const [systemPermissions, setSystemPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Filter & Tab state
  const [activeTab, setActiveTab] = useState<'all' | 'global' | 'white_label'>('all');
  const [selectedWlId, setSelectedWlId] = useState<string | number>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'agency' as 'white_label' | 'agency',
    white_label_id: '' as string | number,
    price: 0,
    billing_type: 'fixed' as 'fixed' | 'commission',
    commission_percentage: 0,
    duration_value: 1,
    duration_unit: 'month' as 'day' | 'month' | 'year',
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
      const [plansData, permsData, wlData] = await Promise.all([
        adminService.getPlans(),
        adminService.getPermissions(),
        whiteLabelService.getWhiteLabels().catch(() => []),
      ]);
      setPlans(plansData || []);
      setSystemPermissions(permsData || []);

      const wlList = Array.isArray(wlData) ? wlData : (wlData?.data || []);
      setWhiteLabels(wlList);
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
      type: 'agency',
      white_label_id: '',
      price: 0,
      billing_type: 'fixed',
      commission_percentage: 0,
      duration_value: 1,
      duration_unit: 'month',
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
      type: plan.type || 'agency',
      white_label_id: plan.white_label_id || '',
      price: plan.price,
      billing_type: plan.billing_type || 'fixed',
      commission_percentage: plan.commission_percentage || 0,
      duration_value: plan.duration_value || 1,
      duration_unit: plan.duration_unit || 'month',
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
      type: formData.type,
      white_label_id: formData.white_label_id ? Number(formData.white_label_id) : null,
      price: Number(formData.price),
      billing_type: formData.billing_type,
      commission_percentage: formData.billing_type === 'commission' ? Number(formData.commission_percentage) : null,
      duration_value: Number(formData.duration_value),
      duration_unit: formData.duration_unit,
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

  // Helper to check if a plan is Global (created for system / without specific WL)
  const isGlobalPlan = (p: Plan) => !p.white_label_id && (p.type === 'white_label' || !p.white_label);

  const globalPlansCount = plans.filter(isGlobalPlan).length;
  const whiteLabelPlansCount = plans.filter((p) => !isGlobalPlan(p)).length;

  const filteredPlans = plans.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.white_label?.name && p.white_label.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    // Filter by tab selection
    if (activeTab === 'global' && !isGlobalPlan(p)) return false;
    if (activeTab === 'white_label' && isGlobalPlan(p)) return false;

    // Filter by selected Marca Blanca dropdown
    if (selectedWlId !== 'all') {
      const targetId = Number(selectedWlId);
      if (p.white_label_id !== targetId && p.white_label?.id !== targetId) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                Gestión de Planes
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                Administra los planes de suscripción globales del sistema y de Marcas Blancas
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

      {/* Main Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => { setActiveTab('all'); setSelectedWlId('all'); }}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
            activeTab === 'all'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <span>Todos los Planes</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
            {plans.length}
          </span>
        </button>

        <button
          onClick={() => { setActiveTab('global'); setSelectedWlId('all'); }}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
            activeTab === 'global'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Planes Globales (Sistema)</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'global' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
            {globalPlansCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('white_label')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
            activeTab === 'white_label'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Planes de Marcas Blancas</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'white_label' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
            {whiteLabelPlansCount}
          </span>
        </button>
      </div>

      {/* Filter Controls: Search & Marca Blanca Select Dropdown */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between">
        {/* Search */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre de plan o marca blanca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-xs font-medium outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>

        {/* Marca Blanca Selector Dropdown */}
        {(activeTab === 'white_label' || activeTab === 'all') && whiteLabels.length > 0 && (
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <Filter className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 whitespace-nowrap">
              Marca Blanca:
            </span>
            <select
              value={selectedWlId}
              onChange={(e) => setSelectedWlId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="bg-transparent text-xs font-bold text-slate-900 dark:text-slate-100 outline-none cursor-pointer"
            >
              <option value="all">Todas las Marcas Blancas ({whiteLabels.length})</option>
              {whiteLabels.map((wl) => (
                <option key={wl.id} value={wl.id}>
                  🏢 {wl.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Quick Marca Blanca Filter Chips (when Marcas Blancas exist and tab is white_label or all) */}
      {(activeTab === 'white_label' || activeTab === 'all') && whiteLabels.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0">
            Filtrar Marca:
          </span>
          <button
            onClick={() => setSelectedWlId('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors shrink-0 ${
              selectedWlId === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Todas
          </button>
          {whiteLabels.map((wl) => (
            <button
              key={wl.id}
              onClick={() => setSelectedWlId(wl.id)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 ${
                selectedWlId === wl.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50 hover:bg-purple-100 dark:hover:bg-purple-900/40'
              }`}
            >
              <Building2 className="w-3 h-3" />
              <span>{wl.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <TableSkeleton rows={5} />
        ) : filteredPlans.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400 text-xs">
            No se encontraron planes que coincidan con la búsqueda o filtro seleccionado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Plan</th>
                  <th className="py-3.5 px-4">Origen / Marca Blanca</th>
                  <th className="py-3.5 px-4">Método de Cobro</th>
                  <th className="py-3.5 px-4">Precio</th>
                  <th className="py-3.5 px-4">Tipos de Agencia</th>
                  <th className="py-3.5 px-4">Permisos</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredPlans.map((plan) => {
                  const isGlobal = isGlobalPlan(plan);
                  return (
                    <tr key={plan.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900 dark:text-slate-100">{plan.name}</p>
                        {plan.description && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{plan.description}</p>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {isGlobal ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800 font-bold text-[10px]">
                            <Globe className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                            <span>Global (Sistema)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800 font-bold text-[10px]">
                            <Building2 className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                            <span>{plan.white_label?.name || `Marca Blanca #${plan.white_label_id}`}</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-semibold">
                        {plan.billing_type === 'commission' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <span>Comisión</span>
                            {plan.commission_percentage !== null && plan.commission_percentage !== undefined && (
                              <span className="font-extrabold">({plan.commission_percentage}%)</span>
                            )}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            Cargo Fijo
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                        ${Number(plan.price).toFixed(2)}{' '}
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                          /{' '}
                          {plan.duration_value && plan.duration_value > 1
                            ? `${plan.duration_value} `
                            : ''}
                          {plan.duration_unit === 'year'
                            ? (plan.duration_value && plan.duration_value > 1 ? 'años' : 'año')
                            : plan.duration_unit === 'day'
                            ? (plan.duration_value && plan.duration_value > 1 ? 'días' : 'día')
                            : (plan.duration_value && plan.duration_value > 1 ? 'meses' : 'mes')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {plan.allowed_agency_types && plan.allowed_agency_types.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {plan.allowed_agency_types.map((type, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
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
                        <Link
                          href={`/admin/plans/${plan.id}/permissions`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold text-[11px] transition-colors"
                        >
                          <Shield className="w-3.5 h-3.5" />
                          <span>{plan.plan_permissions?.length || 0} permisos</span>
                        </Link>
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
                            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                            title="Editar"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(plan.id)}
                            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors"
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

      {/* Create / Edit Plan Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-slide-up-fade">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {editingPlan ? 'Editar Plan' : 'Crear Nuevo Plan'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre del Plan *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="ej. Plan Premium Inmobiliario"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-500 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalles sobre los beneficios de este plan..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-500 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              {/* Asignación Marca Blanca vs Global */}
              {whiteLabels.length > 0 && (
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Marca Blanca Asociada</label>
                  <select
                    value={formData.white_label_id}
                    onChange={(e) => setFormData({ ...formData, white_label_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-500 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold"
                  >
                    <option value="">🌐 Plan Global (Sistema / Sin Marca Blanca)</option>
                    {whiteLabels.map((wl) => (
                      <option key={wl.id} value={wl.id}>
                        🏢 {wl.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tipo de Plan (Destinatario) *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'white_label' | 'agency' })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-500 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold"
                  >
                    <option value="agency">Plan para Agencias</option>
                    <option value="white_label">Plan para Marcas Blancas (Organizaciones)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Método de Cobro *</label>
                  {(() => {
                    const isTravelAllowed = formData.allowedAgencyTypesStr.toLowerCase().includes('travel') || 
                      (editingPlan ? (editingPlan.allowed_agency_types?.includes('travel') || editingPlan.plan_permissions?.some(p => p.permission.startsWith('packages.') || p.permission.startsWith('requests.') || p.permission.includes('travel') || p.permission.includes('visa'))) : true);
                    return (
                      <>
                        <select
                          value={formData.billing_type}
                          onChange={(e) => setFormData({ ...formData, billing_type: e.target.value as 'fixed' | 'commission' })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-500 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold"
                        >
                          <option value="fixed">Cargo Fijo</option>
                          <option value="commission" disabled={!isTravelAllowed}>
                            Por Comisión {!isTravelAllowed ? '(Requiere Módulo Viajes)' : ''}
                          </option>
                        </select>
                        {!isTravelAllowed && (
                          <p className="text-[10px] text-amber-700 mt-1 font-semibold leading-tight">
                            * El cobro por comisión requiere el Módulo de Viajes ("travel").
                          </p>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>

              {formData.billing_type === 'commission' && (
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">% de Comisión *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    required
                    value={formData.commission_percentage}
                    onChange={(e) => setFormData({ ...formData, commission_percentage: parseFloat(e.target.value) || 0 })}
                    placeholder="ej. 5.00"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-500 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              )}

              {/* Precio y Duración de la Suscripción */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl border border-amber-200/60 dark:border-amber-900/40">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Precio ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    placeholder="ej. 99.00"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-500 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tiempo/Duración *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.duration_value}
                    onChange={(e) => setFormData({ ...formData, duration_value: parseInt(e.target.value) || 1 })}
                    placeholder="ej. 1"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-500 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Unidad de Tiempo *</label>
                  <select
                    value={formData.duration_unit}
                    onChange={(e) => setFormData({ ...formData, duration_unit: e.target.value as 'day' | 'month' | 'year' })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-500 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold"
                  >
                    <option value="month">Mes(es)</option>
                    <option value="year">Año(s)</option>
                    <option value="day">Día(s)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Estado</label>
                <select
                  value={formData.status ? '1' : '0'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value === '1' })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-500 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="1">Activo</option>
                  <option value="0">Inactivo</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Características (separadas por comas)
                </label>
                <input
                  type="text"
                  value={formData.featuresStr}
                  onChange={(e) => setFormData({ ...formData, featuresStr: e.target.value })}
                  placeholder="CRM Ilimitado, 50 Propiedades, Soporte 24/7"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-500 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tipos de Agencia Permitidos (separados por comas)
                </label>
                <input
                  type="text"
                  value={formData.allowedAgencyTypesStr}
                  onChange={(e) => setFormData({ ...formData, allowedAgencyTypesStr: e.target.value })}
                  placeholder="real_estate, travel"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-500 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
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
    </div>
  );
};

export default AdminPlansPage;
