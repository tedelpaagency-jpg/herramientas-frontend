'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import SuperAdminRoute from '@/components/SuperAdminRoute';
import Layout from '@/components/Layout';
import { AdminSubscriptionsPage } from '@/views/admin/AdminSubscriptionsPage';

export default function AdminSubscriptionsRoute() {
  return (
    <ProtectedRoute>
      <SuperAdminRoute>
        <Layout>
          <AdminSubscriptionsPage />
        </Layout>
      </SuperAdminRoute>
    </ProtectedRoute>
  );
}
