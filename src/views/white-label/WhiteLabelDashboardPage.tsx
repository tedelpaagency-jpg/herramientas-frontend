'use client';

import React, { useEffect, useState } from 'react';
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
} from 'lucide-react';
import { WhiteLabel } from '../../types/whiteLabel';
import whiteLabelService from '../../services/whiteLabelService';
import { useAuth } from '../../context/AuthContext';
import Portal from '../../components/Portal';
import toast from 'react-hot-toast';

export const WhiteLabelDashboardPage: React.FC = () => {
  const { user, currentWhiteLabel, setCurrentWhiteLabel } = useAuth();
  const [whiteLabels, setWhiteLabels] = useState<WhiteLabel[]>([]);
  const [selectedWL, setSelectedWL] = useState<WhiteLabel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'agencies' | 'admins' | 'branding'>('agencies');

  // Modals state
  const [isAgencyModalOpen, setIsAgencyModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

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

            <button
              onClick={() => setIsAgencyModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Agencia</span>
            </button>
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {selectedWL.agencies?.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-400 italic">
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
        <form onSubmit={handleSaveBranding} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <Palette className="w-5 h-5 text-blue-600" />
            Configuración de Identidad Visual (Branding)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Nombre Comercial de Marca Blanca *</label>
              <input
                type="text"
                required
                value={brandingData.name}
                onChange={(e) => setBrandingData({ ...brandingData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Dominio Personalizado</label>
              <input
                type="text"
                value={brandingData.custom_domain}
                onChange={(e) => setBrandingData({ ...brandingData, custom_domain: e.target.value })}
                placeholder="app.micompania.com"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Descripción para SEO Meta Tag</label>
              <textarea
                rows={2}
                value={brandingData.seo_description}
                onChange={(e) => setBrandingData({ ...brandingData, seo_description: e.target.value })}
                placeholder="Descripción de la empresa para navegadores y motores de búsqueda SEO..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Logo and Favicon Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subir Archivo de Logotipo (PNG/SVG)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setBrandingData({ ...brandingData, logo_file: e.target.files[0] });
                  }
                }}
                className="block w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subir Archivo de Favicon (.ico/.png)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setBrandingData({ ...brandingData, favicon_file: e.target.files[0] });
                  }
                }}
                className="block w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <span className="text-[11px] uppercase font-mono font-extrabold text-blue-600 dark:text-blue-400">Paleta de Colores Dinámica</span>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Color Primario</label>
                <input
                  type="color"
                  value={brandingData.primary_color}
                  onChange={(e) => setBrandingData({ ...brandingData, primary_color: e.target.value })}
                  className="w-full h-10 rounded-xl cursor-pointer bg-transparent border-0"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Color Secundario</label>
                <input
                  type="color"
                  value={brandingData.secondary_color}
                  onChange={(e) => setBrandingData({ ...brandingData, secondary_color: e.target.value })}
                  className="w-full h-10 rounded-xl cursor-pointer bg-transparent border-0"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Color de Botones</label>
                <input
                  type="color"
                  value={brandingData.button_color}
                  onChange={(e) => setBrandingData({ ...brandingData, button_color: e.target.value })}
                  className="w-full h-10 rounded-xl cursor-pointer bg-transparent border-0"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
            >
              Guardar Cambios de Branding
            </button>
          </div>
        </form>
      )}

      {/* CREATE AGENCY MODAL */}
      {isAgencyModalOpen && (
        <Portal>
          <div className="fixed inset-0 top-0 left-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Agregar Agencia a {selectedWL.name}
              </h3>

              <form onSubmit={handleCreateAgency} className="space-y-3 text-xs font-bold">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Nombre de la Agencia *</label>
                  <input
                    type="text"
                    required
                    value={agencyFormData.name}
                    onChange={(e) => setAgencyFormData({ ...agencyFormData, name: e.target.value })}
                    placeholder="Ej. Agencia México"
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
                    placeholder="contacto@agenciamexico.com"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAgencyModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-md transition-all"
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

export default WhiteLabelDashboardPage;
