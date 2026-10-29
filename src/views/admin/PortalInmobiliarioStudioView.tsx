'use client';

import React, { useEffect, useState } from 'react';
import {
  Globe, Sparkles, Building2, ShieldCheck, CheckCircle2, AlertTriangle, AlertCircle,
  RefreshCw, Loader2, ExternalLink, Eye, Image as ImageIcon, Laptop, Tablet, Smartphone,
  Search, Check, Palette, Save, Phone, Mail, FileText, HelpCircle, Layers, Copy,
  Target, Compass, Users, Megaphone, Video, Play
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import { whiteLabelService } from '@/services/whiteLabelService';
import { workspaceMetaService } from '@/services/workspaceMetaService';
import { useAuth } from '@/context/AuthContext';
import MediaPicker from '@/components/media/MediaPicker';
import PortalLivePreview from '@/components/inmobiliaria/PortalLivePreview';
import PublicPortalLoader from '@/components/inmobiliaria/PublicPortalLoader';
import EstateCatalogManagementView from '@/components/admin/EstateCatalogManagementView';
import EstateApprovalSettingsPanel from '@/components/estates/EstateApprovalSettingsPanel';
import {
  FREE_STOCK_HERO_IMAGES,
  FREE_STOCK_HERO_VIDEOS,
  DEFAULT_REAL_ESTATE_TERMS,
  DEFAULT_REAL_ESTATE_PRIVACY,
} from '@/constants/realEstateDefaults';

const REAL_ESTATE_COLOR_PRESETS = [
  { name: 'Esmeralda Premier', primary: '#00a884', secondary: '#161a1b' },
  { name: 'Azul Ejecutivo', primary: '#0284c7', secondary: '#0f172a' },
  { name: 'Grafito & Oro', primary: '#d97706', secondary: '#18181b' },
  { name: 'Azul Zafiro', primary: '#2563eb', secondary: '#0f172a' },
  { name: 'Terracota Cálido', primary: '#ea580c', secondary: '#1c1917' },
  { name: 'Verde Bosque Lujo', primary: '#059669', secondary: '#064e3b' },
];

export const PortalInmobiliarioStudioView: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin' || user?.roles?.some((r: any) => r.name === 'super_admin');
  const isWhiteLabelAdmin = user?.role === 'white_label_admin' || user?.roles?.some((r: any) => r.name === 'white_label_admin');
  const canView = isSuperAdmin || hasPermission(['portal_inmobiliario.view', 'portal_inmobiliario.manage', 'portal_inmobiliario']);
  const canManage = isSuperAdmin || hasPermission(['portal_inmobiliario.manage', 'portal_inmobiliario']);
  const [agencies, setAgencies] = useState<any[]>([]);
  const [selectedAgencyId, setSelectedAgencyId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedDns, setCopiedDns] = useState<boolean>(false);

  // Studio tabs & device preview
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'hero' | 'sections' | 'about' | 'cta' | 'domain' | 'identity' | 'seo' | 'legal_crm' | 'catalog' | 'approvals'>('hero');
  const [showLoaderPreview, setShowLoaderPreview] = useState<boolean>(false);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [loadingWorkspaces, setLoadingWorkspaces] = useState<boolean>(false);

  // Form state
  const [form, setForm] = useState<any>({
    name: '',
    domain: '',
    frontend_enabled: true,
    custom_domain_verified: false,
    banner_image: '',
    hero_title: 'Encuentra el Inmueble de tus Sueños',
    hero_subtitle: 'Las mejores propiedades en venta y alquiler con asesoría profesional garantizada.',
    about_title: 'Conócenos — Tu aliado inmobiliario de confianza',
    about_text: 'Nos dedicamos a conectar compradores y vendedores con las mejores oportunidades del mercado inmobiliario, ofreciendo transparencia, seguridad jurídica y el mejor servicio.',
    cta_text: '¿Deseas vender o alquilar tu propiedad? Contáctanos hoy mismo.',
    primary_color: '#00a884',
    secondary_color: '#161a1b',
    logo: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    city: '',
    province: '',
    seo_title: '',
    seo_description: '',
    details: {
      target_workspace_id: '',
      show_topbar: true,
      topbar_text1: 'Propiedades Exclusivas con Asesoría Legal Garantizada',
      topbar_text2: '¿Deseas vender o rentar tu inmueble? Consigna tu propiedad con los expertos',
      topbar_text3: 'Nuevos Desarrollos y Casas en Venta con Financiamiento Bancario Directo',
      footer_logo: '',
      terms_and_conditions: '',
      privacy_policy: '',
      hero_media_type: 'video',
      banner_video: '/assets/video/home4-banner-video.mp4',
      hero_tab1: 'En Venta',
      hero_tab2: 'En Renta',
      hero_tab3: 'Terrenos & Lotes',
      hero_tab4: 'Comercial',
      hero_search_btn: 'Buscar Propiedades',
      categories_title: 'Categorías Principales',
      categories_subtitle: 'Descubre opciones pensadas para cada estilo de vida e inversión patrimonial.',
      featured_title: 'Propiedades Destacadas',
      featured_subtitle: 'Selección curada de inmuebles residenciales y comerciales con alta plusvalía y respaldo legal.',
      featured_btn_text: 'Ver Todo el Catálogo de Propiedades',
      about_stat1_num: '15',
      about_stat1_label: 'Años de Trayectoria',
      about_stat2_num: '3,500',
      about_stat2_label: 'Clientes Satisfechos',
      about_item1: 'Propiedades 100% Verificadas Jurídicamente',
      about_item2: 'Asesoría en Créditos Hipotecarios & Notariales',
      about_item3: 'Acompañamiento Personalizado de Principio a Fin',
      why_title: '¿Por Qué Elegirnos?',
      why_subtitle: 'Protegemos tu patrimonio con los más altos estándares de calidad, certeza jurídica y conocimiento del mercado local.',
      why_rating_text: '4.9',
      counter1_num: '1,250',
      counter1_label: 'Inmuebles Comercializados',
      counter2_num: '15',
      counter2_label: 'Años de Experiencia',
      counter3_num: '3,500',
      counter3_label: 'Familias Satisfechas',
      counter4_num: '99',
      counter4_label: 'Tasa de Satisfacción',
      cta_badge: 'Servicio Exclusivo a Propietarios',
      cta_title: '¿Quieres Vender o Rentar tu Inmueble Rápido y Seguro?',
      cta_button_text: 'Consignar mi Inmueble',
      faq_title: 'Preguntas Frecuentes',
      faq_subtitle: 'Resolvemos las dudas más comunes para que compres, vendas o rentes con total tranquilidad.',
      footer_about_text: 'Agencia inmobiliaria líder especializada en asesoría, compra, venta y alquiler de bienes raíces exclusivos.',
      footer_copyright: 'Todos los derechos reservados.',
    },
  });

  // DNS Verification state
  const [verifyingDomain, setVerifyingDomain] = useState<boolean>(false);
  const [domainVerificationResult, setDomainVerificationResult] = useState<{ verified: boolean; message: string } | null>(null);

  // Load Agencies
  useEffect(() => {
    loadAgencies();
  }, []);

  const loadAgencies = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAgencies();
      const list = Array.isArray(res) ? res : ((res as any)?.data || []);
      setAgencies(list);

      // Select agency based on user context
      let targetAgency = list[0];
      if (user?.agency_id) {
        const found = list.find((a: any) => a.id === user.agency_id);
        if (found) targetAgency = found;
      }

      if (targetAgency) {
        setSelectedAgencyId(targetAgency.id);
        populateAgency(targetAgency);
      }
    } catch (err) {
      console.error('Error cargando agencias:', err);
      setErrorMsg('No se pudieron cargar las agencias.');
    } finally {
      setLoading(false);
    }
  };

  const populateAgency = (ag: any) => {
    const rawDetails = ag.details || {};
    const parsedDetails = typeof rawDetails === 'string' ? JSON.parse(rawDetails) : rawDetails;

    setForm({
      name: ag.name || '',
      domain: ag.domain || '',
      frontend_enabled: Boolean(ag.frontend_enabled ?? true),
      custom_domain_verified: Boolean(ag.custom_domain_verified ?? false),
      banner_image: ag.banner_image || '',
      hero_title: ag.hero_title || 'Encuentra el Inmueble de tus Sueños',
      hero_subtitle: ag.hero_subtitle || 'Las mejores propiedades en venta y alquiler con asesoría profesional garantizada.',
      about_title: ag.about_title || 'Conócenos — Tu aliado inmobiliario de confianza',
      about_text: ag.about_text || ag.description || 'Nos dedicamos a conectar compradores y vendedores con las mejores oportunidades del mercado inmobiliario.',
      cta_text: ag.cta_text || '¿Deseas vender o alquilar tu propiedad? Contáctanos hoy mismo.',
      primary_color: ag.primary_color || '#00a884',
      secondary_color: ag.secondary_color || '#161a1b',
      logo: ag.logo || '',
      phone: ag.phone || '',
      whatsapp: ag.whatsapp || ag.phone || '',
      email: ag.email || '',
      address: ag.address || '',
      city: ag.city || '',
      province: ag.province || '',
      seo_title: ag.seo_title || `${ag.name || 'Inmobiliaria'} — Portal Oficial`,
      seo_description: ag.seo_description || `Explora las mejores propiedades en venta y alquiler con ${ag.name || 'nuestra agencia'}.`,
      details: {
        target_workspace_id: parsedDetails?.target_workspace_id || '',
        show_topbar: parsedDetails?.show_topbar !== undefined
          ? !(
              parsedDetails.show_topbar === false ||
              parsedDetails.show_topbar === 'false' ||
              parsedDetails.show_topbar === 0 ||
              parsedDetails.show_topbar === '0'
            )
          : true,
        topbar_text1: parsedDetails?.topbar_text1 ?? 'Propiedades Exclusivas con Asesoría Legal Garantizada',
        topbar_text2: parsedDetails?.topbar_text2 ?? (ag.cta_text || '¿Deseas vender o rentar tu inmueble? Consigna tu propiedad con los expertos'),
        topbar_text3: parsedDetails?.topbar_text3 ?? 'Nuevos Desarrollos y Casas en Venta con Financiamiento Bancario Directo',
        footer_logo: parsedDetails?.footer_logo || ag.footer_logo || '',
        terms_and_conditions: parsedDetails?.terms_and_conditions || '',
        privacy_policy: parsedDetails?.privacy_policy || '',
        hero_media_type: parsedDetails?.hero_media_type || (ag.banner_video || parsedDetails?.banner_video ? 'video' : (ag.banner_image ? 'image' : 'video')),
        banner_video: parsedDetails?.banner_video || ag.banner_video || '/assets/video/home4-banner-video.mp4',
        hero_tab1: parsedDetails?.hero_tab1 || 'En Venta',
        hero_tab2: parsedDetails?.hero_tab2 || 'En Renta',
        hero_tab3: parsedDetails?.hero_tab3 || 'Terrenos & Lotes',
        hero_tab4: parsedDetails?.hero_tab4 || 'Comercial',
        hero_search_btn: parsedDetails?.hero_search_btn || 'Buscar Propiedades',
        categories_title: parsedDetails?.categories_title || 'Categorías Principales',
        categories_subtitle: parsedDetails?.categories_subtitle || 'Descubre opciones pensadas para cada estilo de vida e inversión patrimonial.',
        featured_title: parsedDetails?.featured_title || 'Propiedades Destacadas',
        featured_subtitle: parsedDetails?.featured_subtitle || 'Selección curada de inmuebles residenciales y comerciales con alta plusvalía y respaldo legal.',
        featured_btn_text: parsedDetails?.featured_btn_text || 'Ver Todo el Catálogo de Propiedades',
        about_stat1_num: parsedDetails?.about_stat1_num || '15',
        about_stat1_label: parsedDetails?.about_stat1_label || 'Años de Trayectoria',
        about_stat2_num: parsedDetails?.about_stat2_num || '3,500',
        about_stat2_label: parsedDetails?.about_stat2_label || 'Clientes Satisfechos',
        about_item1: parsedDetails?.about_item1 || 'Propiedades 100% Verificadas Jurídicamente',
        about_item2: parsedDetails?.about_item2 || 'Asesoría en Créditos Hipotecarios & Notariales',
        about_item3: parsedDetails?.about_item3 || 'Acompañamiento Personalizado de Principio a Fin',
        why_title: parsedDetails?.why_title || '¿Por Qué Elegirnos?',
        why_subtitle: parsedDetails?.why_subtitle || 'Protegemos tu patrimonio con los más altos estándares de calidad, certeza jurídica y conocimiento del mercado local.',
        why_rating_text: parsedDetails?.why_rating_text || '4.9',
        counter1_num: parsedDetails?.counter1_num || '1,250',
        counter1_label: parsedDetails?.counter1_label || 'Inmuebles Comercializados',
        counter2_num: parsedDetails?.counter2_num || '15',
        counter2_label: parsedDetails?.counter2_label || 'Años de Experiencia',
        counter3_num: parsedDetails?.counter3_num || '3,500',
        counter3_label: parsedDetails?.counter3_label || 'Familias Satisfechas',
        counter4_num: parsedDetails?.counter4_num || '99',
        counter4_label: parsedDetails?.counter4_label || 'Tasa de Satisfacción',
        cta_badge: parsedDetails?.cta_badge || 'Servicio Exclusivo a Propietarios',
        cta_title: parsedDetails?.cta_title || '¿Quieres Vender o Rentar tu Inmueble Rápido y Seguro?',
        cta_button_text: parsedDetails?.cta_button_text || 'Consignar mi Inmueble',
        faq_title: parsedDetails?.faq_title || 'Preguntas Frecuentes',
        faq_subtitle: parsedDetails?.faq_subtitle || 'Resolvemos las dudas más comunes para que compres, vendas o rentes con total tranquilidad.',
        footer_about_text: parsedDetails?.footer_about_text || ag.description || 'Agencia inmobiliaria líder especializada en asesoría, compra, venta y alquiler de bienes raíces exclusivos.',
        footer_copyright: parsedDetails?.footer_copyright || 'Todos los derechos reservados.',
      },
    });
  };

  const handleSelectAgency = (id: number) => {
    setSelectedAgencyId(id);
    const found = agencies.find((a: any) => a.id === id);
    if (found) populateAgency(found);
    loadWorkspaces(id);
  };

  const loadWorkspaces = async (agencyId: number) => {
    if (!agencyId) return;
    setLoadingWorkspaces(true);
    try {
      const list = await workspaceMetaService.getWorkspaces(agencyId);
      setWorkspaces(Array.isArray(list) ? list : []);
    } catch {
      setWorkspaces([]);
    } finally {
      setLoadingWorkspaces(false);
    }
  };

  useEffect(() => {
    if (selectedAgencyId) {
      loadWorkspaces(selectedAgencyId);
    }
  }, [selectedAgencyId]);

  const updateDetailField = (key: string, value: any) => {
    setForm((prev: any) => ({
      ...prev,
      details: {
        ...(prev.details || {}),
        [key]: value,
      },
    }));
  };

  const handleVerifyDomain = async () => {
    if (!selectedAgencyId) return;
    setVerifyingDomain(true);
    setDomainVerificationResult(null);
    try {
      const res = await adminService.verifyDomain(selectedAgencyId);
      setDomainVerificationResult({
        verified: res.data?.verified,
        message: res.message,
      });
      if (res.data?.verified) {
        setForm((prev: any) => ({ ...prev, custom_domain_verified: true }));
      }
    } catch (err: any) {
      setDomainVerificationResult({
        verified: false,
        message: err.response?.data?.message || 'Error al conectar con los servidores DNS.',
      });
    } finally {
      setVerifyingDomain(false);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!canManage) {
      setErrorMsg('No tiene permisos para modificar la configuración del portal.');
      return;
    }
    if (!selectedAgencyId) {
      setErrorMsg('Selecciona una agencia primero.');
      return;
    }

    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const payload: any = {
        name: form.name,
        domain: form.domain,
        frontend_enabled: form.frontend_enabled,
        banner_image: form.banner_image,
        banner_video: form.details?.banner_video || form.banner_video || '',
        hero_title: form.hero_title,
        hero_subtitle: form.hero_subtitle,
        about_title: form.about_title,
        about_text: form.about_text,
        cta_text: form.cta_text,
        primary_color: form.primary_color,
        secondary_color: form.secondary_color,
        logo: form.logo,
        phone: form.phone,
        whatsapp: form.whatsapp,
        email: form.email,
        address: form.address,
        city: form.city,
        province: form.province,
        seo_title: form.seo_title,
        seo_description: form.seo_description,
        details: {
          ...(form.details || {}),
          banner_video: form.details?.banner_video || form.banner_video || '',
        },
      };

      await adminService.updateAgency(selectedAgencyId, payload);

      // Limpiar caché local para que la vista pública cargue al instante las nuevas configuraciones
      if (typeof window !== 'undefined') {
        try {
          const doms = [
            effectiveDomain,
            'inmosoft.pro',
            'localhost',
            'default',
            (form.domain || '').replace(/^https?:\/\//i, '').split('/')[0].split(':')[0].toLowerCase()
          ].filter(Boolean);
          doms.forEach(d => {
            localStorage.removeItem(`inmo_cfg_${d}`);
            sessionStorage.removeItem(`inmo_cfg_${d}`);
          });
        } catch {}
      }

      setAgencies((prev: any[]) =>
        prev.map((a: any) =>
          a.id === selectedAgencyId ? { ...a, ...payload, details: form.details } : a
        )
      );

      setSuccessMsg('¡Portal Inmobiliario actualizado con éxito! Los cambios ya se reflejan en la vista pública.');
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: any) {
      console.error('Error guardando cambios del portal:', err);
      setErrorMsg(err.response?.data?.message || 'Error al guardar los cambios del portal.');
    } finally {
      setSaving(false);
    }
  };

  const effectiveDomain = form.domain
    ? form.domain.replace(/^https?:\/\//i, '').split('/')[0]
    : 'inmosoft.pro';

  const previewLiveUrl = form.domain
    ? (form.domain.startsWith('http') ? form.domain : `https://${form.domain}`)
    : `/travel-agency-03?domain=${encodeURIComponent(effectiveDomain)}`;

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
          <p className="text-xs font-bold text-slate-600">Cargando Estudio del Portal Inmobiliario...</p>
        </div>
      </div>
    );
  }

  if (!canView) {
    return (
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50 p-10 text-center shadow-sm max-w-xl mx-auto my-12">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
          <Globe className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Módulo Portal Inmobiliario No Contratado
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          El portal web inmobiliario con dominio personalizado no se encuentra habilitado en la suscripción activa de su agencia. Contacte al administrador de su Marca Blanca para actualizar su plan y activar este módulo.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* 1. Header Studio Banner */}
      <div className="p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-slate-900 rounded-3xl shadow-xl text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-extrabold uppercase tracking-wider text-emerald-100">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>Estudio Dedicado • Portal Inmobiliario Web</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Constructor &amp; Personalizador de Frontend Inmobiliario
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
              Personaliza todos los textos, imágenes de portada, fotografías de stock, paletas de color y dominio público de tu portal web en tiempo real.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Switch Habilitar Portal */}
            <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/20 flex items-center gap-3">
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-emerald-200 block">Estado del Sitio:</span>
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${form.frontend_enabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} />
                  {form.frontend_enabled ? 'Portal Activo' : 'Desactivado'}
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(form.frontend_enabled)}
                  onChange={(e) => setForm({ ...form, frontend_enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-400"></div>
              </label>
            </div>

            {/* Botón Guardar Cambios */}
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={saving || !canManage}
              className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? 'Guardando...' : 'Guardar Todo el Portal'}</span>
            </button>
          </div>
        </div>

        {/* Agency Switcher Bar if multiple */}
        {agencies.length > 1 && (
          <div className="mt-4 pt-4 border-t border-white/20 flex flex-wrap items-center gap-3 text-xs">
            <span className="font-bold text-emerald-200">Agencia Actual:</span>
            <select
              value={selectedAgencyId || ''}
              onChange={(e) => handleSelectAgency(Number(e.target.value))}
              className="bg-slate-900/80 text-white font-bold px-3 py-1.5 rounded-xl border border-white/30 text-xs focus:ring-2 focus:ring-emerald-400"
            >
              {agencies.map((a: any) => (
                <option key={a.id} value={a.id}>
                  🏢 {a.name} ({a.domain || 'sin dominio'})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Notificaciones */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-2xl flex items-center gap-2 shadow-sm animate-fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 2. Main Studio Grid: Form (Left 6 cols) + Live Preview (Right 6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COLUMNA IZQUIERDA: CONTROLES DEL EDITOR */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Navegación por Pestañas del Editor */}
          <div className="flex flex-wrap gap-1 p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab('hero')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'hero' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Portada &amp; Buscador</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('sections')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'sections' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Textos de Secciones</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('about')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'about' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Conócenos</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('cta')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'cta' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Consignación (CTA)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('domain')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'domain' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Dominio &amp; DNS</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('identity')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'identity' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Colores &amp; Marca</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('seo')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'seo' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>SEO &amp; Redes</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('legal_crm')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'legal_crm' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Legal &amp; CRM</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('catalog')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'catalog' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Destinos &amp; Categorías</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-black uppercase">WL</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('approvals')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'approvals' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Aprobaciones &amp; Alertas</span>
            </button>
          </div>

          {/* CONTENIDO DEL FORMULARIO SEGÚN PESTAÑA */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">

            {/* TAB 1: HERO & PORTADA */}
            {activeTab === 'hero' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-emerald-600" /> Portada Principal &amp; Encabezado Hero
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Personaliza los títulos principales y el fondo de alto impacto que ven los visitantes al entrar a tu portal.
                  </p>
                </div>

                {/* Cinta Superior de Anuncios (Topbar Slider) */}
                <div className="p-4 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/60 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-amber-900 dark:text-amber-200 uppercase flex items-center gap-1.5">
                        <Megaphone className="w-4 h-4 text-amber-600" /> Cinta Superior de Anuncios (Topbar)
                      </h4>
                      <p className="text-[11px] text-amber-700/90 dark:text-amber-300/80 mt-0.5">
                        Barra superior rotativa para avisos, promociones, garantías o mensajes clave.
                      </p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.details?.show_topbar !== false}
                        onChange={(e) => updateDetailField('show_topbar', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                      <span className="ml-2 text-xs font-extrabold text-amber-900 dark:text-amber-200">
                        {form.details?.show_topbar !== false ? 'Visible' : 'Oculta'}
                      </span>
                    </label>
                  </div>

                  {form.details?.show_topbar !== false && (
                    <div className="space-y-3 pt-2 border-t border-amber-200/60 dark:border-amber-800/40">
                      <div>
                        <label className="block text-[11px] font-bold text-amber-900 dark:text-amber-200 mb-1">
                          Mensaje 1 (Rotación 1):
                        </label>
                        <input
                          type="text"
                          value={form.details?.topbar_text1 ?? 'Propiedades Exclusivas con Asesoría Legal Garantizada'}
                          onChange={(e) => updateDetailField('topbar_text1', e.target.value)}
                          placeholder="Ej: Propiedades Exclusivas con Asesoría Legal Garantizada"
                          className="w-full px-3 py-2 text-xs font-bold bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 rounded-xl text-slate-800 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-amber-900 dark:text-amber-200 mb-1">
                          Mensaje 2 (Rotación 2):
                        </label>
                        <input
                          type="text"
                          value={form.details?.topbar_text2 ?? '¿Deseas vender o rentar tu inmueble? Consigna tu propiedad con los expertos'}
                          onChange={(e) => updateDetailField('topbar_text2', e.target.value)}
                          placeholder="Ej: ¿Deseas vender o rentar tu inmueble? Consigna tu propiedad con los expertos"
                          className="w-full px-3 py-2 text-xs font-bold bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 rounded-xl text-slate-800 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-amber-900 dark:text-amber-200 mb-1">
                          Mensaje 3 (Rotación 3 - Opcional):
                        </label>
                        <input
                          type="text"
                          value={form.details?.topbar_text3 ?? 'Nuevos Desarrollos y Casas en Venta con Financiamiento Bancario Directo'}
                          onChange={(e) => updateDetailField('topbar_text3', e.target.value)}
                          placeholder="Ej: Nuevos Desarrollos y Casas en Venta con Financiamiento Bancario Directo"
                          className="w-full px-3 py-2 text-xs font-bold bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 rounded-xl text-slate-800 dark:text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Título Principal del Hero:
                    </label>
                    <input
                      type="text"
                      value={form.hero_title || ''}
                      onChange={(e) => setForm({ ...form, hero_title: e.target.value })}
                      placeholder="Ej: Encuentra el Inmueble de tus Sueños"
                      className="w-full px-4 py-2.5 text-xs font-bold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Subtítulo Descriptivo:
                    </label>
                    <textarea
                      rows={2}
                      value={form.hero_subtitle || ''}
                      onChange={(e) => setForm({ ...form, hero_subtitle: e.target.value })}
                      placeholder="Ej: Las mejores opciones residenciales y comerciales con certeza jurídica y asesoría profesional."
                      className="w-full px-4 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  {/* Selector de Recurso: Imagen o Video de Portada */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                        Recurso del Banner Principal (Hero):
                      </label>
                      <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                        <button
                          type="button"
                          onClick={() => updateDetailField('hero_media_type', 'image')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            form.details?.hero_media_type === 'image'
                              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>📸 Imagen</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => updateDetailField('hero_media_type', 'video')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            form.details?.hero_media_type !== 'image'
                              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>🎬 Video</span>
                        </button>
                      </div>
                    </div>

                    {/* VISTA A: CONFIGURACIÓN DE IMAGEN */}
                    {form.details?.hero_media_type === 'image' ? (
                      <div className="space-y-3 animate-in fade-in duration-200">
                        <MediaPicker
                          value={form.banner_image || ''}
                          onChange={(selected) => setForm({ ...form, banner_image: selected?.url || '' })}
                          label="Seleccionar o Subir Fotografía de Portada"
                          type="image"
                        />

                        {/* Galería Gratuita en 1 Clic */}
                        <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/50 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                              Galería Gratuita de Arquitectura (Presets en 1 Clic)
                            </span>
                            <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold">Unsplash HD</span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {FREE_STOCK_HERO_IMAGES.map((img) => {
                              const isSelected = form.banner_image === img.url;
                              return (
                                <div
                                  key={img.id}
                                  onClick={() => setForm({ ...form, banner_image: img.url })}
                                  className={`group relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all h-20 ${
                                    isSelected ? 'border-emerald-600 ring-2 ring-emerald-400' : 'border-transparent hover:border-slate-300'
                                  }`}
                                >
                                  <img src={img.url} alt={img.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex flex-col justify-end p-1.5">
                                    <span className="text-[9px] font-bold text-white truncate">{img.name}</span>
                                    {isSelected && (
                                      <span className="text-[8px] font-black text-emerald-400 flex items-center gap-0.5">
                                        <Check className="w-2.5 h-2.5" /> Seleccionada
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* VISTA B: CONFIGURACIÓN DE VIDEO */
                      <div className="space-y-3 animate-in fade-in duration-200">
                        <div>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block mb-1.5">
                            Sube un archivo de video propio (MP4 o WebM) o ingresa un enlace directo:
                          </span>
                          <MediaPicker
                            value={form.details?.banner_video || form.banner_video || '/assets/video/home4-banner-video.mp4'}
                            onChange={(selected) => {
                              updateDetailField('banner_video', selected?.url || '');
                              setForm((prev: any) => ({ ...prev, banner_video: selected?.url || '' }));
                            }}
                            label="Subir o Seleccionar Video (MP4 / WebM)"
                            type="video"
                          />
                        </div>

                        {/* Input de URL directa de video */}
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold block mb-1">URL Directa del Video:</span>
                          <input
                            type="text"
                            value={form.details?.banner_video || form.banner_video || ''}
                            onChange={(e) => {
                              updateDetailField('banner_video', e.target.value);
                              setForm((prev: any) => ({ ...prev, banner_video: e.target.value }));
                            }}
                            placeholder="Ej: /assets/video/home4-banner-video.mp4 o https://cdn.ejemplo.com/video.mp4"
                            className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                          />
                        </div>

                        {/* Presets de Video en 1 Clic */}
                        <div className="p-4 bg-sky-50/60 dark:bg-sky-950/20 rounded-2xl border border-sky-200/80 dark:border-sky-800/50 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-sky-950 dark:text-sky-200 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                              Videos de Arquitectura &amp; Dron (Presets en 1 Clic)
                            </span>
                            <span className="text-[10px] text-sky-700 dark:text-sky-300 font-semibold">HD / Loop</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {FREE_STOCK_HERO_VIDEOS.map((vid) => {
                              const currentVid = form.details?.banner_video || form.banner_video || '/assets/video/home4-banner-video.mp4';
                              const isSelected = currentVid === vid.url;
                              return (
                                <div
                                  key={vid.id}
                                  onClick={() => {
                                    updateDetailField('banner_video', vid.url);
                                    setForm((prev: any) => ({ ...prev, banner_video: vid.url }));
                                  }}
                                  className={`group relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all p-2.5 flex items-center gap-3 bg-white dark:bg-slate-900 shadow-xs ${
                                    isSelected
                                      ? 'border-sky-600 ring-2 ring-sky-400 bg-sky-50/40 dark:bg-sky-950/40'
                                      : 'border-slate-200 dark:border-slate-800 hover:border-sky-300'
                                  }`}
                                >
                                  <div className="relative w-14 h-11 rounded-lg overflow-hidden bg-slate-800 shrink-0 flex items-center justify-center">
                                    {vid.poster && (
                                      <img src={vid.poster} alt="" className="w-full h-full object-cover brightness-75" />
                                    )}
                                    <Play className="w-4 h-4 text-white absolute inset-0 m-auto filter drop-shadow" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-[11px] font-bold text-slate-800 dark:text-slate-100 truncate">
                                      {vid.name}
                                    </div>
                                    <div className="text-[9.5px] text-slate-500 dark:text-slate-400 line-clamp-1">
                                      {vid.description}
                                    </div>
                                    {isSelected && (
                                      <span className="text-[8.5px] font-black text-sky-600 dark:text-sky-400 flex items-center gap-0.5 mt-0.5">
                                        <Check className="w-2.5 h-2.5" /> Video Seleccionado
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Reproductor de Vista Previa del Video */}
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-white space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                            <span className="flex items-center gap-1">
                              <Video className="w-3 h-3 text-sky-400" /> Vista Previa del Video en Bucle:
                            </span>
                            <span className="text-emerald-400 text-[9px] uppercase tracking-wider font-extrabold">Silenciado Automático</span>
                          </div>
                          <div className="relative aspect-[16/7] rounded-lg overflow-hidden bg-black shadow-inner">
                            <video
                              key={form.details?.banner_video || form.banner_video || '/assets/video/home4-banner-video.mp4'}
                              autoPlay
                              loop
                              muted
                              playsInline
                              src={form.details?.banner_video || form.banner_video || '/assets/video/home4-banner-video.mp4'}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
                            <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                              <span className="text-[10px] font-bold text-white drop-shadow">
                                {form.hero_title || 'Encuentra el Inmueble de tus Sueños'}
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-black/60 text-[8.5px] font-bold text-white/90">
                                1080p
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pestañas del Buscador Inmobiliario */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase">
                      Nombres de las Pestañas de Búsqueda:
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block mb-1">Pestaña 1 (Venta):</span>
                        <input
                          type="text"
                          value={form.details?.hero_tab1 || 'En Venta'}
                          onChange={(e) => updateDetailField('hero_tab1', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block mb-1">Pestaña 2 (Renta):</span>
                        <input
                          type="text"
                          value={form.details?.hero_tab2 || 'En Renta'}
                          onChange={(e) => updateDetailField('hero_tab2', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block mb-1">Pestaña 3 (Terrenos):</span>
                        <input
                          type="text"
                          value={form.details?.hero_tab3 || 'Terrenos & Lotes'}
                          onChange={(e) => updateDetailField('hero_tab3', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block mb-1">Pestaña 4 (Comercial):</span>
                        <input
                          type="text"
                          value={form.details?.hero_tab4 || 'Comercial'}
                          onChange={(e) => updateDetailField('hero_tab4', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: TEXTOS DE TODAS LAS SECCIONES */}
            {activeTab === 'sections' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" /> Textos de Todas las Secciones del Frontend
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Edita los encabezados, descripciones y llamadas a la acción de cada componente de tu página.
                  </p>
                </div>

                {/* Bloque: Categorías */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-black uppercase text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" /> Sección de Categorías
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 block mb-1">Título de la Sección:</span>
                      <input
                        type="text"
                        value={form.details?.categories_title || 'Categorías Principales'}
                        onChange={(e) => updateDetailField('categories_title', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 block mb-1">Subtítulo o Descripción:</span>
                      <input
                        type="text"
                        value={form.details?.categories_subtitle || 'Descubre opciones pensadas para cada estilo de vida e inversión patrimonial.'}
                        onChange={(e) => updateDetailField('categories_subtitle', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* Bloque: Propiedades Destacadas */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-black uppercase text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" /> Sección de Propiedades Destacadas
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 block mb-1">Título de la Sección:</span>
                      <input
                        type="text"
                        value={form.details?.featured_title || 'Propiedades Destacadas'}
                        onChange={(e) => updateDetailField('featured_title', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 block mb-1">Subtítulo o Descripción:</span>
                      <input
                        type="text"
                        value={form.details?.featured_subtitle || 'Selección curada de inmuebles residenciales y comerciales con alta plusvalía y respaldo legal.'}
                        onChange={(e) => updateDetailField('featured_subtitle', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 block mb-1">Texto del Botón Inferior:</span>
                      <input
                        type="text"
                        value={form.details?.featured_btn_text || 'Ver Todo el Catálogo de Propiedades'}
                        onChange={(e) => updateDetailField('featured_btn_text', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* Bloque: ¿Por Qué Elegirnos? */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-black uppercase text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Sección ¿Por Qué Elegirnos?
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 block mb-1">Título:</span>
                      <input
                        type="text"
                        value={form.details?.why_title || '¿Por Qué Elegirnos?'}
                        onChange={(e) => updateDetailField('why_title', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 block mb-1">Subtítulo / Compromiso:</span>
                      <input
                        type="text"
                        value={form.details?.why_subtitle || 'Protegemos tu patrimonio con los más altos estándares de calidad, certeza jurídica y conocimiento del mercado local.'}
                        onChange={(e) => updateDetailField('why_subtitle', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 block mb-1">Calificación de Clientes (Puntaje):</span>
                      <input
                        type="text"
                        value={form.details?.why_rating_text || '4.9'}
                        onChange={(e) => updateDetailField('why_rating_text', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* Bloque: Contadores & Métricas Numéricas */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-black uppercase text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Barra de 4 Métricas y Contadores
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold block mb-1">Métrica 1 (Número / Etiqueta):</span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={form.details?.counter1_num || '1,250'}
                          onChange={(e) => updateDetailField('counter1_num', e.target.value)}
                          className="w-20 px-2 py-1.5 text-xs bg-white dark:bg-slate-900 border rounded-lg"
                        />
                        <input
                          type="text"
                          value={form.details?.counter1_label || 'Inmuebles Comercializados'}
                          onChange={(e) => updateDetailField('counter1_label', e.target.value)}
                          className="flex-grow px-2 py-1.5 text-xs bg-white dark:bg-slate-900 border rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 font-bold block mb-1">Métrica 2 (Número / Etiqueta):</span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={form.details?.counter2_num || '15'}
                          onChange={(e) => updateDetailField('counter2_num', e.target.value)}
                          className="w-20 px-2 py-1.5 text-xs bg-white dark:bg-slate-900 border rounded-lg"
                        />
                        <input
                          type="text"
                          value={form.details?.counter2_label || 'Años de Experiencia'}
                          onChange={(e) => updateDetailField('counter2_label', e.target.value)}
                          className="flex-grow px-2 py-1.5 text-xs bg-white dark:bg-slate-900 border rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 font-bold block mb-1">Métrica 3 (Número / Etiqueta):</span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={form.details?.counter3_num || '3,500'}
                          onChange={(e) => updateDetailField('counter3_num', e.target.value)}
                          className="w-20 px-2 py-1.5 text-xs bg-white dark:bg-slate-900 border rounded-lg"
                        />
                        <input
                          type="text"
                          value={form.details?.counter3_label || 'Familias Satisfechas'}
                          onChange={(e) => updateDetailField('counter3_label', e.target.value)}
                          className="flex-grow px-2 py-1.5 text-xs bg-white dark:bg-slate-900 border rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 font-bold block mb-1">Métrica 4 (Porcentaje / Etiqueta):</span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={form.details?.counter4_num || '99'}
                          onChange={(e) => updateDetailField('counter4_num', e.target.value)}
                          className="w-20 px-2 py-1.5 text-xs bg-white dark:bg-slate-900 border rounded-lg"
                        />
                        <input
                          type="text"
                          value={form.details?.counter4_label || 'Tasa de Satisfacción'}
                          onChange={(e) => updateDetailField('counter4_label', e.target.value)}
                          className="flex-grow px-2 py-1.5 text-xs bg-white dark:bg-slate-900 border rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bloque: Preguntas Frecuentes */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-black uppercase text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" /> Sección de Preguntas Frecuentes
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 block mb-1">Título de la Sección FAQ:</span>
                      <input
                        type="text"
                        value={form.details?.faq_title || 'Preguntas Frecuentes'}
                        onChange={(e) => updateDetailField('faq_title', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 block mb-1">Subtítulo:</span>
                      <input
                        type="text"
                        value={form.details?.faq_subtitle || 'Resolvemos las dudas más comunes para que compres, vendas o rentes con total tranquilidad.'}
                        onChange={(e) => updateDetailField('faq_subtitle', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* Bloque: Footer */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-black uppercase text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> Pie de Página &amp; Información de Contacto
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 block mb-1">Resumen / Descripción en Footer:</span>
                      <textarea
                        rows={2}
                        value={form.details?.footer_about_text || form.about_text || ''}
                        onChange={(e) => updateDetailField('footer_about_text', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 block mb-1">Teléfono Público:</span>
                        <input
                          type="text"
                          value={form.phone || ''}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="+52 55 1234 5678"
                          className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border rounded-lg"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 block mb-1">WhatsApp Directo:</span>
                        <input
                          type="text"
                          value={form.whatsapp || ''}
                          onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                          placeholder="+52 55 1234 5678"
                          className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 block mb-1">Email de Contacto:</span>
                      <input
                        type="email"
                        value={form.email || ''}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="contacto@miagencia.com"
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CONÓCENOS (NOSOTROS) */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-600" /> Sección Conócenos / Identidad Institucional
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Configura la historia, misión, visión y equipo de agentes para la página pública de Conócenos.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* 1. Quiénes Somos */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-4">
                    <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                      Quiénes Somos / Presentación
                    </h4>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                        Título de Presentación:
                      </label>
                      <input
                        type="text"
                        value={form.about_title || ''}
                        onChange={(e) => setForm({ ...form, about_title: e.target.value })}
                        placeholder="Ej: Somos Tu Aliado Inmobiliario de Confianza"
                        className="w-full px-4 py-2.5 text-xs font-bold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                        Texto de Presentación e Historia:
                      </label>
                      <textarea
                        rows={3}
                        value={form.about_text || ''}
                        onChange={(e) => setForm({ ...form, about_text: e.target.value })}
                        placeholder="Especialistas en la comercialización, compraventa y arrendamiento..."
                        className="w-full px-4 py-2.5 text-xs font-medium bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                        Imagen de Quiénes Somos:
                      </label>
                      <MediaPicker
                        value={form.details?.about_image || ''}
                        onChange={(selected) => updateDetailField('about_image', selected?.url || '')}
                        label="Seleccionar o Subir Imagen Quiénes Somos"
                        type="image"
                      />
                    </div>
                  </div>

                  {/* 2. Misión y Visión */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Misión */}
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-3">
                      <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-emerald-600" />
                        Nuestra Misión
                      </h4>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                          Título Misión:
                        </label>
                        <input
                          type="text"
                          value={form.details?.mission_title || 'Nuestra Misión'}
                          onChange={(e) => updateDetailField('mission_title', e.target.value)}
                          className="w-full px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-950 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                          Texto Misión:
                        </label>
                        <textarea
                          rows={3}
                          value={form.details?.mission_text || ''}
                          onChange={(e) => updateDetailField('mission_text', e.target.value)}
                          placeholder="Brindar soluciones inmobiliarias seguras, transparentes e innovadoras..."
                          className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                          Imagen Misión:
                        </label>
                        <MediaPicker
                          value={form.details?.mission_image || ''}
                          onChange={(selected) => updateDetailField('mission_image', selected?.url || '')}
                          label="Subir Imagen de Misión"
                          type="image"
                        />
                      </div>
                    </div>

                    {/* Visión */}
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-3">
                      <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-blue-600" />
                        Nuestra Visión
                      </h4>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                          Título Visión:
                        </label>
                        <input
                          type="text"
                          value={form.details?.vision_title || 'Nuestra Visión'}
                          onChange={(e) => updateDetailField('vision_title', e.target.value)}
                          className="w-full px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-950 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                          Texto Visión:
                        </label>
                        <textarea
                          rows={3}
                          value={form.details?.vision_text || ''}
                          onChange={(e) => updateDetailField('vision_text', e.target.value)}
                          placeholder="Ser la agencia inmobiliaria de referencia por excelencia, liderando con tecnología..."
                          className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                          Imagen Visión:
                        </label>
                        <MediaPicker
                          value={form.details?.vision_image || ''}
                          onChange={(selected) => updateDetailField('vision_image', selected?.url || '')}
                          label="Subir Imagen de Visión"
                          type="image"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Valores y Equipo de Asesores */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-4">
                    <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-600" />
                      Sección de Asesores / Agentes
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                          Título de la Sección Agentes:
                        </label>
                        <input
                          type="text"
                          value={form.details?.team_title || 'Nuestro Equipo de Asesores'}
                          onChange={(e) => updateDetailField('team_title', e.target.value)}
                          className="w-full px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-950 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                          Subtítulo de la Sección:
                        </label>
                        <input
                          type="text"
                          value={form.details?.team_subtitle || 'Expertos profesionales listos para asesorarte en cada paso'}
                          onChange={(e) => updateDetailField('team_subtitle', e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border rounded-lg"
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 italic">
                      * Los asesores mostrados se sincronizan automáticamente desde los usuarios y agentes registrados y activos en la plataforma para tu agencia.
                    </p>
                  </div>

                  {/* Puntos Clave */}
                  <div className="space-y-2 pt-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                      Puntos de Certeza y Valor:
                    </label>
                    <input
                      type="text"
                      value={form.details?.about_item1 || 'Propiedades 100% Verificadas Jurídicamente'}
                      onChange={(e) => updateDetailField('about_item1', e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border rounded-lg"
                    />
                    <input
                      type="text"
                      value={form.details?.about_item2 || 'Asesoría en Créditos Hipotecarios & Notariales'}
                      onChange={(e) => updateDetailField('about_item2', e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border rounded-lg"
                    />
                    <input
                      type="text"
                      value={form.details?.about_item3 || 'Acompañamiento Personalizado de Principio a Fin'}
                      onChange={(e) => updateDetailField('about_item3', e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border rounded-lg"
                    />
                  </div>

                  {/* Estadísticas de Nosotros */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Años de Trayectoria:</span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={form.details?.about_stat1_num || '15'}
                          onChange={(e) => updateDetailField('about_stat1_num', e.target.value)}
                          className="w-16 px-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border rounded-lg font-bold"
                        />
                        <input
                          type="text"
                          value={form.details?.about_stat1_label || 'Años de Trayectoria'}
                          onChange={(e) => updateDetailField('about_stat1_label', e.target.value)}
                          className="flex-grow px-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Clientes Satisfechos:</span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={form.details?.about_stat2_num || '3,500'}
                          onChange={(e) => updateDetailField('about_stat2_num', e.target.value)}
                          className="w-20 px-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border rounded-lg font-bold"
                        />
                        <input
                          type="text"
                          value={form.details?.about_stat2_label || 'Clientes Satisfechos'}
                          onChange={(e) => updateDetailField('about_stat2_label', e.target.value)}
                          className="flex-grow px-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: CONSIGNACIÓN (CTA) */}
            {activeTab === 'cta' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" /> Banner de Consignación &amp; Venta de Inmuebles
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Llamada a la acción orientada a propietarios que desean vender o rentar sus inmuebles con tu inmobiliaria.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Etiqueta Superior (Badge):
                    </label>
                    <input
                      type="text"
                      value={form.details?.cta_badge || 'Servicio Exclusivo a Propietarios'}
                      onChange={(e) => updateDetailField('cta_badge', e.target.value)}
                      className="w-full px-4 py-2.5 text-xs font-bold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Título del Banner:
                    </label>
                    <input
                      type="text"
                      value={form.details?.cta_title || form.cta_text || '¿Quieres Vender o Rentar tu Inmueble Rápido y Seguro?'}
                      onChange={(e) => {
                        updateDetailField('cta_title', e.target.value);
                        setForm((prev: any) => ({ ...prev, cta_text: e.target.value }));
                      }}
                      className="w-full px-4 py-2.5 text-xs font-bold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Texto del Botón:
                    </label>
                    <input
                      type="text"
                      value={form.details?.cta_button_text || 'Consignar mi Inmueble'}
                      onChange={(e) => updateDetailField('cta_button_text', e.target.value)}
                      className="w-full px-4 py-2.5 text-xs font-bold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: DOMINIO & DNS */}
            {activeTab === 'domain' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-600" /> Configuración de Dominio Propio &amp; DNS
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Conecta el dominio oficial de tu agencia inmobiliaria (ej. <code>inmobiliariadelujo.com</code>).
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Dominio o Subdominio Oficial:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={form.domain || ''}
                        onChange={(e) => setForm({ ...form, domain: e.target.value })}
                        placeholder="ej: miagencia.com o portal.miagencia.com"
                        className="flex-grow px-4 py-2.5 text-xs font-bold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyDomain}
                        disabled={verifyingDomain || !form.domain}
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                      >
                        {verifyingDomain ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                        <span>Verificar DNS</span>
                      </button>
                    </div>
                  </div>

                  {/* Resultado Verificación */}
                  {domainVerificationResult && (
                    <div className={`p-4 rounded-2xl border text-xs flex items-start gap-3 ${
                      domainVerificationResult.verified
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                        : 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                    }`}>
                      {domainVerificationResult.verified ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="font-extrabold block">{domainVerificationResult.verified ? '¡Dominio Verificado con Éxito!' : 'DNS no propagados aún'}</span>
                        <p className="mt-0.5 text-[11px] leading-relaxed">{domainVerificationResult.message}</p>
                      </div>
                    </div>
                  )}

                  {/* Instrucciones de Configuración DNS */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <span className="text-xs font-extrabold text-slate-800 dark:text-white uppercase flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-emerald-600" />
                      Instrucciones de Apuntado DNS en tu Registrador (GoDaddy, Namecheap, Cloudflare)
                    </span>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Agrega el siguiente registro <strong>Tipo A</strong> en la zona DNS de tu dominio para conectarlo a tu portal:
                    </p>

                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between font-mono text-xs">
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Tipo / Host / Valor</span>
                        <span className="font-bold text-slate-900 dark:text-white">A &nbsp; @ &nbsp; 187.127.255.159</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText('187.127.255.159');
                          setCopiedDns(true);
                          setTimeout(() => setCopiedDns(false), 3000);
                        }}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500"
                        title="Copiar IP"
                      >
                        {copiedDns ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: COLORES & IDENTIDAD */}
            {activeTab === 'identity' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Palette className="w-4 h-4 text-emerald-600" /> Colores &amp; Logotipo del Portal
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Personaliza la paleta cromática para que coincida exactamente con la identidad de tu agencia.
                  </p>
                </div>

                {/* Paletas Rápidas */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block">
                    Paletas Rápidas para Bienes Raíces:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {REAL_ESTATE_COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => setForm({ ...form, primary_color: preset.primary, secondary_color: preset.secondary })}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-left transition-all flex items-center gap-2 bg-slate-50 dark:bg-slate-950 cursor-pointer"
                      >
                        <span className="w-5 h-5 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: preset.primary }} />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Color Primario (Acentos y Botones):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={form.primary_color || '#00a884'}
                        onChange={(e) => setForm({ ...form, primary_color: e.target.value })}
                        className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5 bg-transparent"
                      />
                      <input
                        type="text"
                        value={form.primary_color || '#00a884'}
                        onChange={(e) => setForm({ ...form, primary_color: e.target.value })}
                        className="flex-grow px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Color Secundario (Topbar &amp; Footer):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={form.secondary_color || '#161a1b'}
                        onChange={(e) => setForm({ ...form, secondary_color: e.target.value })}
                        className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5 bg-transparent"
                      />
                      <input
                        type="text"
                        value={form.secondary_color || '#161a1b'}
                        onChange={(e) => setForm({ ...form, secondary_color: e.target.value })}
                        className="flex-grow px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* Logotipo del Portal */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
                    Logotipo Oficial del Portal (Cabecera):
                  </label>
                  <MediaPicker
                    value={form.logo || ''}
                    onChange={(selected) => setForm({ ...form, logo: selected?.url || '' })}
                    label="Subir o Cambiar Logotipo Principal"
                    type="image"
                  />
                </div>

                {/* Logotipo del Footer */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                      Logotipo del Pie de Página (Footer):
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium">Opcional — Versión para fondo oscuro</span>
                  </div>
                  <MediaPicker
                    value={form.details?.footer_logo || ''}
                    onChange={(selected) =>
                      setForm({
                        ...form,
                        details: {
                          ...(form.details || {}),
                          footer_logo: selected?.url || '',
                        },
                      })
                    }
                    label="Subir o Cambiar Logotipo del Footer"
                    type="image"
                  />
                  {form.details?.footer_logo && (
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            details: {
                              ...(form.details || {}),
                              footer_logo: '',
                            },
                          })
                        }
                        className="text-[11px] font-bold text-rose-500 hover:underline"
                      >
                        Quitar logotipo del footer (usar logotipo principal)
                      </button>
                    </div>
                  )}
                </div>

                {/* Configuración de la Pantalla de Carga (Loader) */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" /> Pantalla de Carga (Loader de Bienvenida)
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Personaliza los degradados dinámicos con tu color de marca, el color de la tipografía y el tiempo de duración que se mostrará la tarjeta de carga a los visitantes.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Color del Texto del Loader */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                        Color del Texto del Loader:
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={form.details?.loader_text_color || '#ffffff'}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              details: {
                                ...(form.details || {}),
                                loader_text_color: e.target.value,
                              },
                            })
                          }
                          className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5 bg-transparent"
                        />
                        <input
                          type="text"
                          value={form.details?.loader_text_color || '#ffffff'}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              details: {
                                ...(form.details || {}),
                                loader_text_color: e.target.value,
                              },
                            })
                          }
                          placeholder="#ffffff"
                          className="flex-grow px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Afecta al texto del país (ej: ECUADOR), al mensaje descriptivo y al spinner.
                      </span>
                    </div>

                    {/* Tiempo de duración del loader */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                          Tiempo de Duración del Loader:
                        </label>
                        <span className="text-xs font-black text-emerald-600">
                          {((Number(form.details?.loader_duration) || 2.5) > 20
                            ? (Number(form.details?.loader_duration) / 1000).toFixed(1)
                            : (Number(form.details?.loader_duration) || 2.5).toFixed(1))}s
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="8"
                        step="0.5"
                        value={
                          (Number(form.details?.loader_duration) || 2.5) > 20
                            ? Number(form.details?.loader_duration) / 1000
                            : Number(form.details?.loader_duration) || 2.5
                        }
                        onChange={(e) =>
                          setForm({
                            ...form,
                            details: {
                              ...(form.details || {}),
                              loader_duration: parseFloat(e.target.value),
                            },
                          })
                        }
                        className="w-full accent-emerald-600 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
                        <span>1s (Rápido)</span>
                        <span>2.5s (Recomendado)</span>
                        <span>5s</span>
                        <span>8s (Extenso)</span>
                      </div>
                    </div>
                  </div>

                  {/* Previsualización interactiva del loader */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      Ver cómo luce con tus degradados de marca (<span className="font-bold" style={{ color: form.primary_color }}>{form.primary_color}</span>) y texto ({form.details?.loader_text_color || '#ffffff'}).
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowLoaderPreview(true)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5" /> Probar Loader
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: SEO & REDES SOCIALES */}
            {activeTab === 'seo' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Search className="w-4 h-4 text-emerald-600" /> Posicionamiento SEO &amp; Vista Previa en Redes
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Controla cómo aparece tu agencia inmobiliaria en Google y en los enlaces compartidos por WhatsApp o Facebook.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Meta Título (Google &amp; Pestaña del Navegador):
                    </label>
                    <input
                      type="text"
                      value={form.seo_title || ''}
                      onChange={(e) => setForm({ ...form, seo_title: e.target.value })}
                      placeholder="Ej: Inmobiliaria del Valle — Casas y Departamentos de Lujo"
                      className="w-full px-4 py-2.5 text-xs font-bold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Meta Descripción (Snippet de Búsqueda):
                    </label>
                    <textarea
                      rows={3}
                      value={form.seo_description || ''}
                      onChange={(e) => setForm({ ...form, seo_description: e.target.value })}
                      placeholder="Explora las mejores propiedades residenciales y comerciales en venta y renta con asesoría notarial garantizada..."
                      className="w-full px-4 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
                    />
                  </div>

                  {/* Simulador de Google Search */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">
                      Simulador de Resultado en Google Search:
                    </span>
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                      <span className="text-xs text-emerald-700 dark:text-emerald-400 truncate block">
                        https://{effectiveDomain}/
                      </span>
                      <h4 className="text-sm font-bold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer">
                        {form.seo_title || `${form.name || 'Agencia Inmobiliaria'} — Portal Oficial`}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {form.seo_description || 'Explora nuestro catálogo selecto de inmuebles exclusivos con certeza jurídica y asesoría profesional personalizada.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PESTAÑA 8: LEGAL & CRM (Términos, Privacidad y Conexión de Leads) */}
            {activeTab === 'legal_crm' && (
              <div className="space-y-6 animate-in fade-in-50 duration-200">
                {/* 1. Vinculación con CRM / Workspaces de la Agencia */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <Target className="w-5 h-5 text-emerald-600" />
                    <div>
                      <h3 className="text-sm font-black text-slate-800 dark:text-white">
                        Recepción de Prospectos en el CRM
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Configura a qué embudo de ventas o CRM llegarán automáticamente los contactos del portal.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Embudo / Workspace de Destino:
                    </label>
                    {loadingWorkspaces ? (
                      <div className="flex items-center gap-2 text-xs text-slate-500 py-2">
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                        <span>Cargando embudos de la agencia...</span>
                      </div>
                    ) : (
                      <select
                        value={form.details?.target_workspace_id || ''}
                        onChange={(e) => updateDetailField('target_workspace_id', e.target.value)}
                        className="w-full px-4 py-2.5 text-xs font-bold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                      >
                        <option value="">(Por defecto) Embudo principal de la agencia</option>
                        {workspaces.map((ws: any) => (
                          <option key={ws.id} value={ws.id}>
                            📊 {ws.name} ({ws.stages?.length || 0} etapas)
                          </option>
                        ))}
                      </select>
                    )}
                    <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                      Cada vez que un cliente llene el formulario de una propiedad o la página de contacto, el prospecto se creará como un <strong>Lead</strong> en la primera etapa de este embudo.
                    </p>
                  </div>
                </div>

                {/* 2. Términos y Condiciones */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-emerald-600" />
                      <div>
                        <h3 className="text-sm font-black text-slate-800 dark:text-white">
                          Términos y Condiciones de Uso
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Texto legal que aceptan los usuarios al enviar sus consultas en el portal.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => updateDetailField('terms_and_conditions', DEFAULT_REAL_ESTATE_TERMS)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-100 transition-colors cursor-pointer border border-emerald-200 dark:border-emerald-800"
                    >
                      Cargar Plantilla Estándar
                    </button>
                  </div>

                  <div>
                    <textarea
                      rows={8}
                      value={form.details?.terms_and_conditions || ''}
                      onChange={(e) => updateDetailField('terms_and_conditions', e.target.value)}
                      placeholder={DEFAULT_REAL_ESTATE_TERMS}
                      className="w-full px-4 py-3 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl leading-relaxed"
                    />
                  </div>
                </div>

                {/* 3. Política de Privacidad */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      <div>
                        <h3 className="text-sm font-black text-slate-800 dark:text-white">
                          Política de Privacidad y Tratamiento de Datos
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Normativa de protección de datos personales de tus clientes.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => updateDetailField('privacy_policy', DEFAULT_REAL_ESTATE_PRIVACY)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-100 transition-colors cursor-pointer border border-emerald-200 dark:border-emerald-800"
                    >
                      Cargar Plantilla Estándar
                    </button>
                  </div>

                  <div>
                    <textarea
                      rows={8}
                      value={form.details?.privacy_policy || ''}
                      onChange={(e) => updateDetailField('privacy_policy', e.target.value)}
                      placeholder={DEFAULT_REAL_ESTATE_PRIVACY}
                      className="w-full px-4 py-3 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PESTAÑA 9: DESTINOS & CATEGORÍAS (Países, Ciudades y Categorías de Marca Blanca) */}
            {activeTab === 'catalog' && (
              <div className="space-y-6 animate-in fade-in-50 duration-200">
                <EstateCatalogManagementView
                  whiteLabelId={agencies.find((a: any) => a.id === selectedAgencyId)?.white_label_id}
                />
              </div>
            )}

            {/* PESTAÑA 10: APROBACIONES & AUTOMATIZACIONES */}
            {activeTab === 'approvals' && (
              <div className="space-y-6 animate-in fade-in-50 duration-200">
                <EstateApprovalSettingsPanel agencyId={selectedAgencyId || undefined} />
              </div>
            )}

            {/* Bottom Save Button */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => handleSave()}
                disabled={saving || !canManage}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{saving ? 'Guardando...' : 'Guardar Todo el Portal'}</span>
              </button>
            </div>

          </div>
        </div>

        {/* COLUMNA DERECHA: VISTA PREVIA EN VIVO */}
        <div className="lg:col-span-6 space-y-4 sticky top-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
            
            {/* Header de la Vista Previa */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-black uppercase text-slate-800 dark:text-white tracking-wider">
                  Vista Previa en Tiempo Real
                </span>
              </div>

              {/* Selector de Dispositivos: Desktop, Tablet, Móvil */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setDeviceMode('desktop')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    deviceMode === 'desktop' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs' : 'text-slate-500'
                  }`}
                  title="Vista de Computadora de Escritorio"
                >
                  <Laptop className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[10px]">PC</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeviceMode('tablet')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    deviceMode === 'tablet' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs' : 'text-slate-500'
                  }`}
                  title="Vista de Tableta"
                >
                  <Tablet className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[10px]">Tablet</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeviceMode('mobile')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    deviceMode === 'mobile' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs' : 'text-slate-500'
                  }`}
                  title="Vista de Teléfono Móvil"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[10px]">Móvil</span>
                </button>
              </div>

              <a
                href={previewLiveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Abrir en Pestaña Nueva</span>
              </a>
            </div>

            {/* Marco de Simulación del Navegador */}
            <div className="bg-slate-100 dark:bg-slate-950 p-2 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="bg-white dark:bg-slate-900 rounded-xl px-3 py-1.5 mb-2 flex items-center gap-2 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 truncate">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="font-mono text-slate-600 dark:text-slate-400 truncate ml-2">
                  https://{effectiveDomain}/
                </span>
              </div>

              {/* Render del PortalLivePreview */}
              <div className="max-h-[700px] overflow-y-auto rounded-xl shadow-inner">
                <PortalLivePreview
                  agencyName={form.name || 'Inmobiliaria'}
                  logoUrl={form.logo}
                  bannerImage={form.banner_image}
                  heroTitle={form.hero_title}
                  heroSubtitle={form.hero_subtitle}
                  categoriesTitle={form.details?.categories_title}
                  categoriesSubtitle={form.details?.categories_subtitle}
                  featuredTitle={form.details?.featured_title}
                  featuredSubtitle={form.details?.featured_subtitle}
                  aboutTitle={form.about_title}
                  aboutText={form.about_text}
                  ctaText={form.details?.cta_title || form.cta_text}
                  primaryColor={form.primary_color}
                  secondaryColor={form.secondary_color}
                  phone={form.phone}
                  whatsapp={form.whatsapp}
                  deviceMode={deviceMode}
                  details={form.details}
                />
              </div>
            </div>

          </div>
        </div>

      </div>
      {showLoaderPreview && (
        <div onClick={() => setShowLoaderPreview(false)}>
          <PublicPortalLoader
            isOpen={true}
            countryName={form.country_name || form.country || 'Ecuador'}
            countryImage={form.country_image}
            brandColor={form.primary_color || '#00a884'}
            textColor={form.details?.loader_text_color || '#ffffff'}
            duration={
              (Number(form.details?.loader_duration) || 2.5) > 20
                ? Number(form.details?.loader_duration)
                : (Number(form.details?.loader_duration) || 2.5) * 1000
            }
            logoUrl={form.logo}
            agency={{
              ...form,
              primary_color: form.primary_color,
              details: form.details,
            }}
          />
        </div>
      )}

    </div>
  );
};

export default PortalInmobiliarioStudioView;
