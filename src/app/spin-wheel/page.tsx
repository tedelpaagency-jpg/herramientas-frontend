'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { SpinWheelPage } from '@/views/SpinWheelPage';

export default function SpinWheelRoute() {
  return (
    <ProtectedRoute>
      <Layout>
        <SpinWheelPage />
      </Layout>
    </ProtectedRoute>
  );
}
