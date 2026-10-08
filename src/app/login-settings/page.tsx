'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import LoginSettingsPage from '@/views/admin/LoginSettingsPage';

export default function LoginSettingsDirectRoute() {
  return (
    <ProtectedRoute>
      <Layout>
        <LoginSettingsPage />
      </Layout>
    </ProtectedRoute>
  );
}
