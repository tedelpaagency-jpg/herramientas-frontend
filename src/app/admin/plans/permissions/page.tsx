'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import PlanPermissionsPage from '@/views/admin/PlanPermissionsPage';

export default function PlanPermissionsQueryRoutePage() {
  return (
    <ProtectedRoute permission="manage_plans">
      <Layout>
        <PlanPermissionsPage />
      </Layout>
    </ProtectedRoute>
  );
}
