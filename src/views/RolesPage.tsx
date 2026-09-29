'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import roleService, { CreateRolePayload, UpdateRolePayload } from '@/services/roleService';
import { Role, Permission } from '@/types';
import { 
  ShieldCheck, Shield, Key, Users, Search, Plus, Edit3, Trash2, 
  CheckCircle2, XCircle, AlertCircle, Sparkles, Building2, Globe, 
  Layers, Lock, Check, X, RefreshCw, Eye, Info, ChevronRight, UserCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { TableSkeleton } from '@/components/Skeleton';
import { 
  getPermissionLabel, 
  getPermissionDescription, 
  getPermissionModule 
} from '@/utils/permissionLabels';

export const RolesPage: React.FC = () => {
  const { user, currentWhiteLabel, currentAgency, hasPermission, refreshUser } = useAuth();

  const isSuperAdmin =
    user?.role === 'super_admin' ||
    user?.roles?.some((r) => r.name === 'super_admin');

  const isWhiteLabelAdmin =
    user?.role === 'white_label_admin' ||
    user?.roles?.some((r) => r.name === 'white_label_admin');

  const isAgencyAdmin =
    user?.role === 'admin' ||
    user?.role === 'gerente' ||
    user?.role === 'gerente_comercial' ||
    user?.roles?.some((r) => ['admin', 'gerente', 'gerente_comercial'].includes(r.name));

  const canManageRoles =
    isSuperAdmin ||
    isWhiteLabelAdmin ||
    isAgencyAdmin ||
    hasPermission(['manage_users', 'manage_roles', 'users.view', 'view_users']);

  // Tabs: 'my_roles' | 'manage_roles'
  const [activeTab, setActiveTab] = useState<'my_roles' | 'manage_roles'>('my_roles');

  // Roles management states
  const [roles, setRoles] = useState<Role[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([]);
  const [loadingRoles, setLoadingRoles] = useState<boolean>(true);
  const [searchRole, setSearchRole] = useState<string>('');
  const [roleTypeFilter, setRoleTypeFilter] = useState<'all' | 'system' | 'custom'>('all');

  // Permissions explorer search in "My Roles"
  const [myPermSearch, setMyPermSearch] = useState<string>('');
  const [selectedMyModule, setSelectedMyModule] = useState<string>('all');

  // Create / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [modalFormData, setModalFormData] = useState<{
    name: string;
    display_name: string;
    description: string;
    permissions: string[];
  }>({
    name: '',
    display_name: '',
    description: '',
    permissions: [],
  });
  const [modalPermSearch, setModalPermSearch] = useState<string>('');
  const [savingRole, setSavingRole] = useState<boolean>(false);

  // View Permissions Modal state
  const [viewingRole, setViewingRole] = useState<Role | null>(null);

  // Delete Confirm Modal state
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Load roles & available permissions
  const loadRolesData = async () => {
    if (!canManageRoles) {
      setLoadingRoles(false);
      return;
    }
    setLoadingRoles(true);
    try {
      const [rolesData, permsData] = await Promise.all([
        roleService.getRoles().catch(() => []),
        roleService.getAvailablePermissions().catch(() => []),
      ]);
      setRoles(rolesData);
      setAvailablePermissions(permsData);
    } catch (err) {
      console.error('Error al cargar roles:', err);
      toast.error('No se pudieron cargar los roles del sistema');
    } finally {
      setLoadingRoles(false);
    }
  };

  useEffect(() => {
    loadRolesData();
  }, [canManageRoles]);

  // User effective permissions resolution
  const userEffectivePerms = useMemo(() => {
    const list = user?.effective_permissions || [];
    if (list.length > 0) return list;
    return (user?.permissions || []).map((p: any) =>
      typeof p === 'string' ? p : p.name
    );
  }, [user]);

  // Group effective permissions by module
  const myGroupedPermissions = useMemo(() => {
    const groups: Record<string, string[]> = {};
    userEffectivePerms.forEach((permKey) => {
      const mod = getPermissionModule(permKey);
      if (!groups[mod]) groups[mod] = [];
      groups[mod].push(permKey);
    });
    return groups;
  }, [userEffectivePerms]);

  const myModulesList = useMemo(() => {
    return Object.keys(myGroupedPermissions).sort();
  }, [myGroupedPermissions]);

  // Filtered effective permissions in Tab 1
  const filteredMyPermissions = useMemo(() => {
    const q = myPermSearch.toLowerCase().trim();
    return userEffectivePerms.filter((perm) => {
      const mod = getPermissionModule(perm);
      if (selectedMyModule !== 'all' && mod !== selectedMyModule) {
        return false;
      }
      if (!q) return true;
      const label = getPermissionLabel(perm).toLowerCase();
      const desc = getPermissionDescription(perm).toLowerCase();
      return (
        perm.toLowerCase().includes(q) ||
        label.includes(q) ||
        desc.includes(q) ||
        mod.toLowerCase().includes(q)
      );
    });
  }, [userEffectivePerms, myPermSearch, selectedMyModule]);

  // Filtered Roles in Tab 2
  const filteredRoles = useMemo(() => {
    const q = searchRole.toLowerCase().trim();
    return roles.filter((role) => {
      if (roleTypeFilter === 'system' && !role.is_system) return false;
      if (roleTypeFilter === 'custom' && role.is_system) return false;

      if (!q) return true;
      const nameMatch = role.name.toLowerCase().includes(q);
      const displayMatch = (role.display_name || '').toLowerCase().includes(q);
      const descMatch = (role.description || '').toLowerCase().includes(q);
      return nameMatch || displayMatch || descMatch;
    });
  }, [roles, searchRole, roleTypeFilter]);

  // Available permissions grouped by module for modal
  const availableGroupedPermissions = useMemo(() => {
    const groups: Record<string, Permission[]> = {};
    const q = modalPermSearch.toLowerCase().trim();

    availablePermissions.forEach((perm) => {
      const mod = getPermissionModule(perm.name);
      const label = getPermissionLabel(perm.name).toLowerCase();
      const desc = getPermissionDescription(perm.name).toLowerCase();
      const matches =
        !q ||
        perm.name.toLowerCase().includes(q) ||
        label.includes(q) ||
        desc.includes(q) ||
        mod.toLowerCase().includes(q);

      if (matches) {
        if (!groups[mod]) groups[mod] = [];
        groups[mod].push(perm);
      }
    });

    return groups;
  }, [availablePermissions, modalPermSearch]);

  // Handle open create modal
  const handleOpenCreate = () => {
    setEditingRole(null);
    setModalFormData({
      name: '',
      display_name: '',
      description: '',
      permissions: [],
    });
    setModalPermSearch('');
    setIsModalOpen(true);
  };

  // Handle open edit modal
  const handleOpenEdit = (role: Role) => {
    setEditingRole(role);
    const existingPermNames = (role.permissions || []).map((p) => p.name);
    setModalFormData({
      name: role.name,
      display_name: role.display_name || role.name,
      description: role.description || '',
      permissions: existingPermNames,
    });
    setModalPermSearch('');
    setIsModalOpen(true);
  };

  // Handle toggle permission checkbox in modal
  const handleToggleModalPerm = (permName: string) => {
    setModalFormData((prev) => {
      const exists = prev.permissions.includes(permName);
      return {
        ...prev,
        permissions: exists
          ? prev.permissions.filter((p) => p !== permName)
          : [...prev.permissions, permName],
      };
    });
  };

  // Toggle all permissions for a module in modal
  const handleToggleModuleAll = (modulePerms: Permission[]) => {
    const permNames = modulePerms.map((p) => p.name);
    const allSelected = permNames.every((p) =>
      modalFormData.permissions.includes(p)
    );

    setModalFormData((prev) => ({
      ...prev,
      permissions: allSelected
        ? prev.permissions.filter((p) => !permNames.includes(p))
        : Array.from(new Set([...prev.permissions, ...permNames])),
    }));
  };

  // Submit Create or Edit Role
  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalFormData.display_name.trim()) {
      toast.error('El nombre visible del rol es obligatorio');
      return;
    }

    setSavingRole(true);
    try {
      if (editingRole) {
        // Update
        const payload: UpdateRolePayload = {
          display_name: modalFormData.display_name.trim(),
          description: modalFormData.description.trim() || undefined,
          permissions: modalFormData.permissions,
        };
        await roleService.updateRole(editingRole.id, payload);
        toast.success(`Rol "${modalFormData.display_name}" actualizado`);
      } else {
        // Create
        const slug =
          modalFormData.name.trim() ||
          modalFormData.display_name
            .toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/[^a-z0-9_]/g, '');

        const payload: CreateRolePayload = {
          name: slug,
          display_name: modalFormData.display_name.trim(),
          description: modalFormData.description.trim() || undefined,
          permissions: modalFormData.permissions,
          agency_id: user?.agency_id || undefined,
          white_label_id: user?.white_label_id || undefined,
        };
        await roleService.createRole(payload);
        toast.success(`Rol "${modalFormData.display_name}" creado exitosamente`);
      }

      setIsModalOpen(false);
      loadRolesData();
      if (refreshUser) {
        try { await refreshUser(); } catch (e) {}
      }
    } catch (err: any) {
      console.error('Error al guardar rol:', err);
      toast.error(
        err.response?.data?.message || 'Error al guardar la información del rol'
      );
    } finally {
      setSavingRole(false);
    }
  };

  // Submit Delete Role
  const handleDeleteRole = async () => {
    if (!deletingRole) return;
    setIsDeleting(true);
    try {
      await roleService.deleteRole(deletingRole.id);
      toast.success(`Rol "${deletingRole.display_name || deletingRole.name}" eliminado`);
      setDeletingRole(null);
      loadRolesData();
    } catch (err: any) {
      console.error('Error al eliminar rol:', err);
      toast.error(
        err.response?.data?.message || 'No se pudo eliminar el rol'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // User's active roles display list
  const userRolesList = useMemo(() => {
    if (user?.roles && user.roles.length > 0) {
      return user.roles;
    }
    if (user?.role) {
      return [{ id: 0, name: user.role, display_name: user.role }];
    }
    return [{ id: 0, name: 'user', display_name: 'Usuario' }];
  }, [user]);

  const activeAgencyName =
    user?.agency?.name ||
    (user as any)?.agency_data?.name ||
    currentAgency?.name ||
    'Sin Agencia Asignada';

  const activeWlName =
    currentWhiteLabel?.name ||
    (user as any)?.white_label?.name ||
    (user as any)?.white_labels?.[0]?.name ||
    'SANTUN Global';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Banner / Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-900/10">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-12 top-6 opacity-10 pointer-events-none">
          <ShieldCheck className="w-48 h-48 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold tracking-wide uppercase">
              <Shield className="w-3.5 h-3.5 text-blue-200" />
              <span>Control de Acceso & Permisos (RBAC)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Mis Roles y Privilegios del Sistema
            </h1>
            <p className="text-blue-100 text-sm max-w-2xl font-medium">
              Consulta en tiempo real los roles asignados a tu usuario, las
              capacidades operativas autorizadas por tu plan, y administra los
              perfiles de acceso de tu equipo.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                if (refreshUser) refreshUser();
                if (canManageRoles) loadRolesData();
                toast.success('Sesión y permisos actualizados');
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-xs backdrop-blur-md transition-all border border-white/20"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Actualizar</span>
            </button>

            {canManageRoles && (
              <button
                onClick={handleOpenCreate}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-900 hover:bg-blue-50 active:scale-95 font-bold text-xs shadow-lg transition-all"
              >
                <Plus className="w-4 h-4 text-indigo-700" />
                <span>Nuevo Rol de Equipo</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="relative z-10 flex items-center gap-2 mt-8 pt-6 border-t border-white/15 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab('my_roles')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'my_roles'
                ? 'bg-white text-indigo-900 shadow-md'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Mis Roles & Permisos Asignados</span>
            <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-indigo-100 text-indigo-900 font-black">
              {userEffectivePerms.length}
            </span>
          </button>

          {canManageRoles && (
            <button
              onClick={() => setActiveTab('manage_roles')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'manage_roles'
                  ? 'bg-white text-indigo-900 shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Gestión de Roles del Equipo</span>
              <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-indigo-100 text-indigo-900 font-black">
                {roles.length}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: MIS ROLES & ACCESOS */}
      {activeTab === 'my_roles' && (
        <div className="space-y-6">
          {/* User Profile & Roles Overview Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Identity Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-md shadow-blue-600/20 overflow-hidden">
                  {user?.photo ? (
                    <img
                      src={user.photo}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    (user?.name || 'US').substring(0, 2).toUpperCase()
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-black text-slate-900 dark:text-white truncate">
                    {user?.name} {user?.last_name || ''}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {user?.email}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                    {userRolesList.map((r, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900"
                      >
                        <ShieldCheck className="w-3 h-3" />
                        {r.display_name || r.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span className="font-semibold flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    Agencia:
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white truncate max-w-[180px]">
                    {activeAgencyName}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span className="font-semibold flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    Marca Blanca:
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white truncate max-w-[180px]">
                    {activeWlName}
                  </span>
                </div>
              </div>
            </div>

            {/* Plan & Subscription Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/60">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      Plan de Suscripción
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Capacidades habilitadas
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Activo
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800 space-y-2">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {user?.agency?.current_subscription?.plan?.name ||
                    user?.agency?.plan?.name ||
                    (user as any)?.agency_plan?.name ||
                    'Plan Corporativo Integral'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Tus permisos efectivos se calculan de manera dinámica
                  combinando el rol de tu usuario con las facultades activas del
                  plan de tu organización.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
                  <p className="text-lg font-black text-blue-600 dark:text-blue-400">
                    {userEffectivePerms.length}
                  </p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Permisos Activos
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-violet-50/50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/40">
                  <p className="text-lg font-black text-violet-600 dark:text-violet-400">
                    {myModulesList.length}
                  </p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Módulos Autorizados
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Access Info Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-900/60">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      Seguridad & Gobernanza
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Privilegios de tu cuenta
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Si consideras que te hace falta acceso a algún módulo operativo
                  (como expedientes de visados, contratos LexVault o comisiones),
                  contacta con el administrador de tu agencia para solicitar una
                  ampliación de permisos.
                </p>
              </div>

              {canManageRoles && (
                <button
                  onClick={() => setActiveTab('manage_roles')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs transition-colors"
                >
                  <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Gestionar Roles del Equipo →</span>
                </button>
              )}
            </div>
          </div>

          {/* Interactive Permissions Explorer */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Key className="w-5 h-5 text-blue-600" />
                  <span>Explorador de Permisos Otorgados ({filteredMyPermissions.length})</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Busca o filtra para verificar si tienes autorización para realizar acciones específicas.
                </p>
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={myPermSearch}
                  onChange={(e) => setMyPermSearch(e.target.value)}
                  placeholder="Buscar permiso o acción..."
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
              </div>
            </div>

            {/* Module filter pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
              <button
                onClick={() => setSelectedMyModule('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedMyModule === 'all'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Todos ({userEffectivePerms.length})
              </button>
              {myModulesList.map((mod) => (
                <button
                  key={mod}
                  onClick={() => setSelectedMyModule(mod)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    selectedMyModule === mod
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{mod}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedMyModule === mod
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {myGroupedPermissions[mod]?.length || 0}
                  </span>
                </button>
              ))}
            </div>

            {/* Permission Cards Grid */}
            {filteredMyPermissions.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <XCircle className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  No se encontraron permisos coincidentes
                </p>
                <p className="text-xs text-slate-400">
                  Intenta con otro término de búsqueda o selecciona otro módulo.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMyPermissions.map((permKey) => {
                  const mod = getPermissionModule(permKey);
                  const label = getPermissionLabel(permKey);
                  const desc = getPermissionDescription(permKey);

                  return (
                    <div
                      key={permKey}
                      className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition-all flex flex-col justify-between space-y-2"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-blue-100/70 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300">
                            {mod}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Autorizado</span>
                          </span>
                        </div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-white leading-snug">
                          {label}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                          {desc}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/50 text-[10px] font-mono text-slate-400 truncate">
                        {permKey}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: GESTIÓN DE ROLES DEL EQUIPO */}
      {activeTab === 'manage_roles' && canManageRoles && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchRole}
                  onChange={(e) => setSearchRole(e.target.value)}
                  placeholder="Buscar rol por nombre..."
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
              </div>

              {/* Type filter */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setRoleTypeFilter('all')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    roleTypeFilter === 'all'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  Todos ({roles.length})
                </button>
                <button
                  onClick={() => setRoleTypeFilter('system')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    roleTypeFilter === 'system'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  Sistema
                </button>
                <button
                  onClick={() => setRoleTypeFilter('custom')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    roleTypeFilter === 'custom'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  Personalizados
                </button>
              </div>
            </div>

            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Crear Rol Personalizado</span>
            </button>
          </div>

          {/* Roles Table */}
          {loadingRoles ? (
            <TableSkeleton rows={5} />
          ) : filteredRoles.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Shield className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                No se encontraron roles
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No existen roles con los filtros aplicados. Puedes crear nuevos
                roles personalizados para tu agencia o marca blanca.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Rol / Identificador</th>
                    <th className="py-3.5 px-4">Tipo</th>
                    <th className="py-3.5 px-4">Descripción</th>
                    <th className="py-3.5 px-4 text-center">Permisos Asignados</th>
                    <th className="py-3.5 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {filteredRoles.map((role) => {
                    const isSystem = Boolean(role.is_system);
                    const permsCount = role.permissions?.length || 0;

                    return (
                      <tr
                        key={role.id}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        {/* Name */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-xl shrink-0 ${
                                isSystem
                                  ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                                  : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                              }`}
                            >
                              <ShieldCheck className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white text-xs">
                                {role.display_name || role.name}
                              </p>
                              <p className="text-[10px] font-mono text-slate-400">
                                {role.name}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Type */}
                        <td className="py-4 px-4">
                          {isSystem ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                              <Lock className="w-2.5 h-2.5" />
                              Sistema
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                              <Sparkles className="w-2.5 h-2.5" />
                              Personalizado
                            </span>
                          )}
                        </td>

                        {/* Description */}
                        <td className="py-4 px-4 max-w-xs text-slate-500 dark:text-slate-400 text-[11px] truncate">
                          {role.description || (
                            <span className="italic text-slate-400">
                              {isSystem
                                ? 'Rol predeterminado del sistema'
                                : 'Sin descripción proporcionada'}
                            </span>
                          )}
                        </td>

                        {/* Permissions count */}
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => setViewingRole(role)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-600 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
                          >
                            <Key className="w-3 h-3 text-slate-400" />
                            <span>{permsCount} permisos</span>
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => setViewingRole(role)}
                              title="Ver permisos detallados"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {(!isSystem || isSuperAdmin) && (
                              <button
                                onClick={() => handleOpenEdit(role)}
                                title="Editar rol y permisos"
                                className="p-1.5 rounded-lg text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition-colors"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                            )}

                            {!isSystem && (
                              <button
                                onClick={() => setDeletingRole(role)}
                                title="Eliminar rol"
                                className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
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
      )}

      {/* CREATE / EDIT ROLE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {editingRole ? 'Editar Rol' : 'Crear Nuevo Rol'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Define las facultades y permisos operativos para los miembros asignados.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveRole} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {/* Basic Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nombre Visible del Rol *
                    </label>
                    <input
                      type="text"
                      required
                      value={modalFormData.display_name}
                      onChange={(e) =>
                        setModalFormData({
                          ...modalFormData,
                          display_name: e.target.value,
                        })
                      }
                      placeholder="Ej. Supervisor de Visados"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Identificador Slug {!editingRole && '(Opcional)'}
                    </label>
                    <input
                      type="text"
                      disabled={Boolean(editingRole)}
                      value={modalFormData.name}
                      onChange={(e) =>
                        setModalFormData({
                          ...modalFormData,
                          name: e.target.value.toLowerCase().replace(/\s+/g, '_'),
                        })
                      }
                      placeholder={
                        modalFormData.display_name
                          ? modalFormData.display_name
                              .toLowerCase()
                              .replace(/\s+/g, '_')
                              .replace(/[^a-z0-9_]/g, '')
                          : 'supervisor_visados'
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all disabled:opacity-60"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Descripción del Rol
                  </label>
                  <textarea
                    rows={2}
                    value={modalFormData.description}
                    onChange={(e) =>
                      setModalFormData({
                        ...modalFormData,
                        description: e.target.value,
                      })
                    }
                    placeholder="Describe qué funciones y responsabilidades tiene este rol dentro del equipo..."
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                  />
                </div>

                {/* Permissions Selector */}
                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-blue-600" />
                        <span>Permisos Disponibles ({modalFormData.permissions.length} seleccionados)</span>
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Los permisos están acotados por los módulos autorizados en tu Plan.
                      </p>
                    </div>

                    <div className="relative w-full sm:w-60">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={modalPermSearch}
                        onChange={(e) => setModalPermSearch(e.target.value)}
                        placeholder="Filtrar permisos..."
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                      />
                    </div>
                  </div>

                  {/* Modules Accordion / List */}
                  <div className="space-y-4">
                    {Object.entries(availableGroupedPermissions).map(([modName, modPerms]) => {
                      const allSelected = modPerms.every((p) =>
                        modalFormData.permissions.includes(p.name)
                      );

                      return (
                        <div
                          key={modName}
                          className="rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 space-y-3 bg-slate-50/50 dark:bg-slate-800/20"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                              {modName} ({modPerms.length})
                            </span>
                            <button
                              type="button"
                              onClick={() => handleToggleModuleAll(modPerms)}
                              className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {allSelected ? 'Desmarcar todos' : 'Marcar todos'}
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {modPerms.map((perm) => {
                              const isChecked = modalFormData.permissions.includes(perm.name);
                              const label = getPermissionLabel(perm.name);

                              return (
                                <label
                                  key={perm.name}
                                  className={`flex items-start gap-2.5 p-2 rounded-xl text-xs cursor-pointer border transition-colors ${
                                    isChecked
                                      ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-100 font-bold'
                                      : 'bg-white dark:bg-slate-900 border-slate-200/70 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => handleToggleModalPerm(perm.name)}
                                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <span className="block text-xs leading-tight truncate">
                                      {label}
                                    </span>
                                    <span className="block text-[10px] font-mono text-slate-400 truncate">
                                      {perm.name}
                                    </span>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingRole}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 disabled:opacity-60"
                >
                  {savingRole ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <span>Guardar Rol</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW PERMISSIONS MODAL */}
      {viewingRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Permisos de {viewingRole.display_name || viewingRole.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    {viewingRole.name} • {viewingRole.permissions?.length || 0} permisos asignados
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingRole(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
              {(!viewingRole.permissions || viewingRole.permissions.length === 0) ? (
                <div className="py-12 text-center text-slate-400 text-xs font-medium">
                  Este rol no cuenta con permisos individuales asignados.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {viewingRole.permissions.map((p) => (
                    <div
                      key={p.name}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1"
                    >
                      <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400">
                        {getPermissionModule(p.name)}
                      </span>
                      <p className="text-xs font-black text-slate-800 dark:text-slate-200">
                        {getPermissionLabel(p.name)}
                      </p>
                      <p className="text-[10px] font-mono text-slate-400">
                        {p.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setViewingRole(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deletingRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  ¿Eliminar este rol?
                </h3>
                <p className="text-xs text-slate-500">
                  {deletingRole.display_name || deletingRole.name}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Esta acción eliminará el perfil de permisos personalizado. Si hay usuarios
              asignados con este rol, el sistema requerirá que sean reasignados primero.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingRole(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteRole}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all disabled:opacity-60"
              >
                {isDeleting ? 'Eliminando...' : 'Sí, Eliminar Rol'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesPage;
