'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Users, 
  ShoppingBag, 
  FileCheck, 
  Kanban, 
  Briefcase,
  CheckSquare, 
  ArrowRight,
  ShieldCheck,
  Package,
  Layers
} from 'lucide-react';
import DashboardMetricCard from './DashboardMetricCard';
import PermissionGate from './PermissionGate';
import NoPermissionsState from './NoPermissionsState';
import LeadsPipelineWidget from './widgets/LeadsPipelineWidget';
import EstatesWidget from './widgets/EstatesWidget';
import ProductsPosWidget from './widgets/ProductsPosWidget';
import VisasWidget from './widgets/VisasWidget';
import TasksWidget from './widgets/TasksWidget';
import { DashboardSummaryResponse } from '../../services/dashboardService';

interface AgencyAdminDashboardProps {
  data: DashboardSummaryResponse;
  isLoading?: boolean;
}

export const AgencyAdminDashboard: React.FC<AgencyAdminDashboardProps> = ({ data, isLoading }) => {
  const metrics = data.metrics || {};
  const agency = data.agency;
  const plan = data.plan;
  const widgets = data.widgets || [];
  const recent = data.recent || {};
  const effectivePermissions = data.effective_permissions || [];

  if (effectivePermissions.length === 0 && plan) {
    return <NoPermissionsState planName={plan.name} />;
  }

  // Find widget data helper
  const findWidget = (key: string) => widgets.find((w) => w.key === key)?.data || {};

  const leadsWidgetData = findWidget('leads');
  const estatesWidgetData = findWidget('estates');
  const productsWidgetData = findWidget('products');
  const visasWidgetData = findWidget('visas');
  const tasksWidgetData = findWidget('tasks');

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60">
              {agency?.name || 'Mi Agencia'}
            </span>
            {plan && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-300">
                <Layers className="w-3.5 h-3.5 text-blue-500" />
                Plan: <span className="text-blue-600 dark:text-blue-400 font-extrabold">{plan.name}</span>
              </span>
            )}
          </div>

          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight sm:text-4xl">
            Panel de Administración de Agencia
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Resumen operativo y métricas de desempeño configuradas según los módulos contratados en tu plan.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <PermissionGate permission={['view_crm', 'manage_crm']}>
            <Link
              href="/workspaces"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-colors"
            >
              <Briefcase className="w-4 h-4" />
              <span>Workspaces</span>
            </Link>
          </PermissionGate>

          <PermissionGate permission="view_estates">
            <Link
              href="/estates"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Building2 className="w-4 h-4" />
              <span>Propiedades</span>
            </Link>
          </PermissionGate>

          <PermissionGate permission="view_pos">
            <Link
              href="/pos"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white font-bold text-xs shadow-md shadow-violet-600/20 hover:bg-violet-700 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Punto de Venta</span>
            </Link>
          </PermissionGate>

          <PermissionGate permission="view_visas">
            <Link
              href="/visas"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Trámites de Visas</span>
            </Link>
          </PermissionGate>
        </div>
      </div>

      {/* Dynamic Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <PermissionGate permission={['view_crm', 'view_clients']}>
          <DashboardMetricCard
            title="Clientes & Prospectos"
            value={metrics.clients_total}
            label={metrics.clients_new_month ? `+${metrics.clients_new_month} nuevos este mes` : 'Total registrados'}
            icon={Users}
            gradient="from-emerald-500 to-teal-600"
            link="/clients"
            badge={metrics.clients_new_month ? `+${metrics.clients_new_month} mes` : undefined}
            badgeType="success"
            isLoading={isLoading}
          />
        </PermissionGate>

        <PermissionGate permission="view_estates">
          <DashboardMetricCard
            title="Propiedades Inmobiliarias"
            value={metrics.estates_total}
            label={metrics.estates_active ? `${metrics.estates_active} activas` : 'En catálogo'}
            icon={Building2}
            gradient="from-blue-600 to-indigo-600"
            link="/estates"
            badge={metrics.estates_active ? `${metrics.estates_active} Activas` : undefined}
            badgeType="info"
            isLoading={isLoading}
          />
        </PermissionGate>

        <PermissionGate permission={['view_products', 'view_pos']}>
          <DashboardMetricCard
            title="Productos & POS"
            value={metrics.products_total}
            label="Artículos para venta"
            icon={Package}
            gradient="from-violet-500 to-purple-600"
            link="/products"
            isLoading={isLoading}
          />
        </PermissionGate>

        <PermissionGate permission="view_visas">
          <DashboardMetricCard
            title="Trámites de Visados"
            value={metrics.visas_total}
            label="Expedientes en curso"
            icon={ShieldCheck}
            gradient="from-amber-500 to-orange-600"
            link="/visas"
            isLoading={isLoading}
          />
        </PermissionGate>

        <PermissionGate permission="tasks.view">
          <DashboardMetricCard
            title="Tareas del Equipo"
            value={metrics.tasks_pending}
            label="Pendientes por resolver"
            icon={CheckSquare}
            gradient="from-indigo-500 to-blue-600"
            link="/tasks"
            badge={metrics.tasks_pending ? `${metrics.tasks_pending} Pendientes` : undefined}
            badgeType="warning"
            isLoading={isLoading}
          />
        </PermissionGate>

        <DashboardMetricCard
          title="Equipo de Trabajo"
          value={metrics.team_members}
          label="Usuarios en tu agencia"
          icon={Users}
          gradient="from-slate-700 to-slate-900"
          link="/users"
          isLoading={isLoading}
        />
      </div>

      {/* Dynamic Content Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PermissionGate permission={['view_crm', 'view_clients']}>
          <div className="lg:col-span-2">
            <LeadsPipelineWidget
              total={leadsWidgetData.total || metrics.clients_total}
              newThisMonth={leadsWidgetData.new_this_month || metrics.clients_new_month}
              pipeline={leadsWidgetData.pipeline}
              recentClients={recent.clients}
            />
          </div>
        </PermissionGate>

        <PermissionGate permission="view_estates">
          <EstatesWidget
            total={estatesWidgetData.total || metrics.estates_total}
            active={estatesWidgetData.active || metrics.estates_active}
            recentEstates={recent.estates}
          />
        </PermissionGate>

        <PermissionGate permission={['view_products', 'view_pos']}>
          <ProductsPosWidget
            total={productsWidgetData.total || metrics.products_total}
            recentProducts={recent.products}
          />
        </PermissionGate>

        <PermissionGate permission="view_visas">
          <VisasWidget
            total={visasWidgetData.total || metrics.visas_total}
            recentVisas={recent.visas}
          />
        </PermissionGate>

        <PermissionGate permission="tasks.view">
          <TasksWidget
            pending={tasksWidgetData.pending || metrics.tasks_pending}
            title="Tareas de la Agencia"
          />
        </PermissionGate>
      </div>
    </div>
  );
};

export default AgencyAdminDashboard;
