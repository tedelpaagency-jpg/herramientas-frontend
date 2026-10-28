import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Estate, User } from '../types';
import estateService from '../services/estateService';
import userService from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/adminService';
import { Agency } from '../types';
import { AgencySearchSelect } from '@/components/AgencySearchSelect';
import { SearchableSelect, SearchableSelectOption } from '@/components/SearchableSelect';
import { EstateReportsView } from '@/components/estates/EstateReportsView';
import { ESTATE_CATEGORIES_CATALOG, getEstateCategoryName, EstateCategory } from '@/utils/estateCategories';
import { 
  Building2, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  List,
  LayoutGrid,
  Copy,
  MoreVertical,
  MessageSquare,
  FileText,
  Layout,
  Download,
  MapPin,
  Maximize2,
  BarChart3,
  Layers,
  Tag,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { TableSkeleton } from '@/components/Skeleton';
import { EstateCanvasModal } from '@/components/EstateCanvasModal';
import { EstateCanvaGalleryModal } from '@/components/EstateCanvaGalleryModal';
import { EstateImageLightboxModal } from '@/components/EstateImageLightboxModal';
import { AdvisorSearchSelect } from '@/components/AdvisorSearchSelect';
import EstateApprovalSettingsPanel from '@/components/estates/EstateApprovalSettingsPanel';

const EstatesMapView = dynamic(() => import('@/components/EstatesMapView'), { ssr: false });

const getPageNumbers = (current: number, total: number): (number | string)[] => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | string)[] = [];
  pages.push(1);
  if (current > 3) {
    pages.push('...');
  }
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  if (current < total - 2) {
    pages.push('...');
  }
  pages.push(total);
  return pages;
};

