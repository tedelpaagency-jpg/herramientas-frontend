'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { AgentPackageRequestsPage } from '@/views/AgentPackageRequestsPage';

export default function Page() {
  return (
    <ProtectedRoute>
      <Layout>
        <AgentPackageRequestsPage />
      </Layout>
    </ProtectedRoute>
  );
}
