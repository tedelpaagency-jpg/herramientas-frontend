'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { WhiteLabelStudentImportPage } from '@/views/white-label/WhiteLabelStudentImportPage';

export default function WhiteLabelStudentImportRoute() {
  return (
    <ProtectedRoute>
      <Layout>
        <WhiteLabelStudentImportPage />
      </Layout>
    </ProtectedRoute>
  );
}
