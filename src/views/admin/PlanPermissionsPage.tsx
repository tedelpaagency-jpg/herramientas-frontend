'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import adminService from '../../services/adminService';
import permissionGroupService from '../../services/permissionGroupService';
import { Plan, Permission, PlanPermission, PermissionGroup } from '../../types';
import { getPermissionLabel, getPermissionDescription } from '../../utils/permissionLabels';
import GroupPermissionsEditorView from '@/components/permissions/GroupPermissionsEditorView';
import { 
  ArrowLeft, Layers, Shield, Check, Plus, Trash2, Search, 
  CheckCircle2, AlertCircle, Building2, 
  Plane, Users, ShoppingCart, Trophy, ShieldCheck, Mail, Zap, 
  Store, GraduationCap, Palette, LayoutGrid,
  UserCheck, Lock, Globe, CheckSquare, Edit3
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
  dbGroup?: PermissionGroup | null;
}

const SYSTEM_MODULES: ModuleDefinition[] = [
  {
    id: 'inmobiliaria',
    name: 'Módulo Actividad Inmobiliaria',
    category: 'PROPIEDADES',
    description: 'Gestión y publicación de catálogo de bienes raíces, inmuebles y captaciones.',
    icon: Building2,
    permissions: [
      'view_estates',
      'manage_estates',
      'estates.view',
      'estates.create',
      'estates.edit',
      'estates.delete'
    ],
  },
  {
    id: 'turismo',
    name: 'Módulo Turismo, Visas & Viajes',
    category: 'TURISMO',
    description: 'Gestión de solicitudes de visas, reportes de viaje, comisiones, Trip Builder B2B y formularios W8.',
    icon: Plane,
    permissions: [
      'view_visas',
      'manage_visas',
      'view_travel_reports',
      'approve_travel_reports',
      'packages.view',
      'packages.create',
      'packages.update',
      'packages.delete',
      'packages.catalog',
      'packages.manage',
      'packages.pricing',
      'requests.view',
      'requests.create',
      'requests.approve',
      'requests.reject',
      'requests.manage',
      'requests.manage_status',
      'requests.view_financials',
      'requests.upload_supplier_payment',
      'view_w8_forms',
      'commissions.view',
      'visas.view',
      'visas.create',
      'visas.edit',
      'visas.delete',
      'visas.approve_delete',
      'visas.assign',
      'visas.clients.manage',
      'visas.documents.download',
      'visas.documents.observe',
      'visas.documents.view',
      'visas.forms.edit',
      'visas.forms.view',
      'visas.groups.manage',
      'visas.operators.manage',
      'visas.pdf.download',
      'visas.pdf.generate',
      'visas.processes.manage',
      'visas.request_delete',
      'visas.requests.manage',
      'visas.settings.manage',
      'visas.stages.manage',
      'visas.tasks.manage',
      'visas.timeline.internal',
      'visas.timeline.view'
    ],
  },
  {
    id: 'crm',
    name: 'Módulo CRM, Workspaces & Clientes',
    category: 'VENTAS',
    description: 'Gestión de cartera de clientes, pipelines comerciales, tareas kanban y espacios de trabajo.',
    icon: Users,
    permissions: [
      'view_clients',
      'clients.view',
      'clients.view_all',
      'clients.create',
      'clients.edit',
      'clients.delete',
      'view_crm',
      'manage_crm',
      'tasks.view',
      'leads.view',
      'leads.view_all',
      'leads.create',
      'leads.edit',
      'leads.delete',
      'leads.assign',
      'stages.view',
      'stages.create',
      'stages.edit',
      'stages.delete',
      'stages.reorder',
      'workspaces.view',
      'workspaces.create',
      'workspaces.edit',
      'workspaces.delete'
    ],
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
    permissions: ['view_spin_wheel', 'view_gamification'],
  },
  {
    id: 'lexvault',
    name: 'Módulo Contratos Legales (Lexvault)',
    category: 'LEGAL',
    description: 'Generación, firma y almacenamiento seguro de contratos comerciales y legales.',
    icon: ShieldCheck,
    permissions: ['view_lexvault', 'manage_lexvault', 'lexvault.view', 'lexvault.create', 'lexvault.edit', 'lexvault.delete'],
  },
  {
    id: 'marketing',
    name: 'Módulo Email Marketing & Campañas',
    category: 'MARKETING',
    description: 'Diseño de plantillas masivas, envío de campañas por correo y analíticas.',
    icon: Mail,
    permissions: [
      'email_marketing',
      'view_email_marketing',
      'campaigns.view',
      'campaigns.create',
      'campaigns.delete',
      'campaigns.edit',
      'marketing.view',
      'marketing.create',
      'marketing.edit',
      'marketing.delete'
    ],
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
    permissions: ['courses.view', 'courses.create', 'courses.update', 'courses.delete', 'courses.assign', 'courses.resources'],
  },
  {
    id: 'activities',
    name: 'Módulo de Actividades & Tareas',
    category: 'ACADEMIA',
    description: 'Gestión y asignación de grupos de actividades, tareas de formación, entregas y progreso de alumnos.',
    icon: CheckSquare,
    permissions: ['activities.view', 'activities.create', 'activities.update', 'activities.delete', 'activities.assign', 'activities.progress', 'activities.resources'],
  },
  {
    id: 'users',
    name: 'Módulo Gestión de Usuarios & Equipos',
    category: 'GESTIÓN',
    description: 'Permite a la agencia crear y gestionar sus miembros (administradores y asesores/closers) y equipos.',
    icon: UserCheck,
    permissions: ['manage_users', 'manage_agencies', 'roles.manage'],
  },
  {
    id: 'branding',
    name: 'Personalización de Marca (Custom Branding)',
    category: 'BRANDING',
    description: 'Permite a la agencia subir su propio logo, favicon y paleta de colores personalizada.',
    icon: Palette,
    permissions: ['custom_agency_branding'],
  },
  {
    id: 'landings',
    name: 'Módulo Landing Pages',
    category: 'MARKETING',
    description: 'Generador de páginas de aterrizaje públicas, captación de leads y eventos de conversión.',
    icon: Globe,
    permissions: ['landings.view', 'landings.create', 'landings.edit', 'landings.delete'],
  },
];

