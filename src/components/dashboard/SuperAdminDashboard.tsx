'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Globe, 
  Users, 
  Layers, 
  ShieldCheck, 
  ShoppingBag, 
  Package, 
  ArrowRight, 
  Plus, 
  Activity, 
  CheckCircle2, 
  XCircle,
  ExternalLink
} from 'lucide-react';
import DashboardMetricCard from './DashboardMetricCard';
import RecentActivityWidget from './widgets/RecentActivityWidget';
import { DashboardSummaryResponse } from '../../services/dashboardService';

interface SuperAdminDashboardProps {
  data: DashboardSummaryResponse;
  isLoading?: boolean;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ data, isLoading }) => {
  const metrics = data.metrics || {};
  const recentAgencies = data.recent_agencies || [];
  const recentActivity = data.recent_activity || [];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              SANTUN Super Admin
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Visión Global de la Plataforma
            </span>
          </div>

          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight sm:text-4xl">
            Panel de Control Global
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Monitoreo en tiempo real de agencias, marcas blancas, usuarios y volumen del ecosistema sin restricciones de plan.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/agencies"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-colors"
          >
            <Building2 className="w-4 h-4" />
            <span>Gestionar Agencias</span>
          </Link>
          <Link
            href="/white-labels"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span>Marcas Blancas</span>
          </Link>
          <Link
            href="/admin/plans"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Layers className="w-4 h-4" />
            <span>Planes y Permisos</span>
          </Link>
        </div>
      </div>

      {/* Global Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <DashboardMetricCard
          title="Agencias Registradas"
          value={metrics.agencies_total}
          label={`${metrics.agencies_active ?? 0} activas · ${metrics.agencies_inactive ?? 0} inactivas`}
          icon={Building2}
          gradient="from-blue-600 to-indigo-600"
          link="/agencies"
          badge={metrics.agencies_active ? `${metrics.agencies_active} Operativas` : undefined}
          badgeType="success"
          isLoading={isLoading}
        />

        <DashboardMetricCard
          title="Marcas Blancas"
          value={metrics.white_labels_total}
          label="Tenants independientes"
          icon={Globe}
          gradient="from-cyan-600 to-teal-600"
          link="/white-labels"
          isLoading={isLoading}
        />

        <DashboardMetricCard
          title="Usuarios Globales"
          value={metrics.users_total}
          label="Cuentas activas en la red"
          icon={Users}
          gradient="from-emerald-600 to-teal-600"
          link="/users"
          isLoading={isLoading}
        />

        <DashboardMetricCard
          title="Planes de Servicio"
          value={metrics.plans_total}
          label="Estructuras de suscripción"
          icon={Layers}
          gradient="from-purple-600 to-indigo-600"
          link="/admin/plans"
          isLoading={isLoading}
        />
      </div>

      {/* Global Volume Grid */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          Volumen Global de Módulos en el Ecosistema
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <DashboardMetricCard
            title="Clientes & Leads"
            value={metrics.clients_total}
            label="Prospectos en toda la red"
            icon={Users}
            gradient="from-emerald-500 to-teal-600"
            link="/clients"
            isLoading={isLoading}
          />
          <DashboardMetricCard
            title="Inmuebles en Catálogo"
            value={metrics.estates_total}
            label="Propiedades de agencias"
            icon={Building2}
            gradient="from-blue-500 to-indigo-600"
            link="/estates"
            isLoading={isLoading}
          />
          <DashboardMetricCard
            title="Productos & POS"
            value={metrics.products_total}
            label="Artículos de inventario"
            icon={Package}
            gradient="from-violet-500 to-purple-600"
            link="/products"
            isLoading={isLoading}
          />
          <DashboardMetricCard
            title="Trámites de Visados"
            value={metrics.visas_total}
            label="Expedientes de viaje"
            icon={ShieldCheck}
            gradient="from-amber-500 to-orange-600"
            link="/visas"
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Bottom Section: Recent Agencies & System Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Agencies Table */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Agencias Recientes
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Últimas agencias creadas en la plataforma
              </p>
            </div>
            <Link
              href="/agencies"
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <span>Ver todas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentAgencies.length > 0 ? (
            <div className="space-y-3">
              {recentAgencies.map((agency) => (
                <div
                  key={agency.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {agency.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      {agency.white_label?.name && (
                        <span className="font-medium text-slate-600 dark:text-slate-400">
                          {agency.white_label.name}
                        </span>
                      )}
                      {agency.plan?.name && (
                        <>
                          <span>·</span>
                          <span className="text-blue-600 dark:text-blue-400 font-semibold">
                            {agency.plan.name}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                      agency.status
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60'
                        : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60'
                    }`}>
                      {agency.status ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {agency.status ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              No hay agencias registradas aún.
            </div>
          )}
        </div>

        {/* Global Audit Logs */}
        <RecentActivityWidget
          activities={recentActivity}
          title="Actividad Global de la Plataforma"
        />
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
