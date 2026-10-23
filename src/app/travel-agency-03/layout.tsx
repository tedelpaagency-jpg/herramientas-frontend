import React from 'react';
import type { Metadata } from 'next';
import { poppins, roboto, courgette } from '@/fonts/font';
import ClientRoot from '@/components/ClientRoot';

// GoFly Travel Agency 03 Stylesheets
import '../../../public/assets/css/bootstrap.min.css';
import '../../../public/assets/css/bootstrap-icons.css';
import '../../../public/assets/css/animate.min.css';
import '../../../public/assets/css/swiper-bundle.min.css';
import '../../../public/assets/css/nice-select.css';
import '../../../public/assets/css/boxicons.min.css';
import '../../../public/assets/css/style.css';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-video.css';

export const metadata: Metadata = {
  title: 'Gofly - Tour & Travel Booking Website',
  description: 'Travel Agency 03 - Portal Inmobiliario',
};

export default function TravelAgency03Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`travel-agency-03-root ${poppins.variable} ${roboto.variable} ${courgette.variable}`}>
      <ClientRoot>{children}</ClientRoot>
    </div>
  );
}
