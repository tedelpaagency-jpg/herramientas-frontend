'use client';

import React, { useEffect, useState } from 'react';
import { User, Agency } from '../types';
import { WhiteLabel } from '../types/whiteLabel';
import userService from '../services/userService';
import adminService from '../services/adminService';
import whiteLabelService from '../services/whiteLabelService';
import { useAuth } from '../context/AuthContext';
import UserFormModal from '../components/UserFormModal';
import UserPermissionsModal from '../components/UserPermissionsModal';
import {
  Users,
  UserPlus,
  Search,
  Edit3,
  Trash2,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Building,
  Filter,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Key,
} from 'lucide-react';
import { TableSkeleton } from '@/components/Skeleton';

import { confirmDialog } from '../utils/alerts';

export const UsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const isSuperAdmin = currentUser?.role === 'super_admin' || currentUser?.roles?.some(r => r.name === 'super_admin');
  const isGerenteComercial = currentUser?.role === 'gerente_comercial' || currentUser?.roles?.some(r => r.name === 'gerente_comercial');
  const isWhiteLabelAdmin = currentUser?.role === 'white_label_admin' || currentUser?.roles?.some(r => r.name === 'white_label_admin');
  const canFilterAgencies = isSuperAdmin || isGerenteComercial || isWhiteLabelAdmin;

  const [users, setUsers] = useState<User[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [agencyFilter, setAgencyFilter] = useState<number | ''>('');
  const [whiteLabelFilter, setWhiteLabelFilter] = useState<number | ''>('');
  const [whiteLabels, setWhiteLabels] = useState<WhiteLabel[]>([]);
  const [statusFilter, setStatusFilter] = useState<number | ''>('');
  const [withTrashed, setWithTrashed] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await userService.getUsers({
        search,
        role: roleFilter || undefined,
        agency_id: agencyFilter ? Number(agencyFilter) : undefined,
        white_label_id: whiteLabelFilter ? Number(whiteLabelFilter) : undefined,
        status: statusFilter !== '' ? Number(statusFilter) : undefined,
        with_trashed: withTrashed,
        page,
      });

      const userArray = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.data?.data)
            ? res.data.data
            : [];

      setUsers(userArray);

      const pageObj = res?.data && typeof res.data === 'object' && !Array.isArray(res.data) ? res.data : res;
      setPagination({
        current_page: pageObj?.current_page || 1,
        last_page: pageObj?.last_page || 1,
        total: pageObj?.total || userArray.length,
      });
    } catch (err: any) {
      console.error('Error al cargar usuarios:', err);
      const msg = err.response?.data?.message || err.message || 'Error al conectar con el servidor para obtener los usuarios.';
      const requestUrl = `${err.config?.baseURL || ''}${err.config?.url || ''}`;
      setError(`${msg} [Petición: ${requestUrl}]`);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search, roleFilter, agencyFilter, whiteLabelFilter, statusFilter, withTrashed]);

  useEffect(() => {
    if (canFilterAgencies) {
      adminService.getAgencies()
        .then(data => setAgencies(data))
        .catch(err => console.error('Error cargando agencias:', err));
    }
    if (isSuperAdmin) {
      whiteLabelService.getWhiteLabels()
        .then(res => setWhiteLabels(Array.isArray(res) ? res : res?.data || []))
        .catch(err => console.error('Error cargando Marcas Blancas:', err));
    }
  }, [canFilterAgencies, isSuperAdmin]);

  const handleCreate = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (u: User) => {
    setSelectedUser(u);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (u: User) => {
    try {
      await userService.toggleStatus(u.id);
      fetchUsers();
    } catch (err) {
      console.error('Error cambiando estado:', err);
    }
  };

  const handleDelete = async (u: User) => {
    const confirmed = await confirmDialog({
      title: '¿Eliminar usuario?',
      text: `Se inactivará lógicamente al usuario "${u.name}".`,
      confirmButtonText: 'Sí, eliminar',
    });
    if (!confirmed) return;
    try {
      await userService.deleteUser(u.id);
      fetchUsers();
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
    }
  };

  const handleRestore = async (u: User) => {
    try {
      await userService.restoreUser(u.id);
      fetchUsers();
    } catch (err) {
      console.error('Error al restaurar usuario:', err);
    }
  };

  // Modal de Permisos CRUD Granulares
  const [permissionsUser, setPermissionsUser] = useState<User | null>(null);

  const getRoleBadge = (roleName?: string) => {
    switch (roleName) {
      case 'super_admin':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">Super Admin</span>;
      case 'gerente_comercial':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200">Gerente Comercial</span>;
      case 'admin':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">Admin Agencia</span>;
      case 'gerente':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-purple-50 text-purple-700 border border-purple-200">Gerente</span>;
      case 'closer':
      case 'closers':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">Closer (Leads Asignados)</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200">Agente / User</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Directorio de Usuarios
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Administración de miembros, roles, agencias y estados de acceso.
            </p>
          </div>
        </div>

        <button
          onClick={handleCreate}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20"
        >
          <UserPlus className="w-4 h-4" />
          <span>Crear Usuario</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={fetchUsers}
            className="px-3 py-1 bg-rose-600 text-white rounded-lg font-bold text-xs hover:bg-rose-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Control Bar: Búsqueda y Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-4 py-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Buscar por nombre, correo o teléfono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-xs text-slate-800 w-full placeholder-slate-400 font-medium"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
          >
            <option value="">Todos los Roles</option>
            <option value="user">Agentes / Users</option>
            <option value="admin">Administradores de Agencia</option>
            <option value="gerente">Gerentes de Operaciones</option>
            <option value="gerente_comercial">Gerentes Comerciales</option>
            <option value="super_admin">Super Admins</option>
          </select>

          {/* Agency Filter */}
          {(isSuperAdmin || isGerenteComercial) && (
            <select
              value={agencyFilter}
              onChange={(e) => setAgencyFilter(e.target.value ? Number(e.target.value) : '')}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/20 max-w-[180px] truncate"
            >
              <option value="">Todas las Agencias</option>
              {agencies.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          )}

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value !== '' ? Number(e.target.value) : '')}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
          >
            <option value="">Todos los Estados</option>
            <option value="1">Activos</option>
            <option value="0">Inactivos</option>
          </select>

          {/* Trashed Checkbox */}
          <label className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={withTrashed}
              onChange={(e) => setWithTrashed(e.target.checked)}
              className="w-3.5 h-3.5 text-blue-600 rounded-xs focus:ring-blue-500"
            />
            <span>Papelera</span>
          </label>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={5} />
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-bold text-sm">No se encontraron usuarios</p>
            <p className="text-xs text-slate-400 mt-1">Ajuste los filtros o agregue un nuevo usuario.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
                  <th className="py-3.5 px-6">Usuario</th>
                  <th className="py-3.5 px-6">Rol</th>
                  <th className="py-3.5 px-6">Agencia</th>
                  <th className="py-3.5 px-6">Teléfono</th>
                  <th className="py-3.5 px-6">Estado</th>
                  <th className="py-3.5 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {users.map((u) => {
                  const isDeleted = Boolean(u.deleted_at);
                  const roleName = u.role || (u.roles?.[0]?.name ?? 'user');

                  return (
                    <tr key={u.id} className={`hover:bg-slate-50/80 transition-colors ${isDeleted ? 'bg-rose-50/30' : ''}`}>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {u.photo ? (
                            <img
                              src={u.photo}
                              alt={u.name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
                              {u.name ? u.name.substring(0, 2).toUpperCase() : 'U'}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                              {u.name}
                              {isDeleted && <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-rose-100 text-rose-700 rounded-xs">Eliminado</span>}
                            </p>
                            <p className="text-[11px] text-slate-500 font-medium">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {getRoleBadge(roleName)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          <span>{u.agency?.name || 'Sin Agencia'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-600 font-mono">
                        {u.phone || '—'}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleToggleStatus(u)}
                          disabled={isDeleted}
                          className="cursor-pointer"
                        >
                          {u.status === 1 ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" /> Activo
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-600 border border-slate-200">
                              <XCircle className="w-3 h-3" /> Inactivo
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isDeleted ? (
                            <button
                              onClick={() => handleRestore(u)}
                              title="Restaurar Usuario"
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => setPermissionsUser(u)}
                                title="Gestionar Permisos CRUD Granulares"
                                className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                              >
                                <Key className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEdit(u)}
                                title="Editar Usuario"
                                className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(u)}
                                title="Eliminación Lógica (Soft Delete)"
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
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

        {/* Pagination Footer */}
        {pagination.last_page > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Página {pagination.current_page} de {pagination.last_page} ({pagination.total} usuarios)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={pagination.current_page === 1}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(p => Math.min(pagination.last_page, p + 1))}
                disabled={pagination.current_page === pagination.last_page}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Formulario de Usuario */}
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchUsers}
        userToEdit={selectedUser}
      />

      {/* Modal de Permisos CRUD Granulares por Usuario */}
      {permissionsUser && (
        <UserPermissionsModal
          user={permissionsUser}
          isOpen={!!permissionsUser}
          onClose={() => setPermissionsUser(null)}
          onSuccess={fetchUsers}
        />
      )}
    </div>
  );
};

export default UsersPage;
