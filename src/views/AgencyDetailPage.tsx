'use client';

import React, { useEffect, useState } from 'react';
import { Agency, User, Estate } from '../types';
import adminService from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import whiteLabelService from '../services/whiteLabelService';
import { WhiteLabel } from '../types/whiteLabel';
import {
  Building2,
  Users,
  Building,
  Mail,
  Phone,
  MapPin,
  Globe,
  UserCheck,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  Briefcase,
  Layers,
  ArrowLeft,
  FileText,
  Edit3,
  X,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { TableSkeleton } from '@/components/Skeleton';

interface AgencyDetailPageProps {
  agencyId: number;
}

export const AgencyDetailPage: React.FC<AgencyDetailPageProps> = ({ agencyId }) => {
  const { user: currentUser } = useAuth();
  const [agency, setAgency] = useState<Agency | null>(null);
  const [agencyUsers, setAgencyUsers] = useState<User[]>([]);
  const [agencyProperties, setAgencyProperties] = useState<Estate[]>([]);
  const [whiteLabels, setWhiteLabels] = useState<WhiteLabel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'users' | 'properties'>('info');

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    razon_social: '',
    ruc: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    domain: '',
    white_label_id: '' as string | number,
    status: 1,
  });

  useEffect(() => {
    const loadAgencyData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const agencyData = await adminService.getAgency(agencyId);
        setAgency(agencyData);

        const usersData = await adminService.getAgencyUsers(agencyId);
        setAgencyUsers(usersData);

        const propertiesData = await adminService.getAgencyProperties(agencyId);
        setAgencyProperties(propertiesData);

        try {
          const wlData = await whiteLabelService.getWhiteLabels();
          setWhiteLabels(Array.isArray(wlData) ? wlData : wlData?.data || []);
        } catch {
          // Ignorar error al cargar marcas blancas si no tiene permisos
        }
      } catch (err: any) {
        if (err.response?.status === 403) {
          setError('No tiene autorización para ver los detalles de esta agencia.');
        } else if (err.response?.status === 404) {
          setError('Agencia no encontrada.');
        } else {
          setError('Error al cargar la información de la agencia.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadAgencyData();
  }, [agencyId]);

  const openEditModal = () => {
    if (!agency) return;
    setSaveError(null);
    setSaveSuccess(null);
    setEditFormData({
      name: agency.name || '',
      razon_social: agency.razon_social || '',
      ruc: agency.ruc || '',
      email: agency.email || '',
      phone: agency.phone || '',
      address: agency.address || '',
      city: agency.city || '',
      province: agency.province || '',
      domain: agency.domain || '',
      white_label_id: agency.white_label_id || '',
      status: agency.status ?? 1,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveAgency = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agency) return;
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    const payload = {
      ...editFormData,
      white_label_id: editFormData.white_label_id ? Number(editFormData.white_label_id) : null,
      status: Number(editFormData.status),
    };

    try {
      const updated = await adminService.updateAgency(agency.id, payload);
      setAgency(updated);
      setSaveSuccess('Datos de la agencia y Marca Blanca actualizados correctamente.');
      setIsEditModalOpen(false);
    } catch (err: any) {
      setSaveError(err.response?.data?.message || 'Error al actualizar los datos de la agencia.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <TableSkeleton rows={5} />;
  }

  if (error || !agency) {
    return (
      <div className="p-8 bg-white rounded-2xl border border-rose-200 text-center max-w-lg mx-auto mt-8">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
          <XCircle className="w-6 h-6" />
        </div>
        <h2 className="text-base font-extrabold text-slate-900 mb-1">Acceso Denegado</h2>
        <p className="text-xs text-slate-500 mb-4">{error || 'Agencia no encontrada'}</p>
        <Link
          href="/admin/agencies"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Agencias</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold flex items-center justify-center text-2xl shadow-lg shadow-blue-600/20 flex-shrink-0">
              {agency.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">{agency.name}</h1>
                {agency.status === 1 ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Activa
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-600 border border-slate-200">
                    Inactiva
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {agency.razon_social || 'Razón social no especificada'} {agency.ruc ? `• RUC: ${agency.ruc}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={openEditModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shadow-md shadow-amber-600/20 cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>Editar Datos de Agencia</span>
            </button>
            <Link
              href="/admin/agencies"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Volver al Listado</span>
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-6">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'info'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Información General</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Usuarios de Agencia ({agencyUsers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('properties')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'properties'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Propiedades ({agencyProperties.length})</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{saveSuccess}</span>
          </div>
          <button onClick={() => setSaveSuccess(null)} className="text-emerald-500 hover:text-emerald-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {saveError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{saveError}</span>
          </div>
          <button onClick={() => setSaveError(null)} className="text-rose-500 hover:text-rose-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'info' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Contact & Location */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-600" />
              <span>Datos de Contacto y Ubicación</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="font-bold text-slate-700 dark:text-slate-300">Marca Blanca:</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-bold text-[11px]">
                  {agency.white_label?.name || (agency.white_label_id ? `Marca Blanca #${agency.white_label_id}` : 'Sin Asignar')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="font-bold text-slate-700 dark:text-slate-300">Email:</span>
                <span className="text-slate-900 dark:text-slate-100 font-semibold">{agency.email || 'No registrado'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="font-bold text-slate-700 dark:text-slate-300">Teléfono:</span>
                <span className="text-slate-900 dark:text-slate-100 font-semibold">{agency.phone || 'No registrado'}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300">Dirección:</span>
                  <p className="text-slate-900 dark:text-slate-100 font-semibold">{agency.address || 'Sin dirección registrada'}</p>
                  <p className="text-slate-500 font-medium">
                    {agency.city ? `${agency.city}, ` : ''}{agency.province || ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-slate-400" />
                <span className="font-bold text-slate-700 dark:text-slate-300">Dominio Personalizado:</span>
                <span className="text-blue-600 font-mono font-semibold">{agency.domain || 'Dominio estándar'}</span>
              </div>
            </div>
          </div>

          {/* Card Management & Plan */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span>Gestión Comercial y Plan</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Gerente Comercial Asignado:</span>
                {agency.gerente_comercial ? (
                  <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center">
                      {agency.gerente_comercial.name?.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-indigo-950">{agency.gerente_comercial.name}</p>
                      <p className="text-[11px] text-indigo-700 font-medium">{agency.gerente_comercial.email}</p>
                    </div>
                  </div>
                ) : (
                  <span className="text-slate-400 italic">No asignado</span>
                )}
              </div>

              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Plan Activo:</span>
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-blue-950">{agency.plan?.name || agency.current_subscription?.plan?.name || 'Plan Estándar'}</span>
                  </div>
                  <span className="text-xs font-extrabold text-blue-700">
                    ${agency.plan?.price || 0} / mes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">Usuarios Asignados a la Agencia</h2>
              <p className="text-xs text-slate-500 font-medium">Administradores y agentes autorizados para esta agencia.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50 text-[11px] font-extrabold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                  <th className="py-3.5 px-6">Usuario</th>
                  <th className="py-3.5 px-6">Rol</th>
                  <th className="py-3.5 px-6">Teléfono</th>
                  <th className="py-3.5 px-6">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-300">
                {agencyUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                          {u.name?.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100">{u.name}</p>
                          <p className="text-[11px] text-slate-500 font-medium">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-800 dark:text-slate-200">
                      {u.role || 'user'}
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-mono">
                      {u.phone || '—'}
                    </td>
                    <td className="py-4 px-6">
                      {u.status === 1 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-600 border border-slate-200">
                          Inactivo
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'properties' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">Propiedades de la Agencia</h2>
              <p className="text-xs text-slate-500 font-medium">Catálogo inmobiliario perteneciente a esta agencia.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50 text-[11px] font-extrabold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                  <th className="py-3.5 px-6">Propiedad</th>
                  <th className="py-3.5 px-6">Ubicación</th>
                  <th className="py-3.5 px-6">Precio</th>
                  <th className="py-3.5 px-6">Estado Inmueble</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-300">
                {agencyProperties.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-slate-100">
                      {p.title}
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      {p.full_address || `${p.province || ''} ${p.country || ''}`}
                    </td>
                    <td className="py-4 px-6 font-extrabold text-emerald-600">
                      ${Number(p.price).toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                        {p.property_status === 1 ? 'En Alquiler' : p.property_status === 2 ? 'En Venta' : 'Disponible'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal para Editar Datos Generales y Reasignar Marca Blanca */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto animate-slide-up-fade custom-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  Editar Datos Generales de la Agencia
                </h3>
                <p className="text-xs text-slate-400">
                  Modifica los datos de contacto, ubicación y reasigna la Marca Blanca.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAgency} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs">
                    Nombre de la Agencia *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-500 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs">
                    Razón Social
                  </label>
                  <input
                    type="text"
                    value={editFormData.razon_social}
                    onChange={(e) => setEditFormData({ ...editFormData, razon_social: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-500 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs">
                    RUC / Identificación Fiscal
                  </label>
                  <input
                    type="text"
                    value={editFormData.ruc}
                    onChange={(e) => setEditFormData({ ...editFormData, ruc: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-500 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-500 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-500 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs">
                    Dominio Personalizado
                  </label>
                  <input
                    type="text"
                    value={editFormData.domain}
                    onChange={(e) => setEditFormData({ ...editFormData, domain: e.target.value })}
                    placeholder="miagencia.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-500 text-xs font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    value={editFormData.city}
                    onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-500 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs">
                    Provincia / Estado
                  </label>
                  <input
                    type="text"
                    value={editFormData.province}
                    onChange={(e) => setEditFormData({ ...editFormData, province: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-500 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs">
                  Dirección Física
                </label>
                <input
                  type="text"
                  value={editFormData.address}
                  onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                  placeholder="Calle, número, oficina..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-500 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              {/* Reasignar Marca Blanca y Estado */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-purple-50/50 dark:bg-purple-950/20 rounded-2xl border border-purple-200/60 dark:border-purple-900/40">
                <div>
                  <label className="block font-bold text-purple-900 dark:text-purple-300 mb-1 text-xs flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-purple-600" />
                    <span>Marca Blanca (Reasignar)</span>
                  </label>
                  <select
                    value={editFormData.white_label_id}
                    onChange={(e) => setEditFormData({ ...editFormData, white_label_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 outline-none focus:border-purple-500 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold"
                  >
                    <option value="">Sin Marca Blanca Asignada</option>
                    {whiteLabels.map((wl) => (
                      <option key={wl.id} value={wl.id}>
                        🏢 {wl.name} ({wl.slug})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs">
                    Estado de la Agencia
                  </label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-500 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold"
                  >
                    <option value={1}>Activa</option>
                    <option value={0}>Inactiva</option>
                  </select>
                </div>
              </div>

              {/* Información de Plan Exclusivamente Ligado a Suscripción */}
              <div className="p-3.5 bg-amber-50/60 dark:bg-amber-950/20 rounded-2xl border border-amber-200/60 dark:border-amber-900/40">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-extrabold uppercase text-amber-900 dark:text-amber-300 tracking-wider">
                      Plan de la Agencia
                    </span>
                  </div>
                  <span className="text-[10px] bg-amber-200/60 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 px-2.5 py-0.5 rounded-full font-bold">
                    Ligado a Suscripción
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-100">
                  <span>{agency.current_subscription?.plan?.name || agency.plan?.name || 'Plan Estándar'}</span>
                  <span className="text-amber-700 dark:text-amber-300">
                    ${agency.current_subscription?.plan?.price || agency.plan?.price || 0} / mes
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                  * El plan no se modifica desde este formulario general; está asociado estrictamente al ciclo de suscripción activa de la agencia.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold transition-colors shadow-md shadow-amber-600/20 text-xs flex items-center gap-2 cursor-pointer"
                >
                  {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgencyDetailPage;
