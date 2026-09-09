'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Globe, 
  Building2, 
  Users, 
  Palette, 
  Film, 
  Layers, 
  FileSpreadsheet, 
  ArrowRight,
  ShieldCheck,
  Package
} from 'lucide-react';
import DashboardMetricCard from './DashboardMetricCard';
import PermissionGate from './PermissionGate';
import NoPermissionsState from './NoPermissionsState';
import RecentActivityWidget from './widgets/RecentActivityWidget';
import { DashboardSummaryResponse } from '../../services/dashboardService';

interface WhiteLabelDashboardProps {
  data: DashboardSummaryResponse;
  isLoading?: boolean;
}

export const WhiteLabelDashboard: React.FC<WhiteLabelDashboardProps> = ({ data, isLoading }) => {
  const metrics = data.metrics || {};
  const whiteLabel = data.white_label;
  const plan = data.plan;
  const recentAgencies = data.recent_agencies || [];
  const recentActivity = data.recent_activity || [];
  const effectivePermissions = data.effective_permissions || [];

  if (effectivePermissions.length === 0 && plan) {
    return <NoPermissionsState planName={plan.name} />;
  }

  return (
    <div className="space-y-8">
      {/* White Label Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/60">
              <Globe className="w-3.5 h-3.5" />
              {whiteLabel?.name || 'Marca Blanca'}
            </span>
            {plan && (
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Plan: <span className="text-blue-600 dark:text-blue-400 font-bold">{plan.name}</span>
              </span>
            )}
          </div>

          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight sm:text-4xl">
            Panel de Marca Blanca
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Administración centralizada de tu red de agencias, usuarios y módulos autorizados por tu plan.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/white-label/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 text-white font-bold text-xs shadow-md shadow-cyan-600/20 hover:bg-cyan-700 transition-colors"
          >
            <Building2 className="w-4 h-4" />
            <span>Administrar Agencias</span>
          </Link>
          <Link
            href="/admin/branding"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Palette className="w-4 h-4" />
            <span>Personalizar Marca</span>
          </Link>
          <Link
            href="/admin/login-settings"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Film className="w-4 h-4" />
            <span>Configurar Login</span>
          </Link>
        </div>
      </div>

      {/* Network Core Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <DashboardMetricCard
          title="Agencias en mi Red"
          value={metrics.agencies_count}
          label="Agencias asignadas a tu marca"
          icon={Building2}
          gradient="from-blue-600 to-indigo-600"
          link="/white-label/dashboard"
          isLoading={isLoading}
        />

        <DashboardMetricCard
          title="Usuarios en mi Red"
          value={metrics.users_count}
          label="Miembros y agentes totales"
          icon={Users}
          gradient="from-cyan-600 to-teal-600"
          isLoading={isLoading}
        />

        {/* Dynamic Plan-Dependent Cards */}
        <PermissionGate permission={['view_crm', 'view_clients']}>
          <DashboardMetricCard
            title="Leads de la Red"
            value={metrics.clients_count}
            label="Prospectos registrados"
            icon={Users}
            gradient="from-emerald-600 to-teal-600"
            link="/clients"
            isLoading={isLoading}
          />
        </PermissionGate>

        <PermissionGate permission="view_estates">
          <DashboardMetricCard
            title="Inmuebles en Red"
            value={metrics.estates_count}
            label="Propiedades en catálogo"
            icon={Building2}
            gradient="from-blue-500 to-indigo-600"
            link="/estates"
            isLoading={isLoading}
          />
        </PermissionGate>

        <PermissionGate permission={['view_products', 'view_pos']}>
          <DashboardMetricCard
            title="Catálogo de Productos"
            value={metrics.products_count}
            label="Artículos e inventario"
            icon={Package}
            gradient="from-violet-500 to-purple-600"
            link="/products"
            isLoading={isLoading}
          />
        </PermissionGate>

        <PermissionGate permission="view_visas">
          <DashboardMetricCard
            title="Trámites de Visado"
            value={metrics.visas_count}
            label="Expedientes activos"
            icon={ShieldCheck}
            gradient="from-amber-500 to-orange-600"
            link="/visas"
            isLoading={isLoading}
          />
        </PermissionGate>
      </div>

      {/* Network Agencies & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Agencias de mi Red
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Agencias operando bajo tu marca blanca
              </p>
            </div>
            <Link
              href="/white-label/dashboard"
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <span>Gestionar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentAgencies.length > 0 ? (
            <div className="space-y-3">
              {recentAgencies.map((agency) => (
                <div
                  key={agency.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {agency.name}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {agency.email || 'Sin correo configurado'}
                    </p>
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                    agency.status
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60'
                  }`}>
                    {agency.status ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              No tienes agencias registradas bajo esta marca blanca.
            </div>
          )}
        </div>

        <RecentActivityWidget
          activities={recentActivity}
          title="Actividad en mi Red"
        />
      </div>
    </div>
  );
};

export default WhiteLabelDashboard;
