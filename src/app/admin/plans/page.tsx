'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import SuperAdminRoute from '@/components/SuperAdminRoute';
import Layout from '@/components/Layout';
import { AdminPlansPage } from '@/views/admin/AdminPlansPage';

export default function AdminPlansRoute() {
  return (
    <ProtectedRoute>
      <SuperAdminRoute>
        <Layout>
          <AdminPlansPage />
        </Layout>
      </SuperAdminRoute>
    </ProtectedRoute>
  );
}
