'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import HunterStoresPage from '@/views/HunterStoresPage';

export default function HunterRoute() {
  return (
    <ProtectedRoute>
      <Layout>
        <HunterStoresPage />
      </Layout>
    </ProtectedRoute>
  );
}
