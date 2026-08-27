'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { SupplierPackagesPage } from '@/views/SupplierPackagesPage';

export default function Page() {
  return (
    <ProtectedRoute>
      <Layout>
        <SupplierPackagesPage />
      </Layout>
    </ProtectedRoute>
  );
}
