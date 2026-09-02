'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import GamificationPage from '@/views/GamificationPage';

export default function GamificationRoute() {
  return (
    <ProtectedRoute>
      <Layout>
        <GamificationPage />
      </Layout>
    </ProtectedRoute>
  );
}
