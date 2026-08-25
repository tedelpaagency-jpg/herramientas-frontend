'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import CommissionsPage from '@/views/CommissionsPage';

export default function CommissionsRoutePage() {
  return (
    <ProtectedRoute>
      <Layout>
        <CommissionsPage />
      </Layout>
    </ProtectedRoute>
  );
}
