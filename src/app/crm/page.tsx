'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { CrmKanbanPage } from '@/views/CrmKanbanPage';

export default function CrmRoute() {
  return (
    <ProtectedRoute permission={['view_crm', 'manage_crm']}>
      <Layout>
        <CrmKanbanPage />
      </Layout>
    </ProtectedRoute>
  );
}
