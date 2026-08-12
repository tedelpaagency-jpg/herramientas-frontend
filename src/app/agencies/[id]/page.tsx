'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import AgencyDetailPage from '@/views/AgencyDetailPage';
import { useParams } from 'next/navigation';

export default function AgencyDetailRoutePage() {
  const params = useParams();
  const agencyId = Number(params.id);

  return (
    <ProtectedRoute>
      <Layout>
        <AgencyDetailPage agencyId={agencyId} />
      </Layout>
    </ProtectedRoute>
  );
}
