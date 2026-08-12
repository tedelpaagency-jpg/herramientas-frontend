'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import SuperAdminRoute from '@/components/SuperAdminRoute';
import Layout from '@/components/Layout';
import { AdminAgenciesPage } from '@/views/admin/AdminAgenciesPage';

export default function AdminAgenciesRoute() {
  return (
    <ProtectedRoute>
      <Layout>
        <AdminAgenciesPage />
      </Layout>
    </ProtectedRoute>
  );
}