export const PlanPermissionsPage: React.FC = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const { user, refreshUser } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin' || user?.roles?.some((r: any) => r.name === 'super_admin');
  const isWhiteLabelAdmin = !isSuperAdmin && (user?.role === 'white_label_admin' || user?.roles?.some((r: any) => r.name === 'white_label_admin'));

  const userWL = (user as any)?.white_labels?.[0] || (user as any)?.whiteLabels?.[0] || (user as any)?.white_label;
  const whiteLabelPlan = userWL?.current_subscription?.plan || userWL?.currentSubscription?.plan || userWL?.plan;

  const whiteLabelPlanPermissions: string[] = (
    (whiteLabelPlan?.plan_permissions || whiteLabelPlan?.planPermissions || whiteLabelPlan?.permissions || [])
  ).map((p: any) => (typeof p === 'string' ? p : p?.permission || p?.name || '').toLowerCase().trim()).filter(Boolean);

  const isRestrictionActive = isWhiteLabelAdmin && Boolean(whiteLabelPlan) && whiteLabelPlanPermissions.length > 0;

  const isSinglePermAllowedForWhiteLabel = (permName: string): boolean => {
    if (!isRestrictionActive) return true;
    const lower = permName.toLowerCase().trim();
    if (lower.startsWith('activities.')) {
      return whiteLabelPlanPermissions.some(
        (p) => p.startsWith('activities.') || p.startsWith('courses.')
      );
    }
    if (lower.startsWith('landings.') || lower === 'landings' || lower === 'view_landings' || lower === 'manage_landings') {
      return whiteLabelPlanPermissions.some(
        (p) => p.startsWith('landings') || p === 'view_landings' || p === 'manage_landings'
      );
    }
    if (lower.startsWith('workspaces.') || lower === 'workspaces' || lower === 'view_crm' || lower === 'manage_crm') {
      return whiteLabelPlanPermissions.some(
        (p) => p.startsWith('workspaces') || p === 'view_crm' || p === 'manage_crm'
      );
    }
    if (lower.startsWith('estates.') || lower === 'estates' || lower === 'view_estates' || lower === 'manage_estates') {
      return whiteLabelPlanPermissions.some(
        (p) => p.startsWith('estates') || p === 'view_estates' || p === 'manage_estates'
      );
    }
    if (lower.startsWith('lexvault.') || lower === 'lexvault' || lower.startsWith('contracts.') || lower === 'view_lexvault' || lower === 'manage_lexvault') {
      return whiteLabelPlanPermissions.some(
        (p) => p.startsWith('lexvault') || p === 'view_lexvault' || p === 'manage_lexvault' || p.startsWith('contracts')
      );
    }
    if (lower.startsWith('campaigns.') || lower.startsWith('marketing.') || lower === 'email_marketing' || lower === 'view_email_marketing') {
      return whiteLabelPlanPermissions.some(
        (p) => p.startsWith('campaigns') || p.startsWith('marketing') || p === 'email_marketing' || p === 'view_email_marketing'
      );
    }
    if (lower.startsWith('pos.') || lower === 'view_pos' || lower === 'manage_pos') {
      return whiteLabelPlanPermissions.some(
        (p) => p.startsWith('pos') || p === 'view_pos' || p === 'manage_pos'
      );
    }
    return whiteLabelPlanPermissions.includes(lower);
  };

  const isModuleAllowedForWhiteLabel = (mod: ModuleDefinition): boolean => {
    if (!isRestrictionActive) return true;
    return mod.permissions.some(isSinglePermAllowedForWhiteLabel);
  };

  const planId = params?.id ? Number(params.id) : searchParams.get('id') ? Number(searchParams.get('id')) : null;

  const [plan, setPlan] = useState<Plan | null>(null);
  const [systemPermissions, setSystemPermissions] = useState<Permission[]>([]);
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);
  const [customModulePermissions, setCustomModulePermissions] = useState<Record<string, string[]>>({});
  
  // Full screen group permissions editing state
  const [editingGroupMod, setEditingGroupMod] = useState<ModuleDefinition | null>(null);

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
      const [plansData, permsData, groupsData] = await Promise.all([
        adminService.getPlans(),
        adminService.getPermissions(),
        permissionGroupService.getGroups().catch(() => []),
      ]);

      const foundPlan = plansData.find((p: Plan) => p.id === id);
      if (foundPlan) {
        setPlan(foundPlan);
      }
      setSystemPermissions(permsData || []);
      setPermissionGroups(groupsData || []);
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

  // Combine system modules with database permission groups and dynamically added permissions
  const mergedModules = useMemo(() => {
    const list: ModuleDefinition[] = SYSTEM_MODULES.map((mod) => {
      const dbGroup = permissionGroups.find(
        (g) => g.slug?.toLowerCase() === mod.id.toLowerCase() || g.name?.toLowerCase().includes(mod.id.toLowerCase())
      );
      const dbPerms = (dbGroup?.permissions || []).map((p: any) => typeof p === 'string' ? p : p.name);
      const customPerms = customModulePermissions[mod.id] || [];
      const combined = Array.from(new Set([
        ...(dbGroup && dbPerms.length > 0 ? dbPerms : mod.permissions),
        ...customPerms,
      ]));

      return {
        ...mod,
        permissions: combined.length > 0 ? combined : mod.permissions,
        dbGroup: dbGroup || null,
      };
    });

    // Append custom permission groups created by users that don't match standard slugs
    permissionGroups.forEach((grp) => {
      const exists = list.some((m) => m.id.toLowerCase() === (grp.slug || '').toLowerCase());
      if (!exists && !grp.is_system) {
        const perms = (grp.permissions || []).map((p: any) => typeof p === 'string' ? p : p.name);
        const customPerms = customModulePermissions[grp.slug || `custom_${grp.id}`] || [];
        list.push({
          id: grp.slug || `custom_${grp.id}`,
          name: grp.name,
          category: grp.category || 'GRUPO PERSONALIZADO',
          description: grp.description || 'Grupo de permisos personalizado para suscripciones.',
          icon: ShieldCheck,
          permissions: Array.from(new Set([...perms, ...customPerms])),
          dbGroup: grp,
        });
      }
    });

    return list;
  }, [permissionGroups, customModulePermissions]);

  // Toggle a single permission for this plan
  const handleTogglePermissionForPlan = async (permKey: string) => {
    if (!planId || !plan) return;
    const lowerKey = permKey.toLowerCase();
    const activeKeys = getActivePermissionKeys();
    const isAssigned = activeKeys.includes(lowerKey);

    if (!isAssigned && isRestrictionActive && !isSinglePermAllowedForWhiteLabel(lowerKey)) {
      toast.error(`El permiso "${permKey}" no está contratado en el plan de su Marca Blanca.`);
      return;
    }

    // Optimistic UI state update
    const previousPermissions = [...(plan.plan_permissions || [])];
    if (isAssigned) {
      const updated = previousPermissions.filter(
        (p) => p.permission.toLowerCase() !== lowerKey
      );
      setPlan({ ...plan, plan_permissions: updated });
    } else {
      const newEntry: PlanPermission = {
        id: Date.now(),
        plan_id: planId,
        permission: lowerKey,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setPlan({ ...plan, plan_permissions: [...previousPermissions, newEntry] });
    }

    try {
      if (isAssigned) {
        const pRecord = previousPermissions.find((p) => p.permission.toLowerCase() === lowerKey);
        if (pRecord && pRecord.id) {
          await adminService.deletePlanPermission(planId, pRecord.id);
        }
        toast.success(`Permiso "${getPermissionLabel(permKey)}" removido`);
      } else {
        await adminService.addPlanPermission(planId, lowerKey);
        toast.success(`Permiso "${getPermissionLabel(permKey)}" asignado`);
      }

      // Background reload to sync exact server IDs
      const freshPerms = await adminService.getPlanPermissions(planId);
      setPlan((prev) => prev ? { ...prev, plan_permissions: freshPerms } : null);
      if (refreshUser) {
        try { await refreshUser(); } catch (e) {}
      }
    } catch (err: any) {
      setPlan({ ...plan, plan_permissions: previousPermissions });
      toast.error(err?.response?.data?.message || 'Error al actualizar permiso');
    }
  };

  // Toggle all permissions within a module/group
  const handleToggleAllInModule = async (mod: ModuleDefinition, enable: boolean) => {
    if (!planId || !plan) return;
    const activeKeys = getActivePermissionKeys();

    if (enable) {
      const permsToAdd = mod.permissions.filter(
        (p) => !activeKeys.includes(p.toLowerCase()) && isSinglePermAllowedForWhiteLabel(p)
      );

      if (permsToAdd.length === 0) {
        toast('Todos los permisos permitidos ya están activos en este grupo', { icon: 'ℹ️' });
        return;
      }

      setSaving(true);
      try {
        const nextPerms = Array.from(new Set([...activeKeys, ...permsToAdd.map((p) => p.toLowerCase())]));
        const updatedPermissions = await adminService.syncPlanPermissions(planId, nextPerms);
        setPlan({ ...plan, plan_permissions: updatedPermissions });
        toast.success(`Módulo "${mod.name}" habilitado (${permsToAdd.length} permisos)`);
        if (refreshUser) {
          try { await refreshUser(); } catch (e) {}
        }
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Error al habilitar permisos del módulo');
      } finally {
        setSaving(false);
      }
    } else {
      const permsToRemove = (plan.plan_permissions || []).filter((p) =>
        mod.permissions.some((mp) => mp.toLowerCase() === p.permission.toLowerCase())
      );

      if (permsToRemove.length === 0) {
        toast('No hay permisos activos en este grupo para desactivar', { icon: 'ℹ️' });
        return;
      }

      setSaving(true);
      try {
        const removeSet = new Set(permsToRemove.map((p) => p.permission.toLowerCase()));
        const nextPerms = activeKeys.filter((k) => !removeSet.has(k));
        const updatedPermissions = await adminService.syncPlanPermissions(planId, nextPerms);
        setPlan({ ...plan, plan_permissions: updatedPermissions });
        toast.success(`Módulo "${mod.name}" deshabilitado`);
        if (refreshUser) {
          try { await refreshUser(); } catch (e) {}
        }
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Error al deshabilitar permisos del módulo');
      } finally {
        setSaving(false);
      }
    }
  };

  // Save updated permissions of a group from the full view editor
  const handleSaveGroupPermissions = async (data: {
    name: string;
    category?: string;
    description?: string;
    is_active: boolean;
    permissions: string[];
  }) => {
    if (!editingGroupMod) return;

    try {
      let savedGroup: PermissionGroup;

      if (editingGroupMod.dbGroup && editingGroupMod.dbGroup.id) {
        savedGroup = await permissionGroupService.updateGroup(editingGroupMod.dbGroup.id, {
          name: data.name,
          category: data.category,
          description: data.description,
          is_active: data.is_active,
          permissions: data.permissions,
        });
      } else {
        savedGroup = await permissionGroupService.createGroup({
          name: data.name,
          category: data.category || editingGroupMod.category,
          description: data.description || editingGroupMod.description,
          is_active: data.is_active,
          permissions: data.permissions,
        });
      }

      // Update local permissions map
      setCustomModulePermissions((prev) => ({
        ...prev,
        [editingGroupMod.id]: data.permissions,
      }));

      // Update groups list
      setPermissionGroups((prev) => {
        const idx = prev.findIndex((g) => g.id === savedGroup.id || g.slug === editingGroupMod?.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = savedGroup;
          return next;
        }
        return [...prev, savedGroup];
      });

      toast.success(`Grupo "${data.name}" guardado exitosamente con ${data.permissions.length} permisos`);
      setEditingGroupMod(null);

      // Refresh groups list in background
      permissionGroupService.getGroups().then((fresh) => {
        if (fresh) setPermissionGroups(fresh);
      }).catch(() => {});
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al guardar permisos del grupo');
      throw err;
    }
  };

  // Add custom permission directly to plan
  const handleAddCustomPermission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planId || !plan || !newPermission.trim()) return;
    setSaving(true);
    try {
      await adminService.addPlanPermission(planId, newPermission.trim().toLowerCase());
      toast.success(`Permiso personalizado "${newPermission.trim()}" agregado`);
      setNewPermission('');
      const updatedPermissions = await adminService.getPlanPermissions(planId);
      setPlan({
        ...plan,
        plan_permissions: updatedPermissions,
      });
      if (refreshUser) {
        try { await refreshUser(); } catch (e) {}
      }
    } catch (err: any) {
      toast.error('Error al agregar permiso personalizado al plan');
    } finally {
      setSaving(false);
    }
  };

  const activeKeys = getActivePermissionKeys();

  // Filter modules based on search query
  const filteredModules = mergedModules.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const nameMatch = m.name.toLowerCase().includes(q);
    const descMatch = m.description.toLowerCase().includes(q);
    const catMatch = m.category.toLowerCase().includes(q);
    const permMatch = m.permissions.some(
      (p) => p.toLowerCase().includes(q) || getPermissionLabel(p).toLowerCase().includes(q)
    );
    return nameMatch || descMatch || catMatch || permMatch;
  });

  const activeModulesCount = mergedModules.filter((m) => {
    const totalCount = m.permissions.length;
    const activeCount = m.permissions.filter((p) => activeKeys.includes(p.toLowerCase())).length;
    return totalCount > 0 && activeCount === totalCount;
  }).length;

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
        <Link href="/admin/plans" className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white font-bold text-xs rounded-xl shadow-md">
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Planes</span>
        </Link>
      </div>
    );
  }

  // ================= RENDER FULL VIEW EDITOR WHEN EDITING A GROUP =================
  if (editingGroupMod) {
    return (
      <GroupPermissionsEditorView
        group={{
          id: editingGroupMod.dbGroup?.id,
          name: editingGroupMod.name,
          slug: editingGroupMod.id,
          category: editingGroupMod.category,
          description: editingGroupMod.description,
          is_active: editingGroupMod.dbGroup?.is_active ?? true,
          is_system: editingGroupMod.dbGroup?.is_system ?? true,
          permissions: editingGroupMod.permissions,
        }}
        availablePermissions={systemPermissions}
        restrictedPermissions={whiteLabelPlanPermissions}
        isRestrictionActive={isRestrictionActive}
        title={`Configuración de Permisos: ${editingGroupMod.name}`}
        badgeText={editingGroupMod.category}
        backLabel="Volver a Módulos del Plan"
        icon={editingGroupMod.icon}
        onCancel={() => setEditingGroupMod(null)}
        onSave={handleSaveGroupPermissions}
      />
    );
  }

  // ================= MAIN VIEW: MODULES & GROUPS GRID =================
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 w-full animate-in fade-in duration-150">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/plans"
            className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 dark:hover:text-white transition-all shadow-xs shrink-0 cursor-pointer"
            title="Volver a Planes"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">
              <span>Gestión de Planes</span>
              <span>/</span>
              <span className="text-amber-500">Configuración de Módulos</span>
            </div>
            <h1 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex flex-wrap items-center gap-2">
              <span>Módulos del Plan: {plan?.name}</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                {activeModulesCount} de {mergedModules.length} módulos habilitados
              </span>
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            href="/admin/plans?tab=permission_groups"
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all shadow-xs inline-flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>Grupos de Permisos</span>
          </Link>

          <Link
            href="/admin/plans"
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs transition-all shadow-md shadow-amber-500/20 inline-flex items-center gap-1.5"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Listo / Guardar</span>
          </Link>
        </div>
      </div>

      {/* Plan Details Banner Card */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-xl shadow-md shadow-amber-500/20 shrink-0">
            <Layers className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <span>{plan?.name}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30">
                ${plan?.price} / MES
              </span>
            </h2>
            <p className="text-xs text-slate-300 font-medium mt-1">
              {plan?.description || 'Gestiona los módulos y permisos contratados para este plan de suscripción.'}
            </p>
          </div>
        </div>

        {/* Custom Permission Quick Add Form */}
        <form onSubmit={handleAddCustomPermission} className="w-full md:w-auto flex items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/10">
          <input
            type="text"
            required
            placeholder="Añadir clave personalizada (ej. view_...)"
            value={newPermission}
            onChange={(e) => setNewPermission(e.target.value)}
            className="px-3.5 py-2 bg-slate-900/60 border border-white/10 rounded-xl text-xs font-mono text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-amber-500/40 w-full md:w-60"
          />
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-all shadow-xs shrink-0 inline-flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agregar</span>
          </button>
        </form>
      </div>

      {/* White Label Plan Restrictive Notice */}
      {isRestrictionActive && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-4 rounded-2xl flex items-center gap-3 text-xs text-amber-950 dark:text-amber-200 font-medium shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-amber-500/20">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="font-extrabold text-amber-950 dark:text-amber-100">
              Plan Matriz de tu Marca Blanca: {whiteLabelPlan?.name || 'Plan Activo'} ({whiteLabelPlanPermissions.length} permisos habilitados)
            </div>
            <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5">
              Solo puedes habilitar en los planes de tus agencias los módulos contratados por tu Marca Blanca. Los módulos no contratados aparecen bloqueados.
            </p>
          </div>
        </div>
      )}

      {/* Control Bar: Search & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar módulo del sistema..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setViewMode('modules')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'modules'
                ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Vista Módulos Principales</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('advanced')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'advanced'
                ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Modo Avanzado (Permisos Clave)</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: MODULES CARDS GRID (Exact match of previous design + Edit icon) */}
      {viewMode === 'modules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {filteredModules.map((mod) => {
            const IconComp = mod.icon;
            const totalCount = mod.permissions.length;
            const activeCount = mod.permissions.filter((p) => activeKeys.includes(p.toLowerCase())).length;
            const isFull = totalCount > 0 && activeCount === totalCount;
            const isPartial = activeCount > 0 && activeCount < totalCount;
            const isAllowed = isModuleAllowedForWhiteLabel(mod);

            return (
              <div
                key={mod.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 flex flex-col justify-between shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all group"
              >
                <div>
                  {/* Card Header with Icon, Category, Title and Edit Icon Button */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-wider block truncate">
                          {mod.category}
                        </span>
                        <h3 className="font-black text-sm text-slate-900 dark:text-slate-100 leading-snug truncate">
                          {mod.name}
                        </h3>
                      </div>
                    </div>

                    {/* Edit Icon Button: takes user to full view to configure group's permissions */}
                    <button
                      type="button"
                      onClick={() => setEditingGroupMod(mod)}
                      className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-amber-500 hover:text-white dark:bg-slate-800 dark:hover:bg-amber-500 dark:hover:text-white text-slate-400 flex items-center justify-center transition-all cursor-pointer shadow-2xs shrink-0"
                      title="Editar permisos asignados a este grupo (vista completa)"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Module Description */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed my-3 line-clamp-2 min-h-[32px]">
                    {mod.description}
                  </p>

                  {/* List of Permission Pills */}
                  <div className="flex flex-wrap gap-1.5 min-h-[50px] mb-4 content-start">
                    {mod.permissions.slice(0, 10).map((pKey) => (
                      <span
                        key={pKey}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 font-mono text-[11px] font-semibold"
                      >
                        {pKey}
                      </span>
                    ))}
                    {mod.permissions.length > 10 && (
                      <span className="px-2 py-1 rounded-lg bg-slate-100/60 dark:bg-slate-800/50 text-slate-500 text-[10px] font-bold">
                        +{mod.permissions.length - 10} más
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Full-Width Enable / Disable Button */}
                <div className="pt-2">
                  {isFull ? (
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => handleToggleAllInModule(mod, false)}
                      className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-black text-xs transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Módulo Habilitado</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={saving || !isAllowed}
                      onClick={() => handleToggleAllInModule(mod, true)}
                      className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                        !isAllowed
                          ? 'bg-slate-100 dark:bg-slate-800/40 text-slate-400 border border-slate-200/50 dark:border-slate-800 cursor-not-allowed opacity-60'
                          : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 cursor-pointer active:scale-95'
                      }`}
                    >
                      {!isAllowed ? (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>No Incluido en Plan Matriz</span>
                        </>
                      ) : (
                        <>
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-400 dark:border-slate-500" />
                          <span>{isPartial ? `Habilitar Módulo (${activeCount}/${totalCount})` : 'Habilitar Módulo'}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE 2: ADVANCED GLOBAL SYSTEM PERMISSIONS EXPLORER */}
      {viewMode === 'advanced' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Explorador global de todos los permisos registrados ({systemPermissions.length} en el sistema)
            </span>
            <span className="text-slate-500">
              {activeKeys.length} permisos habilitados en este plan
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemPermissions
              .filter((sysPerm) => {
                if (!searchQuery.trim()) return true;
                const q = searchQuery.toLowerCase();
                return (
                  sysPerm.name.toLowerCase().includes(q) ||
                  getPermissionLabel(sysPerm.name).toLowerCase().includes(q) ||
                  getPermissionDescription(sysPerm.name).toLowerCase().includes(q)
                );
              })
              .map((sysPerm) => {
                const isActive = activeKeys.includes(sysPerm.name.toLowerCase());
                const isAllowed = isSinglePermAllowedForWhiteLabel(sysPerm.name);

                return (
                  <div
                    key={sysPerm.id}
                    onClick={() => {
                      if (!isAllowed) {
                        toast.error(`El permiso "${sysPerm.name}" no está contratado en el plan de su Marca Blanca.`);
                        return;
                      }
                      handleTogglePermissionForPlan(sysPerm.name);
                    }}
                    className={`p-4 rounded-2xl border flex items-start justify-between gap-3 transition-all select-none ${
                      !isAllowed
                        ? 'bg-slate-50/70 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed'
                        : isActive
                          ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-300 dark:border-amber-600/50 text-amber-950 dark:text-amber-200 shadow-xs cursor-pointer'
                          : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isActive}
                        disabled={!isAllowed}
                        readOnly
                        className="w-4 h-4 mt-0.5 rounded text-amber-600 focus:ring-amber-500 pointer-events-none accent-amber-600 shrink-0"
                      />
                      <div className="space-y-1">
                        <h4 className="font-black text-xs text-slate-900 dark:text-slate-100 leading-snug">
                          {getPermissionLabel(sysPerm.name)}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                          {getPermissionDescription(sysPerm.name)}
                        </p>
                        <div className="inline-block px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md font-mono text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                          {sysPerm.name}
                        </div>
                      </div>
                    </div>

                    {isActive ? (
                      <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded-full shrink-0 border border-amber-200 dark:border-amber-700">
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
        </div>
      )}
    </div>
  );
};

export default PlanPermissionsPage;
