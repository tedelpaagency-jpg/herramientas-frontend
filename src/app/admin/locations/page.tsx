'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import EstateCatalogManagementView from '@/components/admin/EstateCatalogManagementView';

export default function AdminLocationsPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="p-4 sm:p-6 space-y-6">
          <EstateCatalogManagementView />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

