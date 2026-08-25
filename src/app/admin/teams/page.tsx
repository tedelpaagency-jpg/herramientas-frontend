'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import AgencyTeamsPage from '@/views/AgencyTeamsPage';

export default function AgencyTeamsRoutePage() {
  return (
    <ProtectedRoute>
      <Layout>
        <AgencyTeamsPage />
      </Layout>
    </ProtectedRoute>
  );
}
