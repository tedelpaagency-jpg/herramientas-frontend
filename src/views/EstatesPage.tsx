'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Estate, User } from '../types';
import estateService from '../services/estateService';
import userService from '../services/userService';
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
  Download
} from 'lucide-react';
import toast from 'react-hot-toast';
import { TableSkeleton } from '@/components/Skeleton';
import { EstateCanvasModal } from '@/components/EstateCanvasModal';

export const EstatesPage: React.FC = () => {
  const router = useRouter();
  const [estates, setEstates] = useState<Estate[]>([]);
  const [agents, setAgents] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [agentFilter, setAgentFilter] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    per_page: 10,
    last_page: 1
  });

  // Action Menu & Modal States
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [canvasModalOpen, setCanvasModalOpen] = useState(false);
  const [canvasData, setCanvasData] = useState<any | null>(null);
  const [activeEstateForPdf, setActiveEstateForPdf] = useState<Estate | null>(null);

  const fetchAgents = async () => {
    try {
      const res = await userService.getUsers();
      const userList = Array.isArray(res) ? res : (res.data?.data || res.data || []);
      setAgents(userList);
    } catch (err) {
      console.error('Error fetching agents:', err);
    }
  };

  const fetchEstates = async () => {
    setIsLoading(true);
    try {
      const res = await estateService.getEstates({
        page,
        search: search || undefined,
        type: typeFilter || undefined,
        status: statusFilter || undefined,
        agent_id: agentFilter ? Number(agentFilter) : undefined,
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

  useEffect(() => {
    fetchAgents();
  }, []);

  useEffect(() => {
    fetchEstates();
  }, [page, search, typeFilter, statusFilter, agentFilter]);

  const handleOpenCreateModal = () => router.push('/estates/new');
  const handleOpenEditModal = (estate: Estate) => router.push(`/estates/${estate.id}/edit`);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Desea eliminar este inmueble?')) return;
    try {
      await estateService.deleteEstate(id);
      setEstates(estates.filter(e => e.id !== id));
      toast.success('Inmueble eliminado con éxito');
    } catch (err) {
      console.error('Error deleting estate:', err);
      toast.error('Error al eliminar el inmueble');
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
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-7 h-7 text-blue-600" />
            Directorio Inmobiliario SANTUN
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Gestión de propiedades con exportación para WhatsApp, Canvas y PDF.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Inmueble</span>
        </button>
      </div>

      {/* Filter & View Switcher Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/80 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center flex-grow">
          <div className="flex-grow max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Buscar por título, ID o ubicación..."
              className="w-full pl-10 pr-4 py-2 bg-[#F4F5F7] border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="bg-[#F4F5F7] border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20"
          >
            <option value="">Todos los tipos</option>
            <option value="house">Casa</option>
            <option value="apartment">Departamento</option>
            <option value="land">Terreno / Lote</option>
            <option value="commercial">Comercial</option>
            <option value="office">Oficina</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="bg-[#F4F5F7] border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20"
          >
            <option value="">Todos los estados</option>
            <option value="available">Disponible</option>
            <option value="reserved">Reservado</option>
            <option value="sold">Vendido</option>
            <option value="rented">Alquilado</option>
          </select>

          <select
            value={agentFilter}
            onChange={(e) => {
              setAgentFilter(e.target.value);
              setPage(1);
            }}
            className="bg-[#F4F5F7] border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20"
          >
            <option value="">👤 Todos los Agentes / Asesores</option>
            {agents.map((ag) => (
              <option key={ag.id} value={ag.id}>
                {ag.name || ag.email} (ID: #{ag.id})
              </option>
            ))}
          </select>
        </div>

        {/* View Mode Toggle Buttons */}
        <div className="flex items-center gap-1 bg-[#F4F5F7] p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors ${
              viewMode === 'table' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Vista Lista Tabla"
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">Lista</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors ${
              viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Vista Cuadrícula Tarjetas"
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Tarjetas</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : estates.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200/80 shadow-sm">
          <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No se encontraron propiedades</h3>
          <p className="text-xs text-slate-500 mt-1">Ajuste sus filtros o registre un nuevo inmueble.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {viewMode === 'table' ? (
            /* Table View Mode */
            <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700 border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-500 tracking-wider">
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
                  <tbody className="divide-y divide-slate-100">
                    {estates.map((estate) => {
                      const imgUrl = getEstateImageUrl(estate);
                      const isMenuOpen = activeMenuId === estate.id;

                      return (
                        <tr key={estate.id} className="hover:bg-slate-50/80 transition-colors">
                          {/* ID */}
                          <td className="py-3.5 px-4 font-mono text-xs text-slate-500 font-bold text-center">
                            #{estate.id}
                          </td>

                          {/* Título + Imagen Thumbnail */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex-shrink-0 overflow-hidden relative">
                                {imgUrl ? (
                                  <img
                                    src={imgUrl}
                                    alt={estate.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                                    <ImageIcon className="w-5 h-5" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors line-clamp-1">
                                  {estate.title}
                                </h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">
                                    {estate.type || 'Inmueble'}
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

                          {/* Estado Badge */}
                          <td className="py-3.5 px-4 text-center">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                              (estate.status as any) == 1 || estate.status === 'available'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : (estate.status as any) == 2 || estate.status === 'sold'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {(estate.status as any) == 1 || estate.status === 'available' ? 'Disponible' : (estate.status as any) == 2 ? 'Vendido' : 'Alquilado'}
                            </span>
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
                                    <div className="absolute right-0 top-full mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden py-1 text-left animate-slide-up-fade">
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

                                      <div className="h-px bg-slate-100 my-1"></div>

                                      <button
                                        onClick={() => handleCopyLink(estate)}
                                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                                      >
                                        <Copy className="w-4 h-4 text-slate-500 flex-shrink-0" />
                                        <span>Copiar Enlace Público</span>
                                      </button>

                                      <button
                                        onClick={() => {
                                          setActiveMenuId(null);
                                          handleOpenEditModal(estate);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
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
                    className="bg-white rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group relative"
                  >
                    <div>
                      <div className="h-48 bg-slate-100 relative flex items-center justify-center overflow-hidden">
                        {imgUrl ? (
                          <img
                            src={imgUrl}
                            alt={estate.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex flex-col items-center text-slate-400">
                            <ImageIcon className="w-10 h-10 mb-1" />
                            <span className="text-xs">Sin imagen</span>
                          </div>
                        )}

                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-900/80 text-white backdrop-blur-md">
                            {estate.type || 'Inmueble'}
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
                              <div className="absolute right-0 top-full mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden py-1 text-left text-xs animate-slide-up-fade">
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

                                <div className="h-px bg-slate-100 my-1"></div>

                                <button
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    handleOpenEditModal(estate);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
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
          {pagination.last_page > 1 && (
            <div className="bg-white px-6 py-4 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
              <div>
                Mostrando <strong className="text-slate-900">{(pagination.current_page - 1) * pagination.per_page + 1} - {Math.min(pagination.current_page * pagination.per_page, pagination.total)}</strong> de <strong className="text-slate-900">{pagination.total}</strong> propiedades
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(p - 1, 1))}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 font-bold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>
                <span className="font-bold text-slate-800">
                  Página {pagination.current_page} de {pagination.last_page}
                </span>
                <button
                  disabled={page >= pagination.last_page}
                  onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 font-bold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <span>Siguiente</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
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
    </div>
  );
};

export default EstatesPage;
