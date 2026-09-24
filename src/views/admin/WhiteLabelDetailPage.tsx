'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Globe,
  Building2,
  Users,
  ChevronLeft,
  Eye,
  Edit,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Palette,
  Layers,
  Mail,
  Phone,
  Calendar,
  ExternalLink,
  Info,
  Plus,
} from 'lucide-react';
import { WhiteLabel } from '../../types/whiteLabel';
import whiteLabelService from '../../services/whiteLabelService';
import { useAuth } from '../../context/AuthContext';
import Portal from '../../components/Portal';
import toast from 'react-hot-toast';

export const WhiteLabelDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id ? Number(params.id) : null;
  const { user, startImpersonation } = useAuth();

  const [whiteLabel, setWhiteLabel] = useState<WhiteLabel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'agencies' | 'admins' | 'plan'>('overview');

  // Modals state
  const [isAgencyModalOpen, setIsAgencyModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Forms state
  const [agencyFormData, setAgencyFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    admin_name: '',
    admin_email: '',
    admin_password: '',
  });

  const [adminFormData, setAdminFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const fetchWhiteLabel = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await whiteLabelService.getWhiteLabel(id);
      setWhiteLabel(data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al cargar perfil de la Marca Blanca');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWhiteLabel();
  }, [id]);

  const handleImpersonate = async () => {
    if (!whiteLabel) return;
    try {
      const res = await whiteLabelService.impersonate({ white_label_id: whiteLabel.id });
      if (res.token && res.user) {
        startImpersonation(res.token, res.user, { id: user!.id, name: user!.name, email: user!.email });
        toast.success(`Impersonación iniciada para ${whiteLabel.name}`);
        router.push('/');
      } else {
        toast.success(`Modo contexto activado para ${whiteLabel.name}`);
        router.push('/');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al iniciar impersonación');
    }
  };

  const handleAddAgency = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whiteLabel) return;
    try {
      await whiteLabelService.createAgency(whiteLabel.id, agencyFormData);
      toast.success(`Agencia agregada exitosamente a ${whiteLabel.name}`);
      setIsAgencyModalOpen(false);
      setAgencyFormData({
        name: '',
        email: '',
        phone: '',
        city: '',
        admin_name: '',
        admin_email: '',
        admin_password: '',
      });
      fetchWhiteLabel();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al agregar agencia');
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whiteLabel) return;
    try {
      await whiteLabelService.addAdmin(whiteLabel.id, adminFormData);
      toast.success(`Administrador asignado exitosamente a ${whiteLabel.name}`);
      setIsAdminModalOpen(false);
      setAdminFormData({ name: '', email: '', password: '' });
      fetchWhiteLabel();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al asignar administrador');
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-slate-400 font-bold text-xs">
        Cargando perfil de la Marca Blanca...
      </div>
    );
  }

  if (!whiteLabel) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4">
        <Globe className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Marca Blanca no encontrada</h2>
        <button
          onClick={() => router.push('/admin/white-labels')}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          Volver a Marcas Blancas
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header / Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/admin/white-labels')}
          className="flex items-center gap-2 text-xs font-extrabold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Volver al directorio de Marcas Blancas</span>
        </button>

        <button
          onClick={handleImpersonate}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-extrabold text-xs rounded-2xl transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <Eye className="w-4 h-4 text-blue-400" />
          <span>Suplantar esta Marca Blanca</span>
        </button>
      </div>

      {/* Hero Profile Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        {/* Color Strip */}
        <div
          className="h-28 w-full relative p-6 flex items-end justify-between"
          style={{
            background: `linear-gradient(135deg, ${whiteLabel.primary_color || '#0284c7'} 0%, ${whiteLabel.secondary_color || '#0f172a'} 100%)`,
          }}
        >
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/40 text-white backdrop-blur-md">
            ID: #{whiteLabel.id} • {whiteLabel.slug}
          </span>
        </div>

        {/* Profile Card Header */}
        <div className="p-6 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10">
          <div className="flex items-end gap-4">
            <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-950 p-2 border-2 border-white dark:border-slate-800 shadow-xl overflow-hidden shrink-0 flex items-center justify-center">
              {whiteLabel.logo ? (
                <img src={whiteLabel.logo} alt={whiteLabel.name} className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full rounded-xl bg-blue-600 text-white font-black text-xl flex items-center justify-center">
                  {whiteLabel.name.substring(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            <div className="mb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {whiteLabel.name}
                </h1>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${whiteLabel.status === 'active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'}`}>
                  {whiteLabel.status === 'active' ? 'Activa' : 'Suspendida'}
                </span>
              </div>
              {whiteLabel.legal_name && (
                <p className="text-xs text-slate-500 font-medium">{whiteLabel.legal_name}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => router.push('/admin/white-labels')}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs hover:bg-slate-200"
            >
              Volver al Listado
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase">Agencias Afiliadas</p>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
              {whiteLabel.agencies?.length || 0}
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase">Administradores</p>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
              {whiteLabel.users?.length || 0}
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase">Plan Maestro</p>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5 truncate">
              {whiteLabel.plan?.name || 'Ilimitado / Sin Plan'}
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Globe className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-slate-400 uppercase">Dominio Web</p>
            <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-white mt-0.5 truncate">
              {whiteLabel.custom_domain || 'Dominio Estándar'}
            </h3>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 flex gap-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
        >
          Visión General & Branding
        </button>
        <button
          onClick={() => setActiveTab('agencies')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${activeTab === 'agencies' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
        >
          Agencias Subordinadas ({whiteLabel.agencies?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('admins')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${activeTab === 'admins' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
        >
          Administradores ({whiteLabel.users?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('plan')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${activeTab === 'plan' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
        >
          Plan Maestro & Módulos
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Palette className="w-4 h-4 text-blue-600" />
            <span>Detalles del Sistema & Marca Personalizada</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-blue-600">Contacto & Dominio</h4>
              <div className="space-y-2 text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="font-mono">{whiteLabel.email}</span>
                </div>
                {whiteLabel.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{whiteLabel.phone}</span>
                  </div>
                )}
                {whiteLabel.custom_domain && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-slate-400" />
                    <a href={`https://${whiteLabel.custom_domain}`} target="_blank" rel="noreferrer" className="font-mono text-blue-600 hover:underline flex items-center gap-1">
                      {whiteLabel.custom_domain} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-blue-600">Paleta de Colores</h4>
              <div className="flex items-center gap-4">
                <div className="space-y-1 text-center">
                  <div className="w-10 h-10 rounded-xl border border-slate-300 shadow-sm" style={{ backgroundColor: whiteLabel.primary_color || '#0284c7' }} />
                  <span className="text-[10px] font-mono block text-slate-500">Primario</span>
                </div>
                <div className="space-y-1 text-center">
                  <div className="w-10 h-10 rounded-xl border border-slate-300 shadow-sm" style={{ backgroundColor: whiteLabel.secondary_color || '#0f172a' }} />
                  <span className="text-[10px] font-mono block text-slate-500">Secundario</span>
                </div>
                <div className="space-y-1 text-center">
                  <div className="w-10 h-10 rounded-xl border border-slate-300 shadow-sm" style={{ backgroundColor: whiteLabel.button_color || '#0284c7' }} />
                  <span className="text-[10px] font-mono block text-slate-500">Botones</span>
                </div>
              </div>
            </div>
          </div>

          {whiteLabel.seo_description && (
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-blue-600 text-[11px]">Descripción SEO Meta Tag</h4>
              <p className="text-slate-600 dark:text-slate-400 italic">{whiteLabel.seo_description}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'agencies' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-purple-600" />
              <span>Agencias Registradas en esta Marca Blanca</span>
            </h3>
            <button
              onClick={() => setIsAgencyModalOpen(true)}
              className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Agencia</span>
            </button>
          </div>

          {!whiteLabel.agencies || whiteLabel.agencies.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs font-semibold">
              No hay agencias afiliadas registradas en esta Marca Blanca.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Agencia</th>
                    <th className="p-3">Contacto</th>
                    <th className="p-3">Ciudad / Región</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {whiteLabel.agencies.map((agency: any) => (
                    <tr key={agency.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3 font-mono font-bold text-slate-500">#{agency.id}</td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{agency.name}</td>
                      <td className="p-3 font-mono text-slate-600 dark:text-slate-400">{agency.email}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">{agency.city || 'No especificada'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'admins' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Usuarios Administradores de la Marca Blanca</span>
            </h3>
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Administrador</span>
            </button>
          </div>

          {!whiteLabel.users || whiteLabel.users.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs font-semibold">
              No hay administradores directamente asociados a esta Marca Blanca.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Nombre</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Rol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {whiteLabel.users.map((usr: any) => (
                    <tr key={usr.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3 font-mono font-bold text-slate-500">#{usr.id}</td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{usr.name}</td>
                      <td className="p-3 font-mono text-slate-600 dark:text-slate-400">{usr.email}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                          {usr.role || 'White Label Admin'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'plan' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Plan Maestro Asignado</span>
          </h3>

          {whiteLabel.plan ? (
            <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl border border-indigo-200 dark:border-indigo-800 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-extrabold text-indigo-950 dark:text-indigo-200">
                  {whiteLabel.plan.name}
                </h4>
                <span className="px-2.5 py-1 rounded-xl bg-indigo-600 text-white font-mono font-bold">
                  Plan #{whiteLabel.plan.id}
                </span>
              </div>
              {whiteLabel.plan.description && (
                <p className="text-indigo-800 dark:text-indigo-300 font-medium">{whiteLabel.plan.description}</p>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs font-semibold">
              Esta Marca Blanca no tiene un Plan Maestro restricto. Tiene acceso total a todos los módulos de la plataforma.
            </div>
          )}
        </div>
      )}

      {/* MODAL AGREGAR AGENCIA */}
      {isAgencyModalOpen && (
        <Portal>
          <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-4 sm:p-6 shadow-2xl space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-600" />
                Agregar Agencia a {whiteLabel.name}
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

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={agencyFormData.phone}
                    onChange={(e) => setAgencyFormData({ ...agencyFormData, phone: e.target.value })}
                    placeholder="+502 1234 5678"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Ciudad / Región</label>
                  <input
                    type="text"
                    value={agencyFormData.city}
                    onChange={(e) => setAgencyFormData({ ...agencyFormData, city: e.target.value })}
                    placeholder="Ciudad de Guatemala"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAgencyModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Crear Agencia
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}

      {/* MODAL ASIGNAR ADMINISTRADOR */}
      {isAdminModalOpen && (
        <Portal>
          <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-4 sm:p-6 shadow-2xl space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                Asignar Administrador a {whiteLabel.name}
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
                    onClick={() => setIsAdminModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Asignar Admin WL
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

export default WhiteLabelDetailPage;

