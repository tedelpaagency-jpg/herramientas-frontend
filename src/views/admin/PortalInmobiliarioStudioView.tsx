'use client';

import React, { useEffect, useState } from 'react';
import {
  Globe, Sparkles, Building2, ShieldCheck, CheckCircle2, AlertTriangle, AlertCircle,
  RefreshCw, Loader2, ExternalLink, Eye, EyeOff, Image as ImageIcon, Laptop, Tablet, Smartphone,
  Search, Check, Palette, Save, Phone, Mail, FileText, HelpCircle, Layers, Copy,
  Target, Compass, Users, Megaphone, Video, Play, MapPin, SlidersHorizontal,
  Briefcase, Plus, Trash2, Handshake, BadgeCheck, FileSpreadsheet, ArrowUp, ArrowDown, Code, GripVertical
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
import AgencyGoogleSheetsTab from '@/components/agencies/AgencyGoogleSheetsTab';
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
  const [activeTab, setActiveTab] = useState<'hero' | 'sections' | 'about' | 'services' | 'cta' | 'domain' | 'identity' | 'seo' | 'legal_crm' | 'catalog' | 'approvals' | 'google_sheets'>('hero');
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
      cookies_enabled: true,
      cookies_message: '',
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
      allies_title: 'Nuestros Aliados Comerciales',
      allies_subtitle: '',
      our_clients: [],
      clients_title: 'Nuestros Clientes',
      clients_subtitle: '',
      about_sections_order: ['presentation', 'mission_vision', 'team', 'clients', 'allies', 'certifications', 'custom_html'],
      about_sections_hidden: [],
      about_html_sections: [],
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
      loader_text_color: '#ffffff',
      loader_duration: 2.5,
      map_pin_bg_color: '#ffffff',
      map_pin_text_color: '#0f172a',
      map_pin_active_bg_color: '#0f172a',
      map_pin_active_text_color: '#ffffff',
      filter_border_color: '#00a884',
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
        ...(parsedDetails || {}),
        commercial_allies: Array.isArray(parsedDetails?.commercial_allies) ? parsedDetails.commercial_allies : [],
        certifications: Array.isArray(parsedDetails?.certifications) ? parsedDetails.certifications : [],
        services: Array.isArray(parsedDetails?.services) ? parsedDetails.services : [],
        filter_booking_enabled: parsedDetails?.filter_booking_enabled !== undefined ? Boolean(parsedDetails.filter_booking_enabled) : true,
        filter_properties_enabled: parsedDetails?.filter_properties_enabled !== undefined ? Boolean(parsedDetails.filter_properties_enabled) : true,
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
        cookies_enabled: parsedDetails?.cookies_enabled !== false && parsedDetails?.cookies_enabled !== '0',
        cookies_message: parsedDetails?.cookies_message || '',
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
        allies_title: parsedDetails?.allies_title ?? 'Nuestros Aliados Comerciales',
        allies_subtitle: parsedDetails?.allies_subtitle ?? '',
        our_clients: Array.isArray(parsedDetails?.our_clients) ? parsedDetails.our_clients : [],
        clients_title: parsedDetails?.clients_title ?? 'Nuestros Clientes',
        clients_subtitle: parsedDetails?.clients_subtitle ?? '',
        about_sections_order: Array.isArray(parsedDetails?.about_sections_order) ? parsedDetails.about_sections_order : ['presentation', 'mission_vision', 'team', 'clients', 'allies', 'certifications', 'custom_html'],
        about_sections_hidden: Array.isArray(parsedDetails?.about_sections_hidden) ? parsedDetails.about_sections_hidden : [],
        about_html_sections: Array.isArray(parsedDetails?.about_html_sections) ? parsedDetails.about_html_sections : [],
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
        loader_text_color: parsedDetails?.loader_text_color || '#ffffff',
        loader_duration: parsedDetails?.loader_duration !== undefined ? Number(parsedDetails.loader_duration) : 2.5,
        map_pin_bg_color: parsedDetails?.map_pin_bg_color || '#ffffff',
        map_pin_text_color: parsedDetails?.map_pin_text_color || '#0f172a',
        map_pin_active_bg_color: parsedDetails?.map_pin_active_bg_color || ag.primary_color || '#0f172a',
        map_pin_active_text_color: parsedDetails?.map_pin_active_text_color || '#ffffff',
        filter_border_color: parsedDetails?.filter_border_color || ag.primary_color || '#00a884',
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
        button_color: form.primary_color,
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
              onClick={() => setActiveTab('services')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'services' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-blue-400" />
              <span>Servicios</span>
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

            {isSuperAdmin && (
              <button
                type="button"
                onClick={() => setActiveTab('catalog')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'catalog' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>Destinos &amp; Categorías</span>
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-black uppercase">SUPER ADMIN</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveTab('approvals')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'approvals' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
              <span>Filtros (Booking &amp; Propiedades) &amp; Políticas</span>
            </button>

            {selectedAgencyId && (
              <button
                type="button"
                onClick={() => setActiveTab('google_sheets')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'google_sheets' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Google Sheets</span>
              </button>
            )}
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
                    Configura el orden de las secciones, clientes, aliados comerciales, certificaciones y bloques HTML personalizados para la página pública de Conócenos.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* ORGANIZADOR Y VISIBILIDAD DE SECCIONES */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase flex items-center gap-1.5">
                          <GripVertical className="w-3.5 h-3.5 text-emerald-600" />
                          Orden y Visibilidad de Secciones en Conócenos
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Usa las flechas para cambiar el orden de las secciones o el ojo para activar u ocultarlas.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          updateDetailField('about_sections_order', [
                            'presentation',
                            'mission_vision',
                            'team',
                            'clients',
                            'allies',
                            'certifications',
                            'custom_html',
                          ]);
                          updateDetailField('about_sections_hidden', []);
                        }}
                        className="text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline cursor-pointer"
                      >
                        Restablecer Orden
                      </button>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {(() => {
                        const allSections = [
                          { id: 'presentation', label: 'Quiénes Somos / Presentación', icon: Building2, desc: 'Historia institucional, imagen y puntos clave' },
                          { id: 'mission_vision', label: 'Misión y Visión', icon: Target, desc: 'Tarjetas de propósito corporativo' },
                          { id: 'team', label: 'Equipo de Asesores', icon: Users, desc: 'Listado sincronizado de agentes de la agencia' },
                          { id: 'clients', label: 'Nuestros Clientes (Carrusel de Logos)', icon: Sparkles, desc: 'Carrusel continuo de empresas clientes (Estilo Imagen 1)' },
                          { id: 'allies', label: 'Asociados Comerciales', icon: Handshake, desc: 'Tarjetas con imagen, título y descripción (Estilo Imagen 2)' },
                          { id: 'certifications', label: 'Certificaciones y Acreditaciones', icon: BadgeCheck, desc: 'Licencias oficiales y avales profesionales' },
                          { id: 'custom_html', label: 'Secciones Personalizadas (HTML Puro)', icon: Code, desc: 'Bloques de código HTML libre, banners o widgets' },
                        ];

                        const currentOrder: string[] = Array.isArray(form.details?.about_sections_order) && form.details.about_sections_order.length > 0
                          ? form.details.about_sections_order
                          : allSections.map((s) => s.id);

                        const fullOrder = [...currentOrder];
                        allSections.forEach((s) => {
                          if (!fullOrder.includes(s.id)) fullOrder.push(s.id);
                        });

                        const hiddenList: string[] = Array.isArray(form.details?.about_sections_hidden)
                          ? form.details.about_sections_hidden
                          : [];

                        return fullOrder.map((secId, idx) => {
                          const meta = allSections.find((s) => s.id === secId);
                          if (!meta) return null;
                          const isHidden = hiddenList.includes(secId);
                          const IconComp = meta.icon;

                          return (
                            <div
                              key={secId}
                              className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                                isHidden
                                  ? 'bg-slate-100/60 dark:bg-slate-950/40 border-slate-200/60 dark:border-slate-800/60 opacity-60'
                                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                                  {idx + 1}
                                </span>
                                <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 shrink-0">
                                  <IconComp className="w-3.5 h-3.5" />
                                </div>
                                <div className="truncate">
                                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                    <span>{meta.label}</span>
                                    {isHidden && (
                                      <span className="text-[10px] font-semibold text-rose-500 bg-rose-50 dark:bg-rose-950/50 px-1.5 py-0.5 rounded-md">
                                        Oculta
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-slate-500 truncate m-0">{meta.desc}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => {
                                    if (idx === 0) return;
                                    const next = [...fullOrder];
                                    const [moved] = next.splice(idx, 1);
                                    next.splice(idx - 1, 0, moved);
                                    updateDetailField('about_sections_order', next);
                                  }}
                                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                  title="Subir posición"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === fullOrder.length - 1}
                                  onClick={() => {
                                    if (idx === fullOrder.length - 1) return;
                                    const next = [...fullOrder];
                                    const [moved] = next.splice(idx, 1);
                                    next.splice(idx + 1, 0, moved);
                                    updateDetailField('about_sections_order', next);
                                  }}
                                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                  title="Bajar posición"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextHidden = isHidden
                                      ? hiddenList.filter((k) => k !== secId)
                                      : [...hiddenList, secId];
                                    updateDetailField('about_sections_hidden', nextHidden);
                                  }}
                                  className={`p-1.5 rounded-lg border cursor-pointer transition-all ${
                                    isHidden
                                      ? 'border-rose-200 bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:border-rose-800'
                                      : 'border-emerald-200 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:border-emerald-800'
                                  }`}
                                  title={isHidden ? 'Activar sección' : 'Ocultar sección'}
                                >
                                  {isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>

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

                  {/* 4. NUESTROS CLIENTES (CARRUSEL DE LOGOS) */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          Nuestros Clientes (Carrusel de Logos)
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Agrega los logos o imágenes de empresas clientes. En el frontend se listarán en un carrusel dinámico continuo como en la Imagen 1.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const list = Array.isArray(form.details?.our_clients) ? [...form.details.our_clients] : [];
                          list.push({
                            id: Date.now(),
                            name: '',
                            logo: '',
                          });
                          updateDetailField('our_clients', list);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Agregar Logo / Cliente</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Título de la Sección de Clientes:
                        </label>
                        <input
                          type="text"
                          value={form.details?.clients_title ?? 'Nuestros Clientes'}
                          onChange={(e) => updateDetailField('clients_title', e.target.value)}
                          placeholder="Ej: Nuestros Clientes"
                          className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-bold focus:border-amber-500 outline-none"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          * Este título adoptará automáticamente el color primario de la marca.
                        </span>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Subtítulo de la Sección de Clientes (Opcional):
                        </label>
                        <input
                          type="text"
                          value={form.details?.clients_subtitle ?? ''}
                          onChange={(e) => updateDetailField('clients_subtitle', e.target.value)}
                          placeholder="Dejar vacío si no deseas mostrar subtítulo"
                          className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:border-amber-500 outline-none"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          * Si está vacío, no se renderizará ningún subtítulo ni espacio extra en el frontend.
                        </span>
                      </div>
                    </div>

                    {(!form.details?.our_clients || form.details.our_clients.length === 0) ? (
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
                        <p className="text-xs text-slate-500 m-0">
                          No has agregado clientes personalizados. El portal mostrará los logos predeterminados del sistema.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            updateDetailField('our_clients', [
                              { id: 1, name: 'Grupo Manobanda', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=300&q=80' },
                              { id: 2, name: 'Inmoconstrucción Expo 2024 Quevedo', logo: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=300&q=80' },
                              { id: 3, name: 'Banco Pichincha', logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=300&q=80' },
                              { id: 4, name: 'Tesalia cbc', logo: 'https://images.unsplash.com/photo-1516876437184-593fda40c7ce?auto=format&fit=crop&w=300&q=80' },
                            ]);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 font-bold text-xs cursor-pointer transition-all border border-amber-200 dark:border-amber-800"
                        >
                          Cargar Logos de Ejemplo
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {form.details.our_clients.map((client: any, idx: number) => (
                          <div key={client.id || idx} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-black uppercase text-slate-400">Cliente / Logo #{idx + 1}</span>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => {
                                    if (idx === 0) return;
                                    const next = [...form.details.our_clients];
                                    const [moved] = next.splice(idx, 1);
                                    next.splice(idx - 1, 0, moved);
                                    updateDetailField('our_clients', next);
                                  }}
                                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 disabled:opacity-30 cursor-pointer"
                                  title="Subir"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === form.details.our_clients.length - 1}
                                  onClick={() => {
                                    if (idx === form.details.our_clients.length - 1) return;
                                    const next = [...form.details.our_clients];
                                    const [moved] = next.splice(idx, 1);
                                    next.splice(idx + 1, 0, moved);
                                    updateDetailField('our_clients', next);
                                  }}
                                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 disabled:opacity-30 cursor-pointer"
                                  title="Bajar"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const list = form.details.our_clients.filter((_: any, i: number) => i !== idx);
                                    updateDetailField('our_clients', list);
                                  }}
                                  className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                                  title="Eliminar cliente"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Nombre de la Empresa / Cliente (Opcional):</label>
                                <input
                                  type="text"
                                  value={client.name || ''}
                                  onChange={(e) => {
                                    const list = [...form.details.our_clients];
                                    list[idx] = { ...list[idx], name: e.target.value };
                                    updateDetailField('our_clients', list);
                                  }}
                                  placeholder="Ej: Grupo Manobanda"
                                  className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border rounded-lg font-bold"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Logo o Imagen de la Empresa:</label>
                                <MediaPicker
                                  value={client.logo || client.image_url || client.image || ''}
                                  onChange={(selected) => {
                                    const list = [...form.details.our_clients];
                                    list[idx] = {
                                      ...list[idx],
                                      logo: selected?.url || '',
                                      image_url: selected?.url || '',
                                      image: selected?.url || '',
                                    };
                                    updateDetailField('our_clients', list);
                                  }}
                                  label="Seleccionar o Subir Logo del Cliente"
                                  type="image"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 5. Asociados Comerciales (Aliados) */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase flex items-center gap-1.5">
                          <Handshake className="w-3.5 h-3.5 text-blue-600" />
                          Asociados Comerciales (Bancos, Notarías, Aseguradoras, Gremios)
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          En el frontend se listarán como tarjetas limpias con imagen destacada arriba, título y descripción como en la Imagen 2.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const list = Array.isArray(form.details?.commercial_allies) ? [...form.details.commercial_allies] : [];
                          list.push({
                            id: Date.now(),
                            name: '',
                            category: 'Entidad Financiera',
                            description: '',
                            website: '',
                          });
                          updateDetailField('commercial_allies', list);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Agregar Aliado</span>
                      </button>
                    </div>

                    {/* Campos de Título y Subtítulo de la Sección de Aliados */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Título de la Sección de Asociados:
                        </label>
                        <input
                          type="text"
                          value={form.details?.allies_title ?? 'Nuestros Aliados Comerciales'}
                          onChange={(e) => updateDetailField('allies_title', e.target.value)}
                          placeholder="Ej: Asociados a / Aliados Comerciales"
                          className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-bold focus:border-blue-500 outline-none"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          * Este título adoptará automáticamente el color primario configurado.
                        </span>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Subtítulo de la Sección de Asociados (Opcional):
                        </label>
                        <input
                          type="text"
                          value={form.details?.allies_subtitle ?? ''}
                          onChange={(e) => updateDetailField('allies_subtitle', e.target.value)}
                          placeholder="Dejar vacío si no deseas mostrar subtítulo"
                          className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:border-blue-500 outline-none"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          * Si está vacío, no se renderizará ningún subtítulo ni espacio extra en el frontend.
                        </span>
                      </div>
                    </div>

                    {(!form.details?.commercial_allies || form.details.commercial_allies.length === 0) ? (
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
                        <p className="text-xs text-slate-500 m-0">
                          No has agregado aliados comerciales personalizados. El portal muestra los 6 aliados predefinidos del sistema.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            updateDetailField('commercial_allies', [
                              { id: 1, name: 'Banco Pichincha', category: 'Entidad Financiera', description: 'Créditos hipotecarios preferenciales y precalificación inmediata.', website: 'https://www.pichincha.com', logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80' },
                              { id: 2, name: 'Notaría Primera del Cantón', category: 'Seguridad Notarial', description: 'Asesoría jurídica integral, revisión de títulos y solemnización de escrituras.', website: '#', logo: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80' },
                              { id: 3, name: 'Seguros Equinoccial', category: 'Pólizas & Aseguradora', description: 'Pólizas de seguro contra incendios, sismos y protección patrimonial.', website: 'https://www.segurosequinoccial.com', logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80' },
                              { id: 4, name: 'Biess - Banco del IESS', category: 'Crédito Hipotecario Público', description: 'Canalización directa de préstamos hipotecarios para afiliados y jubilados.', website: 'https://www.biess.fin.ec', logo: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=600&q=80' },
                            ]);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs cursor-pointer transition-all"
                        >
                          Cargar Aliados de Ejemplo para Editar
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {form.details.commercial_allies.map((ally: any, idx: number) => (
                          <div key={ally.id || idx} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-black uppercase text-slate-400">Aliado #{idx + 1}</span>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => {
                                    if (idx === 0) return;
                                    const next = [...form.details.commercial_allies];
                                    const [moved] = next.splice(idx, 1);
                                    next.splice(idx - 1, 0, moved);
                                    updateDetailField('commercial_allies', next);
                                  }}
                                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 disabled:opacity-30 cursor-pointer"
                                  title="Subir"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === form.details.commercial_allies.length - 1}
                                  onClick={() => {
                                    if (idx === form.details.commercial_allies.length - 1) return;
                                    const next = [...form.details.commercial_allies];
                                    const [moved] = next.splice(idx, 1);
                                    next.splice(idx + 1, 0, moved);
                                    updateDetailField('commercial_allies', next);
                                  }}
                                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 disabled:opacity-30 cursor-pointer"
                                  title="Bajar"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const list = form.details.commercial_allies.filter((_: any, i: number) => i !== idx);
                                    updateDetailField('commercial_allies', list);
                                  }}
                                  className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                                  title="Eliminar aliado"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Nombre:</label>
                                <input
                                  type="text"
                                  value={ally.name || ''}
                                  onChange={(e) => {
                                    const list = [...form.details.commercial_allies];
                                    list[idx] = { ...list[idx], name: e.target.value };
                                    updateDetailField('commercial_allies', list);
                                  }}
                                  placeholder="Ej: Banco Pichincha"
                                  className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border rounded-lg font-bold"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Categoría:</label>
                                <input
                                  type="text"
                                  value={ally.category || ''}
                                  onChange={(e) => {
                                    const list = [...form.details.commercial_allies];
                                    list[idx] = { ...list[idx], category: e.target.value };
                                    updateDetailField('commercial_allies', list);
                                  }}
                                  placeholder="Ej: Entidad Financiera / Notaría"
                                  className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border rounded-lg"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Descripción de la Alianza:</label>
                              <input
                                type="text"
                                value={ally.description || ''}
                                onChange={(e) => {
                                  const list = [...form.details.commercial_allies];
                                  list[idx] = { ...list[idx], description: e.target.value };
                                  updateDetailField('commercial_allies', list);
                                }}
                                placeholder="Ej: Créditos hipotecarios preferenciales..."
                                className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border rounded-lg"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Sitio Web (Opcional):</label>
                              <input
                                type="text"
                                value={ally.website || ''}
                                onChange={(e) => {
                                  const list = [...form.details.commercial_allies];
                                  list[idx] = { ...list[idx], website: e.target.value };
                                  updateDetailField('commercial_allies', list);
                                }}
                                placeholder="https://..."
                                className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border rounded-lg"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Logo / Imagen del Aliado (Banner o Logo):</label>
                              <MediaPicker
                                value={ally.logo || ally.image_url || ally.image || ''}
                                onChange={(selected) => {
                                  const list = [...form.details.commercial_allies];
                                  list[idx] = {
                                    ...list[idx],
                                    logo: selected?.url || '',
                                    image_url: selected?.url || '',
                                    image: selected?.url || '',
                                  };
                                  updateDetailField('commercial_allies', list);
                                }}
                                label="Seleccionar o Subir Imagen/Logo del Aliado"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 6. Certificaciones y Acreditaciones */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase flex items-center gap-1.5">
                        <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Certificaciones y Acreditaciones de la Agencia
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          const list = Array.isArray(form.details?.certifications) ? [...form.details.certifications] : [];
                          list.push({
                            id: Date.now(),
                            title: '',
                            entity: '',
                            code: '',
                            year: 'Vigente',
                            description: '',
                          });
                          updateDetailField('certifications', list);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Agregar Certificado</span>
                      </button>
                    </div>

                    {(!form.details?.certifications || form.details.certifications.length === 0) ? (
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
                        <p className="text-xs text-slate-500 m-0">
                          No has agregado certificaciones personalizadas. El portal muestra las acreditaciones predefinidas del sistema.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            updateDetailField('certifications', [
                              { id: 1, title: 'Licencia Profesional de Corretaje Inmobiliario', entity: 'Ministerio de Desarrollo Urbano y Vivienda', code: 'MIDUVI-LIC-09412', year: 'Vigente', description: 'Acreditación oficial que certifica el ejercicio legal y ético de la intermediación de bienes raíces.', image_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80' },
                              { id: 2, title: 'Miembro Activo ACBIR', entity: 'Asociación de Corredores de Bienes Raíces', code: 'ACBIR-SOCIO-REG-884', year: 'Certificado Anual', description: 'Garantía de apego a las normas gremiales de transparencia y honestidad.', image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80' },
                              { id: 3, title: 'Acreditación MLS Internacional', entity: 'Multiple Listing Service Network', code: 'MLS-ID-EC-22910', year: 'Acreditado', description: 'Acceso a la mayor red internacional de compradores calificados.', image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80' },
                            ]);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs cursor-pointer transition-all"
                        >
                          Cargar Certificaciones de Ejemplo para Editar
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {form.details.certifications.map((cert: any, idx: number) => (
                          <div key={cert.id || idx} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-black uppercase text-slate-400">Certificación #{idx + 1}</span>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => {
                                    if (idx === 0) return;
                                    const next = [...form.details.certifications];
                                    const [moved] = next.splice(idx, 1);
                                    next.splice(idx - 1, 0, moved);
                                    updateDetailField('certifications', next);
                                  }}
                                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 disabled:opacity-30 cursor-pointer"
                                  title="Subir"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === form.details.certifications.length - 1}
                                  onClick={() => {
                                    if (idx === form.details.certifications.length - 1) return;
                                    const next = [...form.details.certifications];
                                    const [moved] = next.splice(idx, 1);
                                    next.splice(idx + 1, 0, moved);
                                    updateDetailField('certifications', next);
                                  }}
                                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 disabled:opacity-30 cursor-pointer"
                                  title="Bajar"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const list = form.details.certifications.filter((_: any, i: number) => i !== idx);
                                    updateDetailField('certifications', list);
                                  }}
                                  className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                                  title="Eliminar certificación"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Título del Certificado:</label>
                                <input
                                  type="text"
                                  value={cert.title || ''}
                                  onChange={(e) => {
                                    const list = [...form.details.certifications];
                                    list[idx] = { ...list[idx], title: e.target.value };
                                    updateDetailField('certifications', list);
                                  }}
                                  placeholder="Ej: Licencia Profesional de Corretaje"
                                  className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border rounded-lg font-bold"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Entidad Emisora:</label>
                                <input
                                  type="text"
                                  value={cert.entity || ''}
                                  onChange={(e) => {
                                    const list = [...form.details.certifications];
                                    list[idx] = { ...list[idx], entity: e.target.value };
                                    updateDetailField('certifications', list);
                                  }}
                                  placeholder="Ej: ACBIR / Ministerio de Vivienda"
                                  className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border rounded-lg"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Nº de Registro / Código:</label>
                                <input
                                  type="text"
                                  value={cert.code || ''}
                                  onChange={(e) => {
                                    const list = [...form.details.certifications];
                                    list[idx] = { ...list[idx], code: e.target.value };
                                    updateDetailField('certifications', list);
                                  }}
                                  placeholder="Ej: REG-1048-INMO"
                                  className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border rounded-lg font-mono"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Vigencia / Año:</label>
                                <input
                                  type="text"
                                  value={cert.year || ''}
                                  onChange={(e) => {
                                    const list = [...form.details.certifications];
                                    list[idx] = { ...list[idx], year: e.target.value };
                                    updateDetailField('certifications', list);
                                  }}
                                  placeholder="Ej: Vigente 2025 - 2026"
                                  className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border rounded-lg"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Descripción Breve:</label>
                              <input
                                type="text"
                                value={cert.description || ''}
                                onChange={(e) => {
                                  const list = [...form.details.certifications];
                                  list[idx] = { ...list[idx], description: e.target.value };
                                  updateDetailField('certifications', list);
                                }}
                                placeholder="Ej: Acreditación oficial que certifica el ejercicio legal..."
                                className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border rounded-lg"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Foto / Insignia de la Certificación:</label>
                              <MediaPicker
                                value={cert.image_url || cert.image || cert.badge_url || cert.logo || ''}
                                onChange={(selected) => {
                                  const list = [...form.details.certifications];
                                  list[idx] = {
                                    ...list[idx],
                                    image_url: selected?.url || '',
                                    image: selected?.url || '',
                                    badge_url: selected?.url || '',
                                  };
                                  updateDetailField('certifications', list);
                                }}
                                label="Seleccionar o Subir Imagen de la Certificación"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 7. SECCIONES PERSONALIZADAS CON HTML PURO */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase flex items-center gap-1.5">
                          <Code className="w-3.5 h-3.5 text-indigo-600" />
                          Secciones Personalizadas con HTML Puro
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Agrega bloques de código HTML, widgets embebidos, iframes de video o mapas personalizados directamente en Conócenos.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const list = Array.isArray(form.details?.about_html_sections) ? [...form.details.about_html_sections] : [];
                          list.push({
                            id: Date.now(),
                            title: '',
                            subtitle: '',
                            container: 'boxed',
                            bg_color: '',
                            html: '<div className="p-8 text-center bg-slate-50 rounded-3xl border border-slate-200">\n  <h3 className="text-xl font-bold text-slate-900 mb-2">Sección Personalizada</h3>\n  <p className="text-sm text-slate-600">Escribe aquí tu código HTML o incrusta contenido.</p>\n</div>',
                          });
                          updateDetailField('about_html_sections', list);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Agregar Sección HTML</span>
                      </button>
                    </div>

                    {(!form.details?.about_html_sections || form.details.about_html_sections.length === 0) ? (
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-1">
                        <p className="text-xs text-slate-500 m-0">
                          No tienes secciones de HTML puro configuradas. Puedes agregar una haciendo clic en el botón superior.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {form.details.about_html_sections.map((sec: any, idx: number) => (
                          <div key={sec.id || idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 space-y-3">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400">
                                Sección HTML #{idx + 1}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => {
                                    if (idx === 0) return;
                                    const next = [...form.details.about_html_sections];
                                    const [moved] = next.splice(idx, 1);
                                    next.splice(idx - 1, 0, moved);
                                    updateDetailField('about_html_sections', next);
                                  }}
                                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 disabled:opacity-30 cursor-pointer"
                                  title="Subir"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === form.details.about_html_sections.length - 1}
                                  onClick={() => {
                                    if (idx === form.details.about_html_sections.length - 1) return;
                                    const next = [...form.details.about_html_sections];
                                    const [moved] = next.splice(idx, 1);
                                    next.splice(idx + 1, 0, moved);
                                    updateDetailField('about_html_sections', next);
                                  }}
                                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 disabled:opacity-30 cursor-pointer"
                                  title="Bajar"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const list = form.details.about_html_sections.filter((_: any, i: number) => i !== idx);
                                    updateDetailField('about_html_sections', list);
                                  }}
                                  className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                                  title="Eliminar sección HTML"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                                  Título de la Sección (Opcional):
                                </label>
                                <input
                                  type="text"
                                  value={sec.title || ''}
                                  onChange={(e) => {
                                    const list = [...form.details.about_html_sections];
                                    list[idx] = { ...list[idx], title: e.target.value };
                                    updateDetailField('about_html_sections', list);
                                  }}
                                  placeholder="Ej: Nuestra Infraestructura Tecnológica"
                                  className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border rounded-lg font-bold"
                                />
                                <span className="text-[10px] text-slate-400 mt-0.5 block">
                                  * Si se define, usará el color primario seleccionado.
                                </span>
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                                  Subtítulo de la Sección (Opcional):
                                </label>
                                <input
                                  type="text"
                                  value={sec.subtitle || ''}
                                  onChange={(e) => {
                                    const list = [...form.details.about_html_sections];
                                    list[idx] = { ...list[idx], subtitle: e.target.value };
                                    updateDetailField('about_html_sections', list);
                                  }}
                                  placeholder="Dejar vacío si no deseas subtítulo"
                                  className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border rounded-lg"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                                  Tipo de Contenedor:
                                </label>
                                <select
                                  value={sec.container || 'boxed'}
                                  onChange={(e) => {
                                    const list = [...form.details.about_html_sections];
                                    list[idx] = { ...list[idx], container: e.target.value };
                                    updateDetailField('about_html_sections', list);
                                  }}
                                  className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border rounded-lg font-bold"
                                >
                                  <option value="boxed">Enmarcado (Centrado con márgenes - Container)</option>
                                  <option value="full">Ancho Completo (Full Width)</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                                  Color de Fondo (Opcional):
                                </label>
                                <input
                                  type="text"
                                  value={sec.bg_color || ''}
                                  onChange={(e) => {
                                    const list = [...form.details.about_html_sections];
                                    list[idx] = { ...list[idx], bg_color: e.target.value };
                                    updateDetailField('about_html_sections', list);
                                  }}
                                  placeholder="Ej: #f8fafc o transparente"
                                  className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border rounded-lg font-mono"
                                />
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase">
                                  Código HTML Puro:
                                </label>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  Soporta divs, imágenes, iframes, estilos inline
                                </span>
                              </div>
                              <textarea
                                rows={6}
                                value={sec.html || ''}
                                onChange={(e) => {
                                  const list = [...form.details.about_html_sections];
                                  list[idx] = { ...list[idx], html: e.target.value };
                                  updateDetailField('about_html_sections', list);
                                }}
                                placeholder="<div>...</div>"
                                className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none leading-relaxed"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SERVICIOS INMOBILIARIOS CONFIGURABLES */}
            {activeTab === 'services' && (
              <div className="space-y-6 animate-in fade-in-50 duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-emerald-600" /> Servicios Inmobiliarios Configurables
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Gestiona las tarjetas de servicios mostradas en la página pública <code>/services</code> con título, descripción, foto y botón de contacto.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const list = Array.isArray(form.details?.services) ? [...form.details.services] : [];
                      list.push({
                        id: Date.now(),
                        title: 'Nuevo Servicio Inmobiliario',
                        description: 'Descripción detallada de la asesoría o solución que brindamos a los clientes...',
                        image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
                        cta_text: 'Solicitar Asesoría',
                      });
                      updateDetailField('services', list);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition-all self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar Servicio</span>
                  </button>
                </div>

                {(!form.details?.services || form.details.services.length === 0) ? (
                  <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-3">
                    <Briefcase className="w-8 h-8 text-slate-400 mx-auto" />
                    <div className="max-w-md mx-auto space-y-1">
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 m-0">
                        Servicios predefinidos activos
                      </h4>
                      <p className="text-xs text-slate-500 m-0">
                        Actualmente el portal público muestra los 6 servicios estándar (Compra/Venta, Alquiler, Legal, Hipotecario, Avalúos, Marketing).
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        updateDetailField('services', [
                          {
                            id: 1,
                            title: 'Compra y Venta de Inmuebles',
                            description: 'Asesoría integral y personalizada para vender al mejor precio de mercado o adquirir tu propiedad soñada con total seguridad jurídica.',
                            image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
                            cta_text: 'Consultar Compra / Venta',
                          },
                          {
                            id: 2,
                            title: 'Alquiler y Administración de Propiedades',
                            description: 'Selección rigurosa de inquilinos, contratos blindados, cobro garantizado de rentas y gestión del mantenimiento preventivo.',
                            image_url: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80',
                            cta_text: 'Administrar mi Inmueble',
                          },
                          {
                            id: 3,
                            title: 'Asesoría Legal e Inmobiliaria',
                            description: 'Redacción y revisión de promesas de compraventa, levantamiento de hipotecas, regularización de linderos y trámites notariales.',
                            image_url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
                            cta_text: 'Solicitar Asesoría Legal',
                          },
                          {
                            id: 4,
                            title: 'Gestión de Créditos Hipotecarios',
                            description: 'Canalización directa de solicitudes de crédito con el Biess y bancos privados con tasas preferenciales y respuesta ágil.',
                            image_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
                            cta_text: 'Precalificar Crédito',
                          },
                          {
                            id: 5,
                            title: 'Avalúos Comerciales y Peritajes',
                            description: 'Determinación técnica, imparcial y documentada del valor comercial real de su propiedad basada en el mercado actual.',
                            image_url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
                            cta_text: 'Solicitar Avalúo Técnico',
                          },
                          {
                            id: 6,
                            title: 'Marketing Inmobiliario 360°',
                            description: 'Fotografía profesional, recorridos virtuales 3D, tomas con drones y campañas digitales segmentadas de alto impacto.',
                            image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
                            cta_text: 'Promocionar mi Propiedad',
                          },
                        ]);
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs cursor-pointer transition-all inline-flex items-center gap-2"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Cargar los 6 Servicios para Personalizarlos</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {form.details.services.map((service: any, idx: number) => (
                      <div
                        key={service.id || idx}
                        className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs space-y-3"
                      >
                        <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                          <span className="text-xs font-black uppercase text-emerald-600">
                            Servicio #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const list = form.details.services.filter((_: any, i: number) => i !== idx);
                              updateDetailField('services', list);
                            }}
                            className="text-rose-500 hover:text-rose-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Eliminar</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                              Título del Servicio:
                            </label>
                            <input
                              type="text"
                              value={service.title || ''}
                              onChange={(e) => {
                                const list = [...form.details.services];
                                list[idx] = { ...list[idx], title: e.target.value };
                                updateDetailField('services', list);
                              }}
                              placeholder="Ej: Compra y Venta de Inmuebles"
                              className="w-full px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                              Texto del Botón (CTA):
                            </label>
                            <input
                              type="text"
                              value={service.cta_text || ''}
                              onChange={(e) => {
                                const list = [...form.details.services];
                                list[idx] = { ...list[idx], cta_text: e.target.value };
                                updateDetailField('services', list);
                              }}
                              placeholder="Ej: Solicitar Asesoría"
                              className="w-full px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                            Descripción del Servicio:
                          </label>
                          <textarea
                            rows={2}
                            value={service.description || ''}
                            onChange={(e) => {
                              const list = [...form.details.services];
                              list[idx] = { ...list[idx], description: e.target.value };
                              updateDetailField('services', list);
                            }}
                            placeholder="Detalle los beneficios y alcance del servicio..."
                            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                            Foto / Imagen del Servicio:
                          </label>
                          <MediaPicker
                            value={service.image_url || service.photo || ''}
                            onChange={(selected) => {
                              const list = [...form.details.services];
                              list[idx] = { ...list[idx], image_url: selected?.url || '', photo: selected?.url || '' };
                              updateDetailField('services', list);
                            }}
                            label="Seleccionar Foto del Servicio"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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

                {/* Configuración de las Burbujas de Precio en el Mapa */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-600" /> Burbuja de Precio en el Mapa
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Personaliza el color de fondo y de texto de las burbujas de precio en el mapa interactivo (tanto en estado normal como cuando el visitante las toca).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Color de fondo normal */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                        Fondo de la Burbuja:
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={form.details?.map_pin_bg_color || '#ffffff'}
                          onChange={(e) => updateDetailField('map_pin_bg_color', e.target.value)}
                          className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5 bg-transparent"
                        />
                        <input
                          type="text"
                          value={form.details?.map_pin_bg_color || '#ffffff'}
                          onChange={(e) => updateDetailField('map_pin_bg_color', e.target.value)}
                          placeholder="#ffffff"
                          className="flex-grow px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Fondo por defecto de los botones/pines de precio.
                      </span>
                    </div>

                    {/* Color del texto normal */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                        Texto del Precio:
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={form.details?.map_pin_text_color || '#0f172a'}
                          onChange={(e) => updateDetailField('map_pin_text_color', e.target.value)}
                          className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5 bg-transparent"
                        />
                        <input
                          type="text"
                          value={form.details?.map_pin_text_color || '#0f172a'}
                          onChange={(e) => updateDetailField('map_pin_text_color', e.target.value)}
                          placeholder="#0f172a"
                          className="flex-grow px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Color de la cifra y divisa (ej: $250k USD).
                      </span>
                    </div>

                    {/* Color de fondo activo/tocado */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                        Fondo al Tocar (Seleccionado):
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={form.details?.map_pin_active_bg_color || form.primary_color || '#0f172a'}
                          onChange={(e) => updateDetailField('map_pin_active_bg_color', e.target.value)}
                          className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5 bg-transparent"
                        />
                        <input
                          type="text"
                          value={form.details?.map_pin_active_bg_color || form.primary_color || '#0f172a'}
                          onChange={(e) => updateDetailField('map_pin_active_bg_color', e.target.value)}
                          placeholder="#0f172a"
                          className="flex-grow px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Fondo que resalta la propiedad cuando se toca.
                      </span>
                    </div>

                    {/* Color del texto activo/tocado */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                        Texto al Tocar (Seleccionado):
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={form.details?.map_pin_active_text_color || '#ffffff'}
                          onChange={(e) => updateDetailField('map_pin_active_text_color', e.target.value)}
                          className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5 bg-transparent"
                        />
                        <input
                          type="text"
                          value={form.details?.map_pin_active_text_color || '#ffffff'}
                          onChange={(e) => updateDetailField('map_pin_active_text_color', e.target.value)}
                          placeholder="#ffffff"
                          className="flex-grow px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Color del texto al resaltar la propiedad.
                      </span>
                    </div>
                  </div>

                  {/* Vista previa en vivo de las burbujas */}
                  <div className="p-3 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-around gap-4">
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Estado Normal</span>
                      <div
                        style={{
                          backgroundColor: form.details?.map_pin_bg_color || '#ffffff',
                          color: form.details?.map_pin_text_color || '#0f172a',
                          borderColor: 'rgba(0, 0, 0, 0.12)',
                        }}
                        className="px-3 py-1.5 rounded-full font-extrabold text-xs shadow-md border flex items-center justify-center"
                      >
                        $185k USD
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Estado Tocado (Activo)</span>
                      <div
                        style={{
                          backgroundColor: form.details?.map_pin_active_bg_color || form.primary_color || '#0f172a',
                          color: form.details?.map_pin_active_text_color || '#ffffff',
                        }}
                        className="px-3.5 py-1.5 rounded-full font-extrabold text-xs shadow-lg ring-2 ring-white/60 scale-105 flex items-center justify-center"
                      >
                        $234k USD
                      </div>
                    </div>
                  </div>
                </div>

                {/* Configuración del Borde de los Filtros e Inputs */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-emerald-600" /> Borde de Filtros e Inputs (Branding)
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Personaliza el color del borde de los filtros del listado (buscador, operación, tipo, habitaciones, precio y más filtros).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                        Color del Borde de Filtros:
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={form.details?.filter_border_color || form.primary_color || '#00a884'}
                          onChange={(e) => updateDetailField('filter_border_color', e.target.value)}
                          className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5 bg-transparent"
                        />
                        <input
                          type="text"
                          value={form.details?.filter_border_color || form.primary_color || '#00a884'}
                          onChange={(e) => updateDetailField('filter_border_color', e.target.value)}
                          placeholder="#00a884"
                          className="flex-grow px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Por defecto utiliza el color primario de la marca.
                      </span>
                    </div>

                    {/* Previsualización del botón filtro con el borde de marca */}
                    <div className="flex flex-col justify-end">
                      <span className="text-[10px] font-bold text-slate-500 uppercase mb-1">Vista Previa:</span>
                      <div className="flex items-center gap-2">
                        <div
                          style={{
                            borderColor: form.details?.filter_border_color || form.primary_color || '#00a884',
                            borderWidth: '1.5px',
                          }}
                          className="h-[38px] px-3.5 rounded-xl border bg-white flex items-center gap-1.5 text-xs font-bold text-slate-800 shadow-2xs"
                        >
                          <span>Operación ▾</span>
                        </div>
                        <div
                          style={{
                            borderColor: form.details?.filter_border_color || form.primary_color || '#00a884',
                            borderWidth: '1.5px',
                            backgroundColor: `${form.details?.filter_border_color || form.primary_color || '#00a884'}15`,
                            color: form.details?.filter_border_color || form.primary_color || '#00a884',
                          }}
                          className="h-[38px] px-3.5 rounded-xl border flex items-center gap-1.5 text-xs font-black shadow-xs"
                        >
                          <span>Precio Activo ▾</span>
                        </div>
                      </div>
                    </div>
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

                {/* 3. Aviso y Consentimiento de Cookies */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <span>🍪</span> Aviso y Configuración de Cookies
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Personaliza el mensaje que se mostrará en el banner de cookies del frontend.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          updateDetailField(
                            'cookies_message',
                            'Utilizamos cookies propias y de terceros para brindarte la mejor experiencia de navegación, personalizar tus búsquedas de propiedades y analizar el tráfico de nuestro portal. Al continuar navegando, aceptas su uso según nuestra Política de Privacidad.'
                          )
                        }
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 hover:bg-amber-100 transition-colors cursor-pointer border border-amber-200 dark:border-amber-800"
                      >
                        Cargar Mensaje Estándar
                      </button>

                      <label className="relative inline-flex items-center cursor-pointer select-none" title="Activar/Desactivar aviso de cookies">
                        <input
                          type="checkbox"
                          checked={form.details?.cookies_enabled !== false}
                          onChange={(e) => updateDetailField('cookies_enabled', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Mensaje del Banner de Cookies:
                    </label>
                    <textarea
                      rows={4}
                      value={form.details?.cookies_message || ''}
                      onChange={(e) => updateDetailField('cookies_message', e.target.value)}
                      placeholder="Utilizamos cookies propias y de terceros para brindarte la mejor experiencia de navegación, personalizar tus búsquedas de propiedades y analizar el tráfico de nuestro portal..."
                      className="w-full px-4 py-3 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PESTAÑA 9: DESTINOS & CATEGORÍAS (Países, Ciudades y Categorías Globales - Solo Super Admin) */}
            {isSuperAdmin && activeTab === 'catalog' && (
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

            {/* PESTAÑA 11: INTEGRACIÓN GOOGLE SHEETS */}
            {activeTab === 'google_sheets' && selectedAgencyId && (
              <div className="space-y-6 animate-in fade-in-50 duration-200">
                <AgencyGoogleSheetsTab
                  agencyId={selectedAgencyId}
                  agencyName={agencies.find(a => a.id === selectedAgencyId)?.name}
                />
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
