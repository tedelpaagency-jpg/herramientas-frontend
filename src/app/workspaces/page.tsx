'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { WorkspacesPage } from '@/views/WorkspacesPage';

export default function WorkspacesRoute() {
  return (
    <ProtectedRoute>
      <Layout>
        <WorkspacesPage />
      </Layout>
    </ProtectedRoute>
  );
}
