'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import ModuleTutorialsAdminPage from '@/views/admin/ModuleTutorialsAdminPage';

export default function ModuleTutorialsAdminRoute() {
  return (
    <ProtectedRoute permission={['manage_agencies', 'custom_agency_branding', 'manage_plans']}>
      <Layout>
        <ModuleTutorialsAdminPage />
      </Layout>
    </ProtectedRoute>
  );
}
