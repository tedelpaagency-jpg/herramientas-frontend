'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import AdminShortcutsPage from '@/views/admin/AdminShortcutsPage';

export default function ShortcutsAdminRoute() {
  return (
    <ProtectedRoute permission={['manage_agencies', 'custom_agency_branding', 'manage_plans']}>
      <Layout>
        <AdminShortcutsPage />
      </Layout>
    </ProtectedRoute>
  );
}
