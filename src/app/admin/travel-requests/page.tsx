'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { AdminTravelRequestsPage } from '@/views/AdminTravelRequestsPage';

export default function Page() {
  return (
    <ProtectedRoute>
      <Layout>
        <AdminTravelRequestsPage />
      </Layout>
    </ProtectedRoute>
  );
}
