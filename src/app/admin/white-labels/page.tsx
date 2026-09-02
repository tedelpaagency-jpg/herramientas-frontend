'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import SuperAdminRoute from '@/components/SuperAdminRoute';
import Layout from '@/components/Layout';
import { WhiteLabelsPage } from '@/views/admin/WhiteLabelsPage';

export default function AdminWhiteLabelsRoute() {
  return (
    <ProtectedRoute>
      <SuperAdminRoute>
        <Layout>
          <WhiteLabelsPage />
        </Layout>
      </SuperAdminRoute>
    </ProtectedRoute>
  );
}
