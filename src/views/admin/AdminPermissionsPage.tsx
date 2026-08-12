'use client';

import React, { useEffect, useState } from 'react';
import adminService from '../../services/adminService';
import { Permission } from '../../types';
import { KeyRound, Plus, Edit3, Trash2, Search, X, AlertCircle, CheckCircle2 } from 'lucide-react';

export const AdminPermissionsPage: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    guard_name: 'web',
  });

  const loadPermissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getPermissions();
      setPermissions(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar los permisos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPermissions();
  }, []);

  const openCreateModal = () => {
    setEditingPermission(null);
    setFormData({ name: '', guard_name: 'web' });
    setIsModalOpen(true);
  };

  const openEditModal = (permission: Permission) => {
    setEditingPermission(permission);
    setFormData({
      name: permission.name,
      guard_name: permission.guard_name || 'web',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (editingPermission) {
        await adminService.updatePermission(editingPermission.id, formData);
        setSuccess('Permiso actualizado con éxito.');
      } else {
        await adminService.createPermission(formData);
        setSuccess('Permiso creado con éxito.');
      }
      setIsModalOpen(false);
      loadPermissions();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar el permiso.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Desea eliminar este permiso del sistema?')) return;
    try {
      await adminService.deletePermission(id);
      setSuccess('Permiso eliminado.');
      loadPermissions();
    } catch (err: any) {
      setError('No se pudo eliminar el permiso.');
    }
  };

  const filteredPermissions = permissions.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.guard_name && p.guard_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Gestión de Permisos del Sistema
            </h1>
            <p className="text-xs text-slate-500 font-semibold">
              Administra las llaves de acceso y permisos globales (Spatie RBAC)
            </p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shadow-md shadow-amber-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Permiso</span>
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

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3 max-w-md">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar permisos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent text-xs font-medium outline-none text-slate-800 placeholder-slate-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs animate-pulse">
            Cargando lista de permisos...
          </div>
        ) : filteredPermissions.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No se encontraron permisos definidos.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">ID</th>
                  <th className="py-3.5 px-4">Nombre del Permiso</th>
                  <th className="py-3.5 px-4">Guard</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPermissions.map((perm) => (
                  <tr key={perm.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-400 font-bold">{perm.id}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
                        {perm.name}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {perm.guard_name || 'web'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(perm)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Editar"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(perm.id)}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-up-fade">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingPermission ? 'Editar Permiso' : 'Nuevo Permiso Global'}
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
                <label className="block font-bold text-slate-700 mb-1">Nombre del Permiso *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="ej. create_properties, view_reports"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-amber-500 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Guard Name *</label>
                <input
                  type="text"
                  required
                  value={formData.guard_name}
                  onChange={(e) => setFormData({ ...formData, guard_name: e.target.value })}
                  placeholder="web"
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
                  {editingPermission ? 'Guardar Cambios' : 'Crear Permiso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPermissionsPage;
