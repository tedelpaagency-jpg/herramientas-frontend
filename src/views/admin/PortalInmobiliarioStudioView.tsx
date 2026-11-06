'use client';

import React, { useEffect, useState } from 'react';
import {
  Globe, Sparkles, Building2, ShieldCheck, CheckCircle2, AlertTriangle, AlertCircle,
  RefreshCw, Loader2, ExternalLink, Eye, EyeOff, Image as ImageIcon, Laptop, Tablet, Smartphone,
  Search, Check, Palette, Save, Phone, Mail, FileText, HelpCircle, Layers, Copy,
  Target, Compass, Users, Megaphone, Video, Play, MapPin, SlidersHorizontal,
  Briefcase, Plus, Trash2, Handshake, BadgeCheck, FileSpreadsheet, ArrowUp, ArrowDown, Code, GripVertical,
  ChevronDown, ChevronUp, Scale, Layout, Maximize2, Share2, Facebook, Instagram, Youtube, Linkedin
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

const DEFAULT_SERVICES_COMM_ITEMS_BOX1 = [
  'Análisis de mercado (ACM) y avalúo profesional.',
  'Fijación de precio óptimo según oferta y demanda.',
  'Definición del cliente objetivo.',
  'Gestión de prospectos, visitas y negociación.',
  'Acompañamiento hasta el cierre.',
];

const DEFAULT_SERVICES_COMM_ITEMS_BOX2 = [
  'Fotografía y video profesional.',
  'Publicación en portales y redes sociales.',
  'Campañas digitales segmentadas.',
  'Difusión en nuestra red de clientes e inversionistas.',
];

const DEFAULT_SERVICES_PROF_ITEMS = [
  {
    id: 1,
    title: 'Levantamiento topográfico',
    image_url: 'https://old.immobillis.com/old/wp-content/uploads/2022/11/pngwing.com-5.png.avif',
    description: 'Estudio técnico y descriptivo de un terreno, examinando la superficie terrestre en la cual se tienen en cuenta las características físicas, geográficas y geológicas del terreno, pero también sus variaciones y alteraciones, se denomina a este acopio de datos o plano que refleja al detalle y sirve como instrumento de planificación para edificaciones y construcciones.'
  },
  {
    id: 2,
    title: 'Diseño de proyectos arquitectónicos y urbanos',
    image_url: 'https://old.immobillis.com/old/wp-content/uploads/2022/11/pngwing.com-4.png.avif',
    description: 'Buscamos identificar la forma en que las personas usan las edificaciones y los espacios urbanos, y cómo se relacionan con los lugares donde viven, trabajan y pasean. Analiza básicamente una serie de consideraciones espaciales: diseño, escala, densidad, apariencia y paisaje.'
  },
  {
    id: 3,
    title: 'Representaciones, visualización en 3D y Renders.',
    image_url: 'https://old.immobillis.com/old/wp-content/uploads/2022/11/pngwing.com-6-768x576.png.avif',
    description: 'La representación en 3D es el proceso de crear una imagen fotorrealista en 2D a partir de modelos 3D. La representación en 3D es el paso final en el proceso de visualización en 3D, lo que conlleva la creación de modelos de objetos, la texturización de dichos objetos y la inclusión de luz en la escena.'
  }
];

const DEFAULT_SERVICES_LEGAL_ITEMS = [
  {
    id: 1,
    title: 'Servicios notariales',
    image_url: 'https://old.immobillis.com/old/wp-content/uploads/2022/11/enrollment.png.avif',
    description: 'Si estás buscando el hogar de tus sueños o si quieres vender algún inmueble, estos trámites ya no tendrán que pausarse. En inmobilis te contamos cuales son los trámites notariales o servicios inmobiliarios que puedes hacer.'
  },
  {
    id: 2,
    title: 'Escrituras, promesas de compra y venta.',
    image_url: 'https://old.immobillis.com/old/wp-content/uploads/2022/11/icono_documentos_estudiantes.png.avif',
    description: 'Una promesa de contrato que funciona como garantía, donde las partes se obligan recíprocamente a celebrar, en el futuro y con todos los requisitos que la Ley exige'
  },
  {
    id: 3,
    title: 'Poderes y Cartas-Permiso.',
    image_url: 'https://old.immobillis.com/old/wp-content/uploads/2022/11/documentos-1-274x300.png.avif',
    description: 'Se trata de un escrito mediante el cual una persona otorga o concede autorización a otra en su representación para que esta ejecute actos administrativos, mercantiles, judiciales o de dominio.'
  }
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

  // Estados de colapso de secciones en Conócenos
  const [collapsedAboutSections, setCollapsedAboutSections] = useState<Record<string, boolean>>({
    organizer: false,
    presentation: false,
    mission_vision: false,
    team: false,
    clients: false,
    allies: false,
    certifications: false,
    html_manager: false,
  });

  const toggleAboutSectionCollapse = (key: string) => {
    setCollapsedAboutSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const setAllAboutSectionsCollapse = (collapsed: boolean) => {
    setCollapsedAboutSections({
      organizer: collapsed,
      presentation: collapsed,
      mission_vision: collapsed,
      team: collapsed,
      clients: collapsed,
      allies: collapsed,
      certifications: collapsed,
      html_manager: collapsed,
    });
  };

  const [collapsedHtmlItems, setCollapsedHtmlItems] = useState<Record<string, boolean>>({});

  const toggleHtmlItemCollapse = (id: string | number) => {
    setCollapsedHtmlItems((prev) => ({
      ...prev,
      [String(id)]: !prev[String(id)],
    }));
  };

  // Estados de colapso de secciones en Servicios
  const [collapsedServicesSections, setCollapsedServicesSections] = useState<Record<string, boolean>>({
    organizer: false,
    comm_mkt: false,
    prof_advisory: false,
    legal_advisory: false,
    services_catalog: false,
    hero_cta: false,
    html_manager: false,
  });

  const toggleServicesSectionCollapse = (key: string) => {
    setCollapsedServicesSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const setAllServicesSectionsCollapse = (collapsed: boolean) => {
    setCollapsedServicesSections({
      organizer: collapsed,
      comm_mkt: collapsed,
      prof_advisory: collapsed,
      legal_advisory: collapsed,
      services_catalog: collapsed,
      hero_cta: collapsed,
      html_manager: collapsed,
    });
  };

  const [collapsedServicesHtmlItems, setCollapsedServicesHtmlItems] = useState<Record<string, boolean>>({});

  const toggleServicesHtmlItemCollapse = (id: string | number) => {
    setCollapsedServicesHtmlItems((prev) => ({
      ...prev,
      [String(id)]: !prev[String(id)],
    }));
  };

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
    facebook: '',
    instagram: '',
    tiktok: '',
    seo_title: '',
    seo_description: '',
    details: {
      target_workspace_id: '',
      facebook: '',
      instagram: '',
      tiktok: '',
      youtube: '',
      linkedin: '',
      x_twitter: '',
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
      hero_banner_mode: 'boxed',
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
      about_sections_order: ['presentation', 'mission_vision', 'team', 'clients', 'allies', 'certifications'],
      about_sections_hidden: [],
      about_html_sections: [],
      services_sections_order: ['commercial_marketing', 'professional_advisory', 'legal_advisory', 'services_catalog'],
      services_sections_hidden: [],
      services_html_sections: [],
      services_hero_title: 'Nuestros Servicios Inmobiliarios',
      services_hero_subtitle: '',
      services_cta_title: '¿Necesitas una solución inmobiliaria a la medida?',
      services_cta_subtitle: 'Nuestro equipo de asesores legales, técnicos y comerciales está listo para orientarte.',
      services_comm_mkt_title: 'Aseroría comercial y marketing',
      services_comm_mkt_subtitle: 'Explora nuestros servicios',
      services_comm_mkt_desc: 'En Immobillis desarrollamos estrategias integrales para vender o alquilar tu propiedad en el menor tiempo y al mejor precio.',
      services_comm_box1_title: 'Asesoría Comercial',
      services_comm_box1_items: DEFAULT_SERVICES_COMM_ITEMS_BOX1,
      services_comm_box2_title: 'Marketing Inmobiliario',
      services_comm_box2_items: DEFAULT_SERVICES_COMM_ITEMS_BOX2,
      services_prof_title: 'Asesoria Profesional',
      services_prof_subtitle: 'Asesoria',
      services_prof_items: DEFAULT_SERVICES_PROF_ITEMS,
      services_legal_title: 'Asesoria Juridica',
      services_legal_subtitle: 'Asesoria',
      services_legal_items: DEFAULT_SERVICES_LEGAL_ITEMS,
      services_catalog_title: 'Catálogo de Soluciones Integrales',
      services_catalog_subtitle: '',
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
      facebook: ag.facebook || parsedDetails?.facebook || '',
      instagram: ag.instagram || parsedDetails?.instagram || '',
      tiktok: ag.tiktok || parsedDetails?.tiktok || '',
      seo_title: ag.seo_title || `${ag.name || 'Inmobiliaria'} — Portal Oficial`,
      seo_description: ag.seo_description || `Explora las mejores propiedades en venta y alquiler con ${ag.name || 'nuestra agencia'}.`,
      details: {
        ...(parsedDetails || {}),
        facebook: parsedDetails?.facebook || ag.facebook || '',
        instagram: parsedDetails?.instagram || ag.instagram || '',
        tiktok: parsedDetails?.tiktok || ag.tiktok || '',
        youtube: parsedDetails?.youtube || '',
        linkedin: parsedDetails?.linkedin || '',
        x_twitter: parsedDetails?.x_twitter || parsedDetails?.twitter || '',
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
        hero_banner_mode: parsedDetails?.hero_banner_mode || 'boxed',
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
        about_sections_order: Array.isArray(parsedDetails?.about_sections_order)
          ? parsedDetails.about_sections_order.filter((k: string) => k !== 'custom_html')
          : ['presentation', 'mission_vision', 'team', 'clients', 'allies', 'certifications'],
        about_sections_hidden: Array.isArray(parsedDetails?.about_sections_hidden) ? parsedDetails.about_sections_hidden : [],
        about_html_sections: Array.isArray(parsedDetails?.about_html_sections) ? parsedDetails.about_html_sections : [],
        services_sections_order: Array.isArray(parsedDetails?.services_sections_order)
          ? parsedDetails.services_sections_order.filter((k: string) => k !== 'custom_html' && k !== 'clients' && k !== 'allies')
          : ['commercial_marketing', 'professional_advisory', 'legal_advisory', 'services_catalog'],
        services_sections_hidden: Array.isArray(parsedDetails?.services_sections_hidden) ? parsedDetails.services_sections_hidden : [],
        services_html_sections: Array.isArray(parsedDetails?.services_html_sections) ? parsedDetails.services_html_sections : [],
        services_hero_title: parsedDetails?.services_hero_title ?? 'Nuestros Servicios Inmobiliarios',
        services_hero_subtitle: parsedDetails?.services_hero_subtitle ?? '',
        services_cta_title: parsedDetails?.services_cta_title ?? '¿Necesitas una solución inmobiliaria a la medida?',
        services_cta_subtitle: parsedDetails?.services_cta_subtitle ?? 'Nuestro equipo de asesores legales, técnicos y comerciales está listo para orientarte.',
        services_comm_mkt_title: parsedDetails?.services_comm_mkt_title ?? 'Aseroría comercial y marketing',
        services_comm_mkt_subtitle: parsedDetails?.services_comm_mkt_subtitle ?? 'Explora nuestros servicios',
        services_comm_mkt_desc: parsedDetails?.services_comm_mkt_desc ?? 'En Immobillis desarrollamos estrategias integrales para vender o alquilar tu propiedad en el menor tiempo y al mejor precio.',
        services_comm_box1_title: parsedDetails?.services_comm_box1_title ?? 'Asesoría Comercial',
        services_comm_box1_items: Array.isArray(parsedDetails?.services_comm_box1_items) ? parsedDetails.services_comm_box1_items : DEFAULT_SERVICES_COMM_ITEMS_BOX1,
        services_comm_box2_title: parsedDetails?.services_comm_box2_title ?? 'Marketing Inmobiliario',
        services_comm_box2_items: Array.isArray(parsedDetails?.services_comm_box2_items) ? parsedDetails.services_comm_box2_items : DEFAULT_SERVICES_COMM_ITEMS_BOX2,
        services_prof_title: parsedDetails?.services_prof_title ?? 'Asesoria Profesional',
        services_prof_subtitle: parsedDetails?.services_prof_subtitle ?? 'Asesoria',
        services_prof_items: Array.isArray(parsedDetails?.services_prof_items) ? parsedDetails.services_prof_items : DEFAULT_SERVICES_PROF_ITEMS,
        services_legal_title: parsedDetails?.services_legal_title ?? 'Asesoria Juridica',
        services_legal_subtitle: parsedDetails?.services_legal_subtitle ?? 'Asesoria',
        services_legal_items: Array.isArray(parsedDetails?.services_legal_items) ? parsedDetails.services_legal_items : DEFAULT_SERVICES_LEGAL_ITEMS,
        services_catalog_title: parsedDetails?.services_catalog_title ?? 'Catálogo de Soluciones Integrales',
        services_catalog_subtitle: parsedDetails?.services_catalog_subtitle ?? '',
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
        facebook: form.facebook || form.details?.facebook || '',
        instagram: form.instagram || form.details?.instagram || '',
        tiktok: form.tiktok || form.details?.tiktok || '',
        details: {
          ...(form.details || {}),
          banner_video: form.details?.banner_video || form.banner_video || '',
          facebook: form.facebook || form.details?.facebook || '',
          instagram: form.instagram || form.details?.instagram || '',
          tiktok: form.tiktok || form.details?.tiktok || '',
          youtube: form.details?.youtube || '',
          linkedin: form.details?.linkedin || '',
          x_twitter: form.details?.x_twitter || form.details?.twitter || '',
          whatsapp: form.whatsapp || form.details?.whatsapp || '',
          footer_about_text: form.details?.footer_about_text || '',
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

                    {/* Selector de Modo de Diseño del Banner: Enmarcado (Default) vs Extendido Full Width */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                          Modo de Diseño del Banner Principal (Hero):
                        </label>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Elige cómo se presentará el banner de video o imagen en la cabecera de la página principal.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Opción 1: Enmarcado / Estándar (Default) */}
                        <div
                          onClick={() => updateDetailField('hero_banner_mode', 'boxed')}
                          className={`relative p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                            (form.details?.hero_banner_mode || 'boxed') === 'boxed'
                              ? 'border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/30 ring-2 ring-emerald-400/40'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
                                <Layout className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-xs font-black text-slate-900 dark:text-white">
                                  Enmarcado con Márgenes
                                </div>
                                <div className="text-[10px] text-slate-500 font-medium">
                                  Por Defecto
                                </div>
                              </div>
                            </div>
                            {(form.details?.hero_banner_mode || 'boxed') === 'boxed' && (
                              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </span>
                            )}
                          </div>

                          {/* Mini Diagrama Visual */}
                          <div className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800/80 p-2 flex items-center justify-center border border-slate-200 dark:border-slate-700/60">
                            <div className="w-[84%] h-[80%] rounded-lg bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-[9px] font-bold text-emerald-800 dark:text-emerald-200">
                              Banner Enmarcado
                            </div>
                          </div>

                          <p className="text-[10.5px] text-slate-600 dark:text-slate-400 m-0 leading-snug">
                            Diseño estándar con bordes redondeados y márgenes elegantes superior, inferior y laterales.
                          </p>
                        </div>

                        {/* Opción 2: Extendido / Full Width */}
                        <div
                          onClick={() => updateDetailField('hero_banner_mode', 'full_width')}
                          className={`relative p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                            form.details?.hero_banner_mode === 'full_width'
                              ? 'border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/30 ring-2 ring-emerald-400/40'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
                                <Maximize2 className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-xs font-black text-slate-900 dark:text-white">
                                  Video Extendido (Full Width)
                                </div>
                                <div className="text-[10px] text-slate-500 font-medium">
                                  Sin Márgenes
                                </div>
                              </div>
                            </div>
                            {form.details?.hero_banner_mode === 'full_width' && (
                              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </span>
                            )}
                          </div>

                          {/* Mini Diagrama Visual */}
                          <div className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800/80 p-0 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700/60">
                            <div className="w-full h-full bg-emerald-600/40 border-y border-emerald-500/50 flex items-center justify-center text-[9px] font-bold text-emerald-800 dark:text-emerald-200">
                              Borde a Borde (100% Ancho)
                            </div>
                          </div>

                          <p className="text-[10.5px] text-slate-600 dark:text-slate-400 m-0 leading-snug">
                            El video/imagen se expande de extremo a extremo sin márgenes superior, inferior, izquierdo ni derecho.
                          </p>
                        </div>
                      </div>
                    </div>
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
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 block mb-1">
                        Link de App en Google Play Store (Opcional):
                      </span>
                      <input
                        type="url"
                        value={form.details?.play_store_url || ''}
                        onChange={(e) => updateDetailField('play_store_url', e.target.value)}
                        placeholder="https://play.google.com/store/apps/details?id=..."
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border rounded-lg"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Si tu agencia tiene una aplicación en Google Play Store, se mostrará el botón de descarga en el encabezado y pie de página.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CONÓCENOS (NOSOTROS) */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-600" /> Sección Conócenos / Identidad Institucional
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Configura el orden de las secciones, clientes, asociados, certificaciones y bloques HTML independientes.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setAllAboutSectionsCollapse(false)}
                      className="px-2.5 py-1 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors cursor-pointer"
                    >
                      Expandir Todas
                    </button>
                    <button
                      type="button"
                      onClick={() => setAllAboutSectionsCollapse(true)}
                      className="px-2.5 py-1 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors cursor-pointer"
                    >
                      Colapsar Todas
                    </button>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* ORGANIZADOR Y VISIBILIDAD DE SECCIONES (INCLUYE CADA SECCIÓN HTML DE FORMA INDEPENDIENTE) */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden shadow-xs transition-all">
                    <div
                      className="p-4 flex items-center justify-between cursor-pointer select-none bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/70 transition-colors"
                      onClick={() => toggleAboutSectionCollapse('organizer')}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">
                          <GripVertical className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase flex items-center gap-2">
                            <span>Orden y Visibilidad de Secciones en Conócenos</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 lowercase">
                              interactivo
                            </span>
                          </h4>
                          <p className="text-[11px] text-slate-500 m-0">
                            Reordena y activa/oculta cada sección (incluyendo cada bloque HTML de forma independiente).
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const baseKeys = ['presentation', 'mission_vision', 'team', 'clients', 'allies', 'certifications'];
                            const htmlKeys = (Array.isArray(form.details?.about_html_sections) ? form.details.about_html_sections : []).map(
                              (s: any) => `html_${s.id}`
                            );
                            updateDetailField('about_sections_order', [...baseKeys, ...htmlKeys]);
                            updateDetailField('about_sections_hidden', []);
                          }}
                          className="text-[10px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline cursor-pointer mr-2"
                        >
                          Restablecer Orden
                        </button>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                          {collapsedAboutSections.organizer ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    {!collapsedAboutSections.organizer && (
                      <div className="p-4 space-y-2 border-t border-slate-100 dark:border-slate-800">
                        {(() => {
                          const htmlSectionsList: any[] = Array.isArray(form.details?.about_html_sections)
                            ? form.details.about_html_sections
                            : [];

                          const baseSections = [
                            { id: 'presentation', label: 'Quiénes Somos / Presentación', icon: Building2, desc: 'Historia institucional, imagen y puntos clave' },
                            { id: 'mission_vision', label: 'Misión y Visión', icon: Target, desc: 'Tarjetas de propósito corporativo' },
                            { id: 'team', label: 'Equipo de Asesores', icon: Users, desc: 'Listado sincronizado de agentes de la agencia' },
                            { id: 'clients', label: 'Nuestros Clientes (Carrusel de Logos)', icon: Sparkles, desc: 'Carrusel de logos de clientes destacados' },
                            { id: 'allies', label: 'Asociados Comerciales', icon: Handshake, desc: 'Tarjetas con imagen, título y descripción' },
                            { id: 'certifications', label: 'Certificaciones y Acreditaciones', icon: BadgeCheck, desc: 'Licencias oficiales y avales profesionales' },
                          ];

                          // Cada sección HTML se mapea como una sección independiente en el organizador
                          const htmlSectionsMeta = htmlSectionsList.map((sec, i) => ({
                            id: `html_${sec.id}`,
                            rawId: sec.id,
                            isHtml: true,
                            label: sec.title && sec.title.trim() !== '' ? `Sección HTML: ${sec.title}` : `Sección HTML #${i + 1}`,
                            icon: Code,
                            desc: sec.subtitle || (sec.container === 'full' ? 'Ancho Completo' : 'Contenedor Enmarcado'),
                          }));

                          const allSections = [...baseSections, ...htmlSectionsMeta];

                          const currentOrder: string[] = (
                            Array.isArray(form.details?.about_sections_order) && form.details.about_sections_order.length > 0
                              ? form.details.about_sections_order
                              : allSections.map((s) => s.id)
                          ).filter((k: string) => k !== 'custom_html');

                          const fullOrder: string[] = [];
                          currentOrder.forEach((sId) => {
                            if (sId && !fullOrder.includes(sId)) fullOrder.push(sId);
                          });
                          allSections.forEach((s) => {
                            if (!fullOrder.includes(s.id)) fullOrder.push(s.id);
                          });

                          const hiddenList: string[] = Array.isArray(form.details?.about_sections_hidden)
                            ? form.details.about_sections_hidden
                            : [];

                          return fullOrder.map((secId, idx) => {
                            const meta = allSections.find((s) => s.id === secId) || {
                              id: secId,
                              label: secId.startsWith('html_') ? `Sección HTML (${secId.replace('html_', '#')})` : secId,
                              icon: secId.startsWith('html_') ? Code : Building2,
                              desc: 'Sección personalizada',
                            };
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
                                  <div className={`p-1.5 rounded-lg shrink-0 ${
                                    secId.startsWith('html_')
                                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600'
                                      : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600'
                                  }`}>
                                    <IconComp className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="truncate">
                                    <div className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                      <span>{meta.label}</span>
                                      {secId.startsWith('html_') && (
                                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-md bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                                          HTML Independiente
                                        </span>
                                      )}
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
                    )}
                  </div>

                  {/* 1. Quiénes Somos */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden shadow-xs transition-all">
                    <div
                      className="p-4 flex items-center justify-between cursor-pointer select-none bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/70 transition-colors"
                      onClick={() => toggleAboutSectionCollapse('presentation')}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase flex items-center gap-2">
                            Quiénes Somos / Presentación
                          </h4>
                          <p className="text-[11px] text-slate-500 m-0">
                            Historia institucional, texto principal, imagen y puntos de valor.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 hidden sm:inline">
                          {form.about_title ? (form.about_title.length > 25 ? form.about_title.slice(0, 25) + '...' : form.about_title) : 'Configurado'}
                        </span>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                          {collapsedAboutSections.presentation ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    {!collapsedAboutSections.presentation && (
                      <div className="p-4 space-y-4 border-t border-slate-100 dark:border-slate-800">
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

                        {/* Puntos Clave */}
                        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
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
                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
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
                    )}
                  </div>

                  {/* 2. Misión y Visión */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden shadow-xs transition-all">
                    <div
                      className="p-4 flex items-center justify-between cursor-pointer select-none bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/70 transition-colors"
                      onClick={() => toggleAboutSectionCollapse('mission_vision')}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600">
                          <Target className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase flex items-center gap-2">
                            Misión y Visión Institucional
                          </h4>
                          <p className="text-[11px] text-slate-500 m-0">
                            Propósito, valores de futuro e imágenes corporativas.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                          {collapsedAboutSections.mission_vision ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    {!collapsedAboutSections.mission_vision && (
                      <div className="p-4 space-y-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Misión */}
                          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 space-y-3">
                            <h5 className="text-xs font-black text-slate-800 dark:text-white uppercase flex items-center gap-1.5">
                              <Target className="w-3.5 h-3.5 text-emerald-600" />
                              Nuestra Misión
                            </h5>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                                Título Misión:
                              </label>
                              <input
                                type="text"
                                value={form.details?.mission_title || 'Nuestra Misión'}
                                onChange={(e) => updateDetailField('mission_title', e.target.value)}
                                className="w-full px-3 py-2 text-xs font-bold bg-white dark:bg-slate-900 border rounded-lg"
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
                                placeholder="Brindar soluciones inmobiliarias seguras..."
                                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border rounded-lg"
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
                          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 space-y-3">
                            <h5 className="text-xs font-black text-slate-800 dark:text-white uppercase flex items-center gap-1.5">
                              <Compass className="w-3.5 h-3.5 text-blue-600" />
                              Nuestra Visión
                            </h5>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                                Título Visión:
                              </label>
                              <input
                                type="text"
                                value={form.details?.vision_title || 'Nuestra Visión'}
                                onChange={(e) => updateDetailField('vision_title', e.target.value)}
                                className="w-full px-3 py-2 text-xs font-bold bg-white dark:bg-slate-900 border rounded-lg"
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
                                placeholder="Ser la agencia inmobiliaria líder..."
                                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border rounded-lg"
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
                      </div>
                    )}
                  </div>

                  {/* 3. Valores y Equipo de Asesores */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden shadow-xs transition-all">
                    <div
                      className="p-4 flex items-center justify-between cursor-pointer select-none bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/70 transition-colors"
                      onClick={() => toggleAboutSectionCollapse('team')}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase flex items-center gap-2">
                            Sección de Asesores / Agentes
                          </h4>
                          <p className="text-[11px] text-slate-500 m-0">
                            Título y subtítulo del equipo sincronizado de la agencia.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                          {collapsedAboutSections.team ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    {!collapsedAboutSections.team && (
                      <div className="p-4 space-y-3 border-t border-slate-100 dark:border-slate-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                              Título de la Sección Agentes:
                            </label>
                            <input
                              type="text"
                              value={form.details?.team_title || 'Nuestro Equipo de Asesores'}
                              onChange={(e) => updateDetailField('team_title', e.target.value)}
                              className="w-full px-3 py-2 text-xs font-bold bg-white dark:bg-slate-900 border rounded-lg"
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
                              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border rounded-lg"
                            />
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500 italic">
                          * Los asesores mostrados se sincronizan automáticamente desde los agentes activos registrados en la agencia.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 4. NUESTROS CLIENTES (CARRUSEL DE LOGOS) */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden shadow-xs transition-all">
                    <div
                      className="p-4 flex items-center justify-between cursor-pointer select-none bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/70 transition-colors"
                      onClick={() => toggleAboutSectionCollapse('clients')}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-500">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase flex items-center gap-2">
                            <span>Nuestros Clientes (Carrusel de Logos)</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                              {form.details?.our_clients?.length || 0} logos
                            </span>
                          </h4>
                          <p className="text-[11px] text-slate-500 m-0">
                            Logos e imágenes de empresas en carrusel horizontal panorámico.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                          {collapsedAboutSections.clients ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    {!collapsedAboutSections.clients && (
                      <div className="p-4 space-y-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between flex-wrap gap-2 pb-2">
                          <p className="text-xs text-slate-500 m-0">
                            Agrega los logos o imágenes de empresas clientes. Se mostrarán sin fondo ni bordes de forma fluida.
                          </p>
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
                    )}
                  </div>

                  {/* 5. Asociados Comerciales (Aliados) */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden shadow-xs transition-all">
                    <div
                      className="p-4 flex items-center justify-between cursor-pointer select-none bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/70 transition-colors"
                      onClick={() => toggleAboutSectionCollapse('allies')}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600">
                          <Handshake className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase flex items-center gap-2">
                            <span>Asociados Comerciales (Tarjetas)</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                              {form.details?.commercial_allies?.length || 0} aliados
                            </span>
                          </h4>
                          <p className="text-[11px] text-slate-500 m-0">
                            Entidades financieras, notarías, aseguradoras y gremios en tarjetas limpias.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                          {collapsedAboutSections.allies ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    {!collapsedAboutSections.allies && (
                      <div className="p-4 space-y-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between flex-wrap gap-2 pb-2">
                          <p className="text-xs text-slate-500 m-0">
                            En el frontend se listarán como tarjetas limpias sin marco blanco forzado según el diseño acordado.
                          </p>
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
                    )}
                  </div>

                  {/* 6. Certificaciones y Acreditaciones */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden shadow-xs transition-all">
                    <div
                      className="p-4 flex items-center justify-between cursor-pointer select-none bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/70 transition-colors"
                      onClick={() => toggleAboutSectionCollapse('certifications')}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">
                          <BadgeCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase flex items-center gap-2">
                            <span>Certificaciones y Acreditaciones</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                              {form.details?.certifications?.length || 0} certificados
                            </span>
                          </h4>
                          <p className="text-[11px] text-slate-500 m-0">
                            Licencias oficiales, avales y membresías gremiales.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                          {collapsedAboutSections.certifications ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    {!collapsedAboutSections.certifications && (
                      <div className="p-4 space-y-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between flex-wrap gap-2 pb-2">
                          <p className="text-xs text-slate-500 m-0">
                            Certificaciones jurídicas y licencias profesionales otorgadas a la agencia.
                          </p>
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
                    )}
                  </div>

                  {/* 7. SECCIONES PERSONALIZADAS CON HTML PURO (INDEPENDIENTES) */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden shadow-xs transition-all">
                    <div
                      className="p-4 flex items-center justify-between cursor-pointer select-none bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/70 transition-colors"
                      onClick={() => toggleAboutSectionCollapse('html_manager')}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600">
                          <Code className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase flex items-center gap-2">
                            <span>Secciones Personalizadas con HTML Puro</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                              {form.details?.about_html_sections?.length || 0} independientes
                            </span>
                          </h4>
                          <p className="text-[11px] text-slate-500 m-0">
                            Cada bloque HTML se posiciona de forma autónoma en el Organizador de arriba.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                          {collapsedAboutSections.html_manager ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    {!collapsedAboutSections.html_manager && (
                      <div className="p-4 space-y-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between flex-wrap gap-2 pb-2">
                          <p className="text-xs text-slate-500 m-0">
                            Puedes crear tantas secciones HTML como necesites y ordenarlas individualmente entre las demás secciones de Conócenos.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              const newId = Date.now();
                              const list = Array.isArray(form.details?.about_html_sections) ? [...form.details.about_html_sections] : [];
                              list.push({
                                id: newId,
                                title: '',
                                subtitle: '',
                                container: 'boxed',
                                bg_color: '',
                                html: '<div className="p-8 text-center bg-slate-50 rounded-3xl border border-slate-200">\n  <h3 className="text-xl font-bold text-slate-900 mb-2">Sección Personalizada</h3>\n  <p className="text-sm text-slate-600">Escribe aquí tu código HTML o incrusta contenido.</p>\n</div>',
                              });
                              updateDetailField('about_html_sections', list);

                              // Agregar al orden de secciones de inmediato
                              const curOrder = Array.isArray(form.details?.about_sections_order) ? [...form.details.about_sections_order] : [];
                              const newKey = `html_${newId}`;
                              if (!curOrder.includes(newKey)) {
                                curOrder.push(newKey);
                                updateDetailField('about_sections_order', curOrder);
                              }
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
                              No tienes secciones de HTML puro configuradas. Puedes agregar una con el botón superior.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {form.details.about_html_sections.map((sec: any, idx: number) => {
                              const isItemCollapsed = Boolean(collapsedHtmlItems[String(sec.id)]);
                              return (
                                <div key={sec.id || idx} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 overflow-hidden space-y-0 transition-all">
                                  {/* Encabezado colapsable individual para cada sección HTML */}
                                  <div
                                    className="p-3 bg-slate-100/70 dark:bg-slate-900/60 flex items-center justify-between gap-2 cursor-pointer select-none"
                                    onClick={() => toggleHtmlItemCollapse(sec.id)}
                                  >
                                    <div className="flex items-center gap-2 truncate">
                                      <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400">
                                        Sección HTML #{idx + 1}
                                      </span>
                                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                                        {sec.title && sec.title.trim() !== '' ? sec.title : '(Sin título)'}
                                      </span>
                                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                                        {sec.container === 'full' ? 'Ancho Completo' : 'Enmarcado'}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
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

                                          // Limpiar de about_sections_order y hidden
                                          const targetKey = `html_${sec.id}`;
                                          if (Array.isArray(form.details?.about_sections_order)) {
                                            updateDetailField(
                                              'about_sections_order',
                                              form.details.about_sections_order.filter((k: string) => k !== targetKey && k !== String(sec.id))
                                            );
                                          }
                                          if (Array.isArray(form.details?.about_sections_hidden)) {
                                            updateDetailField(
                                              'about_sections_hidden',
                                              form.details.about_sections_hidden.filter((k: string) => k !== targetKey && k !== String(sec.id))
                                            );
                                          }
                                        }}
                                        className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                                        title="Eliminar sección HTML"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                      <div className="w-6 h-6 flex items-center justify-center text-slate-400">
                                        {isItemCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                                      </div>
                                    </div>
                                  </div>

                                  {!isItemCollapsed && (
                                    <div className="p-3.5 space-y-3 border-t border-slate-200 dark:border-slate-800">
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
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SERVICIOS INMOBILIARIOS CONFIGURABLES */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-emerald-600" /> Página de Servicios / Catálogo y Asesorías
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Gestiona el orden de secciones, asesorías comerciales, jurídicas y profesionales, carrusel de clientes, asociados comerciales y bloques HTML para la página <code>/services</code>.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setAllServicesSectionsCollapse(false)}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      Expandir Todas
                    </button>
                    <button
                      type="button"
                      onClick={() => setAllServicesSectionsCollapse(true)}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      Colapsar Todas
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* 1. Organizador y Visibilidad de Secciones de Servicios */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden shadow-xs transition-all">
                    <div
                      className="p-4 flex items-center justify-between cursor-pointer select-none bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/70 transition-colors"
                      onClick={() => toggleServicesSectionCollapse('organizer')}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">
                          <GripVertical className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase flex items-center gap-2">
                            <span>Organizador y Visibilidad de Secciones (Servicios)</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                              Arrastra / Reordena
                            </span>
                          </h4>
                          <p className="text-[11px] text-slate-500 m-0">
                            Modifica el orden vertical y activa/desactiva secciones en la página <code>/services</code>.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const baseKeys = ['commercial_marketing', 'professional_advisory', 'legal_advisory', 'services_catalog'];
                            const htmlKeys = (Array.isArray(form.details?.services_html_sections) ? form.details.services_html_sections : []).map(
                              (s: any) => `html_${s.id}`
                            );
                            updateDetailField('services_sections_order', [...baseKeys, ...htmlKeys]);
                            updateDetailField('services_sections_hidden', []);
                          }}
                          className="text-[10px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline cursor-pointer mr-2"
                        >
                          Restablecer Orden
                        </button>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                          {collapsedServicesSections.organizer ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    {!collapsedServicesSections.organizer && (
                      <div className="p-4 space-y-2 border-t border-slate-100 dark:border-slate-800">
                        {(() => {
                          const htmlSectionsList: any[] = Array.isArray(form.details?.services_html_sections)
                            ? form.details.services_html_sections
                            : [];

                          const baseSections = [
                            { id: 'commercial_marketing', label: 'Asesoría Comercial y Marketing', icon: Briefcase, desc: 'Cajas de asesoría y marketing con viñetas' },
                            { id: 'professional_advisory', label: 'Asesoría Profesional (Acordeón)', icon: Compass, desc: 'Topografía, arquitectura, renders 3D' },
                            { id: 'legal_advisory', label: 'Asesoría Jurídica (Acordeón)', icon: Scale, desc: 'Servicios notariales, escrituras, poderes' },
                            { id: 'services_catalog', label: 'Catálogo de Servicios Generales', icon: Layers, desc: 'Tarjetas de servicios adicionales con botón WhatsApp' },
                          ];

                          const htmlSectionsMeta = htmlSectionsList.map((sec, i) => ({
                            id: `html_${sec.id}`,
                            rawId: sec.id,
                            isHtml: true,
                            label: sec.title && sec.title.trim() !== '' ? `Sección HTML: ${sec.title}` : `Sección HTML #${i + 1}`,
                            icon: Code,
                            desc: sec.subtitle || (sec.container === 'full' ? 'Ancho Completo' : 'Contenedor Enmarcado'),
                          }));

                          const allSections = [...baseSections, ...htmlSectionsMeta];

                          const currentOrder: string[] = (
                            Array.isArray(form.details?.services_sections_order) && form.details.services_sections_order.length > 0
                              ? form.details.services_sections_order
                              : allSections.map((s) => s.id)
                          ).filter((k: string) => k !== 'custom_html' && k !== 'clients' && k !== 'allies');

                          const fullOrder: string[] = [];
                          currentOrder.forEach((sId) => {
                            if (sId && !fullOrder.includes(sId)) fullOrder.push(sId);
                          });
                          allSections.forEach((s) => {
                            if (!fullOrder.includes(s.id)) fullOrder.push(s.id);
                          });

                          const hiddenList: string[] = Array.isArray(form.details?.services_sections_hidden)
                            ? form.details.services_sections_hidden
                            : [];

                          return fullOrder.map((secId, idx) => {
                            const meta = allSections.find((s) => s.id === secId) || {
                              id: secId,
                              label: secId.startsWith('html_') ? `Sección HTML (${secId.replace('html_', '#')})` : secId,
                              icon: secId.startsWith('html_') ? Code : Briefcase,
                              desc: 'Sección personalizada',
                            };
                            const isHidden = hiddenList.includes(secId);
                            const IconComp = meta.icon;

                            return (
                              <div
                                key={secId}
                                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                                  isHidden
                                    ? 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 opacity-60'
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-2xs'
                                }`}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-mono text-[10px] font-bold shrink-0">
                                    {idx + 1}
                                  </div>
                                  <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 shrink-0">
                                    <IconComp className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="min-w-0">
                                    <h5 className="text-xs font-bold text-slate-800 dark:text-white truncate m-0">
                                      {meta.label}
                                    </h5>
                                    <p className="text-[11px] text-slate-400 truncate m-0">
                                      {meta.desc}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0 ml-3">
                                  {/* Botón Mover Arriba */}
                                  <button
                                    type="button"
                                    disabled={idx === 0}
                                    onClick={() => {
                                      if (idx === 0) return;
                                      const next = [...fullOrder];
                                      const [moved] = next.splice(idx, 1);
                                      next.splice(idx - 1, 0, moved);
                                      updateDetailField('services_sections_order', next);
                                    }}
                                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                    title="Subir sección"
                                  >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Botón Mover Abajo */}
                                  <button
                                    type="button"
                                    disabled={idx === fullOrder.length - 1}
                                    onClick={() => {
                                      if (idx === fullOrder.length - 1) return;
                                      const next = [...fullOrder];
                                      const [moved] = next.splice(idx, 1);
                                      next.splice(idx + 1, 0, moved);
                                      updateDetailField('services_sections_order', next);
                                    }}
                                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                    title="Bajar sección"
                                  >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Botón Ocultar / Mostrar */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const nextHidden = isHidden
                                        ? hiddenList.filter((k: string) => k !== secId)
                                        : [...hiddenList, secId];
                                      updateDetailField('services_sections_hidden', nextHidden);
                                    }}
                                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                      isHidden
                                        ? 'border-rose-200 bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:border-rose-900'
                                        : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-900'
                                    }`}
                                    title={isHidden ? 'Sección oculta (clic para mostrar)' : 'Sección visible (clic para ocultar)'}
                                  >
                                    {isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                  </button>
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    )}
                  </div>

                  {/* 2. Asesoría Comercial y Marketing */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden shadow-xs transition-all">
                    <div
                      className="p-4 flex items-center justify-between cursor-pointer select-none bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/70 transition-colors"
                      onClick={() => toggleServicesSectionCollapse('comm_mkt')}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase flex items-center gap-2">
                            <span>Asesoría Comercial y Marketing</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                              2 Columnas con Viñetas
                            </span>
                          </h4>
                          <p className="text-[11px] text-slate-500 m-0">
                            Bloques de asesoría comercial y marketing inmobiliario.
                          </p>
                        </div>
                      </div>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        {collapsedServicesSections.comm_mkt ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                      </div>
                    </div>

                    {!collapsedServicesSections.comm_mkt && (
                      <div className="p-4 space-y-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                              Título Principal de la Sección:
                            </label>
                            <input
                              type="text"
                              value={form.details?.services_comm_mkt_title ?? ''}
                              onChange={(e) => updateDetailField('services_comm_mkt_title', e.target.value)}
                              placeholder="Ej: Aseroría comercial y marketing"
                              className="w-full px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                              Subtítulo Superior (opcional):
                            </label>
                            <input
                              type="text"
                              value={form.details?.services_comm_mkt_subtitle ?? ''}
                              onChange={(e) => updateDetailField('services_comm_mkt_subtitle', e.target.value)}
                              placeholder="Ej: Explora nuestros servicios (dejar vacío si no deseas nada)"
                              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                            Descripción Introductoria:
                          </label>
                          <textarea
                            rows={2}
                            value={form.details?.services_comm_mkt_desc ?? ''}
                            onChange={(e) => updateDetailField('services_comm_mkt_desc', e.target.value)}
                            placeholder="Descripción general de las estrategias..."
                            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
                          />
                        </div>

                        {/* Configuración de las 2 Cajas */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                          {/* Caja 1 */}
                          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/40 space-y-3">
                            <label className="block text-xs font-black uppercase text-slate-800 dark:text-white">
                              Caja 1: Título y Viñetas
                            </label>
                            <input
                              type="text"
                              value={form.details?.services_comm_box1_title ?? ''}
                              onChange={(e) => updateDetailField('services_comm_box1_title', e.target.value)}
                              placeholder="Ej: Asesoría Comercial"
                              className="w-full px-3 py-1.5 text-xs font-bold bg-white dark:bg-slate-900 border rounded-lg"
                            />
                            <div>
                              <label className="block text-[11px] font-bold text-slate-500 mb-1">
                                Viñetas (una por línea):
                              </label>
                              <textarea
                                rows={5}
                                value={(form.details?.services_comm_box1_items || []).join('\n')}
                                onChange={(e) => {
                                  const lines = e.target.value.split('\n');
                                  updateDetailField('services_comm_box1_items', lines);
                                }}
                                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border rounded-lg font-sans leading-relaxed"
                              />
                            </div>
                          </div>

                          {/* Caja 2 */}
                          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/40 space-y-3">
                            <label className="block text-xs font-black uppercase text-slate-800 dark:text-white">
                              Caja 2: Título y Viñetas
                            </label>
                            <input
                              type="text"
                              value={form.details?.services_comm_box2_title ?? ''}
                              onChange={(e) => updateDetailField('services_comm_box2_title', e.target.value)}
                              placeholder="Ej: Marketing Inmobiliario"
                              className="w-full px-3 py-1.5 text-xs font-bold bg-white dark:bg-slate-900 border rounded-lg"
                            />
                            <div>
                              <label className="block text-[11px] font-bold text-slate-500 mb-1">
                                Viñetas (una por línea):
                              </label>
                              <textarea
                                rows={5}
                                value={(form.details?.services_comm_box2_items || []).join('\n')}
                                onChange={(e) => {
                                  const lines = e.target.value.split('\n');
                                  updateDetailField('services_comm_box2_items', lines);
                                }}
                                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border rounded-lg font-sans leading-relaxed"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 3. Asesoría Profesional (Acordeón) */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden shadow-xs transition-all">
                    <div
                      className="p-4 flex items-center justify-between cursor-pointer select-none bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/70 transition-colors"
                      onClick={() => toggleServicesSectionCollapse('prof_advisory')}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600">
                          <Compass className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase flex items-center gap-2">
                            <span>Asesoría Profesional (Acordeón Interactivo)</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                              {form.details?.services_prof_items?.length || 0} ítems
                            </span>
                          </h4>
                          <p className="text-[11px] text-slate-500 m-0">
                            Levantamientos topográficos, diseños arquitectónicos, renders 3D.
                          </p>
                        </div>
                      </div>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        {collapsedServicesSections.prof_advisory ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                      </div>
                    </div>

                    {!collapsedServicesSections.prof_advisory && (
                      <div className="p-4 space-y-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                              Título de la Sección:
                            </label>
                            <input
                              type="text"
                              value={form.details?.services_prof_title ?? ''}
                              onChange={(e) => updateDetailField('services_prof_title', e.target.value)}
                              placeholder="Ej: Asesoria Profesional"
                              className="w-full px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                              Subtítulo Superior (opcional):
                            </label>
                            <input
                              type="text"
                              value={form.details?.services_prof_subtitle ?? ''}
                              onChange={(e) => updateDetailField('services_prof_subtitle', e.target.value)}
                              placeholder="Ej: Asesoria (dejar vacío si no deseas subtítulo)"
                              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                            Ítems del Acordeón Profesional:
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const list = Array.isArray(form.details?.services_prof_items) ? [...form.details.services_prof_items] : [];
                              list.push({
                                id: Date.now(),
                                title: 'Nueva Asesoría Profesional',
                                image_url: 'https://old.immobillis.com/old/wp-content/uploads/2022/11/pngwing.com-5.png.avif',
                                description: 'Descripción detallada del servicio técnico especializado...',
                              });
                              updateDetailField('services_prof_items', list);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Agregar Ítem</span>
                          </button>
                        </div>

                        <div className="space-y-3">
                          {(form.details?.services_prof_items || []).map((item: any, idx: number) => (
                            <div
                              key={item.id || idx}
                              className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/40 space-y-3"
                            >
                              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
                                <span className="text-xs font-black uppercase text-indigo-600">
                                  Ítem #{idx + 1}: {item.title || 'Sin título'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const list = form.details.services_prof_items.filter((_: any, i: number) => i !== idx);
                                    updateDetailField('services_prof_items', list);
                                  }}
                                  className="text-rose-500 hover:text-rose-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Eliminar</span>
                                </button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                                    Título:
                                  </label>
                                  <input
                                    type="text"
                                    value={item.title || ''}
                                    onChange={(e) => {
                                      const list = [...form.details.services_prof_items];
                                      list[idx] = { ...list[idx], title: e.target.value };
                                      updateDetailField('services_prof_items', list);
                                    }}
                                    placeholder="Ej: Levantamiento topográfico"
                                    className="w-full px-3 py-1.5 text-xs font-bold bg-white dark:bg-slate-900 border rounded-lg"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                                    Imagen / Icono:
                                  </label>
                                  <MediaPicker
                                    value={item.image_url || ''}
                                    onChange={(selected) => {
                                      const list = [...form.details.services_prof_items];
                                      list[idx] = { ...list[idx], image_url: selected?.url || '' };
                                      updateDetailField('services_prof_items', list);
                                    }}
                                    label="Seleccionar Imagen"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                                  Descripción / Explicación del Servicio:
                                </label>
                                <textarea
                                  rows={3}
                                  value={item.description || ''}
                                  onChange={(e) => {
                                    const list = [...form.details.services_prof_items];
                                    list[idx] = { ...list[idx], description: e.target.value };
                                    updateDetailField('services_prof_items', list);
                                  }}
                                  placeholder="Detalle técnico y beneficios..."
                                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border rounded-lg leading-relaxed"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 4. Asesoría Jurídica (Acordeón) */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden shadow-xs transition-all">
                    <div
                      className="p-4 flex items-center justify-between cursor-pointer select-none bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/70 transition-colors"
                      onClick={() => toggleServicesSectionCollapse('legal_advisory')}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600">
                          <Scale className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase flex items-center gap-2">
                            <span>Asesoría Jurídica (Acordeón Interactivo)</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                              {form.details?.services_legal_items?.length || 0} ítems
                            </span>
                          </h4>
                          <p className="text-[11px] text-slate-500 m-0">
                            Servicios notariales, escrituras, promesas de compraventa, cartas-permiso.
                          </p>
                        </div>
                      </div>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        {collapsedServicesSections.legal_advisory ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                      </div>
                    </div>

                    {!collapsedServicesSections.legal_advisory && (
                      <div className="p-4 space-y-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                              Título de la Sección:
                            </label>
                            <input
                              type="text"
                              value={form.details?.services_legal_title ?? ''}
                              onChange={(e) => updateDetailField('services_legal_title', e.target.value)}
                              placeholder="Ej: Asesoria Juridica"
                              className="w-full px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                              Subtítulo Superior (opcional):
                            </label>
                            <input
                              type="text"
                              value={form.details?.services_legal_subtitle ?? ''}
                              onChange={(e) => updateDetailField('services_legal_subtitle', e.target.value)}
                              placeholder="Ej: Asesoria (dejar vacío si no deseas subtítulo)"
                              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300">
                            Ítems del Acordeón Jurídico:
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const list = Array.isArray(form.details?.services_legal_items) ? [...form.details.services_legal_items] : [];
                              list.push({
                                id: Date.now(),
                                title: 'Nuevo Servicio Jurídico',
                                image_url: 'https://old.immobillis.com/old/wp-content/uploads/2022/11/enrollment.png.avif',
                                description: 'Descripción detallada de la gestión legal...',
                              });
                              updateDetailField('services_legal_items', list);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Agregar Ítem</span>
                          </button>
                        </div>

                        <div className="space-y-3">
                          {(form.details?.services_legal_items || []).map((item: any, idx: number) => (
                            <div
                              key={item.id || idx}
                              className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/40 space-y-3"
                            >
                              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
                                <span className="text-xs font-black uppercase text-amber-600">
                                  Ítem #{idx + 1}: {item.title || 'Sin título'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const list = form.details.services_legal_items.filter((_: any, i: number) => i !== idx);
                                    updateDetailField('services_legal_items', list);
                                  }}
                                  className="text-rose-500 hover:text-rose-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Eliminar</span>
                                </button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                                    Título:
                                  </label>
                                  <input
                                    type="text"
                                    value={item.title || ''}
                                    onChange={(e) => {
                                      const list = [...form.details.services_legal_items];
                                      list[idx] = { ...list[idx], title: e.target.value };
                                      updateDetailField('services_legal_items', list);
                                    }}
                                    placeholder="Ej: Servicios notariales"
                                    className="w-full px-3 py-1.5 text-xs font-bold bg-white dark:bg-slate-900 border rounded-lg"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                                    Imagen / Icono:
                                  </label>
                                  <MediaPicker
                                    value={item.image_url || ''}
                                    onChange={(selected) => {
                                      const list = [...form.details.services_legal_items];
                                      list[idx] = { ...list[idx], image_url: selected?.url || '' };
                                      updateDetailField('services_legal_items', list);
                                    }}
                                    label="Seleccionar Imagen"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                                  Descripción / Explicación del Trámite:
                                </label>
                                <textarea
                                  rows={3}
                                  value={item.description || ''}
                                  onChange={(e) => {
                                    const list = [...form.details.services_legal_items];
                                    list[idx] = { ...list[idx], description: e.target.value };
                                    updateDetailField('services_legal_items', list);
                                  }}
                                  placeholder="Detalle notarial o legal..."
                                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border rounded-lg leading-relaxed"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 5. Cabecera Hero y Banner CTA de Servicios */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden shadow-xs transition-all">
                    <div
                      className="p-4 flex items-center justify-between cursor-pointer select-none bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/70 transition-colors"
                      onClick={() => toggleServicesSectionCollapse('hero_cta')}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase flex items-center gap-2">
                            <span>Cabecera Hero y Banner CTA de Servicios</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                              Hero + Banner CTA
                            </span>
                          </h4>
                          <p className="text-[11px] text-slate-500 m-0">
                            Títulos y descripciones del encabezado superior y del banner de contacto inferior en <code>/services</code>.
                          </p>
                        </div>
                      </div>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        {collapsedServicesSections.hero_cta ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                      </div>
                    </div>

                    {!collapsedServicesSections.hero_cta && (
                      <div className="p-4 space-y-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/40 space-y-2">
                            <h5 className="text-xs font-bold uppercase text-slate-700 dark:text-slate-200 m-0">
                              Cabecera Hero (Principal)
                            </h5>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-500 mb-1">
                                Título Hero:
                              </label>
                              <input
                                type="text"
                                value={form.details?.services_hero_title ?? 'Nuestros Servicios Inmobiliarios'}
                                onChange={(e) => updateDetailField('services_hero_title', e.target.value)}
                                placeholder="Ej: Nuestros Servicios Inmobiliarios"
                                className="w-full px-3 py-1.5 text-xs font-bold bg-white dark:bg-slate-900 border rounded-lg"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-500 mb-1">
                                Subtítulo Hero (opcional):
                              </label>
                              <textarea
                                rows={2}
                                value={form.details?.services_hero_subtitle ?? ''}
                                onChange={(e) => updateDetailField('services_hero_subtitle', e.target.value)}
                                placeholder="Dejar vacío para usar el texto por defecto con el nombre de tu agencia"
                                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border rounded-lg"
                              />
                            </div>
                          </div>

                          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/40 space-y-2">
                            <h5 className="text-xs font-bold uppercase text-slate-700 dark:text-slate-200 m-0">
                              Banner CTA (Llamado a la Acción Inferior)
                            </h5>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-500 mb-1">
                                Título Banner CTA:
                              </label>
                              <input
                                type="text"
                                value={form.details?.services_cta_title ?? '¿Necesitas una solución inmobiliaria a la medida?'}
                                onChange={(e) => updateDetailField('services_cta_title', e.target.value)}
                                placeholder="Ej: ¿Necesitas una solución inmobiliaria a la medida?"
                                className="w-full px-3 py-1.5 text-xs font-bold bg-white dark:bg-slate-900 border rounded-lg"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-500 mb-1">
                                Subtítulo Banner CTA:
                              </label>
                              <input
                                type="text"
                                value={form.details?.services_cta_subtitle ?? 'Nuestro equipo de asesores legales, técnicos y comerciales está listo para orientarte.'}
                                onChange={(e) => updateDetailField('services_cta_subtitle', e.target.value)}
                                placeholder="Ej: Nuestro equipo de asesores legales..."
                                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border rounded-lg"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 6. Catálogo de Servicios Generales */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden shadow-xs transition-all">
                    <div
                      className="p-4 flex items-center justify-between cursor-pointer select-none bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/70 transition-colors"
                      onClick={() => toggleServicesSectionCollapse('services_catalog')}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/50 text-teal-600">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase flex items-center gap-2">
                            <span>Catálogo de Soluciones Adicionales (Tarjetas con WhatsApp)</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300">
                              {form.details?.services?.length || 0} servicios
                            </span>
                          </h4>
                          <p className="text-[11px] text-slate-500 m-0">
                            Tarjetas de servicios adicionales con foto, descripción y botón de contacto.
                          </p>
                        </div>
                      </div>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        {collapsedServicesSections.services_catalog ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                      </div>
                    </div>

                    {!collapsedServicesSections.services_catalog && (
                      <div className="p-4 space-y-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
                          <p className="text-xs text-slate-500 m-0">
                            Puedes agregar servicios personalizados adicionales que se mostrarán en formato de cuadrícula.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              const list = Array.isArray(form.details?.services) ? [...form.details.services] : [];
                              list.push({
                                id: Date.now(),
                                title: 'Nuevo Servicio Inmobiliario',
                                description: 'Descripción detallada de la solución o asesoría...',
                                image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
                                cta_text: 'Solicitar Asesoría',
                              });
                              updateDetailField('services', list);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Agregar Tarjeta de Servicio</span>
                          </button>
                        </div>

                        {(!form.details?.services || form.details.services.length === 0) ? (
                          <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-dashed text-center">
                            <p className="text-xs text-slate-500 m-0">
                              No hay servicios adicionales configurados. La página mostrará las asesorías principales de la agencia.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {form.details.services.map((service: any, idx: number) => (
                              <div
                                key={service.id || idx}
                                className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/40 space-y-3"
                              >
                                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
                                  <span className="text-xs font-black uppercase text-teal-600">
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
                                      className="w-full px-3 py-1.5 text-xs font-bold bg-white dark:bg-slate-900 border rounded-lg"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                      Texto del Botón CTA:
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
                                      className="w-full px-3 py-1.5 text-xs font-bold bg-white dark:bg-slate-900 border rounded-lg"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                    Descripción:
                                  </label>
                                  <textarea
                                    rows={2}
                                    value={service.description || ''}
                                    onChange={(e) => {
                                      const list = [...form.details.services];
                                      list[idx] = { ...list[idx], description: e.target.value };
                                      updateDetailField('services', list);
                                    }}
                                    placeholder="Detalle los beneficios del servicio..."
                                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border rounded-lg leading-relaxed"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
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
                  </div>

                  {/* 7. Secciones Personalizadas con HTML Puro (Servicios) */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden shadow-xs transition-all">
                    <div
                      className="p-4 flex items-center justify-between cursor-pointer select-none bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/70 transition-colors"
                      onClick={() => toggleServicesSectionCollapse('html_manager')}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600">
                          <Code className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase flex items-center gap-2">
                            <span>Secciones Personalizadas con HTML Puro (Servicios)</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                              {form.details?.services_html_sections?.length || 0} secciones activas
                            </span>
                          </h4>
                          <p className="text-[11px] text-slate-500 m-0">
                            Crea secciones HTML independientes que puedes ubicar en cualquier posición de la página de servicios.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                          {collapsedServicesSections.html_manager ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    {!collapsedServicesSections.html_manager && (
                      <div className="p-4 space-y-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between flex-wrap gap-2 pb-2">
                          <p className="text-xs text-slate-500 m-0">
                            Inserta código HTML, banners o iframes. Cada sección tiene su propio control en el Organizador.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              const list = Array.isArray(form.details?.services_html_sections)
                                ? [...form.details.services_html_sections]
                                : [];
                              const newId = Date.now();
                              list.push({
                                id: newId,
                                title: '',
                                subtitle: '',
                                container: 'boxed',
                                bg_color: '',
                                html: '<div class="text-center py-8">\n  <h3 class="text-xl font-bold">Título de la Sección</h3>\n  <p class="text-sm text-slate-600">Escribe aquí tu contenido HTML personalizado...</p>\n</div>',
                                enabled: true,
                              });
                              updateDetailField('services_html_sections', list);

                              const curOrder = Array.isArray(form.details?.services_sections_order)
                                ? [...form.details.services_sections_order]
                                : [];
                              const newKey = `html_${newId}`;
                              if (!curOrder.includes(newKey)) {
                                curOrder.push(newKey);
                                updateDetailField('services_sections_order', curOrder);
                              }
                            }}
                            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Nueva Sección HTML</span>
                          </button>
                        </div>

                        {(!form.details?.services_html_sections || form.details.services_html_sections.length === 0) ? (
                          <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
                            <Code className="w-8 h-8 text-slate-400 mx-auto" />
                            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 m-0">
                              No hay secciones HTML personalizadas en Servicios
                            </h4>
                            <p className="text-xs text-slate-500 m-0 max-w-md mx-auto">
                              Puedes crear secciones con banners publicitarios, calculadoras de inversión o cualquier contenido a medida.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {form.details.services_html_sections.map((sec: any, idx: number) => {
                              const isItemCollapsed = !!collapsedServicesHtmlItems[sec.id];
                              return (
                                <div
                                  key={sec.id || idx}
                                  className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/40 overflow-hidden shadow-2xs"
                                >
                                  {/* Encabezado colapsable individual */}
                                  <div
                                    className="p-3.5 flex items-center justify-between cursor-pointer select-none bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 hover:bg-slate-50/80 transition-colors"
                                    onClick={() => toggleServicesHtmlItemCollapse(sec.id)}
                                  >
                                    <div className="flex items-center gap-2.5">
                                      <div className="w-6 h-6 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 font-mono text-[10px] font-bold flex items-center justify-center">
                                        #{idx + 1}
                                      </div>
                                      <div>
                                        <h5 className="text-xs font-black text-slate-800 dark:text-white uppercase flex items-center gap-2 m-0">
                                          <span>{sec.title && sec.title.trim() !== '' ? sec.title : `Sección HTML #${idx + 1}`}</span>
                                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                            {sec.container === 'full' ? 'Ancho Completo' : 'Enmarcado'}
                                          </span>
                                        </h5>
                                        <p className="text-[10px] text-slate-400 font-mono m-0">
                                          ID de sección: html_{sec.id}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const list = form.details.services_html_sections.filter((_: any, i: number) => i !== idx);
                                          updateDetailField('services_html_sections', list);

                                          const targetKey = `html_${sec.id}`;
                                          if (Array.isArray(form.details?.services_sections_order)) {
                                            updateDetailField(
                                              'services_sections_order',
                                              form.details.services_sections_order.filter((k: string) => k !== targetKey && k !== String(sec.id))
                                            );
                                          }
                                          if (Array.isArray(form.details?.services_sections_hidden)) {
                                            updateDetailField(
                                              'services_sections_hidden',
                                              form.details.services_sections_hidden.filter((k: string) => k !== targetKey && k !== String(sec.id))
                                            );
                                          }
                                        }}
                                        className="text-rose-500 hover:text-rose-700 text-xs font-bold flex items-center gap-1 cursor-pointer mr-2 px-2 py-1 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>Eliminar</span>
                                      </button>
                                      <div className="w-6 h-6 rounded-md flex items-center justify-center text-slate-400">
                                        {isItemCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Cuerpo de la tarjeta HTML */}
                                  {!isItemCollapsed && (
                                    <div className="p-4 space-y-3">
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                                            Título de la Sección (Opcional):
                                          </label>
                                          <input
                                            type="text"
                                            value={sec.title || ''}
                                            onChange={(e) => {
                                              const list = [...form.details.services_html_sections];
                                              list[idx] = { ...list[idx], title: e.target.value };
                                              updateDetailField('services_html_sections', list);
                                            }}
                                            placeholder="Ej: ¿Cómo lo hacemos?"
                                            className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border rounded-lg font-bold"
                                          />
                                        </div>

                                        <div>
                                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                                            Subtítulo Superior (Opcional):
                                          </label>
                                          <input
                                            type="text"
                                            value={sec.subtitle || ''}
                                            onChange={(e) => {
                                              const list = [...form.details.services_html_sections];
                                              list[idx] = { ...list[idx], subtitle: e.target.value };
                                              updateDetailField('services_html_sections', list);
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
                                              const list = [...form.details.services_html_sections];
                                              list[idx] = { ...list[idx], container: e.target.value };
                                              updateDetailField('services_html_sections', list);
                                            }}
                                            className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border rounded-lg"
                                          >
                                            <option value="boxed">Enmarcado (max-w-7xl centrado con márgenes)</option>
                                            <option value="full">Ancho Completo (Full Width fluido)</option>
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
                                              const list = [...form.details.services_html_sections];
                                              list[idx] = { ...list[idx], bg_color: e.target.value };
                                              updateDetailField('services_html_sections', list);
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
                                            const list = [...form.details.services_html_sections];
                                            list[idx] = { ...list[idx], html: e.target.value };
                                            updateDetailField('services_html_sections', list);
                                          }}
                                          placeholder="<div>...</div>"
                                          className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none leading-relaxed"
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
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

                {/* Redes Sociales Oficiales del Portal (Visibles en el Footer) */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-emerald-600" /> Redes Sociales Oficiales (Visibles en el Footer)
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Configura los enlaces directos a las redes sociales de tu agencia para que los visitantes puedan seguirte desde el pie de página.
                    </p>
                  </div>

                  {/* Slogan o Descripción del Footer */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Descripción o Slogan para el Footer:
                    </label>
                    <textarea
                      rows={2}
                      value={form.details?.footer_about_text ?? ''}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          details: {
                            ...(form.details || {}),
                            footer_about_text: e.target.value,
                          },
                        })
                      }
                      placeholder="Ej: Tu portal inmobiliario de confianza para comprar, vender y alquilar propiedades exclusivas."
                      className="w-full px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Facebook */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1 flex items-center gap-1.5">
                        <Facebook className="w-3.5 h-3.5 text-[#1877F2]" /> Facebook URL:
                      </label>
                      <input
                        type="url"
                        value={form.facebook || form.details?.facebook || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setForm({
                            ...form,
                            facebook: val,
                            details: {
                              ...(form.details || {}),
                              facebook: val,
                            },
                          });
                        }}
                        placeholder="https://facebook.com/tu-agencia"
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
                      />
                    </div>

                    {/* Instagram */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1 flex items-center gap-1.5">
                        <Instagram className="w-3.5 h-3.5 text-[#E4405F]" /> Instagram URL:
                      </label>
                      <input
                        type="url"
                        value={form.instagram || form.details?.instagram || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setForm({
                            ...form,
                            instagram: val,
                            details: {
                              ...(form.details || {}),
                              instagram: val,
                            },
                          });
                        }}
                        placeholder="https://instagram.com/tu-agencia"
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
                      />
                    </div>

                    {/* TikTok */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1 flex items-center gap-1.5">
                        <span className="text-[#EE1D52] font-black text-xs leading-none">♪</span> TikTok URL:
                      </label>
                      <input
                        type="url"
                        value={form.tiktok || form.details?.tiktok || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setForm({
                            ...form,
                            tiktok: val,
                            details: {
                              ...(form.details || {}),
                              tiktok: val,
                            },
                          });
                        }}
                        placeholder="https://tiktok.com/@tu-agencia"
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
                      />
                    </div>

                    {/* YouTube */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1 flex items-center gap-1.5">
                        <Youtube className="w-3.5 h-3.5 text-[#FF0000]" /> YouTube Canal / URL:
                      </label>
                      <input
                        type="url"
                        value={form.details?.youtube || ''}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            details: {
                              ...(form.details || {}),
                              youtube: e.target.value,
                            },
                          })
                        }
                        placeholder="https://youtube.com/@tu-canal"
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
                      />
                    </div>

                    {/* WhatsApp */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#25D366]" /> WhatsApp (Enlace o Número):
                      </label>
                      <input
                        type="text"
                        value={form.whatsapp || form.details?.whatsapp || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setForm({
                            ...form,
                            whatsapp: val,
                            details: {
                              ...(form.details || {}),
                              whatsapp: val,
                            },
                          });
                        }}
                        placeholder="+593 99 999 9999 o enlace https://wa.me/..."
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
                      />
                    </div>

                    {/* LinkedIn */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1 flex items-center gap-1.5">
                        <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" /> LinkedIn Empresa / Perfil:
                      </label>
                      <input
                        type="url"
                        value={form.details?.linkedin || ''}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            details: {
                              ...(form.details || {}),
                              linkedin: e.target.value,
                            },
                          })
                        }
                        placeholder="https://linkedin.com/company/tu-agencia"
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
                      />
                    </div>

                    {/* X (Twitter) */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1 flex items-center gap-1.5">
                        <span className="font-bold text-xs leading-none">𝕏</span> X (Twitter) URL:
                      </label>
                      <input
                        type="url"
                        value={form.details?.x_twitter || form.details?.twitter || ''}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            details: {
                              ...(form.details || {}),
                              x_twitter: e.target.value,
                              twitter: e.target.value,
                            },
                          })
                        }
                        placeholder="https://x.com/tu-agencia"
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                  </div>
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

                  {/* Acceso directo a Redes Sociales */}
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                        <Share2 className="w-3.5 h-3.5" /> Redes Sociales del Portal (Footer)
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 m-0">
                        Configura Facebook, Instagram, TikTok, YouTube, WhatsApp, LinkedIn y X desde la pestaña &quot;Colores &amp; Logotipo&quot;.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('identity')}
                      className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shrink-0 shadow-xs cursor-pointer border-none"
                    >
                      Configurar Redes
                    </button>
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
