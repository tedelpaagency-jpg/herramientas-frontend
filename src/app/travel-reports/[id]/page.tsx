'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import TravelReportDetailPage from '@/views/TravelReportDetailPage';

export default function TravelReportDetailRoutePage() {
  return (
    <ProtectedRoute>
      <Layout>
        <TravelReportDetailPage />
      </Layout>
    </ProtectedRoute>
  );
}
