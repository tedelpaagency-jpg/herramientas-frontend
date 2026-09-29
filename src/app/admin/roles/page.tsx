'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import RolesPage from '@/views/RolesPage';

export default function AdminRolesRoutePage() {
  return (
    <ProtectedRoute>
      <Layout>
        <RolesPage />
      </Layout>
    </ProtectedRoute>
  );
}
