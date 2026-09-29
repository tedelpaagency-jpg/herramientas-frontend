'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { MayoristaVisasDashboardPage } from '@/views/visas/MayoristaVisasDashboardPage';
import { AgencyVisasDashboardPage } from '@/views/visas/AgencyVisasDashboardPage';

export default function MayoristaVisasRoute() {
  const { user } = useAuth();

  const isMayorista = user?.role === 'super_admin' || 
    user?.role === 'white_label_admin' || 
    user?.roles?.some((r: any) => ['super_admin', 'white_label_admin', 'mayorista_supervisor', 'mayorista_operador'].includes(r.name));

  return (
    <ProtectedRoute permission={['view_visas', 'visas.view']}>
      <Layout>
        {isMayorista ? <MayoristaVisasDashboardPage /> : <AgencyVisasDashboardPage />}
      </Layout>
    </ProtectedRoute>
  );
}

