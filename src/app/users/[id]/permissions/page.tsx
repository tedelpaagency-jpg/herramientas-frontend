'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import UserPermissionsPage from '@/views/UserPermissionsPage';

export default function UserPermissionsIdRoutePage() {
  return (
    <ProtectedRoute permission="manage_users">
      <Layout>
        <UserPermissionsPage />
      </Layout>
    </ProtectedRoute>
  );
}
