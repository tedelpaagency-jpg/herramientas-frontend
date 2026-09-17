'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import MyActivityDetailPage from '@/views/MyActivityDetailPage';

export default function MyActivityDetailRoutePage() {
  return (
    <ProtectedRoute>
      <Layout>
        <MyActivityDetailPage />
      </Layout>
    </ProtectedRoute>
  );
}
