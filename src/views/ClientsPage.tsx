'use client';

import React, { useEffect, useState } from 'react';
import { Client, Workspace, User, PaginationMeta } from '../types';

import crmService from '../services/crmService';
import userService from '../services/userService';
import { workspaceMetaService } from '../services/workspaceMetaService';
import { agencyCustomFieldService, AgencyCustomField } from '../services/agencyCustomFieldService';
import { AgencyCustomFieldsModal } from '../components/AgencyCustomFieldsModal';
import { Users, Plus, Search, Mail, Phone, Edit3, Trash2, Info, Filter, Layers, UserCheck, ChevronLeft, ChevronRight, Sliders, Calendar, CheckSquare } from 'lucide-react';
import { TableSkeleton } from '@/components/Skeleton';
import { LeadCampaignDetailsModal } from '@/components/LeadCampaignDetailsModal';
import Portal from '../components/Portal';

import { confirmDialog } from '../utils/alerts';
import { useAuth } from '../context/AuthContext';

export const ClientsPage: React.FC = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin' || user?.roles?.some(r => r.name === 'super_admin');
  const isAdmin = user?.role === 'admin' || user?.roles?.some(r => r.name === 'admin');
  const userPermNames = user?.permissions?.map(p => p.name) || [];

  const canCreateClients = isSuperAdmin || isAdmin || userPermNames.includes('clients.create') || userPermNames.includes('clients.create_clients');
  const canEditClients = isSuperAdmin || isAdmin || userPermNames.includes('clients.edit') || userPermNames.includes('clients.edit_clients');
  const canDeleteClients = isSuperAdmin || isAdmin || userPermNames.includes('clients.delete') || userPermNames.includes('clients.delete_clients');
  const [clients, setClients] = useState<Client[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [agencyCustomFields, setAgencyCustomFields] = useState<AgencyCustomField[]>([]);
  const [isCustomFieldsModalOpen, setIsCustomFieldsModalOpen] = useState<boolean>(false);

  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>('');
  const [selectedAssignedUserId, setSelectedAssignedUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [selectedClientForDetails, setSelectedClientForDetails] = useState<Client | null>(null);
  const [isLeadCampaignModalOpen, setIsLeadCampaignModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [pagination, setPagination] = useState<PaginationMeta>({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: 0,
    to: 0,
  });
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    city: '',
    country: 'Ecuador',
    classification: '',
    workspace_id: '',
    assigned_user_id: '',
  });

  const [customFieldsData, setCustomFieldsData] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchWorkspaces();
    fetchUsers();
    fetchAgencyCustomFields();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, selectedWorkspaceId, selectedAssignedUserId]);

  useEffect(() => {
    fetchClients();
  }, [page, perPage, search, selectedWorkspaceId, selectedAssignedUserId]);

  const fetchAgencyCustomFields = async () => {
    try {
      const data = await agencyCustomFieldService.getFields(undefined, true);
      setAgencyCustomFields(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching agency custom fields:', err);
    }
  };

  const fetchWorkspaces = async () => {
    try {
      const data = await workspaceMetaService.getWorkspaces();
      setWorkspaces(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching workspaces:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await userService.getUsers();
      const userList = Array.isArray(res) ? res : (res.data?.data || res.data || []);
      setUsers(userList);
    } catch (err) {
      console.error('Error fetching users/agents:', err);
    }
  };

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, any> = {
        page,
        per_page: perPage,
      };
      if (search) params.search = search;
      if (selectedWorkspaceId) params.workspace_id = selectedWorkspaceId;
      if (selectedAssignedUserId) params.assigned_user_id = selectedAssignedUserId;

      const res = await crmService.getClients(params);
      if (res && res.data) {
        setClients(res.data);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      } else if (Array.isArray(res)) {
        setClients(res);
        setPagination({
          current_page: 1,
          last_page: 1,
          per_page: (res as any).length || 15,
          total: (res as any).length,
          from: (res as any).length ? 1 : 0,
          to: (res as any).length,
        });
      }
    } catch (err) {
      console.error('Error fetching clients:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingClient(null);
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      city: '',
      country: 'Ecuador',
      classification: '',
      workspace_id: selectedWorkspaceId || '',
      assigned_user_id: '',
    });
    setCustomFieldsData({});
    setShowModal(true);
  };

  const handleOpenEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      first_name: client.first_name || (client as any).name || '',
      last_name: client.last_name || '',
      email: client.email || '',
      phone: client.phone || '',
      city: client.city || '',
      country: client.country || 'Ecuador',
      classification: client.classification || '',
      workspace_id: client.workspace_id ? String(client.workspace_id) : '',
      assigned_user_id: (client as any).assigned_to ? String((client as any).assigned_to) : (client.assigned_user_id ? String(client.assigned_user_id) : ''),
    });
    setCustomFieldsData((client as any).custom_fields || {});
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        ...formData,
        custom_fields: customFieldsData,
        workspace_id: formData.workspace_id ? Number(formData.workspace_id) : undefined,
        assigned_user_id: formData.assigned_user_id ? Number(formData.assigned_user_id) : undefined,
        assigned_to: formData.assigned_user_id ? Number(formData.assigned_user_id) : undefined,
      };

      if (editingClient) {
        await crmService.updateClient(editingClient.id, payload);
      } else {
        await crmService.createClient(payload);
      }
      setShowModal(false);
      fetchClients();
    } catch (err) {
      console.error('Error saving client:', err);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = await confirmDialog({
      title: '¿Eliminar cliente?',
      text: 'El registro del cliente será removido del directorio.',
      confirmButtonText: 'Sí, eliminar',
    });
    if (!confirmed) return;
    try {
      await crmService.deleteClient(id);
      setClients(clients.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error deleting client:', err);
    }
  };

  const getClientDisplayName = (c: Client) => {
    if ((c as any).name && (c as any).name.trim() !== '') {
      return (c as any).name;
    }
    const full = `${c.first_name || ''} ${c.last_name || ''}`.trim();
    return full || 'Cliente Sin Nombre';
  };

  const getInitials = (nameStr: string) => {
    const parts = nameStr.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return nameStr.substring(0, 2).toUpperCase() || 'CL';
  };

  const handleCustomFieldChange = (key: string, val: any) => {
    setCustomFieldsData((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-blue-600" />
            Directorio de Clientes
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Gestión centralizada de clientes, asignación de asesores y campos personalizados por agencia.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Configure Custom Fields for Agency */}
          {(isSuperAdmin || isAdmin) && (
            <button
              onClick={() => setIsCustomFieldsModalOpen(true)}
              className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center gap-2 border border-slate-200 dark:border-slate-700"
            >
              <Sliders className="w-4 h-4 text-indigo-500" />
              <span>Campos Personalizados ({agencyCustomFields.length})</span>
            </button>
          )}

          {canCreateClients && (
            <button
              onClick={handleOpenCreate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Cliente</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center gap-4">
        
        {/* Search Input */}
        <div className="flex-1 flex items-center bg-slate-50 dark:bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 w-full">
          <Search className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, email, teléfono, empresa o notas..."
            className="w-full bg-transparent text-slate-900 dark:text-white text-sm focus:outline-none placeholder-slate-400 font-medium"
          />
        </div>

        {/* Workspace Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Layers className="w-4 h-4 text-blue-600 shrink-0" />
          <select
            value={selectedWorkspaceId}
            onChange={(e) => setSelectedWorkspaceId(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-56"
          >
            <option value="">🌐 Todos los Workspaces</option>
            {workspaces.map((ws) => (
              <option key={ws.id} value={ws.id}>
                🏢 {ws.name} (ID: #{ws.id})
              </option>
            ))}
          </select>
        </div>

        {/* Agent/Assigned User Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <select
            value={selectedAssignedUserId}
            onChange={(e) => setSelectedAssignedUserId(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full md:w-56"
          >
            <option value="">👤 Todos los Asesores</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                👤 {u.name} (ID: #{u.id})
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Data Table Container */}
      {isLoading ? (
        <TableSkeleton rows={6} />
      ) : clients.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
          <Users className="w-12 h-12 text-slate-400 mx-auto stroke-[1.5]" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No se encontraron clientes
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {selectedWorkspaceId || selectedAssignedUserId
              ? 'No hay clientes registrados con los filtros seleccionados.' 
              : 'Registra un nuevo cliente haciendo clic en "Agregar Cliente".'}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Workspace</th>
                  <th className="px-6 py-4">Asesor Asignado</th>
                  <th className="px-6 py-4">Contacto</th>
                  <th className="px-6 py-4">Campos Personalizados</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {clients.map((c) => {
                  const displayName = getClientDisplayName(c);
                  const assignedUser = (c as any).assigned_user || (c as any).assignedUser;
                  const cFields = (c as any).custom_fields || {};
                  const hasCustomData = Object.keys(cFields).length > 0;

                  return (
                    <tr 
                      key={c.id} 
                      className="group transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-850 border-l-4 border-transparent hover:border-l-blue-600"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs shrink-0">
                            {getInitials(displayName)}
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                              {displayName}
                            </p>
                            <p className="text-xs text-slate-400 font-medium">ID: #{c.id}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-[11px] border border-slate-200 dark:border-slate-700 inline-flex items-center gap-1">
                          <Layers className="w-3 h-3 text-blue-500" />
                          {c.workspace?.name || `Workspace #${c.workspace_id || 'G'}`}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {assignedUser ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-extrabold text-[11px] border border-emerald-200 dark:border-emerald-800 inline-flex items-center gap-1">
                            <UserCheck className="w-3 h-3 text-emerald-500" />
                            {assignedUser.name}
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-slate-400">Sin Asignar</span>
                        )}
                      </td>

                      <td className="px-6 py-4 space-y-1">
                        {c.email && (
                          <p className="text-xs font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            {c.email}
                          </p>
                        )}
                        {c.phone && (
                          <p className="text-xs font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {c.phone}
                          </p>
                        )}
                      </td>

                      {/* Dynamic Agency Custom Fields display */}
                      <td className="px-6 py-4">
                        {hasCustomData ? (
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {Object.entries(cFields).map(([key, val]) => {
                              const matchingField = agencyCustomFields.find((f) => f.field_key === key);
                              const label = matchingField ? matchingField.label : key;
                              return (
                                <span
                                  key={key}
                                  className="px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold"
                                >
                                  {label}: {String(val)}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-slate-400">Sin datos extra</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedClientForDetails(c);
                              setIsLeadCampaignModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Ver Campaña Meta / Detalles"
                          >
                            <Info className="w-4 h-4" />
                          </button>

                          {canEditClients && (
                            <button
                              onClick={() => handleOpenEdit(c)}
                              className="p-1.5 text-slate-400 hover:text-amber-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Editar cliente"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          )}

                          {canDeleteClients && (
                            <button
                              onClick={() => handleDelete(c.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Eliminar cliente"
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

          {/* Pagination Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
            <div className="flex items-center gap-4">
              <span>
                Mostrando {pagination.from || 0} a {pagination.to || 0} de {pagination.total || 0} clientes
              </span>
              <div className="flex items-center gap-1.5">
                <span>Mostrar:</span>
                <select
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(Number(e.target.value));
                    setPage(1);
                  }}
                  className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-slate-400">por pág.</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>

              <span className="font-bold text-slate-800 dark:text-white px-2">
                Página {pagination.current_page} de {pagination.last_page || 1}
              </span>

              <button
                disabled={page >= pagination.last_page}
                onClick={() => setPage((p) => Math.min(p + 1, pagination.last_page))}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear / Editar Cliente */}
      {showModal && (
        <Portal>
          <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-4 sm:p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-xs font-bold text-slate-400 hover:text-slate-600">
                  Cancelar
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    placeholder="Ej. Juan Pérez"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="juan@ejemplo.com"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">Teléfono</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+593 99 123 4567"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">Ciudad</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Quito, Guayaquil..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">País</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">Asesor / Usuario Responsable</label>
                  <select
                    value={formData.assigned_user_id}
                    onChange={(e) => setFormData({ ...formData, assigned_user_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="">-- Sin Asignar (General) --</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>👤 {u.name} ({u.email})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">Workspace</label>
                  <select
                    value={formData.workspace_id}
                    onChange={(e) => setFormData({ ...formData, workspace_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="">Seleccionar Workspace...</option>
                    {workspaces.map((ws) => (
                      <option key={ws.id} value={ws.id}>{ws.name} (ID: #{ws.id})</option>
                    ))}
                  </select>
                </div>

                {/* DYNAMIC AGENCY CUSTOM FIELDS SECTION */}
                {agencyCustomFields.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <h4 className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5" />
                      Campos Personalizados de la Agencia
                    </h4>

                    <div className="space-y-3">
                      {agencyCustomFields.map((field) => {
                        const val = customFieldsData[field.field_key] ?? '';

                        if (field.type === 'select') {
                          const opts = Array.isArray(field.options) ? field.options : [];
                          return (
                            <div key={field.id}>
                              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                                {field.label} {field.is_required && '*'}
                              </label>
                              <select
                                required={field.is_required}
                                value={val}
                                onChange={(e) => handleCustomFieldChange(field.field_key, e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white"
                              >
                                <option value="">-- Seleccionar {field.label} --</option>
                                {opts.map((o) => (
                                  <option key={o} value={o}>
                                    {o}
                                  </option>
                                ))}
                              </select>
                            </div>
                          );
                        }

                        if (field.type === 'boolean') {
                          return (
                            <div key={field.id} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`check_${field.field_key}`}
                                checked={!!val}
                                onChange={(e) => handleCustomFieldChange(field.field_key, e.target.checked)}
                                className="rounded text-blue-600 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                              />
                              <label htmlFor={`check_${field.field_key}`} className="text-xs font-extrabold text-slate-700 dark:text-slate-300 cursor-pointer">
                                {field.label} {field.is_required && '*'}
                              </label>
                            </div>
                          );
                        }

                        if (field.type === 'textarea') {
                          return (
                            <div key={field.id}>
                              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                                {field.label} {field.is_required && '*'}
                              </label>
                              <textarea
                                rows={2}
                                required={field.is_required}
                                value={val}
                                onChange={(e) => handleCustomFieldChange(field.field_key, e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white"
                              />
                            </div>
                          );
                        }

                        return (
                          <div key={field.id}>
                            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                              {field.label} {field.is_required && '*'}
                            </label>
                            <input
                              type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                              required={field.is_required}
                              value={val}
                              onChange={(e) => handleCustomFieldChange(field.field_key, e.target.value)}
                              placeholder={`Ingrese ${field.label}...`}
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm"
                  >
                    Guardar Cliente
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}

      {/* Modal Configurar Campos Personalizados de la Agencia */}
      <AgencyCustomFieldsModal
        isOpen={isCustomFieldsModalOpen}
        onClose={() => setIsCustomFieldsModalOpen(false)}
        onUpdated={fetchAgencyCustomFields}
      />

      {/* Modal Detalle Lead / Campaña */}
      {isLeadCampaignModalOpen && selectedClientForDetails && (
        <LeadCampaignDetailsModal
          isOpen={isLeadCampaignModalOpen}
          onClose={() => setIsLeadCampaignModalOpen(false)}
          client={selectedClientForDetails}
        />
      )}
    </div>
  );
};

export default ClientsPage;
