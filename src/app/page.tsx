'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import DashboardPage from '@/views/DashboardPage';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  const isHunter =
    user?.role === 'hunter' ||
    user?.role === 'comercio' ||
    user?.role === 'store' ||
    user?.roles?.some((r: any) => ['hunter', 'comercio', 'store'].includes(r.name));

  useEffect(() => {
    if (isHunter) {
      router.replace('/hunter');
    }
  }, [isHunter, router]);

  if (isHunter) {
    return null;
  }

  return (
    <ProtectedRoute>
      <Layout>
        <DashboardPage />
      </Layout>
    </ProtectedRoute>
  );
}
