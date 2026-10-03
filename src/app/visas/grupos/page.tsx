'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VisaGroupsRoute() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/visas/mayorista');
  }, [router]);

  return null;
}
