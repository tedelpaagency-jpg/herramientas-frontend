'use client';

import React, { useEffect, useState } from 'react';
import { User } from '../types';
import userService from '../services/userService';
import Portal from './Portal';
import { Key, Shield, Check, X, Sparkles, CheckSquare, Square, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';

interface UserPermissionsModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const UserPermissionsModal: React.FC<UserPermissionsModalProps> = ({
  user,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { refreshUser } = useAuth();
  const [catalog, setCatalog] = useState<Record<string, { name: string; permissions: Record<string, string> }>>({});
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && user?.id) {
      loadPermissionsData();
    }
  }, [isOpen, user?.id]);

  const loadPermissionsData = async () => {
    setLoading(true);
    try {
      const [catData, userData] = await Promise.all([
        userService.getPermissionCatalog(),
        userService.getUserPermissions(user.id),
      ]);
      setCatalog(catData || {});
      setSelectedPermissions(userData.permissions || []);
    } catch (err) {
      toast.error('Error al cargar permisos del usuario');
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
    toast.success('Preset para Rol Closer aplicado (CRM y Clientes)');
  };

  const handleApplyPresetFull = () => {
    const allPerms: string[] = [];
    Object.values(catalog).forEach((module) => {
      Object.keys(module.permissions).forEach((key) => allPerms.push(key));
    });
    setSelectedPermissions(allPerms);
    toast.success('Preset Administrador aplicado (Todos los permisos)');
  };

  const handleClearAll = () => {
    setSelectedPermissions([]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await userService.syncUserPermissions(user.id, selectedPermissions);
      toast.success(`Permisos actualizados para ${user.name}`);
      if (refreshUser) {
        try { await refreshUser(); } catch (e) {}
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al guardar permisos');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 top-0 left-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                <Key className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Permisos CRUD Granulares por Usuario
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Usuario: <span className="font-extrabold text-slate-800 dark:text-slate-200">{user.name} ({user.email})</span> • Rol: <span className="uppercase font-bold text-indigo-600">{user.role || 'User'}</span>
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Presets Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs">
            <span className="font-extrabold text-slate-500 uppercase text-[10px]">Configuración Rápida (Presets):</span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleApplyPresetCloser}
                className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold rounded-xl hover:bg-indigo-200 transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Preset Closer (CRM + Clientes)</span>
              </button>

              <button
                type="button"
                onClick={handleApplyPresetFull}
                className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold rounded-xl hover:bg-emerald-200 transition-all"
              >
                Acceso Total
              </button>

              <button
                type="button"
                onClick={handleClearAll}
                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-300 transition-all"
              >
                Desmarcar Todo
              </button>
            </div>
          </div>

          {/* Permission Matrix Content */}
          {loading ? (
            <div className="p-8 text-center text-slate-400 font-medium text-xs flex justify-center items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
              <span>Cargando matriz de permisos...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(catalog).map(([moduleKey, module]) => {
                const modulePermKeys = Object.keys(module.permissions);
                const allSelected = modulePermKeys.every((p) => selectedPermissions.includes(p));
                const someSelected = modulePermKeys.some((p) => selectedPermissions.includes(p));

                return (
                  <div
                    key={moduleKey}
                    className="p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-2">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-indigo-500" />
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                          {module.name}
                        </h4>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectModuleAll(modulePermKeys)}
                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 flex items-center gap-1"
                      >
                        {allSelected ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
                        <span>{allSelected ? 'Desmarcar Módulo' : 'Seleccionar Módulo'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {Object.entries(module.permissions).map(([permKey, permLabel]) => {
                        const isChecked = selectedPermissions.includes(permKey);
                        return (
                          <div
                            key={permKey}
                            onClick={() => handleTogglePermission(permKey)}
                            className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all select-none ${
                              isChecked
                                ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 font-bold shadow-2xs'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium hover:border-slate-300'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              readOnly
                              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer pointer-events-none"
                            />
                            <span>{permLabel}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-extrabold shadow-md hover:bg-indigo-700 active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>Guardar Permisos</span>
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default UserPermissionsModal;
