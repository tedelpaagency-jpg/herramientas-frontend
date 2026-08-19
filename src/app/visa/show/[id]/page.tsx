import { PublicVisaFormPage } from '@/views/PublicVisaFormPage';

interface PageProps {
  params: {
    id: string;
  };
}

export default function PublicVisaRoute({ params }: PageProps) {
  return <PublicVisaFormPage encodedId={params.id} />;
}
