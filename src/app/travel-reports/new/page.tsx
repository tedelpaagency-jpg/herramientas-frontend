'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import TravelReportFormPage from '@/views/TravelReportFormPage';

export default function TravelReportNewRoutePage() {
  return (
    <ProtectedRoute>
      <Layout>
        <TravelReportFormPage />
      </Layout>
    </ProtectedRoute>
  );
}
