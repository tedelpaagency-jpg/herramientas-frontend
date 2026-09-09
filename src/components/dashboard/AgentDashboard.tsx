'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Users, 
  CheckSquare, 
  GraduationCap, 
  ShieldCheck, 
  Kanban, 
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import DashboardMetricCard from './DashboardMetricCard';
import PermissionGate from './PermissionGate';
import NoPermissionsState from './NoPermissionsState';
import LeadsPipelineWidget from './widgets/LeadsPipelineWidget';
import TasksWidget from './widgets/TasksWidget';
import { DashboardSummaryResponse } from '../../services/dashboardService';

interface AgentDashboardProps {
  data: DashboardSummaryResponse;
  isLoading?: boolean;
}

export const AgentDashboard: React.FC<AgentDashboardProps> = ({ data, isLoading }) => {
  const metrics = data.metrics || {};
  const agency = data.agency;
  const plan = data.plan;
  const widgets = data.widgets || [];
  const recent = data.recent || {};
  const effectivePermissions = data.effective_permissions || [];

  if (effectivePermissions.length === 0 && plan) {
    return <NoPermissionsState planName={plan.name} />;
  }

  const findWidget = (key: string) => widgets.find((w) => w.key === key)?.data || {};

  const myLeadsData = findWidget('my_leads');
  const myTasksData = findWidget('my_tasks');
  const myCoursesData = findWidget('courses');

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
              Espacio del Agente
            </span>
            {agency?.name && (
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {agency.name}
              </span>
            )}
            {plan?.name && (
              <span className="text-xs font-medium text-slate-400">
                · Plan {plan.name}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight sm:text-4xl">
            Mi Panel de Operación Diaria
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Gestiona tus prospectos asignados, actividades pendientes y capacitación profesional.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <PermissionGate permission={['view_crm', 'manage_crm']}>
            <Link
              href="/crm"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-colors"
            >
              <Kanban className="w-4 h-4" />
              <span>Mi CRM Kanban</span>
            </Link>
          </PermissionGate>

          <PermissionGate permission="tasks.view">
            <Link
              href="/tasks"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Mis Tareas</span>
            </Link>
          </PermissionGate>

          <PermissionGate permission="courses.view">
            <Link
              href="/my-courses"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Mis Cursos</span>
            </Link>
          </PermissionGate>
        </div>
      </div>

      {/* Operational Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <PermissionGate permission={['view_crm', 'view_clients']}>
          <DashboardMetricCard
            title="Mis Leads Asignados"
            value={metrics.my_leads_total}
            label={metrics.my_leads_new_month ? `+${metrics.my_leads_new_month} este mes` : 'Total bajo tu gestión'}
            icon={Users}
            gradient="from-emerald-500 to-teal-600"
            link="/clients"
            badge={metrics.my_leads_new_month ? `+${metrics.my_leads_new_month} nuevo(s)` : undefined}
            badgeType="success"
            isLoading={isLoading}
          />
        </PermissionGate>

        <PermissionGate permission="tasks.view">
          <DashboardMetricCard
            title="Mis Tareas Pendientes"
            value={metrics.my_tasks_pending}
            label="Acciones por realizar"
            icon={CheckSquare}
            gradient="from-amber-500 to-orange-600"
            link="/tasks"
            badge={metrics.my_tasks_pending ? `${metrics.my_tasks_pending} Pendientes` : undefined}
            badgeType="warning"
            isLoading={isLoading}
          />
        </PermissionGate>

        <PermissionGate permission="courses.view">
          <DashboardMetricCard
            title="Cursos en Progreso"
            value={metrics.enrolled_courses}
            label="Capacitaciones activas"
            icon={GraduationCap}
            gradient="from-blue-600 to-indigo-600"
            link="/my-courses"
            isLoading={isLoading}
          />
        </PermissionGate>

        <PermissionGate permission="view_visas">
          <DashboardMetricCard
            title="Expedientes de Visa"
            value={metrics.visas_total}
            label="Trámites en tu agencia"
            icon={ShieldCheck}
            gradient="from-purple-600 to-indigo-600"
            link="/visas"
            isLoading={isLoading}
          />
        </PermissionGate>
      </div>

      {/* Operational Content Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PermissionGate permission={['view_crm', 'view_clients']}>
          <div className="lg:col-span-2">
            <LeadsPipelineWidget
              title="Mis Prospectos en Seguimiento"
              total={myLeadsData.total || metrics.my_leads_total}
              newThisMonth={myLeadsData.new_this_month || metrics.my_leads_new_month}
              pipeline={myLeadsData.pipeline}
              recentClients={recent.my_leads}
            />
          </div>
        </PermissionGate>

        <PermissionGate permission="tasks.view">
          <TasksWidget
            title="Mis Tareas por Cumplir"
            pending={myTasksData.pending || metrics.my_tasks_pending}
            recentTasks={recent.tasks}
          />
        </PermissionGate>
      </div>
    </div>
  );
};

export default AgentDashboard;
