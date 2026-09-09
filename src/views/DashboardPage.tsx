'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import dashboardService, { DashboardSummaryResponse } from '../services/dashboardService';
import SuperAdminDashboard from '../components/dashboard/SuperAdminDashboard';
import WhiteLabelDashboard from '../components/dashboard/WhiteLabelDashboard';
import AgencyAdminDashboard from '../components/dashboard/AgencyAdminDashboard';
import AgentDashboard from '../components/dashboard/AgentDashboard';
import NoPermissionsState from '../components/dashboard/NoPermissionsState';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardSummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await dashboardService.getSummary();
      setDashboardData(res);
    } catch (err: any) {
      console.error('Error fetching dynamic dashboard summary:', err);
      setError(
        err?.response?.data?.message ||
        'No se pudo conectar con el servicio de dashboard de Laravel. Por favor, intenta de nuevo.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  // Loading Skeleton State
  if (isLoading && !dashboardData) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Banner Skeleton */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded-full mb-4" />
          <div className="h-10 w-72 bg-slate-200 dark:bg-slate-800 rounded-xl mb-3" />
          <div className="h-4 w-96 bg-slate-200 dark:bg-slate-800 rounded-md" />
        </div>

        {/* Metric Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-36 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                  <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
                <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          ))}
        </div>

        {/* Content Widgets Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6" />
          <div className="h-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6" />
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/50 p-10 text-center shadow-sm max-w-xl mx-auto my-12">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Error al cargar el Dashboard
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          {error}
        </p>
        <button
          onClick={fetchSummary}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reintentar</span>
        </button>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  // Check if plan has no permissions
  if (
    dashboardData.dashboard_type !== 'super_admin' &&
    dashboardData.plan &&
    dashboardData.effective_permissions.length === 0
  ) {
    return <NoPermissionsState planName={dashboardData.plan.name} />;
  }

  // Render experience according to dynamic dashboard_type resolved by Laravel
  switch (dashboardData.dashboard_type) {
    case 'super_admin':
      return <SuperAdminDashboard data={dashboardData} isLoading={isLoading} />;
    case 'white_label_admin':
      return <WhiteLabelDashboard data={dashboardData} isLoading={isLoading} />;
    case 'agency_admin':
      return <AgencyAdminDashboard data={dashboardData} isLoading={isLoading} />;
    case 'agent':
    default:
      return <AgentDashboard data={dashboardData} isLoading={isLoading} />;
  }
};

export default DashboardPage;
