'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import AppointmentsView from '@/views/appointments/AppointmentsView';

export default function AppointmentsPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <AppointmentsView />
      </Layout>
    </ProtectedRoute>
  );
}

