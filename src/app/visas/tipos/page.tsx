'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { VisaProcessTypesPage } from '@/views/visas/VisaProcessTypesPage';

export default function VisaProcessTypesRoute() {
  return (
    <ProtectedRoute permission={['view_visas', 'visas.view', 'visas.processes.manage', 'manage_visas']}>
      <Layout>
        <VisaProcessTypesPage />
      </Layout>
    </ProtectedRoute>
  );
}
