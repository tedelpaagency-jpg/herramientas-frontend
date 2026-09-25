'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Globe,
  Building2,
  Users,
  Plus,
  Edit,
  Palette,
  ShieldCheck,
  CheckCircle2,
  UserPlus,
  Store,
  Layers,
  Settings,
  PieChart,
  Eye,
  X,
  Mail,
  Phone,
  MapPin,
  UserCheck,
  FileSpreadsheet,
} from 'lucide-react';
import { WhiteLabel } from '../../types/whiteLabel';
import whiteLabelService from '../../services/whiteLabelService';
import adminService from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';
import Portal from '../../components/Portal';
import toast from 'react-hot-toast';
import BrandingCustomizationPage from '../admin/BrandingCustomizationPage';

export const WhiteLabelDashboardPage: React.FC = () => {
  const { user, currentWhiteLabel, setCurrentWhiteLabel } = useAuth();
  const [whiteLabels, setWhiteLabels] = useState<WhiteLabel[]>([]);
  const [selectedWL, setSelectedWL] = useState<WhiteLabel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'agencies' | 'admins' | 'branding'>('agencies');

  // Modals state
  const [isAgencyModalOpen, setIsAgencyModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [selectedAgencyDetail, setSelectedAgencyDetail] = useState<any | null>(null);
  const [agencyUsers, setAgencyUsers] = useState<any[]>([]);
  const [isLoadingAgencyUsers, setIsLoadingAgencyUsers] = useState(false);

  // Form states
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

  const [brandingData, setBrandingData] = useState({
    name: '',
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
  });

  const fetchWhiteLabels = async () => {
    setIsLoading(true);
    try {
      const data = await whiteLabelService.getWhiteLabels();
      setWhiteLabels(data);
      if (data.length > 0) {
        const active = data[0];
        setSelectedWL(active);
        setCurrentWhiteLabel(active);
        populateBrandingData(active);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al cargar Marcas Blancas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWhiteLabels();
  }, []);

  const populateBrandingData = (wl: WhiteLabel) => {
    setBrandingData({
      name: wl.name,
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
    });
  };

  const handleSelectWL = (wl: WhiteLabel) => {
    setSelectedWL(wl);
    setCurrentWhiteLabel(wl);
    populateBrandingData(wl);
  };

  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWL) return;
    try {
      await whiteLabelService.updateWhiteLabel(selectedWL.id, brandingData);
      toast.success('Branding y configuración de Marca Blanca actualizados exitosamente');
      fetchWhiteLabels();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al actualizar branding');
    }
  };

  const handleOpenAgencyDetail = async (agency: any) => {
    setSelectedAgencyDetail(agency);
    setIsLoadingAgencyUsers(true);
    try {
      const usersData: any = await adminService.getAgencyUsers(agency.id);
      setAgencyUsers(Array.isArray(usersData) ? usersData : usersData?.data || []);
    } catch (err) {
      console.error('Error al obtener usuarios de la agencia:', err);
      setAgencyUsers([]);
    } finally {
      setIsLoadingAgencyUsers(false);
    }
  };

  const handleCreateAgency = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWL) return;
    try {
      await whiteLabelService.createAgency(selectedWL.id, agencyFormData);
      toast.success('Agencia agregada a la Marca Blanca exitosamente');
      setIsAgencyModalOpen(false);
      setAgencyFormData({ name: '', email: '', phone: '', city: '', admin_name: '', admin_email: '', admin_password: '' });
      fetchWhiteLabels();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al agregar agencia');
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWL) return;
    try {
      await whiteLabelService.addAdmin(selectedWL.id, adminFormData);
      toast.success('Administrador asignado a la Marca Blanca');
      setIsAdminModalOpen(false);
      setAdminFormData({ name: '', email: '', password: '' });
      fetchWhiteLabels();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al asignar administrador');
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-slate-400 font-bold text-xs">
        Cargando Panel de Marca Blanca...
      </div>
    );
  }

  if (!selectedWL) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
        <Globe className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">Sin Marca Blanca asignada</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Contacta con el Super Admin para que se te asigne la administración de una Marca Blanca.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / White Label Selector */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1 w-fit">
              <Globe className="w-3 h-3" /> Panel de Administración White Label
            </span>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              {selectedWL.name}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Gestiona las agencias subordinadas, administradores asignados y personalización de marca.
            </p>
          </div>

          {/* Selector if multiple WLs */}
          {whiteLabels.length > 1 && (
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-500">Seleccionar Marca Blanca:</label>
              <select
                value={selectedWL.id}
                onChange={(e) => {
                  const target = whiteLabels.find(w => w.id === Number(e.target.value));
                  if (target) handleSelectWL(target);
                }}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-xs text-slate-900 dark:text-white"
              >
                {whiteLabels.map((wl) => (
                  <option key={wl.id} value={wl.id}>{wl.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pt-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('agencies')}
            className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${activeTab === 'agencies' ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-black' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
          >
            <Building2 className="w-4 h-4" />
            <span>Agencias ({selectedWL.agencies?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('admins')}
            className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${activeTab === 'admins' ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-black' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
          >
            <Users className="w-4 h-4" />
            <span>Administradores ({selectedWL.users?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('branding')}
            className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${activeTab === 'branding' ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-black' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
          >
            <Palette className="w-4 h-4" />
            <span>Personalización y Branding</span>
          </button>
        </div>
      </div>

      {/* TAB 1: AGENCIES */}
      {activeTab === 'agencies' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Agencias de {selectedWL.name}
            </h3>
            <div className="flex items-center gap-2">
              <Link
                href="/agencies"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Agencia</span>
              </Link>
              <Link
                href="/white-label/import-students"
                className="px-4 py-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-blue-200 dark:border-blue-800/60 shadow-xs"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Importar Estudiantes (Moodle)</span>
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3.5">ID</th>
                    <th className="p-3.5">Nombre de la Agencia</th>
                    <th className="p-3.5">Contacto</th>
                    <th className="p-3.5">Ubicación / Ciudad</th>
                    <th className="p-3.5">Estado</th>
                    <th className="p-3.5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {selectedWL.agencies?.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-400 italic">
                        No hay agencias agregadas en esta Marca Blanca aún.
                      </td>
                    </tr>
                  ) : (
                    selectedWL.agencies?.map((agency: any) => (
                      <tr key={agency.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5 font-mono text-slate-400 font-bold">#{agency.id}</td>
                        <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                            <span>{agency.name}</span>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-mono text-slate-700 dark:text-slate-300">{agency.email}</div>
                          {agency.phone && <div className="text-[10px] text-slate-400 font-mono">{agency.phone}</div>}
                        </td>
                        <td className="p-3.5 text-slate-600 dark:text-slate-400 font-medium">
                          {[agency.city, agency.province].filter(Boolean).join(', ') || '—'}
                        </td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
                            Activa
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleOpenAgencyDetail(agency)}
                            className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors inline-flex items-center gap-1.5 text-xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Ver Perfil & Usuarios</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ADMINS */}
      {activeTab === 'admins' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Administradores Asignados a la Marca Blanca
            </h3>

            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Asignar Admin WL</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Nombre</th>
                  <th className="p-3">Correo</th>
                  <th className="p-3">Rol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {selectedWL.users?.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-400 italic">No hay administradores asignados a esta Marca Blanca.</td>
                  </tr>
                ) : (
                  selectedWL.users?.map((u: any) => (
                    <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-mono text-slate-400">#{u.id}</td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{u.name}</td>
                      <td className="p-3 font-mono text-slate-600 dark:text-slate-300">{u.email}</td>
                      <td className="p-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                          White Label Admin
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: BRANDING */}
      {activeTab === 'branding' && (
        <BrandingCustomizationPage
          initialTargetType="white_label"
          initialWhiteLabelId={selectedWL.id}
        />
      )}

      {/* AGENCY PROFILE & USERS MODAL */}
      {selectedAgencyDetail && (
        <Portal>
          <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-3xl w-full p-4 sm:p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center border border-blue-200 dark:border-blue-800">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{selectedAgencyDetail.name}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
                        Agencia #{selectedAgencyDetail.id}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">Perfil general y directorio de usuarios con roles</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAgencyDetail(null)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Agency Profile Details Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 font-mono block">Contacto Principal</span>
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="truncate">{selectedAgencyDetail.email}</span>
                  </div>
                  {selectedAgencyDetail.phone && (
                    <div className="text-slate-500 font-mono text-[11px] flex items-center gap-1.5">
                      <Phone className="w-3 h-3 shrink-0" />
                      <span>{selectedAgencyDetail.phone}</span>
                    </div>
                  )}
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 font-mono block">Ubicación</span>
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{[selectedAgencyDetail.city, selectedAgencyDetail.province].filter(Boolean).join(', ') || 'No especificada'}</span>
                  </div>
                  {selectedAgencyDetail.address && (
                    <div className="text-slate-500 text-[11px] truncate">{selectedAgencyDetail.address}</div>
                  )}
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 font-mono block">Plan & Dominio</span>
                  <div className="font-bold text-blue-600 dark:text-blue-400 truncate">
                    {selectedAgencyDetail.current_subscription?.plan?.name || selectedAgencyDetail.plan?.name || 'Plan Estándar'}
                  </div>
                  <div className="text-slate-500 font-mono text-[11px] truncate">{selectedAgencyDetail.domain || 'Dominio predeterminado'}</div>
                </div>
              </div>

              {/* Users & Roles List Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    <span>Usuarios y Roles Registrados ({agencyUsers.length})</span>
                  </h4>
                </div>

                {isLoadingAgencyUsers ? (
                  <div className="p-8 text-center text-xs text-slate-400 animate-pulse">Cargando directorio de usuarios de la agencia...</div>
                ) : agencyUsers.length === 0 ? (
                  <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl text-center text-slate-400 text-xs italic border border-slate-200 dark:border-slate-800">
                    No se encontraron usuarios asignados a esta agencia aún.
                  </div>
                ) : (
                  <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold uppercase text-[10px]">
                        <tr>
                          <th className="p-3">Usuario</th>
                          <th className="p-3">Rol / Nivel</th>
                          <th className="p-3">Teléfono</th>
                          <th className="p-3 text-right">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                        {agencyUsers.map((u: any) => {
                          const roleName = u.role || (u.roles?.[0]?.name ?? 'user');
                          return (
                            <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                              <td className="p-3">
                                <div className="flex items-center gap-2.5">
                                  {u.photo ? (
                                    <img src={u.photo} alt={u.name} className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0" />
                                  ) : (
                                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                                      {u.name ? u.name.substring(0, 2).toUpperCase() : 'U'}
                                    </div>
                                  )}
                                  <div>
                                    <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                                    <div className="text-[11px] text-slate-500 font-mono">{u.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-extrabold text-[10px] uppercase">
                                  {roleName}
                                </span>
                              </td>
                              <td className="p-3 font-mono text-slate-500">{u.phone || '—'}</td>
                              <td className="p-3 text-right">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.status === 1 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-600'}`}>
                                  {u.status === 1 ? 'Activo' : 'Inactivo'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedAgencyDetail(null)}
                  className="px-5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};

export default WhiteLabelDashboardPage;
