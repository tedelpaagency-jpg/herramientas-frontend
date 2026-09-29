'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { VisaGroupsPage } from '@/views/visas/VisaGroupsPage';

export default function VisaGroupsRoute() {
  return (
    <ProtectedRoute permission={['view_visas', 'visas.view']}>
      <Layout>
        <VisaGroupsPage />
      </Layout>
    </ProtectedRoute>
  );
}
