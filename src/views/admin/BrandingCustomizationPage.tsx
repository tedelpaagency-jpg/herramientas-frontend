'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import whiteLabelService from '../../services/whiteLabelService';
import adminService from '../../services/adminService';
import { 
  Palette, Type, Image as ImageIcon, Globe, Code, Sparkles, Save, RotateCcw, 
  Check, Eye, Layout, Lock, Building2, ShieldCheck, RefreshCw, Upload, Smartphone, ExternalLink, Sun, Moon, Minimize2, Maximize2, CreditCard, Key, EyeOff, Loader2, CheckCircle2, AlertCircle
} from 'lucide-react';
import MediaPicker from '../../components/media/MediaPicker';

const PRESET_PALETTES = [
  { name: 'Esmeralda Santun', primary: '#00a884', secondary: '#161a1b', button: '#00a884', menuBg: '#161a1b' },
  { name: 'Azul Corporativo', primary: '#0284c7', secondary: '#161a1b', button: '#0284c7', menuBg: '#161a1b' },
  { name: 'Púrpura Neón', primary: '#8b5cf6', secondary: '#1e1b4b', button: '#8b5cf6', menuBg: '#1e1b4b' },
  { name: 'Naranja Atardecer', primary: '#f97316', secondary: '#1c1917', button: '#f97316', menuBg: '#1c1917' },
  { name: 'Rosa Rubí', primary: '#e11d48', secondary: '#1e1b4b', button: '#e11d48', menuBg: '#161a1b' },
  { name: 'Verde Bosque', primary: '#059669', secondary: '#064e3b', button: '#059669', menuBg: '#064e3b' },
];

const GOOGLE_FONTS = [
  { name: 'Inter (Moderna y Limpia)', value: 'Inter, sans-serif' },
  { name: 'Outfit (Geométrica Elegante)', value: 'Outfit, sans-serif' },
  { name: 'Roboto (Estándar Google)', value: 'Roboto, sans-serif' },
  { name: 'Montserrat (Audaz e Impactante)', value: 'Montserrat, sans-serif' },
  { name: 'Poppins (Amigable y Redondeada)', value: 'Poppins, sans-serif' },
  { name: 'Playfair Display (Editorial Lujo)', value: '"Playfair Display", serif' },
  { name: 'Plus Jakarta Sans (Corporativa Tech)', value: '"Plus Jakarta Sans", sans-serif' },
];

interface BrandingCustomizationPageProps {
  initialTargetType?: 'white_label' | 'agency';
  initialWhiteLabelId?: number;
  initialAgencyId?: number;
}

