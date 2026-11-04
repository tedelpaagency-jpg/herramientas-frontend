'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import AdminGoogleSheetsPage from '@/views/admin/AdminGoogleSheetsPage';

export default function GoogleSheetsAdminRoute() {
  return (
    <ProtectedRoute permission={['manage_agencies', 'manage_plans']}>
      <Layout>
        <AdminGoogleSheetsPage />
      </Layout>
    </ProtectedRoute>
  );
}
