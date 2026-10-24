'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import PortalInmobiliarioStudioView from '@/views/admin/PortalInmobiliarioStudioView';

export default function AdminPortalInmobiliarioPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <PortalInmobiliarioStudioView />
      </Layout>
    </ProtectedRoute>
  );
}
