'use client';

import React, { useEffect, useState } from 'react';
import { Subscription, Plan, Agency } from '../../types';
import { WhiteLabel } from '../../types/whiteLabel';
import subscriptionService from '../../services/subscriptionService';
import adminService from '../../services/adminService';
import whiteLabelService from '../../services/whiteLabelService';
import { useAuth } from '../../context/AuthContext';
import { 
  Key, Calendar, Clock, AlertTriangle, CheckCircle2, ShieldAlert, Plus, Search, 
  RotateCcw, Layers, XCircle, History, ArrowRight, Building, Globe, Loader2, Filter, Eye
} from 'lucide-react';
import { TableSkeleton } from '@/components/Skeleton';
import toast from 'react-hot-toast';
import { confirmDialog, showSuccessAlert } from '../../utils/alerts';
import Portal from '../../components/Portal';

export const SubscriptionsPage: React.FC = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin' || user?.roles?.some(r => r.name === 'super_admin');
  const isWhiteLabelAdmin = user?.role === 'white_label_admin' || user?.roles?.some(r => r.name === 'white_label_admin');

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [whiteLabels, setWhiteLabels] = useState<WhiteLabel[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [activeTab, setActiveTab] = useState<'white_label' | 'agency'>(isSuperAdmin ? 'white_label' : 'agency');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [planFilter, setPlanFilter] = useState<number | ''>('');
  const [search, setSearch] = useState<string>('');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [isChangePlanModalOpen, setIsChangePlanModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [historyList, setHistoryList] = useState<Subscription[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Form State
  const [targetEntityId, setTargetEntityId] = useState<number | ''>('');
  const [selectedPlanId, setSelectedPlanId] = useState<number | ''>('');
  const [startDate, setStartDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [subsRes, plansRes]: [any, any] = await Promise.all([
        subscriptionService.getSubscriptions({ type: activeTab }),
        adminService.getPlans(),
      ]);

      const subsData = Array.isArray(subsRes) ? subsRes : subsRes?.data || [];
      const plansData = Array.isArray(plansRes) ? plansRes : plansRes?.data || [];

      setSubscriptions(subsData);
      setPlans(plansData);

      if (isSuperAdmin) {
        const wlRes: any = await whiteLabelService.getWhiteLabels();
        setWhiteLabels(Array.isArray(wlRes) ? wlRes : wlRes?.data || []);
      }

      const agRes: any = await adminService.getAgencies();
      setAgencies(Array.isArray(agRes) ? agRes : agRes?.data || []);
    } catch (err) {
      console.error('Error al cargar suscripciones:', err);
      toast.error('Error al obtener la lista de suscripciones');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [activeTab]);

  const handleOpenCreateModal = () => {
    setTargetEntityId('');
    setSelectedPlanId('');
    setStartDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setIsCreateModalOpen(true);
  };

  const handleOpenRenewModal = (sub: Subscription) => {
    setSelectedSubscription(sub);
    setSelectedPlanId(sub.plan_id);
    setNotes('');
    setIsRenewModalOpen(true);
  };

  const handleOpenChangePlanModal = (sub: Subscription) => {
    setSelectedSubscription(sub);
    setSelectedPlanId(sub.plan_id);
    setNotes('');
    setIsChangePlanModalOpen(true);
  };

  const handleOpenHistoryModal = async (sub: Subscription) => {
    setSelectedSubscription(sub);
    setIsHistoryModalOpen(true);
    setLoadingHistory(true);
    try {
      const entityType = sub.subscribable_type?.includes('WhiteLabel') ? 'white_label' : 'agency';
      const entityId = sub.subscribable_id || (sub as any).agency_id;
      if (entityId) {
        const res = await subscriptionService.getHistory(entityType, entityId);
        setHistoryList(Array.isArray(res) ? res : res?.data || []);
      }
    } catch (err) {
      console.error('Error al cargar historial:', err);
      toast.error('Error al obtener historial de suscripciones');
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleCreateSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEntityId || !selectedPlanId) {
      toast.error('Seleccione una organización y un plan válido.');
      return;
    }

    setIsSubmitting(true);
    try {
      await subscriptionService.createSubscription({
        entity_type: activeTab,
        entity_id: Number(targetEntityId),
        plan_id: Number(selectedPlanId),
        start_date: startDate || undefined,
        notes,
      });

      showSuccessAlert('Suscripción Asignada', 'La suscripción fue registrada exitosamente.');
      setIsCreateModalOpen(false);
      fetchInitialData();
    } catch (err: any) {
      console.error('Error al crear suscripción:', err);
      toast.error(err.response?.data?.message || err.message || 'Error al asignar suscripción');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRenewSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubscription) return;

    setIsSubmitting(true);
    try {
      await subscriptionService.renewSubscription(selectedSubscription.id, {
        plan_id: selectedPlanId ? Number(selectedPlanId) : undefined,
        notes,
      });

      showSuccessAlert('Suscripción Renovada', 'Se ha renovado el período de acceso exitosamente.');
      setIsRenewModalOpen(false);
      fetchInitialData();
    } catch (err: any) {
      console.error('Error al renovar suscripción:', err);
      toast.error(err.response?.data?.message || err.message || 'Error al renovar suscripción');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubscription || !selectedPlanId) return;

    setIsSubmitting(true);
    try {
      await subscriptionService.changePlan(selectedSubscription.id, {
        plan_id: Number(selectedPlanId),
        notes,
      });

      showSuccessAlert('Plan Modificado', 'El plan de suscripción fue actualizado correctamente.');
      setIsChangePlanModalOpen(false);
      fetchInitialData();
    } catch (err: any) {
      console.error('Error al cambiar plan:', err);
      toast.error(err.response?.data?.message || err.message || 'Error al cambiar de plan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelSubscription = async (sub: Subscription) => {
    const confirmed = await confirmDialog({
      title: '¿Cancelar Suscripción?',
      text: `Esta acción suspenderá el acceso a la plataforma para la organización.`,
      confirmButtonText: 'Sí, cancelar suscripción',
      confirmButtonColor: '#ef4444',
    });
    if (!confirmed) return;

    try {
      await subscriptionService.cancelSubscription(sub.id);
      showSuccessAlert('Suscripción Cancelada', 'La suscripción ha sido suspendida.');
      fetchInitialData();
    } catch (err: any) {
      console.error('Error al cancelar suscripción:', err);
      toast.error('Error al cancelar la suscripción');
    }
  };

  const getDaysRemaining = (sub: Subscription): number => {
    if (sub.days_remaining !== undefined && sub.days_remaining !== null) {
      return sub.days_remaining;
    }
    if (!sub.end_date) return 0;
    const end = new Date(sub.end_date).getTime();
    const now = new Date().getTime();
    if (isNaN(end) || end <= now) return 0;
    return Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  };

  // Metrics
  const totalCount = subscriptions.length;
  const activeCount = subscriptions.filter(s => s.status === 'active' && getDaysRemaining(s) > 0).length;
  const expiringSoonCount = subscriptions.filter(s => s.status === 'active' && getDaysRemaining(s) <= 7 && getDaysRemaining(s) > 0).length;
  const expiredCount = subscriptions.filter(s => s.status === 'expired' || s.status === 'cancelled' || getDaysRemaining(s) <= 0).length;

  // Filtered List
  const filteredSubscriptions = subscriptions.filter(s => {
    const entityName = s.subscribable?.name || s.agency?.name || '';
    const planName = s.plan?.name || '';
    const matchesSearch = entityName.toLowerCase().includes(search.toLowerCase()) || planName.toLowerCase().includes(search.toLowerCase());
    
    let matchesStatus = true;
    const daysLeft = getDaysRemaining(s);
    if (statusFilter === 'active') matchesStatus = s.status === 'active' && daysLeft > 0;
    if (statusFilter === 'expiring') matchesStatus = s.status === 'active' && daysLeft <= 7 && daysLeft > 0;
    if (statusFilter === 'expired') matchesStatus = s.status === 'expired' || s.status === 'cancelled' || daysLeft <= 0;

    const matchesPlan = !planFilter || s.plan_id === Number(planFilter);

    return matchesSearch && matchesStatus && matchesPlan;
  });

  const getAvailablePlans = (currentPlanId?: number) => {
    const matched = plans.filter(p => {
      if (currentPlanId && p.id === Number(currentPlanId)) return true;
      if (activeTab === 'white_label') {
        return p.type === 'white_label' || !p.type;
      } else {
        return p.type === 'agency' || !p.type;
      }
    });

    if (matched.length === 0) {
      return plans;
    }
    return matched;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shrink-0">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Gestión de Suscripciones
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Administración del período real de acceso, vigencia y renovaciones para Marcas Blancas y Agencias.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 text-white font-extrabold text-xs hover:bg-amber-700 transition-colors shadow-md shadow-amber-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Asignar Nueva Suscripción</span>
        </button>
      </div>

      {/* Role Navigation Tabs */}
      {isSuperAdmin && (
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1">
          <button
            onClick={() => setActiveTab('white_label')}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'white_label'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Suscripciones de Marcas Blancas</span>
          </button>
          <button
            onClick={() => setActiveTab('agency')}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'agency'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Suscripciones de Agencias</span>
          </button>
        </div>
      )}

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs font-semibold block uppercase tracking-wider">Total Suscripciones</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">{totalCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs font-semibold block uppercase tracking-wider">Activas</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">{activeCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs font-semibold block uppercase tracking-wider">Próximas a Vencer</span>
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 block">{expiringSoonCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs font-semibold block uppercase tracking-wider">Vencidas / Canceladas</span>
            <span className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1 block">{expiredCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Buscar por organización o plan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-xs text-slate-800 dark:text-slate-100 w-full placeholder-slate-400 font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            <option value="">Todos los Estados</option>
            <option value="active">Activas</option>
            <option value="expiring">Próximas a vencer (&lt;= 7 días)</option>
            <option value="expired">Vencidas / Canceladas</option>
          </select>

          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value ? Number(e.target.value) : '')}
            className="px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[200px] truncate"
          >
            <option value="">Todos los Planes</option>
            {getAvailablePlans().map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={5} />
        ) : filteredSubscriptions.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <Key className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="font-bold text-sm">No se encontraron suscripciones</p>
            <p className="text-xs text-slate-400">Asigne una nueva suscripción o ajuste los filtros de búsqueda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50 text-[11px] font-extrabold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                  <th className="py-3.5 px-6">Organización</th>
                  <th className="py-3.5 px-6">Plan Vigente</th>
                  <th className="py-3.5 px-6">Inicio</th>
                  <th className="py-3.5 px-6">Vencimiento</th>
                  <th className="py-3.5 px-6">Vigencia / Días</th>
                  <th className="py-3.5 px-6">Estado</th>
                  <th className="py-3.5 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-300">
                {filteredSubscriptions.map((sub) => {
                  const entityName = sub.subscribable?.name || sub.agency?.name || 'Organización';
                  const daysLeft = getDaysRemaining(sub);
                  const isExpired = sub.status === 'expired' || sub.status === 'cancelled' || daysLeft <= 0;

                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 font-bold flex items-center justify-center text-xs shrink-0 border border-amber-500/20">
                            {activeTab === 'white_label' ? <Globe className="w-4 h-4" /> : <Building className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900 dark:text-white text-xs">{entityName}</p>
                            <span className="text-[10px] text-slate-400 font-mono">ID: #{sub.subscribable_id || sub.agency_id}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-900 dark:text-slate-100 block">{sub.plan?.name || 'Sin Plan'}</span>
                          <span className="text-[10px] text-amber-600 font-semibold uppercase block">
                            ${sub.plan?.price || 0} / {sub.plan?.duration_value || 1} {sub.plan?.duration_unit || 'mes'}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6 font-mono text-slate-600 dark:text-slate-400">
                        {sub.start_date ? new Date(sub.start_date).toLocaleDateString('es-ES') : '—'}
                      </td>

                      <td className="py-4 px-6 font-mono text-slate-800 dark:text-slate-200 font-bold">
                        {sub.end_date ? new Date(sub.end_date).toLocaleDateString('es-ES') : 'Sin fecha'}
                      </td>

                      <td className="py-4 px-6">
                        {isExpired ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1 w-max">
                            <XCircle className="w-3 h-3" /> Vencida
                          </span>
                        ) : daysLeft <= 7 ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1 w-max animate-pulse">
                            <Clock className="w-3 h-3" /> Quedan {daysLeft} días
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-max">
                            <CheckCircle2 className="w-3 h-3" /> {daysLeft} días restantes
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        {sub.status === 'active' && !isExpired ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Activa
                          </span>
                        ) : sub.status === 'cancelled' ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-slate-100 text-slate-600 border border-slate-200">
                            Cancelada
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-800 border border-rose-200">
                            Expirada
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenRenewModal(sub)}
                            title="Renovar Suscripción"
                            className="p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition-colors"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenChangePlanModal(sub)}
                            title="Cambiar de Plan"
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors"
                          >
                            <Layers className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenHistoryModal(sub)}
                            title="Historial de Renovaciones"
                            className="p-1.5 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <History className="w-4 h-4" />
                          </button>
                          {sub.status === 'active' && (
                            <button
                              onClick={() => handleCancelSubscription(sub)}
                              title="Cancelar Suscripción"
                              className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
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

      {/* Modal: Crear / Asignar Suscripción */}
      {isCreateModalOpen && (
        <Portal>
          <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-lg p-6 shadow-2xl space-y-5 text-slate-900 dark:text-white">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-black flex items-center gap-2">
                  <Key className="w-5 h-5 text-amber-500" /> Asignar Nueva Suscripción
                </h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateSubscription} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Seleccionar {activeTab === 'white_label' ? 'Marca Blanca' : 'Agencia'} *
                  </label>
                  <select
                    required
                    value={targetEntityId}
                    onChange={(e) => setTargetEntityId(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold"
                  >
                    <option value="">-- Seleccionar Organización --</option>
                    {activeTab === 'white_label'
                      ? whiteLabels.map(wl => <option key={wl.id} value={wl.id}>{wl.name}</option>)
                      : agencies.map(ag => <option key={ag.id} value={ag.id}>{ag.name}</option>)
                    }
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Plan de Suscripción *
                  </label>
                  <select
                    required
                    value={selectedPlanId}
                    onChange={(e) => setSelectedPlanId(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold"
                  >
                    <option value="">-- Seleccionar Plan --</option>
                    {getAvailablePlans().map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} (${p.price} / {p.duration_value || 1} {p.duration_unit || 'mes'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Fecha de Inicio
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Notas de Registro
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Detalles sobre el pago o convenio manual..."
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-amber-600 text-white font-extrabold text-xs shadow-md hover:bg-amber-700 flex items-center gap-1.5"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    <span>Confirmar Suscripción</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}

      {/* Modal: Renovar Suscripción */}
      {isRenewModalOpen && selectedSubscription && (
        <Portal>
          <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-lg p-6 shadow-2xl space-y-5 text-slate-900 dark:text-white">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-black flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-amber-500" /> Renovar Suscripción Manualmente
                </h3>
                <button onClick={() => setIsRenewModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  ✕
                </button>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  Organización: {selectedSubscription.subscribable?.name || selectedSubscription.agency?.name}
                </p>
                <p className="text-slate-500">
                  Vencimiento actual: <strong>{selectedSubscription.end_date ? new Date(selectedSubscription.end_date).toLocaleDateString('es-ES') : 'Expirada'}</strong>
                </p>
              </div>

              <form onSubmit={handleRenewSubscription} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Plan para la Renovación *
                  </label>
                  <select
                    required
                    value={selectedPlanId}
                    onChange={(e) => setSelectedPlanId(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold"
                  >
                    {getAvailablePlans(selectedSubscription?.plan_id).map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} (${p.price} / {p.duration_value || 1} {p.duration_unit || 'mes'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Notas / Comprobante de Renovación
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Renovación manual realizada..."
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsRenewModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-amber-600 text-white font-extrabold text-xs shadow-md hover:bg-amber-700 flex items-center gap-1.5"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                    <span>Confirmar Renovación</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}

      {/* Modal: Cambiar de Plan */}
      {isChangePlanModalOpen && selectedSubscription && (
        <Portal>
          <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-lg p-6 shadow-2xl space-y-5 text-slate-900 dark:text-white">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-black flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-500" /> Cambiar Plan de Suscripción
                </h3>
                <button onClick={() => setIsChangePlanModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  ✕
                </button>
              </div>

              <form onSubmit={handleChangePlan} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Seleccionar Nuevo Plan *
                  </label>
                  <select
                    required
                    value={selectedPlanId}
                    onChange={(e) => setSelectedPlanId(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold"
                  >
                    {getAvailablePlans(selectedSubscription?.plan_id).map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} (${p.price} / {p.duration_value || 1} {p.duration_unit || 'mes'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Motivo / Notas del Cambio
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Upgrade / Downgrade de plan..."
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsChangePlanModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-extrabold text-xs shadow-md hover:bg-indigo-700 flex items-center gap-1.5"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
                    <span>Actualizar Plan</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}

      {/* Modal: Historial de Renovaciones */}
      {isHistoryModalOpen && selectedSubscription && (
        <Portal>
          <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl p-6 shadow-2xl space-y-5 text-slate-900 dark:text-white">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-black flex items-center gap-2">
                  <History className="w-5 h-5 text-purple-500" /> Historial de Renovaciones de Suscripción
                </h3>
                <button onClick={() => setIsHistoryModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  ✕
                </button>
              </div>

              {loadingHistory ? (
                <div className="p-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-500" /> Cargando historial de renovaciones...
                </div>
              ) : historyList.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">No hay historial de renovaciones registrado.</div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-1">
                  {historyList.map((item) => (
                    <div key={item.id} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white">{item.plan?.name || 'Plan Generico'}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          item.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                        <span>Inicio: {new Date(item.start_date).toLocaleDateString('es-ES')}</span>
                        <span>Fin: {new Date(item.end_date || '').toLocaleDateString('es-ES')}</span>
                      </div>
                      {item.notes && (
                        <p className="text-[11px] text-slate-400 italic">Notas: {item.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsHistoryModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-200"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};

export default SubscriptionsPage;
