'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { EstateTemplatesManagementView } from '@/views/admin/EstateTemplatesManagementView';

export default function AdminEstateTemplatesPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <EstateTemplatesManagementView />
      </Layout>
    </ProtectedRoute>
  );
}

