'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import UsersPage from '@/views/UsersPage';

export default function UsersRoutePage() {
  return (
    <ProtectedRoute permission="manage_users">
      <Layout>
        <UsersPage />
      </Layout>
    </ProtectedRoute>
  );
}
