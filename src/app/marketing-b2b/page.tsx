'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import MarketingB2BPage from '@/views/MarketingB2BPage';

export default function MarketingB2BRoutePage() {
  return (
    <ProtectedRoute>
      <Layout>
        <MarketingB2BPage />
      </Layout>
    </ProtectedRoute>
  );
}
