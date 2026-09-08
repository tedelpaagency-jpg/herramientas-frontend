'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { User } from '../types';
import userService from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, Key, Shield, Check, Sparkles, CheckSquare, Square, RefreshCw, 
  Search, User as UserIcon, Building, Mail, ShieldAlert, CheckCircle2 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { TableSkeleton } from '@/components/Skeleton';

export const UserPermissionsPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { refreshUser, user: currentUser } = useAuth();

  const userId = params?.id ? Number(params.id) : searchParams.get('id') ? Number(searchParams.get('id')) : null;

  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [catalog, setCatalog] = useState<Record<string, { name: string; permissions: Record<string, string> }>>({});
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
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
      const [userRes, catData, userPermsData] = await Promise.all([
        userService.getUser(id).catch(() => null),
        userService.getPermissionCatalog(),
        userService.getUserPermissions(id),
      ]);

      if (userRes) {
        setTargetUser(userRes);
      }
      setCatalog(catData || {});
      setSelectedPermissions(userPermsData.permissions || []);
    } catch (err) {
      toast.error('Error al cargar la información de permisos del usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePermission = (permKey: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permKey) ? prev.filter((p) => p !== permKey) : [...prev, permKey]
    );
  };

  const handleSelectModuleAll = (modulePermKeys: string[]) => {
    const allSelected = modulePermKeys.every((k) => selectedPermissions.includes(k));
    if (allSelected) {
      setSelectedPermissions((prev) => prev.filter((k) => !modulePermKeys.includes(k)));
    } else {
      setSelectedPermissions((prev) => Array.from(new Set([...prev, ...modulePermKeys])));
    }
  };

  const handleApplyPresetCloser = () => {
    const closerPerms = [
      'leads.view',
      'leads.create',
      'leads.edit',
      'leads.assign',
      'clients.view',
      'clients.create',
      'clients.edit',
    ];
    setSelectedPermissions(closerPerms);
    toast.success('Preset Closer aplicado (CRM y Clientes)');
  };

  const handleApplyPresetFull = () => {
    const allPerms: string[] = [];
    Object.values(catalog).forEach((module) => {
      Object.keys(module.permissions).forEach((key) => allPerms.push(key));
    });
    setSelectedPermissions(allPerms);
    toast.success('Preset Administrador aplicado (Acceso Total)');
  };

  const handleClearAll = () => {
    setSelectedPermissions([]);
    toast('Todos los permisos han sido desmarcados', { icon: '🧹' });
  };

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      await userService.syncUserPermissions(userId, selectedPermissions);
      toast.success(`Permisos actualizados correctamente para ${targetUser?.name || 'el usuario'}`);
      if (refreshUser) {
        try { await refreshUser(); } catch (e) {}
      }
      router.push('/users');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al guardar permisos del usuario');
    } finally {
      setSaving(false);
    }
  };

  // Filtrado de permisos por búsqueda
  const filteredCatalog = Object.entries(catalog).reduce((acc, [moduleKey, module]) => {
    if (!searchQuery.trim()) {
      acc[moduleKey] = module;
      return acc;
    }

    const q = searchQuery.toLowerCase();
    const moduleMatch = module.name.toLowerCase().includes(q);
    const matchingPerms = Object.entries(module.permissions).reduce((pAcc, [pKey, pLabel]) => {
      if (moduleMatch || pKey.toLowerCase().includes(q) || pLabel.toLowerCase().includes(q)) {
        pAcc[pKey] = pLabel;
      }
      return pAcc;
    }, {} as Record<string, string>);

    if (Object.keys(matchingPerms).length > 0) {
      acc[moduleKey] = {
        ...module,
        permissions: matchingPerms,
      };
    }
    return acc;
  }, {} as Record<string, { name: string; permissions: Record<string, string> }>);

  const totalCatalogPerms = Object.values(catalog).reduce((acc, m) => acc + Object.keys(m.permissions).length, 0);

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

  if (!userId || (!targetUser && !loading)) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-lg font-extrabold text-slate-900">Usuario no encontrado</h2>
        <p className="text-xs text-slate-500">No se pudo obtener el identificador de usuario válido.</p>
        <Link href="/users" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md">
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Directorio</span>
        </Link>
      </div>
    );
  }

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
              <span className="text-blue-600">Asignación de Permisos Granulares</span>
            </div>
            <h1 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <span>Gestión de Permisos de Acceso</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-50 text-blue-600 border border-blue-200">
                {selectedPermissions.length} / {totalCatalogPerms} activos
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/users"
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-extrabold text-xs hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-600/25 disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>Guardar Permisos</span>
          </button>
        </div>
      </div>

      {/* Target User Detail Banner Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-black text-xl shadow-inner shrink-0">
            {targetUser?.photo ? (
              <img src={targetUser.photo} alt={targetUser.name} className="w-full h-full object-cover rounded-2xl" />
            ) : (
              targetUser?.name?.charAt(0).toUpperCase() || 'U'
            )}
          </div>
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <span>{targetUser?.name}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                {targetUser?.role || 'User'}
              </span>
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-1 font-medium">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>{targetUser?.email}</span>
              </span>
              {targetUser?.agency && (
                <span className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Agencia: {targetUser.agency.name}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Presets Toolbar */}
        <div className="flex flex-wrap items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/10 w-full md:w-auto">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-200 px-2">Presets:</span>
          <button
            type="button"
            onClick={handleApplyPresetCloser}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
            <span>Closer (CRM + Clientes)</span>
          </button>
          <button
            type="button"
            onClick={handleApplyPresetFull}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-xs"
          >
            Acceso Total
          </button>
          <button
            type="button"
            onClick={handleClearAll}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all"
          >
            Desmarcar Todo
          </button>
        </div>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar permiso o módulo..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
          />
        </div>

        <div className="text-xs font-semibold text-slate-500">
          Mostrando <span className="font-bold text-slate-900">{Object.keys(filteredCatalog).length}</span> módulos del catálogo
        </div>
      </div>

      {/* Modules Permission Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(filteredCatalog).map(([moduleKey, module]) => {
          const modulePermKeys = Object.keys(module.permissions);
          const selectedInModule = modulePermKeys.filter((p) => selectedPermissions.includes(p)).length;
          const allSelected = modulePermKeys.length > 0 && selectedInModule === modulePermKeys.length;

          return (
            <div
              key={moduleKey}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div>
                {/* Module Card Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-slate-900 dark:text-slate-100">{module.name}</h3>
                      <p className="text-[11px] font-medium text-slate-400">
                        {selectedInModule} de {modulePermKeys.length} permisos activos
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectModuleAll(modulePermKeys)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    {allSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                    <span>{allSelected ? 'Desmarcar Módulo' : 'Seleccionar Módulo'}</span>
                  </button>
                </div>

                {/* Module Permissions Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {Object.entries(module.permissions).map(([permKey, permLabel]) => {
                    const isChecked = selectedPermissions.includes(permKey);
                    return (
                      <div
                        key={permKey}
                        onClick={() => handleTogglePermission(permKey)}
                        className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all select-none ${
                          isChecked
                            ? 'bg-blue-50/70 border-blue-300 text-blue-900 font-bold shadow-xs'
                            : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 font-medium hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer pointer-events-none"
                        />
                        <span className="text-xs leading-snug">{permLabel}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Sticky Save Bar */}
      <div className="fixed bottom-6 right-6 z-40 bg-slate-900/90 backdrop-blur-md text-white px-6 py-3.5 rounded-2xl shadow-2xl border border-slate-800 flex items-center gap-4 animate-fade-in">
        <div className="text-xs">
          <span className="text-slate-400">Permisos seleccionados:</span>{' '}
          <span className="font-black text-blue-400">{selectedPermissions.length}</span>
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 text-white font-extrabold text-xs hover:bg-blue-500 active:scale-95 transition-all shadow-md shadow-blue-600/30 disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
          <span>Guardar Cambios</span>
        </button>
      </div>
    </div>
  );
};

export default UserPermissionsPage;