export default function BrandingCustomizationPage({
  initialTargetType = 'white_label',
  initialWhiteLabelId,
  initialAgencyId,
}: BrandingCustomizationPageProps = {}) {
  const { user, currentWhiteLabel, currentAgency, setCurrentWhiteLabel, setCurrentAgency, refreshUser } = useAuth();

  const isSuperAdmin = user?.role === 'super_admin' || user?.roles?.some(r => r.name === 'super_admin');
  const isWlAdmin = user?.role === 'white_label_admin' || user?.roles?.some(r => r.name === 'white_label_admin');
  
  // Selection state
  const [targetType, setTargetType] = useState<'white_label' | 'agency'>(initialTargetType);
  const [whiteLabels, setWhiteLabels] = useState<any[]>([]);
  const [agencies, setAgencies] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(initialTargetType === 'white_label' ? (initialWhiteLabelId || null) : (initialAgencyId || null));

  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'logos' | 'info' | 'domain' | 'stripe'>('colors');
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [testingStripe, setTestingStripe] = useState<boolean>(false);
  const [stripeTestResult, setStripeTestResult] = useState<{ status: 'success' | 'error'; message: string } | null>(null);

  // Preview interactive state controls
  const [previewMode, setPreviewMode] = useState<'dashboard' | 'login'>('dashboard');
  const [mockTheme, setMockTheme] = useState<'light' | 'dark'>('dark');
  const [mockNavTheme, setMockNavTheme] = useState<'light' | 'dark'>('dark');
  const [mockCollapsed, setMockCollapsed] = useState<boolean>(false);

  // Branding Form State
  const [form, setForm] = useState<any>({
    name: '',
    legal_name: '',
    email: '',
    phone: '',
    whatsapp: '',
    facebook: '',
    instagram: '',
    tiktok: '',
    logo: '',
    logo_file: null,
    logo_2: '',
    logo_2_file: null,
    logo_icon: '',
    logo_icon_file: null,
    favicon: '',
    favicon_file: null,
    login_background: '',
    login_background_file: null,
    primary_color: '#00a884',
    secondary_color: '#161a1b',
    button_color: '#00a884',
    menu_background: '#161a1b',
    dark_theme: 'dark',
    navigation_mode: 'normal',
    font_family: 'Inter, sans-serif',
    border_radius: 'rounded-xl',
    custom_domain: '',
    seo_description: '',
    custom_css: '',
    stripe_publishable_key: '',
    stripe_secret_key: '',
    stripe_webhook_secret: '',
    stripe_mode: 'test',
  });

  // Load available entities on mount
  useEffect(() => {
    fetchEntities();
  }, []);

  const fetchEntities = async (preserveId?: number | null, preserveType?: 'white_label' | 'agency') => {
    setLoading(true);
    try {
      if (isSuperAdmin || isWlAdmin) {
        const wlData = await whiteLabelService.getWhiteLabels();
        const wlList = Array.isArray(wlData) ? wlData : (wlData?.data || []);
        setWhiteLabels(wlList);

        const agData = await adminService.getAgencies();
        const agList = Array.isArray(agData) ? agData : ((agData as any)?.data || []);
        setAgencies(agList);

        const targetId = preserveId ?? selectedId;
        const targetKind = preserveType ?? targetType;

        if (targetKind === 'white_label' && targetId) {
          const match = wlList.find(w => w.id === targetId);
          if (match) {
            setSelectedId(match.id);
            setTargetType('white_label');
            populateForm(match, 'white_label');
            setCurrentWhiteLabel(match);
            return;
          }
        } else if (targetKind === 'agency' && targetId) {
          const match = agList.find(a => a.id === targetId);
          if (match) {
            setSelectedId(match.id);
            setTargetType('agency');
            populateForm(match, 'agency');
            setCurrentAgency(match);
            return;
          }
        }

        if (wlList.length > 0) {
          setTargetType('white_label');
          setSelectedId(wlList[0].id);
          populateForm(wlList[0], 'white_label');
          setCurrentWhiteLabel(wlList[0]);
        } else if (agList.length > 0) {
          setTargetType('agency');
          setSelectedId(agList[0].id);
          populateForm(agList[0], 'agency');
          setCurrentAgency(agList[0]);
        }
      } else {
        // Agency Admin
        const agId = user?.agency_id || currentAgency?.id;
        if (agId) {
          const ag = await adminService.getAgency(agId);
          setTargetType('agency');
          setSelectedId(agId);
          setAgencies([ag]);
          populateForm(ag, 'agency');
          setCurrentAgency(ag);
        }
      }
    } catch (err: any) {
      console.error('Error cargando entidades de marca:', err);
      setErrorMsg('No se pudieron cargar los datos de la marca.');
    } finally {
      setLoading(false);
    }
  };

  const populateForm = (entity: any, type: 'white_label' | 'agency') => {
    const navMode = entity.navigation_mode || (typeof window !== 'undefined' && localStorage.getItem('santun_sidebar_collapsed') === 'true' ? 'compact' : 'normal');
    const darkThemeVal = entity.dark_theme || 'dark';

    setForm({
      name: entity.name || '',
      legal_name: entity.legal_name || entity.razon_social || '',
      email: entity.email || '',
      phone: entity.phone || '',
      whatsapp: entity.whatsapp || '',
      facebook: entity.facebook || '',
      instagram: entity.instagram || '',
      tiktok: entity.tiktok || '',
      logo: entity.logo || '',
      logo_file: null,
      logo_2: entity.logo_2 || '',
      logo_2_file: null,
      logo_icon: entity.logo_icon || '',
      logo_icon_file: null,
      favicon: entity.favicon || '',
      favicon_file: null,
      login_background: entity.login_background || '',
      login_background_file: null,
      primary_color: entity.primary_color || '#00a884',
      secondary_color: entity.secondary_color || '#161a1b',
      button_color: entity.button_color || entity.primary_color || '#00a884',
      menu_background: entity.menu_background || '#161a1b',
      dark_theme: darkThemeVal,
      navigation_mode: navMode,
      font_family: entity.font_family || 'Inter, sans-serif',
      border_radius: entity.border_radius || 'rounded-xl',
      custom_domain: entity.custom_domain || entity.domain || '',
      seo_description: entity.seo_description || entity.description || '',
      custom_css: entity.custom_css || '',
      stripe_publishable_key: entity.stripe_publishable_key || '',
      stripe_secret_key: entity.stripe_secret_key || '',
      stripe_webhook_secret: entity.stripe_webhook_secret || '',
      stripe_mode: entity.stripe_mode || 'test',
    });

    setMockCollapsed(navMode === 'compact');
    setMockNavTheme(darkThemeVal === 'dark' ? 'dark' : 'light');
  };

  const handleEntityChange = (id: number, type: 'white_label' | 'agency') => {
    setSelectedId(id);
    setTargetType(type);
    if (type === 'white_label') {
      const item = whiteLabels.find(w => w.id === id);
      if (item) {
        populateForm(item, 'white_label');
        setCurrentWhiteLabel(item);
        if (typeof window !== 'undefined') {
          localStorage.setItem('santun_white_label', JSON.stringify(item));
        }
      }
    } else {
      const item = agencies.find(a => a.id === id);
      if (item) {
        populateForm(item, 'agency');
        setCurrentAgency(item);
      }
    }
  };

  const handleFileChange = (field: string, file: File | null) => {
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setForm((prev: any) => ({
      ...prev,
      [`${field}_file`]: file,
      [field]: previewUrl,
    }));
  };

  const applyPalette = (palette: typeof PRESET_PALETTES[0]) => {
    setForm((prev: any) => ({
      ...prev,
      primary_color: palette.primary,
      secondary_color: palette.secondary,
      button_color: palette.button,
      menu_background: palette.menuBg,
    }));
  };

  const handleTestStripeConnection = async () => {
    if (!form.stripe_secret_key) {
      setStripeTestResult({
        status: 'error',
        message: 'Debe ingresar la Clave Secreta (Stripe Secret Key) para verificar la conexión.',
      });
      return;
    }
    setTestingStripe(true);
    setStripeTestResult(null);
    try {
      const res = await whiteLabelService.testStripeConnection(form.stripe_secret_key);
      if (res.status === 'success') {
        setStripeTestResult({
          status: 'success',
          message: res.message || '¡Conexión verificada exitosamente!',
        });
      } else {
        setStripeTestResult({
          status: 'error',
          message: res.message || 'Error al validar con Stripe.',
        });
      }
    } catch (err: any) {
      setStripeTestResult({
        status: 'error',
        message: err.response?.data?.message || err.message || 'Error de comunicación con el servidor.',
      });
    } finally {
      setTestingStripe(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return;

    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      let updated: any;
      if (targetType === 'white_label') {
        updated = await whiteLabelService.updateWhiteLabel(selectedId, form);
        const freshWl = updated?.data || updated;
        if (freshWl) {
          setCurrentWhiteLabel(freshWl);
          if (typeof window !== 'undefined') {
            localStorage.setItem('santun_white_label', JSON.stringify(freshWl));
            if (freshWl.logo) localStorage.setItem('santun_sidebar_logo', freshWl.logo);
            if (freshWl.logo_2) localStorage.setItem('santun_sidebar_logo_dark', freshWl.logo_2);
            if (freshWl.logo_icon) localStorage.setItem('santun_sidebar_logo_icon', freshWl.logo_icon);
            if (freshWl.menu_background) localStorage.setItem('santun_menu_background', freshWl.menu_background);
            if (freshWl.dark_theme) localStorage.setItem('santun_dark_theme', freshWl.dark_theme);
            if (form.navigation_mode) {
              localStorage.setItem('santun_sidebar_collapsed', String(form.navigation_mode === 'compact'));
            }
            window.dispatchEvent(new Event('sidebar-state-changed'));
            window.dispatchEvent(new Event('branding-updated'));
          }
        }
      } else {
        updated = await adminService.updateAgency(selectedId, form);
        const freshAg = updated?.data || updated;
        if (freshAg) {
          setCurrentAgency(freshAg);
          if (typeof window !== 'undefined') {
            if (freshAg.logo) localStorage.setItem('santun_sidebar_logo', freshAg.logo);
            if (freshAg.logo_2) localStorage.setItem('santun_sidebar_logo_dark', freshAg.logo_2);
            if (freshAg.logo_icon) localStorage.setItem('santun_sidebar_logo_icon', freshAg.logo_icon);
            if (freshAg.menu_background) localStorage.setItem('santun_menu_background', freshAg.menu_background);
            if (freshAg.dark_theme) localStorage.setItem('santun_dark_theme', freshAg.dark_theme);
            if (form.navigation_mode) {
              localStorage.setItem('santun_sidebar_collapsed', String(form.navigation_mode === 'compact'));
            }
            window.dispatchEvent(new Event('sidebar-state-changed'));
            window.dispatchEvent(new Event('branding-updated'));
          }
        }
      }

      await refreshUser();

      setSuccessMsg('¡Personalización de marca guardada y aplicada exitosamente en todo el sistema!');

      // Refresh list while preserving selected entity
      await fetchEntities(selectedId, targetType);

      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: any) {
      console.error('Error al guardar marca:', err);
      setErrorMsg(err.response?.data?.message || 'Ocurrió un error al guardar la personalización.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[600px]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-[#00a884] animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Cargando motor de personalización de marca...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#00a884]/20 text-[#00a884] border border-[#00a884]/30">
              MARCA BLANCA & AGENCIAS
            </span>
            <span className="text-xs text-slate-400 font-medium">Enterprise Branding Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
            Personalización de Marca & Logotipos
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Configure logotipos para modo claro, modo oscuro e isotipo de menú compacto, paletas de colores corporativas y tipografías nativas.
          </p>
        </div>

        {/* Action Save Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-5 py-2.5 bg-[#00a884] hover:bg-[#009272] text-white text-xs font-bold rounded-xl shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center gap-2"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Guardando...' : 'Guardar y Aplicar Marca'}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm animate-fade-in">
          <Lock className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Entity Switcher Bar (SuperAdmin & WL Admins) */}
      {(isSuperAdmin || isWlAdmin) && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setTargetType('white_label');
                const targetWl = (initialWhiteLabelId ? whiteLabels.find(w => w.id === initialWhiteLabelId) : null) || whiteLabels[0] || currentWhiteLabel;
                if (targetWl) {
                  setSelectedId(targetWl.id);
                  populateForm(targetWl, 'white_label');
                  setCurrentWhiteLabel(targetWl);
                }
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                targetType === 'white_label'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700 font-black'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4 text-[#00a884]" />
              <span>🏛️ Configurar Marca Blanca</span>
            </button>

            {agencies.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setTargetType('agency');
                  const targetAg = agencies[0];
                  if (targetAg) {
                    setSelectedId(targetAg.id);
                    populateForm(targetAg, 'agency');
                    setCurrentAgency(targetAg);
                  }
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  targetType === 'agency'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700 font-black'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>🏢 Configurar Agencia Hija</span>
              </button>
            )}
          </div>

          {/* Active Entity Selector Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
              {targetType === 'white_label' ? 'Marca Blanca:' : 'Agencia:'}
            </span>

            {targetType === 'white_label' ? (
              <select
                value={selectedId || ''}
                onChange={(e) => handleEntityChange(Number(e.target.value), 'white_label')}
                className="px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[#00a884]"
              >
                {whiteLabels.map((w) => (
                  <option key={w.id} value={w.id}>
                    🏛️ {w.name} ({w.slug})
                  </option>
                ))}
              </select>
            ) : (
              <select
                value={selectedId || ''}
                onChange={(e) => handleEntityChange(Number(e.target.value), 'agency')}
                className="px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[#00a884]"
              >
                {agencies.map((a) => (
                  <option key={a.id} value={a.id}>
                    🏢 {a.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      )}

      {/* Main 2-Column Split: Customization Form Left | Live Mockup Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Form & Tabs (7 Columns) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto bg-slate-50 dark:bg-slate-950">
            <button
              onClick={() => setActiveTab('colors')}
              className={`px-4 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'colors'
                  ? 'border-[#00a884] text-[#00a884] bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Palette className="w-4 h-4" /> Paleta de Colores
            </button>
            <button
              onClick={() => setActiveTab('logos')}
              className={`px-4 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'logos'
                  ? 'border-[#00a884] text-[#00a884] bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4" /> Variantes de Logotipo
            </button>
            <button
              onClick={() => setActiveTab('typography')}
              className={`px-4 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'typography'
                  ? 'border-[#00a884] text-[#00a884] bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Type className="w-4 h-4" /> Tipografía & Estilos
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`px-4 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'info'
                  ? 'border-[#00a884] text-[#00a884] bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4" /> Datos de Marca
            </button>
            <button
              onClick={() => setActiveTab('domain')}
              className={`px-4 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'domain'
                  ? 'border-[#00a884] text-[#00a884] bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Code className="w-4 h-4" /> Dominio & SEO
            </button>
            <button
              onClick={() => setActiveTab('stripe')}
              className={`px-4 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'stripe'
                  ? 'border-[#00a884] text-[#00a884] bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CreditCard className="w-4 h-4 text-emerald-500" /> Pasarela Stripe
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* TAB 1: COLORS & THEMES */}
            {activeTab === 'colors' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Paletas Prediseñadas Rápidas</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Haga clic en un tema corporativo para aplicarlo instantáneamente:</p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {PRESET_PALETTES.map((pal) => (
                      <button
                        key={pal.name}
                        type="button"
                        onClick={() => applyPalette(pal)}
                        className="p-3 border rounded-xl border-slate-200 dark:border-slate-700 hover:border-slate-400 transition-all text-left group bg-slate-50 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800"
                      >
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: pal.primary }}></span>
                          <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: pal.secondary }}></span>
                          <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: pal.button }}></span>
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block group-hover:text-slate-900 dark:group-hover:text-white">{pal.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <hr className="border-slate-100" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Color Primario (Acento):</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={form.primary_color}
                        onChange={(e) => setForm({ ...form, primary_color: e.target.value })}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                      />
                      <input
                        type="text"
                        value={form.primary_color}
                        onChange={(e) => setForm({ ...form, primary_color: e.target.value })}
                        className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Color Secundario / Encabezado:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={form.secondary_color}
                        onChange={(e) => setForm({ ...form, secondary_color: e.target.value })}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                      />
                      <input
                        type="text"
                        value={form.secondary_color}
                        onChange={(e) => setForm({ ...form, secondary_color: e.target.value })}
                        className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Color de Botones de Acción:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={form.button_color}
                        onChange={(e) => setForm({ ...form, button_color: e.target.value })}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                      />
                      <input
                        type="text"
                        value={form.button_color}
                        onChange={(e) => setForm({ ...form, button_color: e.target.value })}
                        className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Fondo del Menú Lateral / Sidebar:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={form.menu_background}
                        onChange={(e) => setForm({ ...form, menu_background: e.target.value })}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                      />
                      <input
                        type="text"
                        value={form.menu_background}
                        onChange={(e) => setForm({ ...form, menu_background: e.target.value })}
                        className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg uppercase"
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Selector Tema Oscuro / Claro para Navegación */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Tema de Navegación (Modo Claro vs Oscuro):
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setForm((prev: any) => ({ ...prev, dark_theme: 'light' }));
                          setMockNavTheme('light');
                        }}
                        className={`p-2.5 border text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                          form.dark_theme === 'light'
                            ? 'border-[#00a884] bg-emerald-50 text-[#00a884] shadow-xs'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Sun className="w-4 h-4 text-amber-500" /> Modo Claro
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setForm((prev: any) => ({ ...prev, dark_theme: 'dark' }));
                          setMockNavTheme('dark');
                        }}
                        className={`p-2.5 border text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                          form.dark_theme === 'dark'
                            ? 'border-[#00a884] bg-slate-900 text-white shadow-xs'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Moon className="w-4 h-4 text-indigo-400" /> Modo Oscuro
                      </button>
                    </div>
                  </div>

                  {/* Selector Modo Normal vs Compacto */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Modo de Menú Lateral (Navegación):
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setForm((prev: any) => ({ ...prev, navigation_mode: 'normal' }));
                          setMockCollapsed(false);
                          if (typeof window !== 'undefined') {
                            localStorage.setItem('santun_sidebar_collapsed', 'false');
                            window.dispatchEvent(new Event('sidebar-state-changed'));
                          }
                        }}
                        className={`p-2.5 border text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                          form.navigation_mode !== 'compact'
                            ? 'border-[#00a884] bg-emerald-50 text-[#00a884] shadow-xs'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Maximize2 className="w-4 h-4" /> Normal
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setForm((prev: any) => ({ ...prev, navigation_mode: 'compact' }));
                          setMockCollapsed(true);
                          if (typeof window !== 'undefined') {
                            localStorage.setItem('santun_sidebar_collapsed', 'true');
                            window.dispatchEvent(new Event('sidebar-state-changed'));
                          }
                        }}
                        className={`p-2.5 border text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                          form.navigation_mode === 'compact'
                            ? 'border-[#00a884] bg-emerald-50 text-[#00a884] shadow-xs'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Minimize2 className="w-4 h-4" /> Compacto
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: LOGOS & VARIANTS */}
            {activeTab === 'logos' && (
              <div className="space-y-6">
                
                {/* 1. Light Mode Logo */}
                <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold text-slate-800 uppercase flex items-center gap-2">
                        <Sun className="w-4 h-4 text-amber-500" /> 1. Logo para Modo Claro (Fondo Blanco / Claro)
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Se utiliza en interfaces con fondo blanco o claro</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">PNG / SVG</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <MediaPicker
                      value={form.logo}
                      type="image"
                      buttonLabel="Seleccionar Logo Claro"
                      onChange={({ url }) => {
                        setForm((prev: any) => ({
                          ...prev,
                          logo: url || prev.logo,
                        }));
                      }}
                    />
                  </div>
                </div>

                {/* 2. Dark Mode Logo */}
                <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-900 text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold text-white uppercase flex items-center gap-2">
                        <Moon className="w-4 h-4 text-indigo-400" /> 2. Logo para Modo Oscuro (Fondo Oscuro)
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Se utiliza cuando el menú o el tema de pantalla es oscuro</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">PNG / SVG</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <MediaPicker
                      value={form.logo_2}
                      type="image"
                      buttonLabel="Seleccionar Logo Oscuro"
                      onChange={({ url }) => {
                        setForm((prev: any) => ({
                          ...prev,
                          logo_2: url || prev.logo_2,
                        }));
                      }}
                    />
                  </div>
                </div>

                {/* 3. Compact Sidebar Logo (Isotipo) */}
                <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold text-slate-800 uppercase flex items-center gap-2">
                        <Minimize2 className="w-4 h-4 text-[#00a884]" /> 3. Logo para Sidebar Modo Compacto (Isotipo / Icono)
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Icono o símbolo cuadrado cuando el menú lateral está colapsado</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">1:1 Cuadrado</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <MediaPicker
                      value={form.logo_icon}
                      type="image"
                      buttonLabel="Seleccionar Isotipo"
                      onChange={({ url }) => {
                        setForm((prev: any) => ({
                          ...prev,
                          logo_icon: url || prev.logo_icon,
                        }));
                      }}
                    />
                  </div>
                </div>

                {/* Favicon & Login Background Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Favicon */}
                  <div className="border border-slate-200 rounded-xl p-4 space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase block">Favicon (Pestaña Navegador):</label>
                    <MediaPicker
                      value={form.favicon}
                      type="image"
                      buttonLabel="Favicon"
                      compact
                      onChange={({ url }) => {
                        setForm((prev: any) => ({
                          ...prev,
                          favicon: url || prev.favicon,
                        }));
                      }}
                    />
                  </div>

                  {/* Login Background */}
                  <div className="border border-slate-200 rounded-xl p-4 space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase block">Fondo Inicio de Sesión (Imagen o Video MP4):</label>
                    <MediaPicker
                      value={form.login_background}
                      type="all"
                      buttonLabel="Fondo Login"
                      compact
                      onChange={({ url }) => {
                        setForm((prev: any) => ({
                          ...prev,
                          login_background: url || prev.login_background,
                        }));
                      }}
                    />
                  </div>
                </div>

              </div>
            )}

            {/* TAB 3: TYPOGRAPHY & STYLES */}
            {activeTab === 'typography' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Familia de Fuente Tipográfica:</label>
                  <select
                    value={form.font_family}
                    onChange={(e) => setForm({ ...form, font_family: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-[#00a884]"
                  >
                    {GOOGLE_FONTS.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Muestra de Fuente En Vivo</span>
                  <div style={{ fontFamily: form.font_family }}>
                    <h2 className="text-xl font-bold text-slate-900">Santun Platform System 2026</h2>
                    <p className="text-xs text-slate-600">
                      El sistema pericial e inmobiliario líder con soporte multi-tenant de marcas blancas y personalización corporativa avanzada.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Estilo de Bordes & Esquinas (Border Radius):</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: 'Suave', value: 'rounded-lg' },
                      { label: 'Curvado', value: 'rounded-xl' },
                      { label: 'Pronunciado', value: 'rounded-2xl' },
                      { label: 'Recto', value: 'rounded-none' },
                    ].map((b) => (
                      <button
                        key={b.value}
                        type="button"
                        onClick={() => setForm({ ...form, border_radius: b.value })}
                        className={`p-2.5 border text-xs font-bold transition-all text-center ${
                          form.border_radius === b.value
                            ? 'border-[#00a884] bg-emerald-50 text-[#00a884]'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        } ${b.value}`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: BRAND INFO & SOCIAL */}
            {activeTab === 'info' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre Comercial de la Marca:</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Razón Social (Legal Name):</label>
                    <input
                      type="text"
                      value={form.legal_name}
                      onChange={(e) => setForm({ ...form, legal_name: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Institucional:</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Teléfono Directo / WhatsApp:</label>
                    <input
                      type="text"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>
                </div>

                <hr className="border-slate-100" />

                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Enlaces a Redes Sociales Corporativas</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Facebook URL:</span>
                    <input
                      type="text"
                      placeholder="https://facebook.com/..."
                      value={form.facebook}
                      onChange={(e) => setForm({ ...form, facebook: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Instagram URL:</span>
                    <input
                      type="text"
                      placeholder="https://instagram.com/..."
                      value={form.instagram}
                      onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">TikTok URL:</span>
                    <input
                      type="text"
                      placeholder="https://tiktok.com/@..."
                      value={form.tiktok}
                      onChange={(e) => setForm({ ...form, tiktok: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: DOMAIN & SEO */}
            {activeTab === 'domain' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Dominio Personalizado (Custom Domain):</label>
                  <input
                    type="text"
                    placeholder="ej. app.miagencia.com"
                    value={form.custom_domain}
                    onChange={(e) => setForm({ ...form, custom_domain: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Apunte su CNAME a la dirección IP o servidor maestro de Santun.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Meta Descripción SEO / Compartir:</label>
                  <textarea
                    rows={3}
                    placeholder="Descripción que aparecerá en Google y previsualización de enlaces de WhatsApp..."
                    value={form.seo_description}
                    onChange={(e) => setForm({ ...form, seo_description: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Inyección de Estilos CSS Personalizados:</label>
                  <textarea
                    rows={4}
                    placeholder="/* p.ej. .sidebar-brand { opacity: 0.9; } */"
                    value={form.custom_css}
                    onChange={(e) => setForm({ ...form, custom_css: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-900 text-emerald-400 rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* TAB 6: STRIPE PAYMENT GATEWAY API KEYS */}
            {activeTab === 'stripe' && (
              <div className="space-y-5">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <span className="font-bold text-slate-900 dark:text-white block">Integración de Pagos Directos con Stripe</span>
                    <p className="text-slate-600 dark:text-slate-300">
                      Configure sus credenciales API de Stripe para que las landings, suscripciones y solicitudes de pago cobren directamente a su cuenta bancaria.
                    </p>
                  </div>
                </div>

                {/* Stripe Environment Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                    Entorno / Modo de Stripe:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, stripe_mode: 'test' })}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        form.stripe_mode === 'test'
                          ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-500'
                      }`}
                    >
                      <Key className="w-4 h-4" /> Modo Pruebas (Test / Sandbox)
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, stripe_mode: 'live' })}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        form.stripe_mode === 'live'
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-500'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4" /> Modo Producción (Live Real)
                    </button>
                  </div>
                </div>

                {/* Publishable Key */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                    Stripe Publishable Key (Clave Publicable):
                  </label>
                  <input
                    type="text"
                    placeholder={form.stripe_mode === 'live' ? 'pk_live_...' : 'pk_test_...'}
                    value={form.stripe_publishable_key}
                    onChange={(e) => setForm({ ...form, stripe_publishable_key: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  />
                  <span className="text-[10px] text-slate-400 block">
                    Comienza con <code className="font-mono text-emerald-500">pk_test_</code> o <code className="font-mono text-emerald-500">pk_live_</code>. Se utiliza en el frontend para procesar Stripe Checkout.
                  </span>
                </div>

                {/* Secret Key */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                    Stripe Secret Key (Clave Secreta):
                  </label>
                  <input
                    type="password"
                    placeholder={form.stripe_mode === 'live' ? 'sk_live_...' : 'sk_test_...'}
                    value={form.stripe_secret_key}
                    onChange={(e) => setForm({ ...form, stripe_secret_key: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  />
                  <span className="text-[10px] text-slate-400 block">
                    Comienza con <code className="font-mono text-emerald-500">sk_test_</code> o <code className="font-mono text-emerald-500">sk_live_</code>. Clave confidencial requerida para crear órdenes y cobros backend.
                  </span>
                </div>

                {/* Webhook Secret */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                    Stripe Webhook Signing Secret (Opcional):
                  </label>
                  <input
                    type="text"
                    placeholder="whsec_..."
                    value={form.stripe_webhook_secret}
                    onChange={(e) => setForm({ ...form, stripe_webhook_secret: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  />
                  <span className="text-[10px] text-slate-400 block">
                    Comienza con <code className="font-mono text-emerald-500">whsec_</code>. Utilizado para verificar firmas de eventos webhooks devueltos por Stripe.
                  </span>
                </div>

                {/* Test Connection Button & Status Result */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">Garantizar y Validar Conexión</span>
                      <span className="text-[11px] text-slate-500">Pruebe inmediatamente si la clave de Stripe es válida con los servidores de Stripe.</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleTestStripeConnection}
                      disabled={testingStripe || !form.stripe_secret_key}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-50 shadow-md"
                    >
                      {testingStripe ? (
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                      ) : (
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      )}
                      {testingStripe ? 'Verificando con Stripe...' : 'Verificar Conexión con Stripe'}
                    </button>
                  </div>

                  {stripeTestResult && (
                    <div
                      className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs transition-all ${
                        stripeTestResult.status === 'success'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
                      }`}
                    >
                      {stripeTestResult.status === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="font-bold block">
                          {stripeTestResult.status === 'success' ? '¡Conexión Exitosa con Stripe!' : 'Fallo en la Conexión con Stripe'}
                        </span>
                        <span>{stripeTestResult.message}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bottom Save Trigger */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-[#00a884] hover:bg-[#009272] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all"
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Guardando...' : 'Guardar y Aplicar Marca'}
              </button>
            </div>

          </form>
        </div>

        {/* Right Column: Live Real-Time Interactive Mockup Panel (5 Columns) */}
        <div className="lg:col-span-5 space-y-4 sticky top-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 space-y-3">
            
            {/* Header & Controls for Live Mockup */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#00a884]" />
                <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Vista Previa En Vivo</span>
              </div>

              {/* Mode & Collapse Controls */}
              <div className="flex items-center gap-2">
                
                {/* Dark vs Light Navigation Mockup Toggle */}
                {previewMode === 'dashboard' && (
                  <button
                    type="button"
                    onClick={() => {
                      const nextNavTheme = mockNavTheme === 'light' ? 'dark' : 'light';
                      setMockNavTheme(nextNavTheme);
                      setForm((prev: any) => ({ ...prev, dark_theme: nextNavTheme }));
                    }}
                    className={`p-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1 ${
                      mockNavTheme === 'dark' ? 'bg-slate-900 text-white border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                    title="Alternar entre modo claro y modo oscuro específicamente para la navegación"
                  >
                    {mockNavTheme === 'light' ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
                    <span className="text-[10px] uppercase">Nav {mockNavTheme}</span>
                  </button>
                )}

                {/* Expanded vs Collapsed Sidebar Toggle */}
                {previewMode === 'dashboard' && (
                  <button
                    type="button"
                    onClick={() => {
                      const nextCollapsed = !mockCollapsed;
                      setMockCollapsed(nextCollapsed);
                      const nextMode = nextCollapsed ? 'compact' : 'normal';
                      setForm((prev: any) => ({ ...prev, navigation_mode: nextMode }));
                      if (typeof window !== 'undefined') {
                        localStorage.setItem('santun_sidebar_collapsed', String(nextCollapsed));
                        window.dispatchEvent(new Event('sidebar-state-changed'));
                      }
                    }}
                    className={`p-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1 ${
                      mockCollapsed ? 'bg-emerald-50 text-[#00a884] border-emerald-300' : 'bg-slate-100 text-slate-700'
                    }`}
                    title="Alternar entre menú expandido e isotipo compacto para la navegación"
                  >
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span className="text-[10px] uppercase">{mockCollapsed ? 'Compacto' : 'Normal'}</span>
                  </button>
                )}

                {/* View Switcher */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setPreviewMode('dashboard')}
                    className={`px-2 py-1 text-[10px] font-bold rounded ${
                      previewMode === 'dashboard' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode('login')}
                    className={`px-2 py-1 text-[10px] font-bold rounded ${
                      previewMode === 'login' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>

            {/* MOCKUP CONTAINER */}
            <div 
              className={`border border-slate-300 rounded-xl overflow-hidden shadow-inner transition-all duration-300 min-h-[460px] flex flex-col ${
                mockTheme === 'dark' && previewMode === 'dashboard' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800'
              }`}
              style={{ fontFamily: form.font_family }}
            >
              
              {previewMode === 'dashboard' ? (
                /* DASHBOARD MOCKUP */
                (() => {
                  const isMockDark = mockNavTheme === 'dark';
                  const isHexDark = (hex?: string | null): boolean => {
                    if (!hex) return false;
                    let color = hex.replace('#', '');
                    if (color.length === 3) color = color.split('').map(c => c + c).join('');
                    if (color.length !== 6) return false;
                    const r = parseInt(color.substring(0, 2), 16);
                    const g = parseInt(color.substring(2, 4), 16);
                    const b = parseInt(color.substring(4, 6), 16);
                    return (r * 299 + g * 587 + b * 114) / 1000 < 160;
                  };
                  const effectivePreviewMenuBg = form.menu_background
                    ? (isMockDark
                        ? (isHexDark(form.menu_background) ? form.menu_background : '#161a1b')
                        : (isHexDark(form.menu_background) ? '#ffffff' : form.menu_background))
                    : (isMockDark ? '#161a1b' : '#ffffff');

                  return (
                    <div className="flex flex-1 min-h-[460px]">
                      
                      {/* Mock Sidebar */}
                      <div 
                        className={`p-3 flex flex-col justify-between transition-all duration-300 ${
                          isMockDark ? 'text-white' : 'text-slate-800'
                        } ${
                          mockCollapsed ? 'w-16 items-center' : 'w-44'
                        }`}
                        style={{ backgroundColor: effectivePreviewMenuBg }}
                      >
                        <div className="space-y-4 w-full">
                          
                          {/* Dynamic Logo Rendering based on mode & collapse state */}
                          <div className={`flex items-center justify-center border-b pb-3 min-h-[36px] ${
                            isMockDark ? 'border-white/10' : 'border-slate-200'
                          }`}>
                            {mockCollapsed ? (
                              /* Compact Sidebar: Render Isotipo (logo_icon) */
                              form.logo_icon ? (
                                <img src={form.logo_icon} alt="Isotipo" className="w-8 h-8 object-contain" />
                              ) : (
                                <div className={`w-8 h-8 rounded flex items-center justify-center font-black text-xs ${
                                  isMockDark ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'
                                }`}>
                                  {(form.name || 'S')[0]}
                                </div>
                              )
                            ) : (
                              /* Expanded Sidebar: Render Dark or Light Logo based on mockNavTheme */
                              mockNavTheme === 'dark' ? (
                                (form.logo_2 || form.logo) ? (
                                  <img src={form.logo_2 || form.logo} alt="Logo Dark" className="h-7 max-w-[120px] object-contain" />
                                ) : (
                                  <span className="font-extrabold text-sm tracking-tight text-white uppercase">{form.name || 'SANTUN'}</span>
                                )
                              ) : (
                                (form.logo || form.logo_2) ? (
                                  <img src={form.logo || form.logo_2} alt="Logo Light" className="h-7 max-w-[120px] object-contain" />
                                ) : (
                                  <span className="font-extrabold text-sm tracking-tight text-slate-900 uppercase">{form.name || 'SANTUN'}</span>
                                )
                              )
                            )}
                          </div>

                          {/* Navigation Links */}
                          <div className="space-y-1 text-[11px]">
                            <div className={`px-2 py-1.5 rounded-lg font-bold flex items-center gap-2 justify-center sm:justify-start ${
                              isMockDark ? 'bg-white/10 text-white' : 'bg-slate-200/80 text-slate-900'
                            }`}>
                              <span>🏠</span> {!mockCollapsed && <span>Inicio</span>}
                            </div>
                            <div className={`px-2 py-1.5 rounded-lg font-medium flex items-center gap-2 justify-center sm:justify-start ${
                              isMockDark ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
                            }`}>
                              <span>📋</span> {!mockCollapsed && <span>ACM</span>}
                            </div>
                            <div className={`px-2 py-1.5 rounded-lg font-medium flex items-center gap-2 justify-center sm:justify-start ${
                              isMockDark ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
                            }`}>
                              <span>🏢</span> {!mockCollapsed && <span>Inmuebles</span>}
                            </div>
                          </div>
                        </div>

                        {!mockCollapsed && (
                          <div className={`text-[9px] border-t pt-2 text-center ${
                            isMockDark ? 'text-slate-400 border-white/10' : 'text-slate-500 border-slate-200'
                          }`}>
                            {form.name || 'Marca'} v2026
                          </div>
                        )}
                      </div>

                      {/* Mock Dashboard Body */}
                      <div className={`flex-1 p-4 space-y-3 flex flex-col ${mockTheme === 'dark' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-800'}`}>
                        
                        {/* Top Bar Header */}
                        <div className={`p-2.5 rounded-xl border flex justify-between items-center shadow-2xs ${
                          mockTheme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                        }`}>
                          <span className="text-[11px] font-bold">Resumen de Ecosistema</span>
                          <span 
                            className="px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase"
                            style={{ backgroundColor: form.primary_color }}
                          >
                            En Vivo
                          </span>
                        </div>

                        {/* Stat Cards */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className={`p-2.5 rounded-xl border ${mockTheme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                            <span className="text-[9px] font-bold opacity-60 block uppercase">Avalúos ACM</span>
                            <span className="text-sm font-black">24 Activos</span>
                          </div>
                          <div className={`p-2.5 rounded-xl border ${mockTheme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                            <span className="text-[9px] font-bold opacity-60 block uppercase">Propiedades</span>
                            <span className="text-sm font-black">142 En Lista</span>
                          </div>
                        </div>

                        {/* Styled Primary Action Button */}
                        <div className={`p-3 rounded-xl border space-y-2 ${mockTheme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                          <span className="text-[10px] font-bold opacity-60 uppercase block">Botón de Acción Corporativo:</span>
                          <button
                            type="button"
                            className={`w-full py-2 px-3 text-xs font-bold text-white transition-all shadow-sm ${form.border_radius}`}
                            style={{ backgroundColor: form.button_color }}
                          >
                            + Nuevo Expediente Pericial
                          </button>
                        </div>

                        {/* Footer Branding Info */}
                        <div className="mt-auto text-[9px] opacity-40 text-center pt-2 border-t border-slate-700/30">
                          {form.legal_name ? `${form.legal_name} • ` : ''}{form.email || 'contacto@marca.com'}
                        </div>

                      </div>
                    </div>
                  );
                })()
              ) : (
                /* LOGIN MOCKUP */
                <div 
                  className="flex-1 min-h-[460px] flex items-center justify-center p-6 bg-cover bg-center relative overflow-hidden"
                  style={{ 
                    backgroundImage: (form.login_background && !form.login_background.toLowerCase().includes('.mp4') && !form.login_background.startsWith('data:video/')) ? `url(${form.login_background})` : 'none',
                    backgroundColor: form.secondary_color || '#161a1b'
                  }}
                >
                  {form.login_background && (form.login_background.toLowerCase().includes('.mp4') || form.login_background.startsWith('data:video/')) && (
                    <video
                      src={form.login_background}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"></div>
                  
                  <div className={`relative z-10 bg-white/95 p-6 w-full max-w-xs shadow-2xl space-y-4 border border-white/20 ${form.border_radius}`}>
                    <div className="text-center space-y-1">
                      {form.logo ? (
                        <img src={form.logo} alt="Logo" className="h-8 max-w-[130px] object-contain mx-auto mb-2" />
                      ) : (
                        <h3 className="font-extrabold text-base text-slate-900 uppercase">{form.name || 'SANTUN'}</h3>
                      )}
                      <p className="text-[10px] text-slate-500 font-medium">Inicie sesión en su portal corporativo</p>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase block">Correo Electrónico:</span>
                        <div className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded text-[11px] text-slate-600">usuario@agencia.com</div>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase block">Contraseña:</span>
                        <div className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded text-[11px] text-slate-400">••••••••••••</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`w-full py-2 px-3 text-xs font-bold text-white transition-all shadow-md ${form.border_radius}`}
                      style={{ backgroundColor: form.button_color }}
                    >
                      Ingresar al Ecosistema
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
