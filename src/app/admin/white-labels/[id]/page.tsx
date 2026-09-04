'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import SuperAdminRoute from '@/components/SuperAdminRoute';
import Layout from '@/components/Layout';
import WhiteLabelDetailPage from '@/views/admin/WhiteLabelDetailPage';

export default function WhiteLabelDetailRoute() {
  return (
    <ProtectedRoute>
      <SuperAdminRoute allowWhiteLabelAdmin={false}>
        <Layout>
          <WhiteLabelDetailPage />
        </Layout>
      </SuperAdminRoute>
    </ProtectedRoute>
  );
}
