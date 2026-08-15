'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import LandingsPage from '@/views/LandingsPage';

export default function LandingsRoutePage() {
  return (
    <ProtectedRoute>
      <Layout>
        <LandingsPage />
      </Layout>
    </ProtectedRoute>
  );
}
