'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  PermissionGroup, 
  PermissionGroupUsage, 
  Permission, 
  CreatePermissionGroupPayload, 
  UpdatePermissionGroupPayload 
} from '@/types';
import permissionGroupService from '@/services/permissionGroupService';
import roleService from '@/services/roleService';
import { 
  ShieldCheck, Shield, KeyRound, Users, Search, Plus, Edit3, Trash2, 
  CheckCircle2, AlertCircle, Sparkles, Layers, Lock, Check, X, RefreshCw, 
  Eye, Info, UserCheck, CheckSquare, Square, Filter, AlertTriangle, 
  SlidersHorizontal, ShieldAlert, FolderKanban, CheckCheck, Undo2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { TableSkeleton } from '@/components/Skeleton';
import GroupPermissionsEditorView from './GroupPermissionsEditorView';
import { 
  getPermissionLabel, 
  getPermissionDescription, 
  getPermissionModule 
} from '@/utils/permissionLabels';

interface PermissionGroupsTabProps {
  canManage: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  onRefreshParent?: () => void;
}

export const PermissionGroupsTab: React.FC<PermissionGroupsTabProps> = ({
  canManage,
  canCreate,
  canEdit,
  canDelete,
  onRefreshParent,
}) => {
  const [groups, setGroups] = useState<PermissionGroup[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'system' | 'custom'>('all');

  // Create / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingGroup, setEditingGroup] = useState<PermissionGroup | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    is_active: boolean;
    permissions: string[];
  }>({
    name: '',
    description: '',
    is_active: true,
    permissions: [],
  });
  const [modalPermSearch, setModalPermSearch] = useState<string>('');
  const [onlySelectedPerms, setOnlySelectedPerms] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  // View Permissions Modal State
  const [viewingGroup, setViewingGroup] = useState<PermissionGroup | null>(null);
  const [viewPermSearch, setViewPermSearch] = useState<string>('');

  // Delete Modal State
  const [deletingGroup, setDeletingGroup] = useState<PermissionGroup | null>(null);
  const [usageData, setUsageData] = useState<PermissionGroupUsage | null>(null);
  const [loadingUsage, setLoadingUsage] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Load Data
  const loadData = async () => {
    setLoading(true);
    try {
      const [groupsData, permsData] = await Promise.all([
        permissionGroupService.getGroups(),
        roleService.getAvailablePermissions().catch(() => []),
      ]);
      setGroups(groupsData || []);
      setAvailablePermissions(permsData || []);
    } catch (err: any) {
      console.error('Error loading permission groups:', err);
      toast.error(err.response?.data?.message || 'Error al cargar grupos de permisos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered Groups
  const filteredGroups = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return groups.filter((g) => {
      // Type filter
      if (typeFilter === 'system' && !g.is_system) return false;
      if (typeFilter === 'custom' && g.is_system) return false;

      // Status filter
      if (statusFilter === 'active' && !g.is_active) return false;
      if (statusFilter === 'inactive' && g.is_active) return false;

      // Search term
      if (!q) return true;
      const nameMatch = (g.name || '').toLowerCase().includes(q);
      const slugMatch = (g.slug || '').toLowerCase().includes(q);
      const descMatch = (g.description || '').toLowerCase().includes(q);
      return nameMatch || slugMatch || descMatch;
    });
  }, [groups, searchTerm, statusFilter, typeFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = groups.length;
    const active = groups.filter((g) => g.is_active).length;
    const system = groups.filter((g) => g.is_system).length;
    const custom = total - system;
    return { total, active, system, custom };
  }, [groups]);

  // Grouped available permissions for the Modal
  const availableGroupedPermissions = useMemo(() => {
    const map: Record<string, Permission[]> = {};
    const q = modalPermSearch.toLowerCase().trim();

    availablePermissions.forEach((perm) => {
      const isSelected = formData.permissions.includes(perm.name);
      if (onlySelectedPerms && !isSelected) return;

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
        if (!map[mod]) map[mod] = [];
        map[mod].push(perm);
      }
    });

    return map;
  }, [availablePermissions, modalPermSearch, onlySelectedPerms, formData.permissions]);

  // Handle open create modal
  const handleOpenCreate = () => {
    setEditingGroup(null);
    setFormData({
      name: '',
      description: '',
      is_active: true,
      permissions: [],
    });
    setModalPermSearch('');
    setOnlySelectedPerms(false);
    setIsModalOpen(true);
  };

  // Handle open edit modal
  const handleOpenEdit = (group: PermissionGroup) => {
    setEditingGroup(group);
    const permNames = (group.permissions || []).map((p: any) =>
      typeof p === 'string' ? p : p.name
    );
    setFormData({
      name: group.name,
      description: group.description || '',
      is_active: group.is_active,
      permissions: permNames,
    });
    setModalPermSearch('');
    setOnlySelectedPerms(false);
    setIsModalOpen(true);
  };

  // Toggle single permission in modal
  const handleTogglePerm = (permName: string) => {
    setFormData((prev) => {
      const exists = prev.permissions.includes(permName);
      return {
        ...prev,
        permissions: exists
          ? prev.permissions.filter((p) => p !== permName)
          : [...prev.permissions, permName],
      };
    });
  };

  // Toggle all permissions of a module
  const handleToggleModuleAll = (modulePerms: Permission[]) => {
    const permNames = modulePerms.map((p) => p.name);
    const allSelected = permNames.every((p) => formData.permissions.includes(p));

    setFormData((prev) => ({
      ...prev,
      permissions: allSelected
        ? prev.permissions.filter((p) => !permNames.includes(p))
        : Array.from(new Set([...prev.permissions, ...permNames])),
    }));
  };

  // Global select all permissions
  const handleSelectAllPerms = () => {
    const allNames = availablePermissions.map((p) => p.name);
    setFormData((prev) => ({
      ...prev,
      permissions: allNames,
    }));
    toast.success(`Todos los permisos seleccionados (${allNames.length})`);
  };

  // Global deselect all permissions
  const handleDeselectAllPerms = () => {
    setFormData((prev) => ({
      ...prev,
      permissions: [],
    }));
    toast('Selección de permisos limpiada', { icon: '🧹' });
  };

  // Save Group (Create / Update)
  const handleSaveGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('El nombre del grupo de permisos es obligatorio');
      return;
    }

    setSaving(true);
    try {
      if (editingGroup) {
        const payload: UpdatePermissionGroupPayload = {
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          is_active: formData.is_active,
          permissions: formData.permissions,
        };
        await permissionGroupService.updateGroup(editingGroup.id, payload);
        toast.success(`Grupo "${formData.name}" actualizado exitosamente`);
      } else {
        const payload: CreatePermissionGroupPayload = {
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          is_active: formData.is_active,
          permissions: formData.permissions,
        };
        await permissionGroupService.createGroup(payload);
        toast.success(`Grupo "${formData.name}" creado exitosamente`);
      }
      setIsModalOpen(false);
      loadData();
      if (onRefreshParent) onRefreshParent();
    } catch (err: any) {
      console.error('Error saving permission group:', err);
      toast.error(err.response?.data?.message || 'Error al guardar grupo de permisos');
    } finally {
      setSaving(false);
    }
  };

  // Toggle Group Status (Active / Inactive)
  const handleToggleStatus = async (group: PermissionGroup) => {
    try {
      const updated = await permissionGroupService.toggleStatus(group.id);
      setGroups((prev) =>
        prev.map((g) => (g.id === group.id ? { ...g, is_active: updated.is_active } : g))
      );
      toast.success(
        updated.is_active
          ? `Grupo "${group.name}" activado`
          : `Grupo "${group.name}" desactivado`
      );
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al cambiar estado del grupo');
    }
  };

  // Open Delete Modal and Check Usage
  const handleOpenDelete = async (group: PermissionGroup) => {
    if (group.is_system) {
      toast.error('Los grupos del sistema están protegidos y no pueden ser eliminados.');
      return;
    }
    setDeletingGroup(group);
    setLoadingUsage(true);
    try {
      const usage = await permissionGroupService.getGroupUsage(group.id);
      setUsageData(usage);
    } catch (err) {
      setUsageData({
        is_used: (group.roles_count || 0) > 0 || (group.users_count || 0) > 0,
        roles_count: group.roles_count || 0,
        users_count: group.users_count || 0,
        roles: group.roles || [],
      });
    } finally {
      setLoadingUsage(false);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingGroup) return;
    setIsDeleting(true);
    try {
      await permissionGroupService.deleteGroup(deletingGroup.id);
      toast.success(`Grupo "${deletingGroup.name}" eliminado correctamente`);
      setDeletingGroup(null);
      setUsageData(null);
      loadData();
      if (onRefreshParent) onRefreshParent();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al eliminar grupo de permisos');
    } finally {
      setIsDeleting(false);
    }
  };

  // Deactivate instead of deleting
  const handleDeactivateInstead = async () => {
    if (!deletingGroup) return;
    setIsDeleting(true);
    try {
      await permissionGroupService.toggleStatus(deletingGroup.id);
      toast.success(`Grupo "${deletingGroup.name}" desactivado como alternativa segura`);
      setDeletingGroup(null);
      setUsageData(null);
      loadData();
    } catch (err: any) {
      toast.error('Error al desactivar el grupo');
    } finally {
      setIsDeleting(false);
    }
  };

  // Render Full View Editor when Creating or Editing a Permission Group (No Modal)
  if (isModalOpen) {
    return (
      <GroupPermissionsEditorView
        group={
          editingGroup
            ? {
                id: editingGroup.id,
                name: editingGroup.name,
                slug: editingGroup.slug,
                category: editingGroup.category || undefined,
                description: editingGroup.description || undefined,
                is_active: editingGroup.is_active,
                is_system: editingGroup.is_system,
                permissions: (editingGroup.permissions || []).map((p: any) =>
                  typeof p === 'string' ? p : p.name
                ),
              }
            : {
                name: '',
                permissions: [],
                is_active: true,
              }
        }
        availablePermissions={availablePermissions}
        title={editingGroup ? `Editar Grupo: ${editingGroup.name}` : 'Crear Nuevo Grupo de Permisos'}
        backLabel="Volver a Grupos de Permisos"
        onCancel={() => {
          setIsModalOpen(false);
          setEditingGroup(null);
        }}
        onSave={async (payload) => {
          try {
            if (editingGroup) {
              await permissionGroupService.updateGroup(editingGroup.id, payload);
              toast.success(`Grupo "${payload.name}" actualizado exitosamente`);
            } else {
              await permissionGroupService.createGroup(payload);
              toast.success(`Grupo "${payload.name}" creado exitosamente`);
            }
            setIsModalOpen(false);
            setEditingGroup(null);
            loadData();
            if (onRefreshParent) onRefreshParent();
          } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Error al guardar grupo');
            throw err;
          }
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              Total Grupos
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {stats.total}
          </p>
          <span className="text-[11px] text-slate-400 font-medium">Configurados</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              Grupos Activos
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {stats.active}
          </p>
          <span className="text-[11px] text-emerald-600 font-bold">Listos para asignar</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              Del Sistema
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {stats.system}
          </p>
          <span className="text-[11px] text-slate-400 font-medium">Predeterminados</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              Personalizados
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {stats.custom}
          </p>
          <span className="text-[11px] text-amber-600 font-bold">A medida del tenant</span>
        </div>
      </div>

      {/* Control Bar: Search, Filters & Action Button */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar grupo por nombre o descripción..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                typeFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setTypeFilter('custom')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                typeFilter === 'custom'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Personalizados
            </button>
            <button
              onClick={() => setTypeFilter('system')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                typeFilter === 'system'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Del Sistema
            </button>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500 w-full sm:w-auto"
          >
            <option value="all">Estado: Todos</option>
            <option value="active">Solo Activos</option>
            <option value="inactive">Solo Inactivos</option>
          </select>
        </div>

        {/* Create Button */}
        {canCreate && (
          <button
            onClick={handleOpenCreate}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 active:scale-95 text-slate-950 font-black text-xs shadow-md shadow-amber-400/20 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Crear Grupo de Permisos</span>
          </button>
        )}
      </div>

      {/* Groups Grid / Cards List */}
      {loading ? (
        <TableSkeleton rows={5} />
      ) : filteredGroups.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/50 text-amber-500 flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-800/60 shadow-sm">
            <Layers className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              No se encontraron grupos de permisos
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'No existen grupos que coincidan con los filtros aplicados.'
                : 'Aún no has creado ningún grupo de permisos personalizado.'}
            </p>
          </div>
          {canCreate && (
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Crear mi Primer Grupo</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGroups.map((group) => {
            const permCount = group.permissions_count ?? (group.permissions ? group.permissions.length : 0);
            const rolesCount = group.roles_count ?? (group.roles ? group.roles.length : 0);
            const usersCount = group.users_count ?? 0;

            return (
              <div
                key={group.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                {/* Header */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shrink-0 ${
                        group.is_system
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                          : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                      }`}>
                        {group.is_system ? <Lock className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
                      </div>

                      <div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                          {group.name}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400">
                          slug: {group.slug}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        group.is_system
                          ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40'
                          : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40'
                      }`}>
                        {group.is_system ? 'Sistema' : 'Personalizado'}
                      </span>

                      <button
                        onClick={() => canEdit && handleToggleStatus(group)}
                        disabled={!canEdit}
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors ${
                          group.is_active
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                        }`}
                        title={canEdit ? 'Clic para alternar estado' : undefined}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${group.is_active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        <span>{group.is_active ? 'Activo' : 'Inactivo'}</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 min-h-[32px]">
                    {group.description || 'Sin descripción adicional cargada.'}
                  </p>
                </div>

                {/* Details Badges */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                  <div className="flex items-center justify-between text-xs">
                    <button
                      onClick={() => setViewingGroup(group)}
                      className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-extrabold hover:underline"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>{permCount} permisos asociados</span>
                    </button>

                    <div className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {rolesCount} {rolesCount === 1 ? 'rol' : 'roles'}
                        {usersCount > 0 && ` • ${usersCount} u.`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Creado: {new Date(group.created_at).toLocaleDateString()}</span>
                    <span>Act: {new Date(group.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                  <button
                    onClick={() => setViewingGroup(group)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    title="Ver permisos del grupo"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ver</span>
                  </button>

                  {canEdit && (
                    <button
                      onClick={() => handleOpenEdit(group)}
                      className="flex-1 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                      title="Editar grupo y permisos"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>
                  )}

                  {canDelete && !group.is_system && (
                    <button
                      onClick={() => handleOpenDelete(group)}
                      className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                      title="Eliminar grupo de permisos"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= MODAL DE VER PERMISOS ASIGNADOS ================= */}
      {viewingGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Permisos de: {viewingGroup.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {(viewingGroup.permissions || []).length} permisos asignados a este grupo.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setViewingGroup(null)}
                className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={viewPermSearch}
                  onChange={(e) => setViewPermSearch(e.target.value)}
                  placeholder="Buscar en los permisos asignados..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-2">
              {(viewingGroup.permissions || []).filter((p: any) => {
                const name = typeof p === 'string' ? p : p.name;
                const label = getPermissionLabel(name);
                const q = viewPermSearch.toLowerCase();
                return name.toLowerCase().includes(q) || label.toLowerCase().includes(q);
              }).map((p: any, idx) => {
                const name = typeof p === 'string' ? p : p.name;
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        {getPermissionLabel(name)}
                      </p>
                      <span className="font-mono text-[10px] text-slate-400">{name}</span>
                    </div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {getPermissionModule(name)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingGroup(null)}
                className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-bold text-xs transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL DE ELIMINACIÓN PROTEGIDA ================= */}
      {deletingGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md p-6 space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto border border-rose-200 dark:border-rose-900/60">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Eliminar Grupo de Permisos
              </h3>
              <p className="text-xs text-slate-500">
                ¿Estás seguro de que deseas eliminar el grupo <strong className="text-slate-900 dark:text-white">"{deletingGroup.name}"</strong>?
              </p>
            </div>

            {loadingUsage ? (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Verificando si el grupo está siendo utilizado...</span>
              </div>
            ) : usageData?.is_used ? (
              /* ALERTA: GRUPO EN USO - BLOQUEADO */
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-black">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>El grupo está siendo utilizado activamente</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Este grupo tiene dependencias asociadas ({usageData.roles_count} roles y {usageData.users_count} usuarios). Por seguridad e integridad de permisos, no puede ser eliminado mientras esté asignado.
                </p>
                {usageData.roles && usageData.roles.length > 0 && (
                  <div className="pt-1 text-[10px] font-mono">
                    <span className="font-bold">Roles que lo usan:</span>{' '}
                    {usageData.roles.map((r) => r.display_name || r.name).join(', ')}
                  </div>
                )}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleDeactivateInstead}
                    disabled={isDeleting}
                    className="w-full py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Desactivar Grupo en su lugar</span>
                  </button>
                </div>
              </div>
            ) : (
              /* GRUPO LIBRE - SE PUEDE ELIMINAR */
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 text-xs text-center">
                El grupo no está siendo utilizado por ningún rol o usuario. Se aplicará una baja segura (Soft Delete).
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setDeletingGroup(null);
                  setUsageData(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancelar
              </button>

              {!usageData?.is_used && (
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleConfirmDelete}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {isDeleting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Eliminando...</span>
                    </>
                  ) : (
                    <span>Confirmar Eliminación</span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionGroupsTab;
