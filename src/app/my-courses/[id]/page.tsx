'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import MyCourseDetailPage from '@/views/MyCourseDetailPage';

export default function MyCourseDetailRoutePage() {
  return (
    <ProtectedRoute>
      <Layout>
        <MyCourseDetailPage />
      </Layout>
    </ProtectedRoute>
  );
}
