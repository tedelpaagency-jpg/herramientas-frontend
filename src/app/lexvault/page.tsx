'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { LexvaultPage } from '@/views/LexvaultPage';

export default function LexvaultRoute() {
  return (
    <ProtectedRoute>
      <Layout>
        <LexvaultPage />
      </Layout>
    </ProtectedRoute>
  );
}
