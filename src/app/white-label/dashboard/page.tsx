'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { WhiteLabelDashboardPage } from '@/views/white-label/WhiteLabelDashboardPage';

export default function WhiteLabelDashboardRoute() {
  return (
    <ProtectedRoute>
      <Layout>
        <WhiteLabelDashboardPage />
      </Layout>
    </ProtectedRoute>
  );
}
