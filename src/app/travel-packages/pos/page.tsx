'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { TripBuilderPage } from '@/views/TripBuilderPage';

export default function Page() {
  return (
    <ProtectedRoute>
      <Layout>
        <TripBuilderPage />
      </Layout>
    </ProtectedRoute>
  );
}
