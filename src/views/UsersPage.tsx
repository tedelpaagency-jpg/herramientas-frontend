'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { User, Agency } from '../types';
import { WhiteLabel } from '../types/whiteLabel';
import userService, { PasswordOptions } from '../services/userService';
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
  Mail,
  Send,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { TableSkeleton } from '@/components/Skeleton';
import SendCredentialsModal from '../components/SendCredentialsModal';
import { confirmDialog, showSuccessAlert } from '../utils/alerts';

export const UsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const isSuperAdmin = currentUser?.role === 'super_admin' || currentUser?.roles?.some(r => r.name === 'super_admin');
  const isGerenteComercial = currentUser?.role === 'gerente_comercial' || currentUser?.roles?.some(r => r.name === 'gerente_comercial');
  const isWhiteLabelAdmin = currentUser?.role === 'white_label_admin' || currentUser?.roles?.some(r => r.name === 'white_label_admin');
  const canFilterAgencies = isSuperAdmin || isGerenteComercial || isWhiteLabelAdmin;
  const isAgencyAdmin = !isSuperAdmin && !isWhiteLabelAdmin && !isGerenteComercial;

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

  // Selección múltiple y Modal de Envío de Credenciales
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
  const [credentialsMode, setCredentialsMode] = useState<'single' | 'batch' | 'all'>('single');
  const [targetUserForCredentials, setTargetUserForCredentials] = useState<User | null>(null);

  const handleOpenSingleCredentials = (u: User) => {
    setTargetUserForCredentials(u);
    setCredentialsMode('single');
    setIsCredentialsModalOpen(true);
  };

  const handleOpenBatchCredentials = () => {
    if (selectedUserIds.length === 0) return;
    setTargetUserForCredentials(null);
    setCredentialsMode('batch');
    setIsCredentialsModalOpen(true);
  };

  const handleOpenAllCredentials = () => {
    setTargetUserForCredentials(null);
    setCredentialsMode('all');
    setIsCredentialsModalOpen(true);
  };

  const handleConfirmSendCredentials = async (templateId: number, passwordOptions: PasswordOptions) => {
    try {
      if (credentialsMode === 'single' && targetUserForCredentials) {
        await userService.sendCredentials(targetUserForCredentials.id, templateId, passwordOptions);
        showSuccessAlert('Credenciales enviadas', `Se ha enviado el correo con credenciales a ${targetUserForCredentials.email}.`);
      } else if (credentialsMode === 'batch') {
        const res = await userService.batchSendCredentials(selectedUserIds, templateId, passwordOptions);
        const data = res?.data || res;

        if (data.job_dispatched) {
          toast.success(`El envío para los ${selectedUserIds.length} usuarios se ejecutará en segundo plano.`, { duration: 5000 });
        } else {
          const total = data.total ?? selectedUserIds.length;
          const updated = data.updated ?? total;
          const sent = data.sent ?? total;
          const failed = data.failed ?? 0;
          const failedUsers = data.failed_users || [];

          let messageHtml = `Total seleccionados: ${total}\nCredenciales actualizadas: ${updated}\nCorreos enviados: ${sent}\nCorreos con error: ${failed}`;
          if (failedUsers.length > 0) {
            messageHtml += '\n\nUsuarios con error:\n' + failedUsers.map((f: any) => `- ${f.email || f.name}: ${f.reason}`).join('\n');
          }

          if (failed > 0) {
            toast((t) => (
              <div className="text-xs space-y-1">
                <p className="font-bold">Resumen del Envío Masivo</p>
                <p>Total seleccionados: {total}</p>
                <p>Credenciales actualizadas: {updated}</p>
                <p>Correos enviados: {sent}</p>
                <p className="text-rose-600 font-semibold">Correos con error: {failed}</p>
                {failedUsers.length > 0 && (
                  <div className="mt-2 border-t pt-1 text-[11px] text-rose-700">
                    <p className="font-bold">Detalle de errores:</p>
                    {failedUsers.map((fu: any) => (
                      <p key={fu.id || fu.email}>• {fu.email || fu.name}: {fu.reason}</p>
                    ))}
                  </div>
                )}
              </div>
            ), { duration: 8000 });
          } else {
            showSuccessAlert('Credenciales enviadas', `Resumen:\nTotal seleccionados: ${total}\nCredenciales actualizadas: ${updated}\nCorreos enviados: ${sent}`);
          }
        }
        setSelectedUserIds([]);
      } else if (credentialsMode === 'all') {
        const res = await userService.sendCredentialsToAll(templateId, {
          role: roleFilter || undefined,
          agency_id: agencyFilter ? Number(agencyFilter) : undefined,
          white_label_id: whiteLabelFilter ? Number(whiteLabelFilter) : undefined,
        }, passwordOptions);
        toast.success(res.message || 'Se ha iniciado el proceso de envío a todos los usuarios.', { duration: 5000 });
      }
      setIsCredentialsModalOpen(false);
    } catch (err: any) {
      console.error('Error enviando credenciales:', err);
      toast.error(err.response?.data?.message || err.message || 'Error al enviar credenciales');
    }
  };

  const handleSelectAllOnPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const pageUserIds = users.map(u => u.id);
      setSelectedUserIds(Array.from(new Set([...selectedUserIds, ...pageUserIds])));
    } else {
      const pageUserIds = new Set(users.map(u => u.id));
      setSelectedUserIds(selectedUserIds.filter(id => !pageUserIds.has(id)));
    }
  };

  const handleToggleSelectRow = (userId: number) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds(selectedUserIds.filter(id => id !== userId));
    } else {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };

  const isAllPageSelected = users.length > 0 && users.every(u => selectedUserIds.includes(u.id));

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Directorio de Usuarios
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Administración de miembros, roles, agencias y estados de acceso.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {selectedUserIds.length > 0 && (
            <button
              onClick={handleOpenBatchCredentials}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20"
            >
              <Send className="w-4 h-4" />
              <span>Reenviar credenciales ({selectedUserIds.length})</span>
            </button>
          )}

          <button
            onClick={handleOpenAllCredentials}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
          >
            <Mail className="w-4 h-4 text-indigo-600" />
            <span>Enviar credenciales a todos</span>
          </button>

          <button
            onClick={handleCreate}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20"
          >
            <UserPlus className="w-4 h-4" />
            <span>Crear Usuario</span>
          </button>
        </div>
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
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Buscar por nombre, correo o teléfono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-xs text-slate-800 dark:text-slate-100 w-full placeholder-slate-400 dark:placeholder-slate-500 font-medium"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
          >
            <option value="">Todos los Roles</option>
            <option value="user">Agentes / Users</option>
            <option value="admin">Administradores de Agencia</option>
            {!isAgencyAdmin && (
              <>
                <option value="closer">Closers</option>
                <option value="gerente">Gerentes de Operaciones</option>
                <option value="gerente_comercial">Gerentes Comerciales</option>
                {isSuperAdmin && <option value="super_admin">Super Admins</option>}
              </>
            )}
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
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
          >
            <option value="">Todos los Estados</option>
            <option value="1">Activos</option>
            <option value="0">Inactivos</option>
          </select>

          {/* Trashed Checkbox */}
          <label className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer">
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
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={5} />
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-bold text-sm">No se encontraron usuarios</p>
            <p className="text-xs text-slate-400 mt-1">Ajuste los filtros o agregue un nuevo usuario.</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50 text-[11px] font-extrabold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                  <th className="py-3 sm:py-3.5 px-3 sm:px-4 md:px-6 w-10">
                    <input
                      type="checkbox"
                      checked={isAllPageSelected}
                      onChange={handleSelectAllOnPage}
                      className="w-4 h-4 text-blue-600 rounded-xs focus:ring-blue-500 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 sm:py-3.5 px-3 sm:px-4 md:px-6 whitespace-nowrap">Usuario</th>
                  <th className="py-3 sm:py-3.5 px-3 sm:px-4 md:px-6 whitespace-nowrap">Rol</th>
                  <th className="py-3 sm:py-3.5 px-3 sm:px-4 md:px-6 whitespace-nowrap">Agencia</th>
                  <th className="py-3 sm:py-3.5 px-3 sm:px-4 md:px-6 whitespace-nowrap">Teléfono</th>
                  <th className="py-3 sm:py-3.5 px-3 sm:px-4 md:px-6 whitespace-nowrap">Estado</th>
                  <th className="py-3 sm:py-3.5 px-3 sm:px-4 md:px-6 text-right whitespace-nowrap">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-300">
                {users.map((u) => {
                  const isDeleted = Boolean(u.deleted_at);
                  const roleName = u.role || (u.roles?.[0]?.name ?? 'user');

                  return (
                    <tr key={u.id} className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${isDeleted ? 'bg-rose-50/30 dark:bg-rose-950/20' : ''}`}>
                      <td className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 w-10">
                        <input
                          type="checkbox"
                          checked={selectedUserIds.includes(u.id)}
                          onChange={() => handleToggleSelectRow(u.id)}
                          className="w-4 h-4 text-blue-600 rounded-xs focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 sm:py-4 px-3 sm:px-4 md:px-6">
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
                            <p className="font-bold text-slate-900 dark:text-slate-100 text-xs flex items-center gap-1.5 whitespace-nowrap">
                              {u.name}
                              {isDeleted && <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-rose-100 text-rose-700 rounded-xs">Eliminado</span>}
                            </p>
                            <p className="text-[11px] text-slate-500 font-medium whitespace-nowrap">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 whitespace-nowrap">
                        {getRoleBadge(roleName)}
                      </td>
                      <td className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-medium">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          <span>{u.agency?.name || 'Sin Agencia'}</span>
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-slate-600 font-mono whitespace-nowrap">
                        {u.phone || '—'}
                      </td>
                      <td className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 whitespace-nowrap">
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
                      <td className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 text-right whitespace-nowrap">
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
                                onClick={() => handleOpenSingleCredentials(u)}
                                title="Reenviar Credenciales de Acceso"
                                className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                              >
                                <Mail className="w-4 h-4" />
                              </button>
                              <Link
                                href={`/users/${u.id}/permissions`}
                                title="Gestionar Permisos Granulares"
                                className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                              >
                                <Key className="w-4 h-4" />
                              </Link>
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
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Página {pagination.current_page} de {pagination.last_page} ({pagination.total} usuarios)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={pagination.current_page === 1}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(p => Math.min(pagination.last_page, p + 1))}
                disabled={pagination.current_page === pagination.last_page}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
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

      {/* Modal de Envío / Reenvío de Credenciales */}
      <SendCredentialsModal
        isOpen={isCredentialsModalOpen}
        onClose={() => setIsCredentialsModalOpen(false)}
        targetMode={credentialsMode}
        targetUser={targetUserForCredentials}
        selectedCount={selectedUserIds.length}
        totalCount={pagination.total}
        onConfirm={handleConfirmSendCredentials}
      />
    </div>
  );
};

export default UsersPage;
