'use client';

import React, { useEffect, useState } from 'react';
import { Agency, User, Estate } from '../types';
import adminService from '../services/adminService';
import { useAuth } from '../context/AuthContext';
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
} from 'lucide-react';
import Link from 'next/link';

interface AgencyDetailPageProps {
  agencyId: number;
}

export const AgencyDetailPage: React.FC<AgencyDetailPageProps> = ({ agencyId }) => {
  const { user: currentUser } = useAuth();
  const [agency, setAgency] = useState<Agency | null>(null);
  const [agencyUsers, setAgencyUsers] = useState<User[]>([]);
  const [agencyProperties, setAgencyProperties] = useState<Estate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'users' | 'properties'>('info');

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

  if (isLoading) {
    return (
      <div className="p-12 flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold">Cargando perfil de agencia...</span>
        </div>
      </div>
    );
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
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold flex items-center justify-center text-2xl shadow-lg shadow-blue-600/20 flex-shrink-0">
              {agency.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{agency.name}</h1>
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

          <Link
            href="/admin/agencies"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors self-start md:self-auto"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Volver al Listado</span>
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-t border-slate-100 pt-4 mt-6">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'info'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-600 hover:bg-slate-100'
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
                : 'text-slate-600 hover:bg-slate-100'
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
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Propiedades ({agencyProperties.length})</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'info' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Contact & Location */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-600" />
              <span>Datos de Contacto y Ubicación</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="font-bold text-slate-700">Email:</span>
                <span className="text-slate-900 font-semibold">{agency.email || 'No registrado'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="font-bold text-slate-700">Teléfono:</span>
                <span className="text-slate-900 font-semibold">{agency.phone || 'No registrado'}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-700">Dirección:</span>
                  <p className="text-slate-900 font-semibold">{agency.address || 'Sin dirección registrada'}</p>
                  <p className="text-slate-500 font-medium">
                    {agency.city ? `${agency.city}, ` : ''}{agency.province || ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-slate-400" />
                <span className="font-bold text-slate-700">Dominio Personalizado:</span>
                <span className="text-blue-600 font-mono font-semibold">{agency.domain || 'Dominio estándar'}</span>
              </div>
            </div>
          </div>

          {/* Card Management & Plan */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span>Gestión Comercial y Plan</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-slate-700 block mb-1">Gerente Comercial Asignado:</span>
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
                <span className="font-bold text-slate-700 block mb-1">Plan Activo:</span>
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
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Usuarios Asignados a la Agencia</h2>
              <p className="text-xs text-slate-500 font-medium">Administradores y agentes autorizados para esta agencia.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
                  <th className="py-3.5 px-6">Usuario</th>
                  <th className="py-3.5 px-6">Rol</th>
                  <th className="py-3.5 px-6">Teléfono</th>
                  <th className="py-3.5 px-6">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {agencyUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                          {u.name?.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{u.name}</p>
                          <p className="text-[11px] text-slate-500 font-medium">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-800">
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
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Propiedades de la Agencia</h2>
              <p className="text-xs text-slate-500 font-medium">Catálogo inmobiliario perteneciente a esta agencia.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
                  <th className="py-3.5 px-6">Propiedad</th>
                  <th className="py-3.5 px-6">Ubicación</th>
                  <th className="py-3.5 px-6">Precio</th>
                  <th className="py-3.5 px-6">Estado Inmueble</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {agencyProperties.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">
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
    </div>
  );
};

export default AgencyDetailPage;
