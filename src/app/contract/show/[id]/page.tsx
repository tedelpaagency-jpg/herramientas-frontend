'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { PublicContractSignPage } from '@/views/PublicContractSignPage';

export default function ContractShowPage() {
  const params = useParams();
  const idStr = Array.isArray(params?.id) ? params.id[0] : params?.id || '';

  return <PublicContractSignPage id={idStr} />;
}
