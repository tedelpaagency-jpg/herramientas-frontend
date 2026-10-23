import React from 'react';
import AboutV4 from '@/components/about-page-component/AboutV4';
import BlogV4 from '@/components/blog/BlogV4';
import CounterV4 from '@/components/counter-section/CounterV4';
import DestinationSectionV4 from '@/components/destination-section/DestinationSectionV4';
import FaqV4 from '@/components/faq-section/FaqV4';
import FeatureSectionV4 from '@/components/feature-section/FeatureSectionV4';
import HeroV4 from '@/components/hero-section/HeroV4';
import Footer from '@/components/layout/Footer';
import Header2Style3 from '@/components/layout/Header2Style3';
import OfferbannerV4 from '@/components/offer-section/OfferbannerV4';
import Partner from '@/components/Partner';
import TestimonialV4 from '@/components/testimonial-section/TestimonialV4';
import TopbarSlider from '@/components/topbar/TopbarSlider';
import TravelPackageV4 from '@/components/travel-package-section/TravelPackageV4';
import WhyChooseUsV4 from '@/components/why-choose-us-section/WhyChooseUsV4';

export default function TravelAgency03Page() {
  return (
    <>
      <TopbarSlider />
      <Header2Style3 />
      <HeroV4 />
      <Partner />
      <FeatureSectionV4 />
      <DestinationSectionV4 />
      <AboutV4 />
      <TravelPackageV4 />
      <OfferbannerV4 />
      <WhyChooseUsV4 />
      <TestimonialV4 />
      <CounterV4 />
      <BlogV4 />
      <FaqV4 />
      <Footer />
    </>
  );
}
