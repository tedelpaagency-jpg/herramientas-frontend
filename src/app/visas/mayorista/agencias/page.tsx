'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { MayoristaAgenciesPage } from '@/views/visas/MayoristaAgenciesPage';

export default function MayoristaAgenciesRoute() {
  return (
    <ProtectedRoute permission={['view_visas', 'visas.view']}>
      <Layout>
        <MayoristaAgenciesPage />
      </Layout>
    </ProtectedRoute>
  );
}
