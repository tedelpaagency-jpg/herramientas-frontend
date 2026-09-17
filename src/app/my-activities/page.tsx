'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import MyActivitiesPage from '@/views/MyActivitiesPage';

export default function MyActivitiesRoutePage() {
  return (
    <ProtectedRoute>
      <Layout>
        <MyActivitiesPage />
      </Layout>
    </ProtectedRoute>
  );
}
