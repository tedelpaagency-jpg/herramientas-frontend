'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { ProductsPage } from '@/views/ProductsPage';

export default function ProductsRoute() {
  return (
    <ProtectedRoute>
      <Layout>
        <ProductsPage />
      </Layout>
    </ProtectedRoute>
  );
}
