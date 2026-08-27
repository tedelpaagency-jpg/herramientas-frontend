'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { AdminTravelPackagesPage } from '@/views/AdminTravelPackagesPage';

export default function Page() {
  return (
    <ProtectedRoute>
      <Layout>
        <AdminTravelPackagesPage />
      </Layout>
    </ProtectedRoute>
  );
}
