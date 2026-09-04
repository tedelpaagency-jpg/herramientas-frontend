'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import adminService from '../../services/adminService';
import { Plan, Permission, PlanPermission } from '../../types';
import { getPermissionLabel, getPermissionDescription } from '../../utils/permissionLabels';
import { 
  ArrowLeft, Layers, Shield, Check, Plus, Trash2, Search, 
  RefreshCw, CheckCircle2, AlertCircle, Sparkles, Building2, 
  Plane, Users, ShoppingCart, Trophy, ShieldCheck, Mail, Zap, 
  Store, GraduationCap, Palette, LayoutGrid, ToggleLeft, ToggleRight,
  UserCheck, Lock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { TableSkeleton } from '@/components/Skeleton';
import { useAuth } from '../../context/AuthContext';

interface ModuleDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: React.ElementType;
  permissions: string[];
}

const SYSTEM_MODULES: ModuleDefinition[] = [
  {
    id: 'inmobiliaria',
    name: 'Módulo Actividad Inmobiliaria',
    category: 'PROPIEDADES',
    description: 'Gestión y publicación de catálogo de bienes raíces, inmuebles y captaciones.',
    icon: Building2,
    permissions: ['view_estates', 'manage_estates'],
  },
  {
    id: 'turismo',
    name: 'Módulo Turismo, Visas & Viajes',
    category: 'TURISMO',
    description: 'Gestión de solicitudes de visas, reportes de viaje, comisiones, Trip Builder B2B y formularios W8.',
    icon: Plane,
    permissions: ['view_visas', 'manage_visas', 'view_travel_reports', 'packages.view', 'requests.view', 'view_w8_forms', 'commissions.view'],
  },
  {
    id: 'crm',
    name: 'Módulo CRM, Workspaces & Clientes',
    category: 'VENTAS',
    description: 'Gestión de cartera de clientes, pipelines comerciales, tareas kanban y espacios de trabajo.',
    icon: Users,
    permissions: ['view_clients', 'view_crm', 'manage_crm', 'tasks.view'],
  },
  {
    id: 'pos',
    name: 'Módulo Punto de Venta (POS) & Productos',
    category: 'COMERCIO',
    description: 'Punto de venta interactivo (POS) para emisión rápida y catálogo general de productos.',
    icon: ShoppingCart,
    permissions: ['view_pos', 'manage_pos', 'view_products'],
  },
  {
    id: 'gamification',
    name: 'Módulo Ruleta & Premios (Gamificación)',
    category: 'MARKETING',
    description: 'Ruleta promocional interactiva para captación de leads y entrega de premios.',
    icon: Trophy,
    permissions: ['view_spin_wheel'],
  },
  {
    id: 'lexvault',
    name: 'Módulo Contratos Legales (Lexvault)',
    category: 'LEGAL',
    description: 'Generación, firma y almacenamiento seguro de contratos comerciales y legales.',
    icon: ShieldCheck,
    permissions: ['view_lexvault'],
  },
  {
    id: 'marketing',
    name: 'Módulo Email Marketing & Campañas',
    category: 'MARKETING',
    description: 'Diseño de plantillas masivas, envío de campañas por correo y analíticas.',
    icon: Mail,
    permissions: ['email_marketing', 'view_email_marketing'],
  },
  {
    id: 'automations',
    name: 'Módulo Automatizaciones de Pipeline',
    category: 'WORKFLOW',
    description: 'Triggers, respuestas automáticas y reglas encadenadas en el flujo de clientes.',
    icon: Zap,
    permissions: ['automations', 'view_automations'],
  },
  {
    id: 'hunter',
    name: 'Módulo Tiendas Hunter',
    category: 'COMERCIO',
    description: 'Plataforma para administración de tiendas físicas y sucursales Hunter.',
    icon: Store,
    permissions: ['view_hunter'],
  },
  {
    id: 'courses',
    name: 'Módulo Capacitación & Cursos',
    category: 'ACADEMIA',
    description: 'Acceso a la academia de formación, entrenamientos y evaluaciones de personal.',
    icon: GraduationCap,
    permissions: ['courses.view', 'courses.create'],
  },
  {
    id: 'users',
    name: 'Módulo Gestión de Usuarios & Equipos',
    category: 'GESTIÓN',
    description: 'Permite a la agencia crear y gestionar sus miembros (administradores y asesores/closers) y equipos.',
    icon: UserCheck,
    permissions: ['manage_users'],
  },
  {
    id: 'branding',
    name: 'Personalización de Marca (Custom Branding)',
    category: 'BRANDING',
    description: 'Permite a la agencia subir su propio logo, favicon y paleta de colores personalizada.',
    icon: Palette,
    permissions: ['custom_agency_branding'],
  },
];

