'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import ActivityAdminRoute from '@/components/ActivityAdminRoute';
import Layout from '@/components/Layout';
import ActivityGroupFormPage from '@/views/ActivityGroupFormPage';

export default function CreateActivityGroupRoutePage() {
  return (
    <ProtectedRoute>
      <ActivityAdminRoute>
        <Layout>
          <ActivityGroupFormPage />
        </Layout>
      </ActivityAdminRoute>
    </ProtectedRoute>
  );
}
