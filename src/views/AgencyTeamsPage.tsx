'use client';

import React, { useEffect, useState } from 'react';
import { 
  Users, Plus, Search, RefreshCw, UserCheck, Crown, Edit3, Trash2, Loader2, AlertCircle, Percent
} from 'lucide-react';
import teamService from '../services/teamService';
import apiClient from '../services/apiClient';
import { AgencyTeam } from '../types/travelReport';
import toast from 'react-hot-toast';

interface UserSimple {
  id: number;
  name: string;
  email: string;
  role?: string;
}

export const AgencyTeamsPage: React.FC = () => {
  const [teams, setTeams] = useState<AgencyTeam[]>([]);
  const [users, setUsers] = useState<UserSimple[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [editingTeam, setEditingTeam] = useState<AgencyTeam | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [leaderId, setLeaderId] = useState<string>('');
  const [adminId, setAdminId] = useState<string>('');
  const [commAgent, setCommAgent] = useState<string>('70');
  const [commGerente, setCommGerente] = useState<string>('0');
  const [commDirector, setCommDirector] = useState<string>('0');
  const [commEmpresa, setCommEmpresa] = useState<string>('0');

  const fetchTeamsAndUsers = async () => {
    setLoading(true);
    try {
      const [teamsRes, usersRes] = await Promise.all([
        teamService.getTeams(undefined, search),
        apiClient.get('/v1/users'),
      ]);

      if (teamsRes.status === 'success') {
        setTeams(teamsRes.data || []);
      }

      // Estraer array de usuarios con seguridad
      const rawUserArray = Array.isArray(usersRes.data?.data?.data)
        ? usersRes.data.data.data
        : Array.isArray(usersRes.data?.data)
        ? usersRes.data.data
        : Array.isArray(usersRes.data)
        ? usersRes.data
        : [];

      setUsers(rawUserArray);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al cargar equipos de la agencia');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamsAndUsers();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingTeam(null);
    setName('');
    setDescription('');
    setLeaderId('');
    setAdminId('');
    setCommAgent('70');
    setCommGerente('0');
    setCommDirector('0');
    setCommEmpresa('0');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (team: AgencyTeam) => {
    setEditingTeam(team);
    setName(team.name);
    setDescription(team.description || '');
    setLeaderId(team.leader_id?.toString() || '');
    setAdminId(team.admin_id?.toString() || '');
    setCommAgent(team.commition_percent?.toString() || '70');
    setCommGerente(team.gerent_commition_percent?.toString() || '0');
    setCommDirector(team.director_commition_percent?.toString() || '0');
    setCommEmpresa(team.empresa_commition_percent?.toString() || '0');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('El nombre del equipo es obligatorio');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name,
        description,
        leader_id: leaderId ? parseInt(leaderId) : null,
        admin_id: adminId ? parseInt(adminId) : null,
        commition_percent: parseFloat(commAgent) || 0,
        gerent_commition_percent: parseFloat(commGerente) || 0,
        director_commition_percent: parseFloat(commDirector) || 0,
        empresa_commition_percent: parseFloat(commEmpresa) || 0,
      };

      if (editingTeam) {
        const res = await teamService.updateTeam(editingTeam.id, payload);
        toast.success(res.message || 'Equipo actualizado correctamente');
      } else {
        const res = await teamService.createTeam(payload);
        toast.success(res.message || 'Equipo creado correctamente');
      }
      setIsModalOpen(false);
      fetchTeamsAndUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al guardar el equipo');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este equipo de trabajo?')) return;
    try {
      await teamService.deleteTeam(id);
      toast.success('Equipo eliminado correctamente');
      fetchTeamsAndUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al eliminar el equipo');
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest">
            <Users className="w-4 h-4" />
            <span>Gestión de Estructura Comercial</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Equipos de Trabajo & Comisiones por Rol
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Configura administradores, gerentes y repartición de comisiones (%) por equipo de trabajo.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-sm transition-all shadow-lg shadow-purple-600/30 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Nuevo Equipo</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar equipo por nombre..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold focus:outline-none"
          />
        </div>
        <button
          onClick={fetchTeamsAndUsers}
          className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Teams Table Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-purple-600 mb-3" />
            <p className="text-sm font-semibold">Cargando equipos comerciales...</p>
          </div>
        ) : teams.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No hay equipos registrados</h3>
            <p className="text-xs">Crea un equipo de trabajo para asignar administradores, gerentes y porcentajes de comisiones.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-[11px] font-black uppercase text-slate-400 tracking-wider">
                  <th className="py-4 px-6">Equipo / Agencia</th>
                  <th className="py-4 px-6">Gerente de Equipo</th>
                  <th className="py-4 px-6">Admin / Director</th>
                  <th className="py-4 px-6">% Comisiones (Agente / Gerente / Admin / Empresa)</th>
                  <th className="py-4 px-6">Miembros</th>
                  <th className="py-4 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-semibold">
                {teams.map((team) => (
                  <tr key={team.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 text-[11px]">
                          {team.agency?.name || 'Agencia'}
                        </span>
                        <span className="text-sm">{team.name}</span>
                      </div>
                      {team.description && (
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{team.description}</p>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                        <UserCheck className="w-4 h-4 text-purple-600 flex-shrink-0" />
                        <span className="font-bold">{team.leader?.name || 'Sin asignar'}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                        <Crown className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <span className="font-bold">{team.admin?.name || 'Sin asignar'}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-extrabold text-[11px]" title="Agente">
                          Agente: {team.commition_percent ?? 70}%
                        </span>
                        <span className="px-2 py-1 rounded-md bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-extrabold text-[11px]" title="Gerente">
                          Gerente: {team.gerent_commition_percent ?? 0}%
                        </span>
                        <span className="px-2 py-1 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-extrabold text-[11px]" title="Director">
                          Admin: {team.director_commition_percent ?? 0}%
                        </span>
                        <span className="px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold text-[11px]" title="Empresa">
                          Empresa: {team.empresa_commition_percent ?? 0}%
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-extrabold text-slate-500">
                        {team.members_count || team.members?.length || 0} Miembro(s)
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(team)}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition-colors"
                          title="Editar Equipo"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(team.id)}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 transition-colors"
                          title="Eliminar Equipo"
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

      {/* Modal for Create/Edit Team */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 max-w-2xl w-full space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {editingTeam ? 'Editar Equipo y Comisiones' : 'Nuevo Equipo Comercial'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase">Nombre del Equipo *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Equipo Asesores VIP Norte"
                    className="w-full mt-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-2xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase">Gerente de Equipo</label>
                  <select
                    value={leaderId}
                    onChange={(e) => setLeaderId(e.target.value)}
                    className="w-full mt-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-2xl text-xs font-bold"
                  >
                    <option value="">-- Seleccionar Gerente --</option>
                    {Array.isArray(users) && users.map((u) => (
                      <option key={u.id} value={u.id}>{u.name} ({u.role || 'Usuario'})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase">Administrador / Director</label>
                  <select
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    className="w-full mt-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-2xl text-xs font-bold"
                  >
                    <option value="">-- Seleccionar Administrador --</option>
                    {Array.isArray(users) && users.map((u) => (
                      <option key={u.id} value={u.id}>{u.name} ({u.role || 'Usuario'})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase">Descripción</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descripción o meta del equipo..."
                    className="w-full mt-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-2xl text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Commission Rates Config Section */}
              <div className="p-4 bg-purple-50/50 dark:bg-purple-950/30 rounded-2xl border border-purple-100 dark:border-purple-900 space-y-4">
                <h4 className="text-xs font-black uppercase text-purple-700 dark:text-purple-300 tracking-wider flex items-center gap-1.5">
                  <Percent className="w-4 h-4" />
                  <span>Configuración de Porcentajes de Comisión por Rol (%)</span>
                </h4>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Agente (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={commAgent}
                      onChange={(e) => setCommAgent(e.target.value)}
                      className="w-full mt-1 p-2.5 bg-white dark:bg-slate-900 border rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Gerente (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={commGerente}
                      onChange={(e) => setCommGerente(e.target.value)}
                      className="w-full mt-1 p-2.5 bg-white dark:bg-slate-900 border rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Director (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={commDirector}
                      onChange={(e) => setCommDirector(e.target.value)}
                      className="w-full mt-1 p-2.5 bg-white dark:bg-slate-900 border rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Empresa (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={commEmpresa}
                      onChange={(e) => setCommEmpresa(e.target.value)}
                      className="w-full mt-1 p-2.5 bg-white dark:bg-slate-900 border rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border font-extrabold text-xs text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-md shadow-purple-600/30 flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingTeam ? 'Guardar Cambios' : 'Crear Equipo'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgencyTeamsPage;
