'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { MayoristaVisasDashboardPage } from '@/views/visas/MayoristaVisasDashboardPage';

export default function MayoristaVisasRoute() {
  return (
    <ProtectedRoute permission={['view_visas', 'visas.view']}>
      <Layout>
        <MayoristaVisasDashboardPage />
      </Layout>
    </ProtectedRoute>
  );
}
