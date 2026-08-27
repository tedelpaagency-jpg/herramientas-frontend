'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { SupplierPackageRequestsPage } from '@/views/SupplierPackageRequestsPage';

export default function Page() {
  return (
    <ProtectedRoute>
      <Layout>
        <SupplierPackageRequestsPage />
      </Layout>
    </ProtectedRoute>
  );
}
