'use client';

import React, { useEffect, useState } from 'react';
import {
  Globe,
  Building2,
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  UserPlus,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Sparkles,
  Palette,
  Eye,
  RefreshCw,
  Layers,
} from 'lucide-react';
import { WhiteLabel } from '../../types/whiteLabel';
import { Plan } from '../../types';
import whiteLabelService from '../../services/whiteLabelService';
import adminService from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';
import Portal from '../../components/Portal';
import toast from 'react-hot-toast';

export const WhiteLabelsPage: React.FC = () => {
  const { user, startImpersonation } = useAuth();
  const [whiteLabels, setWhiteLabels] = useState<WhiteLabel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingWL, setEditingWL] = useState<WhiteLabel | null>(null);
  const [addingAdminWL, setAddingAdminWL] = useState<WhiteLabel | null>(null);
  const [addingAgencyWL, setAddingAgencyWL] = useState<WhiteLabel | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    legal_name: '',
    email: '',
    phone: '',
    logo: '',
    logo_file: null as File | null,
    favicon: '',
    favicon_file: null as File | null,
    primary_color: '#0284c7',
    secondary_color: '#0f172a',
    button_color: '#0284c7',
    custom_domain: '',
    seo_description: '',
    status: 'active' as 'active' | 'suspended',
    plan_id: null as number | null,
    admin_name: '',
    admin_email: '',
    admin_password: '',
    admin_phone: '',
    admin_photo_file: null as File | null,
    admin_photo_preview: null as string | null,
  });

  const [adminFormData, setAdminFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [agencyFormData, setAgencyFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    admin_name: '',
    admin_email: '',
    admin_password: '',
  });

  const fetchWhiteLabels = async () => {
    setIsLoading(true);
    try {
      const data = await whiteLabelService.getWhiteLabels({ search });
      setWhiteLabels(data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al cargar las Marcas Blancas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWhiteLabels();
  }, [search]);

  useEffect(() => {
    adminService.getPlans()
      .then(res => setPlans(Array.isArray(res) ? res : []))
      .catch(err => console.error('Error cargando planes para Marcas Blancas:', err));
  }, []);

  const handleCreateOrUpdateWL = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingWL) {
        await whiteLabelService.updateWhiteLabel(editingWL.id, formData);
        toast.success('Marca Blanca actualizada exitosamente');
      } else {
        await whiteLabelService.createWhiteLabel(formData);
        toast.success('Marca Blanca creada exitosamente');
      }
      setIsCreateModalOpen(false);
      setEditingWL(null);
      resetFormData();
      fetchWhiteLabels();
    } catch (err: any) {
      if (err?.response?.data?.errors) {
        const firstErr = Object.values(err.response.data.errors)[0];
        toast.error(Array.isArray(firstErr) ? firstErr[0] : (err?.response?.data?.message || 'Error en la validación'));
      } else {
        toast.error(err?.response?.data?.message || 'Error al guardar Marca Blanca');
      }
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addingAdminWL) return;
    try {
      await whiteLabelService.addAdmin(addingAdminWL.id, adminFormData);
      toast.success('Administrador de Marca Blanca asignado exitosamente');
      setAddingAdminWL(null);
      setAdminFormData({ name: '', email: '', password: '' });
      fetchWhiteLabels();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al asignar administrador');
    }
  };

  const handleAddAgency = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addingAgencyWL) return;
    try {
      await whiteLabelService.createAgency(addingAgencyWL.id, agencyFormData);
      toast.success('Agencia agregada a la Marca Blanca exitosamente');
      setAddingAgencyWL(null);
      setAgencyFormData({ name: '', email: '', phone: '', city: '', admin_name: '', admin_email: '', admin_password: '' });
      fetchWhiteLabels();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al agregar agencia');
    }
  };

  const handleDeleteWL = async (id: number) => {
    if (!confirm('¿Está seguro de eliminar esta Marca Blanca? Sus agencias se mantendrán registradas.')) return;
    try {
      await whiteLabelService.deleteWhiteLabel(id);
      toast.success('Marca Blanca eliminada exitosamente');
      fetchWhiteLabels();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al eliminar Marca Blanca');
    }
  };

  const handleImpersonateWL = async (wl: WhiteLabel) => {
    try {
      const res = await whiteLabelService.impersonate({ white_label_id: wl.id });
      if (res.token && res.user) {
        startImpersonation(res.token, res.user, { id: user!.id, name: user!.name, email: user!.email });
        toast.success(`Impersonación iniciada para ${wl.name}`);
      } else {
        toast.success(`Modo contexto activado para ${wl.name}`);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al iniciar impersonación');
    }
  };

  const resetFormData = () => {
    setFormData({
      name: '',
      slug: '',
      legal_name: '',
      email: '',
      phone: '',
      logo: '',
      logo_file: null,
      favicon: '',
      favicon_file: null,
      primary_color: '#0284c7',
      secondary_color: '#0f172a',
      button_color: '#0284c7',
      custom_domain: '',
      seo_description: '',
      status: 'active' as 'active' | 'suspended',
      plan_id: null,
      admin_name: '',
      admin_email: '',
      admin_password: '',
      admin_phone: '',
      admin_photo_file: null,
      admin_photo_preview: null,
    });
  };

  const openEditModal = (wl: WhiteLabel) => {
    setEditingWL(wl);
    setFormData({
      name: wl.name,
      slug: wl.slug,
      legal_name: wl.legal_name || '',
      email: wl.email,
      phone: wl.phone || '',
      logo: wl.logo || '',
      logo_file: null,
      favicon: wl.favicon || '',
      favicon_file: null,
      primary_color: wl.primary_color || '#0284c7',
      secondary_color: wl.secondary_color || '#0f172a',
      button_color: wl.button_color || '#0284c7',
      custom_domain: wl.custom_domain || '',
      seo_description: wl.seo_description || '',
      status: wl.status,
      plan_id: wl.plan_id || wl.plan?.id || null,
      admin_name: '',
      admin_email: '',
      admin_password: '',
      admin_phone: '',
      admin_photo_file: null,
      admin_photo_preview: null,
    });
    setIsCreateModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1">
              <Globe className="w-3 h-3" /> Arquitectura Multi-Tenant
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Gestión Global de Marcas Blancas (White Labels)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Administra las organizaciones independientes de la plataforma, agencias subordinadas y marca personalizada.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingWL(null);
            resetFormData();
            setIsCreateModalOpen(true);
          }}
          className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-2xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Marca Blanca</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar Marca Blanca por nombre, slug o correo..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          onClick={fetchWhiteLabels}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
          title="Recargar datos"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Table of White Labels */}
      {isLoading ? (
        <div className="py-16 text-center text-slate-400 font-bold text-xs">
          Cargando Marcas Blancas...
        </div>
      ) : whiteLabels.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
          <Globe className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">No se encontraron Marcas Blancas</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Crea la primera Marca Blanca para comenzar a agrupar agencias con su propia identidad.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">ID / Slug</th>
                  <th className="p-3.5">Marca Blanca</th>
                  <th className="p-3.5">Contacto / Dominio</th>
                  <th className="p-3.5 text-center">Agencias</th>
                  <th className="p-3.5 text-center">Admins</th>
                  <th className="p-3.5">Plan Asignado</th>
                  <th className="p-3.5">Estado</th>
                  <th className="p-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {whiteLabels.map((wl) => (
                  <tr key={wl.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-mono text-slate-500 font-bold">
                      <div>#{wl.id}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{wl.slug}</div>
                    </td>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" style={{ backgroundColor: wl.primary_color || '#0284c7' }} title="Color Primario" />
                        <div>
                          <div>{wl.name}</div>
                          {wl.legal_name && <div className="text-[10px] text-slate-400 font-normal">{wl.legal_name}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-mono text-slate-700 dark:text-slate-300">{wl.email}</div>
                      {wl.custom_domain ? (
                        <a href={`https://${wl.custom_domain}`} target="_blank" rel="noreferrer" className="text-[11px] text-blue-600 dark:text-blue-400 font-mono font-bold flex items-center gap-1 hover:underline">
                          <Globe className="w-3 h-3" /> {wl.custom_domain}
                        </a>
                      ) : (
                        <div className="text-[10px] text-slate-400 italic">Sin dominio personalizado</div>
                      )}
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 font-black text-slate-900 dark:text-white text-xs">
                        {wl.agencies?.length || 0}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 font-black text-slate-900 dark:text-white text-xs">
                        {wl.users?.length || 0}
                      </span>
                    </td>
                    <td className="p-3.5">
                      {wl.plan ? (
                        <span className="px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-extrabold text-[11px] border border-indigo-200 dark:border-indigo-800 flex items-center gap-1 w-fit">
                          <Layers className="w-3 h-3 text-indigo-500" />
                          {wl.plan.name}
                        </span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500 text-xs italic">Sin plan asignado</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${wl.status === 'active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'}`}>
                        {wl.status === 'active' ? 'Activa' : 'Suspendida'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleImpersonateWL(wl)}
                          className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-extrabold text-[11px] rounded-xl transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                          title="Suplantar Contexto White Label"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-400" />
                          <span className="hidden sm:inline">Suplantar</span>
                        </button>
                        <button
                          onClick={() => openEditModal(wl)}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold"
                          title="Editar Marca Blanca"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setAddingAdminWL(wl)}
                          className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-700 dark:text-blue-300 font-bold"
                          title="Agregar Administrador"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setAddingAgencyWL(wl)}
                          className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-700 dark:text-purple-300 font-bold"
                          title="Agregar Agencia"
                        >
                          <Building2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteWL(wl.id)}
                          className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 font-bold"
                          title="Eliminar Marca Blanca"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT WHITE LABEL MODAL */}
      {isCreateModalOpen && (
        <Portal>
          <div className="fixed inset-0 top-0 left-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-xl w-full p-6 shadow-2xl space-y-4 my-8">
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <Palette className="w-5 h-5 text-blue-600" />
                {editingWL ? 'Editar Marca Blanca (Branding & Configuración)' : 'Nueva Marca Blanca (White Label)'}
              </h2>

              <form onSubmit={handleCreateOrUpdateWL} className="space-y-4 text-xs font-bold">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1">Nombre Comercial *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ej. Empresa XYZ"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1">Slug (Identificador) *</label>
                    <input
                      type="text"
                      required
                      disabled={!!editingWL}
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="ej. empresa-xyz"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1">Correo de Contacto *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="contacto@empresaxyz.com"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1">Dominio Personalizado</label>
                    <input
                      type="text"
                      value={formData.custom_domain}
                      onChange={(e) => setFormData({ ...formData, custom_domain: e.target.value })}
                      placeholder="app.empresaxyz.com"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                {/* Plan Maestro de la Marca Blanca */}
                <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/20 rounded-2xl border border-indigo-200 dark:border-indigo-800/50">
                  <label className="block text-indigo-950 dark:text-indigo-200 font-extrabold text-xs mb-1 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    Plan Maestro Asignado (Módulos Contratados por la Marca Blanca)
                  </label>
                  <select
                    value={formData.plan_id ?? ''}
                    onChange={(e) => setFormData({ ...formData, plan_id: e.target.value ? Number(e.target.value) : null })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-xl text-slate-900 dark:text-white font-medium text-xs focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">-- Sin Plan Asignado (Todos los módulos disponibles) --</option>
                    {plans.map((p) => {
                      const permsCount = p.plan_permissions?.length ?? (p as any).planPermissions?.length ?? 0;
                      return (
                        <option key={p.id} value={p.id}>
                          {p.name} ({permsCount} permisos/módulos contratados)
                        </option>
                      );
                    })}
                  </select>
                  <p className="text-[11px] text-indigo-700/80 dark:text-indigo-300/80 mt-1">
                    Esta Marca Blanca y sus administradores solo tendrán acceso a los módulos definidos en este Plan, y solo podrán crear planes para sus agencias dentro de este alcance.
                  </p>
                </div>

                {/* SEO Description */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Descripción para SEO Meta Tag</label>
                  <textarea
                    rows={2}
                    value={formData.seo_description}
                    onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                    placeholder="Descripción comercial para buscadores e indexación SEO..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                {/* Logo and Favicon File Uploads */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Subir Logo (PNG/SVG)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setFormData({ ...formData, logo_file: e.target.files[0] });
                        }
                      }}
                      className="block w-full text-[11px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-blue-600 file:text-white cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Subir Favicon (.ico/.png)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setFormData({ ...formData, favicon_file: e.target.files[0] });
                        }
                      }}
                      className="block w-full text-[11px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-blue-600 file:text-white cursor-pointer"
                    />
                  </div>
                </div>

                {/* Branding Colors Section */}
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] uppercase font-mono font-extrabold text-blue-600 dark:text-blue-400">Configuración de Branding</span>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">Color Primario</label>
                      <input
                        type="color"
                        value={formData.primary_color}
                        onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                        className="w-full h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">Color Secundario</label>
                      <input
                        type="color"
                        value={formData.secondary_color}
                        onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                        className="w-full h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">Color Botones</label>
                      <input
                        type="color"
                        value={formData.button_color}
                        onChange={(e) => setFormData({ ...formData, button_color: e.target.value })}
                        className="w-full h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                    </div>
                  </div>
                </div>

                {/* Initial Admin User Credentials (Only for Create) */}
                {!editingWL && (
                  <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border border-blue-200 dark:border-blue-800/40 space-y-3">
                    <span className="text-[10px] uppercase font-mono font-extrabold text-blue-600 dark:text-blue-400">Datos Completos del Administrador Inicial</span>
                    
                    {/* Admin Photo */}
                    <div className="flex items-center gap-3 bg-white dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                      {formData.admin_photo_preview ? (
                        <img
                          src={formData.admin_photo_preview}
                          alt="Admin Preview"
                          className="w-11 h-11 rounded-xl object-cover border border-slate-300 shrink-0"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 font-bold flex items-center justify-center text-xs shrink-0 border border-blue-200 dark:border-blue-800">
                          Foto
                        </div>
                      )}
                      <div className="flex-1">
                        <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-1">Foto de Perfil del Admin</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              setFormData({
                                ...formData,
                                admin_photo_file: file,
                                admin_photo_preview: URL.createObjectURL(file),
                              });
                            }
                          }}
                          className="block w-full text-[10px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-blue-600 file:text-white cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-700 dark:text-slate-300 mb-1">Nombre Completo *</label>
                        <input
                          type="text"
                          required
                          value={formData.admin_name}
                          onChange={(e) => setFormData({ ...formData, admin_name: e.target.value })}
                          placeholder="Ej. Juan Pérez"
                          className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-700 dark:text-slate-300 mb-1">Correo Electrónico *</label>
                        <input
                          type="email"
                          required
                          value={formData.admin_email}
                          onChange={(e) => setFormData({ ...formData, admin_email: e.target.value })}
                          placeholder="admin@empresaxyz.com"
                          className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-700 dark:text-slate-300 mb-1">Contraseña de Acceso *</label>
                        <input
                          type="password"
                          required
                          value={formData.admin_password}
                          onChange={(e) => setFormData({ ...formData, admin_password: e.target.value })}
                          placeholder="••••••••"
                          className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-700 dark:text-slate-300 mb-1">Teléfono</label>
                        <input
                          type="text"
                          value={formData.admin_phone}
                          onChange={(e) => setFormData({ ...formData, admin_phone: e.target.value })}
                          placeholder="+593 99 999 9999"
                          className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-md transition-all"
                  >
                    {editingWL ? 'Guardar Cambios' : 'Crear Marca Blanca'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}

      {/* ADD ADMIN MODAL */}
      {addingAdminWL && (
        <Portal>
          <div className="fixed inset-0 top-0 left-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                Asignar Administrador a {addingAdminWL.name}
              </h3>

              <form onSubmit={handleAddAdmin} className="space-y-3 text-xs font-bold">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={adminFormData.name}
                    onChange={(e) => setAdminFormData({ ...adminFormData, name: e.target.value })}
                    placeholder="Ej. Carlos Mendoza"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Correo Electrónico (Login) *</label>
                  <input
                    type="email"
                    required
                    value={adminFormData.email}
                    onChange={(e) => setAdminFormData({ ...adminFormData, email: e.target.value })}
                    placeholder="carlos@empresaxyz.com"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Contraseña de Acceso</label>
                  <input
                    type="password"
                    value={adminFormData.password}
                    onChange={(e) => setAdminFormData({ ...adminFormData, password: e.target.value })}
                    placeholder="Dejar en blanco para clave por defecto"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setAddingAdminWL(null)}
                    className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-md transition-all"
                  >
                    Asignar Admin WL
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}

      {/* ADD AGENCY MODAL */}
      {addingAgencyWL && (
        <Portal>
          <div className="fixed inset-0 top-0 left-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-600" />
                Agregar Agencia a {addingAgencyWL.name}
              </h3>

              <form onSubmit={handleAddAgency} className="space-y-3 text-xs font-bold">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Nombre de la Agencia *</label>
                  <input
                    type="text"
                    required
                    value={agencyFormData.name}
                    onChange={(e) => setAgencyFormData({ ...agencyFormData, name: e.target.value })}
                    placeholder="Ej. Agencia Guatemala"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Correo de la Agencia *</label>
                  <input
                    type="email"
                    required
                    value={agencyFormData.email}
                    onChange={(e) => setAgencyFormData({ ...agencyFormData, email: e.target.value })}
                    placeholder="contacto@agenciaguatemala.com"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setAddingAgencyWL(null)}
                    className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl shadow-md transition-all"
                  >
                    Crear Agencia
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};

export default WhiteLabelsPage;
