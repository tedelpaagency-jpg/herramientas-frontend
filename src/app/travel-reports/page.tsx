'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import TravelReportsPage from '@/views/TravelReportsPage';

export default function TravelReportsRoutePage() {
  return (
    <ProtectedRoute>
      <Layout>
        <TravelReportsPage />
      </Layout>
    </ProtectedRoute>
  );
}