export const EstatesPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewParam = searchParams ? searchParams.get('view') : null;

  const { user, dashboardType } = useAuth();
  const isWhiteLabelOrSuperAdmin = dashboardType === 'white_label_admin' || dashboardType === 'super_admin' || user?.role === 'white_label_admin' || user?.role === 'super_admin';

  const [estates, setEstates] = useState<Estate[]>([]);
  const [mapEstates, setMapEstates] = useState<Estate[]>([]);
  const [loadingMap, setLoadingMap] = useState<boolean>(false);
  const [agents, setAgents] = useState<User[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [categoriesList, setCategoriesList] = useState<EstateCategory[]>(ESTATE_CATEGORIES_CATALOG);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | number>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [agentFilter, setAgentFilter] = useState('');
  const [agencyFilter, setAgencyFilter] = useState<string>('');
  const [viewMode, setViewMode] = useState<'table' | 'grid' | 'map' | 'reports'>(
    viewParam === 'map' ? 'map' : viewParam === 'reports' ? 'reports' : 'table'
  );

  useEffect(() => {
    if (viewParam === 'map' || viewParam === 'reports' || viewParam === 'table' || viewParam === 'grid') {
      setViewMode(viewParam);
    }
  }, [viewParam]);
  
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    per_page: 12,
    last_page: 1
  });

  // Action Menu & Modal States
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [canvasModalOpen, setCanvasModalOpen] = useState(false);
  const [canvasData, setCanvasData] = useState<any | null>(null);
  const [activeEstateForPdf, setActiveEstateForPdf] = useState<Estate | null>(null);
  const [canvaGalleryModalOpen, setCanvaGalleryModalOpen] = useState(false);
  const [selectedEstateForCanva, setSelectedEstateForCanva] = useState<Estate | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxEstate, setLightboxEstate] = useState<Estate | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const handleExpandImage = (estate: Estate, initialIndex: number = 0) => {
    setActiveMenuId(null);
    setLightboxEstate(estate);
    setLightboxIndex(initialIndex);
    setLightboxOpen(true);
  };

  const handleViewCanvaGallery = (estate: Estate) => {
    setActiveMenuId(null);
    setSelectedEstateForCanva(estate);
    setCanvaGalleryModalOpen(true);
  };

  const fetchAgents = async (currentAgencyId?: string) => {
    try {
      const selectedAgId = currentAgencyId !== undefined ? currentAgencyId : agencyFilter;
      const res = await userService.getUsers({ 
        all: true,
        agency_id: selectedAgId ? Number(selectedAgId) : undefined,
        role: 'agent'
      });
      const userList = Array.isArray(res) ? res : (res.data?.data || res.data || []);
      setAgents(userList);
    } catch (err) {
      console.error('Error fetching agents:', err);
    }
  };

  const fetchAgencies = async () => {
    if (!isWhiteLabelOrSuperAdmin) return;
    try {
      const ags = await adminService.getAgencies();
      setAgencies(ags);
    } catch (err) {
      console.error('Error fetching agencies:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const cats = await estateService.getCategoriesCatalog({
        agency_id: agencyFilter ? Number(agencyFilter) : undefined,
      });
      if (Array.isArray(cats) && cats.length > 0) {
        setCategoriesList(cats);
      }
    } catch (err) {
      console.error('Error fetching categories catalog:', err);
    }
  };

  const fetchEstates = async () => {
    setIsLoading(true);
    try {
      const isOperationFilter = ['sale', 'rent', 'auction'].includes(statusFilter);
      const res = await estateService.getEstates({
        page,
        per_page: perPage,
        search: search || undefined,
        property_type: typeFilter ? Number(typeFilter) : undefined,
        type: typeFilter ? String(typeFilter) : undefined,
        status: isOperationFilter ? undefined : (statusFilter || undefined),
        property_status: statusFilter === 'rent' ? 1 : statusFilter === 'sale' ? 2 : statusFilter === 'auction' ? 3 : undefined,
        agent_id: agentFilter ? Number(agentFilter) : undefined,
        agency_id: agencyFilter ? Number(agencyFilter) : undefined,
      });
      setEstates(res.data);
      if (res.pagination) {
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error('Error fetching estates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMapEstates = async () => {
    setLoadingMap(true);
    try {
      const isOperationFilter = ['sale', 'rent', 'auction'].includes(statusFilter);
      const data = await estateService.getEstatesMap({
        search: search || undefined,
        property_type: typeFilter ? Number(typeFilter) : undefined,
        type: typeFilter ? String(typeFilter) : undefined,
        status: isOperationFilter ? undefined : (statusFilter || undefined),
        property_status: statusFilter === 'rent' ? 1 : statusFilter === 'sale' ? 2 : statusFilter === 'auction' ? 3 : undefined,
        agent_id: agentFilter ? Number(agentFilter) : undefined,
        agency_id: agencyFilter ? Number(agencyFilter) : undefined,
      });
      setMapEstates(data);
    } catch (err) {
      console.error('Error fetching map estates:', err);
    } finally {
      setLoadingMap(false);
    }
  };

  useEffect(() => {
    fetchAgencies();
  }, []);

  useEffect(() => {
    setAgentFilter('');
    fetchAgents(agencyFilter);
    fetchCategories();
  }, [agencyFilter]);

  useEffect(() => {
    if (viewMode !== 'reports') {
      fetchEstates();
    }
  }, [page, perPage, search, typeFilter, statusFilter, agentFilter, agencyFilter, viewMode]);

  useEffect(() => {
    if (viewMode === 'map') {
      fetchMapEstates();
    }
  }, [viewMode, search, typeFilter, statusFilter, agentFilter, agencyFilter]);

  const handleOpenCreateModal = () => router.push('/estates/new');
  const handleOpenEditModal = (estate: Estate) => router.push(`/estates/${estate.id}/edit`);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Desea eliminar este inmueble?')) return;
    try {
      const res: any = await estateService.deleteEstate(id);
      if (res && res.deletion_requested) {
        toast.success('Solicitud de baja registrada. Un administrador debe aprobar la eliminación.');
        fetchEstates();
      } else {
        setEstates(estates.filter(e => e.id !== id));
        toast.success('Inmueble eliminado con éxito');
      }
    } catch (err: any) {
      console.error('Error deleting estate:', err);
      toast.error(err?.response?.data?.message || 'Error al eliminar el inmueble');
    }
  };

  const handleApprovePublish = async (id: number) => {
    try {
      await estateService.verifyEstate(id, true);
      setEstates(estates.map(e => e.id === id ? { ...e, verify: 1 } : e));
      toast.success('¡Propiedad verificada y aprobada para publicación web!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al aprobar propiedad');
    }
  };

  const handleApproveDeletion = async (id: number) => {
    if (!confirm('¿Confirma que desea aprobar la eliminación definitiva de este inmueble?')) return;
    try {
      await estateService.approveDeletion(id);
      setEstates(estates.filter(e => e.id !== id));
      toast.success('Eliminación aprobada y ejecutada.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al aprobar eliminación');
    }
  };

  const handleRejectDeletion = async (id: number) => {
    try {
      await estateService.rejectDeletion(id);
      setEstates(estates.map(e => e.id === id ? { ...e, deletion_requested: false, deletion_request_notes: undefined } : e));
      toast.success('Solicitud rechazada. El inmueble se mantiene activo.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al rechazar solicitud');
    }
  };

  const handleCopyLink = (estate: Estate) => {
    const slug = (estate as any).slug || estate.id;
    const publicUrl = `${window.location.origin}/estate/${slug}`;
    navigator.clipboard.writeText(publicUrl);
    toast.success('¡Enlace copiado al portapapeles!');
  };

  // WhatsApp Action Handler
  const handleCopyWhatsApp = async (estate: Estate) => {
    setActiveMenuId(null);
    const toastId = toast.loading('Obteniendo plantilla WhatsApp...');
    try {
      const res = await estateService.getWhatsAppInfo(estate.id);
      const textToCopy = res.formatted_text || res.whatsapp_text || res.copy_text;
      
      if (textToCopy) {
        await navigator.clipboard.writeText(textToCopy);
        toast.success('¡Información copiada al portapapeles para WhatsApp!', { id: toastId });
      } else {
        toast.error('No se pudo generar el texto de WhatsApp', { id: toastId });
      }
    } catch (err) {
      console.error('Error fetching WhatsApp info:', err);
      toast.error('Error al consultar información para WhatsApp', { id: toastId });
    }
  };

  // PDF Download Action Handler
  const handleDownloadPdf = async (estate: Estate) => {
    setActiveMenuId(null);
    const toastId = toast.loading('Generando PDF del inmueble...');
    try {
      await estateService.downloadPdf(estate.id, estate.slug);
      toast.success('¡PDF descargado exitosamente!', { id: toastId });
    } catch (err) {
      console.error('Error downloading PDF:', err);
      toast.error('Error al descargar el PDF de la propiedad', { id: toastId });
    }
  };

  // Canvas View Action Handler
  const handleViewCanvas = async (estate: Estate) => {
    setActiveMenuId(null);
    setActiveEstateForPdf(estate);
    const toastId = toast.loading('Cargando Canvas del inmueble...');
    try {
      const data = await estateService.getCanvasInfo(estate.id);
      setCanvasData(data);
      setCanvasModalOpen(true);
      toast.dismiss(toastId);
    } catch (err) {
      console.error('Error loading Canvas info:', err);
      toast.error('Error al cargar el Canvas de la propiedad', { id: toastId });
    }
  };

  const getEstateImageUrl = (estate: Estate): string | null => {
    if (estate.images && estate.images.length > 0) {
      const img = estate.images[0];
      return typeof img === 'string' ? img : (img as any).image_path;
    }
    if ((estate as any).image) {
      return (estate as any).image;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-7 h-7 text-blue-600" />
            Directorio Inmobiliario SANTUN
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Gestión de propiedades con exportación para WhatsApp, Canvas y PDF.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
            title="Políticas de Aprobación & Automatizaciones de Propiedades"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Aprobaciones &amp; Alertas</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Inmueble</span>
          </button>
        </div>
      </div>

      {/* Banner de Solicitudes Pendientes para Administradores */}
      {estates.some((e) => e.verify === 0 || e.deletion_requested) && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-amber-900 dark:text-amber-200">
                Atención Administrativa Requerida en Propiedades
              </h4>
              <p className="text-[11px] text-amber-700 dark:text-amber-300">
                Hay {estates.filter((e) => e.verify === 0).length} propiedades pendientes de aprobación y{' '}
                {estates.filter((e) => e.deletion_requested).length} solicitudes de eliminación.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold shrink-0 transition-all cursor-pointer"
          >
            Configurar Políticas
          </button>
        </div>
      )}

      {/* Filter & View Switcher Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center flex-grow">
          {/* Búsqueda General */}
          <div className="flex-grow max-w-xs relative min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Buscar por título, ID o ubicación..."
              className="w-full pl-10 pr-4 py-2 bg-[#F4F5F7] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
            />
          </div>

          {/* Selector con Búsqueda de Categorías (Todas las 22 de la DB) */}
          <div className="w-full sm:w-60 min-w-[210px]">
            <SearchableSelect
              options={categoriesList.map(cat => ({
                value: cat.id,
                label: cat.name,
                badge: cat.count !== undefined && cat.count !== null ? `${cat.count}` : undefined,
                icon: <Layers className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              }))}
              value={typeFilter}
              onChange={(val) => {
                setTypeFilter(val || '');
                setPage(1);
              }}
              placeholder="Todas las Categorías"
              searchPlaceholder="Buscar categoría o tipo..."
              allowClear={true}
              allOption={{
                value: '',
                label: `Todas las Categorías (${categoriesList.length})`,
                icon: <Layers className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              }}
              size="sm"
            />
          </div>

          {/* Selector con Búsqueda de Estado / Operación */}
          <div className="w-full sm:w-56 min-w-[200px]">
            <SearchableSelect
              options={[
                { value: '1', label: 'Disponible', badge: 'Estado' },
                { value: '2', label: 'Reservado', badge: 'Estado' },
                { value: '3', label: 'Vendido', badge: 'Estado' },
                { value: '4', label: 'Alquilado', badge: 'Estado' },
                { value: 'sale', label: 'En Venta', badge: 'Operación' },
                { value: 'rent', label: 'En Alquiler', badge: 'Operación' },
                { value: 'auction', label: 'En Remate / Anticresis', badge: 'Operación' },
              ]}
              value={statusFilter}
              onChange={(val) => {
                setStatusFilter(val || '');
                setPage(1);
              }}
              placeholder="Todos los estados"
              searchPlaceholder="Buscar estado u operación..."
              allowClear={true}
              allOption={{
                value: '',
                label: 'Todos los estados',
                icon: <Tag className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              }}
              size="sm"
            />
          </div>

          {/* Asesor Filter */}
          <div className="w-full sm:w-56 min-w-[200px]">
            <AdvisorSearchSelect
              users={agents}
              selectedUserId={agentFilter}
              onChange={(userId) => {
                setAgentFilter(userId);
                setPage(1);
              }}
              placeholder="Todos los Asesores"
              className="w-full"
            />
          </div>

          {/* Filtro por Agencia (Solo para Marca Blanca / Super Admin) */}
          {isWhiteLabelOrSuperAdmin && agencies.length > 0 && (
            <div className="w-full sm:w-56 min-w-[200px]">
              <AgencySearchSelect
                agencies={agencies}
                value={agencyFilter}
                onChange={(agId) => {
                  setAgencyFilter(String(agId || ''));
                  setPage(1);
                }}
                allowAll={true}
                allLabel="🏢 Todas las Agencias"
                placeholder="Filtrar por Agencia"
                size="sm"
              />
            </div>
          )}
        </div>

        {/* View Mode Toggle Buttons (4 modos: Tabla, Cuadrícula, Mapa, Reportes) */}
        <div className="flex items-center gap-1 bg-[#F4F5F7] dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
              viewMode === 'table' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            title="Vista Lista Tabla"
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">Lista</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
              viewMode === 'grid' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            title="Vista Cuadrícula Tarjetas"
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Tarjetas</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`p-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
              viewMode === 'map' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            title="Vista Mapa Interactivo"
          >
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">Mapa</span>
          </button>
          <button
            onClick={() => setViewMode('reports')}
            className={`p-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
              viewMode === 'reports' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            title="Vista Reportes y Contadores"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Reportes</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'reports' ? (
        <EstateReportsView 
          agencies={agencies}
          agents={agents}
          isWhiteLabelOrSuperAdmin={isWhiteLabelOrSuperAdmin}
          selectedAgencyId={agencyFilter}
          onAgencyChange={(agId) => {
            setAgencyFilter(String(agId || ''));
            setPage(1);
          }}
        />
      ) : viewMode === 'map' ? (
        <EstatesMapView 
          estates={mapEstates.length > 0 ? mapEstates : estates} 
          loading={loadingMap} 
          onSelectCanvaGallery={handleViewCanvaGallery}
          onExpandImage={handleExpandImage}
        />
      ) : isLoading ? (
        <TableSkeleton rows={5} />
      ) : estates.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">No se encontraron propiedades</h3>
          <p className="text-xs text-slate-500 mt-1">Ajuste sus filtros o registre un nuevo inmueble.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {viewMode === 'table' ? (
            /* Table View Mode */
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300 border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                      <th className="py-3.5 px-4 w-16 text-center">ID</th>
                      <th className="py-3.5 px-4">Título</th>
                      <th className="py-3.5 px-4">Asesor</th>
                      <th className="py-3.5 px-4">Dirección</th>
                      <th className="py-3.5 px-4">Precio</th>
                      <th className="py-3.5 px-4">Publicada</th>
                      <th className="py-3.5 px-4 text-center">Estado</th>
                      <th className="py-3.5 px-4 text-center min-w-[200px]">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {estates.map((estate) => {
                      const imgUrl = getEstateImageUrl(estate);
                      const isMenuOpen = activeMenuId === estate.id;

                      return (
                        <tr key={estate.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                          {/* ID */}
                          <td className="py-3.5 px-4 font-mono text-xs text-slate-500 font-bold text-center">
                            #{estate.id}
                          </td>

                          {/* Título + Imagen Thumbnail */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div 
                                onClick={() => imgUrl && handleExpandImage(estate, 0)}
                                className={`w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-shrink-0 overflow-hidden relative transition-all ${
                                  imgUrl ? 'cursor-pointer group/thumb hover:ring-2 hover:ring-blue-500 hover:shadow-md' : ''
                                }`}
                                title={imgUrl ? "Click para expandir imagen" : ""}
                              >
                                {imgUrl ? (
                                  <>
                                    <img
                                      src={imgUrl}
                                      alt={estate.title}
                                      className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center text-white">
                                      <Maximize2 className="w-4 h-4 drop-shadow" />
                                    </div>
                                  </>
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                                    <ImageIcon className="w-5 h-5" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                                  {estate.title}
                                </h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-300 px-2 py-0.5 rounded uppercase">
                                    {getEstateCategoryName((estate as any).property_type || estate.type)}
                                  </span>
                                  <span className="text-xs text-slate-400">
                                    {estate.bedrooms ? `${estate.bedrooms} dorm.` : ''} {estate.area_sqm || estate.size ? `• ${estate.area_sqm || estate.size} m²` : ''}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Asesor / Agente Comercial */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center flex-shrink-0 overflow-hidden border border-blue-200 shadow-2xs">
                                {estate.user?.avatarUrl ? (
                                  <img src={estate.user.avatarUrl} alt={estate.user.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span>{estate.user?.name ? estate.user.name.charAt(0).toUpperCase() : 'A'}</span>
                                )}
                              </div>
                              <span className="text-xs font-semibold text-slate-800 truncate max-w-[130px]" title={estate.user?.name || 'Asesor Inmobiliario'}>
                                {estate.user?.name || 'Asesor Inmobiliario'}
                              </span>
                            </div>
                          </td>

                          {/* Dirección / Ubicación */}
                          <td className="py-3.5 px-4 text-xs text-slate-600 max-w-xs truncate">
                            {estate.full_address || estate.address || `${estate.city || estate.province || 'Ecuador'}`}
                          </td>

                          {/* Precio */}
                          <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">
                            ${Number(estate.price).toLocaleString()}
                            <span className="text-[10px] text-slate-400 ml-1 font-normal">{estate.currency || 'USD'}</span>
                          </td>

                          {/* Fecha */}
                          <td className="py-3.5 px-4 text-xs text-slate-500 font-mono">
                            {estate.created_at ? new Date(estate.created_at).toLocaleDateString() : '-'}
                          </td>

                          {/* Estado Badge & Flujos de Aprobación */}
                          <td className="py-3.5 px-4 text-center">
                            {estate.deletion_requested ? (
                              <div className="space-y-1">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-700 border border-rose-300 animate-pulse">
                                  Baja Solicitada
                                </span>
                                <div className="flex items-center justify-center gap-1 pt-0.5">
                                  <button
                                    onClick={() => handleApproveDeletion(estate.id)}
                                    className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-600 text-white hover:bg-rose-700 cursor-pointer shadow-2xs"
                                    title="Aprobar y ejecutar eliminación definitiva"
                                  >
                                    Aprobar
                                  </button>
                                  <button
                                    onClick={() => handleRejectDeletion(estate.id)}
                                    className="px-2 py-0.5 rounded text-[10px] font-black bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 cursor-pointer shadow-2xs"
                                    title="Rechazar solicitud de baja"
                                  >
                                    Rechazar
                                  </button>
                                </div>
                              </div>
                            ) : estate.verify === 0 ? (
                              <div className="space-y-1">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300">
                                  Pendiente Admin
                                </span>
                                <div className="pt-0.5">
                                  <button
                                    onClick={() => handleApprovePublish(estate.id)}
                                    className="px-2.5 py-0.5 rounded text-[10px] font-black bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer shadow-2xs"
                                    title="Aprobar para publicar en la web"
                                  >
                                    Aprobar
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                  (estate.status as any) == 1 || estate.status === 'available'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : (estate.status as any) == 2 || estate.status === 'sold'
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}
                              >
                                {(estate.status as any) == 1 || estate.status === 'available'
                                  ? 'Disponible'
                                  : (estate.status as any) == 2
                                  ? 'Vendido'
                                  : 'Alquilado'}
                              </span>
                            )}
                          </td>

                          {/* Acciones Prominentes Directas + Menú (⋮) */}
                          <td className="py-3.5 px-4 text-center relative">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* WhatsApp Direct Icon */}
                              <button
                                onClick={() => handleCopyWhatsApp(estate)}
                                className="p-2 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 transition-all active:scale-95 shadow-2xs"
                                title="Copiar información para WhatsApp"
                              >
                                <MessageSquare className="w-4 h-4" />
                              </button>

                              {/* PDF Direct Icon */}
                              <button
                                onClick={() => handleDownloadPdf(estate)}
                                className="p-2 rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 transition-all active:scale-95 shadow-2xs"
                                title="Descargar PDF de la propiedad"
                              >
                                <FileText className="w-4 h-4" />
                              </button>

                              {/* Canvas Direct Icon */}
                              <button
                                onClick={() => handleViewCanvas(estate)}
                                className="p-2 rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 transition-all active:scale-95 shadow-2xs"
                                title="Ver Canvas de la propiedad"
                              >
                                <Layout className="w-4 h-4" />
                              </button>

                              {/* Canva 3D Gallery Icon */}
                              <button
                                onClick={() => handleViewCanvaGallery(estate)}
                                className="p-2 rounded-lg text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 transition-all active:scale-95 shadow-2xs"
                                title="Ver Galería Canva 3D"
                              >
                                <ImageIcon className="w-4 h-4" />
                              </button>

                              {/* Direct Edit Button */}
                              <button
                                onClick={() => handleOpenEditModal(estate)}
                                className="p-2 rounded-lg text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 transition-all active:scale-95 shadow-2xs"
                                title="Editar Inmueble"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              {/* Options Dropdown Menu Button (⋮) */}
                              <div className="relative">
                                <button
                                  onClick={() => setActiveMenuId(isMenuOpen ? null : estate.id)}
                                  className={`p-2 rounded-lg border transition-all active:scale-95 shadow-2xs ${
                                    isMenuOpen ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                                  }`}
                                  title="Más opciones (⋮)"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>

                                {/* Dropdown Menu (⋮) */}
                                {isMenuOpen && (
                                  <>
                                    <div
                                      className="fixed inset-0 z-30"
                                      onClick={() => setActiveMenuId(null)}
                                    />
                                    <div className="absolute right-0 top-full mt-1.5 w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden py-1 text-left animate-slide-up-fade">
                                      <button
                                        onClick={() => handleCopyWhatsApp(estate)}
                                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition-colors"
                                      >
                                        <MessageSquare className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                        <span>Copiar información para WhatsApp</span>
                                      </button>

                                      <button
                                        onClick={() => handleDownloadPdf(estate)}
                                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-50 transition-colors"
                                      >
                                        <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                        <span>Descargar PDF</span>
                                      </button>

                                      <button
                                        onClick={() => handleViewCanvas(estate)}
                                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-indigo-700 hover:bg-indigo-50 transition-colors"
                                      >
                                        <Layout className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                                        <span>Ver Canvas</span>
                                      </button>

                                      <button
                                        onClick={() => handleViewCanvaGallery(estate)}
                                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-purple-700 hover:bg-purple-50 transition-colors"
                                      >
                                        <ImageIcon className="w-4 h-4 text-purple-600 flex-shrink-0" />
                                        <span>Ver Galería Canva 3D</span>
                                      </button>

                                      <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>

                                      <button
                                        onClick={() => handleCopyLink(estate)}
                                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                      >
                                        <Copy className="w-4 h-4 text-slate-500 flex-shrink-0" />
                                        <span>Copiar Enlace Público</span>
                                      </button>

                                      <button
                                        onClick={() => {
                                          setActiveMenuId(null);
                                          handleOpenEditModal(estate);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                      >
                                        <Edit3 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                                        <span>Editar Inmueble</span>
                                      </button>

                                      <button
                                        onClick={() => {
                                          setActiveMenuId(null);
                                          handleDelete(estate.id);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                                      >
                                        <Trash2 className="w-4 h-4 flex-shrink-0" />
                                        <span>Eliminar Inmueble</span>
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Grid View Mode */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {estates.map((estate) => {
                const imgUrl = getEstateImageUrl(estate);
                const isMenuOpen = activeMenuId === estate.id;

                return (
                  <div
                    key={estate.id}
                    className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group relative"
                  >
                    <div>
                      <div 
                        onClick={() => imgUrl && handleExpandImage(estate, 0)}
                        className={`h-48 bg-slate-100 dark:bg-slate-800 relative flex items-center justify-center overflow-hidden ${
                          imgUrl ? 'cursor-pointer group/cardimg' : ''
                        }`}
                        title={imgUrl ? "Click para expandir imagen" : ""}
                      >
                        {imgUrl ? (
                          <>
                            <img
                              src={imgUrl}
                              alt={estate.title}
                              className="w-full h-full object-cover group-hover/cardimg:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-slate-950/25 opacity-0 group-hover/cardimg:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                              <span className="bg-slate-900/85 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl border border-white/20">
                                <Maximize2 className="w-3.5 h-3.5" />
                                <span>Expandir imagen</span>
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center text-slate-400">
                            <ImageIcon className="w-10 h-10 mb-1" />
                            <span className="text-xs">Sin imagen</span>
                          </div>
                        )}

                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-900/80 text-white backdrop-blur-md">
                            {getEstateCategoryName((estate as any).property_type || estate.type)}
                          </span>
                        </div>

                        {/* Top-Right Menu Button (⋮) in Grid View */}
                        <div className="absolute top-3 right-3">
                          <button
                            onClick={() => setActiveMenuId(isMenuOpen ? null : estate.id)}
                            className="w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md shadow-md transition-all active:scale-95"
                            title="Opciones (⋮)"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {isMenuOpen && (
                            <>
                              <div className="fixed inset-0 z-30" onClick={() => setActiveMenuId(null)} />
                              <div className="absolute right-0 top-full mt-1.5 w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden py-1 text-left text-xs animate-slide-up-fade">
                                <button
                                  onClick={() => handleCopyWhatsApp(estate)}
                                  className="w-full flex items-center gap-2.5 px-4 py-2.5 font-bold text-emerald-700 hover:bg-emerald-50 transition-colors"
                                >
                                  <MessageSquare className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                  <span>Copiar información para WhatsApp</span>
                                </button>

                                <button
                                  onClick={() => handleDownloadPdf(estate)}
                                  className="w-full flex items-center gap-2.5 px-4 py-2.5 font-bold text-blue-700 hover:bg-blue-50 transition-colors"
                                >
                                  <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                  <span>Descargar PDF</span>
                                </button>

                                <button
                                  onClick={() => handleViewCanvas(estate)}
                                  className="w-full flex items-center gap-2.5 px-4 py-2.5 font-bold text-indigo-700 hover:bg-indigo-50 transition-colors"
                                >
                                  <Layout className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                                  <span>Ver Canvas</span>
                                </button>

                                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>

                                <button
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    handleOpenEditModal(estate);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-4 py-2.5 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                  <Edit3 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                                  <span>Editar Inmueble</span>
                                </button>

                                <button
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    handleDelete(estate.id);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-4 py-2.5 font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4 flex-shrink-0" />
                                  <span>Eliminar Inmueble</span>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-blue-600">{estate.city || estate.province || 'Ecuador'}</span>
                          <span className="text-lg font-extrabold text-slate-900">${Number(estate.price).toLocaleString()}</span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 mt-1 line-clamp-1">{estate.title}</h3>

                        {/* Asesor / Agente Comercial Info */}
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center flex-shrink-0 overflow-hidden border border-blue-200 shadow-2xs">
                            {estate.user?.avatarUrl ? (
                              <img src={estate.user.avatarUrl} alt={estate.user.name} className="w-full h-full object-cover" />
                            ) : (
                              <span>{estate.user?.name ? estate.user.name.charAt(0).toUpperCase() : 'A'}</span>
                            )}
                          </div>
                          <span className="text-xs font-medium text-slate-600 truncate" title={estate.user?.name || 'Asesor Inmobiliario'}>
                            {estate.user?.name || 'Asesor Inmobiliario'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Direct Quick Action Icons */}
                    <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-mono">ID: #{estate.id}</span>
                      
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCopyWhatsApp(estate)}
                          className="p-1.5 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 transition-colors"
                          title="Copiar información para WhatsApp"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDownloadPdf(estate)}
                          className="p-1.5 rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 transition-colors"
                          title="Descargar PDF"
                        >
                          <FileText className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleViewCanvas(estate)}
                          className="p-1.5 rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 transition-colors"
                          title="Ver Canvas"
                        >
                          <Layout className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleViewCanvaGallery(estate)}
                          className="p-1.5 rounded-lg text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 transition-colors"
                          title="Ver Galería Canva 3D"
                        >
                          <ImageIcon className="w-4 h-4" />
                        </button>

                        <button 
                          onClick={() => handleOpenEditModal(estate)} 
                          className="p-1.5 rounded-lg text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 transition-colors"
                          title="Editar"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button 
                          onClick={() => handleDelete(estate.id)} 
                          className="p-1.5 rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.total > 0 && (
            <div className="bg-white dark:bg-slate-900 px-6 py-4 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400 shadow-xs">
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  Mostrando <strong className="text-slate-900 dark:text-white">{(pagination.current_page - 1) * pagination.per_page + 1} - {Math.min(pagination.current_page * pagination.per_page, pagination.total)}</strong> de <strong className="text-slate-900 dark:text-white">{pagination.total}</strong> propiedades
                </div>
                <div className="flex items-center gap-1.5">
                  <span>Mostrar:</span>
                  <select
                    value={perPage}
                    onChange={(e) => {
                      setPerPage(Number(e.target.value));
                      setPage(1);
                    }}
                    className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value={10}>10</option>
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                    <option value={48}>48</option>
                  </select>
                  <span>por pág.</span>
                </div>
              </div>

              {pagination.last_page > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage(p => Math.max(p - 1, 1))}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Anterior</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {getPageNumbers(pagination.current_page, pagination.last_page).map((p, idx) => (
                      p === '...' ? (
                        <span key={`dots-${idx}`} className="px-2 py-1 text-slate-400">...</span>
                      ) : (
                        <button
                          key={`page-${p}`}
                          onClick={() => setPage(Number(p))}
                          className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-bold transition-colors ${
                            pagination.current_page === p
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                          }`}
                        >
                          {p}
                        </button>
                      )
                    ))}
                  </div>

                  <button
                    disabled={page >= pagination.last_page}
                    onClick={() => setPage(p => Math.min(p + 1, pagination.last_page))}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
                  >
                    <span className="hidden sm:inline">Siguiente</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Canvas Flyer Modal */}
      <EstateCanvasModal
        isOpen={canvasModalOpen}
        onClose={() => setCanvasModalOpen(false)}
        canvasData={canvasData}
        onCopyWhatsApp={() => activeEstateForPdf && handleCopyWhatsApp(activeEstateForPdf)}
        onDownloadPdf={() => activeEstateForPdf && handleDownloadPdf(activeEstateForPdf)}
      />

      {/* Canva 3D Gallery Modal */}
      <EstateCanvaGalleryModal
        isOpen={canvaGalleryModalOpen}
        onClose={() => setCanvaGalleryModalOpen(false)}
        estate={selectedEstateForCanva}
        onCopyWhatsApp={() => selectedEstateForCanva && handleCopyWhatsApp(selectedEstateForCanva)}
        onDownloadPdf={() => selectedEstateForCanva && handleDownloadPdf(selectedEstateForCanva)}
      />

      {/* Image Lightbox Modal */}
      <EstateImageLightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        estate={lightboxEstate}
        initialImageIndex={lightboxIndex}
      />

      {/* Modal de Configuración de Aprobaciones y Automatizaciones */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-3xl w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto custom-scrollbar animate-slide-up-fade">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  Políticas de Aprobación &amp; Automatizaciones Inmobiliarias
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <EstateApprovalSettingsPanel
              agencyId={agencyFilter ? Number(agencyFilter) : (user?.agency_id || undefined)}
              onSaved={() => {
                fetchEstates();
              }}
              isModal={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EstatesPage;
