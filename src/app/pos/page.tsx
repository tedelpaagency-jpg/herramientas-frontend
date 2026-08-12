'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { PosPage } from '@/views/PosPage';

export default function PosRoute() {
  return (
    <ProtectedRoute>
      <Layout>
        <PosPage />
      </Layout>
    </ProtectedRoute>
  );
}
