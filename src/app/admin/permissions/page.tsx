'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import SuperAdminRoute from '@/components/SuperAdminRoute';
import Layout from '@/components/Layout';
import { AdminPermissionsPage } from '@/views/admin/AdminPermissionsPage';

export default function AdminPermissionsRoute() {
  return (
    <ProtectedRoute>
      <SuperAdminRoute>
        <Layout>
          <AdminPermissionsPage />
        </Layout>
      </SuperAdminRoute>
    </ProtectedRoute>
  );
}
