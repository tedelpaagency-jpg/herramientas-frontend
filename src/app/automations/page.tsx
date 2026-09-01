'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import AutomationsPage from '@/views/AutomationsPage';

export default function AutomationsRoute() {
  return (
    <ProtectedRoute>
      <Layout>
        <AutomationsPage />
      </Layout>
    </ProtectedRoute>
  );
}
