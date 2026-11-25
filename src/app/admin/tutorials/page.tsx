'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import ModuleTutorialsAdminPage from '@/views/admin/ModuleTutorialsAdminPage';

export default function ModuleTutorialsAdminRoute() {
  return (
    <ProtectedRoute>
      <Layout>
        <ModuleTutorialsAdminPage />
      </Layout>
    </ProtectedRoute>
  );
}
