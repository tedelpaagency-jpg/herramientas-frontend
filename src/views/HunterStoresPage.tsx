import React, { useEffect, useState } from 'react';
import { HunterStore, HunterProfileData, HunterRequest } from '../types/hunter';
import hunterService from '../services/hunterService';
import Portal from '../components/Portal';
import { useAuth } from '../context/AuthContext';
import { 
  Store, Plus, Search, Mail, Phone, MapPin, QrCode, Copy, Check, 
  Trash2, Edit3, Eye, ShieldAlert, CheckCircle2, XCircle, Clock, 
  TrendingUp, Users, DollarSign, Award, X, Sparkles, ExternalLink, RefreshCw, ChevronLeft, UserCheck, Video, Image as ImageIcon
} from 'lucide-react';
import toast from 'react-hot-toast';

export const HunterStoresPage: React.FC = () => {
  const { user } = useAuth();
  const isHunter =
    user?.role === 'hunter' ||
    user?.role === 'comercio' ||
    user?.role === 'store' ||
    user?.roles?.some((r: any) => ['hunter', 'comercio', 'store'].includes(r.name));

  const [stores, setStores] = useState<HunterStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<HunterStore | null>(null);
  const [selectedProfileStoreId, setSelectedProfileStoreId] = useState<number | null>(null);
  const [profileData, setProfileData] = useState<HunterProfileData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'requests' | 'edit' | 'delete'>('stats');

  // QR Modal
  const [qrModalStore, setQrModalStore] = useState<HunterStore | null>(null);

  // Approve / Reject Modals for requests
  const [approvingRequest, setApprovingRequest] = useState<HunterRequest | null>(null);
  const [commissionPercentage, setCommissionPercentage] = useState('10');
  const [commissionAmount, setCommissionAmount] = useState('0');
  
  const [rejectingRequest, setRejectingRequest] = useState<HunterRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Form State for Create/Edit Store & Hunter User Login
  const [formData, setFormData] = useState({
    name: '',
    user_name: '',
    ruc_dni: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    country: 'Ecuador',
    province: '',
    canton: '',
    address: '',
    media_type: 'image' as 'image' | 'video',
    media_url: '',
    status: 'active' as 'active' | 'suspended',
  });

  const [copiedStoreId, setCopiedStoreId] = useState<number | null>(null);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const res = await hunterService.getStores({
        search,
        status: statusFilter,
      });
      const storeList = res.data || [];
      setStores(storeList);

      // If logged in as Hunter user, automatically load their store profile
      if (isHunter && storeList.length > 0) {
        loadProfile(storeList[0].id);
      }
    } catch (err) {
      console.error(err);
      toast.error('Error al cargar tiendas Hunter');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [search, statusFilter]);

  const loadProfile = async (storeId: number) => {
    setSelectedProfileStoreId(storeId);
    setLoadingProfile(true);
    try {
      const data = await hunterService.getStoreProfile(storeId);
      setProfileData(data);
      setActiveTab('stats');
    } catch (err) {
      toast.error('Error al cargar perfil de la tienda Hunter');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingStore(null);
    setFormData({
      name: '',
      user_name: '',
      ruc_dni: '',
      username: '',
      email: '',
      password: '',
      phone: '',
      country: 'Ecuador',
      province: '',
      canton: '',
      address: '',
      media_type: 'image',
      media_url: '',
      status: 'active',
    });
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (store: HunterStore) => {
    setEditingStore(store);
    setFormData({
      name: store.name || '',
      user_name: store.user?.name || store.name || '',
      ruc_dni: store.ruc_dni || '',
      username: store.username || '',
      email: store.email || store.user?.email || '',
      password: '',
      phone: store.phone || '',
      country: store.country || 'Ecuador',
      province: store.province || '',
      canton: store.canton || '',
      address: store.address || '',
      media_type: store.media_type || 'image',
      media_url: store.media_url || '',
      status: store.status || 'active',
    });
    setIsCreateModalOpen(true);
  };

  const handleSaveStore = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingStore) {
        await hunterService.updateStore(editingStore.id, formData);
        toast.success('Tienda Hunter actualizada correctamente');
      } else {
        await hunterService.createStore(formData);
        toast.success('Nueva Tienda Hunter y usuario registrados correctamente');
      }
      setIsCreateModalOpen(false);
      fetchStores();
      if (selectedProfileStoreId && editingStore?.id === selectedProfileStoreId) {
        loadProfile(selectedProfileStoreId);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al guardar tienda');
    }
  };

  const handleDeleteStore = async (storeId: number) => {
    if (!confirm('¿Está seguro de eliminar o deshabilitar esta Tienda Hunter?')) return;
    try {
      await hunterService.deleteStore(storeId);
      toast.success('Tienda Hunter eliminada');
      if (selectedProfileStoreId === storeId) {
        setSelectedProfileStoreId(null);
      }
      fetchStores();
    } catch (err) {
      toast.error('Error al eliminar tienda');
    }
  };

  const handleCopyCampaignLink = (store: HunterStore) => {
    const url = `${window.location.origin}/form?campaign=${store.campaign_token}`;
    navigator.clipboard.writeText(url);
    setCopiedStoreId(store.id);
    toast.success('¡Enlace de captación copiado al portapapeles!');
    setTimeout(() => setCopiedStoreId(null), 2500);
  };

  const handleConfirmApprove = async () => {
    if (!approvingRequest) return;
    const comm = parseFloat(commissionPercentage) || 0;
    const commAmt = parseFloat(commissionAmount) || 0;

    try {
      await hunterService.approveRequest(approvingRequest.id, comm, commAmt);
      toast.success(`Solicitud #${approvingRequest.id} aprobada con ${comm}% / $${commAmt} de comisión`);
      setApprovingRequest(null);
      if (selectedProfileStoreId) {
        loadProfile(selectedProfileStoreId);
      }
    } catch (err) {
      toast.error('Error al aprobar la solicitud');
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectingRequest) return;
    if (!rejectionReason.trim()) {
      toast.error('Debe ingresar un motivo para el rechazo');
      return;
    }

    try {
      await hunterService.rejectRequest(rejectingRequest.id, rejectionReason);
      toast.success(`Solicitud #${rejectingRequest.id} rechazada`);
      setRejectingRequest(null);
      setRejectionReason('');
      if (selectedProfileStoreId) {
        loadProfile(selectedProfileStoreId);
      }
    } catch (err) {
      toast.error('Error al rechazar la solicitud');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 rounded-3xl text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-indigo-600/30 border border-indigo-400/30 rounded-2xl backdrop-blur-md">
            <Store className="w-8 h-8 text-indigo-300" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Módulo Hunter (Tiendas y Agencias Aliadas)</h1>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              Gestión de captación de prospectos, códigos QR de campaña y aprobación de comisiones.
            </p>
          </div>
        </div>

        {!isHunter && (
          <button
            onClick={handleOpenCreateModal}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Tienda Hunter</span>
          </button>
        )}
      </div>

      {/* Main Views Container */}
      {selectedProfileStoreId && profileData ? (
        /* ================= HUNTER PROFILE VIEW ================= */
        <div className="space-y-6 animate-in fade-in">
          {/* Back button & Profile Header */}
          <div className="flex items-center justify-between">
            {!isHunter ? (
              <button
                onClick={() => setSelectedProfileStoreId(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Volver al Listado de Tiendas</span>
              </button>
            ) : <div />}

            <button
              onClick={() => loadProfile(selectedProfileStoreId)}
              className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 rounded-xl text-xs"
              title="Recargar datos"
            >
              <RefreshCw className={`w-4 h-4 ${loadingProfile ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Profile Store Card Header */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center font-black text-2xl text-indigo-600 dark:text-indigo-400 shadow-inner">
                  {profileData.store.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                      {profileData.store.name}
                    </h2>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      profileData.store.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {profileData.store.status === 'active' ? 'Activo' : 'Suspendido'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    RUC / DNI: <span className="font-bold text-slate-700 dark:text-slate-300">{profileData.store.ruc_dni || 'N/A'}</span> • Username: <span className="font-bold text-slate-700 dark:text-slate-300">{profileData.store.username || 'N/A'}</span>
                  </p>
                </div>
              </div>

              {/* Quick Link Buttons */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <button
                  onClick={() => setQrModalStore(profileData.store)}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold rounded-xl flex items-center gap-1.5"
                >
                  <QrCode className="w-4 h-4 text-indigo-600" />
                  <span>Ver Código QR</span>
                </button>

                <button
                  onClick={() => handleCopyCampaignLink(profileData.store)}
                  className="px-3 py-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-bold rounded-xl border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copiar Link de Campaña</span>
                </button>

                {profileData.store.phone && (
                  <a
                    href={`tel:${profileData.store.phone}`}
                    className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 rounded-xl"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                )}
                {profileData.store.email && (
                  <a
                    href={`mailto:${profileData.store.email}`}
                    className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 rounded-xl"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Profile Nav Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 pt-2 text-xs">
              <button
                onClick={() => setActiveTab('stats')}
                className={`px-4 py-2.5 font-extrabold rounded-t-xl transition-all border-b-2 flex items-center gap-2 ${
                  activeTab === 'stats'
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 border-indigo-600'
                    : 'text-slate-500 border-transparent hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Estadísticas</span>
              </button>

              <button
                onClick={() => setActiveTab('requests')}
                className={`px-4 py-2.5 font-extrabold rounded-t-xl transition-all border-b-2 flex items-center gap-2 ${
                  activeTab === 'requests'
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 border-indigo-600'
                    : 'text-slate-500 border-transparent hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Registros ({profileData.requests?.length || 0})</span>
              </button>

              {!isHunter && (
                <>
                  <button
                    onClick={() => {
                      handleOpenEditModal(profileData.store);
                      setActiveTab('edit');
                    }}
                    className={`px-4 py-2.5 font-extrabold rounded-t-xl transition-all border-b-2 flex items-center gap-2 ${
                      activeTab === 'edit'
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 border-indigo-600'
                        : 'text-slate-500 border-transparent hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Editar Tienda</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('delete')}
                    className={`px-4 py-2.5 font-extrabold rounded-t-xl transition-all border-b-2 flex items-center gap-2 ${
                      activeTab === 'delete'
                        ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 border-rose-600'
                        : 'text-slate-500 border-transparent hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Suspender / Eliminar</span>
                  </button>
                </>
              )}
            </div>

            {/* TAB CONTENTS */}
            {activeTab === 'stats' && (
              <div className="space-y-6 animate-in fade-in">
                {/* 5 Stats Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-1">
                    <span className="text-slate-400 font-bold text-xs uppercase flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-blue-500" />
                      Visitas Estimadas
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                      {profileData.stats.estimated_visitors}
                    </h3>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-1">
                    <span className="text-slate-400 font-bold text-xs uppercase flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-purple-500" />
                      Solicitudes Registradas
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                      {profileData.stats.total_requests}
                    </h3>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-1">
                    <span className="text-slate-400 font-bold text-xs uppercase flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Ventas Aprobadas
                    </span>
                    <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      {profileData.stats.approved_requests}
                    </h3>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-1">
                    <span className="text-slate-400 font-bold text-xs uppercase flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-500" />
                      Comisión Promedio
                    </span>
                    <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400">
                      {profileData.stats.average_commission}%
                    </h3>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-1">
                    <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-xs uppercase flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      Total Comisiones
                    </span>
                    <h3 className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
                      ${profileData.stats.total_commission_amount || '0.00'}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'requests' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Registros y Solicitudes de la Tienda Hunter
                  </h3>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="p-3">ID</th>
                        <th className="p-3">Cliente</th>
                        <th className="p-3">Contacto</th>
                        <th className="p-3">Servicio</th>
                        <th className="p-3">Comisión (%)</th>
                        <th className="p-3">Estado</th>
                        <th className="p-3 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {profileData.requests.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-6 text-center text-slate-400 italic">
                            No se han registrado solicitudes para esta tienda Hunter aún.
                          </td>
                        </tr>
                      ) : (
                        profileData.requests.map((req) => (
                          <tr key={req.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                            <td className="p-3 font-mono font-bold text-slate-500">#{req.id}</td>
                            <td className="p-3 font-bold text-slate-900 dark:text-white">{req.client_name}</td>
                            <td className="p-3 text-slate-600 dark:text-slate-300">
                              <div>{req.email || 'Sin email'}</div>
                              <div className="text-[10px] text-slate-400">{req.phone || 'Sin teléfono'}</div>
                            </td>
                            <td className="p-3 font-semibold text-indigo-600 dark:text-indigo-400">
                              {req.service_name || 'General'}
                            </td>
                            <td className="p-3 font-black text-slate-900 dark:text-white">
                              {req.status === 2 ? (
                                <div>
                                  <div>{req.commission_percentage}%</div>
                                  {req.commission_amount ? (
                                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">${req.commission_amount}</div>
                                  ) : null}
                                </div>
                              ) : '—'}
                            </td>
                            <td className="p-3">
                              {req.status === 2 ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Aprobada
                                </span>
                              ) : req.status === 0 ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300" title={req.rejection_reason}>
                                  <XCircle className="w-3 h-3 text-rose-600" /> Rechazada
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                  <Clock className="w-3 h-3 text-amber-600" /> Pendiente
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-right space-x-1">
                              {req.status === 1 && (
                                <>
                                  <button
                                    onClick={() => {
                                      setApprovingRequest(req);
                                      setCommissionPercentage('10');
                                    }}
                                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] transition-all"
                                  >
                                    Aprobar
                                  </button>
                                  <button
                                    onClick={() => {
                                      setRejectingRequest(req);
                                      setRejectionReason('');
                                    }}
                                    className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[11px] transition-all"
                                  >
                                    Rechazar
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'delete' && (
              <div className="p-6 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 rounded-2xl space-y-4">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-6 h-6 text-rose-600" />
                  <h3 className="text-base font-black text-rose-900 dark:text-rose-300">Suspender o Eliminar Tienda Hunter</h3>
                </div>
                <p className="text-xs text-rose-700 dark:text-rose-300">
                  Al deshabilitar o eliminar la tienda Hunter, el código QR y enlace de captura ya no permitirán registrar nuevas solicitudes. Los reportes y ventas pasadas se conservarán en el historial.
                </p>
                <button
                  onClick={() => handleDeleteStore(profileData.store.id)}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95"
                >
                  Confirmar Eliminación de Tienda
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ================= HUNTER STORES LISTING VIEW ================= */
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex flex-wrap items-center gap-3 flex-1 max-w-lg">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar tienda por nombre, RUC, email..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="">Todos los Estados</option>
                <option value="active">Activos</option>
                <option value="suspended">Suspendidos</option>
              </select>
            </div>
          </div>

          {/* Stores Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-extrabold uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-4">Tienda Hunter</th>
                    <th className="p-4">Contacto</th>
                    <th className="p-4">Ubicación</th>
                    <th className="p-4">Captación (Link / QR)</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">
                        Cargando Tiendas Hunter...
                      </td>
                    </tr>
                  ) : stores.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                        No se encontraron Tiendas Hunter registradas.
                      </td>
                    </tr>
                  ) : (
                    stores.map((store) => (
                      <tr key={store.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 font-black flex items-center justify-center text-sm border border-indigo-200 dark:border-indigo-800 shadow-2xs">
                              {store.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{store.name}</h4>
                              <p className="text-[11px] text-slate-400">RUC/DNI: {store.ruc_dni || 'N/A'}</p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4 text-slate-600 dark:text-slate-300">
                          <div>{store.email || 'Sin correo'}</div>
                          <div className="text-[11px] text-slate-400">{store.phone || 'Sin teléfono'}</div>
                        </td>

                        <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">
                          {store.canton ? `${store.canton}, ` : ''}{store.country || 'Ecuador'}
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCopyCampaignLink(store)}
                              className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-100 transition-all flex items-center gap-1 text-[11px]"
                            >
                              {copiedStoreId === store.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedStoreId === store.id ? 'Copiado' : 'Link'}</span>
                            </button>

                            <button
                              onClick={() => setQrModalStore(store)}
                              className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 rounded-lg"
                              title="Ver QR"
                            >
                              <QrCode className="w-4 h-4 text-indigo-600" />
                            </button>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            store.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}>
                            {store.status === 'active' ? 'Activo' : 'Suspendido'}
                          </span>
                        </td>

                        <td className="p-4 text-right space-x-1">
                          <button
                            onClick={() => loadProfile(store.id)}
                            className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 hover:bg-indigo-100 rounded-xl"
                            title="Ver Perfil & Registros"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(store)}
                            className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 rounded-xl"
                            title="Editar Tienda"
                          >
                            <Edit3 className="w-4 h-4" />
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

      {/* ================= MODALS (Wrapped in Portal) ================= */}

      {/* CREATE / EDIT STORE MODAL */}
      {isCreateModalOpen && (
        <Portal>
          <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-4 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Store className="w-5 h-5 text-indigo-600" />
                  {editingStore ? 'Editar Tienda Hunter' : 'Registrar Nueva Tienda Hunter'}
                </h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveStore} className="space-y-3 text-xs">
                {/* Hunter User Login Credentials Section */}
                <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-900/60 space-y-2">
                  <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" /> Credenciales de Acceso para el Asesor Hunter
                  </span>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre Completo del Asesor *</label>
                    <input
                      type="text"
                      required
                      value={formData.user_name}
                      onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                      placeholder="Ej. Juan Pérez (Asesor Hunter)"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Correo de Acceso (Login) *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="asesor@tienda.com"
                        className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Contraseña de Acceso</label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder={editingStore ? 'Dejar en blanco para no cambiar' : 'Ej: Hunter123!'}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre de la Tienda / Agencia *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej. Tienda Hunter Quito Centro"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">RUC / DNI</label>
                    <input
                      type="text"
                      value={formData.ruc_dni}
                      onChange={(e) => setFormData({ ...formData, ruc_dni: e.target.value })}
                      placeholder="1790012345001"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Teléfono WhatsApp</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+593 99 123 4567"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none"
                    />
                  </div>
                </div>

                {/* Media Config for Public Landing */}
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1">
                    <Video className="w-3.5 h-3.5 text-purple-500" /> Contenido Multimedia para la Vista Pública (Split-Screen)
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tipo de Media</label>
                      <select
                        value={formData.media_type}
                        onChange={(e) => setFormData({ ...formData, media_type: e.target.value as any })}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-bold focus:outline-none"
                      >
                        <option value="image">Imagen</option>
                        <option value="video">Video</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">URL de Imagen o Video Promocional</label>
                      <input
                        type="url"
                        value={formData.media_url}
                        onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                        placeholder="https://ejemplo.com/video.mp4 o YouTube URL..."
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Provincia</label>
                    <input
                      type="text"
                      value={formData.province}
                      onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                      placeholder="Pichincha"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Cantón / Ciudad</label>
                    <input
                      type="text"
                      value={formData.canton}
                      onChange={(e) => setFormData({ ...formData, canton: e.target.value })}
                      placeholder="Quito"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Dirección Exacta</label>
                  <textarea
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Av. Amazonas y Colón..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Estado de la Tienda</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-bold focus:outline-none"
                  >
                    <option value="active">Activo (Acceso habilitado)</option>
                    <option value="suspended">Suspendido</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold shadow-md hover:bg-indigo-700 active:scale-95"
                  >
                    {editingStore ? 'Guardar Cambios' : 'Crear Tienda'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}

      {/* DISPLAY QR MODAL */}
      {qrModalStore && (
        <Portal>
          <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-sm w-full p-4 sm:p-6 text-center shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Código QR de la Tienda</h3>
                <button onClick={() => setQrModalStore(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex justify-center">
                <img
                  src={qrModalStore.qr_code_url}
                  alt="QR Code"
                  className="w-48 h-48 rounded-xl shadow-md bg-white p-2"
                />
              </div>

              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{qrModalStore.name}</p>
                <p className="text-[11px] text-slate-400">Escanea para acceder al formulario público de registro</p>
              </div>

              <button
                type="button"
                onClick={() => setQrModalStore(null)}
                className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl"
              >
                Cerrar
              </button>
            </div>
          </div>
        </Portal>
      )}

      {/* APPROVE REQUEST MODAL */}
      {approvingRequest && (
        <Portal>
          <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-4 sm:p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Aprobar Solicitud Hunter
                </h3>
                <button onClick={() => setApprovingRequest(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <p className="text-slate-600 dark:text-slate-300">
                  Aprobando solicitud para el cliente <span className="font-bold text-slate-900 dark:text-white">{approvingRequest.client_name}</span>.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Porcentaje (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={commissionPercentage}
                      onChange={(e) => setCommissionPercentage(e.target.value)}
                      placeholder="Ej: 10.00"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-bold text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Monto en Dólares ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={commissionAmount}
                      onChange={(e) => setCommissionAmount(e.target.value)}
                      placeholder="Ej: 50.00"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-bold text-sm focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setApprovingRequest(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmApprove}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
                >
                  Confirmar Aprobación
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* REJECT REQUEST MODAL */}
      {rejectingRequest && (
        <Portal>
          <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-4 sm:p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-rose-600" />
                  Rechazar Solicitud Hunter
                </h3>
                <button onClick={() => setRejectingRequest(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <p className="text-slate-600 dark:text-slate-300">
                  Rechazando solicitud para el cliente <span className="font-bold text-slate-900 dark:text-white">{rejectingRequest.client_name}</span>.
                </p>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Motivo del Rechazo *
                  </label>
                  <textarea
                    rows={3}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Ingrese la razón del rechazo..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setRejectingRequest(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReject}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
                >
                  Confirmar Rechazo
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};

export default HunterStoresPage;
