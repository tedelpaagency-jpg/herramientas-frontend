'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { AdminAgenciesPage } from '@/views/admin/AdminAgenciesPage';

export default function AgenciesRoute() {
  return (
    <ProtectedRoute>
      <Layout>
        <AdminAgenciesPage />
      </Layout>
    </ProtectedRoute>
  );
}
