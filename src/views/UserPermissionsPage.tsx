'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { User } from '../types';
import userService from '../services/userService';
import { 
  ArrowLeft, ShieldCheck, Shield, Key, Search, Building, Mail, 
  ShieldAlert, CheckCircle2, ArrowRight, UserCheck, Info
} from 'lucide-react';
import { TableSkeleton } from '@/components/Skeleton';
import { getPermissionLabel, getPermissionDescription, getPermissionModule } from '@/utils/permissionLabels';

export const UserPermissionsPage: React.FC = () => {
  const params = useParams();
  const searchParams = useSearchParams();

  const userId = params?.id ? Number(params.id) : searchParams.get('id') ? Number(searchParams.get('id')) : null;

  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [effectivePermissions, setEffectivePermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (userId) {
      loadData(userId);
    } else {
      setLoading(false);
    }
  }, [userId]);

  const loadData = async (id: number) => {
    setLoading(true);
    try {
      const [userRes, userPermsData] = await Promise.all([
        userService.getUser(id).catch(() => null),
        userService.getUserPermissions(id).catch(() => ({ permissions: [] })),
      ]);

      if (userRes) {
        setTargetUser(userRes);
      }
      setEffectivePermissions(userPermsData?.permissions || userRes?.effective_permissions || []);
    } catch (err) {
      console.error('Error al cargar permisos del usuario:', err);
    } finally {
      setLoading(false);
    }
  };

  // Group effective permissions by module
  const groupedPermissions = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const groups: Record<string, { key: string; label: string; description: string }[]> = {};

    effectivePermissions.forEach((permKey) => {
      const label = getPermissionLabel(permKey);
      const desc = getPermissionDescription(permKey);
      const mod = getPermissionModule(permKey);

      if (
        !q ||
        permKey.toLowerCase().includes(q) ||
        label.toLowerCase().includes(q) ||
        desc.toLowerCase().includes(q) ||
        mod.toLowerCase().includes(q)
      ) {
        if (!groups[mod]) groups[mod] = [];
        groups[mod].push({ key: permKey, label, description: desc });
      }
    });

    return groups;
  }, [effectivePermissions, searchQuery]);

  if (loading) {
    return (
      <div className="space-y-6 p-2">
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

  if (!userId || !targetUser) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Usuario no encontrado</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">No se pudo obtener el identificador de usuario válido.</p>
        <Link href="/users" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md">
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Directorio de Usuarios</span>
        </Link>
      </div>
    );
  }

  const roleName = targetUser?.role || targetUser?.roles?.[0]?.display_name || targetUser?.roles?.[0]?.name || 'Usuario';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Navigation Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-4">
          <Link
            href="/users"
            className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-xs shrink-0"
            title="Volver a Usuarios"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">
              <span>Usuarios</span>
              <span>/</span>
              <span className="text-blue-600">Permisos por Rol</span>
            </div>
            <h1 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <span>Permisos Asignados a {targetUser.name}</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                {effectivePermissions.length} permisos
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/roles?tab=manage_roles"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-extrabold text-xs hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-600/25"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Gestionar Permisos en Roles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* RBAC Informational Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-900/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 font-bold shrink-0">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <span>Administración Centralizada por Roles (RBAC)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Seguridad Mejorada
              </span>
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Los permisos ya no se asignan individualmente a cada usuario. Cada usuario hereda de forma automática e inmediata los permisos configurados para su <strong className="text-white">Rol</strong>. Para modificar sus facultades, edita el Rol en la sección correspondiente.
            </p>
          </div>
        </div>

        <Link
          href="/roles?tab=manage_roles"
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all shrink-0 flex items-center gap-1.5"
        >
          <span>Ir a Configurar Rol: {roleName}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* User Summary Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-black text-lg flex items-center justify-center border border-indigo-200/80 dark:border-indigo-800 shrink-0">
            {targetUser?.photo ? (
              <img src={targetUser.photo} alt={targetUser.name} className="w-full h-full object-cover rounded-2xl" />
            ) : (
              targetUser?.name?.charAt(0).toUpperCase() || 'U'
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-900 dark:text-white">{targetUser.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                Rol: {roleName}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium mt-1">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{targetUser.email}</span>
              </span>
              {targetUser?.agency && (
                <span className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>{targetUser.agency.name}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-400 font-medium">Estado de Permisos</div>
          <div className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 justify-end mt-0.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Heredados del Rol</span>
          </div>
        </div>
      </div>

      {/* Search Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar en los permisos del usuario..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
          />
        </div>

        <div className="text-xs font-semibold text-slate-500">
          Mostrando <span className="font-bold text-slate-900 dark:text-white">{Object.keys(groupedPermissions).length}</span> módulos autorizados
        </div>
      </div>

      {/* Permissions Breakdown Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(groupedPermissions).map(([modName, perms]) => (
          <div
            key={modName}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                    {modName}
                  </h3>
                  <p className="text-[11px] font-medium text-slate-400">
                    {perms.length} facultades habilitadas
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Activo vía Rol
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {perms.map((p) => (
                <div
                  key={p.key}
                  className="p-3 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{p.label}</p>
                    <p className="text-[10px] font-mono text-slate-400 truncate">{p.key}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {Object.keys(groupedPermissions).length === 0 && (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <Key className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="text-xs font-bold text-slate-500">No se encontraron permisos que coincidan con la búsqueda.</p>
        </div>
      )}
    </div>
  );
};

export default UserPermissionsPage;
