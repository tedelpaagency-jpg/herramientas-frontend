'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import UserProfilePage from '@/views/UserProfilePage';

export default function ProfileRoute() {
  return (
    <ProtectedRoute>
      <Layout>
        <UserProfilePage />
      </Layout>
    </ProtectedRoute>
  );
}
