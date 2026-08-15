'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import MarketingPage from '@/views/MarketingPage';

export default function MarketingRoutePage() {
  return (
    <ProtectedRoute>
      <Layout>
        <MarketingPage />
      </Layout>
    </ProtectedRoute>
  );
}
