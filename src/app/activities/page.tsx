'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import ActivityAdminRoute from '@/components/ActivityAdminRoute';
import Layout from '@/components/Layout';
import ActivitiesPage from '@/views/ActivitiesPage';

export default function ActivitiesAdminRoutePage() {
  return (
    <ProtectedRoute>
      <ActivityAdminRoute>
        <Layout>
          <ActivitiesPage />
        </Layout>
      </ActivityAdminRoute>
    </ProtectedRoute>
  );
}