export const PlanPermissionsPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { user, refreshUser } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin' || user?.roles?.some((r: any) => r.name === 'super_admin');
  const isWhiteLabelAdmin = !isSuperAdmin && (user?.role === 'white_label_admin' || user?.roles?.some((r: any) => r.name === 'white_label_admin'));

  const userWL = (user as any)?.white_labels?.[0] || (user as any)?.whiteLabels?.[0] || (user as any)?.white_label;
  const whiteLabelPlan = userWL?.plan;
  const hasWhiteLabelPlan = Boolean(whiteLabelPlan || userWL?.plan_id);

  const whiteLabelPlanPermissions: string[] = (
    (whiteLabelPlan?.plan_permissions || whiteLabelPlan?.planPermissions || whiteLabelPlan?.permissions || [])
  ).map((p: any) => (typeof p === 'string' ? p : p?.permission || p?.name || '').toLowerCase().trim()).filter(Boolean);

  const isModuleAllowedForWhiteLabel = (mod: ModuleDefinition): boolean => {
    if (!isWhiteLabelAdmin || !hasWhiteLabelPlan) return true;
    return mod.permissions.some((p) => whiteLabelPlanPermissions.includes(p.toLowerCase()));
  };

  const isSinglePermAllowedForWhiteLabel = (permName: string): boolean => {
    if (!isWhiteLabelAdmin || !hasWhiteLabelPlan) return true;
    return whiteLabelPlanPermissions.includes(permName.toLowerCase());
  };

  const planId = params?.id ? Number(params.id) : searchParams.get('id') ? Number(searchParams.get('id')) : null;

  const [plan, setPlan] = useState<Plan | null>(null);
  const [systemPermissions, setSystemPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [newPermission, setNewPermission] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'modules' | 'advanced'>('modules');

  useEffect(() => {
    if (planId) {
      loadData(planId);
    } else {
      setLoading(false);
    }
  }, [planId]);

  const loadData = async (id: number) => {
    setLoading(true);
    try {
      const [plansData, permsData] = await Promise.all([
        adminService.getPlans(),
        adminService.getPermissions(),
      ]);

      const foundPlan = plansData.find((p: Plan) => p.id === id);
      if (foundPlan) {
        setPlan(foundPlan);
      }
      setSystemPermissions(permsData || []);
    } catch (err) {
      toast.error('Error al cargar la información del plan');
    } finally {
      setLoading(false);
    }
  };

  const getActivePermissionKeys = (): string[] => {
    if (!plan?.plan_permissions) return [];
    return plan.plan_permissions.map((p) => p.permission.toLowerCase());
  };

  const isModuleActive = (mod: ModuleDefinition): boolean => {
    const activeKeys = getActivePermissionKeys();
    return mod.permissions.some((p) => activeKeys.includes(p.toLowerCase()));
  };

  const handleToggleModule = async (mod: ModuleDefinition) => {
    if (!planId || !plan) return;

    if (isWhiteLabelAdmin && hasWhiteLabelPlan && !isModuleAllowedForWhiteLabel(mod)) {
      toast.error(`Este módulo no está contratado en el plan de su Marca Blanca ("${whiteLabelPlan?.name || 'Plan Matriz'}").`);
      return;
    }

    setSaving(true);
    const activeKeys = getActivePermissionKeys();
    const isActive = isModuleActive(mod);

    try {
      if (isActive) {
        // Deshabilitar módulo: eliminar todos los permisos del módulo asociados al plan
        const permissionsToDelete = (plan.plan_permissions || []).filter((p) =>
          mod.permissions.some((mp) => mp.toLowerCase() === p.permission.toLowerCase())
        );

        for (const pToDelete of permissionsToDelete) {
          await adminService.deletePlanPermission(planId, pToDelete.id);
        }
        toast.success(`Módulo "${mod.name}" deshabilitado para el plan`);
      } else {
        // Habilitar módulo: agregar permisos del módulo al plan
        for (const permKey of mod.permissions) {
          if (!activeKeys.includes(permKey.toLowerCase())) {
            await adminService.addPlanPermission(planId, permKey);
          }
        }
        toast.success(`Módulo "${mod.name}" habilitado para el plan`);
      }

      const updatedPermissions = await adminService.getPlanPermissions(planId);
      setPlan({
        ...plan,
        plan_permissions: updatedPermissions,
      });
      if (refreshUser) {
        try { await refreshUser(); } catch (e) {}
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al actualizar estado del módulo');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleSinglePermission = async (sysPerm: Permission, assigned?: PlanPermission) => {
    if (!planId || !plan) return;

    if (!assigned && isWhiteLabelAdmin && hasWhiteLabelPlan && !isSinglePermAllowedForWhiteLabel(sysPerm.name)) {
      toast.error(`El permiso "${sysPerm.name}" no está contratado en el plan de su Marca Blanca.`);
      return;
    }

    setSaving(true);
    try {
      if (assigned) {
        await adminService.deletePlanPermission(planId, assigned.id);
        toast.success(`Permiso "${getPermissionLabel(sysPerm.name)}" removido`);
      } else {
        await adminService.addPlanPermission(planId, sysPerm.name);
        toast.success(`Permiso "${getPermissionLabel(sysPerm.name)}" asignado`);
      }
      const updatedPermissions = await adminService.getPlanPermissions(planId);
      setPlan({
        ...plan,
        plan_permissions: updatedPermissions,
      });
    } catch (err: any) {
      toast.error('Error al actualizar permiso');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCustomPermission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planId || !plan || !newPermission.trim()) return;
    setSaving(true);
    try {
      await adminService.addPlanPermission(planId, newPermission.trim());
      toast.success(`Permiso personalizado "${newPermission.trim()}" agregado`);
      setNewPermission('');
      const updatedPermissions = await adminService.getPlanPermissions(planId);
      setPlan({
        ...plan,
        plan_permissions: updatedPermissions,
      });
    } catch (err: any) {
      toast.error('Error al agregar permiso personalizado al plan');
    } finally {
      setSaving(false);
    }
  };

  const filteredModules = SYSTEM_MODULES.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q) || m.category.toLowerCase().includes(q);
  });

  const activeModulesCount = SYSTEM_MODULES.filter((m) => isModuleActive(m)).length;

  if (loading) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-200 animate-pulse" />
          <div className="space-y-2">
            <div className="h-5 w-48 bg-slate-200 rounded-lg animate-pulse" />
            <div className="h-3 w-32 bg-slate-200 rounded-lg animate-pulse" />
          </div>
        </div>
        <TableSkeleton rows={6} />
      </div>
    );
  }

  if (!planId || (!plan && !loading)) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4 max-w-lg mx-auto my-12">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-lg font-extrabold text-slate-900">Plan no encontrado</h2>
        <p className="text-xs text-slate-500">No se pudo obtener el identificador de plan válido.</p>
        <Link href="/admin/plans" className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md">
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Planes</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto pb-12">
      {/* Navigation Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/plans"
            className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-amber-600 hover:text-white transition-all shadow-xs shrink-0"
            title="Volver a Planes"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">
              <span>Gestión de Planes</span>
              <span>/</span>
              <span className="text-amber-600">Configuración de Módulos</span>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Módulos del Plan: {plan?.name}</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
                {activeModulesCount} de {SYSTEM_MODULES.length} módulos habilitados
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/admin/plans"
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs transition-all shadow-md shadow-amber-600/20 inline-flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Listo / Guardar</span>
          </Link>
        </div>
      </div>

      {/* Plan Details Banner Card */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black text-xl shadow-inner shrink-0">
            <Layers className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <span>{plan?.name}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30">
                ${plan?.price} / mes
              </span>
            </h2>
            <p className="text-xs text-slate-300 font-medium mt-1">
              {plan?.description || 'Sin descripción'}
            </p>
          </div>
        </div>

        {/* Custom Permission Quick Add Form */}
        <form onSubmit={handleAddCustomPermission} className="w-full md:w-auto flex items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/10">
          <input
            type="text"
            required
            placeholder="Añadir clave personalizada (ej. view_custom)..."
            value={newPermission}
            onChange={(e) => setNewPermission(e.target.value)}
            className="px-3.5 py-2 bg-slate-900/60 border border-white/10 rounded-xl text-xs font-mono text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-amber-500/40 w-full md:w-60"
          />
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl transition-all shadow-xs shrink-0 inline-flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agregar</span>
          </button>
        </form>
      </div>

      {/* White Label Plan Restrictive Notice */}
      {isWhiteLabelAdmin && hasWhiteLabelPlan && (
        <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl flex items-center gap-3 text-xs text-indigo-900 font-medium shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-indigo-600/20">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="font-extrabold text-indigo-950">
              Plan Matriz de tu Marca Blanca: {whiteLabelPlan?.name || 'Plan Activo'} ({whiteLabelPlanPermissions.length} permisos habilitados)
            </div>
            <p className="text-[11px] text-indigo-700/90 mt-0.5">
              Solo puedes habilitar en los planes de tus agencias los módulos y permisos contratados por tu Marca Blanca. Los módulos no contratados aparecen bloqueados.
            </p>
          </div>
        </div>
      )}

      {/* Control Bar: Search & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar módulo del sistema..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setViewMode('modules')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'modules'
                ? 'bg-white text-amber-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Vista Módulos Principales</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('advanced')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'advanced'
                ? 'bg-white text-amber-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Modo Avanzado (Permisos Clave)</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: MODULES SELECTION (Main High-Level Mode) */}
      {viewMode === 'modules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((mod) => {
            const active = isModuleActive(mod);
            const isAllowed = isModuleAllowedForWhiteLabel(mod);
            const IconComp = mod.icon;

            return (
              <div
                key={mod.id}
                className={`bg-white rounded-3xl border shadow-xs p-6 flex flex-col justify-between space-y-4 transition-all ${
                  !isAllowed
                    ? 'border-slate-200/60 bg-slate-50/50 opacity-75'
                    : active
                      ? 'border-amber-300 ring-2 ring-amber-500/10 bg-amber-50/20'
                      : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-2xl ${
                        !isAllowed
                          ? 'bg-slate-200/70 text-slate-400'
                          : active
                            ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                            : 'bg-slate-100 text-slate-500'
                      }`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider">
                          {mod.category}
                        </span>
                        <h3 className="font-black text-sm text-slate-900 leading-snug">{mod.name}</h3>
                      </div>
                    </div>
                    {!isAllowed && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-rose-50 text-rose-600 border border-rose-200 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> No incluido
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">
                    {mod.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {mod.permissions.map((pKey) => (
                      <span key={pKey} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-mono font-semibold">
                        {pKey}
                      </span>
                    ))}
                  </div>
                </div>

                {!isAllowed ? (
                  <div className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-100 text-slate-400 flex items-center justify-center gap-2 cursor-not-allowed border border-slate-200/60">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Bloqueado por tu Plan Matriz</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => handleToggleModule(mod)}
                    className={`w-full py-2.5 px-4 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-xs ${
                      active
                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {active ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Módulo Habilitado</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 text-slate-400" />
                        <span>Habilitar Módulo</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE 2: ADVANCED SYSTEM PERMISSIONS */}
      {viewMode === 'advanced' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {systemPermissions.map((sysPerm) => {
            const assigned = plan?.plan_permissions?.find(
              (p) => p.permission.toLowerCase() === sysPerm.name.toLowerCase()
            );
            const isAllowed = isSinglePermAllowedForWhiteLabel(sysPerm.name);

            return (
              <div
                key={sysPerm.id}
                onClick={() => {
                  if (!isAllowed && !assigned) {
                    toast.error(`El permiso "${sysPerm.name}" no está contratado en el plan de su Marca Blanca.`);
                    return;
                  }
                  handleToggleSinglePermission(sysPerm, assigned);
                }}
                className={`p-4 rounded-2xl border flex items-start justify-between gap-3 transition-all select-none ${
                  !isAllowed && !assigned
                    ? 'bg-slate-50/70 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed'
                    : assigned
                      ? 'bg-amber-50/80 border-amber-300 text-amber-950 shadow-xs cursor-pointer'
                      : 'bg-white border-slate-200/80 text-slate-700 hover:border-slate-300 hover:bg-slate-50/50 cursor-pointer'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={!!assigned}
                    disabled={!isAllowed && !assigned}
                    readOnly
                    className="w-4 h-4 mt-0.5 rounded text-amber-600 focus:ring-amber-500 pointer-events-none"
                  />
                  <div className="space-y-1">
                    <h4 className="font-black text-xs text-slate-900 leading-snug">
                      {getPermissionLabel(sysPerm.name)}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                      {getPermissionDescription(sysPerm.name)}
                    </p>
                    <div className="inline-block px-2 py-0.5 bg-slate-100 rounded-md font-mono text-[10px] text-slate-500 font-bold">
                      {sysPerm.name}
                    </div>
                  </div>
                </div>

                {assigned ? (
                  <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full shrink-0 border border-amber-200">
                    Activo
                  </span>
                ) : !isAllowed ? (
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full shrink-0 border border-rose-200 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> Bloqueado
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PlanPermissionsPage;
